import React, { useState, useEffect, useMemo } from "react";

/* ------------------------------------------------------------------ *
 *  Turnstile - a proof-gated path from a single algebraic structure
 *  to the point where type theory and category theory meet.
 *  No prerequisites beyond patience: every idea is built up in place.
 * ------------------------------------------------------------------ */

const C = {
  bg: "#E8EBF0",
  grid: "#D6DCE6",
  panel: "#FCFDFE",
  ink: "#16203A",
  soft: "#5A6480",
  rule: "#BFC8D8",
  syn: "#6A3FA0",
  str: "#0F766E",
  gate: "#A2560F",
  ok: "#1A6B4C",
};

const CSS = `
.ctt *{box-sizing:border-box}
.ctt{
  --ink:${C.ink}; --soft:${C.soft}; --rule:${C.rule}; --panel:${C.panel};
  --syn:${C.syn}; --str:${C.str}; --gate:${C.gate}; --ok:${C.ok};
  background-color:${C.bg};
  background-image:linear-gradient(${C.grid} 1px,transparent 1px),linear-gradient(90deg,${C.grid} 1px,transparent 1px);
  background-size:26px 26px;
  color:var(--ink);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size:16px; line-height:1.6; min-height:100vh;
}
.ctt .wrap{max-width:780px;margin:0 auto;padding:0 18px 90px}
.ctt .serif{font-family:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif}
.ctt .m{font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;font-size:.93em;
  background:rgba(22,32,58,.055);border-radius:3px;padding:.05em .3em;overflow-wrap:break-word}
@media(max-width:420px){.ctt table.dict{font-size:13px}.ctt table.dict td{padding:6px 4px}}
.ctt .eyebrow{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);font-weight:600}

/* header */
.ctt header.bar{position:sticky;top:0;z-index:20;backdrop-filter:blur(8px);
  background:rgba(232,235,240,.86);border-bottom:1px solid var(--rule)}
.ctt .bar-in{max-width:780px;margin:0 auto;padding:9px 18px;display:flex;align-items:center;gap:12px}
.ctt .mark{font-family:ui-monospace,monospace;font-weight:700;letter-spacing:-.02em}
.ctt .ghost{font:inherit;font-size:13px;background:none;border:1px solid var(--rule);color:var(--soft);
  border-radius:2px;padding:4px 9px;cursor:pointer}
.ctt .ghost:hover{border-color:var(--ink);color:var(--ink)}
.ctt .meter{flex:1;height:3px;background:var(--rule);position:relative;overflow:hidden}
.ctt .meter i{position:absolute;inset:0 auto 0 0;background:var(--ink);transition:width .5s ease}

/* hero */
.ctt h1.hero{font-size:clamp(30px,8vw,46px);line-height:1.05;margin:34px 0 0;font-weight:400;letter-spacing:-.02em}
.ctt h1.hero em{font-style:italic}
.ctt .lede{color:var(--soft);margin:14px 0 0;max-width:52ch}
.ctt .lede b{color:var(--ink);font-weight:600}

/* map: list (mobile) */
.ctt .track-h{display:flex;align-items:baseline;gap:10px;margin:34px 0 12px}
.ctt .track-h span.k{width:9px;height:9px;border-radius:50%;display:inline-block}
.ctt .rail{border-left:1px solid var(--rule);margin-left:4px;padding-left:18px}
.ctt .card{position:relative;display:block;width:100%;text-align:left;font:inherit;cursor:pointer;
  background:var(--panel);border:1px solid var(--rule);border-radius:3px;padding:12px 14px;margin:0 0 10px}
.ctt .card:before{content:"";position:absolute;left:-19px;top:24px;width:18px;height:1px;background:var(--rule)}
.ctt .card:hover{border-color:var(--ink)}
.ctt .card.locked{cursor:not-allowed;background:transparent;border-style:dashed;color:var(--soft)}
.ctt .card.locked:hover{border-color:var(--rule)}
.ctt .card.done{border-left:3px solid var(--ok)}
.ctt .card .t{font-size:17px;letter-spacing:-.01em}
.ctt .card .s{font-size:13.5px;color:var(--soft);margin-top:3px}
.ctt .qed{float:right;color:var(--ok);font-family:ui-monospace,monospace}
.ctt .lockw{float:right;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--soft)}

/* map: graph (wide) */
.ctt .graph{display:none}
@media(min-width:820px){
  .ctt .graph{display:block;margin:28px 0 0}
  .ctt .listmap{display:none}
  .ctt .wrap{max-width:860px}
  .ctt header .bar-in{max-width:860px}
}
.ctt .graph svg{width:100%;height:auto}
.ctt .gn{cursor:pointer}
.ctt .gn.locked{cursor:not-allowed}
.ctt .gn rect{transition:fill .2s,stroke .2s}
.ctt .gn:hover rect.box{fill:#fff;stroke:var(--ink)}
.ctt .gn.locked:hover rect.box{fill:none;stroke:var(--rule)}

/* legend */
.ctt .legend{display:flex;flex-wrap:wrap;gap:16px;font-size:12.5px;color:var(--soft);
  border-top:1px solid var(--rule);margin-top:26px;padding-top:12px}

/* node page */
.ctt .backlink{font:inherit;font-size:13px;background:none;border:0;color:var(--soft);cursor:pointer;padding:18px 0 0}
.ctt .backlink:hover{color:var(--ink)}
.ctt h2.node{font-size:clamp(26px,6.4vw,36px);font-weight:400;line-height:1.1;margin:6px 0 0;letter-spacing:-.02em}
.ctt .thesis{margin:12px 0 0;font-size:18px}
.ctt .why{margin:18px 0 0;padding:11px 13px;border:1px solid var(--rule);border-left:3px solid var(--gate);
  background:var(--panel);font-size:14.5px}
.ctt .why b{font-variant:small-caps;letter-spacing:.04em;font-weight:600}
.ctt h3.sec{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--soft);
  border-bottom:1px solid var(--rule);padding-bottom:6px;margin:40px 0 16px;font-weight:600}
.ctt .box{background:var(--panel);border:1px solid var(--rule);border-radius:3px;padding:13px 15px;margin:0 0 12px}
.ctt .box.def{border-left:3px solid var(--syn)}
.ctt .box.thm{border-left:3px solid var(--str)}
.ctt .lab{font-weight:600;font-variant:small-caps;letter-spacing:.05em}
.ctt .box p{margin:6px 0 0}
.ctt .note{font-size:14px;color:var(--soft);margin-top:8px}
.ctt details.pf{margin-top:10px;border-top:1px dashed var(--rule);padding-top:8px}
.ctt details.pf summary{cursor:pointer;font-size:13px;color:var(--soft);letter-spacing:.04em}
.ctt details.pf summary:hover{color:var(--ink)}
.ctt details.pf .body{font-size:14.5px;margin-top:8px}
.ctt ul.ex{list-style:none;padding:0;margin:0}
.ctt ul.ex li{border-top:1px solid var(--rule);padding:11px 0}
.ctt ul.ex li:last-child{border-bottom:1px solid var(--rule)}
.ctt ul.ex .h{font-weight:600;font-size:15px}
.ctt figure{margin:18px 0 0;text-align:center}
.ctt figure svg{width:100%;max-width:470px;height:auto}
.ctt figcaption{font-size:13px;color:var(--soft);margin-top:8px;text-align:left}
.ctt table.dict{width:100%;border-collapse:collapse;font-size:14.5px}
.ctt table.dict td,.ctt table.dict th{border-bottom:1px solid var(--rule);padding:7px 6px;text-align:left;vertical-align:top}
.ctt table.dict th{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--soft);font-weight:600}

/* quiz */
.ctt .q{margin:0 0 20px}
.ctt .q .stem{font-weight:500}
.ctt .opt{display:block;width:100%;text-align:left;font:inherit;font-size:15px;background:var(--panel);
  border:1px solid var(--rule);border-radius:3px;padding:9px 12px;margin:8px 0 0;cursor:pointer}
.ctt .opt:hover{border-color:var(--ink)}
.ctt .opt.good{border-color:var(--ok);box-shadow:inset 3px 0 0 var(--ok)}
.ctt .opt.bad{border-color:#9C2B2B;box-shadow:inset 3px 0 0 #9C2B2B;opacity:.75}
.ctt .opt:disabled{cursor:default}
.ctt .why-q{font-size:14px;color:var(--soft);margin:8px 0 0;padding-left:2px}

/* gate: the inference rule */
.ctt .gate{border:1px solid var(--rule);background:var(--panel);border-radius:3px;padding:16px;margin-top:14px}
.ctt .gate.shut{border-style:dashed;background:transparent}
.ctt .premises{min-height:34px;display:flex;flex-direction:column;gap:5px}
.ctt .prem{font-size:14.5px;display:flex;gap:9px;align-items:flex-start;animation:snap .22s ease}
.ctt .prem .n{font-family:ui-monospace,monospace;font-size:11.5px;color:var(--soft);padding-top:3px;min-width:16px}
.ctt .empty{font-size:14px;color:var(--soft);font-style:italic}
.ctt .rulebar{height:1.5px;background:var(--ink);margin:12px 0;width:34%;transition:width .5s ease}
.ctt .rulebar.full{width:100%}
.ctt .concl{font-size:15.5px}
.ctt .concl.hidden{color:var(--soft);font-style:italic;font-size:14px}
.ctt .tokens{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.ctt .tok{text-align:left;font:inherit;font-size:14.5px;background:#fff;border:1px solid var(--rule);
  border-radius:3px;padding:9px 12px;cursor:pointer}
.ctt .tok:hover{border-color:var(--ink)}
.ctt .tok.wrong{animation:shake .3s;border-color:#9C2B2B}
.ctt .strikes{font-family:ui-monospace,monospace;font-size:12.5px;color:var(--soft);margin-top:12px;
  display:flex;justify-content:space-between;gap:12px}
.ctt .done-banner{border:1px solid var(--ok);border-left:3px solid var(--ok);background:var(--panel);
  padding:12px 14px;margin-top:14px;font-size:15px}
.ctt .next{display:inline-block;font:inherit;font-size:14px;background:var(--ink);color:#fff;border:0;
  border-radius:2px;padding:8px 14px;margin-top:12px;cursor:pointer}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes snap{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.ctt *{animation:none!important;transition:none!important}}

/* notation sheet */
.ctt .sheet{position:fixed;inset:0;z-index:40;background:rgba(22,32,58,.4);display:flex;
  align-items:flex-end;justify-content:center}
.ctt .sheet-in{background:${C.bg};max-width:780px;width:100%;max-height:86vh;overflow:auto;
  border-top:2px solid var(--ink);padding:18px 18px 40px}
.ctt :focus-visible{outline:2px solid var(--syn);outline-offset:2px}
`;

/* ---------- inline markup: `mono` and *italic* ---------- */
function Rich({ t }) {
  const parts = String(t).split(/(`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? (
          <span className="m" key={i}>{p.slice(1, -1)}</span>
        ) : p.startsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

/* ---------- diagram primitives ---------- */
const MK = ({ id, c }) => (
  <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
    <path d="M0.5,1 L9,5 L0.5,9" fill="none" stroke={c} strokeWidth="1.6" />
  </marker>
);
const Defs = () => (
  <defs>
    <MK id="a-ink" c={C.ink} />
    <MK id="a-syn" c={C.syn} />
    <MK id="a-str" c={C.str} />
    <MK id="a-soft" c={C.soft} />
  </defs>
);
const COL = { ink: C.ink, syn: C.syn, str: C.str, soft: C.soft };

function Ar({ x1, y1, x2, y2, c = "ink", dash, bend = 0, label, lx = 0, ly = -7, both }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * bend, cy = my + (dx / len) * bend;
  return (
    <g>
      <path
        d={bend ? `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` : `M${x1},${y1} L${x2},${y2}`}
        fill="none" stroke={COL[c]} strokeWidth="1.3"
        strokeDasharray={dash ? "4 3" : undefined}
        markerEnd={`url(#a-${c})`} markerStart={both ? `url(#a-${c})` : undefined}
      />
      {label && (
        <text x={cx + lx} y={cy + ly} fill={COL[c]} fontSize="13" textAnchor="middle"
          fontFamily="ui-monospace,monospace">{label}</text>
      )}
    </g>
  );
}
const Ob = ({ x, y, t, c = "ink", size = 15, anchor = "middle" }) => (
  <text x={x} y={y} fill={COL[c]} fontSize={size} textAnchor={anchor}
    fontFamily='"Iowan Old Style",Palatino,Georgia,serif' fontStyle="italic">{t}</text>
);
const Dot = ({ x, y, c = "ink", r = 3.4 }) => <circle cx={x} cy={y} r={r} fill={COL[c]} />;

/* ---------- the figures ---------- */
function Figure({ kind }) {
  const S = (w, h, ch) => (
    <svg viewBox={`0 0 ${w} ${h}`} role="img"><Defs />{ch}</svg>
  );
  switch (kind) {
    case "monoid":
      return S(400, 200, <>
        <Dot x={200} y={120} r={4.5} />
        <text x={200} y={148} textAnchor="middle" fontSize="13" fill={C.soft} fontFamily="ui-monospace,monospace">one object: •</text>
        <path d="M200,120 C120,120 120,40 200,44" fill="none" stroke={C.syn} strokeWidth="1.3" markerEnd="url(#a-syn)" />
        <path d="M200,120 C280,120 280,40 200,44" fill="none" stroke={C.str} strokeWidth="1.3" markerEnd="url(#a-str)" />
        <path d="M200,120 C260,178 140,178 200,120" fill="none" stroke={C.soft} strokeWidth="1.3" markerEnd="url(#a-soft)" />
        <text x={128} y={72} fontSize="13" fill={C.syn} fontFamily="ui-monospace,monospace">m</text>
        <text x={262} y={72} fontSize="13" fill={C.str} fontFamily="ui-monospace,monospace">n</text>
        <text x={200} y={40} textAnchor="middle" fontSize="13" fill={C.ink} fontFamily="ui-monospace,monospace">m · n</text>
        <text x={200} y={192} textAnchor="middle" fontSize="13" fill={C.soft} fontFamily="ui-monospace,monospace">e = id</text>
      </>);
    case "judgment":
      return S(400, 190, <>
        <text x={90} y={46} textAnchor="middle" fontSize="14" fill={C.ink} fontFamily="ui-monospace,monospace">Γ ⊢ f : A→B</text>
        <text x={280} y={46} textAnchor="middle" fontSize="14" fill={C.ink} fontFamily="ui-monospace,monospace">Γ ⊢ a : A</text>
        <line x1="30" y1="66" x2="345" y2="66" stroke={C.ink} strokeWidth="1.5" />
        <text x={358} y={70} fontSize="12" fill={C.soft} fontFamily="ui-monospace,monospace">App</text>
        <text x={185} y={92} textAnchor="middle" fontSize="14" fill={C.ink} fontFamily="ui-monospace,monospace">Γ ⊢ f a : B</text>
        <text x={30} y={132} fontSize="13" fill={C.soft}>Premises above the bar, conclusion below.</text>
        <text x={30} y={154} fontSize="13" fill={C.soft}>Read ⊢ as “in context Γ, we may derive”.</text>
        <text x={30} y={176} fontSize="13" fill={C.soft}>Stack rules on rules: that stack is a derivation.</text>
      </>);
    case "arrow":
      return S(400, 200, <>
        <rect x="30" y="52" width="70" height="52" fill="none" stroke={C.rule} />
        <Ob x={65} y={84} t="A" />
        <rect x="300" y="52" width="70" height="52" fill="none" stroke={C.rule} />
        <Ob x={335} y={84} t="B" />
        <rect x="152" y="60" width="96" height="36" fill={C.panel} stroke={C.syn} />
        <text x={200} y={83} textAnchor="middle" fontSize="13" fill={C.syn} fontFamily="ui-monospace,monospace">λx. body</text>
        <Ar x1={102} y1={78} x2={148} y2={78} label="a" ly={-8} />
        <Ar x1={250} y1={78} x2={296} y2={78} label="f a" ly={-8} />
        <text x={200} y={140} textAnchor="middle" fontSize="13" fill={C.soft}>A term of type `A→B` is a black box:</text>
        <text x={200} y={162} textAnchor="middle" fontSize="13" fill={C.soft} fontFamily="ui-monospace,monospace">(λx. t) a  ⟶β  t[a/x]</text>
      </>);
    case "prodsum":
      return S(400, 210, <>
        <text x={95} y={22} textAnchor="middle" fontSize="12" fill={C.soft} letterSpacing="1.4">A × B</text>
        {[0, 1, 2].flatMap((i) => [0, 1].map((j) => (
          <rect key={`${i}${j}`} x={40 + i * 38} y={40 + j * 38} width="36" height="36" fill="none" stroke={C.rule} />
        )))}
        <Dot x={96} y={96} c="syn" />
        <text x={95} y={168} textAnchor="middle" fontSize="12.5" fill={C.soft} fontFamily="ui-monospace,monospace">3 · 2 = 6 pairs</text>
        <text x={95} y={188} textAnchor="middle" fontSize="12.5" fill={C.soft} fontFamily="ui-monospace,monospace">⟨a, b⟩</text>
        <line x1="200" y1="20" x2="200" y2="196" stroke={C.rule} strokeDasharray="3 4" />
        <text x={300} y={22} textAnchor="middle" fontSize="12" fill={C.soft} letterSpacing="1.4">A + B</text>
        <ellipse cx="266" cy="72" rx="44" ry="26" fill="none" stroke={C.rule} />
        <ellipse cx="336" cy="126" rx="44" ry="26" fill="none" stroke={C.rule} />
        <text x={266} y={77} textAnchor="middle" fontSize="13" fill={C.str} fontFamily="ui-monospace,monospace">inl a</text>
        <text x={336} y={131} textAnchor="middle" fontSize="13" fill={C.str} fontFamily="ui-monospace,monospace">inr b</text>
        <text x={300} y={168} textAnchor="middle" fontSize="12.5" fill={C.soft} fontFamily="ui-monospace,monospace">3 + 2 = 5 tags</text>
        <text x={300} y={188} textAnchor="middle" fontSize="12.5" fill={C.soft}>disjoint, never both</text>
      </>);
    case "nat":
      return S(400, 200, <>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={26 + i * 84} y={116 - i * 26} width="60" height={26 + i * 26} fill="none" stroke={C.rule} />
            <text x={56 + i * 84} y={134 - i * 26 + 8} textAnchor="middle" fontSize="13" fill={C.ink} fontFamily="ui-monospace,monospace">
              {["0", "S 0", "S S 0", "S S S 0"][i]}
            </text>
          </g>
        ))}
        <Ar x1={90} y1={104} x2={112} y2={104} c="syn" />
        <Ar x1={174} y1={78} x2={196} y2={78} c="syn" />
        <Ar x1={258} y1={52} x2={280} y2={52} c="syn" />
        <text x={200} y={176} textAnchor="middle" fontSize="13" fill={C.soft}>Every `ℕ` is reached exactly once - so recursion</text>
        <text x={200} y={194} textAnchor="middle" fontSize="13" fill={C.soft}>on this staircase defines a total function.</text>
      </>);
    case "fibers":
      return S(400, 210, <>
        <line x1="40" y1="164" x2="360" y2="164" stroke={C.ink} strokeWidth="1.3" />
        <text x={370} y={168} fontSize="14" fill={C.ink} fontFamily='Palatino,Georgia,serif' fontStyle="italic">A</text>
        {[0, 1, 2, 3].map((i) => {
          const x = 80 + i * 70, h = [40, 74, 56, 96][i];
          return (
            <g key={i}>
              <Dot x={x} y={164} />
              <line x1={x} y1={164} x2={x} y2={164 - h} stroke={C.syn} strokeWidth="1.3" />
              <ellipse cx={x} cy={164 - h} rx="15" ry="7" fill="none" stroke={C.syn} />
              <text x={x} y={164 - h - 14} textAnchor="middle" fontSize="12" fill={C.syn} fontFamily="ui-monospace,monospace">
                {["B x₀", "B x₁", "B x₂", "B x₃"][i]}
              </text>
            </g>
          );
        })}
        <text x={40} y={30} fontSize="13" fill={C.soft}>A family `B : A → Type` - the type varies with the point.</text>
        <text x={40} y={196} fontSize="13" fill={C.soft}>`Π(x:A) B x` picks one point per fiber; `Σ(x:A) B x` is the whole space.</text>
      </>);
    case "category":
      return S(400, 210, <>
        <Dot x={70} y={150} /><Ob x={62} y={172} t="A" />
        <Dot x={200} y={60} /><Ob x={200} y={44} t="B" />
        <Dot x={330} y={150} /><Ob x={340} y={172} t="C" />
        <Ar x1={78} y1={144} x2={192} y2={66} label="f" lx={-12} ly={-4} />
        <Ar x1={208} y1={66} x2={322} y2={144} label="g" lx={14} ly={-2} />
        <Ar x1={80} y1={154} x2={320} y2={154} c="syn" label="g ∘ f" ly={18} />
        <path d="M62,142 C40,120 78,112 78,140" fill="none" stroke={C.soft} strokeWidth="1.2" markerEnd="url(#a-soft)" />
        <text x={38} y={112} fontSize="12" fill={C.soft} fontFamily="ui-monospace,monospace">id_A</text>
        <text x={30} y={196} fontSize="13" fill={C.soft}>Composition is associative; identities do nothing.</text>
      </>);
    case "functor":
      return S(400, 210, <>
        <rect x="14" y="30" width="150" height="150" fill="none" stroke={C.rule} />
        <text x={22} y={22} fontSize="12" fill={C.soft} letterSpacing="1.2">𝒞</text>
        <Dot x={54} y={72} /><Ob x={44} y={68} t="A" anchor="end" />
        <Dot x={124} y={140} /><Ob x={134} y={146} t="B" anchor="start" />
        <Ar x1={60} y1={78} x2={118} y2={134} label="f" lx={-10} ly={2} />
        <rect x="236" y="30" width="150" height="150" fill="none" stroke={C.rule} />
        <text x={244} y={22} fontSize="12" fill={C.soft} letterSpacing="1.2">𝒟</text>
        <Dot x={276} y={72} c="str" /><Ob x={266} y={68} t="F A" c="str" anchor="end" />
        <Dot x={346} y={140} c="str" /><Ob x={356} y={146} t="F B" c="str" anchor="start" />
        <Ar x1={282} y1={78} x2={340} y2={134} c="str" label="F f" lx={-14} ly={2} />
        <Ar x1={170} y1={105} x2={230} y2={105} c="soft" dash label="F" ly={-8} />
        <text x={200} y={200} textAnchor="middle" fontSize="13" fill={C.soft}>`F(g ∘ f) = F g ∘ F f` and `F(id) = id`.</text>
      </>);
    case "naturality":
      return S(400, 200, <>
        <Ob x={80} y={50} t="F X" c="syn" /><Ob x={300} y={50} t="G X" c="str" />
        <Ob x={80} y={160} t="F Y" c="syn" /><Ob x={300} y={160} t="G Y" c="str" />
        <Ar x1={112} y1={44} x2={268} y2={44} label="α_X" ly={-8} />
        <Ar x1={112} y1={154} x2={268} y2={154} label="α_Y" ly={20} />
        <Ar x1={74} y1={62} x2={74} y2={140} c="syn" label="F f" lx={-26} ly={4} />
        <Ar x1={294} y1={62} x2={294} y2={140} c="str" label="G f" lx={26} ly={4} />
        <text x={190} y={104} textAnchor="middle" fontSize="20" fill={C.soft}>⟳</text>
        <text x={200} y={192} textAnchor="middle" fontSize="13" fill={C.soft}>One square per morphism `f : X → Y`; all of them commute.</text>
      </>);
    case "cone":
      return S(400, 210, <>
        <Ob x={200} y={40} t="X" />
        <Ob x={200} y={116} t="A × B" c="str" />
        <Ob x={60} y={180} t="A" /><Ob x={340} y={180} t="B" />
        <Ar x1={196} y1={54} x2={196} y2={100} c="syn" dash label="∃! u" lx={30} ly={4} />
        <Ar x1={188} y1={126} x2={74} y2={168} label="π₁" lx={-6} ly={-6} />
        <Ar x1={216} y1={126} x2={328} y2={168} label="π₂" lx={8} ly={-6} />
        <Ar x1={190} y1={46} x2={62} y2={166} c="soft" bend={26} label="f" lx={-16} ly={0} />
        <Ar x1={212} y1={46} x2={338} y2={166} c="soft" bend={-26} label="g" lx={16} ly={0} />
        <text x={200} y={202} textAnchor="middle" fontSize="13" fill={C.soft}>Any pair `(f, g)` factors through `A × B` in exactly one way.</text>
      </>);
    case "adjunction":
      return S(400, 200, <>
        <rect x="20" y="46" width="150" height="52" fill={C.panel} stroke={C.rule} />
        <text x={95} y={78} textAnchor="middle" fontSize="13.5" fill={C.ink} fontFamily="ui-monospace,monospace">𝒟(F A, B)</text>
        <rect x="230" y="46" width="150" height="52" fill={C.panel} stroke={C.rule} />
        <text x={305} y={78} textAnchor="middle" fontSize="13.5" fill={C.ink} fontFamily="ui-monospace,monospace">𝒞(A, G B)</text>
        <Ar x1={176} y1={72} x2={224} y2={72} c="syn" both label="≅" ly={-9} />
        <text x={200} y={124} textAnchor="middle" fontSize="13" fill={C.soft}>natural in both `A` and `B`</text>
        <Ar x1={110} y1={158} x2={290} y2={158} c="str" label="F  (left)" ly={-8} />
        <Ar x1={290} y1={182} x2={110} y2={182} c="str" label="G  (right)" ly={16} />
      </>);
    case "monad":
      return S(400, 200, <>
        <Ob x={72} y={46} t="T T T X" /><Ob x={300} y={46} t="T T X" />
        <Ob x={72} y={156} t="T T X" /><Ob x={300} y={156} t="T X" />
        <Ar x1={124} y1={40} x2={258} y2={40} label="T μ" ly={-8} />
        <Ar x1={124} y1={150} x2={266} y2={150} label="μ" ly={20} />
        <Ar x1={66} y1={58} x2={66} y2={136} c="syn" label="μ T" lx={-24} ly={4} />
        <Ar x1={296} y1={58} x2={296} y2={136} c="syn" label="μ" lx={18} ly={4} />
        <text x={190} y={104} textAnchor="middle" fontSize="20" fill={C.soft}>⟳</text>
        <text x={200} y={192} textAnchor="middle" fontSize="13" fill={C.soft}>Flattening twice, in either order, agrees - associativity again.</text>
      </>);
    case "bridge":
      return S(400, 200, <>
        <rect x="16" y="34" width="160" height="132" fill={C.panel} stroke={C.syn} />
        <text x={96} y={26} textAnchor="middle" fontSize="12" fill={C.syn} letterSpacing="1.2">SYNTAX</text>
        {["type A", "term x:A ⊢ t:B", "A × B", "A → B", "unit 1"].map((t, i) => (
          <text key={i} x={30} y={60 + i * 24} fontSize="12.5" fill={C.ink} fontFamily="ui-monospace,monospace">{t}</text>
        ))}
        <rect x="224" y="34" width="160" height="132" fill={C.panel} stroke={C.str} />
        <text x={304} y={26} textAnchor="middle" fontSize="12" fill={C.str} letterSpacing="1.2">CATEGORY</text>
        {["object A", "morphism A → B", "product", "exponential Bᴬ", "terminal object"].map((t, i) => (
          <text key={i} x={238} y={60 + i * 24} fontSize="12.5" fill={C.ink} fontFamily="ui-monospace,monospace">{t}</text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <Ar key={i} x1={182} y1={56 + i * 24} x2={218} y2={56 + i * 24} c="soft" both />
        ))}
        <text x={200} y={188} textAnchor="middle" fontSize="13" fill={C.soft}>Same content, two languages.</text>
      </>);
    default:
      return null;
  }
}

/* ================================================================== *
 *  CONTENT
 * ================================================================== */
const NODES = [
  {
    id: "algebra",
    track: "core",
    title: "From algebra to arrows",
    short: ["Prologue:", "monoids & structure"],
    pos: { x: 330, y: 62 },
    req: [],
    thesis: "The whole game fits in one line: a set, an operation, a few laws. Everything ahead is that idea taken seriously.",
    wild: "Anywhere a text writes “let (M, ·, e) be a monoid” and moves on without explaining. A monoid is also the smallest interesting category, the reason joining two pieces of text and composing two functions feel like the same act, and the structure that lets a total be computed in any grouping.",
    intuition: [
      "Mathematics is full of structures built the same way: groups, rings, vector spaces. Each is a *carrier* (a set) plus *operations* on it plus *laws* the operations obey. If those names mean nothing to you, no matter - the pattern is the point, and one example of it is about to be built from scratch. The laws are what let you compute without ever looking inside the elements.",
      "A monoid is the barest such structure worth naming: one associative operation with a unit, no inverses required. Drop inverses and suddenly the examples multiply - strings, lists, functions under composition, matrices, logs, relations.",
      "Now the shift that makes category theory possible. Instead of drawing a monoid as a *set of elements*, draw it as a *single dot with one loop per element*, where composing loops is the operation. Nothing was lost, but the emphasis moved from elements to arrows. Hold on to that picture: it returns as “a monoid is a one-object category”.",
    ],
    figure: "monoid",
    figcap: "A monoid redrawn with a single object. Elements became loops; multiplication became composition; the unit became the identity arrow.",
    defs: [
      { n: "Monoid", b: "A set `M` with a binary operation `· : M × M → M` and an element `e ∈ M` such that `(m·n)·p = m·(n·p)` for all `m,n,p` (associativity) and `e·m = m = m·e` for all `m` (unit laws)." },
      { n: "Monoid homomorphism", b: "A function `h : M → N` between monoids with `h(m·n) = h(m)·h(n)` and `h(e_M) = e_N`. It carries structure across, not just elements.", note: "Every structure in this course comes with a matching notion of structure-preserving map. That pairing is the whole idea of a category." },
      { n: "Commutative", b: "A monoid is commutative when `m·n = n·m`. Note that most of the interesting examples are *not*: concatenation and composition both care about order." },
    ],
    thms: [
      {
        n: "Uniqueness of the unit",
        b: "A monoid has exactly one unit element.",
        pf: "If `e` and `e′` are both units, then `e·e′ = e` (because `e′` is a unit on the right) and `e·e′ = e′` (because `e` is a unit on the left). So `e = e′`. This is your first taste of a proof that never inspects an element - it only uses the laws. You will prove it yourself at the gate below.",
      },
      {
        n: "Uniqueness of inverses",
        b: "If `m` has a two-sided inverse in a monoid, that inverse is unique.",
        pf: "Suppose `n·m = e = m·n` and `p·m = e = m·p`. Then `n = n·e = n·(m·p) = (n·m)·p = e·p = p`. The same three lines will reappear verbatim when we prove that inverses are unique in a category - a hint that the category proof *is* this proof, generalized.",
      },
    ],
    examples: [
      { h: "Numbers", b: "`(ℕ, +, 0)` and `(ℕ, ×, 1)` are commutative monoids. Neither is a group: `3` has no additive inverse in `ℕ`." },
      { h: "Strings", b: "`(Σ*, concatenation, \"\")` - the *free* monoid on the alphabet `Σ`. Free means: no relations hold beyond the ones the laws force. This is exactly what a “free construction” will mean later." },
      { h: "Functions", b: "For any set `X`, the endofunctions `X → X` under composition with `id_X` as unit. Non-commutative, and the source of the arrow picture above." },
      { h: "Not a monoid", b: "`(ℤ, −, 0)` fails: subtraction is not associative, since `(1−1)−1 = −1` but `1−(1−1) = 1`." },
      { h: "Booleans, twice", b: "`(Bool, ∧, true)` and `(Bool, ∨, false)`. Later these become the *product* and *coproduct* on a two-element poset - the same monoid laws, read as universal properties." },
    ],
    quiz: [
      {
        stem: "Which of these is a monoid but not a group?",
        options: ["`(ℤ, +, 0)`", "`(Σ*, concatenation, \"\")`", "`(ℚ∖{0}, ×, 1)`", "`(ℤ, −, 0)`"],
        answer: 1,
        why: "Concatenation is associative with the empty string as unit, but no non-empty string has an inverse - you cannot un-append. `(ℤ,−,0)` is not even a monoid.",
      },
      {
        stem: "In the “one dot, many loops” picture of a monoid, what is the identity arrow?",
        options: ["The dot itself", "The unit element `e`", "Any commuting element", "There is none, which is why we need groups"],
        answer: 1,
        why: "Objects are not elements. The single object is a placeholder; the elements are the arrows, and the unit `e` is precisely the arrow that does nothing when composed.",
      },
      {
        stem: "Why insist that homomorphisms preserve the unit, given they already preserve `·`?",
        options: [
          "It follows from preserving `·`, so the condition is redundant",
          "Without it, `h` could map everything to a sub-monoid with a different unit",
          "It is only needed for groups",
          "It is needed to make `h` injective",
        ],
        answer: 1,
        why: "For monoids the condition is genuinely extra. Take `M = (ℤ,×,1)` and `h(m) = 0`: then `h(mn) = 0 = h(m)h(n)`, yet `h(1) = 0 ≠ 1`. (For *groups* it does follow - a small asymmetry worth remembering.)",
      },
    ],
    gate: {
      claim: "Prove: the unit of a monoid is unique.",
      instruction: "Assemble the proof one line at a time. Lines above the bar are what you have established; the conclusion appears once the derivation is complete.",
      steps: [
        { r: 1, t: "Suppose `e` and `e′` are both units of `(M, ·)`." },
        { r: 2, t: "Since `e′` is a unit, `e · e′ = e`." },
        { r: 3, t: "Since `e` is a unit, `e · e′ = e′`." },
        { r: 4, t: "Both computations name the same element, so `e = e′`." },
      ],
      distractors: [
        { t: "Since `e` is invertible, multiply both sides by `e⁻¹`.", why: "Monoids need not have inverses - that assumption is exactly what we dropped." },
        { t: "By associativity, `(e · e′) · e = e · (e′ · e)`.", why: "True, but associativity is not needed here; only the unit laws are." },
        { t: "Choose any `x ∈ M` with `x · e = e′`.", why: "No such `x` need exist, and inventing one assumes what we want to prove." },
      ],
      conclusion: "The unit of a monoid is unique.  ∎",
    },
  },

  /* ---------------- TYPE THEORY TRACK ---------------- */
  {
    id: "judg",
    track: "tt",
    title: "Judgments and terms",
    short: ["Judgments,", "contexts, rules"],
    pos: { x: 155, y: 196 },
    req: ["algebra"],
    thesis: "Type theory is not a set with extra structure. It is a system of rules for deriving statements of the form “this term has that type”.",
    wild: "The turnstile `⊢` this path is named after, and the rules stacked above horizontal bars. It is the notation of every language specification, type-checker, and proof assistant. Once you can read a derivation tree, most “syntax” sections become mechanical.",
    intuition: [
      "In set theory there is one primitive relation, `∈`, and everything is a set: `2 ∈ 3` is a well-formed (and in the von Neumann encoding, true) question. In type theory, typing is not a proposition you can prove or refute inside the theory - it is a *judgment* the system either derives or does not.",
      "A judgment is made relative to a *context*: a list of variables with their types. `x : A, f : A → B ⊢ f x : B` says “given a variable `x` of type `A` and a variable `f` of type `A → B`, the term `f x` has type `B`”.",
      "The rules are written as fractions: premises on top, conclusion below, name at the right. A *derivation* is a finite tree of such rules. Nothing else is admitted. This is why type theory is mechanically checkable - and why proof assistants exist at all.",
    ],
    figure: "judgment",
    figcap: "The application rule. Everything in the tradition is presented this way, so learning to read one rule is learning to read all of them.",
    defs: [
      { n: "Judgment", b: "One of the primitive assertions of the theory. The four usual forms: `Γ ctx` (Γ is a well-formed context), `Γ ⊢ A type`, `Γ ⊢ a : A`, and `Γ ⊢ a ≡ b : A` (definitional equality).", note: "Definitional equality `≡` is *not* the same as an equality type `a = b`. Confusing the two causes most early misunderstandings; the identity type shows up much later, in the dependent-types level." },
      { n: "Context", b: "A finite list `x₁ : A₁, …, xₙ : Aₙ` where each variable is distinct and each `Aᵢ` is a type in the preceding context. Written `Γ`, `Δ`. The empty context is `⋄` or `·`; a term derivable in the empty context is *closed*." },
      { n: "Inference rule", b: "A schema `(premises) / conclusion`. The variable rule `Var` says: if `x : A` occurs in `Γ`, then `Γ ⊢ x : A`. Rules with no premises are *axioms* and form the leaves of a derivation." },
    ],
    thms: [
      {
        n: "Uniqueness of types",
        b: "In the simply typed λ-calculus with type annotations on binders, if `Γ ⊢ t : A` and `Γ ⊢ t : B`, then `A = B`.",
        pf: "By induction on the derivation. Each term former is handled by exactly one rule, so the last rule of the derivation is determined by the shape of `t`; the inductive hypotheses then pin down the type. Contrast with the untyped or the Curry-style setting, where `λx. x` has *every* type `A → A` and uniqueness fails.",
      },
      {
        n: "Weakening",
        b: "If `Γ ⊢ t : A` and `Γ, x : B` is a well-formed context, then `Γ, x : B ⊢ t : A`.",
        pf: "Induction on the derivation of `Γ ⊢ t : A`: every rule still applies after adding an unused hypothesis. Trivial-looking, but it is a theorem *about* the system rather than a rule *of* the system - the distinction between admissible and derivable rules, which the literature relies on constantly.",
      },
    ],
    examples: [
      { h: "A leaf", b: "`x : A, y : B ⊢ y : B` by `Var` alone. One rule, no premises, done." },
      { h: "A two-premise tree", b: "To derive `x : A, f : A → B ⊢ f x : B` you need `App`, whose premises are two `Var` leaves. This is the derivation you will build at the gate." },
      { h: "Not derivable", b: "`x : A ⊢ x x : ?` has no derivation: `App` requires the function's domain to match its argument's type, and `A` is not `A → C`. In the *untyped* λ-calculus `x x` is perfectly fine - types are what forbid it." },
      { h: "Context order matters", b: "`f : A → B, x : A` and `x : A, f : A → B` derive the same judgments here, but once types may depend on earlier variables (`n : ℕ, v : Vec A n`) the order becomes essential." },
    ],
    quiz: [
      {
        stem: "What does `Γ ⊢ a : A` assert?",
        options: [
          "That `a` is an element of the set `A`",
          "That the theory derives “`a` has type `A`” using the variables declared in `Γ`",
          "That `a` and `A` are definitionally equal",
          "That `A` is inhabited, for some unspecified witness",
        ],
        answer: 1,
        why: "It is a derivability claim about syntax in a context - not membership in a set, and not merely inhabitation, since the witness `a` is part of the judgment.",
      },
      {
        stem: "Why can't the term `x x` be typed in the simply typed λ-calculus?",
        options: [
          "Because variables may not be used twice",
          "Because `App` would need `x : A` and `x : A → C` simultaneously, and types are unique",
          "Because it diverges under β-reduction",
          "Because the context is empty",
        ],
        answer: 1,
        why: "Uniqueness of types blocks it: one variable, one type. Self-application is the standard example of an untyped term with no simple type, and (relatedly) typing is what buys you termination here.",
      },
      {
        stem: "Weakening is proved by induction on derivations rather than assumed as a rule. What does that tell you?",
        options: [
          "It is optional and some systems omit it",
          "It is a meta-theorem: a fact about which judgments are derivable, not itself a step in a derivation",
          "It only holds in the empty context",
          "It is equivalent to uniqueness of types",
        ],
        answer: 1,
        why: "Papers distinguish rules *of* the system from admissible facts *about* it. Weakening, substitution, and subject reduction are all of the second kind.",
      },
    ],
    gate: {
      claim: "Derive: `x : A, f : A → B  ⊢  f x : B`.",
      instruction: "Build the derivation from its leaves upward. Premises first, then the rule that consumes them.",
      steps: [
        { r: 1, t: "`x : A, f : A → B ⊢ f : A → B`   by `Var`" },
        { r: 1, t: "`x : A, f : A → B ⊢ x : A`   by `Var`" },
        { r: 2, t: "`x : A, f : A → B ⊢ f x : B`   by `App` on the two premises" },
      ],
      distractors: [
        { t: "`x : A, f : A → B ⊢ f x : A → B`   by `Var`", why: "`Var` only ever concludes with a variable and its declared type; `f x` is not a variable." },
        { t: "`x : A ⊢ f : A → B`   by `Var`", why: "`f` is not declared in that context. Every variable used must appear in Γ." },
        { t: "`x : A, f : A → B ⊢ x f : B`   by `App`", why: "`App` needs the *function* on the left. `x : A` is not a function type." },
      ],
      conclusion: "`x : A, f : A → B ⊢ f x : B` is derivable.  ∎",
    },
  },

  {
    id: "fun",
    track: "tt",
    title: "Function types",
    short: ["Function types,", "λ, β and η"],
    pos: { x: 155, y: 316 },
    req: ["judg"],
    thesis: "One type former, three rules, and you can already write down proofs of implications - though you won't know that until the Curry–Howard level.",
    wild: "Anything written `A → B`, `λx. t`, or “up to βη” lives here, which is to say every function that has ever been given a type. The categorical name for this type is *exponential*; that word arrives with a reason attached at the adjunctions level.",
    intuition: [
      "A function type `A → B` is introduced by *abstraction* (bind a variable) and used by *application* (feed it an argument). Introduction and elimination rules come in pairs for every type former; that pairing is the deep rhythm of type theory.",
      "The two rules must fit together. β-reduction says elimination-after-introduction simplifies: `(λx. t) a ≡ t[a/x]`. η says introduction-after-elimination is invisible: `λx. (f x) ≡ f`. Together they say the rules are neither too weak nor too strong.",
      "Note `A → B → C` means `A → (B → C)`: arrows associate to the right, application to the left, so `f a b` is `(f a) b`. Multi-argument functions are just nested single-argument ones - *currying*, which becomes an adjunction two levels from now.",
    ],
    figure: "arrow",
    figcap: "A term of function type is a box with a hole in it. β-reduction is what happens when you plug the hole.",
    defs: [
      { n: "Function type (formation)", b: "If `Γ ⊢ A type` and `Γ ⊢ B type` then `Γ ⊢ A → B type`." },
      { n: "λ-abstraction (introduction)", b: "From `Γ, x : A ⊢ t : B` conclude `Γ ⊢ λx. t : A → B`. Read: a term of `B` that may use a free `x : A` becomes a *closed-over* function." },
      { n: "Application (elimination)", b: "From `Γ ⊢ f : A → B` and `Γ ⊢ a : A` conclude `Γ ⊢ f a : B`." },
      { n: "β and η (computation and uniqueness)", b: "`(λx. t) a ≡ t[a/x]` and, for `f : A → B`, `λx. f x ≡ f`. The first says how functions compute; the second says every term of function type *is* a λ-abstraction, up to `≡`.", note: "In the categorical dictionary β is the universal property's existence half and η is its uniqueness half. Same content, different notation." },
    ],
    thms: [
      {
        n: "Subject reduction",
        b: "If `Γ ⊢ t : A` and `t ⟶β t′` then `Γ ⊢ t′ : A`.",
        pf: "The key case is `(λx. s) a ⟶β s[a/x]`; it follows from the substitution lemma, which says that if `Γ, x : A ⊢ s : B` and `Γ ⊢ a : A` then `Γ ⊢ s[a/x] : B`. So computation never breaks typing - the slogan “well-typed programs don't go wrong”.",
      },
      {
        n: "Strong normalization",
        b: "Every well-typed term of the simply typed λ-calculus reduces to a unique normal form, in finitely many steps.",
        pf: "Proved by Tait's reducibility method - genuinely harder than it looks, and false for the untyped calculus (`(λx. x x)(λx. x x)` loops forever). Consequence: as a programming language the simply typed λ-calculus is *not* Turing complete, and definitional equality is decidable. That is the trade types buy you.",
      },
    ],
    examples: [
      { h: "Identity", b: "`λx. x : A → A` for every type `A`. In the categorical reading, `id_A`." },
      { h: "Constant", b: "`λx. λy. x : A → B → A`. Discards its second argument. Read as a proposition it is “A implies (B implies A)” - a tautology." },
      { h: "Composition", b: "`λg. λf. λa. g (f a) : (B → C) → (A → B) → (A → C)`. This single term *is* composition in the category of types." },
      { h: "Double application", b: "`λf. λa. f (f a) : (A → A) → A → A`. The Church numeral `2`. Numerals as iterators is the idea the inductive-types level makes official." },
      { h: "η in practice", b: "`map f` and `λx. map f x` are definitionally equal, which is why point-free style is legitimate rather than a different program." },
    ],
    quiz: [
      {
        stem: "What is the type of `λf. λx. f (f x)`?",
        options: ["`(A → A) → A → A`", "`(A → B) → A → B`", "`A → A → A`", "`(A → B) → (B → C) → A → C`"],
        answer: 0,
        why: "`f` is applied to its own output, so its domain and codomain must coincide: `f : A → A`. Then `x : A` and the result is in `A`.",
      },
      {
        stem: "Which term inhabits `(A → B → C) → B → A → C`?",
        options: ["`λf. λb. λa. f a b`", "`λf. λb. λa. f b a`", "`λf. λa. λb. f a b`", "No term inhabits it"],
        answer: 0,
        why: "Flipping arguments. The body must be `f a b` because `f` expects `A` first; the *binders* are what get reordered. Type-directed programming: the type told you the answer.",
      },
      {
        stem: "η-equality `λx. f x ≡ f` says:",
        options: [
          "Functions are equal when they agree on all inputs",
          "Every term of function type is already an abstraction, up to definitional equality",
          "β-reduction terminates",
          "Application is associative",
        ],
        answer: 1,
        why: "It is a *uniqueness* principle for the type former, not full extensionality (which is a stronger, separate axiom about propositional equality).",
      },
    ],
    gate: {
      claim: "Construct a term of type `(A → B) → (B → C) → (A → C)`.",
      instruction: "Work outside-in: peel one arrow off the type, introduce the matching binder, and stop when the goal is no longer a function type.",
      steps: [
        { r: 1, t: "Goal `(A → B) → (B → C) → (A → C)`; introduce `λf.` with `f : A → B`." },
        { r: 2, t: "Remaining goal `(B → C) → (A → C)`; introduce `λg.` with `g : B → C`." },
        { r: 3, t: "Remaining goal `A → C`; introduce `λa.` with `a : A`." },
        { r: 4, t: "Now `f a : B`, hence `g (f a) : C` - the goal is no longer an arrow, so we are done." },
        { r: 5, t: "Collecting the binders: `λf. λg. λa. g (f a)  :  (A → B) → (B → C) → (A → C)`." },
      ],
      distractors: [
        { t: "Now `g a : C`, so take the body to be `g a`.", why: "`g` expects a `B`, but `a : A`. Ill-typed." },
        { t: "Now `f (g a) : C`.", why: "Composition in the wrong order: `g` cannot eat `a : A`, and `f` does not land in `C`." },
        { t: "Collecting the binders: `λa. λf. λg. g (f a)`.", why: "That has type `A → (A → B) → (B → C) → C`. Binder order is part of the type." },
      ],
      conclusion: "`λf. λg. λa. g (f a)` inhabits `(A → B) → (B → C) → (A → C)`.  ∎",
    },
  },

  {
    id: "prod",
    track: "tt",
    title: "Products, sums, and nothing",
    short: ["Products, sums,", "unit, void"],
    pos: { x: 155, y: 436 },
    req: ["fun"],
    thesis: "Types form an algebra: `×` multiplies, `+` adds, `→` exponentiates, `1` and `0` are the constants. School algebra transfers almost intact - and where it fails, it fails informatively.",
    wild: "Pairs and records, tagged unions and enums, `unit`, and the empty type: the raw material out of which every data description is built. The isomorphisms below are the ones a text applies silently whenever it “reshuffles” a type.",
    intuition: [
      "The counting heuristic is exact for finite types: `|A × B| = |A|·|B|`, `|A + B| = |A|+|B|`, `|A → B| = |B|^{|A|}`, `|1| = 1`, `|0| = 0`. So `Bool = 1 + 1`, and `A → 1 + 1` really does have `2^{|A|}` inhabitants - the subsets of `A`.",
      "Then the polynomial identities of ordinary algebra have type-theoretic counterparts, *provided* you replace `=` with `≅` (isomorphism: functions both ways that compose to the identity). Distributivity `A × (B + C) ≅ A×B + A×C` holds. Currying `(A × B → C) ≅ (A → B → C)` is the law `c^{ab} = (c^b)^a` in disguise.",
      "Not everything survives. There is no `A + A ≅ 2 × A` subtraction, and crucially `A + (A → 0)` is *not* inhabited - the type-theoretic algebra is a commutative semiring, not a ring, and its logic is intuitionistic. Where the analogy stops is exactly where the interesting content is.",
    ],
    figure: "prodsum",
    figcap: "Products tile a grid; sums keep two piles apart and remember which pile you took from.",
    defs: [
      { n: "Product", b: "`A × B` with introduction `⟨a, b⟩` from `a : A` and `b : B`, and eliminations `π₁ : A × B → A`, `π₂ : A × B → B`. Rules: `π₁⟨a,b⟩ ≡ a`, `π₂⟨a,b⟩ ≡ b` (β), and `⟨π₁ p, π₂ p⟩ ≡ p` (η)." },
      { n: "Sum (coproduct)", b: "`A + B` with introductions `inl : A → A + B`, `inr : B → A + B`, and elimination by case analysis: given `f : A → C` and `g : B → C` there is `case(f,g) : A + B → C` with `case(f,g)(inl a) ≡ f a` and `case(f,g)(inr b) ≡ g b`.", note: "The elimination for a sum takes *two* continuations because there were two ways in. Sums are harder to work with than products for exactly this reason." },
      { n: "Unit and Void", b: "`1` has a single term `⋆` and the η-rule `t ≡ ⋆` for any `t : 1`. `0` has no introduction rule at all, and the elimination `absurd : 0 → C` for every `C` - from nothing, anything." },
    ],
    thms: [
      {
        n: "Currying",
        b: "`(A × B → C) ≅ (A → B → C)`, naturally in all three types.",
        pf: "Take `curry = λh. λa. λb. h ⟨a,b⟩` and `uncurry = λk. λp. k (π₁ p) (π₂ p)`. Then `uncurry (curry h) ≡ λp. h ⟨π₁ p, π₂ p⟩ ≡ h` using η for products, and `curry (uncurry k) ≡ λa. λb. k a b ≡ k` using η for functions. Both η-rules were needed - a good illustration of why they are not decoration. This isomorphism is *the* motivating example of an adjunction.",
      },
      {
        n: "Distributivity",
        b: "`A × (B + C) ≅ (A × B) + (A × C)`.",
        pf: "Left to right is the gate below. Right to left: `case(λq. ⟨π₁ q, inl (π₂ q)⟩, λq. ⟨π₁ q, inr (π₂ q)⟩)`. Checking the round trips uses the β-rules for `case` and η for products. Notice the asymmetry: in a general category with products and coproducts this map need not be invertible; it *is* here because the type theory is cartesian *closed*.",
      },
      {
        n: "Absorption",
        b: "`A × 1 ≅ A`, `A × 0 ≅ 0`, `A + 0 ≅ A`, `0 → A ≅ 1`, `1 → A ≅ A`, `A → 1 ≅ 1`.",
        pf: "Each is a short λ-term plus an η-step. Read as arithmetic: `a·1 = a`, `a·0 = 0`, `a+0 = a`, `a⁰ = 1`, `a¹ = a`, `1ᵃ = 1`. Read as logic: the last says “anything implies truth”, and `A × 0 ≅ 0` says a contradiction contaminates a conjunction.",
      },
    ],
    examples: [
      { h: "`Bool`", b: "Define `Bool :≡ 1 + 1`, `true :≡ inl ⋆`, `false :≡ inr ⋆`. Then `if` is exactly `case`." },
      { h: "Records and variants", b: "A struct with fields of types `A, B, C` is `A × B × C`; a tagged union is `A + B + C`. Every data layout you have written is a polynomial in `+` and `×`." },
      { h: "`Maybe A ≅ 1 + A`", b: "One extra inhabitant for “nothing”. Then `Maybe` being a functor and a monad will be facts about `1 + (−)`." },
      { h: "Negation", b: "`¬A :≡ A → 0`. So `¬0 ≅ 1` is inhabited and `¬1 ≅ 0` is not - “not-false is true”, computed by arithmetic." },
      { h: "Where arithmetic misleads", b: "`|A + A| = |2 × A|` for finite types, and indeed `A + A ≅ 2 × A`. But `2^A ≅ A → 2` has no *decidable* inverse: the analogy is about counting, not about computation." },
    ],
    quiz: [
      {
        stem: "How many inhabitants does `Bool → Bool` have, up to definitional equality?",
        options: ["2", "4", "8", "Infinitely many"],
        answer: 1,
        why: "`|Bool|^{|Bool|} = 2² = 4`: identity, negation, constantly-true, constantly-false.",
      },
      {
        stem: "Which type is *not* inhabited by a closed term?",
        options: ["`A → A + B`", "`A × B → B × A`", "`(A + B) → A`", "`0 → A`"],
        answer: 2,
        why: "Given only a tagged value you cannot produce an `A` when the tag says `B`. The others are `inl`, swap, and `absurd`. Try `|A|=0, |B|=1` and the count gives it away: `|(A+B) → A| = 0¹ = 0`.",
      },
      {
        stem: "Currying's proof used η for both functions and products. What breaks without η for products?",
        options: [
          "`curry` is no longer definable",
          "`uncurry (curry h)` need not be definitionally equal to `h`, so the two maps are not inverse",
          "`π₁` and `π₂` become ambiguous",
          "Nothing; η is a convenience",
        ],
        answer: 1,
        why: "You would only get a *retraction*, not an isomorphism. Uniqueness rules are what turn “there is a map” into “there is exactly one”, which is the whole content of a universal property.",
      },
    ],
    gate: {
      claim: "Construct a term of type `A × (B + C) → (A × B) + (A × C)`.",
      instruction: "You are given a pair whose second component is tagged. Split on the tag, and rebuild the pair inside each branch.",
      steps: [
        { r: 1, t: "Introduce `λp.` with `p : A × (B + C)`; the goal is `(A × B) + (A × C)`." },
        { r: 2, t: "`π₂ p : B + C`, so eliminate it by `case`; the branches must both land in the goal." },
        { r: 3, t: "Branch `inl b`, where `b : B`: return `inl ⟨π₁ p, b⟩`." },
        { r: 3, t: "Branch `inr c`, where `c : C`: return `inr ⟨π₁ p, c⟩`." },
        { r: 4, t: "Hence `λp. case (π₂ p) of { inl b ↦ inl ⟨π₁ p, b⟩ ; inr c ↦ inr ⟨π₁ p, c⟩ }`." },
      ],
      distractors: [
        { t: "`π₁ (π₂ p) : B`, so return `inl ⟨π₁ p, π₁ (π₂ p)⟩`.", why: "`π₂ p` has type `B + C`, a sum. Projections apply to products; sums are consumed by `case`." },
        { t: "Branch `inl b`: return `⟨π₁ p, inl b⟩`.", why: "That is a term of `A × (B + C)` again - the source type, not the target." },
        { t: "Return `inl ⟨π₁ p, π₂ p⟩` without case analysis.", why: "`π₂ p : B + C` is not a `B`. Without splitting the tag you cannot know which side to build." },
      ],
      conclusion: "`A × (B + C) → (A × B) + (A × C)` is inhabited.  ∎",
    },
  },

  {
    id: "ind",
    track: "tt",
    title: "Inductive types",
    short: ["Inductive types", "& induction"],
    pos: { x: 155, y: 556 },
    req: ["prod"],
    thesis: "Give the constructors, and the elimination rule - recursion, or equivalently induction - comes for free. It is the same rule twice.",
    wild: "“Defined inductively”, “by induction on the derivation”, `rec`, `fold`, `catamorphism`, initial algebras - and every recursive datatype in every programming language - all point here.",
    intuition: [
      "`ℕ` is generated by `0` and `succ`, and - this is the content - by *nothing else*. So to define a function out of `ℕ` it suffices to say what happens at `0` and how to go from the value at `n` to the value at `succ n`. That is the recursor.",
      "The same rule with a *dependent* motive is the induction principle: to prove `P n` for all `n`, prove `P 0` and `P n → P (succ n)`. Recursion and induction are literally the same rule; one returns data, the other returns evidence. If you take one thing from this level, take that sentence.",
      "Generalize: a datatype is a list of constructors, each taking a tuple of arguments that may include recursive occurrences. `List A` has `nil` and `cons : A → List A → List A`. Its recursor is `fold`. The categorical name for this pattern is *initial algebra of a functor*, and the functor for `List A` is `X ↦ 1 + A × X`.",
    ],
    figure: "nat",
    figcap: "No shortcuts and no loops: each numeral is reached in exactly one way. That is what licenses definition by recursion.",
    defs: [
      { n: "The natural numbers", b: "Constructors `0 : ℕ` and `succ : ℕ → ℕ`. Recursor: given `c : C` and `f : ℕ → C → C`, there is `rec(c, f) : ℕ → C` with `rec(c,f) 0 ≡ c` and `rec(c,f)(succ n) ≡ f n (rec(c,f) n)`." },
      { n: "Induction principle", b: "For a family `P : ℕ → Type`: from `p₀ : P 0` and `pₛ : Π(n:ℕ). P n → P (succ n)` we get `ind(p₀, pₛ) : Π(n:ℕ). P n`. Taking `P` constant recovers the recursor.", note: "“Taking P constant recovers the recursor” is worth checking by hand once. It is the cleanest example of dependency buying you real power." },
      { n: "Lists", b: "`nil : List A`, `cons : A → List A → List A`. Recursor `fold : C → (A → C → C) → List A → C`. `length`, `map`, `sum`, `reverse` are all instances." },
      { n: "Strict positivity", b: "A constructor may not take the type being defined in a *negative* position: `bad : (Bad → 0) → Bad` is forbidden. Allowing it makes the theory inconsistent, so every real system checks this condition." },
    ],
    thms: [
      {
        n: "Uniqueness of recursive definitions",
        b: "If `g : ℕ → C` satisfies `g 0 ≡ c` and `g (succ n) ≡ f n (g n)`, then `g n = rec(c,f) n` for every `n`.",
        pf: "Induction on `n` with motive `P n :≡ (g n = rec(c,f) n)`. Base: both are `c`. Step: `g (succ n) ≡ f n (g n) = f n (rec(c,f) n) ≡ rec(c,f)(succ n)`. So the recursor is not merely *a* solution to the recursion equations, it is *the* solution - a universal property, stated in syntax.",
      },
      {
        n: "`n + 0 = n`",
        b: "With `+` defined by recursion on its first argument, `n + 0 = n` for all `n : ℕ` - but this needs a proof, whereas `0 + m ≡ m` holds definitionally.",
        pf: "The gate below. The asymmetry is the point: which argument you recurse on decides which equations are free and which must be earned. Every formalization has a folklore about choosing the recursion order well.",
      },
    ],
    examples: [
      { h: "Addition", b: "`0 + m ≡ m`, `(succ n) + m ≡ succ (n + m)`. As a recursor: `add :≡ λn. rec(λm. m, λk. λr. λm. succ (r m)) n`." },
      { h: "`length`", b: "`fold 0 (λa. λr. succ r) : List A → ℕ`. The element is ignored - the shape alone determines the answer." },
      { h: "`map`", b: "`map f :≡ fold nil (λa. λr. cons (f a) r)`. Recursion gives you the functor structure of `List`, which the functor level then names." },
      { h: "Trees", b: "`leaf : Tree`, `node : Tree → Tree → Tree`. Its recursor computes depth, size, mirror. Structural recursion on trees is why “by induction on the derivation” is a legitimate proof method - derivations are trees." },
      { h: "Not an inductive type", b: "`Stream A` (infinite sequences) is *co*inductive: defined by its observations (`head`, `tail`) rather than its constructors, with corecursion in place of recursion. Papers on infinite behaviour lean on the duality." },
    ],
    quiz: [
      {
        stem: "With `0 + m ≡ m` and `(succ n) + m ≡ succ (n + m)`, which equation is definitional (holds by computation alone)?",
        options: ["`n + 0 = n`", "`0 + n ≡ n`", "`n + m = m + n`", "`succ n + m = n + succ m`"],
        answer: 1,
        why: "`0 + n ≡ n` is literally the first clause. The others require induction - commutativity requires two lemmas first.",
      },
      {
        stem: "The recursor and the induction principle differ in exactly one way. Which?",
        options: [
          "Induction only works for propositions",
          "The motive: induction lets the result type depend on the input, `P : ℕ → Type`, while the recursor uses a constant `C`",
          "Induction needs classical logic",
          "The recursor is primitive; induction is proved from it",
        ],
        answer: 1,
        why: "One rule, two readings, distinguished only by dependency. Which is why dependent types are the natural home for proofs.",
      },
      {
        stem: "Why is `bad : (Bad → 0) → Bad` rejected?",
        options: [
          "It is not a function type",
          "`Bad` occurs to the left of an arrow - a negative occurrence - and allowing it yields a term of type `0`",
          "Constructors may take at most one argument",
          "It duplicates the constructor `absurd`",
        ],
        answer: 1,
        why: "Negative occurrences let you build a fixed point of negation and derive a contradiction. Strict positivity is a consistency guard, not bureaucracy.",
      },
    ],
    gate: {
      claim: "Prove: `n + 0 = n` for all `n : ℕ`, where `0 + m ≡ m` and `(succ n) + m ≡ succ (n + m)`.",
      instruction: "State the motive, do the base case, then the step. The final line must invoke the induction principle.",
      steps: [
        { r: 1, t: "Motive: `P n :≡ (n + 0 = n)`. We aim for `Π(n:ℕ). P n`." },
        { r: 2, t: "Base: `0 + 0 ≡ 0` by the first clause, so `refl : P 0`." },
        { r: 3, t: "Step: assume `h : n + 0 = n`." },
        { r: 4, t: "`(succ n) + 0 ≡ succ (n + 0)` by the second clause." },
        { r: 5, t: "`succ (n + 0) = succ n` by applying `succ` to `h`; hence `P (succ n)`." },
        { r: 6, t: "By `ind` on the base case and the step, `P n` holds for every `n : ℕ`.  " },
      ],
      distractors: [
        { t: "Base: `0 + 0 ≡ 0` by the second clause.", why: "The second clause applies to `succ n`, and `0` is not of that form." },
        { t: "By definition `n + 0 ≡ n`, so there is nothing to prove.", why: "That is the equation you would get by recursing on the *second* argument. With this definition it is not definitional." },
        { t: "Assume `P (succ n)` and derive `P n`.", why: "Backwards. Induction builds upward from `0`; descending would need well-founded induction and a different motive." },
      ],
      conclusion: "`Π(n:ℕ). n + 0 = n`.  ∎",
    },
  },

  {
    id: "ch",
    track: "tt",
    title: "Propositions as types",
    short: ["Curry–Howard:", "proofs as programs"],
    pos: { x: 155, y: 676 },
    req: ["ind"],
    thesis: "A proposition is a type; a proof is a term of that type. Not an analogy - a definition, and the reason type theory is a foundation for mathematics.",
    wild: "Whenever a text treats a proof obligation as just another field of a record, or waves at “by Curry–Howard”, this is what is meant. It is also the reason a single tool can be both a programming language and a system for doing mathematics.",
    intuition: [
      "Read `A → B` as “A implies B”. A proof of an implication is a *procedure* turning proofs of `A` into proofs of `B` - which is exactly a term of type `A → B`. Now translate the rest: `×` is “and” (produce both), `+` is “or” (produce one, tagged), `1` is “true”, `0` is “false”, `¬A` is `A → 0`.",
      "Check the rules against your logical instincts. `A → B → A` is a tautology and `λx. λy. x` proves it. `(A → B) → (B → C) → (A → C)` is transitivity of implication, proved by the composition term you already built. Modus ponens is *application*. Cut elimination is β-reduction.",
      "The logic you get is *intuitionistic*, not classical. `A + ¬A` has no closed proof, because a term of `A + ¬A` would have to *decide* `A` - and there is no such algorithm uniformly in `A`. What you do get is the double-negation shift `¬¬(A + ¬A)`. Constructive logic is not weaker arithmetic; it is logic where proofs carry computational content.",
    ],
    figure: "table:ch",
    figcap: "The dictionary. Learn it in both directions; writers switch between the columns without warning.",
    defs: [
      { n: "Propositions as types", b: "The reading: a type `A` is a proposition, and `A` is *true* exactly when there is a closed term `t : A`. Such a `t` is a proof. Provability is inhabitation." },
      { n: "Negation and absurdity", b: "`¬A :≡ A → 0`. A proof of `¬A` is a function converting any proof of `A` into a proof of falsity. `absurd : 0 → C` is *ex falso quodlibet*." },
      { n: "Proofs as programs", b: "Under the correspondence, cut elimination in logic = β-reduction in the calculus; a normalized proof = a value; a proof of `A → B` = a program with input spec `A` and output spec `B`.", note: "This is the observation program extraction is built on: prove a theorem constructively and you have compiled a verified program." },
    ],
    thms: [
      {
        n: "Curry–Howard correspondence",
        b: "Derivations in intuitionistic propositional natural deduction correspond bijectively to well-typed terms of the simply typed λ-calculus with `×`, `+`, `1`, `0`, and this bijection matches proof normalization with β-reduction.",
        pf: "Both directions are structural inductions: each logical rule *is* a typing rule under the translation. The result is due to Curry and Howard; Lambek later added the third leg - cartesian closed categories - which is the final level of this tree.",
      },
      {
        n: "Excluded middle is not derivable",
        b: "There is no closed term of type `A + ¬A` with `A` a free type variable.",
        pf: "Sketch: by strong normalization a closed term would reduce to a normal form, which for a sum type must be `inl t` or `inr t`; either choice fixes a decision that is invalid under substitution of a specific `A` (take `A = 0` and `A = 1` to contradict each side). Model-theoretically: interpret types in the open sets of a topological space, where `A ∪ int(complement A)` need not be everything.",
      },
      {
        n: "Double-negation shift",
        b: "`¬¬(A + ¬A)` *is* provable constructively.",
        pf: "Take `λk. k (inr (λa. k (inl a)))`. Trace the types: `k : (A + ¬A) → 0`; the inner `λa. k (inl a) : ¬A`; so `inr (…) : A + ¬A`; so the whole is `0`. A tiny term with a genuinely surprising shape - worth typing out by hand. Constructively you can never *refute* excluded middle, you simply cannot *use* it.",
      },
    ],
    examples: [
      { h: "Weakening", b: "`λa. λb. a : A → B → A`. “If A holds, then A holds even given B.”" },
      { h: "Modus ponens", b: "`λf. λa. f a : (A → B) → A → B`. Application, renamed." },
      { h: "Contraposition", b: "`λf. λk. λa. k (f a) : (A → B) → (¬B → ¬A)`. Note the converse `(¬B → ¬A) → (A → B)` is *not* provable intuitionistically." },
      { h: "And-or distribution", b: "`A × (B + C) → (A × B) + (A × C)` - the term you built two levels ago is a proof of a distributive law of logic." },
      { h: "De Morgan, half of it", b: "`¬(A + B) ≅ ¬A × ¬B` holds; but `¬(A × B) → ¬A + ¬B` fails constructively. Knowing which half survives is a standard trap." },
    ],
    quiz: [
      {
        stem: "Under Curry–Howard, what corresponds to a proof of `A ∧ B`?",
        options: ["A term of `A → B`", "A pair `⟨a, b⟩ : A × B`", "A term of `A + B`", "A term of `¬(A → ¬B)`"],
        answer: 1,
        why: "Conjunction is the product: to prove both, produce both. The last option is *classically* equivalent but not the same type.",
      },
      {
        stem: "Why is there no closed term of type `A + ¬A`?",
        options: [
          "Because `+` has no elimination rule",
          "Because a normal-form term would have to commit to `inl` or `inr` uniformly in `A`, i.e. decide an arbitrary proposition",
          "Because `¬A` is not a type",
          "Because the calculus is not strongly normalizing",
        ],
        answer: 1,
        why: "Inhabitation means *constructing* a witness. A uniform witness for `A + ¬A` would be a decision procedure for every proposition at once.",
      },
      {
        stem: "What does β-reduction correspond to on the logical side?",
        options: ["Weakening", "Cut elimination - removing a detour where a proof is introduced then immediately used", "Contraposition", "Excluded middle"],
        answer: 1,
        why: "Introduction immediately followed by elimination is exactly a cut; β removes it. Normalization theorems and cut-elimination theorems are the same theorem in two dialects.",
      },
    ],
    gate: {
      claim: "Prove `A → ¬¬A` by constructing a term.",
      instruction: "Unfold the negations into arrows first; then the term writes itself.",
      steps: [
        { r: 1, t: "Unfold: `¬¬A` is `(A → 0) → 0`, so the goal is `A → ((A → 0) → 0)`." },
        { r: 2, t: "Introduce `λa.` with `a : A`; remaining goal `(A → 0) → 0`." },
        { r: 3, t: "Introduce `λk.` with `k : A → 0`; remaining goal `0`." },
        { r: 4, t: "`k a : 0` - apply the refutation to the proof." },
        { r: 5, t: "Hence `λa. λk. k a  :  A → ¬¬A`." },
      ],
      distractors: [
        { t: "Introduce `λk.` first, with `k : ¬¬A`.", why: "The outermost arrow of the goal is `A → …`, so the first binder must take an `A`." },
        { t: "`a k : 0` - apply the proof to the refutation.", why: "`a : A` is not a function. Only `k` can be applied." },
        { t: "By excluded middle, `A + ¬A`, so case-split on it.", why: "Not available: `A + ¬A` is not inhabited. And nothing beyond the two binders is needed." },
      ],
      conclusion: "`λa. λk. k a : A → ¬¬A`.  ∎",
    },
  },

  {
    id: "dep",
    track: "tt",
    title: "Dependent types",
    short: ["Π, Σ, and", "identity types"],
    pos: { x: 155, y: 796 },
    req: ["ch"],
    thesis: "Let types depend on terms. Then `→` and `×` are special cases of `Π` and `Σ`, and quantifiers become type formers.",
    wild: "`Π`, `Σ`, `Vec A n`, `refl`, `transport`, `J`, “definitional vs propositional equality” - all here. This is the level the working proof assistants are built on, and the one most technical writing quietly assumes you have.",
    intuition: [
      "A *family* is a function into types: `B : A → Type`. Picture the base `A` as a line and `B x` as a fiber standing over each point. Then a function `f` with `f x : B x` is a *choice of one point in each fiber* - that is `Π(x:A) B x`, the dependent function type. If `B` is constant, it is `A → B`: same thing, no dependency.",
      "Dually, `Σ(x:A) B x` is the set of pairs `⟨a, b⟩` with `b : B a` - the total space of the bundle. Constant `B` gives `A × B`. Under Curry–Howard, `Π` is `∀` and `Σ` is `∃`, and the witness is genuinely there: from a proof of `Σ(x:A) B x` you can *extract* the `x` by `π₁`.",
      "Now the delicate part. `a ≡ b` (definitional) is a judgment; `a = b`, the *identity type* `Id_A(a,b)`, is a type, with sole constructor `refl_a : Id_A(a,a)` and eliminator `J`. `J` says: to prove something about all identifications, it suffices to handle `refl`. Everything about equality - symmetry, transitivity, transport, congruence - comes out of that one rule, and how much *else* you can prove about `Id` is where type theories genuinely differ.",
    ],
    figure: "fibers",
    figcap: "The bundle picture. `Π` is a section, `Σ` is the total space, and the identity type will be the fiber of paths.",
    defs: [
      { n: "Dependent function type (Π)", b: "Given `Γ ⊢ A type` and `Γ, x : A ⊢ B type`, form `Γ ⊢ Π(x:A) B type`. Introduce by `λx. t` where `Γ, x : A ⊢ t : B`; eliminate by application, with `f a : B[a/x]` - the *type of the result depends on the argument*." },
      { n: "Dependent pair type (Σ)", b: "Introduce `⟨a, b⟩ : Σ(x:A) B` when `a : A` and `b : B[a/x]`. Eliminate by projection `π₁ : Σ(x:A)B → A` and `π₂ p : B[π₁ p / x]`." },
      { n: "Identity type", b: "For `a, b : A`, a type `Id_A(a,b)`, also written `a =_A b`. Constructor `refl_a : Id_A(a,a)`. Eliminator `J`: for `C : Π(x y : A). Id_A(x,y) → Type`, from `c : Π(x:A). C x x refl_x` we get `Π(x y : A). Π(p : Id_A(x,y)). C x y p`, with `J(c, x, x, refl_x) ≡ c x`." },
      { n: "Transport", b: "For `P : A → Type` and `p : a =_A b`, a map `transport^P(p) : P a → P b`, obtained from `J`. Indiscernibility of identicals, as a program.", note: "Transport is the workhorse. Nearly every “rewrite” step in a proof assistant is a transport in disguise." },
    ],
    thms: [
      {
        n: "Π and Σ generalize → and ×",
        b: "If `B` does not depend on `x`, then `Π(x:A) B ≡ A → B` and `Σ(x:A) B ≡ A × B`.",
        pf: "Immediate from the rules: with `B` constant, substitution `B[a/x]` is `B`, and the introduction and elimination rules become those of `→` and `×` verbatim. So dependent type theory does not add function types alongside `Π`; it *replaces* them.",
      },
      {
        n: "Symmetry and transitivity of `=`",
        b: "For `p : a =_A b` there is `p⁻¹ : b =_A a`; for `p : a = b` and `q : b = c` there is `p · q : a = c`.",
        pf: "Symmetry is the gate below, by transport along `P(x) :≡ (x =_A a)`. Transitivity: transport `p` along `P(x) :≡ (a =_A x)` applied to `q`, or by `J` directly. Nothing here uses any property of `A`: the identity type is a groupoid structure that comes for free from `J`, which is the observation homotopy type theory is built on.",
      },
      {
        n: "Type checking is decidable; provability is not",
        b: "For standard dependent type theories, checking `Γ ⊢ t : A` is decidable, while deciding whether *some* `t` inhabits `A` is not.",
        pf: "Checking reduces to normalizing types and comparing them, which terminates by strong normalization. Inhabitation encodes arbitrary mathematics, so it cannot be decidable. This asymmetry is the design principle behind proof assistants: the human supplies the term, the machine checks it.",
      },
    ],
    examples: [
      { h: "Length-indexed vectors", b: "`Vec : Type → ℕ → Type` with `nil : Vec A 0` and `cons : A → Vec A n → Vec A (succ n)`. Then `head : Π(n:ℕ). Vec A (succ n) → A` cannot be called on an empty vector - the type rules it out." },
      { h: "A theorem as a type", b: "`Π(n:ℕ). n + 0 =_ℕ n`. The proof you built at the previous gate is a *term* of this type." },
      { h: "Subsets", b: "`Σ(n:ℕ). isPrime n` is “the primes”: a pair of a number and evidence. `π₁` forgets the evidence, which is why this is a subset *with* proof-carrying elements." },
      { h: "`∀` and `∃` are not symmetric", b: "From `Σ(x:A) B x` you can extract a witness; from `¬Π(x:A) ¬B x` you cannot. Constructive existence means having the thing." },
      { h: "A failure of the naive reading", b: "`Id_A(a,b)` may have *many* inhabitants once `A` is a type of types. Uniqueness of identity proofs is an axiom you may add (and then lose univalence), not a theorem." },
    ],
    quiz: [
      {
        stem: "What is the type of the dependent application `f a`, where `f : Π(x:A) B` and `a : A`?",
        options: ["`B`", "`B[a/x]`", "`Π(x:A) B`", "`A → B`"],
        answer: 1,
        why: "Substitute the actual argument into the family. That substitution *is* dependency; without it you have the ordinary arrow.",
      },
      {
        stem: "Which pair of notions is genuinely different in dependent type theory?",
        options: [
          "`Π(x:A) B` with constant `B` vs `A → B`",
          "`a ≡ b` (definitional equality) vs `a =_A b` (identity type)",
          "`Σ(x:A) B` with constant `B` vs `A × B`",
          "`rec` vs `ind` with a constant motive",
        ],
        answer: 1,
        why: "The other three are the same by definition. Definitional equality is a judgment decided by computation; the identity type is a type whose inhabitants you must construct and can reason about.",
      },
      {
        stem: "You have `p : a =_A b` and `q : P a`, with `P : A → Type`. How do you get an element of `P b`?",
        options: ["Rewrite `a` to `b` in `q` - types are sets, so this is automatic", "`transport^P(p, q)`, obtained from `J`", "`π₂ ⟨p, q⟩`", "You cannot without assuming uniqueness of identity proofs"],
        answer: 1,
        why: "Transport is exactly this, and it is *derived* from `J` rather than assumed. Nothing about `A` being a set is needed.",
      },
    ],
    gate: {
      claim: "Prove symmetry: from `p : a =_A b` construct a term of `b =_A a`.",
      instruction: "Choose a family, find the element you already have over the base point, then transport along `p`.",
      steps: [
        { r: 1, t: "Goal: `Π(a b : A). (a =_A b) → (b =_A a)`. Fix `a, b : A` and `p : a =_A b`." },
        { r: 2, t: "Take the family `P(x) :≡ (x =_A a)`, so `P : A → Type`." },
        { r: 3, t: "`P a` is `a =_A a`, which is inhabited by `refl_a`." },
        { r: 4, t: "`transport^P(p) : P a → P b`, since `p : a =_A b`." },
        { r: 5, t: "Therefore `transport^P(p, refl_a) : b =_A a`.  " },
      ],
      distractors: [
        { t: "Take the family `P(x) :≡ (a =_A x)`.", why: "Then `P b` is `a =_A b`, which is what you were *given*. This family proves transitivity, not symmetry." },
        { t: "`refl_b : b =_A b`, and `a` equals `b`, so done.", why: "“`a` equals `b`” is the inhabitant `p`, not a licence to substitute silently. The substitution must be performed by transport." },
        { t: "By uniqueness of identity proofs, `p` is `refl`, so `a` and `b` are the same term.", why: "UIP is an extra axiom, and even with it `a` and `b` need not be definitionally equal. `J` suffices and assumes nothing." },
      ],
      conclusion: "`Π(a b : A). (a =_A b) → (b =_A a)`.  ∎",
    },
  },

  /* ---------------- CATEGORY THEORY TRACK ---------------- */
  {
    id: "cat",
    track: "ct",
    title: "Categories",
    short: ["Categories:", "objects & arrows"],
    pos: { x: 505, y: 196 },
    req: ["algebra"],
    thesis: "Forget what the objects are made of. Keep only the arrows between them and the fact that arrows compose. Astonishingly much survives.",
    wild: "`𝒞`, `Hom(A,B)`, `𝒞(A,B)`, `f ∘ g`, `id_A`, “up to isomorphism”, “let 𝒞 be a category with …”. This is the vocabulary layer: nothing here is deep, and nothing later is readable without it.",
    intuition: [
      "Structures never travel alone: groups come with homomorphisms, spaces with continuous maps, ordered sets with order-preserving maps. Each time, a kind of object and a kind of map between objects. A category is that pairing axiomatized: a collection of objects, a set of arrows between each pair, an identity arrow on each object, and an associative composition.",
      "The discipline is that you may only use those data. You cannot ask what is *inside* an object; you can only ask which arrows go in and out. Properties expressed this way are automatically invariant - they cannot depend on an encoding.",
      "Two examples to keep at hand, because they pull in opposite directions. A monoid is a category with one object (the arrows are the elements). A poset is a category with at most one arrow between any two objects (the arrow is the relation `≤`, composition is transitivity, identities are reflexivity). One has all the arrows in one place, the other spreads them thinly - and the axioms are indifferent.",
    ],
    figure: "category",
    figcap: "Three objects, two arrows, one composite, and identity loops (usually left undrawn). A diagram *commutes* when all paths with the same endpoints are equal.",
    defs: [
      { n: "Category", b: "A collection of objects; for each pair `A, B` a set `𝒞(A,B)` of morphisms; for each `A` an identity `id_A ∈ 𝒞(A,A)`; and a composition `∘ : 𝒞(B,C) × 𝒞(A,B) → 𝒞(A,C)` satisfying `h ∘ (g ∘ f) = (h ∘ g) ∘ f` and `f ∘ id_A = f = id_B ∘ f`." },
      { n: "Isomorphism", b: "`f : A → B` is an isomorphism if there is `g : B → A` with `g ∘ f = id_A` and `f ∘ g = id_B`. Write `A ≅ B`. In categorical language, sameness always means “isomorphic”, never “equal”." },
      { n: "Small, large, locally small", b: "*Small*: objects and morphisms form sets. *Locally small*: each `𝒞(A,B)` is a set, though the objects may form a proper class - `Set`, `Grp`, `Top` are locally small. Papers say “locally small” to keep `Hom`-set constructions legal.", note: "Size conditions look like bookkeeping but bite in practice: the “category of all categories” needs care, and so does anything defined by quantifying over all objects." },
      { n: "Opposite category", b: "`𝒞ᵒᵖ` has the same objects and `𝒞ᵒᵖ(A,B) :≡ 𝒞(B,A)`, with composition reversed. Every theorem about categories has a dual, obtained by mechanically reversing all arrows - you get two theorems for the price of one." },
    ],
    thms: [
      {
        n: "Identities are unique",
        b: "For each object `A` there is at most one morphism satisfying the identity laws.",
        pf: "If `i` and `i′` both act as identities on `A`, then `i = i ∘ i′ = i′`. Compare the monoid proof from the prologue: it is the same three symbols. A monoid *is* a one-object category, so it must be.",
      },
      {
        n: "Inverses are unique",
        b: "If `f : A → B` has a two-sided inverse, it has exactly one.",
        pf: "The gate below. Consequence: `f⁻¹` is well-defined notation, and `(g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹`.",
      },
      {
        n: "Monoids are one-object categories",
        b: "Categories with exactly one object correspond exactly to monoids, and functors between them to monoid homomorphisms.",
        pf: "Given a one-object category, take `M :≡ 𝒞(•,•)` with `· :≡ ∘` and `e :≡ id_•`; associativity and unit laws are the category axioms. Conversely a monoid gives a one-object category. This is the first instance of a pattern worth internalizing: a familiar algebraic structure is a *degenerate* category, and a general theorem about categories specializes to a familiar theorem about it.",
      },
    ],
    examples: [
      { h: "`Set`", b: "Objects: sets. Morphisms: functions. The reference example, and the reason people say “element” when they mean “arrow out of a point”." },
      { h: "`Type`", b: "Objects: types. Morphisms `A → B`: terms `x : A ⊢ t : B` up to βη. Identity is `x`; composition is substitution. The category you have been building all along in the other track." },
      { h: "A poset", b: "Objects: elements of the poset. One arrow `x → y` iff `x ≤ y`. Composition is transitivity, identity is reflexivity, and antisymmetry says the only isomorphisms are identities." },
      { h: "A monoid", b: "One object, arrows = elements. Composition = multiplication. Degenerate in the object direction, rich in the arrow direction." },
      { h: "`Mat_k`", b: "Objects: natural numbers. Morphisms `m → n`: `n × m` matrices over `k`. Composition is matrix multiplication, identities are identity matrices. Objects need not be “things containing elements” at all." },
      { h: "Not a category", b: "Sets with *partial* functions where composition is only defined when domains match up perfectly, or “groups and injective-but-not-structure-preserving maps” - composition or identities fail. Always check both." },
    ],
    quiz: [
      {
        stem: "A category with exactly one object is the same thing as:",
        options: ["A group", "A monoid", "A poset", "A set"],
        answer: 1,
        why: "The arrows form a set with an associative composition and a unit - a monoid. It is a *group* precisely when every arrow is invertible.",
      },
      {
        stem: "In a poset regarded as a category, what does “`𝒞(x,y)` has at most one element” mean?",
        options: [
          "The poset is a chain",
          "Either `x ≤ y` or not; there is no further data in *how* it holds",
          "Composition is commutative",
          "Every morphism is an isomorphism",
        ],
        answer: 1,
        why: "Such categories are called *thin*. They are exactly the preorders, and the entire content of a diagram is which arrows exist - nothing to check about commutativity.",
      },
      {
        stem: "Why do categorical statements say `A ≅ B` rather than `A = B`?",
        options: [
          "Equality of objects is undecidable",
          "Because the axioms only give access to arrows, so any property expressible in the language cannot distinguish isomorphic objects",
          "Because `=` is reserved for morphisms",
          "It is a stylistic convention with no content",
        ],
        answer: 1,
        why: "Isomorphism-invariance is a consequence of the language, not politeness. (Note the axioms *do* let you compare morphisms with `=` - that asymmetry is real, and what higher category theory sets out to fix.)",
      },
    ],
    gate: {
      claim: "Prove: if `f : A → B` has a two-sided inverse, that inverse is unique.",
      instruction: "Use only the category axioms: identity laws and associativity. Do not look inside the objects.",
      steps: [
        { r: 1, t: "Suppose `g, h : B → A` with `g ∘ f = id_A`, `f ∘ g = id_B`, `h ∘ f = id_A`, `f ∘ h = id_B`." },
        { r: 2, t: "`g = g ∘ id_B = g ∘ (f ∘ h)`, using the identity law and then `f ∘ h = id_B`." },
        { r: 3, t: "`g ∘ (f ∘ h) = (g ∘ f) ∘ h` by associativity." },
        { r: 4, t: "`(g ∘ f) ∘ h = id_A ∘ h = h`." },
        { r: 5, t: "Hence `g = h`: the inverse is unique, so writing `f⁻¹` is justified." },
      ],
      distractors: [
        { t: "Since `𝒞(B,A)` is a set, `g` and `h` are elements of it and therefore equal.", why: "Being in the same set is not being equal. Nothing was used." },
        { t: "`g ∘ (f ∘ h) = (g ∘ h) ∘ f`, by rearranging the composite.", why: "That is not associativity - it permutes the arrows, and `g ∘ h` is not even composable." },
        { t: "Pick an element `x ∈ A` and compute `g(f(x)) = x = h(f(x))`.", why: "Objects need not have elements. This argument only works in `Set` and defeats the purpose." },
      ],
      conclusion: "Inverses in a category are unique.  ∎",
    },
  },

  {
    id: "func",
    track: "ct",
    title: "Functors",
    short: ["Functors:", "maps of categories"],
    pos: { x: 505, y: 316 },
    req: ["cat"],
    thesis: "A functor moves objects and arrows together, preserving identities and composition. Nearly every construction that earns the word “structural” turns out to be one.",
    wild: "`F : 𝒞 → 𝒟`, `F(f)`, `Hom(A, −)`, `fmap`, “functorial in X”, “the forgetful functor”. When a text calls a construction functorial, it is claiming exactly the two equations below - no more, and no less.",
    intuition: [
      "A category has two levels, so a map of categories must act on both - and the two actions must agree: `F(g ∘ f) = F g ∘ F f` and `F(id_A) = id_{F A}`. That is all a functor is. The equations say “F respects the arrow structure”, and they are exactly the two `fmap` laws a programmer checks.",
      "The most important functors are not exotic: `List`, `Maybe`, “take the underlying set of a group”, “take the free monoid on a set”, “take the fundamental group of a space”. Each turns an object into an object and, crucially, a map into a map.",
      "Two nuances. A functor `𝒞ᵒᵖ → 𝒟` is called *contravariant* on `𝒞`; it flips the direction of arrows, and `(−) → C` is the standard example (precomposition reverses). And `Hom(A, −) : 𝒞 → Set` - “what can I see from `A`” - is the functor that makes the Yoneda lemma possible on the next level.",
    ],
    figure: "functor",
    figcap: "The picture is two categories with a dashed correspondence - but the content is the two equations, not the picture.",
    defs: [
      { n: "Functor", b: "`F : 𝒞 → 𝒟` assigns to each object `A` of `𝒞` an object `F A`, and to each `f : A → B` a morphism `F f : F A → F B`, such that `F(id_A) = id_{F A}` and `F(g ∘ f) = F g ∘ F f`." },
      { n: "Contravariant functor", b: "A functor `𝒞ᵒᵖ → 𝒟`: it sends `f : A → B` to `F f : F B → F A` and satisfies `F(g ∘ f) = F f ∘ F g`. Example: `𝒞(−, C)`, precomposition." },
      { n: "Endofunctor", b: "A functor `𝒞 → 𝒞`. `List`, `Maybe`, `X ↦ 1 + A × X` are endofunctors on `Type`, and monads are built from them.", note: "Inductive types are initial algebras of endofunctors: `List A` is the initial algebra of `X ↦ 1 + A × X`. That connects this level directly to the inductive-types level in the other track." },
      { n: "Faithful, full", b: "`F` is *faithful* if each map `𝒞(A,B) → 𝒟(F A, F B)` is injective, *full* if surjective. The forgetful functor `Grp → Set` is faithful but not full: not every function between underlying sets is a homomorphism." },
    ],
    thms: [
      {
        n: "Functors preserve isomorphisms",
        b: "If `f : A → B` is an isomorphism in `𝒞` and `F : 𝒞 → 𝒟` is a functor, then `F f` is an isomorphism in `𝒟`, with `(F f)⁻¹ = F(f⁻¹)`.",
        pf: "The gate below. The corollary is used constantly: isomorphic input, isomorphic output, for free. Note the contrapositive is a proof technique - to show `A ≇ B`, find a functor separating them. That is how algebraic topology proves spaces are different.",
      },
      {
        n: "Functors need not preserve monomorphisms, epimorphisms, or limits",
        b: "Preservation of `id` and `∘` is genuinely weak; extra hypotheses (like being a right adjoint) are needed for more.",
        pf: "Standard counterexample: the free-group functor and various quotients; or `(−) × A` failing to preserve coproducts in a non-distributive category. Remember: “functorial” is a low bar. When preservation is actually needed, the words used are “continuous”, “cocontinuous”, or “left/right adjoint”.",
      },
      {
        n: "Composition of functors",
        b: "Functors compose, and identity functors exist - so small categories and functors themselves form a category, `Cat`.",
        pf: "Check the two equations for `G ∘ F` directly. That categories form a category is the first sign that this subject is self-applicable; the next level makes `Cat` a *2*-category by adding maps between functors.",
      },
    ],
    examples: [
      { h: "`List : Set → Set`", b: "On objects `A ↦ List A`; on morphisms `f ↦ map f`. The laws `map id = id` and `map (g ∘ f) = map g ∘ map f` are the functor laws." },
      { h: "Forgetful `U : Mon → Set`", b: "Throws away the operation, keeps the carrier. Faithful, not full. Its left adjoint is the free monoid - see the adjunctions level." },
      { h: "Free `F : Set → Mon`", b: "`A ↦ (A*, concatenation, ε)`; a function `f : A → B` extends to a homomorphism `A* → B*` letterwise." },
      { h: "`Hom(A, −) : 𝒞 → Set`", b: "`B ↦ 𝒞(A,B)`, and `g : B → C` acts by postcomposition `g ∘ (−)`. The single most-used functor in the subject." },
      { h: "Powerset, both ways", b: "Covariant: `f` gives image. Contravariant: `f` gives preimage. Same object assignment, two different functors - and the contravariant one is the better behaved." },
      { h: "Not a functor", b: "“Send a group to its centre” is not functorial: a homomorphism need not map centre into centre. A plausible object assignment with no arrow assignment is the standard trap." },
    ],
    quiz: [
      {
        stem: "Which pair of equations defines a functor?",
        options: [
          "`F(A × B) = F A × F B` and `F(1) = 1`",
          "`F(id) = id` and `F(g ∘ f) = F g ∘ F f`",
          "`F(f) ∘ F(g) = F(g) ∘ F(f)` and `F(id) = id`",
          "`F` injective on objects and on morphisms",
        ],
        answer: 1,
        why: "Only identities and composition. Preserving products is a strictly stronger, separate condition.",
      },
      {
        stem: "The map sending `f : A → B` to precomposition `(− ∘ f) : 𝒞(B,C) → 𝒞(A,C)` is:",
        options: ["A covariant functor `𝒞 → Set`", "A contravariant functor, i.e. a functor `𝒞ᵒᵖ → Set`", "Not functorial", "A functor only if `𝒞` has products"],
        answer: 1,
        why: "The direction flips: `f : A → B` yields a map *from* `𝒞(B,C)` *to* `𝒞(A,C)`. That is the definition of contravariance.",
      },
      {
        stem: "Why does “functors preserve isomorphisms” follow so quickly, while “functors preserve injections” does not?",
        options: [
          "Isomorphism is defined by equations between composites, which is exactly what functors preserve; injectivity is not",
          "Injections are not morphisms",
          "It only fails for contravariant functors",
          "It does follow, by the same argument",
        ],
        answer: 0,
        why: "The lesson generalizes: any property stated purely as commuting equations is automatically preserved. Properties stated with quantifiers over arrows (“for all `g,h`, if … then …”) are not.",
      },
    ],
    gate: {
      claim: "Prove: functors preserve isomorphisms.",
      instruction: "You may use only the two functor equations and the definition of isomorphism.",
      steps: [
        { r: 1, t: "Let `f : A → B` be an isomorphism with inverse `g`, and let `F : 𝒞 → 𝒟` be a functor." },
        { r: 2, t: "`F g ∘ F f = F(g ∘ f)` because `F` preserves composition." },
        { r: 3, t: "`F(g ∘ f) = F(id_A) = id_{F A}` because `g ∘ f = id_A` and `F` preserves identities." },
        { r: 4, t: "Symmetrically, `F f ∘ F g = F(f ∘ g) = F(id_B) = id_{F B}`." },
        { r: 5, t: "So `F f` is an isomorphism with inverse `F g`; that is, `(F f)⁻¹ = F(f⁻¹)`." },
      ],
      distractors: [
        { t: "`F(f⁻¹) = (F f)⁻¹` holds by definition of a functor.", why: "That is the conclusion, not an axiom. Functors are only required to preserve `id` and `∘`." },
        { t: "`F g ∘ F f = F f ∘ F g` because `𝒟` is a category.", why: "Composition in a category is not commutative - and it need not even be composable in the other order." },
        { t: "`F` is faithful, so `F f` is an isomorphism whenever `f` is.", why: "Faithfulness is not assumed, and injectivity on Hom-sets would not give this anyway." },
      ],
      conclusion: "Functors preserve isomorphisms, with `(F f)⁻¹ = F(f⁻¹)`.  ∎",
    },
  },

  {
    id: "nt",
    track: "ct",
    title: "Natural transformations",
    short: ["Natural", "transformations"],
    pos: { x: 505, y: 436 },
    req: ["func"],
    thesis: "A map between functors, uniform in the object. Naturality is the precise version of the informal phrase “this construction doesn't depend on the details”.",
    wild: "`α : F ⇒ G`, `α_X`, “natural in X”, `[𝒞, 𝒟]`, “by Yoneda”. Naturality conditions are the commuting squares a text asserts without troubling to draw them.",
    intuition: [
      "You have two functors `F, G : 𝒞 → 𝒟` and want to compare them. For each object `X` pick a morphism `α_X : F X → G X`. That family is *natural* if it commutes with every morphism of `𝒞`: for `f : X → Y`, `G f ∘ α_X = α_Y ∘ F f`.",
      "Read the square as: “translate then move” equals “move then translate”. `reverse : List ⇒ List` is natural, because reversing and then mapping `f` is the same as mapping `f` and then reversing - the operation only rearranges positions, and never inspects the elements. Anything that *does* inspect elements (“delete all zeros”) fails naturality, and the square is exactly the test.",
      "Because natural transformations compose, functors `𝒞 → 𝒟` and natural transformations between them form a category `[𝒞, 𝒟]`. Once *maps between maps* are objects in their own right, the subject starts to fold in on itself - and the Yoneda lemma becomes possible to even state.",
    ],
    figure: "naturality",
    figcap: "The naturality square, one for each morphism `f : X → Y` of the source category. All of them must commute.",
    defs: [
      { n: "Natural transformation", b: "For functors `F, G : 𝒞 → 𝒟`, a family `α = (α_X : F X → G X)` indexed by objects of `𝒞`, such that for every `f : X → Y` in `𝒞`: `G f ∘ α_X = α_Y ∘ F f`. Written `α : F ⇒ G`." },
      { n: "Natural isomorphism", b: "A natural transformation each of whose components is an isomorphism. Then `F ≅ G`, and the inverses `(α_X)⁻¹` automatically form a natural transformation `G ⇒ F`.", note: "“Naturally isomorphic” is the right notion of sameness for functors, just as “isomorphic” is for objects. When a text says “natural in A and B”, it is promising these squares." },
      { n: "Functor category", b: "`[𝒞, 𝒟]` has functors `𝒞 → 𝒟` as objects and natural transformations as morphisms, composed componentwise: `(β ∘ α)_X :≡ β_X ∘ α_X`, with identity `(id_F)_X :≡ id_{F X}`." },
      { n: "Presheaf", b: "A functor `𝒞ᵒᵖ → Set`. The category `[𝒞ᵒᵖ, Set]` of presheaves is where Yoneda lives, and it is the model of choice for many semantics of type theory." },
    ],
    thms: [
      {
        n: "Naturality is closed under composition",
        b: "If `α : F ⇒ G` and `β : G ⇒ H` are natural, so is `β ∘ α` defined componentwise.",
        pf: "The gate below. This is what makes `[𝒞, 𝒟]` a category.",
      },
      {
        n: "Yoneda lemma",
        b: "For any functor `F : 𝒞 → Set` and object `A`, there is a bijection `Nat(𝒞(A,−), F) ≅ F A`, natural in `A` and `F`.",
        pf: "A natural transformation `α : 𝒞(A,−) ⇒ F` is determined by the single element `α_A(id_A) ∈ F A`; conversely any `x ∈ F A` gives `α_B(g) :≡ (F g)(x)`, and naturality forces these to be inverse. Corollary (Yoneda embedding): `A ↦ 𝒞(A,−)` is fully faithful, so `A ≅ B` iff their Hom-functors are naturally isomorphic. Slogan: an object is completely determined by the arrows into (or out of) it. This is the theorem that justifies the entire arrows-only methodology.",
      },
      {
        n: "Interchange",
        b: "Natural transformations admit two compositions - vertical (`β ∘ α`) and horizontal (whiskering along functors) - and they satisfy an interchange law.",
        pf: "Both come from the naturality squares; the law says the two ways of reading a grid of squares agree. This is what makes `Cat` a *2-category*, and it is the first genuinely higher-dimensional structure in the subject. Papers on higher structure assume it as background.",
      },
    ],
    examples: [
      { h: "`reverse : List ⇒ List`", b: "`map f ∘ reverse = reverse ∘ map f`. Natural, because it only permutes positions." },
      { h: "`head : List ⇒ Maybe`", b: "`fmap f ∘ head = head ∘ map f`. Both sides give `Just (f a₀)` on a non-empty list and `Nothing` on `nil`." },
      { h: "Not natural", b: "`removeZeros : List ℤ ⇒ List ℤ` fails: with `f = (+1)`, `map f (removeZeros [0]) = []` but `removeZeros (map f [0]) = [1]`. It inspected an element, so it cannot be uniform." },
      { h: "`η : Id ⇒ List`", b: "`a ↦ [a]`. Naturality: `map f [a] = [f a]`. Later this is the unit of the `List` monad - and *that* is where the notation `η` comes from." },
      { h: "Currying, again", b: "`𝒞(A × B, C) ≅ 𝒞(A, B → C)` is not just a bijection but *natural* in `A` and `C`. Naturality is precisely what upgrades “same size” to “same structure”." },
      { h: "Determinant", b: "`det : GLₙ ⇒ (−)*` is a natural transformation between functors on commutative rings: `det` commutes with any ring homomorphism applied entrywise. A classical fact, restated." },
    ],
    quiz: [
      {
        stem: "What does the naturality square for `α : F ⇒ G` at `f : X → Y` say?",
        options: ["`α_X = α_Y`", "`G f ∘ α_X = α_Y ∘ F f`", "`α_X ∘ F f = G f ∘ α_Y`", "`F f = G f`"],
        answer: 1,
        why: "Follow the types: `α_X : F X → G X` and `G f : G X → G Y`, so the composite starts at `F X` and ends at `G Y` - as does `α_Y ∘ F f`.",
      },
      {
        stem: "Why is `removeZeros : List ℤ → List ℤ` not a natural transformation?",
        options: [
          "Because it changes the length of the list",
          "Because it inspects the values, so it fails to commute with `map f` for `f` that maps a zero to a non-zero",
          "Because `List` is not a functor on `ℤ`",
          "Because naturality requires isomorphisms",
        ],
        answer: 1,
        why: "Changing length is fine - `tail` and `filter`-by-position are natural. Depending on the *values* is what breaks the square.",
      },
      {
        stem: "The Yoneda lemma says a natural transformation `𝒞(A,−) ⇒ F` is determined by:",
        options: ["Its component at every object", "A single element of `F A`, namely the image of `id_A`", "An isomorphism `A ≅ F A`", "A choice of terminal object"],
        answer: 1,
        why: "`id_A` is the universal element: naturality propagates its image to every other component. This is why “an object is what you can map into it”.",
      },
    ],
    gate: {
      claim: "Prove: the componentwise composite of natural transformations is natural.",
      instruction: "Fix `f : X → Y` and push it through the two given squares in turn.",
      steps: [
        { r: 1, t: "Let `α : F ⇒ G`, `β : G ⇒ H`, and define `(β ∘ α)_X :≡ β_X ∘ α_X`. Fix `f : X → Y`." },
        { r: 2, t: "`H f ∘ β_X ∘ α_X = β_Y ∘ G f ∘ α_X`, by naturality of `β` at `f`." },
        { r: 3, t: "`β_Y ∘ G f ∘ α_X = β_Y ∘ α_Y ∘ F f`, by naturality of `α` at `f`." },
        { r: 4, t: "So `H f ∘ (β ∘ α)_X = (β ∘ α)_Y ∘ F f`: the square commutes for every `f`." },
      ],
      distractors: [
        { t: "`β_X ∘ α_X = α_X ∘ β_X` since composition is associative.", why: "Associativity is not commutativity, and these are not composable in the other order anyway." },
        { t: "Naturality is automatic, since each `β_X ∘ α_X` is a morphism of `𝒟`.", why: "Being a morphism is not being natural - `removeZeros` is a perfectly good morphism at each component." },
        { t: "Apply the Yoneda lemma to `β ∘ α`.", why: "Yoneda needs `F : 𝒞 → Set` and a representable source; the statement here holds in any `𝒟` and needs only the two squares." },
      ],
      conclusion: "`[𝒞, 𝒟]` is a category.  ∎",
    },
  },

  {
    id: "univ",
    track: "ct",
    title: "Universal properties",
    short: ["Universal", "properties"],
    pos: { x: 505, y: 556 },
    req: ["nt"],
    thesis: "Define objects by what maps into or out of them, not by their construction. Then uniqueness up to isomorphism is automatic, and you never have to choose an encoding.",
    wild: "“the terminal object”, “the product”, `∃!`, “unique up to unique isomorphism”, limits, colimits. The `∃!` is the whole point, and it is why such definitions never have to pick a representation.",
    intuition: [
      "The cartesian product of sets has an obvious construction - ordered pairs - but the construction is not what matters. What matters is: `A × B` comes with `π₁, π₂`, and *any* pair of maps `f : X → A`, `g : X → B` factors through it via exactly one `u : X → A × B`. That “exactly one” pins the object down completely.",
      "This is the shape of every universal property: an object plus some structure, such that any other candidate maps to it in exactly one compatible way. Terminal object: exactly one arrow *in*, from anywhere. Initial: exactly one arrow *out*.",
      "The payoff is that the definition transfers. In `Set` the product is pairs. In `Poset` it is the meet. In `Type` it is `A × B` with `π₁`, `π₂` and its η-rule - which now reveals itself as the uniqueness clause. In a preorder viewed as a category, the terminal object is the top element. One definition, many theorems.",
    ],
    figure: "cone",
    figcap: "The universal property of a product. The dashed arrow is the one that must exist and be unique - `∃!` is doing all the work.",
    defs: [
      { n: "Terminal object", b: "`1` is terminal if for every object `X` there is exactly one morphism `X → 1`. Dually, `0` is *initial* if there is exactly one morphism `0 → X` for every `X`." },
      { n: "Product", b: "A product of `A` and `B` is an object `P` with `π₁ : P → A`, `π₂ : P → B` such that for all `f : X → A`, `g : X → B` there is a unique `u : X → P` with `π₁ ∘ u = f` and `π₂ ∘ u = g`. Write `P = A × B` and `u = ⟨f, g⟩`." },
      { n: "Coproduct", b: "Dual: an object `A + B` with `inl`, `inr` such that any `f : A → X`, `g : B → X` factor uniquely through it. Reverse every arrow in the product definition - that is all “dual” ever means.", note: "Duality is free labour. Every proof about products becomes a proof about coproducts by reversing arrows, so learn one and get two." },
      { n: "Exponential", b: "Given products, an exponential `Bᴬ` is an object with `eval : Bᴬ × A → B` such that every `h : X × A → B` factors as `eval ∘ (u × id)` for a unique `u : X → Bᴬ`. In `Type` this is `A → B`; `u` is `curry h`." },
    ],
    thms: [
      {
        n: "Terminal objects are unique up to unique isomorphism",
        b: "If `1` and `1′` are both terminal, there is a unique isomorphism `1 ≅ 1′`.",
        pf: "The gate below. The same argument, verbatim with different letters, proves that products, coproducts, limits and colimits are unique up to isomorphism - which is why mathematicians say “*the* product” despite there being many constructions.",
      },
      {
        n: "Universal properties are determined by Hom-functors",
        b: "`P` is a product of `A` and `B` iff there is a natural isomorphism `𝒞(X, P) ≅ 𝒞(X,A) × 𝒞(X,B)`, natural in `X`.",
        pf: "Unfold both sides: an element of the right-hand side is a pair `(f,g)`, and naturality in `X` is exactly compatibility with precomposition. Combined with Yoneda, this says a universal property is a *representation* of a functor - the professional way to state such definitions, and the phrasing you will meet once you go looking.",
      },
      {
        n: "The type-theoretic η-rules are uniqueness clauses",
        b: "In `Type`, the η-rule `⟨π₁ p, π₂ p⟩ ≡ p` is precisely the uniqueness half of the product's universal property; `λx. f x ≡ f` is the uniqueness half of the exponential's.",
        pf: "Existence of `⟨f,g⟩` is the introduction rule; the equations `π₁⟨f,g⟩ ≡ f`, `π₂⟨f,g⟩ ≡ g` are β; and η says any `u` satisfying those equations equals `⟨f,g⟩`. So a type theory with η-rules is a category with genuine universal properties - the first plank of the bridge at the end of this tree.",
      },
    ],
    examples: [
      { h: "In `Set`", b: "Terminal: any one-element set. Initial: `∅`. Product: cartesian product. Coproduct: disjoint union. Exponential: the set of functions." },
      { h: "In `Type`", b: "Terminal: `1`. Initial: `0`. Product: `A × B`. Coproduct: `A + B`. Exponential: `A → B`. The other track built all five." },
      { h: "In a poset", b: "Terminal: greatest element. Initial: least. Product: meet `∧`. Coproduct: join `∨`. The lattice operations *are* universal properties." },
      { h: "In `Mon`", b: "Product: direct product with componentwise operation. The terminal monoid is the one-element monoid. The initial monoid is the trivial one too - so `0 ≅ 1` here, which is a real phenomenon, not a mistake." },
      { h: "No products", b: "In the category of fields and field homomorphisms there is no product of `ℚ` and `𝔽₂`, since there is no field mapping to both. Universal properties are definitions, not guarantees of existence." },
    ],
    quiz: [
      {
        stem: "What makes `A × B` “the” product rather than “a” product?",
        options: [
          "Its construction from ordered pairs is canonical",
          "Any two objects with the product's universal property are uniquely isomorphic, so it is determined up to isomorphism",
          "Products are always unique in `Set`",
          "The projections are surjective",
        ],
        answer: 1,
        why: "Universal properties determine objects up to unique isomorphism. The construction is one implementation; the property is the specification.",
      },
      {
        stem: "In the poset `(ℕ, ≤)` viewed as a category, what is the product of `3` and `5`?",
        options: ["`15`", "`8`", "`3`", "`5`"],
        answer: 2,
        why: "An arrow into both `3` and `5` is an `x ≤ 3` and `x ≤ 5`; the largest such is `min(3,5) = 3`. Products are meets.",
      },
      {
        stem: "Which type-theoretic rule plays the role of the *uniqueness* clause in a universal property?",
        options: ["The formation rule", "The introduction rule", "The β-rule", "The η-rule"],
        answer: 3,
        why: "Introduction gives existence, β says the equations hold, η says nothing else does. Drop η and you keep existence but lose uniqueness - a *weak* product.",
      },
    ],
    gate: {
      claim: "Prove: any two terminal objects are uniquely isomorphic.",
      instruction: "Use terminality twice, then use it a third time to identify a composite with an identity.",
      steps: [
        { r: 1, t: "Suppose `1` and `1′` are both terminal." },
        { r: 2, t: "Terminality of `1′` gives a unique `f : 1 → 1′`; terminality of `1` gives a unique `g : 1′ → 1`." },
        { r: 3, t: "`g ∘ f` and `id_1` are both morphisms `1 → 1`, and `1` is terminal, so `g ∘ f = id_1`." },
        { r: 4, t: "Symmetrically `f ∘ g = id_{1′}`, since `1′` is terminal." },
        { r: 5, t: "So `f` is an isomorphism, and it is the *only* morphism `1 → 1′`: hence `1 ≅ 1′` uniquely." },
      ],
      distractors: [
        { t: "Since both are terminal, they are equal.", why: "Equality of objects is not available; categorical arguments deliver isomorphism, and that is all they should deliver." },
        { t: "Pick any `h : 1 → 1′` and check `h ∘ g = id` by computing on elements.", why: "Objects need not have elements, and “pick any” is unnecessary - terminality already gives exactly one." },
        { t: "`g` is an isomorphism because it is monic and epic.", why: "Monic plus epic does not imply invertible in a general category (consider `ℤ ↪ ℚ` in `Ring`)." },
      ],
      conclusion: "Terminal objects are unique up to unique isomorphism.  ∎",
    },
  },

  {
    id: "adj",
    track: "ct",
    title: "Adjunctions",
    short: ["Adjunctions:", "F ⊣ G"],
    pos: { x: 505, y: 676 },
    req: ["univ"],
    thesis: "Two functors in opposite directions, with a natural bijection between arrow sets. The most important concept in the subject, and currying is an instance.",
    wild: "`F ⊣ G`, unit `η`, counit `ε`, “free–forgetful”, “left adjoints preserve colimits”. Also where monads come from, one level along.",
    intuition: [
      "An adjunction is a *translation* between two categories that is not an equivalence but is exact about the discrepancy: `𝒟(F A, B) ≅ 𝒞(A, G B)`, naturally in `A` and `B`. Maps out of the free thing on `A` correspond to maps out of `A` into the underlying thing.",
      "The canonical example: a monoid homomorphism `A* → M` is the same as a plain function `A → U M`. Choosing where the letters go is exactly the same as choosing where the words go, because words are generated freely. Free is left adjoint to forgetful, always.",
      "The programmer's example: `𝒞(X × A, B) ≅ 𝒞(X, Bᴬ)`, currying. So `(− × A) ⊣ (Aᐟ ↦ −)` - the product is left adjoint to the exponential. A category with products where this adjunction exists for every `A` is *cartesian closed*, which is the punchline of the whole tree.",
      "Setting `B :≡ F A` on the left and feeding in `id_{F A}` produces `η_A : A → G F A`, the *unit* - “include the generators”. Dually the counit `ε_B : F G B → B` “evaluates”. The bijection can be recovered from `η` and `ε` alone.",
    ],
    figure: "adjunction",
    figcap: "The bijection is the definition; `F` is the left adjoint because it appears on the left of the Hom on the left-hand side.",
    defs: [
      { n: "Adjunction", b: "Functors `F : 𝒞 → 𝒟` and `G : 𝒟 → 𝒞` are adjoint (`F ⊣ G`) if there is a bijection `φ_{A,B} : 𝒟(F A, B) ≅ 𝒞(A, G B)` natural in `A` and `B`. `F` is the *left* adjoint, `G` the *right*." },
      { n: "Unit and counit", b: "`η_A :≡ φ(id_{F A}) : A → G F A` and `ε_B :≡ φ⁻¹(id_{G B}) : F G B → B`. They are natural transformations `η : Id_𝒞 ⇒ G F` and `ε : F G ⇒ Id_𝒟`." },
      { n: "Triangle identities", b: "`ε_{F A} ∘ F η_A = id_{F A}` and `G ε_B ∘ η_{G B} = id_{G B}`. Conversely, functors with natural `η, ε` satisfying these two equations form an adjunction - an equivalent, equation-only definition.", note: "The triangle identities are the version to use in proofs and in code; the Hom-set bijection is the version to use for intuition." },
      { n: "Cartesian closed category", b: "A category with a terminal object, all binary products, and, for each `A`, an exponential - equivalently a right adjoint to `(− × A)`. Abbreviated CCC." },
    ],
    thms: [
      {
        n: "Currying is an adjunction",
        b: "In a cartesian closed category, `(− × A) ⊣ ((−)ᴬ)`: `𝒞(X × A, B) ≅ 𝒞(X, Bᴬ)`, naturally in `X` and `B`.",
        pf: "The bijection is `curry`/`uncurry`, and you already verified both round trips in the products level using the η-rules. Naturality in `X` is the fact that currying commutes with precomposition. The counit is `eval : Bᴬ × A → B`; the unit is `λ`-abstraction of a projection. Same theorem, in two notations, one from each track.",
      },
      {
        n: "Free ⊣ forgetful",
        b: "`F : Set → Mon` (free monoid) is left adjoint to `U : Mon → Set`: `Mon(A*, M) ≅ Set(A, U M)`.",
        pf: "A homomorphism `h : A* → M` is determined by its values on single letters, since every word is a product of letters and `h` preserves products; conversely any function on letters extends uniquely by `h(a₁…aₙ) = h(a₁)·…·h(aₙ)`, well-defined because `M` is associative and unital. Naturality is routine. The unit `η_A : A → U F A` is “a letter is a one-letter word”.",
      },
      {
        n: "Right adjoints preserve limits",
        b: "If `F ⊣ G` then `G` preserves all limits that exist (in particular terminal objects and products), and `F` preserves all colimits.",
        pf: "Compute Hom-sets: `𝒞(X, G(A × B)) ≅ 𝒟(F X, A × B) ≅ 𝒟(F X, A) × 𝒟(F X, B) ≅ 𝒞(X, G A) × 𝒞(X, G B) ≅ 𝒞(X, G A × G B)`, naturally in `X`; then Yoneda gives `G(A × B) ≅ G A × G B`. That chain of natural isomorphisms is the standard professional move - worth reading twice. Contrapositive: a functor that fails to preserve products has no left adjoint.",
      },
    ],
    examples: [
      { h: "Free vector space ⊣ underlying set", b: "Linear maps out of `k^{(X)}` = arbitrary functions out of `X`. “A linear map is determined by its values on a basis” is an adjunction." },
      { h: "Discrete ⊣ underlying set ⊣ codiscrete", b: "`Top` and `Set`: the forgetful functor has both a left and a right adjoint. Adjoints on both sides is common and informative." },
      { h: "`(− × A) ⊣ (A → −)`", b: "Currying, in `Set` and in `Type`. The counit is function application." },
      { h: "Free monoid, again", b: "`Set ⇄ Mon`. Composing `U ∘ F` gives the `List` endofunctor - and this composite is where the `List` monad comes from, on the next level." },
      { h: "Not an adjunction", b: "The functor `P : Set → Set` (covariant powerset) has no right adjoint: it fails to preserve the relevant colimits. Check preservation properties first when hunting for adjoints." },
      { h: "Galois connections", b: "An adjunction between posets is exactly a Galois connection - `f(x) ≤ y ⟺ x ≤ g(y)`. Anyone who has ever paired “round down” with “include into” has used an adjunction without naming it." },
    ],
    quiz: [
      {
        stem: "In `F ⊣ G`, which bijection holds?",
        options: ["`𝒞(A, G B) ≅ 𝒟(F A, B)`", "`𝒞(G B, A) ≅ 𝒟(B, F A)`", "`𝒟(F A, B) ≅ 𝒞(G B, A)`", "`𝒞(A, B) ≅ 𝒟(F A, G B)`"],
        answer: 0,
        why: "The left adjoint sits on the *left* of the Hom-set in `𝒟`, the right adjoint on the *right* of the Hom-set in `𝒞`. That mnemonic is the whole of the notation.",
      },
      {
        stem: "How is the unit `η_A : A → G F A` obtained from the bijection?",
        options: ["`φ(id_{F A})`", "`φ⁻¹(id_{G A})`", "`φ(id_A)`", "It must be given as extra data"],
        answer: 0,
        why: "Put `B :≡ F A`, so `φ : 𝒟(F A, F A) → 𝒞(A, G F A)`, and feed it the identity. `φ(id_A)` is not even well-typed.",
      },
      {
        stem: "A functor `G` fails to preserve terminal objects. What follows?",
        options: ["`G` is not a functor", "`G` has no left adjoint", "`G` has no right adjoint", "`G` is not faithful"],
        answer: 1,
        why: "Right adjoints preserve limits, and the terminal object is a limit. So a functor that breaks it cannot *be* a right adjoint - cannot have a left adjoint. This is the standard non-existence argument.",
      },
    ],
    gate: {
      claim: "Derive the unit of an adjunction from the Hom-set bijection.",
      instruction: "Specialize the bijection, then feed it the only canonical morphism available.",
      steps: [
        { r: 1, t: "Assume `F ⊣ G` via a bijection `φ_{A,B} : 𝒟(F A, B) ≅ 𝒞(A, G B)`, natural in `A` and `B`." },
        { r: 2, t: "Take `B :≡ F A`, so `φ_{A,F A} : 𝒟(F A, F A) → 𝒞(A, G F A)`." },
        { r: 3, t: "The identity `id_{F A}` is an element of the domain; define `η_A :≡ φ_{A,F A}(id_{F A}) : A → G F A`." },
        { r: 4, t: "Naturality of `φ` in `A` makes the family `(η_A)` a natural transformation `η : Id_𝒞 ⇒ G F`." },
      ],
      distractors: [
        { t: "Take `A :≡ G B` and set `η :≡ φ⁻¹(id_{G B})`.", why: "That construction is correct but produces the *counit* `ε_B : F G B → B`, not the unit." },
        { t: "Define `η_A :≡ φ(id_A)`.", why: "Ill-typed: `φ`'s domain is `𝒟(F A, B)`, and `id_A` lives in `𝒞(A,A)`." },
        { t: "Take `B :≡ A` and use `φ` on `id_A`.", why: "`B` must be an object of `𝒟`, and `F A` is the only canonical one available." },
      ],
      conclusion: "`η_A = φ(id_{F A}) : A → G F A`, natural in `A`.  ∎",
    },
  },

  {
    id: "mnd",
    track: "ct",
    title: "Monads",
    short: ["Monads", "and Kleisli"],
    pos: { x: 505, y: 796 },
    req: ["adj"],
    thesis: "A monoid in the category of endofunctors. Every adjunction produces one, and so does every notion of computational effect - state, failure, logging, continuations.",
    wild: "`(T, η, μ)`, `bind`, Kleisli category, algebras, “effectful”. Also `Writer`, `State`, `Cont`, and the sequencing notation that functional languages build on top of them.",
    intuition: [
      "Take the prologue's monoid `(M, ·, e)`. Replace the set by an endofunctor `T`, the multiplication `· : M × M → M` by a natural transformation `μ : T T ⇒ T`, and the unit `e` by `η : Id ⇒ T`. Demand the same two laws - associativity and unit - and you have a monad. The definition is literally the monoid axioms in a different category.",
      "For a programmer: `T X` is “an `X` in a context”, `η` puts a value into the context, `μ` flattens a doubly-wrapped value. `bind` is `μ` composed with `T` of the function: `bind(f, t) = μ(T f (t))`. `List` flattens lists of lists; `Maybe` collapses `Just Nothing`; `State` threads state.",
      "Where do monads come from? From adjunctions: given `F ⊣ G`, the composite `T :≡ G F` is a monad, with `η` the unit of the adjunction and `μ :≡ G ε F`. `Set ⇄ Mon` gives the `List` monad this way. That is the sense in which monads are not an ad hoc programming trick - they are the shadow that a free construction casts on the category it came from.",
    ],
    figure: "monad",
    figcap: "The associativity law. Compare the monoid diagram from the prologue: it is the same square with `T` in place of `M`.",
    defs: [
      { n: "Monad", b: "An endofunctor `T : 𝒞 → 𝒞` with `η : Id ⇒ T` and `μ : T T ⇒ T` such that `μ ∘ Tμ = μ ∘ μT` (associativity) and `μ ∘ Tη = id_T = μ ∘ ηT` (unit laws)." },
      { n: "Kleisli triple", b: "Equivalently: `T` on objects, `η_X : X → T X`, and for each `f : X → T Y` a map `f* : T X → T Y` (`bind`), with `η* = id`, `f* ∘ η = f`, and `(f*∘g)* = f* ∘ g*`. This is the presentation used in programming, and it is *equivalent* to the `(T,η,μ)` one." },
      { n: "Kleisli category", b: "`𝒞_T` has the objects of `𝒞`, with `𝒞_T(X,Y) :≡ 𝒞(X, T Y)`; identity is `η_X`, and composition is `g ∘_T f :≡ μ ∘ T g ∘ f`. The monad laws are exactly what make this a category - effectful functions compose associatively.", note: "This is the useful reading for programming: the monad laws are not arbitrary; they are the price of composing effectful functions the way you compose plain ones." },
      { n: "Algebra for a monad", b: "An object `A` with `a : T A → A` satisfying `a ∘ η_A = id` and `a ∘ μ_A = a ∘ T a`. For the `List` monad, algebras *are* monoids - so “monoid” is recovered from “monad”." },
    ],
    thms: [
      {
        n: "Every adjunction gives a monad",
        b: "If `F ⊣ G` with unit `η` and counit `ε`, then `T :≡ G F` with that `η` and `μ :≡ G ε F` is a monad.",
        pf: "The monad laws follow from naturality of `ε` and the triangle identities: `μ ∘ Tη = G ε F ∘ G F η = G(ε F ∘ F η) = G(id) = id`, and similarly for the other unit law and associativity. Not every monad arises from an adjunction you have already seen, but every monad *does* arise from its own free–forgetful adjunction with its category of algebras - Eilenberg–Moore.",
      },
      {
        n: "Monoids are monad algebras",
        b: "The category of algebras for the `List` monad on `Set` is isomorphic to `Mon`.",
        pf: "An algebra `a : List A → A` with the two laws is exactly a way of multiplying out finite sequences, associatively and unitally - that is a monoid, and conversely. The prologue's structure has been rebuilt out of purely categorical parts.",
      },
      {
        n: "`Writer M` is a monad iff `M` is a monoid",
        b: "For `T X :≡ M × X` with `η(x) = (e,x)` and `μ(m,(n,x)) = (m·n, x)`, the three monad laws hold exactly when `(M,·,e)` satisfies the three monoid laws.",
        pf: "The gate below. The correspondence is line by line: left unit ↔ left unit, right unit ↔ right unit, associativity ↔ associativity. If you want one example to remember why monads are called monoids in disguise, use this one.",
      },
    ],
    examples: [
      { h: "`Maybe`", b: "`T X = 1 + X`, `η = inr`, `μ` collapses a nested failure. Kleisli composition is composition of partial functions." },
      { h: "`List`", b: "`η x = [x]`, `μ = concat`. Kleisli arrows `X → List Y` are non-deterministic functions; composition is “try all”." },
      { h: "`Writer M`", b: "`T X = M × X` for a monoid `M`. Accumulates logs. Requires monoid laws - nothing more, nothing less." },
      { h: "`State S`", b: "`T X = S → S × X`, `η x = λs. (s,x)`, `μ` runs the outer computation then the inner one. Not obtained from an obvious free–forgetful pair, but it *is* the monad of the adjunction `(− × S) ⊣ (S → −)` - currying again." },
      { h: "Not a monad", b: "`T X = X → 2` (contravariant, so not even an endofunctor on `Type` covariantly) and `T X = X × X` with the obvious `η` and no coherent `μ` - associativity fails. The laws are a real constraint." },
    ],
    quiz: [
      {
        stem: "Which slogan correctly describes a monad?",
        options: [
          "A functor with a natural isomorphism `T T ≅ T`",
          "A monoid in the category of endofunctors, with `μ : T T ⇒ T` as multiplication and `η : Id ⇒ T` as unit",
          "A functor that preserves all limits",
          "An adjunction between a category and itself",
        ],
        answer: 1,
        why: "`μ` is not required to be invertible - flattening loses information. The monoid analogy is exact, in the monoidal category of endofunctors under composition.",
      },
      {
        stem: "Given `F ⊣ G` with unit `η` and counit `ε`, what is the multiplication of the induced monad `G F`?",
        options: ["`η G F`", "`G ε F`", "`ε G F`", "`G η F`"],
        answer: 1,
        why: "Types decide it: `ε : F G ⇒ Id`, so `G ε F : G F G F ⇒ G F`, which is `T T ⇒ T`. The other combinations do not typecheck.",
      },
      {
        stem: "What do the monad laws buy you, in the Kleisli reading?",
        options: [
          "That `T` preserves products",
          "That effectful functions `X → T Y` compose associatively with `η` as identity - i.e. that `𝒞_T` is a category",
          "That every effect can be undone",
          "That `bind` is injective",
        ],
        answer: 1,
        why: "Unit laws give identities, associativity gives associative composition. Do-notation is legitimate exactly because of these laws.",
      },
    ],
    gate: {
      claim: "Prove: `T X = M × X` is a monad exactly when `(M, ·, e)` is a monoid.",
      instruction: "Write down the structure, then translate each monad law into a condition on `M`.",
      steps: [
        { r: 1, t: "Set `η_X(x) :≡ (e, x)` and `μ_X(m, (n, x)) :≡ (m · n, x)`; `T f (m,x) = (m, f x)`." },
        { r: 2, t: "`μ ∘ Tη = id` requires `(m · e, x) = (m, x)` - that is, `e` is a right unit." },
        { r: 3, t: "`μ ∘ ηT = id` requires `(e · m, x) = (m, x)` - that is, `e` is a left unit." },
        { r: 4, t: "`μ ∘ Tμ = μ ∘ μT` requires `((m · n) · p, x) = (m · (n · p), x)` - associativity." },
        { r: 5, t: "The three monad laws are precisely the three monoid laws, so each condition holds iff the other does." },
      ],
      distractors: [
        { t: "Naturality of `μ` forces `m · n = n · m`.", why: "Naturality is in `X`, not in `M`; commutativity is never required. `Writer` over strings is a standard monad." },
        { t: "`μ` must be invertible, so `M` needs inverses.", why: "Monads require no invertibility - `μ` is a multiplication, not an isomorphism." },
        { t: "`η` must be an isomorphism for the unit laws to hold.", why: "The unit laws say `μ ∘ Tη = id_T`, not that `η` itself is invertible. `η` is rarely an isomorphism." },
      ],
      conclusion: "`Writer M` is a monad iff `M` is a monoid.  ∎",
    },
  },

  /* ---------------- THE BRIDGE ---------------- */
  {
    id: "ccc",
    track: "core",
    title: "The Curry–Howard–Lambek bridge",
    short: ["Where the two", "tracks meet"],
    pos: { x: 330, y: 930 },
    req: ["dep", "mnd"],
    thesis: "Typed λ-calculi and cartesian closed categories are the same thing, presented twice. Once you see it, the two subjects stop being two subjects.",
    wild: "“the internal language of a CCC”, “the syntactic category”, “models of the type theory in 𝒞”, “sound and complete with respect to”. Every semantics section ever written is this theorem, applied.",
    intuition: [
      "Take a simply typed λ-calculus. Build a category: objects are types, and a morphism `A → B` is a term `x : A ⊢ t : B`, two terms being the same morphism when they are βη-equal. Identity is the variable `x`; composition is substitution. Check the axioms - associativity of substitution, and `t[x/x] = t` - and you have a category.",
      "Now ask what structure it has. The unit type is terminal (exactly one term of type `1`, by η). `A × B` is the categorical product (pairing gives existence, η gives uniqueness). And `A → B` is the exponential, because currying is a natural bijection. So the syntactic category is *cartesian closed*.",
      "The converse also holds: from any cartesian closed category you can read off a typed λ-calculus - its *internal language* - whose types are the objects and whose terms are the morphisms. Lambek's theorem makes this an equivalence. Add the logical reading from Curry–Howard and you get one object with three faces: proof, program, arrow.",
      "So when a text says “we assume basic type theory and category theory”, what it is really assuming is that you can move between these three columns without stopping. Dependent types raise the stakes - the categorical counterpart becomes fibrations or locally cartesian closed categories, and the identity type becomes path objects - but the method of translation is the one you just learned.",
    ],
    figure: "bridge",
    figcap: "Two vocabularies for one structure. Fluency means never having to stop and translate.",
    defs: [
      { n: "Syntactic category", b: "For a simply typed λ-theory `𝕋`: objects are types; `Hom(A,B)` is the set of terms `x : A ⊢ t : B` modulo βη-equality; identity is `x`; composition of `t : A → B` and `s : B → C` is `s[t/y]`." },
      { n: "Internal language", b: "For a CCC `𝒞`: a λ-theory whose types are the objects of `𝒞`, whose terms `x : A ⊢ t : B` are the morphisms `A → B`, with products and exponentials interpreting `×` and `→`." },
      { n: "Model / interpretation", b: "An interpretation of a λ-theory in a CCC `𝒞` is a structure-preserving assignment: types to objects, terms to morphisms, respecting products and exponentials. *Soundness*: βη-equal terms get equal morphisms. *Completeness*: if all models agree, the terms are βη-equal.", note: "This is what a “semantics” section does, wherever you find one: pick a category, interpret the syntax in it, prove soundness. The category is chosen so that the property you care about becomes easy to see." },
    ],
    thms: [
      {
        n: "Curry–Howard–Lambek",
        b: "The syntactic category of a simply typed λ-theory with `1`, `×`, `→` is cartesian closed; conversely every CCC arises this way, up to equivalence. Type theories with products and exponentials, and cartesian closed categories, are two presentations of one notion.",
        pf: "The gate below builds the forward direction. The converse takes the internal language and checks that the two constructions are mutually inverse up to equivalence of categories. Together with Curry–Howard the result is a triple correspondence: intuitionistic proof ↔ typed program ↔ arrow in a CCC.",
      },
      {
        n: "Where the dictionary continues",
        b: "Sums correspond to coproducts; inductive types to initial algebras of endofunctors; `Π` and `Σ` to right and left adjoints of pullback along a display map, i.e. to a locally cartesian closed structure or a fibration; the identity type to a path object; a monad on the syntax to a computational effect.",
        pf: "Each line is a theorem in its own right and each is an active research area - but the *shape* is always the same: a type former is an adjoint, and its β and η rules are the existence and uniqueness halves of the corresponding universal property. When you meet a new type former anywhere, look for its adjoint. That single habit is what this tree was built to hand you.",
      },
    ],
    examples: [
      { h: "`Set` as a model", b: "`Set` is cartesian closed, so it interprets the simply typed λ-calculus: types become sets, terms become functions. The obvious semantics - and it validates strictly more than the syntax proves, e.g. function extensionality." },
      { h: "Presheaves", b: "`[𝒞ᵒᵖ, Set]` is cartesian closed for any small `𝒞`, and models a great deal more. Presheaf models are the workhorse for semantics of dependent types, including cubical type theory." },
      { h: "A domain-theoretic model", b: "Categories of domains and continuous maps are cartesian closed and model recursion - the classical semantics for languages with fixed points and non-termination." },
      { h: "The next thing you read", b: "When a text says “we work in a cartesian closed category 𝒞”, it means: we may write λ-terms, and every equation derived syntactically is true of the arrows. When it says “internal language”, it is licensing exactly that shift - and you are now entitled to make it too." },
    ],
    quiz: [
      {
        stem: "In the syntactic category of a λ-theory, what is a morphism `A → B`?",
        options: [
          "A function from the closed terms of `A` to those of `B`",
          "A term `x : A ⊢ t : B`, taken up to βη-equality",
          "A pair of a type and a term",
          "A derivation of `A → B`",
        ],
        answer: 1,
        why: "An open term in one variable, quotiented by βη. Quotienting is essential: without it composition would not be associative on the nose.",
      },
      {
        stem: "Which type-theoretic rule makes the unit type a *terminal* object rather than just an object with a point?",
        options: ["Its formation rule", "Its introduction rule `⋆ : 1`", "Its η-rule, `t ≡ ⋆` for all `t : 1`", "The rule `absurd : 0 → C`"],
        answer: 2,
        why: "Existence of an arrow into `1` comes from `⋆`; *uniqueness* - the defining half of terminality - is the η-rule.",
      },
      {
        stem: "Somewhere you read: “`Π` is right adjoint to pullback along a display map”. Given this tree, what should you expect its β and η rules to be?",
        options: [
          "Arbitrary conventions of the system",
          "The existence and uniqueness halves of the universal property of that adjoint",
          "Consequences of strong normalization",
          "The naturality squares of a functor",
        ],
        answer: 1,
        why: "That is the pattern throughout: introduction and β give existence and computation, η gives uniqueness, and together they say the type former is an adjoint. Knowing the shape means you can read a new type former without being told what it does.",
      },
    ],
    gate: {
      claim: "Prove: the syntactic category of a simply typed λ-theory with `1`, `×`, `→` is cartesian closed.",
      instruction: "Build the category first, then verify the three pieces of structure. This is the last gate.",
      steps: [
        { r: 1, t: "Objects: the types of the theory. Morphisms `A → B`: terms `x : A ⊢ t : B` modulo βη-equality." },
        { r: 2, t: "Identity on `A`: the variable `x`. Composition of `t : A → B` and `s : B → C`: the substitution `s[t/y]`." },
        { r: 3, t: "Associativity and the identity laws hold because substitution is associative and `t[x/x] ≡ t`, so this is a category." },
        { r: 4, t: "`1` is terminal: `⋆` gives a morphism from every object, and the η-rule for `1` makes it the only one." },
        { r: 5, t: "`A × B` is the product: pairing gives `⟨f,g⟩`, the projection β-rules give the two equations, and η for products gives uniqueness." },
        { r: 6, t: "`A → B` is the exponential: `curry`/`uncurry` is a bijection `Hom(X × A, B) ≅ Hom(X, A → B)`, natural in `X`, with `eval` as counit." },
        { r: 7, t: "Terminal object, binary products, and exponentials - the category is cartesian closed." },
      ],
      distractors: [
        { t: "Morphisms `A → B`: functions from the set of closed terms of `A` to the set of closed terms of `B`.", why: "That construction throws away open terms and is not functorial in the theory. Morphisms are the terms themselves." },
        { t: "Composition of `t : A → B` and `s : B → C`: the application `s t`.", why: "`s` is a term of type `C` with a free variable, not a function term. Composition in the syntactic category is substitution." },
        { t: "`A + B` is the product, since it combines two types.", why: "Sums are *co*products - the universal property points the other way." },
      ],
      conclusion: "The syntactic category is a CCC; with Lambek's converse, typed λ-calculi and CCCs are two presentations of one notion.  ∎",
    },
  },
];

const CH_DICT = [
  ["`A → B`", "`A` implies `B`", "a function turning proofs of `A` into proofs of `B`"],
  ["`A × B`", "`A` and `B`", "a pair: both proofs at once"],
  ["`A + B`", "`A` or `B`", "a tagged proof: which side, plus the proof"],
  ["`1`", "true", "the trivial proof `⋆`"],
  ["`0`", "false", "no proof exists"],
  ["`¬A ≡ A → 0`", "not `A`", "a refutation: turns any proof of `A` into absurdity"],
  ["`Π(x:A) B x`", "for all `x : A`, `B x`", "a function producing evidence at each `x`"],
  ["`Σ(x:A) B x`", "there exists `x : A` with `B x`", "a witness paired with its evidence"],
  ["`a =_A b`", "`a` equals `b`", "an identification, constructed from `refl`"],
];

const NOTATION = [
  ["`⊢`", "turnstile: “derives”. `Γ ⊢ a : A` - in context `Γ`, the term `a` has type `A`."],
  ["`≡`", "definitional equality - decided by computation. A judgment, not a type."],
  ["`=`", "propositional equality: the identity type `Id_A(a,b)`. Something you construct and prove about."],
  ["`:≡`", "“is defined to be”."],
  ["`λx. t`", "abstraction. `t[a/x]` is capture-avoiding substitution of `a` for `x` in `t`."],
  ["`Π`, `Σ`", "dependent function and pair types. Generalize `→` and `×`; read as `∀` and `∃`."],
  ["`⟶β`", "β-reduction. `η` is the dual uniqueness rule."],
  ["`𝒞(A,B)`, `Hom(A,B)`", "the set of morphisms from `A` to `B` in the category `𝒞`."],
  ["`id_A`, `g ∘ f`", "identity and composition. `g ∘ f` means “`f` first”."],
  ["`𝒞ᵒᵖ`", "the opposite category: same objects, arrows reversed."],
  ["`F : 𝒞 → 𝒟`", "a functor. Preserves `id` and `∘`."],
  ["`α : F ⇒ G`", "a natural transformation, with components `α_X : F X → G X`."],
  ["`≅`", "isomorphism (of objects), or natural isomorphism (of functors)."],
  ["`∃!`", "“there exists exactly one” - the operative part of every universal property."],
  ["`F ⊣ G`", "`F` is left adjoint to `G`: `𝒟(F A, B) ≅ 𝒞(A, G B)`, naturally."],
  ["`η`, `ε`", "unit and counit of an adjunction; `η` is also a monad's unit and the name of an equality rule. Context disambiguates."],
  ["`(T, η, μ)`", "a monad: endofunctor, unit, multiplication."],
  ["`CCC`", "cartesian closed category: terminal object, binary products, exponentials."],
  ["`[𝒞, 𝒟]`", "the functor category. `[𝒞ᵒᵖ, Set]` is the category of presheaves."],
  ["`∎`", "end of proof. In this tree, a level you have cleared."],
];

const EDGE_LABEL = {
  "algebra>judg": "formalize",
  "algebra>cat": "generalize",
  "judg>fun": "λ",
  "fun>prod": "×  +",
  "prod>ind": "rec",
  "ind>ch": "as logic",
  "ch>dep": "Π  Σ",
  "cat>func": "F",
  "func>nt": "α",
  "nt>univ": "∃!",
  "univ>adj": "⊣",
  "adj>mnd": "G F",
  "dep>ccc": "syntax",
  "mnd>ccc": "structure",
};
const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const TRACK_NAME = { core: "Bridge", tt: "Type theory", ct: "Category theory" };
const TRACK_COLOR = { core: C.ink, tt: C.syn, ct: C.str };

/* ================================================================== *
 *  MAP
 * ================================================================== */
function Graph({ done, isOpen, go }) {
  const NW = 200, NH = 52;
  return (
    <div className="graph">
      <svg viewBox="0 0 660 1002" role="group" aria-label="Learning map">
        <Defs />
        {NODES.flatMap((n) =>
          n.req.map((r) => {
            const p = BY_ID[r].pos, q = n.pos;
            const y1 = p.y + NH / 2 + 2, y2 = q.y - NH / 2 - 2;
            const label = EDGE_LABEL[`${r}>${n.id}`];
            const vertical = p.x === q.x;
            return (
              <g key={`${r}-${n.id}`}>
                <Ar x1={p.x} y1={y1} x2={q.x} y2={y2} c="soft" />
                {label && (
                  <text
                    x={(p.x + q.x) / 2 + (vertical ? 9 : 0)}
                    y={(y1 + y2) / 2 + (vertical ? 4 : -6)}
                    fontSize="11" fill={C.soft} textAnchor={vertical ? "start" : "middle"}
                    fontFamily="ui-monospace,monospace"
                  >{label}</text>
                )}
              </g>
            );
          })
        )}
        {NODES.map((n) => {
          const open = isOpen(n.id), fin = done.includes(n.id);
          const x = n.pos.x - NW / 2, y = n.pos.y - NH / 2;
          const tc = TRACK_COLOR[n.track];
          return (
            <g key={n.id} className={`gn${open ? "" : " locked"}`} tabIndex={open ? 0 : -1}
              role="button" aria-label={n.title}
              onClick={() => open && go(n.id)}
              onKeyDown={(e) => { if (open && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); go(n.id); } }}>
              <rect className="box" x={x} y={y} width={NW} height={NH} rx="2"
                fill={open ? C.panel : "none"} stroke={fin ? tc : open ? C.ink : C.rule}
                strokeWidth={fin ? 1.5 : 1} strokeDasharray={open ? undefined : "4 3"} />
              {open && <rect x={x} y={y} width="3" height={NH} fill={tc} />}
              <text x={x + 14} y={y + 22} fontSize="13.5" fill={open ? C.ink : C.soft}
                fontFamily='"Iowan Old Style",Palatino,Georgia,serif'>{n.short[0]}</text>
              <text x={x + 14} y={y + 39} fontSize="13.5" fill={open ? C.ink : C.soft}
                fontFamily='"Iowan Old Style",Palatino,Georgia,serif'>{n.short[1]}</text>
              {fin && <text x={x + NW - 12} y={y + 39} fontSize="14" fill={C.ok} textAnchor="end"
                fontFamily="ui-monospace,monospace">∎</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ListMap({ done, isOpen, go }) {
  const groups = [
    ["Prologue", NODES.filter((n) => n.id === "algebra")],
    ["Type theory", NODES.filter((n) => n.track === "tt")],
    ["Category theory", NODES.filter((n) => n.track === "ct")],
    ["The bridge", NODES.filter((n) => n.id === "ccc")],
  ];
  return (
    <div className="listmap">
      {groups.map(([name, ns]) => (
        <section key={name}>
          <div className="track-h">
            <span className="k" style={{ background: TRACK_COLOR[ns[0].track] }} />
            <span className="eyebrow">{name}</span>
          </div>
          <div className="rail">
            {ns.map((n) => {
              const open = isOpen(n.id), fin = done.includes(n.id);
              return (
                <button key={n.id} className={`card${open ? "" : " locked"}${fin ? " done" : ""}`}
                  onClick={() => open && go(n.id)} disabled={!open}>
                  {fin && <span className="qed">∎</span>}
                  {!open && <span className="lockw">locked</span>}
                  <div className="t serif">{n.title}</div>
                  <div className="s">
                    {open ? n.short.join(" ") : `Requires: ${n.req.map((r) => BY_ID[r].title).join(", ")}`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ================================================================== *
 *  QUIZ
 * ================================================================== */
function Quiz({ node, onPass, passed }) {
  const [state, setState] = useState(() => node.quiz.map(() => ({ ok: false, wrong: [] })));
  useEffect(() => { setState(node.quiz.map(() => ({ ok: false, wrong: [] }))); }, [node.id]);
  useEffect(() => { if (state.every((s) => s.ok)) onPass(); }, [state]);
  const pick = (qi, oi) =>
    setState((s) =>
      s.map((v, i) => {
        if (i !== qi || v.ok) return v;
        return oi === node.quiz[qi].answer
          ? { ...v, ok: true }
          : { ...v, wrong: v.wrong.includes(oi) ? v.wrong : [...v.wrong, oi] };
      })
    );
  return (
    <div>
      {node.quiz.map((q, qi) => {
        const s = state[qi];
        return (
          <div className="q" key={qi}>
            <div className="stem"><Rich t={q.stem} /></div>
            {q.options.map((o, oi) => {
              const good = s.ok && oi === q.answer;
              const bad = s.wrong.includes(oi);
              return (
                <button key={oi} className={`opt${good ? " good" : ""}${bad ? " bad" : ""}`}
                  disabled={s.ok} onClick={() => pick(qi, oi)}>
                  <Rich t={o} />
                </button>
              );
            })}
            {(s.ok || s.wrong.length > 0) && (
              <p className="why-q">{s.ok ? "" : "Not that one. "}<Rich t={q.why} /></p>
            )}
          </div>
        );
      })}
      <p className="why-q">{passed ? "Checks cleared - the gate below is open." : "Clear every check to open the gate."}</p>
    </div>
  );
}

/* ================================================================== *
 *  GATE - the derivation builder
 * ================================================================== */
const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };

function Gate({ node, unlocked, proved, onProve }) {
  const g = node.gate;
  const ordered = useMemo(() => [...g.steps].sort((a, b) => a.r - b.r), [node.id]);
  const tokens = useMemo(() => {
    const all = [
      ...g.steps.map((s, i) => ({ ...s, key: `s${i}`, step: true })),
      ...g.distractors.map((d, i) => ({ ...d, key: `d${i}`, step: false })),
    ];
    return all.sort((a, b) => hash(a.t + node.id) - hash(b.t + node.id));
  }, [node.id]);

  const [placed, setPlaced] = useState(() => (proved ? [...ordered] : []));
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [strikes, setStrikes] = useState(0);
  useEffect(() => { setPlaced(proved ? [...ordered] : []); setMsg(null); setStrikes(0); }, [node.id]);

  const complete = placed.length === g.steps.length;
  useEffect(() => { if (complete) onProve(); }, [complete]);

  const remainingRanks = ordered.filter((s) => !placed.some((p) => p.t === s.t)).map((s) => s.r);
  const curRank = remainingRanks.length ? Math.min(...remainingRanks) : 0;

  const tap = (tok) => {
    if (complete) return;
    if (tok.step && tok.r === curRank) {
      setPlaced((p) => [...p, tok]);
      setMsg(null);
    } else {
      setShake(tok.key);
      setTimeout(() => setShake(null), 320);
      setStrikes((s) => s + 1);
      setMsg(tok.step ? "That line is true, but not yet - something earlier is missing." : tok.why);
    }
  };

  if (!unlocked) {
    return (
      <div className="gate shut">
        <div className="eyebrow" style={{ color: C.gate }}>Gate - closed</div>
        <p style={{ margin: "8px 0 0" }}><Rich t={g.claim} /></p>
        <p className="note">Clear the checks above and the lines of the proof appear here.</p>
      </div>
    );
  }
  return (
    <div className="gate">
      <div className="eyebrow" style={{ color: C.gate }}>Gate {complete ? "- cleared" : "- open"}</div>
      <p style={{ margin: "8px 0 4px" }}><b><Rich t={g.claim} /></b></p>
      <p className="note" style={{ marginBottom: 14 }}>{g.instruction}</p>

      <div className="premises">
        {placed.length === 0 && <div className="empty">No premises yet. Choose the first line.</div>}
        {placed.map((p, i) => (
          <div className="prem" key={i}>
            <span className="n">{i + 1}.</span>
            <span><Rich t={p.t} /></span>
          </div>
        ))}
      </div>
      <div className={`rulebar${complete ? " full" : ""}`} />
      <div className={`concl${complete ? "" : " hidden"}`}>
        {complete ? <b><Rich t={g.conclusion} /></b> : `${g.steps.length - placed.length} line(s) still needed.`}
      </div>

      {!complete && (
        <div className="tokens">
          {tokens.filter((t) => !placed.some((p) => p.t === t.t)).map((t) => (
            <button key={t.key} className={`tok${shake === t.key ? " wrong" : ""}`} onClick={() => tap(t)}>
              <Rich t={t.t} />
            </button>
          ))}
        </div>
      )}
      {msg && !complete && <p className="why-q" style={{ marginTop: 12 }}><Rich t={msg} /></p>}
      {!complete && (
        <div className="strikes">
          <span>{placed.length} / {g.steps.length} lines · {strikes} misstep{strikes === 1 ? "" : "s"}</span>
          {placed.length > 0 && (
            <button className="ghost" onClick={() => { setPlaced([]); setMsg(null); }}>Start over</button>
          )}
        </div>
      )}
      {complete && (
        <div className="done-banner">
          <b>Proved.</b> {proved ? "This level stays cleared." : "Level cleared - the map has opened up."}
        </div>
      )}
    </div>
  );
}

/* ================================================================== *
 *  NODE PAGE
 * ================================================================== */
function NodeView({ node, done, back, onProve }) {
  const [quizOK, setQuizOK] = useState(done.includes(node.id));
  useEffect(() => { setQuizOK(done.includes(node.id)); }, [node.id]);
  const proved = done.includes(node.id);
  const unlocks = NODES.filter((n) => n.req.includes(node.id));

  return (
    <div>
      <button className="backlink" onClick={back}>← Map</button>
      <div className="eyebrow" style={{ color: TRACK_COLOR[node.track], marginTop: 14 }}>
        {TRACK_NAME[node.track]}
        {node.req.length > 0 && ` · after ${node.req.map((r) => BY_ID[r].title.toLowerCase()).join(" & ")}`}
        {proved && " · proved ∎"}
      </div>
      <h2 className="node serif">{node.title}</h2>
      <p className="thesis serif">{node.thesis}</p>
      <div className="why"><b>Where you will meet it. </b><Rich t={node.wild} /></div>

      <h3 className="sec">Intuition</h3>
      {node.intuition.map((p, i) => <p key={i} style={{ marginTop: i ? 12 : 0 }}><Rich t={p} /></p>)}
      {node.figure === "table:ch" ? (
        <figure>
          <table className="dict">
            <thead><tr><th>Type</th><th>Proposition</th><th>A term of it is</th></tr></thead>
            <tbody>
              {CH_DICT.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}><Rich t={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
          <figcaption>{node.figcap}</figcaption>
        </figure>
      ) : (
        <figure>
          <Figure kind={node.figure} />
          <figcaption><Rich t={node.figcap} /></figcaption>
        </figure>
      )}

      <h3 className="sec">Definitions</h3>
      {node.defs.map((d, i) => (
        <div className="box def" key={i}>
          <span className="lab serif">{d.n}. </span><Rich t={d.b} />
          {d.note && <p className="note"><Rich t={d.note} /></p>}
        </div>
      ))}

      <h3 className="sec">Theorems</h3>
      {node.thms.map((t, i) => (
        <div className="box thm" key={i}>
          <span className="lab serif">Theorem ({t.n}). </span><Rich t={t.b} />
          {t.pf && (
            <details className="pf">
              <summary>Proof / commentary</summary>
              <div className="body"><Rich t={t.pf} /></div>
            </details>
          )}
        </div>
      ))}

      <h3 className="sec">Examples</h3>
      <ul className="ex">
        {node.examples.map((e, i) => (
          <li key={i}><div className="h serif"><Rich t={e.h} /></div><div><Rich t={e.b} /></div></li>
        ))}
      </ul>

      <h3 className="sec">Check yourself</h3>
      <Quiz node={node} passed={quizOK} onPass={() => setQuizOK(true)} />

      <h3 className="sec">Proof gate</h3>
      <Gate node={node} unlocked={quizOK} proved={proved} onProve={() => onProve(node.id)} />

      {proved && unlocks.length > 0 && (
        <p style={{ marginTop: 18, fontSize: 15 }}>
          Opens: {unlocks.map((u) => u.title).join(", ")}.
          <br /><button className="next" onClick={back}>Back to the map</button>
        </p>
      )}
      {proved && unlocks.length === 0 && (
        <p style={{ marginTop: 18, fontSize: 15 }}>
          That was the last gate. Fourteen proofs ago this was a set with one operation on it. What you have now is the
          shared vocabulary of two subjects - and, more usefully, the habit of asking of every new type former: what is
          its universal property, and what is it adjoint to?
          <br /><button className="next" onClick={back}>Back to the map</button>
        </p>
      )}
    </div>
  );
}

/* ================================================================== *
 *  APP
 * ================================================================== */
const KEY = "turnstile-progress-v1";

export default function App() {
  const [done, setDone] = useState([]);
  const [view, setView] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [armed, setArmed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(KEY);
        if (r && r.value) setDone(JSON.parse(r.value));
      } catch (e) { /* nothing saved yet */ }
      setLoaded(true);
    })();
  }, []);

  const save = (next) => {
    setDone(next);
    (async () => { try { await window.storage.set(KEY, JSON.stringify(next)); } catch (e) {} })();
  };
  const prove = (id) => { if (!done.includes(id)) save([...done, id]); };
  const isOpen = (id) => BY_ID[id].req.every((r) => done.includes(r));
  const node = view ? BY_ID[view] : null;

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  return (
    <div className="ctt">
      <style>{CSS}</style>
      <header className="bar">
        <div className="bar-in">
          <span className="mark">⊢ Turnstile</span>
          <div className="meter" aria-hidden="true"><i style={{ width: `${(done.length / NODES.length) * 100}%` }} /></div>
          <span style={{ fontSize: 13, color: C.soft, fontFamily: "ui-monospace,monospace" }}>
            {done.length}/{NODES.length} ∎
          </span>
          <button className="ghost" onClick={() => setSheet(true)}>Notation</button>
        </div>
      </header>

      <div className="wrap">
        {!node && (
          <>
            <div className="eyebrow" style={{ marginTop: 30 }}>A proof-gated path · fourteen levels</div>
            <h1 className="hero serif">One operation,<br /><em>two subjects</em></h1>
            <p className="lede">
              Start with <b>a set and a way to combine its elements</b>. Fourteen levels later you arrive at{" "}
              <b>cartesian closed categories</b>, where type theory and category theory turn out to be the same subject
              described twice. Every level ends at a gate: assemble the proof one line at a time, and the next level
              opens. Nothing unlocks by reading.
            </p>
            <p className="lede" style={{ marginTop: 12 }}>
              Nothing is assumed beyond ordinary school algebra. Every definition, symbol, and proof technique the path
              needs is introduced here, in order.
            </p>
            {loaded && done.length === 0 && (
              <p className="lede" style={{ marginTop: 12 }}>Start at the prologue. Progress is saved as you go.</p>
            )}
            <Graph done={done} isOpen={isOpen} go={setView} />
            <ListMap done={done} isOpen={isOpen} go={setView} />
            <div className="legend">
              <span><b style={{ color: C.ok }}>∎</b> proved</span>
              <span>dashed - locked</span>
              <span><b style={{ color: C.syn }}>—</b> type theory</span>
              <span><b style={{ color: C.str }}>—</b> category theory</span>
              {done.length > 0 && (
                <button className="ghost" onClick={() => { if (armed) { save([]); setArmed(false); } else setArmed(true); }}>
                  {armed ? "Tap again to clear all progress" : "Reset progress"}
                </button>
              )}
            </div>
          </>
        )}
        {node && <NodeView node={node} done={done} back={() => setView(null)} onProve={prove} />}
      </div>

      {sheet && (
        <div className="sheet" onClick={() => setSheet(false)}>
          <div className="sheet-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="eyebrow">Notation you will meet</span>
              <button className="ghost" onClick={() => setSheet(false)}>Close</button>
            </div>
            <table className="dict" style={{ marginTop: 14 }}>
              <tbody>
                {NOTATION.map(([s, d], i) => (
                  <tr key={i}>
                    <td style={{ width: 130 }}><Rich t={s} /></td>
                    <td><Rich t={d} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
