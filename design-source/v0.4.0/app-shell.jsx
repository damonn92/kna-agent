/* global React */
// KNA Agent — app shell: TitleBar, Sidebar, AppFrame wrapper, icon set.

const { useState, useMemo, Fragment } = React;

/* ---------------------------------------------------------------- *
 * Icon set — Lucide-style 1.6px stroke, 18×18 viewBox.
 * ---------------------------------------------------------------- */
const I = {
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  models:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7l9 5 9-5-9-5z"/><path d="M3 17l9 5 9-5"/><path d="M3 12l9 5 9-5"/></svg>,
  agents:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="14" rx="2"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M12 2v4"/><path d="M9 17h6"/></svg>,
  channels:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9-9"/><path d="M4 4v16h16"/><circle cx="9" cy="16" r="1.5"/><circle cx="15" cy="13" r="1.5"/><circle cx="19" cy="8" r="1.5"/></svg>,
  skills:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 5 5.6.5-4.2 3.8 1.2 5.7L12 14.5 6.8 17l1.2-5.7L4 7.5 9.6 7z"/></svg>,
  cron:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>,
  settings:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  // Utility
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  send:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  attach:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  at:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>,
  caret:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  more:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  copy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  play:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  chevR:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  download:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  sidebar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  spark:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M12 16v6"/><path d="M4.93 4.93l4.24 4.24"/><path d="M14.83 14.83l4.24 4.24"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="M4.93 19.07l4.24-4.24"/><path d="M14.83 9.17l4.24-4.24"/></svg>,
  wrench:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  globe:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  bell:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>,
  paint:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.75 1.5-1.5 0-.4-.15-.75-.4-1-.27-.27-.42-.62-.42-1 0-.83.67-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/></svg>,
  // Channel platform marks
  telegram:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>,
  discord: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.32 4.37A19.79 19.79 0 0 0 16.56 3l-.31.5a13 13 0 0 0-3.62-.5 13 13 0 0 0-3.62.5L8.7 3a19.79 19.79 0 0 0-3.76 1.37C2.06 9.34 1.46 14.18 1.75 18.95a19.9 19.9 0 0 0 6.07 3.07l.99-1.31a13 13 0 0 1-3.06-1.45c.26-.19.5-.39.74-.6 5.67 2.62 11.81 2.62 17.42 0 .24.21.49.41.74.6a13 13 0 0 1-3.07 1.45l.99 1.31a19.9 19.9 0 0 0 6.07-3.07c.34-5.46-.56-10.26-2.32-14.58zM8.52 15.66c-1.18 0-2.16-1.1-2.16-2.45 0-1.35.96-2.45 2.16-2.45 1.21 0 2.18 1.1 2.16 2.45 0 1.35-.96 2.45-2.16 2.45zm7.96 0c-1.18 0-2.16-1.1-2.16-2.45 0-1.35.96-2.45 2.16-2.45 1.21 0 2.18 1.1 2.16 2.45 0 1.35-.95 2.45-2.16 2.45z"/></svg>,
  feishu:  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.8 11.5c.7.9 1 2 .7 3.2-.5 1.8-2.5 2.8-4.3 2.3-.3-.1-.6-.2-.8-.4l-3.6-2.5L5.4 17c-.6.5-1.5.5-2 0-.6-.6-.6-1.5 0-2L11 7.5 17 4c.4-.2.8 0 1 .4.2.4 0 .9-.4 1l-3.5 1.9c-.4.2-.5.7-.3 1 .2.4.7.5 1 .3l3.7-2c.6-.3 1.4-.1 1.7.5.3.6.1 1.4-.5 1.7l-3.9 2.2c-.3.2-.4.6-.2.9.2.3.6.4.9.2l3.5-2c.5-.3 1.2-.1 1.5.4.3.5.1 1.2-.4 1.5l-5.3 3c-.3.2-.4.6-.2.9z"/></svg>,
  dingtalk:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.3 8.7l-3.6 5.3 1.2-3.5h-2.5l3-5 5.3-3-3.4 6.2z"/></svg>,
  whatsapp:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.7-1.5-1.7-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 2 0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.2 3.6.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.4-.3zM12 2C6.48 2 2 6.48 2 12c0 1.78.47 3.45 1.28 4.9L2 22l5.27-1.27c1.4.77 3.02 1.21 4.73 1.21 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>,
  imessage:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 5.7 2 10.3c0 2.6 1.4 4.9 3.7 6.4-.1 1-.5 2.7-1.5 3.6 0 0 2.5-.3 5-2 .9.2 1.9.3 2.8.3 5.5 0 10-3.7 10-8.3S17.5 2 12 2z"/></svg>,
  mail:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  webhook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16.98h-5.99c-1.66 0-3.01-1.34-3.01-3s1.34-3 3.01-3 3 1.34 3 3v.01"/><path d="M11 9.99v-5h2"/><path d="M16 21.99l-5-9"/></svg>,
};

/* ---------------------------------------------------------------- *
 * Sidebar
 * ---------------------------------------------------------------- */
function Sidebar({ active = "chat", collapsed = false, balance = "184.50", balanceCny = "¥1,288", email = "kai.zhou@studio.cn" }) {
  const items = [
    { id: "chat",     label: "Chat",          icon: I.chat,     badge: "3" },
    { id: "models",   label: "Models",        icon: I.models },
    { id: "agents",   label: "Agents",        icon: I.agents },
    { id: "channels", label: "Channels",      icon: I.channels },
    { id: "skills",   label: "Skills",        icon: I.skills },
    { id: "cron",     label: "Scheduled",     icon: I.cron },
  ];
  return (
    <aside className="kna-sb">
      <div className="kna-sb-brand">
        <div className="mark">K</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div className="name">KNA Agent</div>
            <div className="ver">v0.4.0 · BETA</div>
          </div>
        )}
      </div>
      <div className="kna-sb-nav">
        {!collapsed && <div className="kna-sb-group">工作台</div>}
        {items.map((it) => (
          <a key={it.id} className={"kna-sb-item" + (active === it.id ? " active" : "")} href="#">
            <span className="ico">{it.icon}</span>
            <span>{it.label}</span>
            {it.badge && active !== it.id && <span className="badge">{it.badge}</span>}
            {it.badge && active === it.id && <span className="badge">{it.badge}</span>}
          </a>
        ))}
        {!collapsed && <div className="kna-sb-group">系统</div>}
        <a className={"kna-sb-item" + (active === "settings" ? " active" : "")} href="#">
          <span className="ico">{I.settings}</span>
          <span>Settings</span>
        </a>
      </div>
      <div className="kna-sb-foot">
        <div className="kna-balance">
          <div className="avatar">{email.slice(0, 1).toUpperCase()}</div>
          {!collapsed && (
            <Fragment>
              <div className="meta">
                <div className="em">{email}</div>
                <div className="bal">${balance}<span className="cny"> · {balanceCny}</span></div>
              </div>
              <button className="topup">充值</button>
            </Fragment>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- *
 * Title bar
 * ---------------------------------------------------------------- */
function TitleBar({ crumb = ["KNA Agent", "Chat"], update = "idle" }) {
  return (
    <div className="kna-tbar">
      <div className="kna-tlights">
        <span className="kna-tlight r" />
        <span className="kna-tlight y" />
        <span className="kna-tlight g" />
      </div>
      <button style={{ background: "transparent", border: 0, color: "var(--muted)", padding: 4, cursor: "pointer", display: "flex" }}>
        <span style={{ width: 16, height: 16, display: "block" }}>{I.sidebar}</span>
      </button>
      <div className="crumb">
        {crumb.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {i === crumb.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </Fragment>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      {update === "available" ? (
        <span className="upd"><span className="dot" />更新可用 v0.4.1</span>
      ) : update === "checking" ? (
        <span className="upd idle"><span className="dot" style={{ background: "var(--coral-deep)" }} />检查更新…</span>
      ) : (
        <span className="upd idle"><span className="dot" />已是最新 v0.4.0</span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * AppFrame — full window chrome wrapping any page
 * Pass `active` for sidebar highlight, `crumb` for titlebar.
 * children render in the main pane.
 * ---------------------------------------------------------------- */
function AppFrame({ active, crumb, update = "idle", collapsed = false, balanceProps = {}, children, screenLabel }) {
  return (
    <div className="kna-app" data-screen-label={screenLabel}>
      <TitleBar crumb={crumb} update={update} />
      <div className={"kna-body with-sidebar" + (collapsed ? " collapsed" : "")}>
        <Sidebar active={active} collapsed={collapsed} {...balanceProps} />
        <main style={{ minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", background: "var(--cream)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { AppFrame, Sidebar, TitleBar, KIcon: I });
