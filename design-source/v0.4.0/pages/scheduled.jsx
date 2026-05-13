/* global React, AppFrame, KIcon */
// KNA Agent — Scheduled tasks (2 frames: table + new task modal)

const CrIc = KIcon;

const TASKS = [
  { state: "on",  name: "Shopify 日报 · 露营类目",        agent: "电商分析师", freq: "每天 09:00", last: "今天 09:00", lastOk: true,  next: "明天 09:00", channel: "飞书" },
  { state: "on",  name: "1688 询价批量更新",              agent: "电商分析师", freq: "每周一 08:30", last: "昨天 08:30", lastOk: true,  next: "周一 08:30", channel: "邮件" },
  { state: "on",  name: "Cloudflare 错误率告警",           agent: "运维助手",   freq: "每 15 分钟",   last: "9 分钟前", lastOk: true,  next: "6 分钟后",   channel: "Telegram" },
  { state: "off", name: "客户回复模板 — 周末",             agent: "中英翻译",   freq: "周六 / 周日 10:00", last: "未运行",  lastOk: null, next: "已暂停",     channel: "邮件" },
  { state: "on",  name: "GitHub release 摘要",            agent: "前端工程师", freq: "tag 推送时",  last: "3 天前",   lastOk: true,  next: "事件触发",   channel: "Discord" },
  { state: "err", name: "Notion 周报草稿生成",            agent: "内容编辑",   freq: "每周五 17:00", last: "上周五", lastOk: false, next: "周五 17:00", channel: "Notion" },
];

function TaskRow({ t }) {
  const dot = {
    on:  { c: "#4fae5d", l: "运行中" },
    off: { c: "#a39a91", l: "已暂停" },
    err: { c: "#c4533c", l: "上次失败" },
  }[t.state];
  return (
    <tr style={{ borderTop: "1px solid var(--border)" }}>
      <td style={{ padding: "12px 16px", width: 40 }}>
        <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 999, background: dot.c, verticalAlign: "middle" }} title={dot.l} />
      </td>
      <td style={{ padding: "12px 0", fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{t.name}</td>
      <td style={{ padding: "12px 14px" }}>
        <span className="chip" style={{ fontSize: 11.5 }}>{t.agent}</span>
      </td>
      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--ink-2)", fontFamily: "var(--mono)" }}>{t.freq}</td>
      <td style={{ padding: "12px 14px", fontSize: 12, color: t.lastOk === false ? "#c4533c" : "var(--muted)" }}>
        {t.last}
        {t.lastOk === false && <span style={{ marginLeft: 6, fontWeight: 600 }}>· 失败</span>}
      </td>
      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--muted)" }}>{t.next}</td>
      <td style={{ padding: "12px 14px" }}>
        <span className="chip" style={{ fontSize: 11.5 }}>{t.channel}</span>
      </td>
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        <button title="立即运行" style={{ background: "transparent", border: 0, padding: 5, cursor: "pointer", color: "var(--muted)", borderRadius: 6 }}>
          <span style={{ width: 14, height: 14, display: "block" }}>{CrIc.play}</span>
        </button>
        <button title="编辑" style={{ background: "transparent", border: 0, padding: 5, cursor: "pointer", color: "var(--muted)", borderRadius: 6 }}>
          <span style={{ width: 14, height: 14, display: "block" }}>{CrIc.edit}</span>
        </button>
        <button title="更多" style={{ background: "transparent", border: 0, padding: 5, cursor: "pointer", color: "var(--muted)", borderRadius: 6 }}>
          <span style={{ width: 14, height: 14, display: "block" }}>{CrIc.more}</span>
        </button>
      </td>
    </tr>
  );
}

/* ============================================================== *
 * FRAME 11 — Task table
 * ============================================================== */
function ScheduledList() {
  return (
    <AppFrame active="cron" crumb={["KNA Agent", "Scheduled"]} screenLabel="Scheduled · list">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Scheduled</h1>
          <p className="sub">按时间或事件触发 Agent；任务运行结果可直接推送到任意已连接 Channel。</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-subtle">导出 cron.json</button>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{CrIc.plus}</span>新建任务</button>
        </div>
      </div>

      <div style={{ padding: "0 32px 28px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { lbl: "活跃任务",  val: "4",   sub: "/ 6 已配置" },
            { lbl: "今日运行",  val: "47",  sub: "成功 46 · 失败 1" },
            { lbl: "本月消耗",  val: "$2.84", sub: "占总额 12%" },
            { lbl: "下一次",   val: "6 分钟", sub: "Cloudflare 告警" },
          ].map((s) => (
            <div key={s.lbl} className="card" style={{ padding: "12px 16px" }}>
              <div className="lbl-tiny">{s.lbl}</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", marginTop: 3, lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 14, background: "var(--cream-card)",
          }}>
            <h3 className="h3" style={{ fontSize: 14 }}>全部任务</h3>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{TASKS.length} 个任务</span>
            <span style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--ink-2)" }}>全部</button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)" }}>活跃</button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)" }}>失败</button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "transparent" }}>
                <th></th>
                {["任务", "Agent", "频率", "上次", "下次", "Channel", ""].map((h) => (
                  <th key={h} style={{
                    padding: "10px 14px", fontSize: 10.5, letterSpacing: ".12em",
                    textTransform: "uppercase", color: "var(--muted)", textAlign: "left",
                    fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((t, i) => <TaskRow key={i} t={t} />)}
            </tbody>
          </table>
        </div>
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 12 — New task modal
 * ============================================================== */
function ScheduledModal() {
  return (
    <AppFrame active="cron" crumb={["KNA Agent", "Scheduled", "新建任务"]} screenLabel="Scheduled · new task modal">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Scheduled</h1>
          <p className="sub">按时间或事件触发 Agent；任务运行结果可直接推送到任意已连接 Channel。</p>
        </div>
      </div>
      <div style={{ padding: "0 32px 28px", flex: 1, overflow: "hidden", filter: "blur(1.5px)", opacity: .5, pointerEvents: "none" }}>
        <div className="card" style={{ height: 320 }} />
      </div>

      <div className="kna-scrim">
        <div className="kna-modal" style={{ width: 680, maxHeight: "92%" }}>
          <div className="kna-modal-head">
            <h2 className="h2" style={{ fontSize: 19 }}>新建定时任务</h2>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: "var(--muted)", fontFamily: "var(--mono)" }}>step 1 / 3</span>
          </div>

          <div className="kna-modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>任务名称</label>
              <input className="k-input" defaultValue="Amazon 库存预警 — 美西仓" />
            </div>

            <div>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>使用 Agent</label>
              <div className="k-input" style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, background: "#6F6BF5", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--serif)", fontWeight: 700, fontSize: 11.5,
                }}>商</span>
                <span>电商分析师</span>
                <span style={{ flex: 1 }} />
                <span style={{ width: 14, height: 14, color: "var(--muted)" }}>{CrIc.caret}</span>
              </div>
            </div>

            <div>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>触发频率</label>
              <div style={{ display: "flex", gap: 4 }}>
                {["每天", "每周", "每月", "Cron"].map((f, i) => (
                  <button key={f} className={"btn " + (i === 0 ? "btn-deep" : "btn-subtle") + " btn-sm"} style={{ flex: 1, fontSize: 11.5, padding: "6px 0" }}>{f}</button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>具体时间</label>
              <div style={{
                padding: 14, background: "var(--paper)", border: "1px solid var(--border)",
                borderRadius: 10, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>每天</span>
                <div className="k-input" style={{ width: 80, padding: "6px 10px", fontFamily: "var(--mono)" }}>09</div>
                <span style={{ color: "var(--muted)" }}>:</span>
                <div className="k-input" style={{ width: 80, padding: "6px 10px", fontFamily: "var(--mono)" }}>00</div>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>· 时区 Asia/Shanghai</span>
                <span style={{ flex: 1 }} />
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--coral-deeper)",
                  background: "var(--coral-wash)", padding: "3px 9px", borderRadius: 6,
                }}>0 9 * * *</span>
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>Prompt 模板</label>
              <textarea
                className="k-input"
                rows={4}
                style={{ fontFamily: "var(--serif)", fontSize: 13.5, lineHeight: 1.55 }}
                defaultValue={"检查 Amazon 美西仓库存。\n找出库存周转 < 30 天且当前可用 < 100 件的 SKU，按紧急程度排序，并给出补货建议（含建议数量与到货周期）。"}
              />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                支持 <code style={{ padding: "0 4px", fontSize: 11 }}>{"{{date}}"}</code> · <code style={{ padding: "0 4px", fontSize: 11 }}>{"{{last_result}}"}</code> 变量
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>输出到</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { name: "飞书 · 运营群",   on: true },
                  { name: "邮件 · kai@studio", on: true },
                  { name: "Telegram",        on: false },
                  { name: "Discord",         on: false },
                  { name: "保存为 PDF",       on: false },
                ].map((c) => (
                  <button key={c.name} className={"btn " + (c.on ? "btn-deep" : "btn-subtle") + " btn-sm"} style={{ fontSize: 11.5 }}>
                    {c.on && <span style={{ width: 11, height: 11 }}>{CrIc.check}</span>} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="kna-modal-foot">
            <button className="btn btn-ghost" style={{ color: "var(--muted)" }}>取消</button>
            <span style={{ flex: 1 }} />
            <button className="btn btn-subtle">先存为草稿</button>
            <button className="btn btn-solid">下一步 · 预览首次运行 →</button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ScheduledList, ScheduledModal });
