/**
 * ChatRightRail — KNA Agent v0.4.0 chat context column
 *
 * 264-px right column shown next to the chat stream on desktop when the
 * artifact preview panel is closed.  Mirrors the v0.4.0 design source:
 *
 *   ┌──────────────────────┐
 *   │ 当前 Agent            │  ← coral disc avatar + name + meta
 *   ├──────────────────────┤
 *   │ 模型                  │  ← mono model id + via KNA pill
 *   ├──────────────────────┤
 *   │ 已启用技能 (n)        │  ← per-skill pill with coral dot
 *   │   + 添加技能          │
 *   ├──────────────────────┤
 *   │ 输入 tokens   3,184   │  ← session token meter
 *   │ 输出 tokens   1,902   │
 *   └──────────────────────┘
 *
 * Token figures stay as em-dashes until the gateway surfaces usage to
 * the renderer (deferred to a later phase) — the slot is reserved so
 * the rail layout doesn't reflow when we wire it up.
 *
 * Hidden below `lg` to keep the chat stream legible on narrow windows
 * (parent <Chat /> also withholds the rail when the artifact panel is
 * open, so both columns aren't fighting for the right slot).
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Plus } from 'lucide-react';
import { useAgentsStore } from '@/stores/agents';
import { useChatStore } from '@/stores/chat';
import { useSkillsStore } from '@/stores/skills';

/**
 * Derive a one-character serif glyph for an agent avatar.  Prefer the
 * first non-ASCII codepoint (catches CJK and emoji), fall back to the
 * first ASCII letter, and finally to "K" for the default KNA brand mark.
 */
function avatarGlyph(name: string): string {
  for (const ch of name) {
    const cp = ch.codePointAt(0);
    if (cp != null && cp > 0x7f) return ch;
  }
  for (const ch of name) {
    if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase();
  }
  return 'K';
}

export function ChatRightRail() {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const currentAgentId = useChatStore((s) => s.currentAgentId);
  const agents = useAgentsStore((s) => s.agents);
  const skills = useSkillsStore((s) => s.skills);

  const currentAgent = useMemo(
    () => (agents ?? []).find((a) => a.id === currentAgentId) ?? null,
    [agents, currentAgentId],
  );

  const enabledSkills = useMemo(
    () => (skills ?? []).filter((s) => s.enabled),
    [skills],
  );

  // Show up to 6 skills inline; the rest are summarized in a "+N more" row.
  const skillsLimit = 6;
  const visibleSkills = enabledSkills.slice(0, skillsLimit);
  const hiddenSkillCount = Math.max(0, enabledSkills.length - skillsLimit);

  const agentName = currentAgent?.name ?? t('rail.unknownAgent', { defaultValue: '未配置' });
  const modelLabel =
    currentAgent?.modelDisplay
    ?? currentAgent?.modelRef
    ?? t('rail.modelDefault', { defaultValue: '默认模型' });
  const agentSubtitle = currentAgent?.isDefault
    ? t('rail.agentDefault', { defaultValue: '默认 · 自动路由' })
    : t('rail.agentCustom', { defaultValue: '自定义 Agent' });

  return (
    <aside
      data-testid="chat-right-rail"
      className="hidden lg:flex shrink-0 flex-col"
      style={{
        width: 264,
        borderLeft: '1px solid var(--kna-border)',
        background: 'var(--cream-card, var(--card))',
        padding: '16px 16px 14px',
        gap: 16,
        minHeight: 0,
        overflowY: 'auto',
      }}
    >
      {/* Current Agent */}
      <section>
        <div className="lbl-tiny" style={{ marginBottom: 8 }}>
          {t('rail.currentAgent', { defaultValue: '当前 Agent' })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 10,
            background: 'var(--paper, #fff)',
            border: '1px solid var(--kna-border)',
            borderRadius: 10,
          }}
        >
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'var(--coral, hsl(var(--primary)))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: 15,
              flex: '0 0 auto',
            }}
          >
            {avatarGlyph(agentName)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--ink, hsl(var(--foreground)))',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {agentName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
                marginTop: 1,
              }}
            >
              {agentSubtitle}
            </div>
          </div>
          <ChevronRight
            size={14}
            style={{ color: 'var(--kna-muted, hsl(var(--muted-foreground)))', flex: '0 0 auto' }}
          />
        </div>
      </section>

      {/* Model */}
      <section>
        <div className="lbl-tiny" style={{ marginBottom: 8 }}>
          {t('rail.model', { defaultValue: '模型' })}
        </div>
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--paper, #fff)',
            border: '1px solid var(--kna-border)',
            borderRadius: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--ink, hsl(var(--foreground)))',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {modelLabel}
            </div>
            <ChevronRight
              size={14}
              style={{ color: 'var(--kna-muted, hsl(var(--muted-foreground)))', flex: '0 0 auto' }}
            />
          </div>
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              gap: 6,
              fontSize: 11,
              color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
              alignItems: 'center',
            }}
          >
            <span>{t('rail.viaKna', { defaultValue: 'via KNA' })}</span>
            <span style={{ color: 'var(--kna-border-strong, var(--kna-border))' }}>·</span>
            <span>
              {t('rail.sessionCost', { defaultValue: '本对话' })}{' '}
              <b
                className="num"
                style={{
                  color: 'var(--ink-2, hsl(var(--foreground)))',
                  fontWeight: 600,
                  fontFamily: 'var(--serif)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                —
              </b>
            </span>
          </div>
        </div>
      </section>

      {/* Enabled skills */}
      <section>
        <div
          className="lbl-tiny"
          style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}
        >
          <span>{t('rail.enabledSkills', { defaultValue: '已启用技能' })}</span>
          <span
            style={{
              color: 'var(--kna-muted-2, hsl(var(--muted-foreground)))',
              letterSpacing: 0,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {enabledSkills.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {visibleSkills.map((s) => (
            <div
              key={s.id}
              title={s.description || s.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                background: 'var(--paper, #fff)',
                border: '1px solid var(--kna-border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--ink-2, hsl(var(--foreground)))',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--coral, hsl(var(--primary)))',
                  flex: '0 0 auto',
                }}
              />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {s.name}
              </span>
            </div>
          ))}
          {hiddenSkillCount > 0 && (
            <div
              style={{
                padding: '6px 10px',
                fontSize: 11.5,
                color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
              }}
            >
              {t('rail.moreSkills', { count: hiddenSkillCount, defaultValue: '+{{count}} 个' })}
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate('/skills')}
            style={{
              padding: '7px 10px',
              background: 'transparent',
              border: '1px dashed var(--kna-border-strong, var(--kna-border))',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--sans)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={12} strokeWidth={2.2} />
            {t('rail.addSkill', { defaultValue: '添加技能' })}
          </button>
        </div>
      </section>

      {/* Token meters (placeholder until gateway surfaces usage) */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: '1px dashed var(--kna-border-strong, var(--kna-border))',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11.5,
            color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
          }}
        >
          <span>{t('rail.inputTokens', { defaultValue: '输入 tokens' })}</span>
          <span
            className="num"
            style={{
              color: 'var(--ink-2, hsl(var(--foreground)))',
              fontFamily: 'var(--serif)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            —
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11.5,
            color: 'var(--kna-muted, hsl(var(--muted-foreground)))',
            marginTop: 3,
          }}
        >
          <span>{t('rail.outputTokens', { defaultValue: '输出 tokens' })}</span>
          <span
            className="num"
            style={{
              color: 'var(--ink-2, hsl(var(--foreground)))',
              fontFamily: 'var(--serif)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            —
          </span>
        </div>
      </div>
    </aside>
  );
}
