/* global React, AppFrame, KIcon */
// KNA Agent — Chat page (2 frames: default convo + thinking/tool_use)

const Ic = KIcon;

const CHAT_CONVS_GROUPS = [
  { when: "今天", items: [
    { id: 1, title: "重构 dashboard 的 keys 表格", t: "10 分钟前", active: true },
    { id: 2, title: "Tokio runtime panics in prod", t: "1 小时前" },
    { id: 3, title: "翻译 PRD · 海外版本", t: "3 小时前" },
  ]},
  { when: "昨天", items: [
    { id: 4, title: "Shopify 选品 — 露营装备 Q2", t: "昨天 17:42" },
    { id: 5, title: "Cloudflare worker 部署脚本", t: "昨天 09:10" },
  ]},
  { when: "本周", items: [
    { id: 6, title: "周会 agenda 草稿", t: "周一" },
    { id: 7, title: "1688 供应商邮件批回复",  t: "上周日" },
  ]},
  { when: "更早", items: [
    { id: 8, title: "Notion → 飞书文档迁移脚本", t: "10 月 28 日" },
  ]},
];

function ChatList({ collapsed }) {
  return (
    <aside style={{
      width: 264, borderRight: "1px solid var(--border)", background: "var(--cream-card)",
      display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--border)" }}>
        <button style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
          padding: "9px 12px", background: "var(--paper)", border: "1px solid var(--border)",
          borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: "var(--ink)",
          cursor: "pointer", fontFamily: "var(--sans)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 14, height: 14 }}>{Ic.plus}</span> 新对话
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>⌘N</span>
        </button>
        <div style={{
          marginTop: 10, position: "relative",
          display: "flex", alignItems: "center",
        }}>
          <span style={{ position: "absolute", left: 10, width: 14, height: 14, color: "var(--muted-2)" }}>{Ic.search}</span>
          <input className="k-input" placeholder="搜索对话…" style={{ paddingLeft: 30, fontSize: 12.5, height: 32, padding: "0 12px 0 30px" }} />
        </div>
      </div>
      <div style={{ overflowY: "auto", padding: "6px 8px", flex: 1 }}>
        {CHAT_CONVS_GROUPS.map((grp, gi) => (
          <div key={gi}>
            <div className="section-head" style={{ padding: "12px 8px 4px" }}>{grp.when}</div>
            {grp.items.map((c) => (
              <div key={c.id} style={{
                padding: "9px 10px", borderRadius: 8, marginBottom: 1, cursor: "pointer",
                background: c.active ? "var(--coral-wash)" : "transparent",
              }}>
                <div style={{ fontSize: 12.5, color: c.active ? "var(--coral-deeper)" : "var(--ink)", fontWeight: c.active ? 600 : 500, lineHeight: 1.3, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.t}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

function RightRail({ agent = "通用助手", model = "claude-sonnet-4-5", skills = ["Web 搜索", "PDF 读取", "Shopify"] }) {
  return (
    <aside style={{
      width: 264, borderLeft: "1px solid var(--border)", background: "var(--cream-card)",
      padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 16,
      minHeight: 0, overflowY: "auto",
    }}>
      <div>
        <div className="lbl-tiny" style={{ marginBottom: 8 }}>当前 Agent</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: 10, background: "var(--paper)", border: "1px solid var(--border)",
          borderRadius: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: "var(--coral)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--serif)", fontWeight: 700, fontSize: 15,
          }}>智</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{agent}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>默认 · 自动路由</div>
          </div>
          <span style={{ color: "var(--muted)", width: 14, height: 14 }}>{Ic.caret}</span>
        </div>
      </div>

      <div>
        <div className="lbl-tiny" style={{ marginBottom: 8 }}>模型</div>
        <div style={{
          padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--border)",
          borderRadius: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}>{model}</div>
            <span style={{ color: "var(--muted)", width: 14, height: 14 }}>{Ic.caret}</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, fontSize: 11, color: "var(--muted)" }}>
            <span>via KNA</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>本对话 <b className="num" style={{ color: "var(--ink-2)", fontWeight: 600 }}>$0.04</b></span>
          </div>
        </div>
      </div>

      <div>
        <div className="lbl-tiny" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>已启用技能</span>
          <span style={{ color: "var(--muted-2)", letterSpacing: 0, textTransform: "none", fontWeight: 500 }}>{skills.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {skills.map((s) => (
            <div key={s} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", background: "var(--paper)",
              border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--ink-2)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--coral)" }} />
              {s}
            </div>
          ))}
          <button style={{
            padding: "7px 10px", background: "transparent",
            border: "1px dashed var(--border-strong)", borderRadius: 8, fontSize: 12,
            color: "var(--muted)", cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)",
          }}>+ 添加技能</button>
        </div>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px dashed var(--border-strong)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)" }}>
          <span>输入 tokens</span>
          <span className="num" style={{ color: "var(--ink-2)" }}>3,184</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>
          <span>输出 tokens</span>
          <span className="num" style={{ color: "var(--ink-2)" }}>1,902</span>
        </div>
      </div>
    </aside>
  );
}

function UserMsg({ children }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18, paddingLeft: 80 }}>
      <div style={{
        background: "var(--cream-card)", border: "1px solid var(--border)", borderRadius: 14,
        padding: "11px 16px", maxWidth: "75%",
        fontSize: 14, lineHeight: 1.55, color: "var(--ink)",
      }}>{children}</div>
    </div>
  );
}

function AsstMsg({ children, streaming = false }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, paddingRight: 60 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, background: "var(--coral)",
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--serif)", fontWeight: 700, fontSize: 14, flex: "0 0 auto",
      }}>K</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Claude · via KNA</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>sonnet-4-5</span>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
          {children}
          {streaming && <span style={{
            display: "inline-block", width: 7, height: 16, background: "var(--coral)",
            verticalAlign: "text-bottom", marginLeft: 2, animation: "kna-blink 1s infinite",
          }} />}
        </div>
      </div>
    </div>
  );
}

function ThinkingBlock({ open = false, summary, content }) {
  return (
    <div style={{
      margin: "10px 0", padding: open ? "10px 14px" : "8px 14px",
      background: "var(--paper)", border: "1px dashed var(--border-strong)",
      borderRadius: 10, fontSize: 13, color: "var(--muted)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontStyle: "italic" }}>
        <span style={{ width: 12, height: 12, color: "var(--muted-2)", transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms" }}>{Ic.chevR}</span>
        <span>{summary}</span>
      </div>
      {open && (
        <div style={{ marginTop: 8, fontStyle: "italic", lineHeight: 1.55, color: "var(--muted)" }}>
          {content}
        </div>
      )}
    </div>
  );
}

function ToolUseBlock({ name, args, result, running = false }) {
  return (
    <div style={{
      margin: "10px 0", border: "1px solid var(--coral-tint)", borderRadius: 10, overflow: "hidden",
      background: "var(--cream-card)",
    }}>
      <div style={{
        padding: "9px 14px", background: "var(--coral-wash)",
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid var(--coral-tint)",
      }}>
        <span style={{ width: 14, height: 14, color: "var(--coral-deep)" }}>{Ic.wrench}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--coral-deeper)" }}>{name}</span>
        {running && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--coral-deep)", display: "flex", alignItems: "center", gap: 5 }}>
            <span className="kna-pulse" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--coral-deep)" }} />
            running…
          </span>
        )}
        {!running && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>0.84s</span>}
      </div>
      <div style={{ padding: "10px 14px", fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.55, whiteSpace: "pre" }}>
        {args}
      </div>
      {result && (
        <div style={{ borderTop: "1px dashed var(--border-strong)", padding: "10px 14px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
          {result}
        </div>
      )}
    </div>
  );
}

function Composer({ value = "", routed = null, ghostText = null }) {
  return (
    <div style={{ padding: "12px 28px 18px" }}>
      <div style={{
        maxWidth: 760, margin: "0 auto", background: "var(--paper)",
        border: "1px solid var(--border)", borderRadius: 14, padding: "10px 12px 8px",
        boxShadow: "var(--shadow-card)",
      }}>
        {routed && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px 3px 8px", borderRadius: 999,
            background: "var(--coral-wash)", border: "1px solid var(--coral-tint)",
            color: "var(--coral-deeper)", fontSize: 11.5, fontWeight: 600, marginBottom: 6,
          }}>
            <span style={{ width: 12, height: 12 }}>{Ic.at}</span>{routed}
            <span style={{ color: "var(--coral-deep)", marginLeft: 2, fontSize: 11 }}>×</span>
          </div>
        )}
        <div style={{
          minHeight: 38, fontFamily: "var(--sans)", fontSize: 14.5, lineHeight: 1.55,
          color: value ? "var(--ink)" : "var(--muted-2)", padding: "4px 2px 2px",
        }}>
          {value || "发消息给 Claude · Cmd+Enter 发送 · / 触发技能 · @ 切换 Agent"}
          {ghostText && <span style={{ color: "var(--muted-2)" }}>{ghostText}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <button style={{ background: "transparent", border: 0, color: "var(--muted)", padding: 5, cursor: "pointer", borderRadius: 6, display: "flex" }}>
            <span style={{ width: 16, height: 16 }}>{Ic.attach}</span>
          </button>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "transparent", border: 0, color: "var(--ink-2)", padding: "4px 8px",
            cursor: "pointer", borderRadius: 6, fontSize: 12, fontFamily: "var(--sans)",
          }}>
            <span style={{ width: 13, height: 13, color: "var(--muted)" }}>{Ic.spark}</span>
            技能
          </button>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "transparent", border: 0, color: "var(--ink-2)", padding: "4px 8px",
            cursor: "pointer", borderRadius: 6, fontSize: 12, fontFamily: "var(--sans)",
          }}>
            <span style={{ width: 13, height: 13, color: "var(--muted)" }}>{Ic.at}</span>
            Agent
          </button>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>3,184 / 200K</span>
          <button style={{
            width: 32, height: 32, borderRadius: 999, background: value ? "var(--coral)" : "var(--coral-tint)",
            color: value ? "#fff" : "var(--coral-deep)", border: 0,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <span style={{ width: 14, height: 14 }}>{Ic.send}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 1 — Default chat conversation
 * ============================================================== */
function ChatDefault() {
  return (
    <AppFrame active="chat" crumb={["KNA Agent", "Chat", "重构 dashboard 的 keys 表格"]} screenLabel="Chat · default">
      <style>{`@keyframes kna-blink { 0%,100% { opacity:0 } 50% { opacity:1 } }`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "264px 1fr 264px", minHeight: 0, height: "100%" }}>
        <ChatList />
        <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{
            padding: "14px 28px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12, background: "var(--cream-card)",
          }}>
            <h2 className="h3" style={{ flex: 1, fontSize: 15 }}>重构 dashboard 的 keys 表格</h2>
            <span className="chip"><span className="dot" style={{ background: "var(--coral)" }} />通用助手</span>
            <span className="chip"><b>$0.04</b> 本对话</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 8px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <UserMsg>帮我看下这段 React 代码 — table 的 sort 不工作。columns 是动态的。</UserMsg>
              <AsstMsg>
                问题在于 <code>useMemo</code> 的依赖数组里没有 <code>columns</code>。你把它作为参数传进来，但 hook 只在 <code>data</code> 变化时重算 — 新的排序方向永远不会进入 memoized 结果。
                <br /><br />
                把依赖改成 <code>[data, columns, direction]</code>，并确保 <code>sortBy</code> 是稳定引用即可。
              </AsstMsg>
              <UserMsg>好的，那 prefix sort 怎么处理 — 比如 "production-" 开头的优先？</UserMsg>
              <AsstMsg>
                在比较函数里先按 prefix 分桶。下面是一个最小实现：
                <pre style={{ marginTop: 10, marginBottom: 4 }}>{`function byPrefix(a, b, prefix = "production-") {
  const ap = a.name.startsWith(prefix);
  const bp = b.name.startsWith(prefix);
  if (ap !== bp) return ap ? -1 : 1;
  return a.name.localeCompare(b.name, "zh");
}`}</pre>
                把它接到 <code>sort()</code> 上即可。需要的话我可以直接改你贴的代码段。
              </AsstMsg>
            </div>
          </div>
          <Composer value="把它接上 — 顺便加一个 hover 时的 row highlight 用 coral-wash 色" />
        </section>
        <RightRail />
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 2 — Thinking + tool_use streaming state
 * ============================================================== */
function ChatStreaming() {
  return (
    <AppFrame active="chat" crumb={["KNA Agent", "Chat", "Shopify 选品 — 露营装备 Q2"]} screenLabel="Chat · streaming with tool use">
      <style>{`@keyframes kna-blink { 0%,100% { opacity:0 } 50% { opacity:1 } }
        @keyframes kna-pulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
        .kna-pulse { animation: kna-pulse 1.2s infinite }`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "264px 1fr 264px", minHeight: 0, height: "100%" }}>
        <ChatList />
        <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{
            padding: "14px 28px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12, background: "var(--cream-card)",
          }}>
            <h2 className="h3" style={{ flex: 1, fontSize: 15 }}>Shopify 选品 — 露营装备 Q2</h2>
            <span className="chip coral"><span className="dot" style={{ background: "var(--coral-deep)" }} />跨境电商 · Shopify</span>
            <span className="chip"><b>$0.12</b> 本对话</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 8px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <UserMsg>帮我看一下 Q2 露营装备类目，找出 GMV 增长 &gt; 30% 但库存周转 &lt; 4 次的 SKU，给出降价或清仓建议。</UserMsg>
              <AsstMsg streaming>
                <ThinkingBlock
                  open
                  summary="正在思考 · 已用 4.2 秒"
                  content={<>用户要的是交叉过滤 — 高增长 + 慢周转，这通常意味着热销但备货过深的 SKU。我需要先拿到 Q2 销售数据和当前库存快照，按类目过滤到 "outdoor/camping"，再算两个比率…</>}
                />
                <ToolUseBlock
                  name="shopify.query_orders"
                  args={`{
  "shop":     "kna-outdoors.myshopify.com",
  "category": "outdoor/camping",
  "range":    "2026-04-01..2026-06-30",
  "metric":   ["gmv","yoy_growth","turnover"]
}`}
                  result={<>返回 47 个 SKU · GMV 总额 <span className="num">¥1,284,300</span> · 平均增长 <span className="num">+38%</span></>}
                />
                <ToolUseBlock
                  name="shopify.inventory_snapshot"
                  args={`{ "shop": "kna-outdoors.myshopify.com", "skus": [..47 ids..] }`}
                  running
                />
                <div>找到了 47 个候选 SKU。正在拉取当前库存快照，下一步会按 GMV 增长率 &gt; 30%</div>
              </AsstMsg>
            </div>
          </div>
          <Composer routed="@电商分析师" value="" ghostText="（Agent 正在响应…）" />
        </section>
        <RightRail agent="电商分析师" model="claude-sonnet-4-5" skills={["Shopify", "1688 选品", "汇率换算", "PDF 报表"]} />
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ChatDefault, ChatStreaming });
