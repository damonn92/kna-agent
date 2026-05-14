/* global React, AppFrame, KIcon */
// KNA Agent — Skills page (2 frames: installed/detail + market browse)

const SkIc = KIcon;

const INSTALLED = [
  { id: "shopify",  name: "Shopify API",  src: "KNA",       on: true,  emoji: "🛒" },
  { id: "1688",     name: "1688 选品",    src: "KNA",       on: true,  emoji: "📦" },
  { id: "amazon",   name: "Amazon SP-API",src: "KNA",       on: true,  emoji: "📦" },
  { id: "tiktok",   name: "TikTok Shop",  src: "KNA",       on: true,  emoji: "🎵" },
  { id: "fx",       name: "汇率换算",      src: "自定义",   on: true,  emoji: "💱" },
  { id: "websearch",name: "Web 搜索",      src: "Anthropic",on: true,  emoji: "🔎" },
  { id: "pdf",      name: "PDF 读取",      src: "Anthropic",on: true,  emoji: "📄" },
  { id: "code",     name: "代码执行",      src: "Anthropic",on: false, emoji: "⌨︎" },
  { id: "github",   name: "GitHub PR",     src: "Anthropic",on: true,  emoji: "🐙" },
  { id: "notion",   name: "Notion 写入",   src: "GitHub",   on: false, emoji: "📓" },
];

function InstalledList({ activeId = "shopify" }) {
  return (
    <aside style={{
      width: 280, borderRight: "1px solid var(--border)",
      background: "var(--cream-card)", display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{
        padding: "16px 16px 10px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <h3 className="h3" style={{ fontSize: 14 }}>已装技能</h3>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>{INSTALLED.filter(s => s.on).length} 启用 · {INSTALLED.length} 总数</span>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: 9, width: 14, height: 14, color: "var(--muted-2)" }}>{SkIc.search}</span>
          <input className="k-input" placeholder="过滤…" style={{ paddingLeft: 30, fontSize: 12.5, height: 32, padding: "0 12px 0 30px" }} />
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
        {INSTALLED.map((s) => (
          <div key={s.id} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 8, cursor: "pointer",
            background: activeId === s.id ? "var(--coral-wash)" : "transparent",
            border: activeId === s.id ? "1px solid var(--coral-tint)" : "1px solid transparent",
          }}>
            <span style={{ fontSize: 16 }}>{s.emoji}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: 12.5, fontWeight: activeId === s.id ? 600 : 500,
                color: activeId === s.id ? "var(--coral-deeper)" : "var(--ink)",
              }}>{s.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 1 }}>来源 · {s.src}</div>
            </div>
            <span className={"tog" + (s.on ? " on" : "")} style={{ transform: "scale(.78)" }} />
          </div>
        ))}
      </div>
    </aside>
  );
}

function SkillDetail() {
  return (
    <div style={{ overflowY: "auto", padding: "26px 32px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "var(--coral-wash)",
          border: "1px solid var(--coral-tint)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
        }}>🛒</div>
        <div style={{ flex: 1 }}>
          <h1 className="h1" style={{ fontSize: 24 }}>Shopify API</h1>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span className="chip coral"><span className="dot" />KNA 官方</span>
            <span className="chip">v1.2.3</span>
            <span className="chip">12 个工具</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>· 上次更新 4 天前</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 10, maxWidth: 560 }}>
            连接你的 Shopify 店铺，让 Agent 可以查询订单、库存、客户、产品；批量更新价格与标签；导出 CSV 报表到飞书或邮件。
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <span className="chip on" style={{ padding: "4px 12px" }}><span className="dot" />已启用</span>
          <button className="btn btn-subtle btn-sm">配置店铺…</button>
        </div>
      </div>

      <div className="card" style={{ padding: "18px 20px" }}>
        <h3 className="h3" style={{ fontSize: 14 }}>提供的工具</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 12 }}>
          {[
            { n: "shopify.query_orders",       d: "按时间 / 类目 / 状态查询订单 + GMV / 转化率"},
            { n: "shopify.inventory_snapshot", d: "拉取当前库存与历史周转"},
            { n: "shopify.update_price",       d: "批量更新 SKU 价格，支持百分比与绝对值"},
            { n: "shopify.export_csv",         d: "导出报表到飞书 / 邮箱 / 下载"},
            { n: "shopify.add_tag",            d: "给产品 / 客户批量打标签"},
            { n: "shopify.customer_segment",   d: "按消费金额 / 频次 / 新老客划分人群"},
          ].map((t) => (
            <div key={t.n} style={{
              padding: "10px 12px", background: "var(--paper)",
              border: "1px solid var(--border)", borderRadius: 9,
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--coral-deeper)" }}>{t.n}</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.4 }}>{t.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: "18px 20px" }}>
        <h3 className="h3" style={{ fontSize: 14 }}>配置</h3>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>店铺域名</label>
            <input className="k-input" defaultValue="kna-outdoors.myshopify.com" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
          </div>
          <div>
            <label className="lbl-tiny" style={{ display: "block", marginBottom: 6 }}>Access Token</label>
            <input className="k-input" defaultValue="shpat_••••••••••••••••••••••3f9a" style={{ fontFamily: "var(--mono)", fontSize: 12 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================== *
 * FRAME 9 — Installed + detail
 * ============================================================== */
function SkillsInstalled() {
  return (
    <AppFrame active="skills" crumb={["KNA Agent", "Skills", "Shopify API"]} screenLabel="Skills · installed">
      <div style={{
        display: "flex", borderBottom: "1px solid var(--border)",
        background: "var(--cream-card)",
      }}>
        <div className="tabs" style={{ flex: 1, borderBottom: 0, paddingLeft: 32 }}>
          <div className="tab active">已装 · {INSTALLED.length}</div>
          <div className="tab">市场</div>
          <div className="tab">本地开发</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", flex: 1, minHeight: 0 }}>
        <InstalledList />
        <SkillDetail />
      </div>
    </AppFrame>
  );
}

/* ============================================================== *
 * FRAME 10 — Market browse
 * ============================================================== */
const MARKET_CATS = [
  { id: "all",      label: "全部",      count: 124 },
  { id: "ecom",     label: "跨境电商",  count: 18, coral: true },
  { id: "doc",      label: "文档处理",  count: 22 },
  { id: "search",   label: "搜索",      count: 14 },
  { id: "auto",     label: "自动化",    count: 31 },
  { id: "dev",      label: "开发工具",  count: 27 },
  { id: "data",     label: "数据分析",  count: 12 },
];

const KNA_PACK = [
  { name: "Shopify API",  desc: "12 个工具 · 订单 / 库存 / 价格 / 报表", emoji: "🛒", installed: true },
  { name: "Amazon SP-API",desc: "Amazon 卖家中心 · MWS 兼容",            emoji: "📦", installed: true },
  { name: "TikTok Shop",  desc: "短视频电商 · 直播间订单 / 数据",        emoji: "🎵", installed: true },
  { name: "1688 选品",    desc: "供应链反查 · 同款 / 历史价",            emoji: "🏭", installed: true },
  { name: "义乌购",        desc: "小商品批发市场 · 询价 / 起订量",        emoji: "🛍︎", installed: false },
  { name: "速卖通",        desc: "AliExpress 海外店铺管理",                emoji: "🌐", installed: false },
];

const OTHER = [
  { name: "Notion 写入",   desc: "GitHub · 5.2k stars", emoji: "📓", src: "GitHub" },
  { name: "Linear",       desc: "Anthropic 官方 · Issue 同步", emoji: "📐", src: "Anthropic" },
  { name: "飞书多维表格", desc: "KNA · 行/列读写 · 公式注入", emoji: "📊", src: "KNA" },
  { name: "GitHub PR",    desc: "Anthropic · 创建/审阅/合并", emoji: "🐙", src: "Anthropic" },
  { name: "Browser Use",  desc: "GitHub · 真实浏览器操控", emoji: "🌍", src: "GitHub" },
  { name: "Excel 读写",   desc: "Anthropic · xlsx / 公式", emoji: "📑", src: "Anthropic" },
];

function MarketCard({ s, kna }) {
  return (
    <div className={"card" + (kna ? " card-coral" : "")} style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: kna ? "var(--coral-wash)" : "var(--paper)",
          border: "1px solid " + (kna ? "var(--coral-tint)" : "var(--border)"),
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          flex: "0 0 auto",
        }}>{s.emoji}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{s.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, lineHeight: 1.4 }}>{s.desc}</div>
        </div>
      </div>
      {s.installed ? (
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, color: "var(--muted)", justifyContent: "center" }}>
          <span style={{ width: 11, height: 11 }}>{SkIc.check}</span> 已安装
        </button>
      ) : (
        <button className={"btn " + (kna ? "btn-solid" : "btn-subtle") + " btn-sm"} style={{ fontSize: 11.5, justifyContent: "center" }}>
          {kna && <span style={{ width: 11, height: 11 }}>{SkIc.download}</span>} 一键安装
        </button>
      )}
    </div>
  );
}

function SkillsMarket() {
  return (
    <AppFrame active="skills" crumb={["KNA Agent", "Skills", "市场"]} screenLabel="Skills · market">
      <div style={{
        display: "flex", borderBottom: "1px solid var(--border)",
        background: "var(--cream-card)",
      }}>
        <div className="tabs" style={{ flex: 1, borderBottom: 0, paddingLeft: 32 }}>
          <div className="tab">已装 · 10</div>
          <div className="tab active">市场</div>
          <div className="tab">本地开发</div>
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "20px 32px 28px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
          background: "var(--cream-card)", border: "1px solid var(--border)",
          borderRadius: 12, marginBottom: 18,
        }}>
          <span style={{ width: 14, height: 14, color: "var(--muted)" }}>{SkIc.search}</span>
          <input style={{
            border: 0, outline: 0, background: "transparent", flex: 1,
            fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink)",
          }} placeholder="搜索技能 · 工具名 · 关键词…" />
          <span className="chip">官方</span>
          <span className="chip on"><span className="dot" />兼容当前模型</span>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {MARKET_CATS.map((c) => (
            <button key={c.id} className={"btn " + (c.id === "ecom" ? "btn-deep" : "btn-subtle") + " btn-sm"}
              style={{ fontSize: 11.5, padding: "5px 11px" }}>
              {c.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>{c.count}</span>
            </button>
          ))}
        </div>

        {/* KNA cross-border featured */}
        <div style={{
          padding: 18, borderRadius: 14,
          background: "linear-gradient(95deg, var(--coral-wash) 0%, #fff 60%)",
          border: "1px solid var(--coral-tint)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 14, gap: 12 }}>
            <div>
              <div className="pill-label" style={{ color: "var(--coral-deeper)", marginBottom: 4 }}>KNA × 跨境电商</div>
              <h2 className="h2" style={{ fontSize: 20 }}>跨境电商技能包</h2>
              <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "3px 0 0" }}>
                由 KNA 团队维护 · 中国卖家最常用的 6 个平台 · 一键安装即可在 Chat 中使用
              </p>
            </div>
            <span style={{ flex: 1 }} />
            <button className="btn btn-deep btn-sm">全部安装</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {KNA_PACK.map((s) => <MarketCard key={s.name} s={s} kna />)}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <h3 className="h3" style={{ fontSize: 14 }}>热门技能</h3>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>来自社区与 Anthropic 官方</span>
            <span style={{ flex: 1 }} />
            <a href="#" style={{ fontSize: 12 }}>查看全部 →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {OTHER.map((s) => <MarketCard key={s.name} s={{ ...s, installed: false }} />)}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { SkillsInstalled, SkillsMarket });
