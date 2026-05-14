/**
 * TitleBar — KNA Agent v0.4.0 chrome
 *
 * Renders the top 38px row of the `.kna-app` grid using the
 * `.kna-tbar` utility class from the v0.4.0 design system.
 *
 * Platform behaviour:
 *   - macOS  : empty drag region on the left so Electron's hiddenInset
 *              window style can draw its native traffic lights. We
 *              reserve ~70px of padding for them via `.kna-tlights-spacer`.
 *   - Windows: custom minimize / maximize / close controls on the right,
 *              same custom set as v0.3.x.
 *   - Linux  : native window frame; this bar still renders so the
 *              breadcrumb is consistent across platforms.
 *
 * Sidebar toggle (PanelLeft) sits immediately after the spacer so a
 * one-click collapse from anywhere on the app surface is reachable
 * without right-clicking the sidebar. Breadcrumb follows. Update chip
 * pins to the right via `.upd` (coral wash when an update is available).
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PanelLeft, PanelLeftClose, Minus, Square, X, Copy } from 'lucide-react';
import { invokeIpc } from '@/lib/api-client';
import { useSettingsStore } from '@/stores/settings';

/**
 * Map the current route into a 2-segment crumb shown in the title bar.
 * The second segment is the page label (localised via i18n).
 */
function useRouteCrumb(): string[] {
  const { pathname } = useLocation();
  const { t } = useTranslation('common', { useSuspense: false });

  const second = (() => {
    if (pathname === '/' || pathname === '/chat') return t('sidebar.chat', { defaultValue: 'Chat' });
    if (pathname.startsWith('/models'))   return t('sidebar.models',     { defaultValue: 'Models' });
    if (pathname.startsWith('/agents'))   return t('sidebar.agents',     { defaultValue: 'Agents' });
    if (pathname.startsWith('/channels')) return t('sidebar.channels',   { defaultValue: 'Channels' });
    if (pathname.startsWith('/skills'))   return t('sidebar.skills',     { defaultValue: 'Skills' });
    if (pathname.startsWith('/cron'))     return t('sidebar.cronTasks',  { defaultValue: 'Scheduled' });
    if (pathname.startsWith('/settings')) return t('sidebar.settings',   { defaultValue: 'Settings' });
    if (pathname.startsWith('/dreams'))   return t('sidebar.openClawDreams', { defaultValue: 'Dreams' });
    return '';
  })();

  return second ? ['KNA Agent', second] : ['KNA Agent'];
}

export function TitleBar() {
  const platform = window.electron?.platform;
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useSettingsStore((s) => s.setSidebarCollapsed);
  const crumb = useRouteCrumb();

  return (
    <div className="kna-tbar drag-region">
      {/* macOS traffic light spacer (native lights are drawn by Electron
          via hiddenInset; reserve room so the rest of the bar doesn't
          overlap them). Hidden on other platforms. */}
      {platform === 'darwin' && (
        <span className="kna-tlights" aria-hidden="true" style={{ visibility: 'hidden', width: 60 }}>
          <span className="kna-tlight r" />
          <span className="kna-tlight y" />
          <span className="kna-tlight g" />
        </span>
      )}

      {/* Sidebar toggle */}
      <button
        type="button"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="no-drag"
        title={sidebarCollapsed ? '展开侧栏' : '收起侧栏'}
        aria-label="Toggle sidebar"
        style={{
          background: 'transparent',
          border: 0,
          color: 'var(--kna-muted)',
          padding: 4,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {sidebarCollapsed
          ? <PanelLeft size={16} strokeWidth={1.7} />
          : <PanelLeftClose size={16} strokeWidth={1.7} />}
      </button>

      {/* Breadcrumb */}
      <div className="crumb">
        {crumb.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {i > 0 && <span className="sep">/</span>}
            {i === crumb.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </span>
        ))}
      </div>

      <span style={{ flex: 1 }} />

      {/* Windows custom window controls (no-drag so they receive clicks).
          macOS uses native traffic lights via hiddenInset; Linux uses the
          system window frame and never reaches this branch. */}
      {platform === 'win32' && <WindowsControls />}
    </div>
  );
}

function WindowsControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    invokeIpc('window:isMaximized').then((val) => setMaximized(val as boolean));
  }, []);

  const onMin = () => invokeIpc('window:minimize');
  const onMax = () =>
    invokeIpc('window:maximize').then(() =>
      invokeIpc('window:isMaximized').then((val) => setMaximized(val as boolean))
    );
  const onClose = () => invokeIpc('window:close');

  return (
    <div className="no-drag" style={{ display: 'flex', height: '100%' }}>
      <button
        onClick={onMin}
        title="Minimize"
        style={{ width: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--kna-muted)' }}
      >
        <Minus size={14} />
      </button>
      <button
        onClick={onMax}
        title={maximized ? 'Restore' : 'Maximize'}
        style={{ width: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--kna-muted)' }}
      >
        {maximized ? <Copy size={13} /> : <Square size={13} />}
      </button>
      <button
        onClick={onClose}
        title="Close"
        className="kna-tbar-close"
        style={{ width: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--kna-muted)' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
