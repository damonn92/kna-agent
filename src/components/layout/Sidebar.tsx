/**
 * Sidebar Component
 * Navigation sidebar with menu items.
 * No longer fixed - sits inside the flex layout below the title bar.
 */
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Network,
  Bot,
  Puzzle,
  Clock,
  Settings as SettingsIcon,
  Plus,
  Terminal,
  ExternalLink,
  Trash2,
  Cpu,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { rendererExtensionRegistry } from '@/extensions/registry';
import { useSettingsStore } from '@/stores/settings';
import { useChatStore } from '@/stores/chat';
import { useGatewayStore } from '@/stores/gateway';
import { useAgentsStore } from '@/stores/agents';
import { getSessionActivityMs, getSessionBucket, type SessionBucketKey } from './session-buckets';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { hostApiFetch } from '@/lib/host-api';
import { useTranslation } from 'react-i18next';
import { KnaBalanceBar } from './KnaBalanceBar';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  collapsed?: boolean;
  onClick?: () => void;
  testId?: string;
}

function NavItem({ to, icon, label, badge, collapsed, onClick, testId }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      data-testid={testId}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn('kna-sb-item', isActive && 'active', collapsed && 'is-collapsed')
      }
    >
      <span className="ico">{icon}</span>
      {!collapsed && <span>{label}</span>}
      {!collapsed && badge && <span className="badge">{badge}</span>}
    </NavLink>
  );
}

const INITIAL_NOW_MS = Date.now();

function getAgentIdFromSessionKey(sessionKey: string): string {
  if (!sessionKey.startsWith('agent:')) return 'main';
  const [, agentId] = sessionKey.split(':');
  return agentId || 'main';
}

export function Sidebar() {
  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed);
  // setSidebarCollapsed now lives on the TitleBar (global app shell toggle).
  const devModeUnlocked = useSettingsStore((state) => state.devModeUnlocked);

  const sessions = useChatStore((s) => s.sessions);
  const currentSessionKey = useChatStore((s) => s.currentSessionKey);
  const sessionLabels = useChatStore((s) => s.sessionLabels);
  const sessionLastActivity = useChatStore((s) => s.sessionLastActivity);
  const switchSession = useChatStore((s) => s.switchSession);
  const newSession = useChatStore((s) => s.newSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const loadSessions = useChatStore((s) => s.loadSessions);
  const loadHistory = useChatStore((s) => s.loadHistory);

  const gatewayStatus = useGatewayStore((s) => s.status);
  const isGatewayRunning = gatewayStatus.state === 'running';
  const isGatewayReady = isGatewayRunning && gatewayStatus.gatewayReady !== false;

  useEffect(() => {
    if (!isGatewayReady) return;
    let cancelled = false;
    const hasExistingMessages = useChatStore.getState().messages.length > 0;
    (async () => {
      await Promise.allSettled([
        loadSessions(),
        loadHistory(hasExistingMessages),
      ]);
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [isGatewayReady, loadHistory, loadSessions]);
  const agents = useAgentsStore((s) => s.agents);
  const fetchAgents = useAgentsStore((s) => s.fetchAgents);

  const navigate = useNavigate();
  const isOnChat = useLocation().pathname === '/';

  const getSessionLabel = (key: string, displayName?: string, label?: string) =>
    sessionLabels[key] ?? label ?? displayName ?? key;

  const openControlUi = async (path: string, label: string) => {
    try {
      const result = await hostApiFetch<{
        success: boolean;
        url?: string;
        error?: string;
      }>(path);
      if (result.success && result.url) {
        await window.electron.openExternal(result.url);
      } else {
        console.error(`Failed to get ${label} URL:`, result.error);
      }
    } catch (err) {
      console.error(`Error opening ${label}:`, err);
    }
  };

  const openDevConsole = async () => {
    await openControlUi('/api/gateway/control-ui', 'OpenClaw Page');
  };

  const { t } = useTranslation(['common', 'chat']);
  const [sessionToDelete, setSessionToDelete] = useState<{ key: string; label: string } | null>(null);
  const [nowMs, setNowMs] = useState(INITIAL_NOW_MS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    void fetchAgents();
  }, [fetchAgents]);

  const agentNameById = useMemo(
    () => Object.fromEntries((agents ?? []).map((agent) => [agent.id, agent.name])),
    [agents],
  );
  const sessionBuckets: Array<{ key: SessionBucketKey; label: string; sessions: typeof sessions }> = [
    { key: 'today', label: t('chat:historyBuckets.today'), sessions: [] },
    { key: 'yesterday', label: t('chat:historyBuckets.yesterday'), sessions: [] },
    { key: 'withinWeek', label: t('chat:historyBuckets.withinWeek'), sessions: [] },
    { key: 'withinTwoWeeks', label: t('chat:historyBuckets.withinTwoWeeks'), sessions: [] },
    { key: 'withinMonth', label: t('chat:historyBuckets.withinMonth'), sessions: [] },
    { key: 'older', label: t('chat:historyBuckets.older'), sessions: [] },
  ];
  const sessionBucketMap = Object.fromEntries(sessionBuckets.map((bucket) => [bucket.key, bucket])) as Record<
    SessionBucketKey,
    (typeof sessionBuckets)[number]
  >;

  for (const { session, activityMs } of sessions
    .map((session) => ({
      session,
      activityMs: getSessionActivityMs(session, sessionLastActivity),
    }))
    .sort((a, b) => b.activityMs - a.activityMs)) {
    const bucketKey = getSessionBucket(activityMs, nowMs);
    sessionBucketMap[bucketKey].sessions.push(session);
  }

  const hiddenRoutes = rendererExtensionRegistry.getHiddenRoutes();
  const extraNavItems = rendererExtensionRegistry.getExtraNavItems();

  const coreNavItems = [
    { to: '/models', icon: <Cpu className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('sidebar.models'), testId: 'sidebar-nav-models' },
    { to: '/agents', icon: <Bot className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('sidebar.agents'), testId: 'sidebar-nav-agents' },
    { to: '/channels', icon: <Network className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('sidebar.channels'), testId: 'sidebar-nav-channels' },
    { to: '/skills', icon: <Puzzle className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('sidebar.skills'), testId: 'sidebar-nav-skills' },
    { to: '/cron', icon: <Clock className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('sidebar.cronTasks'), testId: 'sidebar-nav-cron' },
    ...(devModeUnlocked
      ? [{ to: '/dreams', icon: <Moon className="h-[18px] w-[18px]" strokeWidth={2} />, label: t('common:sidebar.openClawDreams'), testId: 'sidebar-nav-dreams' }]
      : []),
  ];

  const navItems = [
    ...coreNavItems.filter((item) => !hiddenRoutes.has(item.to)),
    ...extraNavItems.map((item) => ({
      to: item.to,
      icon: <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />,
      label: item.labelI18nKey ? t(item.labelI18nKey) : item.label,
      testId: item.testId,
    })),
  ];

  return (
    <aside data-testid="sidebar" className="kna-sb">
      {/* Brand block — coral K mark + serif "KNA Agent" + version tag.
          Toggle button moved to the global TitleBar so it's reachable
          from anywhere in the app, not just inside the sidebar. */}
      <div className="kna-sb-brand">
        <div className="mark">K</div>
        {!sidebarCollapsed && (
          <div style={{ minWidth: 0 }}>
            <div className="name">KNA Agent</div>
            <div className="ver">v0.4.0 · BETA</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="kna-sb-nav">
        {!sidebarCollapsed && <div className="kna-sb-group">工作台</div>}
        <button
          data-testid="sidebar-new-chat"
          onClick={() => {
            const { messages } = useChatStore.getState();
            if (messages.length > 0) newSession();
            navigate('/');
          }}
          className={cn('kna-sb-item', sidebarCollapsed && 'is-collapsed')}
          title={sidebarCollapsed ? t('sidebar.newChat') : undefined}
          style={{
            background: 'transparent',
            border: 0,
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            marginBottom: 6,
          }}
        >
          <span className="ico"><Plus className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>
          {!sidebarCollapsed && <span>{t('sidebar.newChat')}</span>}
          {!sidebarCollapsed && (
            <span className="kbd" style={{ marginLeft: 'auto' }}>⌘N</span>
          )}
        </button>

        {navItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />
        ))}

      {/* Session list — pulled inline into the same scrollable .kna-sb-nav
          so the whole left rail scrolls as one column. Group labels use
          the same .kna-sb-group style as the top "工作台" header. */}
      {!sidebarCollapsed && sessions.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {sessionBuckets.map((bucket) => (
            bucket.sessions.length > 0 ? (
              <div key={bucket.key} data-testid={`session-bucket-${bucket.key}`}>
                <div className="kna-sb-group">
                  {bucket.label}
                </div>
                {bucket.sessions.map((s) => {
                  const agentId = getAgentIdFromSessionKey(s.key);
                  const agentName = agentNameById[agentId] || agentId;
                  return (
                    <div key={s.key} className="group relative flex items-center">
                      <button
                        onClick={() => { switchSession(s.key); navigate('/'); }}
                        className={cn(
                          'w-full text-left rounded-lg px-2.5 py-1.5 text-meta transition-colors pr-7',
                          'hover:bg-black/5 dark:hover:bg-white/5',
                          isOnChat && currentSessionKey === s.key
                            ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium'
                            : 'text-foreground/75',
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 rounded-full bg-black/[0.04] px-2 py-0.5 text-2xs font-medium text-foreground/70 dark:bg-white/[0.08]">
                            {agentName}
                          </span>
                          <span className="truncate">{getSessionLabel(s.key, s.displayName, s.label)}</span>
                        </div>
                      </button>
                      <button
                        aria-label="Delete session"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete({
                            key: s.key,
                            label: getSessionLabel(s.key, s.displayName, s.label),
                          });
                        }}
                        className={cn(
                          'absolute right-1 flex items-center justify-center rounded p-0.5 transition-opacity',
                          'opacity-0 group-hover:opacity-100',
                          'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null
          ))}
        </div>
      )}

      </div>{/* end .kna-sb-nav */}

      {/* Sidebar foot — Settings link + KNA balance pill. Always
          pinned to the bottom thanks to .kna-sb-nav's flex:1. */}
      <div className="kna-sb-foot" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border)' }}>
        <NavLink
          to="/settings"
          data-testid="sidebar-nav-settings"
          title={sidebarCollapsed ? t('sidebar.settings') : undefined}
          className={({ isActive }) =>
            cn('kna-sb-item', isActive && 'active', sidebarCollapsed && 'is-collapsed')
          }
        >
          <span className="ico"><SettingsIcon className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>
          {!sidebarCollapsed && <span>{t('sidebar.settings')}</span>}
        </NavLink>

        {devModeUnlocked && (
          <Button
            data-testid="sidebar-open-dev-console"
            variant="ghost"
            className={cn('kna-sb-item', sidebarCollapsed && 'is-collapsed')}
            onClick={openDevConsole}
            style={{ height: 'auto', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: '7.5px 10px' }}
          >
            <span className="ico"><Terminal className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>
            {!sidebarCollapsed && (
              <>
                <span>{t('common:sidebar.openClawPage')}</span>
                <ExternalLink className="h-3 w-3 shrink-0 ml-auto opacity-50 text-muted-foreground" />
              </>
            )}
          </Button>
        )}

        {/* Balance / SSO pill — coral-wash card with email + ¥/$ balance
            + 充值 button, or a single coral CTA when not yet signed in.
            Hidden when sidebar is collapsed (just an avatar dot would
            be ambiguous; user can expand to manage account). */}
        {!sidebarCollapsed && <KnaBalanceBar variant="sidebar" />}
      </div>

      <ConfirmDialog
        open={!!sessionToDelete}
        title={t('common:actions.confirm')}
        message={t('common:sidebar.deleteSessionConfirm', { label: sessionToDelete?.label })}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        variant="destructive"
        onConfirm={async () => {
          if (!sessionToDelete) return;
          await deleteSession(sessionToDelete.key);
          if (currentSessionKey === sessionToDelete.key) navigate('/');
          setSessionToDelete(null);
        }}
        onCancel={() => setSessionToDelete(null)}
      />
    </aside>
  );
}
