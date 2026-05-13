/* global React, AppFrame, KIcon */
// KNA Agent — Settings page (2 frames: General + Appearance)

const StIc = KIcon;

const SETTINGS_SECTIONS = [
  { id: "general",    label: "General",    icon: StIc.settings },
  { id: "account",    label: "Account",    icon: StIc.bell },
  { id: "appearance", label: "Appearance", icon: StIc.paint },
  { id: "proxy",      label: "Proxy",      icon: StIc.globe },
  { id: "updates",    label: "Updates",    icon: StIc.download },
  { id: "advanced",   label: "Advanced",   icon: StIc.wrench },
];

function SettingsNav({ active }) {
  return (
    <aside style={{
      width: 220, borderRight: "1px solid var(--border)", background: "var(--cream-card)",
      padding: "20px 14px", display: "flex", flexDirection: "column", gap: 1, minHeight: 0,
    }}>
      <div className="lbl-tiny" style={{ padding: "4px 10px 8px" }}>设置</div>
      {SETTINGS_SECTIONS.map((s) => (
        <a key={s.id} href="#" style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500,
          background: active === s.id ? "var(--coral-wash)" : "transparent",
          color: active === s.id ? "var(--coral-deeper)" : "var(--ink-2)",
        }}>
          <span style={{ width: 16, height: 16, color: active === s.id ? "var(--coral-deep)" : "var(--muted)" }}>{s.icon}</span>
          {s.label}
        </a>
      ))}
    </aside>
  );
}

function SettingRow({ label, sub, control }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      <div style={{ flex: "0 0 auto" }}>{control}</div>
    </div>
  );
}

function Group({ title, sub, children }) {
  return (
    <div className="card" style={{ padding: "6px 22px 18px" }}>
      <div style={{ padding: "16px 0 8px" }}>
        <h3 className="h3" style={{ fontSize: 14 }}>{title}</h3>
        {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 13 — General + Account
 * ============================================================== */
function SettingsGeneral() {
  return (
    <AppFrame active="settings" crumb={["KNA Agent", "Settings", "General"]} screenLabel="Settings · general">
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", flex: 1, minHeight: 0 }}>
        <SettingsNav active="general" />
        <div style={{ overflowY: "auto", padding: "24px 32px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1 className="h1" style={{ fontSize: 26 }}>General</h1>
            <p className="sub">应用启动、语言、热键 — 这些设置在重启后立即生效。</p>
          </div>

          <Group title="启动" sub="KNA Agent 在 macOS 启动时的行为">
            <SettingRow
              label="开机自启"
              sub="登录 macOS 时自动启动 KNA Agent · 启动后驻留菜单栏"
              control={<span className="tog on" />}
            />
            <SettingRow
              label="启动后打开"
              sub="窗口启动时显示的页面"
              control={
                <div className="k-input" style={{ width: 180, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", cursor: "pointer" }}>
                  <span>上次离开的页面</span>
                  <span style={{ width: 13, height: 13, color: "var(--muted)" }}>{StIc.caret}</span>
                </div>
              }
            />
            <SettingRow
              label="后台运行"
              sub="关闭窗口时保留菜单栏图标，定时任务继续运行"
              control={<span className="tog on" />}
            />
          </Group>

          <Group title="语言 & 输入" sub="界面文本与默认输入语言">
            <SettingRow
              label="界面语言"
              control={
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-deep btn-sm" style={{ fontSize: 11.5 }}>简体中文</button>
                  <button className="btn btn-subtle btn-sm" style={{ fontSize: 11.5 }}>English</button>
                  <button className="btn btn-subtle btn-sm" style={{ fontSize: 11.5 }}>跟随系统</button>
                </div>
              }
            />
            <SettingRow
              label="智能输入"
              sub="输入时自动识别 URL、邮箱、代码片段并加格式"
              control={<span className="tog on" />}
            />
          </Group>

          <Group title="全局热键" sub="不打开窗口也能呼出 KNA Agent">
            <SettingRow
              label="呼出 Quick Ask"
              sub="任意应用按下快捷键，弹出 Spotlight 风格的输入条"
              control={
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {["⌃", "⇧", "Space"].map((k) => (
                    <kbd key={k} style={{
                      fontFamily: "var(--mono)", fontSize: 11.5, padding: "4px 8px",
                      background: "var(--paper)", border: "1px solid var(--border-strong)",
                      borderBottomWidth: 2, borderRadius: 5, color: "var(--ink)",
                    }}>{k}</kbd>
                  ))}
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-deep)", fontSize: 11.5 }}>修改</button>
                </div>
              }
            />
            <SettingRow
              label="新对话"
              control={
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {["⌘", "N"].map((k) => (
                    <kbd key={k} style={{
                      fontFamily: "var(--mono)", fontSize: 11.5, padding: "4px 8px",
                      background: "var(--paper)", border: "1px solid var(--border-strong)",
                      borderBottomWidth: 2, borderRadius: 5, color: "var(--ink)",
                    }}>{k}</kbd>
                  ))}
                </div>
              }
            />
            <div style={{ padding: "14px 0 4px" }}>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-deep)", padding: 0 }}>查看全部 12 个热键 →</button>
            </div>
          </Group>

          {/* Account preview */}
          <Group title="账户" sub="KNA Claude API 账户 · 用于所有 KNA 中转调用">
            <div style={{ padding: "16px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 11, background: "var(--coral)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontWeight: 700, fontSize: 18,
              }}>K</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>kai.zhou@studio.cn</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>注册于 2025-08 · 累计充值 <span className="num" style={{ color: "var(--ink-2)" }}>¥3,860</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="num" style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>$184.50</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 1 }}>≈ ¥1,288 · 预估 23 天</div>
              </div>
              <button className="btn btn-solid">充值 →</button>
            </div>
          </Group>
        </div>
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 14 — Appearance + Updates
 * ============================================================== */
function SettingsAppearance() {
  return (
    <AppFrame active="settings" crumb={["KNA Agent", "Settings", "Appearance"]} update="available" screenLabel="Settings · appearance + updates">
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", flex: 1, minHeight: 0 }}>
        <SettingsNav active="appearance" />
        <div style={{ overflowY: "auto", padding: "24px 32px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1 className="h1" style={{ fontSize: 26 }}>Appearance</h1>
            <p className="sub">主题、字号、密度 — 让 KNA Agent 看起来像你的工具。</p>
          </div>

          <Group title="主题">
            <div style={{ padding: "14px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { id: "light",   label: "浅色 · 暖纸",  bg: "var(--cream)",  fg: "#1F1B16", active: false },
                { id: "dark",    label: "深色 · 暖灰",  bg: "#252220",       fg: "#FBF8F2", active: false },
                { id: "system",  label: "跟随系统",      bg: "linear-gradient(135deg, var(--cream) 50%, #252220 50%)", fg: "#1F1B16", active: true },
              ].map((t) => (
                <div key={t.id} style={{
                  borderRadius: 12, border: t.active ? "2px solid var(--coral)" : "1px solid var(--border)",
                  padding: 3, background: "var(--paper)", cursor: "pointer", position: "relative",
                }}>
                  <div style={{
                    background: t.bg, borderRadius: 9, height: 88, position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", left: 8, top: 8, width: 36, height: 6, borderRadius: 3, background: "var(--coral)" }} />
                    <div style={{ position: "absolute", left: 8, top: 20, width: 70, height: 4, borderRadius: 2, background: t.fg === "#1F1B16" ? "rgba(31,27,22,0.4)" : "rgba(251,248,242,0.6)" }} />
                    <div style={{ position: "absolute", left: 8, top: 30, width: 56, height: 4, borderRadius: 2, background: t.fg === "#1F1B16" ? "rgba(31,27,22,0.25)" : "rgba(251,248,242,0.35)" }} />
                  </div>
                  <div style={{
                    padding: "8px 10px", fontSize: 12, fontWeight: t.active ? 600 : 500,
                    color: t.active ? "var(--coral-deeper)" : "var(--ink-2)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    {t.label}
                    {t.active && <span style={{ width: 13, height: 13, color: "var(--coral-deep)" }}>{StIc.check}</span>}
                  </div>
                </div>
              ))}
            </div>
            <SettingRow
              label="Coral 强调色"
              sub="贯穿整个应用的 KNA 标识色 · 仅当深色主题下可调整"
              control={
                <div style={{ display: "flex", gap: 6 }}>
                  {["#CC785C", "#B5573A", "#D88A6E", "#A04E2E"].map((c, i) => (
                    <span key={c} style={{
                      width: 22, height: 22, borderRadius: 999, background: c,
                      border: i === 0 ? "2px solid var(--ink)" : "1px solid var(--border)",
                      cursor: "pointer", outline: i === 0 ? "2px solid #fff" : "none", outlineOffset: -3,
                    }} />
                  ))}
                </div>
              }
            />
          </Group>

          <Group title="字体与密度">
            <SettingRow
              label="界面字号"
              sub="基础字号 14px · 当前 15px"
              control={
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: 220 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>A</span>
                  <div style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: "linear-gradient(to right, var(--coral) 0% 45%, var(--border-strong) 45% 100%)",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", left: "45%", top: -6, width: 16, height: 16,
                      borderRadius: 999, background: "#fff", border: "2px solid var(--coral)",
                      transform: "translateX(-50%)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }} />
                  </div>
                  <span style={{ fontSize: 16, color: "var(--ink)" }}>A</span>
                  <span className="num" style={{ fontSize: 12.5, color: "var(--ink-2)", width: 30 }}>15</span>
                </div>
              }
            />
            <SettingRow
              label="侧栏默认折叠"
              sub="启动时 sidebar 仅显图标，hover 弹出标签"
              control={<span className="tog" />}
            />
            <SettingRow
              label="紧凑模式"
              sub="减少消息列表的内边距 — 适合大型屏幕"
              control={<span className="tog" />}
            />
          </Group>

          <Group title="自动更新" sub="当前版本 v0.4.0 (build 2026.05.01)">
            <div style={{
              padding: "14px 0", display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "var(--coral-wash)",
                border: "1px solid var(--coral-tint)", display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--coral-deep)",
              }}>
                <span style={{ width: 18, height: 18, display: "block" }}>{StIc.download}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>有新版本 · v0.4.1</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>修复 Telegram 长消息分片 bug · 新增 Anthropic 1M context · <a href="#">查看更新日志</a></div>
              </div>
              <button className="btn btn-subtle btn-sm">稍后</button>
              <button className="btn btn-solid btn-sm">下载并安装</button>
            </div>
            <SettingRow label="自动检查更新" sub="每 6 小时检查一次" control={<span className="tog on" />} />
            <SettingRow label="自动下载" sub="下载完成后在标题栏提示" control={<span className="tog on" />} />
            <SettingRow label="接收 beta 版本" sub="提前体验新功能 · 可能不稳定" control={<span className="tog" />} />
          </Group>

          <Group title="危险操作" sub="谨慎操作 — 这些动作无法撤销">
            <SettingRow
              label="导出全部数据"
              sub="对话历史 / Agent / Skill 配置 / Channel 凭证 → 加密 zip"
              control={<button className="btn btn-subtle btn-sm">导出…</button>}
            />
            <SettingRow
              label="重置应用"
              sub="清除本机所有 KNA Agent 数据并退出 — 远端账户余额不受影响"
              control={<button className="btn btn-danger btn-sm">重置 KNA Agent</button>}
            />
          </Group>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { SettingsGeneral, SettingsAppearance });
