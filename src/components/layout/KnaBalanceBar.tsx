/**
 * KNA Balance Bar — slim top-of-content widget.
 *
 * Sits between TitleBar and the sidebar/content row in MainLayout. Three
 * visual states depending on whether the user has linked a KNA account:
 *
 *   1. **未登录** (no `knaToken` persisted) — shows a primary "用 KNA 账号登录"
 *      button that opens `https://code.wearekna.com/desktop-login` in the
 *      default browser. The browser-side page does the SSO dance and
 *      bounces back via `kna-desktop://login?token=…`, after which the
 *      hook in `useKnaDeepLink` flips `knaToken` in settings and we
 *      re-render into state 2/3.
 *
 *   2. **已登录·余额加载中** — shows a coral-skeleton "余额加载中" placeholder
 *      while the first `/api/balance` round-trip is in flight.
 *
 *   3. **已登录** — "余额 ¥X.XX · $Y" + a "充值" button that opens the
 *      sub2api dashboard's purchase page in the browser. Also surfaces
 *      the linked email on the left for "登录为 …" context.
 *
 * Balance is polled on mount + every 90 s + on window-focus, throttled.
 * The endpoint accepts the sk-kna-... key directly, so we don't need
 * the sub2api session JWT here.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/stores/settings';
import { UpdateIndicator } from './UpdateIndicator';

const BALANCE_ENDPOINT = 'https://chat.wearekna.com/api/balance';
const LOGIN_URL = 'https://code.wearekna.com/desktop-login';
const PURCHASE_URL = 'https://code.wearekna.com/purchase';
const REFRESH_MS = 90_000;

interface BalanceResponse {
  balance_usd: number;
  balance_cny: number;
  key_name?: string;
  email?: string;
  error?: string;
}

type FetchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ok'; data: BalanceResponse }
  | { kind: 'error'; message: string };

function openExternal(url: string): void {
  try {
    void window.electron?.openExternal?.(url);
  } catch {
    // Fallback: <a target="_blank"> normally unsupported in Electron renderer,
    // but better than nothing in dev mode.
    window.open(url, '_blank');
  }
}

function formatUsd(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(2);
}
function formatCny(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(2);
}

export interface KnaBalanceBarProps {
  /**
   * Visual variant. `top` is the legacy v0.3.x horizontal bar that
   * sat between TitleBar and the sidebar/content row. `sidebar` is
   * the v0.4.0 coral-wash pill that pins to the sidebar's bottom.
   * Defaults to `top` so existing imports keep working.
   */
  variant?: 'top' | 'sidebar';
}

export function KnaBalanceBar({
  variant = 'top',
}: KnaBalanceBarProps = {}): React.ReactElement | null {
  // Pull both the token and the saved email from the renderer settings
  // store. The settings store hydrates from the main electron-store via
  // hostApiFetch('/api/settings') on mount (see settings.ts:init).
  const knaToken = useSettingsStore((s) => s.knaToken);
  const knaEmail = useSettingsStore((s) => s.knaEmail);

  const [state, setState] = useState<FetchState>({ kind: 'idle' });
  const inflightRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // sub2api keys are bare `sk-` + 64 hex. Reject image-only and Anthropic keys.
    if (!knaToken || !knaToken.startsWith('sk-') || knaToken.startsWith('sk-image-') || knaToken.startsWith('sk-ant-')) {
      setState({ kind: 'idle' });
      return;
    }
    // Cancel any in-flight request before starting a new one.
    inflightRef.current?.abort();
    const ctrl = new AbortController();
    inflightRef.current = ctrl;
    setState((prev) => (prev.kind === 'ok' ? prev : { kind: 'loading' }));
    try {
      const url = `${BALANCE_ENDPOINT}?key=${encodeURIComponent(knaToken)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: ctrl.signal,
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => null);
        setState({ kind: 'error', message: body?.error || `HTTP ${resp.status}` });
        return;
      }
      const data = (await resp.json()) as BalanceResponse;
      setState({ kind: 'ok', data });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setState({ kind: 'error', message: (err as Error).message || 'network error' });
    }
  }, [knaToken]);

  // Initial fetch + polling. Also refresh when the window gains focus,
  // so balance is up to date after the user just topped up in the
  // browser tab.
  useEffect(() => {
    void refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      inflightRef.current?.abort();
    };
  }, [refresh]);

  const loggedIn = !!knaToken
    && knaToken.startsWith('sk-')
    && !knaToken.startsWith('sk-image-')
    && !knaToken.startsWith('sk-ant-');

  // v0.4.0 sidebar variant — coral-wash pill that pins to the bottom
  // of the sidebar (the new home for balance, per Claude Design spec).
  // Avatar (initial) + email above, balance + 充值 button stacked.
  // Falls through to the legacy "top bar" variant when variant != 'sidebar'
  // so callers that still mount this at the top of the layout keep working.
  if (variant === 'sidebar') {
    const initial = (knaEmail?.[0] || '?').toUpperCase();
    const displayEmail = knaEmail
      || (state.kind === 'ok' ? state.data.email : '')
      || '';

    if (!loggedIn) {
      // Pre-SSO sidebar foot: single coral CTA, no balance row.
      return (
        <button
          type="button"
          onClick={() => openExternal(LOGIN_URL)}
          className="kna-sb-login no-drag"
          style={{
            width: '100%',
            background: 'var(--coral)',
            color: '#fff',
            border: 0,
            borderRadius: 10,
            padding: '9px 12px',
            fontFamily: 'var(--sans)',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          用 KNA 账号登录 <span aria-hidden="true">→</span>
        </button>
      );
    }

    return (
      <div className="kna-balance no-drag">
        <div className="avatar">{initial}</div>
        <div className="meta">
          <div className="em" title={displayEmail}>
            {displayEmail || '已登录 KNA'}
          </div>
          <div className="bal">
            {state.kind === 'ok' ? (
              <>
                ${formatUsd(state.data.balance_usd)}
                <span className="cny">¥{formatCny(state.data.balance_cny)}</span>
              </>
            ) : state.kind === 'error' ? (
              <span style={{ color: 'var(--coral-deep)', fontSize: 11 }}>
                <button
                  type="button"
                  onClick={refresh}
                  title={state.message}
                  style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline dotted', fontFamily: 'inherit' }}
                >
                  重试
                </button>
              </span>
            ) : (
              <span style={{ color: 'var(--kna-muted)', fontSize: 11 }}>余额加载中…</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="topup"
          onClick={() => openExternal(PURCHASE_URL)}
          title="打开 KNA 充值页"
        >
          充值
        </button>
      </div>
    );
  }

  // Legacy top-bar variant — kept for backward compatibility.
  return (
    <div className="no-drag flex h-9 shrink-0 items-center justify-between gap-3 border-b border-line bg-[#FBF8F2] px-4 text-[13px] text-ink dark:bg-[#1F1A17] dark:text-[#E5DCD0] dark:border-[#2C2520]">
      {/* Left: identity / status */}
      <div className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[#CC785C]" />
        <span className="truncate text-ink-2 dark:text-[#b8ad9f]">
          {loggedIn
            ? (knaEmail || state.kind === 'ok' && state.data.email
                ? <>登录为 <span className="text-ink dark:text-[#f3e6d5]">{knaEmail || (state.kind === 'ok' ? state.data.email : '')}</span></>
                : <>已登录 KNA</>)
            : <>未登录 — 把 Claude 装上 Mac，余额永不过期</>}
        </span>
      </div>

      {/* Right: balance / actions */}
      <div className="flex items-center gap-2">
        {/* Auto-update chip — only renders when status is downloading /
            downloaded / error. Invisible during routine background polls. */}
        <UpdateIndicator />

        {!loggedIn && (
          <button
            type="button"
            onClick={() => openExternal(LOGIN_URL)}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-[#CC785C] px-3 text-xs font-medium text-white hover:bg-[#b56350] transition-colors"
          >
            用 KNA 账号登录
            <span aria-hidden="true">→</span>
          </button>
        )}

        {loggedIn && state.kind === 'loading' && (
          <span className="font-mono text-xs text-ink-3 dark:text-[#807468]">
            余额加载中…
          </span>
        )}

        {loggedIn && state.kind === 'error' && (
          <button
            type="button"
            onClick={refresh}
            className="font-mono text-xs text-[#a55a3f] underline-offset-2 hover:underline"
            title={state.message}
          >
            重试余额查询
          </button>
        )}

        {loggedIn && state.kind === 'ok' && (
          <>
            <span className="font-mono text-xs text-ink-2 dark:text-[#b8ad9f]">
              余额{' '}
              <span className="text-ink dark:text-[#f3e6d5] font-semibold">
                ¥{formatCny(state.data.balance_cny)}
              </span>
              <span className="ml-1.5 text-ink-3 dark:text-[#807468]">
                · ${formatUsd(state.data.balance_usd)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => openExternal(PURCHASE_URL)}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-[#CC785C] px-3 text-xs font-medium text-white hover:bg-[#b56350] transition-colors"
            >
              充值
            </button>
          </>
        )}
      </div>
    </div>
  );
}
