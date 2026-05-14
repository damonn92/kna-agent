/* global React, AppFrame, KIcon */
// KNA Agent — Channels page (2 frames: list + inline-config expanded)

const ChIc = KIcon;

const CHANNELS = [
  { id: "telegram", name: "Telegram",  desc: "通过 Bot Token 双向收发消息 · 私聊 / 群组",  icon: ChIc.telegram, color: "#2AA1E0", acct: "@kna_studio_bot",          state: "on" },
  { id: "discord",  name: "Discord",   desc: "Webhook 单向推送 · 或 Bot 双向接入",          icon: ChIc.discord,  color: "#5865F2", acct: "kna#studio · 3 个频道",     state: "on" },
  { id: "feishu",   name: "飞书",      desc: "企业自建应用 · 多维表格 / 文档 / 消息卡片",  icon: ChIc.feishu,   color: "#00D6B9", acct: "kna-agent · 工作台",         state: "on" },
  { id: "dingtalk", name: "钉钉",      desc: "群机器人 · 工作通知 / 定时报表",              icon: ChIc.dingtalk, color: "#1989FA", acct: "未连接",                     state: "off" },
  { id: "whatsapp", name: "WhatsApp",  desc: "Business Cloud API · 海外团队协作",           icon: ChIc.whatsapp, color: "#25D366", acct: "+852 9012 ••••",            state: "on" },
  { id: "imessage", name: "iMessage",  desc: "macOS 原生消息 · 仅 macOS 14+",               icon: ChIc.imessage, color: "#34C759", acct: "未连接",                     state: "off" },
  { id: "email",    name: "Email",     desc: "SMTP / IMAP · 收件箱触发 · 邮件回复",          icon: ChIc.mail,     color: "#B5573A", acct: "kai.zhou@studio.cn",         state: "on" },
  { id: "webhook",  name: "Webhook",   desc: "通用 HTTP webhook · 接入任意第三方系统",      icon: ChIc.webhook,  color: "#7A7068", acct: "3 个 endpoint",              state: "on" },
];

function ChannelRow({ c, expanded }) {
  const on = c.state === "on";
  return (
    <div className="card" style={{
      padding: 0,
      opacity: on ? 1 : 0.7,
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: on ? c.color : "#cfc7bb",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          flex: "0 0 auto",
        }}>
          <span style={{ width: 22, height: 22, display: "block" }}>{c.icon}</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 className="h3" style={{ fontSize: 15 }}>{c.name}</h3>
            {on
              ? <span className="chip on"><span className="dot" />已连接</span>
              : <span className="chip"><span className="dot" />未连接</span>}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 0", lineHeight: 1.4 }}>{c.desc}</p>
        </div>
        <div style={{
          padding: "5px 10px", borderRadius: 8, background: "var(--paper)",
          border: "1px solid var(--border)", fontSize: 12, color: "var(--ink-2)",
          fontFamily: c.acct.startsWith("@") || c.acct.startsWith("+") || c.acct.includes("@") ? "var(--mono)" : "var(--sans)",
        }}>
          {c.acct}
        </div>
        <button className="btn btn-subtle btn-sm" disabled={!on} style={!on ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
          测试
        </button>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)", padding: 6 }}>
          <span style={{ width: 14, height: 14, display: "block", transform: expanded ? "rotate(90deg)" : "none" }}>{ChIc.chevR}</span>
        </button>
        <span className={"tog" + (on ? " on" : "")} />
      </div>

      {expanded && <FeishuConfig />}
    </div>
  );
}

function FeishuConfig() {
  return (
    <div style={{
      borderTop: "1px dashed var(--border-strong)",
      padding: "18px 20px 20px", background: "var(--paper)",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18,
    }}>
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 14, fontSize: 11.5, color: "var(--muted)" }}>
        <span>1. 在 <a href="#">飞书开放平台</a> 创建企业自建应用</span>
        <span style={{ color: "var(--border-strong)" }}>·</span>
        <span>2. 填入 App ID / Secret</span>
        <span style={{ color: "var(--border-strong)" }}>·</span>
        <span>3. 授权 im:message + bitable 权限</span>
      </div>
      <div>
        <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>App ID</label>
        <input className="k-input" defaultValue="cli_a8b2f43c91d6e012" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
      </div>
      <div>
        <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>App Secret</label>
        <input className="k-input" defaultValue="••••••••••••••••••••••••2a91" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
      </div>
      <div>
        <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>默认接收人</label>
        <div className="k-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <span>KNA 工作台 · 内容运营群</span>
          <span style={{ width: 13, height: 13, color: "var(--muted)" }}>{ChIc.caret}</span>
        </div>
      </div>
      <div>
        <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>消息格式</label>
        <div style={{ display: "flex", gap: 6 }}>
          {["纯文本", "卡片", "Markdown"].map((m, i) => (
            <button key={m} className={"btn " + (i === 1 ? "btn-deep" : "btn-subtle") + " btn-sm"} style={{ flex: 1 }}>{m}</button>
          ))}
        </div>
      </div>
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12, paddingTop: 6 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <span className="tog on" />接收 @ 提及自动回复
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
          <span className="tog" />允许从飞书发起新对话
        </span>
        <span style={{ flex: 1 }} />
        <button className="btn btn-subtle btn-sm">测试连接</button>
        <button className="btn btn-solid btn-sm">保存</button>
      </div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 7 — Channel list (default)
 * ============================================================== */
function ChannelsList() {
  return (
    <AppFrame active="channels" crumb={["KNA Agent", "Channels"]} screenLabel="Channels · list">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Channels</h1>
          <p className="sub">让 Agent 出现在你日常工作的地方 — 飞书 / Telegram / 邮箱 / 自定义 webhook 都可双向接入。</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-subtle">入站 webhook URL</button>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{ChIc.plus}</span>新增 Channel</button>
        </div>
      </div>

      <div style={{ padding: "0 32px 28px", overflowY: "auto", flex: 1 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22,
        }}>
          {[
            { lbl: "已连接", val: "6", sub: "/ 8 个 channel" },
            { lbl: "本周消息", val: "1,284", sub: "+18% vs 上周" },
            { lbl: "活跃 Agent", val: "4", sub: "在 channel 上响应" },
            { lbl: "失败率", val: "0.2%", sub: "过去 24 小时" },
          ].map((s) => (
            <div key={s.lbl} className="card" style={{ padding: "12px 16px" }}>
              <div className="lbl-tiny">{s.lbl}</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", marginTop: 3, lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHANNELS.map((c) => <ChannelRow key={c.id} c={c} />)}
        </div>
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 8 — Inline config expanded
 * ============================================================== */
function ChannelsExpanded() {
  return (
    <AppFrame active="channels" crumb={["KNA Agent", "Channels", "飞书 · 配置"]} screenLabel="Channels · inline config">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Channels</h1>
          <p className="sub">让 Agent 出现在你日常工作的地方 — 飞书 / Telegram / 邮箱 / 自定义 webhook 都可双向接入。</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{ChIc.plus}</span>新增 Channel</button>
        </div>
      </div>

      <div style={{ padding: "0 32px 28px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHANNELS.slice(0, 3).map((c) => <ChannelRow key={c.id} c={c} expanded={c.id === "feishu"} />)}
          {CHANNELS.slice(3, 5).map((c) => <ChannelRow key={c.id} c={c} />)}
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ChannelsList, ChannelsExpanded });
