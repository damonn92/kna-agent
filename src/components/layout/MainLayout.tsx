/**
 * Main Layout — KNA Agent v0.4.0 shell
 *
 * Switched from the v0.3.x flex-column layout (TitleBar + KnaBalanceBar
 * + flex-row{Sidebar, main}) to the v0.4.0 `.kna-app` grid:
 *
 *     ┌─ .kna-app ─────────────────────────────────────────┐
 *     │  .kna-tbar  (traffic lights · sidebar toggle ·     │
 *     │             breadcrumb · spacer · update chip)     │
 *     ├────────────┬───────────────────────────────────────┤
 *     │ .kna-sb    │  <main> Outlet                        │
 *     │  + brand   │                                       │
 *     │  + nav     │                                       │
 *     │  + sessions│                                       │
 *     │  + .kna-sb-foot  ← balance pill lives here in v0.4 │
 *     └────────────┴───────────────────────────────────────┘
 *
 * The balance bar no longer sits between titlebar and body — it now
 * pins to the sidebar's bottom (see Sidebar.tsx ↳ KnaBalanceBar with
 * `variant="sidebar"`). This matches the Claude Design hi-fi spec and
 * gives the chat / page surface the full vertical height it needs for
 * long conversations.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TitleBar } from './TitleBar';
import { useSettingsStore } from '@/stores/settings';

export function MainLayout() {
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed);

  return (
    <div data-testid="main-layout" className="kna-app">
      {/* macOS-style window chrome: sidebar toggle + crumb + update chip.
          Native traffic lights are provided by Electron's hiddenInset
          window style on macOS; on Windows/Linux the custom controls
          inside <TitleBar /> take over. */}
      <TitleBar />

      {/* Body row: sidebar + scrollable main pane */}
      <div className={`kna-body with-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <Sidebar />
        <main
          data-testid="main-content"
          className="min-w-0 overflow-auto"
          style={{ background: 'var(--cream)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
