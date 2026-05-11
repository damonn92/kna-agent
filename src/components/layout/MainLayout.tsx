/**
 * Main Layout Component
 * TitleBar at top, then sidebar + content below.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TitleBar } from './TitleBar';
import { KnaBalanceBar } from './KnaBalanceBar';

export function MainLayout() {
  return (
    <div data-testid="main-layout" className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Title bar: drag region on macOS, icon + controls on Windows */}
      <TitleBar />

      {/* KNA balance + 充值 (or "用 KNA 账号登录" before SSO is done) */}
      <KnaBalanceBar />

      {/* Below the title bar: sidebar + content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main data-testid="main-content" className="min-h-0 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
