/* global React, AppFrame, KIcon */
// KNA Agent — Models page (2 frames: provider grid + edit modal)

const ModIc = KIcon;

const PROVIDERS = [
  {
    id: "kna", name: "KNA 中转",
    desc: "RMB 付费 · 国内直连 · 官方价透传",
    email: "kai.zhou@studio.cn",
    model: "claude-sonnet-4-5",
    balance: "$184.50", balanceCny: "¥1,288",
    state: "default",
    recommended: true,
    mark: "K", color: "var(--coral)",
  },
  {
    id: "anthropic", name: "Anthropic 官方",
    desc: "直连 api.anthropic.com · 需要美元卡 + 海外网络",
    email: "kai.zhou@studio.cn",
    model: "claude-opus-4-1",
    balance: "$42.18", balanceCny: "",
    state: "active",
    mark: "A", color: "#0a0a0a",
  },
  {
    id: "openai", name: "OpenAI",
    desc: "GPT-4o / o4 系列 — 用于 fallback 与对比",
    email: "kai.zhou@studio.cn",
    model: "gpt-4o",
    balance: "$8.90", balanceCny: "",
    state: "active",
    mark: "O", color: "#0a8f6e",
  },
  {
    id: "openrouter", name: "OpenRouter",
    desc: "聚合 200+ 模型 · 按需调度 Gemini / Llama / Qwen",
    email: "kna-team@studio.cn",
    model: "auto",
    balance: "$0.00", balanceCny: "",
    state: "inactive",
    mark: "R", color: "#6F6BF5",
  },
];

function ProviderCard({ p }) {
  const isDefault = p.state === "default";
  return (
    <div className={"card" + (isDefault ? " card-coral" : "")} style={{
      padding: 20, position: "relative",
      ...(isDefault ? { borderWidth: 1.5, borderColor: "var(--coral-tint)" } : {}),
    }}>
      {p.recommended && (
        <span style={{
          position: "absolute", top: -10, right: 16,
          fontFamily: "var(--serif)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em",
          padding: "3px 10px", borderRadius: 999, background: "var(--coral-deeper)", color: "#fff",
          textTransform: "uppercase",
        }}>推荐</span>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: p.color,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--serif)", fontWeight: 700, fontSize: 18, flex: "0 0 auto",
        }}>{p.mark}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 className="h3" style={{ fontSize: 16 }}>{p.name}</h3>
            {isDefault && <span style={{
              fontSize: 10.5, fontWeight: 600, color: "var(--coral-deeper)",
              background: "var(--coral-wash)", border: "1px solid var(--coral-tint)",
              padding: "1px 7px", borderRadius: 999, letterSpacing: ".06em",
            }}>默认</span>}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 0", lineHeight: 1.45 }}>{p.desc}</p>
        </div>
        <button style={{ background: "transparent", border: 0, padding: 4, cursor: "pointer", color: "var(--muted)" }}>
          <span style={{ width: 16, height: 16, display: "block" }}>{ModIc.more}</span>
        </button>
      </div>

      <div style={{
        marginTop: 14, padding: "12px 14px", borderRadius: 10,
        background: "var(--paper)", border: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div className="lbl-tiny">账号</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 3, fontFamily: "var(--mono)" }}>{p.email}</div>
          </div>
          {p.state !== "inactive" ? (
            <span className="chip on"><span className="dot" />已连接</span>
          ) : (
            <span className="chip"><span className="dot" />未配置</span>
          )}
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 18 }}>
          <div>
            <div className="lbl-tiny">默认模型</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--ink)", marginTop: 3 }}>{p.model}</div>
          </div>
          <div>
            <div className="lbl-tiny">余额</div>
            <div className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", marginTop: 1 }}>
              {p.balance}{p.balanceCny && <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400, marginLeft: 4 }}>{p.balanceCny}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>设为默认</span>
        <span className={"tog" + (isDefault ? " on" : "")} />
        <span style={{ flex: 1 }} />
        <button className="btn btn-subtle btn-sm">编辑</button>
        {!isDefault && <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)" }}>删除</button>}
      </div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 3 — Models grid
 * ============================================================== */
function ModelsGrid() {
  return (
    <AppFrame active="models" crumb={["KNA Agent", "Models"]} screenLabel="Models · grid">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Models</h1>
          <p className="sub">管理 API Provider · 切换默认模型 · 查看每个账户的余额与配额</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-subtle"><span style={{ width: 13, height: 13 }}>{ModIc.search}</span>测试连接</button>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{ModIc.plus}</span>添加 Provider</button>
        </div>
      </div>

      <div style={{ padding: "0 32px 28px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {PROVIDERS.map((p) => <ProviderCard key={p.id} p={p} />)}
          <div className="add-card" style={{ minHeight: 220 }}>
            <span style={{ width: 28, height: 28, color: "var(--muted)" }}>{ModIc.plus}</span>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>添加 Provider</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>OpenAI · Gemini · DeepSeek · 自定义 endpoint</div>
          </div>
        </div>

        <div style={{
          marginTop: 24, padding: "14px 18px",
          background: "var(--cream-card)", border: "1px solid var(--border)",
          borderRadius: 12, display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ width: 18, height: 18, color: "var(--coral-deep)" }}>{ModIc.shield}</span>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", flex: 1, lineHeight: 1.5 }}>
            <b style={{ color: "var(--ink)" }}>所有 API Key 仅存于本机 Keychain。</b>
            KNA Agent 不会把你的 Anthropic / OpenAI key 上传到任何服务器 — 包括 KNA 自家中转。
          </div>
          <a href="#" style={{ fontSize: 12 }}>查看安全说明</a>
        </div>
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 4 — Edit modal
 * ============================================================== */
function ModelsEditModal() {
  return (
    <AppFrame active="models" crumb={["KNA Agent", "Models", "编辑 · Anthropic 官方"]} screenLabel="Models · edit modal">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Models</h1>
          <p className="sub">管理 API Provider · 切换默认模型 · 查看每个账户的余额与配额</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{ModIc.plus}</span>添加 Provider</button>
        </div>
      </div>
      <div style={{ padding: "0 32px 28px", overflowY: "auto", flex: 1, filter: "blur(1.5px)", pointerEvents: "none", opacity: .6 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {PROVIDERS.slice(0, 4).map((p) => <ProviderCard key={p.id} p={p} />)}
        </div>
      </div>

      <div className="kna-scrim">
        <div className="kna-modal" style={{ width: 560 }}>
          <div className="kna-modal-head">
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "#0a0a0a", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--serif)", fontWeight: 700, marginRight: 12,
            }}>A</div>
            <div>
              <h2 className="h2" style={{ fontSize: 18 }}>编辑 Provider</h2>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>Anthropic 官方 · 直连</div>
            </div>
          </div>
          <div className="kna-modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>Display 名称</label>
              <input className="k-input" defaultValue="Anthropic 官方" />
            </div>
            <div>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>API Endpoint</label>
              <input className="k-input" defaultValue="https://api.anthropic.com" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
            </div>
            <div>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>API Key</label>
              <div style={{ position: "relative" }}>
                <input className="k-input" defaultValue="sk-ant-api03-••••••••••••••••••••••••••••••••••••••••a3d4" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
                <button style={{
                  position: "absolute", right: 6, top: 5, background: "transparent",
                  border: 0, padding: "5px 10px", cursor: "pointer", fontSize: 11.5,
                  color: "var(--coral-deep)", fontWeight: 600,
                }}>显示</button>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>保存到 macOS Keychain · 永不离开本机</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>默认模型</label>
                <div className="k-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>claude-opus-4-1</span>
                  <span style={{ width: 14, height: 14, color: "var(--muted)" }}>{ModIc.caret}</span>
                </div>
              </div>
              <div>
                <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>超时 (秒)</label>
                <input className="k-input" defaultValue="60" style={{ fontFamily: "var(--mono)" }} />
              </div>
            </div>
            <div style={{
              marginTop: 4, padding: "10px 12px", background: "var(--paper)",
              border: "1px solid var(--border)", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#4fae5d" }} />
              <div style={{ flex: 1, fontSize: 12.5, color: "var(--ink-2)" }}>
                连接正常 · 响应 <b className="num">182ms</b>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral-deep)" }}>重新测试</button>
            </div>
          </div>
          <div className="kna-modal-foot">
            <button className="btn btn-ghost" style={{ color: "var(--muted)" }}>取消</button>
            <button className="btn btn-solid">保存</button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ModelsGrid, ModelsEditModal });
