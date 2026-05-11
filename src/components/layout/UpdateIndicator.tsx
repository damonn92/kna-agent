/**
 * Update Indicator — ChatGPT/Claude-style auto-update chip.
 *
 * Lives inline in the KNA balance bar (right-hand side, before 充值). The
 * component watches the renderer update store (`useUpdateStore`) which is
 * fed by `update:status-changed` events from electron-updater in main.
 *
 * Visible states (anything else → render nothing):
 *
 *   - **downloading**: spinning dot + percent. Non-interactive — the
 *     download is happening in the background, the user just gets
 *     visibility.
 *
 *   - **downloaded**: coral chip "🆕 重启安装 vX.Y.Z". Clicking sends IPC
 *     `update:install` → main calls `autoUpdater.quitAndInstall()` →
 *     ShipIt restarts the app with the new bundle.
 *
 *   - **error** (after at least one download attempt): show a tiny
 *     dimmed dot + tooltip with the error. Click → re-check.
 *
 * Idle / checking / not-available / available all stay invisible — we
 * don't want to nag the user during routine background polling.
 */

import { useEffect } from 'react';
import { useUpdateStore } from '@/stores/update';

function formatPct(p: number | undefined | null): string {
  if (p == null || !Number.isFinite(p)) return '0%';
  return `${Math.round(p)}%`;
}

export function UpdateIndicator(): React.ReactElement | null {
  const status = useUpdateStore((s) => s.status);
  const progress = useUpdateStore((s) => s.progress);
  const info = useUpdateStore((s) => s.updateInfo);
  const error = useUpdateStore((s) => s.error);
  const init = useUpdateStore((s) => s.init);
  const installUpdate = useUpdateStore((s) => s.installUpdate);
  const checkForUpdates = useUpdateStore((s) => s.checkForUpdates);

  // The update store does its own one-shot init guard, so this is safe to
  // call from every render of the topbar.
  useEffect(() => { void init(); }, [init]);

  // Hide the indicator entirely for routine states. The renderer never
  // sees the difference between "not running" and "all up to date".
  if (status === 'idle' || status === 'checking' || status === 'not-available' || status === 'available') {
    return null;
  }

  if (status === 'downloading') {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-[#FAEEE6] px-3 h-7 text-xs text-[#8E4A38] dark:bg-[rgba(204,120,92,0.12)] dark:text-[#E0A287]"
        title={info?.version ? `正在下载 v${info.version} …` : '正在下载更新…'}
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#CC785C]"
        />
        <span className="font-mono">下载更新 {formatPct(progress?.percent)}</span>
      </span>
    );
  }

  if (status === 'downloaded') {
    const v = info?.version ? ` v${info.version}` : '';
    return (
      <button
        type="button"
        onClick={installUpdate}
        title={info?.version ? `重启并安装 v${info.version}` : '重启并安装新版本'}
        className="inline-flex items-center gap-1 h-7 rounded-full bg-[#CC785C] px-3 text-xs font-medium text-white hover:bg-[#b56350] transition-colors animate-[pulse-soft_2.4s_ease-in-out_infinite]"
        style={{ boxShadow: '0 0 0 0 rgba(204,120,92,0.4)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />
        </svg>
        重启安装{v}
      </button>
    );
  }

  if (status === 'error') {
    return (
      <button
        type="button"
        onClick={() => void checkForUpdates()}
        title={error || '更新检查失败 — 点击重试'}
        className="inline-flex items-center gap-1 h-7 rounded-full border border-[#e8b8a8] bg-transparent px-2.5 text-xs text-[#a55a3f] hover:bg-[#fff4f0] transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        重试更新
      </button>
    );
  }

  return null;
}
