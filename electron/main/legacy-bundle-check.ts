/**
 * Legacy bundle detector (macOS only)
 *
 * The v0.3.x rebrand renamed the macOS .app bundle from "KNA Desktop.app"
 * to "KNA Agent.app". On upgrade, the dmg-installed `KNA Agent.app` does
 * NOT automatically delete the prior `KNA Desktop.app` — both end up in
 * /Applications side-by-side, both claiming bundleID `com.wearekna.desktop`.
 *
 * macOS LaunchServices then registers both, and on the next launch the
 * Dock activates entries for BOTH, producing duplicate icons (one with the
 * coral KNA icon, others with stale cached icons from older builds).
 *
 * This module checks for the legacy path at startup; if it exists AND we
 * are NOT the legacy bundle ourselves, we show a one-time dialog asking
 * the user to move it to Trash. The dialog suppresses on subsequent
 * launches via electron-store flag `legacyBundleDismissed`.
 */
import { app, dialog, shell } from 'electron';
import { existsSync } from 'fs';
import { logger } from '../utils/logger';
import { getSetting, setSetting } from '../utils/store';

const LEGACY_BUNDLE_PATHS = [
  '/Applications/KNA Desktop.app',
  // future renames go here; keep most-recent-rename at top
];

/**
 * Resolve the .app bundle root for the currently-running process, or
 * `null` when running in dev / unpackaged. We compare against this so
 * the check is a no-op when the running app IS the legacy bundle (the
 * user hasn't installed the renamed version yet).
 */
function currentBundlePath(): string | null {
  if (!app.isPackaged) return null;
  const exe = app.getPath('exe');
  const idx = exe.indexOf('/Contents/MacOS/');
  if (idx < 0) return null;
  return exe.slice(0, idx);
}

export async function checkLegacyBundles(): Promise<void> {
  if (process.platform !== 'darwin') return;
  if (!app.isPackaged) return;

  // User dismissed once → don't nag every launch.
  const dismissed = await getSetting('legacyBundleDismissed');
  if (dismissed) return;

  const current = currentBundlePath();
  const stale = LEGACY_BUNDLE_PATHS.find(
    (p) => p !== current && existsSync(p),
  );
  if (!stale) return;

  logger.warn(`[LegacyBundle] Detected stale install at ${stale}`);

  // Non-blocking: don't await, so initialize() proceeds. The dialog
  // shows once Electron's UI thread is idle.
  void dialog
    .showMessageBox({
      type: 'warning',
      title: 'Stale KNA install detected',
      message: 'An older copy of KNA Agent is still installed.',
      detail:
        `Found: ${stale}\n\n` +
        'macOS may show duplicate Dock icons (one orange "K" plus 2-3 dark ' +
        '"exec" boxes) and confuse "Open at Login" / Spotlight matching.\n\n' +
        'Move the old copy to Trash to resolve this. The current install at ' +
        `${current ?? '(unknown)'} is unaffected.`,
      buttons: ['Reveal in Finder', 'Don’t show again', 'Later'],
      defaultId: 0,
      cancelId: 2,
    })
    .then(async ({ response }) => {
      if (response === 0) {
        shell.showItemInFolder(stale);
      } else if (response === 1) {
        await setSetting('legacyBundleDismissed', true);
      }
    })
    .catch((err) => {
      logger.warn('[LegacyBundle] dialog failed (non-fatal):', err);
    });
}
