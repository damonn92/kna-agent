/* global React, AppFrame, KIcon */
// KNA Agent — Agents page (2 frames: grid + full-screen editor)

const AgIc = KIcon;

const AGENTS = [
  { id: "general", name: "通用助手", emoji: "智", color: "var(--coral)", prompt: "你是 KNA Agent 的默认助手，简洁、准确地回答问题，必要时主动调用工具。", skills: 4, model: "claude-sonnet-4-5", isDefault: true },
  { id: "ecom",    name: "电商分析师",  emoji: "商", color: "#6F6BF5", prompt: "你是跨境电商分析师，擅长 Shopify / Amazon / TikTok Shop 选品、定价与库存周转分析。",                          skills: 7, model: "claude-opus-4-1" },
  { id: "writer",  name: "内容编辑",    emoji: "笔", color: "#0a8f6e", prompt: "你是中文内容编辑，遵循 \"先说结论、后给理由\" 的结构。改稿时保留作者语气。",                                   skills: 3, model: "claude-sonnet-4-5" },
  { id: "dev",     name: "前端工程师",  emoji: "码", color: "#1F1B16", prompt: "你是前端工程师，精通 React / TypeScript / Vite。给代码时附简短解释，并优先给出最小可运行示例。",          skills: 5, model: "claude-sonnet-4-5" },
  { id: "ops",     name: "运维助手",    emoji: "运", color: "#B5573A", prompt: "你是 SRE，熟悉 Cloudflare / Vultr / Docker / GitHub Actions。回答时给出 yaml 或 sh 完整片段。",                skills: 6, model: "claude-opus-4-1" },
  { id: "trans",   name: "中英翻译",    emoji: "译", color: "#1677FF", prompt: "你是中英对照翻译。保持原文段落结构，专有名词不翻译，长句拆短。",                                              skills: 1, model: "claude-haiku-4-5" },
];

function AgentCard({ a }) {
  return (
    <div className={"card" + (a.isDefault ? " card-coral" : "")} style={{ padding: 18, position: "relative" }}>
      {a.isDefault && (
        <span style={{
          position: "absolute", top: -10, right: 14,
          fontFamily: "var(--serif)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em",
          padding: "3px 10px", borderRadius: 999, background: "var(--coral-deeper)", color: "#fff", textTransform: "uppercase",
        }}>默认</span>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11, background: a.color,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--serif)", fontWeight: 700, fontSize: 19, flex: "0 0 auto",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.12)",
        }}>{a.emoji}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 className="h3" style={{ fontSize: 15.5 }}>{a.name}</h3>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span className="chip" style={{ fontFamily: "var(--mono)", fontSize: 11, padding: "2px 8px" }}>{a.model}</span>
            <span className="chip" style={{ fontSize: 11, padding: "2px 8px" }}>{a.skills} 技能</span>
          </div>
        </div>
      </div>
      <p style={{
        fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginTop: 12, marginBottom: 14,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{a.prompt}</p>
      <div style={{
        display: "flex", alignItems: "center", paddingTop: 12,
        borderTop: "1px dashed var(--border-strong)", gap: 6,
      }}>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, padding: "5px 9px", color: "var(--ink-2)" }}>
          <span style={{ width: 12, height: 12 }}>{AgIc.edit}</span> 编辑
        </button>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, padding: "5px 9px", color: "var(--ink-2)" }}>
          <span style={{ width: 12, height: 12 }}>{AgIc.copy}</span> 克隆
        </button>
        <span style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, padding: "5px 9px", color: "var(--muted)" }}>
          <span style={{ width: 12, height: 12 }}>{AgIc.trash}</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 5 — Agents grid
 * ============================================================== */
function AgentsGrid() {
  return (
    <AppFrame active="agents" crumb={["KNA Agent", "Agents"]} screenLabel="Agents · grid">
      <div className="kna-pagehead">
        <div>
          <h1 className="h1">Agents</h1>
          <p className="sub">为每个场景配置专属角色 — system prompt、模型、技能组合。在 Chat 中用 @ 唤起。</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-subtle">导入 .agent.json</button>
          <button className="btn btn-solid"><span style={{ width: 13, height: 13 }}>{AgIc.plus}</span>新建 Agent</button>
        </div>
      </div>

      <div style={{
        padding: "0 32px 28px", overflowY: "auto", flex: 1,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
          background: "var(--cream-card)", border: "1px solid var(--border)",
          borderRadius: 10, marginBottom: 18,
        }}>
          <span style={{ width: 14, height: 14, color: "var(--muted)" }}>{AgIc.search}</span>
          <input style={{
            border: 0, outline: 0, background: "transparent", flex: 1,
            fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink)",
          }} placeholder="搜索 agent · system prompt · 技能…" />
          <span style={{ width: 1, height: 16, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{AGENTS.length} 个 Agent</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {AGENTS.map((a) => <AgentCard key={a.id} a={a} />)}
          <div className="add-card" style={{ minHeight: 220 }}>
            <span style={{ width: 28, height: 28, color: "var(--muted)" }}>{AgIc.plus}</span>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>新建 Agent</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>从模板开始 · 或导入 .agent.json</div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 6 — Full-screen editor
 * ============================================================== */
function AgentsEditor() {
  const skills = [
    { name: "Shopify API",   on: true,  src: "KNA" },
    { name: "1688 选品",     on: true,  src: "KNA" },
    { name: "Amazon SP-API", on: true,  src: "Anthropic" },
    { name: "Web 搜索",      on: true,  src: "Anthropic" },
    { name: "PDF 读取",      on: true,  src: "Anthropic" },
    { name: "汇率换算",      on: true,  src: "自定义" },
    { name: "TikTok Shop",   on: true,  src: "KNA" },
    { name: "GitHub PR",     on: false, src: "Anthropic" },
    { name: "Notion 写入",   on: false, src: "GitHub" },
  ];
  return (
    <AppFrame active="agents" crumb={["KNA Agent", "Agents", "编辑 · 电商分析师"]} screenLabel="Agents · full-screen editor">
      <div style={{
        display: "grid", gridTemplateColumns: "320px 1fr", height: "100%", minHeight: 0,
      }}>
        {/* Left column — identity + model */}
        <div style={{
          background: "var(--cream-card)", borderRight: "1px solid var(--border)",
          padding: "22px 22px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18,
        }}>
          <div>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)", padding: 0, fontSize: 12 }}>
              ← 返回 Agents
            </button>
            <h2 className="h2" style={{ fontSize: 22, marginTop: 12 }}>编辑 Agent</h2>
            <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>修改会立即生效；进行中的对话保持当前配置。</p>
          </div>

          <div style={{
            padding: 16, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12,
          }}>
            <div className="lbl-tiny" style={{ marginBottom: 10 }}>头像</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: "#6F6BF5",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontWeight: 700, fontSize: 26,
              }}>商</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-subtle btn-sm">上传图片</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)", padding: "5px 9px", fontSize: 11.5 }}>选 emoji / 汉字</button>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>名称</label>
              <input className="k-input" defaultValue="电商分析师" />
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>路由前缀</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: 9, color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 13 }}>@</span>
                <input className="k-input" defaultValue="电商分析师" style={{ paddingLeft: 26 }} />
              </div>
            </div>
          </div>

          <div style={{
            padding: 16, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12,
          }}>
            <div className="lbl-tiny" style={{ marginBottom: 10 }}>模型</div>
            <div style={{
              padding: "10px 12px", background: "var(--cream-card)", border: "1px solid var(--border)", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--ink)" }}>claude-opus-4-1</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>via KNA · 输入 $15/M · 输出 $75/M</div>
              </div>
              <span style={{ width: 14, height: 14, color: "var(--muted)" }}>{AgIc.caret}</span>
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label className="lbl-tiny" style={{ display: "block", marginBottom: 5 }}>Temperature</label>
                <input className="k-input" defaultValue="0.7" style={{ fontFamily: "var(--mono)" }} />
              </div>
              <div>
                <label className="lbl-tiny" style={{ display: "block", marginBottom: 5 }}>Max tokens</label>
                <input className="k-input" defaultValue="4096" style={{ fontFamily: "var(--mono)" }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" style={{ color: "var(--muted)" }}>取消</button>
            <span style={{ flex: 1 }} />
            <button className="btn btn-subtle">保存为新 Agent</button>
            <button className="btn btn-solid">保存</button>
          </div>
        </div>

        {/* Right column — system prompt + skills */}
        <div style={{ overflowY: "auto", padding: "26px 32px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <h3 className="h3" style={{ fontSize: 15 }}>System Prompt</h3>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>284 / 4000</span>
            </div>
            <div style={{
              background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 12,
              padding: "16px 18px",
              fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.7, color: "var(--ink-2)",
              minHeight: 220, whiteSpace: "pre-wrap",
            }}>
              你是 KNA Agent 的电商分析师，服务于跨境电商团队。{"\n\n"}
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>工作风格</span>：先给结论，再给数据，最后给行动项。每一项行动项都要包含「负责人 / 时间 / 验收标准」。{"\n\n"}
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>数据来源</span>：优先用 Shopify / Amazon SP-API 拉真实数据；当用户问到"市场"，先用 Web 搜索补充行业大盘，再给具体 SKU 建议。{"\n\n"}
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>报表</span>：金额一律 RMB + USD 双列；汇率用 <span style={{ background: "var(--coral-wash)", borderRadius: 4, padding: "0 4px", fontFamily: "var(--mono)", fontSize: 12.5 }}>汇率换算</span> 技能取实时值。
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <h3 className="h3" style={{ fontSize: 15 }}>技能</h3>
              <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>{skills.filter(s => s.on).length} / {skills.length} 已启用</span>
              <span style={{ flex: 1 }} />
              <a href="#" style={{ fontSize: 12 }}>前往 Skills 管理</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {skills.map((s) => (
                <div key={s.name} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 11px", background: s.on ? "var(--paper)" : "transparent",
                  border: "1px solid " + (s.on ? "var(--border)" : "var(--border-strong)"),
                  borderRadius: 9, opacity: s.on ? 1 : 0.55,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: s.on ? "var(--coral)" : "var(--muted-2)" }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 10.5, color: "var(--muted)" }}>来源 · {s.src}</div>
                  </div>
                  <span className={"tog" + (s.on ? " on" : "")} style={{ transform: "scale(.85)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { AgentsGrid, AgentsEditor });
