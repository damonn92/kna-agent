/**
 * KNA Deep-Link Handler
 *
 * Owns the `kna-desktop://` custom URL scheme that's used for browser-based
 * SSO (the KNA web dashboard redirects to `kna-desktop://login?token=...`
 * after the user authenticates, and the OS dispatches that URL back to
 * this app via the registered protocol handler).
 *
 * Cross-platform delivery quirks this module abstracts away:
 *   - macOS: the URL arrives via `app.on('open-url')` — can fire BEFORE
 *     `whenReady()` on cold launch, so we buffer until the renderer is up.
 *   - Windows / Linux: the URL is appended to `process.argv` when the OS
 *     launches the app; subsequent invocations come through `second-instance`.
 *
 * The renderer subscribes to the `kna:deep-link` IPC channel (whitelisted
 * in preload/index.ts) and decides what to do with the payload — typically
 * "parse the token, write it to electron-store, provision a KNA provider".
 */

import { app, BrowserWindow } from 'electron';
import { logger } from '../utils/logger';

export const KNA_PROTOCOL_SCHEME = 'kna-desktop';
const SCHEME_PREFIX = `${KNA_PROTOCOL_SCHEME}://`;

let pendingLink: string | null = null;
let mainWindowRef: BrowserWindow | null = null;

/**
 * Register `kna-desktop://` as a custom URL scheme with the OS so external
 * processes (the system browser, mostly) can launch this app with a payload.
 *
 * Must be called before `app.whenReady()`; on macOS the OS may otherwise
 * dispatch the URL to a fresh Electron instance instead of routing it here.
 *
 * In dev mode (`process.defaultApp`) electron-builder isn't producing a
 * standalone binary, so we have to explicitly pass `process.execPath` +
 * the source script so the OS associates the protocol with the running
 * dev copy, not the system-wide Electron.
 */
export function registerKnaProtocol(argv: string[] = process.argv): void {
  try {
    if (process.defaultApp) {
      if (argv.length >= 2) {
        app.setAsDefaultProtocolClient(KNA_PROTOCOL_SCHEME, process.execPath, [argv[1]]);
      } else {
        app.setAsDefaultProtocolClient(KNA_PROTOCOL_SCHEME);
      }
    } else {
      app.setAsDefaultProtocolClient(KNA_PROTOCOL_SCHEME);
    }
    logger.info(`[KNA] Registered ${SCHEME_PREFIX} protocol handler`);
  } catch (error) {
    logger.warn('[KNA] Failed to register protocol handler:', error);
  }
}

/**
 * Called once the main BrowserWindow exists. Flushes any deep-link that
 * arrived while the renderer was still booting.
 */
export function setKnaMainWindow(win: BrowserWindow | null): void {
  mainWindowRef = win;
  if (mainWindowRef && pendingLink) {
    const url = pendingLink;
    pendingLink = null;
    // Wait for renderer to be ready (did-finish-load) before delivering.
    if (mainWindowRef.webContents.isLoading()) {
      mainWindowRef.webContents.once('did-finish-load', () => deliver(url));
    } else {
      deliver(url);
    }
  }
}

/**
 * Scan argv for a `kna-desktop://` URL. Used at startup on Win/Linux and
 * inside the `second-instance` handler for cold-launches that carry the
 * payload through the OS shell.
 */
export function extractDeepLinkFromArgv(argv: string[]): string | null {
  for (const arg of argv) {
    if (typeof arg === 'string' && arg.startsWith(SCHEME_PREFIX)) {
      return arg;
    }
  }
  return null;
}

/**
 * Main entry point: a deep-link URL has been received from the OS. If the
 * renderer is alive, forward it; otherwise buffer for delivery once the
 * window exists.
 *
 * The URL is logged with the `token=` parameter redacted so it doesn't
 * end up in user-shared log files.
 */
export function handleDeepLink(url: string): void {
  if (!url || !url.startsWith(SCHEME_PREFIX)) return;

  logger.info(`[KNA] Deep-link received: ${redactToken(url)}`);

  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    if (mainWindowRef.webContents.isLoading()) {
      mainWindowRef.webContents.once('did-finish-load', () => deliver(url));
    } else {
      deliver(url);
    }
    // Bring the window to the front so the user sees the post-login state.
    if (mainWindowRef.isMinimized()) mainWindowRef.restore();
    mainWindowRef.focus();
  } else {
    pendingLink = url;
  }
}

function deliver(url: string): void {
  try {
    mainWindowRef?.webContents.send('kna:deep-link', url);
  } catch (error) {
    logger.warn('[KNA] Failed to forward deep-link to renderer:', error);
  }
}

function redactToken(url: string): string {
  return url.replace(/(token=)[^&#]+/i, '$1***');
}
