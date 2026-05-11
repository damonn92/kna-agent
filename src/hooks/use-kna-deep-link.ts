/**
 * Listen for kna-desktop:// deep-links forwarded from the Electron main
 * process and turn them into provider-account upserts.
 *
 * The main side (electron/main/kna-deep-link.ts) emits the raw URL on
 * the `kna:deep-link` IPC channel. We parse out `token` + `email`, hand
 * them to `kna:applySso`, then refresh the provider snapshot so Settings
 * → 模型 reflects the new "KNA Claude" default immediately.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProviderStore } from '@/stores/providers';
import { useSettingsStore } from '@/stores/settings';

interface KnaSsoResult {
  ok: boolean;
  accountId?: string;
  error?: string;
}

export function useKnaDeepLink(): void {
  const navigate = useNavigate();
  const refreshProviderSnapshot = useProviderStore((s) => s.refreshProviderSnapshot);
  const markSetupComplete = useSettingsStore((s) => s.markSetupComplete);
  const initSettings = useSettingsStore((s) => s.init);

  useEffect(() => {
    const handler = async (...args: unknown[]) => {
      const url = typeof args[0] === 'string' ? args[0] : '';
      if (!url.startsWith('kna-desktop://')) return;

      let token = '';
      let email = '';
      try {
        // URL parser accepts the custom scheme; .searchParams works as expected.
        const parsed = new URL(url);
        token = (parsed.searchParams.get('token') || '').trim();
        email = (parsed.searchParams.get('email') || '').trim();
      } catch (err) {
        console.error('[KNA-SSO] Failed to parse deep-link URL:', err);
        toast.error('登录链接格式无效');
        return;
      }

      if (!token.startsWith('sk-kna-')) {
        toast.error('授权失败：API Key 必须以 sk-kna- 开头');
        return;
      }

      const pending = toast.loading(email ? `授权为 ${email}…` : '正在写入 KNA 凭据…');

      try {
        const result = (await window.electron.ipcRenderer.invoke('kna:applySso', {
          token,
          email,
        })) as KnaSsoResult;

        if (!result?.ok) {
          toast.error(`授权失败：${result?.error ?? '未知错误'}`, { id: pending });
          return;
        }

        // Refresh the provider snapshot so the Settings page shows the
        // new "KNA Claude" account as default without a manual reload.
        await refreshProviderSnapshot().catch(() => { /* non-fatal */ });

        // Re-hydrate the renderer settings store from the main side so
        // the balance bar (which reads knaToken/knaEmail from Zustand)
        // re-renders into the "logged in" state without a window reload.
        await initSettings().catch(() => { /* non-fatal */ });

        // Skip the Setup wizard — KNA SSO is a valid completion path.
        markSetupComplete();

        toast.success(
          email
            ? `已登录 KNA · ${email}`
            : '已登录 KNA',
          { id: pending, description: '默认模型已切换到 KNA Claude' },
        );

        // Drop the user on the Chat page so they immediately see the
        // post-login state. If they're already on chat, this is a no-op.
        navigate('/');
      } catch (error) {
        console.error('[KNA-SSO] applySso IPC failed:', error);
        const msg = error instanceof Error ? error.message : String(error);
        toast.error(`授权失败：${msg}`, { id: pending });
      }
    };

    const unsubscribe = window.electron.ipcRenderer.on('kna:deep-link', handler);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [navigate, refreshProviderSnapshot, markSetupComplete, initSettings]);
}
