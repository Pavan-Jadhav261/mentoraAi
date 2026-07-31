'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'

const RAW_HTML = `
<div id="svm-quest-container">
<style>
  #svm-quest-container {
    --bg:#0a0e17;
    --panel:#111826;
    --card:#161f30;
    --card-2:#1c2740;
    --line:#243352;
    --text:#e7ecf5;
    --muted:#8b96ad;
    --neg:#38bdf8;
    --pos:#fb923c;
    --safe:#34d399;
    --danger:#f87171;
    --glow:#7dd3fc;
    --predict:#c084fc;
    --radius:14px;
    font-size:16px;
    font-family:'Inter', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  html.light #svm-quest-container {
    --bg:#F8F5F2;
    --panel:#ffffff;
    --card:#f3f4f6;
    --card-2:#e5e7eb;
    --line:#d1d5db;
    --text:#111827;
    --muted:#6b7280;
    --glow:#0ea5e9;
  }

  #svm-quest-container .bg-gradient {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(ellipse 900px 500px at 15% -10%, rgba(56,189,248,.10), transparent 60%),
      radial-gradient(ellipse 900px 500px at 100% 0%, rgba(251,146,60,.08), transparent 60%),
      var(--bg);
  }
  html.light #svm-quest-container .bg-gradient {
    background: var(--bg);
  }

  #svm-quest-container code, #svm-quest-container .mono { font-family:'JetBrains Mono', monospace; }
  #svm-quest-container h1, #svm-quest-container h2, #svm-quest-container h3, #svm-quest-container .display { font-family:'Space Grotesk', sans-serif; }

  /* ---------- Header ---------- */
  #svm-quest-container .svm-header{
    padding:22px 28px 14px;
    border-bottom:1px solid var(--line);
    display:flex;
    flex-wrap:wrap;
    gap:18px;
    align-items:center;
    justify-content:space-between;
    position:sticky; top:72px; z-index:20;
    background:rgba(10,14,23,.85);
    backdrop-filter:blur(10px);
  }
  
  html.light #svm-quest-container .svm-header {
    background:rgba(248,245,242,.85);
  }

  #svm-quest-container .brand h1{font-size:1.15rem; margin:0; letter-spacing:.2px;}
  #svm-quest-container .brand h1 span{color:var(--glow); text-shadow:0 0 18px rgba(125,211,252,.5);}
  #svm-quest-container .brand p{margin:2px 0 0; color:var(--muted); font-size:.75rem;}

  #svm-quest-container .progress-wrap{flex:1; min-width:220px; max-width:420px;}
  #svm-quest-container .progress-label{font-size:.75rem; color:var(--muted); margin-bottom:6px; display:flex; justify-content:space-between;}
  #svm-quest-container .progress-bar{height:8px; border-radius:8px; background:var(--card); overflow:hidden; border:1px solid var(--line);}
  #svm-quest-container .progress-fill{height:100%; background:linear-gradient(90deg, var(--neg), var(--pos)); box-shadow:0 0 12px rgba(125,211,252,.6); transition:width .5s ease;}

  #svm-quest-container .badges{display:flex; gap:6px; flex-wrap:wrap;}
  #svm-quest-container .badge{
    width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    background:var(--card); border:1px solid var(--line); font-size:15px; filter:grayscale(1) opacity(.4);
    transition:all .3s ease;
  }
  #svm-quest-container .badge.earned{filter:none; opacity:1; box-shadow:0 0 14px rgba(52,211,153,.5); border-color:var(--safe); background:var(--card-2);}

  #svm-quest-container .eli10-toggle{
    display:flex; align-items:center; gap:8px; font-size:.8rem; color:var(--muted);
    background:var(--card); padding:6px 10px; border-radius:20px; border:1px solid var(--line); cursor:pointer; user-select:none;
  }
  #svm-quest-container .eli10-toggle .dot{width:16px; height:16px; border-radius:50%; background:var(--line); transition:all .2s;}
  #svm-quest-container .eli10-toggle.active .dot{background:var(--glow); box-shadow:0 0 8px var(--glow);}
  #svm-quest-container .eli10-toggle.active{color:var(--text);}

  /* ---------- Layout ---------- */
  #svm-quest-container main{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
    padding:20px 28px 60px;
    align-items:start;
  }
  @media (max-width:980px){
    #svm-quest-container main{grid-template-columns:1fr;}
  }

  #svm-quest-container .stage{min-height:60vh;}
  #svm-quest-container .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:var(--radius);
    padding:20px 22px;
    margin-bottom:16px;
  }
  #svm-quest-container .card h2{margin:0 0 6px; font-size:1.25rem;}
  #svm-quest-container .card h3{margin:14px 0 8px; font-size:1rem; color:var(--glow);}
  #svm-quest-container .kicker{font-size:.75rem; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:6px;}
  #svm-quest-container p{line-height:1.55; color:var(--text); opacity: 0.9;}
  #svm-quest-container .explain-box{
    background:var(--card-2); border-left:3px solid var(--glow); padding:12px 14px; border-radius:8px; margin:12px 0;
    font-size:.95rem;
  }
  #svm-quest-container .why-btn{
    display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%;
    background:var(--card-2); border:1px solid var(--line); color:var(--muted); font-size:.7rem; cursor:pointer; margin-left:6px;
  }
  #svm-quest-container .why-box{
    display:none; margin-top:8px; padding:10px 12px; background:var(--panel); border:1px dashed var(--line);
    border-radius:8px; font-size:.85rem; color:var(--muted);
  }
  #svm-quest-container .why-box.show{display:block;}

  #svm-quest-container canvas{width:100%; height:auto; display:block; background:var(--panel); border-radius:10px; border:1px solid var(--line);}

  #svm-quest-container .btn{
    font-family:inherit; font-size:.9rem; font-weight:600; color:var(--text);
    background:var(--card-2); border:1px solid var(--line); padding:10px 18px; border-radius:9px; cursor:pointer;
    transition:all .15s ease;
  }
  #svm-quest-container .btn:hover{border-color:var(--glow); box-shadow:0 0 10px rgba(125,211,252,.35);}
  #svm-quest-container .btn:disabled{opacity:.35; cursor:not-allowed; box-shadow:none;}
  #svm-quest-container .btn-primary{background:linear-gradient(135deg, #1c72c9, #0891b2); border:none; color: white;}
  #svm-quest-container .btn-primary:hover{box-shadow:0 0 16px rgba(56,189,248,.55);}
  #svm-quest-container .btn-row{display:flex; gap:10px; flex-wrap:wrap; margin-top:16px;}

  #svm-quest-container .mcq-btn{
    display:block; width:100%; text-align:left; margin-bottom:8px; padding:12px 14px; border-radius:9px;
    background:var(--card-2); border:1px solid var(--line); color:var(--text); font-family:'JetBrains Mono', monospace;
    font-size:.85rem; cursor:pointer;
  }
  #svm-quest-container .mcq-btn:hover{border-color:var(--glow);}
  #svm-quest-container .mcq-btn.correct{background:rgba(52,211,153,.15); border-color:var(--safe);}
  #svm-quest-container .mcq-btn.wrong{background:rgba(248,113,113,.15); border-color:var(--danger);}

  #svm-quest-container .data-line{
    background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:10px 12px;
    font-family:'JetBrains Mono', monospace; font-size:.82rem; color:var(--glow); margin:6px 0; white-space:pre-wrap;
  }
  #svm-quest-container .tag-safe{color:var(--safe); font-weight:700;}
  #svm-quest-container .tag-danger{color:var(--danger); font-weight:700;}

  #svm-quest-container .slider-row{margin:14px 0;}
  #svm-quest-container .slider-row label{display:flex; justify-content:space-between; font-size:.8rem; color:var(--muted); margin-bottom:4px;}
  #svm-quest-container .slider-row input[type=range]{width:100%; accent-color:var(--glow);}

  #svm-quest-container .step-chip{
    display:inline-block; padding:4px 10px; border-radius:20px; background:var(--card-2); border:1px solid var(--line);
    font-size:.75rem; color:var(--muted); margin-right:6px;
  }
  #svm-quest-container .calc-step{
    opacity:0; transform:translateY(6px); transition:all .35s ease; margin:6px 0;
  }
  #svm-quest-container .calc-step.show{opacity:1; transform:none;}

  #svm-quest-container .live-panel{
    font-family:'JetBrains Mono', monospace; font-size:.82rem; background:var(--panel); border:1px solid var(--line);
    border-radius:10px; padding:14px; line-height:1.7;
  }
  #svm-quest-container .live-panel .stat-good{color:var(--safe);}
  #svm-quest-container .live-panel .stat-bad{color:#fbbf24;}

  #svm-quest-container .var-chip{
    display:inline-block; margin:3px 4px 3px 0; padding:6px 10px; border-radius:8px; background:var(--card-2);
    border:1px solid var(--line); font-family:'JetBrains Mono', monospace; font-size:.8rem; cursor:pointer;
  }
  #svm-quest-container .var-chip:hover{border-color:var(--glow);}
  #svm-quest-container .var-def{
    display:none; margin-top:8px; padding:10px; background:var(--panel); border-radius:8px; font-size:.83rem; color:var(--muted);
  }
  #svm-quest-container .var-def.show{display:block;}

  /* ---------- Code panel ---------- */
  #svm-quest-container .code-panel{
    background:#0d1220; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden;
    position:sticky; top:170px;
  }
  html.light #svm-quest-container .code-panel {
    background: #f9fafb;
  }
  
  #svm-quest-container .code-panel-head{
    display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--line); background:var(--panel);
  }
  #svm-quest-container .code-panel-head .dot-btn{width:10px; height:10px; border-radius:50%; display:inline-block;}
  #svm-quest-container .code-panel-head span{font-size:.78rem; color:var(--muted); margin-left:6px; font-family:'JetBrains Mono', monospace;}
  #svm-quest-container pre.code-body{
    margin:0; padding:16px 0; font-family:'JetBrains Mono', monospace; font-size:.78rem; line-height:1.65;
    max-height:52vh; overflow-y:auto; color:var(--text); opacity: 0.9;
  }
  #svm-quest-container .code-line{display:block; padding:1px 16px; white-space:pre;}
  #svm-quest-container .code-line.active{
    background:rgba(56,189,248,.12); color:var(--glow); box-shadow:inset 3px 0 0 var(--glow);
  }
  html.light #svm-quest-container .code-line.active {
    background: rgba(14,165,233,.12);
  }
  
  #svm-quest-container .code-line .kw{color:#c084fc;}
  #svm-quest-container .code-line .fn{color:#7dd3fc;}
  #svm-quest-container .code-line .num{color:#fb923c;}
  #svm-quest-container .code-line .cm{color:#5b6b8c;}
  #svm-quest-container .var-panel{
    padding:14px 16px; border-top:1px solid var(--line); font-family:'JetBrains Mono', monospace; font-size:.78rem;
    color:var(--glow); background:var(--panel); white-space:pre-wrap; min-height:60px;
  }

  #svm-quest-container .final-hero{text-align:center; padding:30px 10px;}
  #svm-quest-container .final-hero h2{font-size:2rem; margin-bottom:4px;}
  #svm-quest-container .badge-grid{display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin:18px 0;}
  #svm-quest-container .badge-grid .badge{width:44px; height:44px; font-size:20px;}
</style>

<div class="bg-gradient"></div>

<header class="svm-header">
  <div class="brand">
    <h1>SVM <span>Quest</span>: Train Your First AI</h1>
    <p>Learn Support Vector Machines by playing through the code.</p>
  </div>
  <div class="progress-wrap">
    <div class="progress-label"><span id="levelLabel">Level 1 / 8</span><span id="levelName">Meet the Data</span></div>
    <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:12.5%"></div></div>
  </div>
  <div class="badges" id="badgeStrip"></div>
  <div class="eli10-toggle" id="eli10Toggle" onclick="window.svmQuest.toggleEli10()">
    <div class="dot"></div> Explain Like I'm 10
  </div>
</header>

<main>
  <div class="stage" id="stage"></div>
  <aside class="code-panel">
    <div class="code-panel-head">
      <span class="dot-btn" style="background:#f87171"></span>
      <span class="dot-btn" style="background:#fbbf24"></span>
      <span class="dot-btn" style="background:#34d399"></span>
      <span>svm.js</span>
    </div>
    <pre class="code-body" id="codeBody"></pre>
    <div class="var-panel" id="varPanel">// current values will appear here as you play</div>
  </aside>
</main>
</div>
`

const SCRIPT_LOGIC = `
  const X = [[1,2],[2,3],[3,3],[6,5],[7,8],[8,7]];
  const y = [-1,-1,-1,1,1,1];

  function dot(a,b){ return a.reduce((sum,v,i)=>sum+v*b[i],0); }
  function norm(w){ return Math.sqrt(w.reduce((s,v)=>s+v*v,0)); }
  function predict(Xs, model){
    return Xs.map(row=>{
      const result = dot(row, model.w) + model.b;
      return result >= 0 ? 1 : -1;
    });
  }
  function supportVectors(w,b){
    const n = norm(w) || 1e-9;
    let bestNeg = {idx:-1, d:Infinity}, bestPos = {idx:-1, d:Infinity};
    X.forEach((xi,i)=>{
      const d = Math.abs(dot(xi,w)+b)/n;
      if(y[i]===-1 && d<bestNeg.d) bestNeg={idx:i,d};
      if(y[i]===1 && d<bestPos.d) bestPos={idx:i,d};
    });
    return [bestNeg.idx, bestPos.idx];
  }
  const fmt = (n)=> Number.isInteger(n) ? n : n.toFixed(3);

  const codeLines = [
  "function svm(X, y, learningRate = 0.001, lambda = 0.01, epochs = 1000) {",
  "    const n = X.length;",
  "    const features = X[0].length;",
  "",
  "    let w = new Array(features).fill(0);",
  "    let b = 0;",
  "",
  "    for (let epoch = 0; epoch < epochs; epoch++) {",
  "        for (let i = 0; i < n; i++) {",
  "",
  "            const condition = y[i] * (dot(X[i], w) + b);",
  "",
  "            if (condition >= 1) {",
  "                for (let j = 0; j < features; j++) {",
  "                    w[j] -= learningRate * (2 * lambda * w[j]);",
  "                }",
  "            } else {",
  "                for (let j = 0; j < features; j++) {",
  "                    w[j] -= learningRate *",
  "                        (2 * lambda * w[j] - y[i] * X[i][j]);",
  "                }",
  "",
  "                b -= learningRate * (-y[i]);",
  "            }",
  "        }",
  "    }",
  "",
  "    return { w, b };",
  "}",
  "",
  "function dot(a, b) {",
  "    return a.reduce((sum, value, i) => sum + value * b[i], 0);",
  "}",
  "",
  "function predict(X, model) {",
  "    return X.map(row => {",
  "        const result = dot(row, model.w) + model.b;",
  "        return result >= 0 ? 1 : -1;",
  "    });",
  "}"
  ];

  function renderCode(){
    const body = document.getElementById('codeBody');
    if(!body) return;
    body.innerHTML = codeLines.map((l,i)=>'<span class="code-line" id="cl-'+i+'">'+(l.replace(/</g,"&lt;")||"&nbsp;")+'</span>').join("\\n");
  }
  function highlightLines(range, extra){
    codeLines.forEach((_,i)=> { const el = document.getElementById('cl-'+i); if (el) el.classList.remove('active'); });
    let lines = [];
    if(Array.isArray(range)) lines = range;
    else if(range!==undefined) lines=[range];
    if(extra) lines = lines.concat(extra);
    lines.forEach(i=>{ const el=document.getElementById('cl-'+i); if(el) el.classList.add('active'); });
    if(lines.length){
      const el = document.getElementById('cl-'+lines[Math.floor(lines.length/2)]);
      if(el){
        const container = document.getElementById('codeBody');
        if(container){
          const target = el.offsetTop - container.offsetTop - (container.clientHeight / 2) + (el.clientHeight / 2);
          container.scrollTo({ top: target, behavior: trainTimer ? 'auto' : 'smooth' });
        }
      }
    }
  }
  function setVarPanel(text){ const vp = document.getElementById('varPanel'); if(vp) vp.textContent = text; }

  function toPx(cx,cy,W,H,pad){
    return [ pad + cx*(W-2*pad)/10, H-pad - cy*(H-2*pad)/10 ];
  }
  function drawGraph(canvas, opts){
    if(!canvas) return;
    opts = opts || {};
    const W = canvas.width = canvas.clientWidth * 2;
    const H = canvas.height = (canvas.clientWidth*0.72) * 2;
    const ctx = canvas.getContext('2d');
    const pad = 46*2;
    ctx.clearRect(0,0,W,H);

    const isLight = document.documentElement.classList.contains('light');

    ctx.strokeStyle = isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.06)';
    ctx.lineWidth = 1;
    for(let g=0;g<=10;g+=2){
      let [x1,y1] = toPx(g,0,W,H,pad); let [x2,y2] = toPx(g,10,W,H,pad);
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      let [x3,y3] = toPx(0,g,W,H,pad); let [x4,y4] = toPx(10,g,W,H,pad);
      ctx.beginPath(); ctx.moveTo(x3,y3); ctx.lineTo(x4,y4); ctx.stroke();
    }
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.18)';
    ctx.strokeRect(pad,pad, W-2*pad, H-2*pad);

    if(opts.w && (opts.w[0]!==0 || opts.w[1]!==0)){
      const [w0,w1] = opts.w, b = opts.b;
      const lineAt = (val)=>{
        const pts=[];
        [0,10].forEach(dx=>{
          if(Math.abs(w1) > 1e-6){
            const dy = (val - b - w0*dx)/w1;
            pts.push([dx,dy]);
          }
        });
        return pts;
      };
      const drawLine = (pts,color,width,dashed)=>{
        if(pts.length<2) return;
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = width;
        if(dashed) ctx.setLineDash([10,8]);
        ctx.shadowColor = color; ctx.shadowBlur = 14;
        ctx.beginPath();
        pts.forEach((p,idx)=>{ const [px,py]=toPx(p[0],p[1],W,H,pad); idx? ctx.lineTo(px,py): ctx.moveTo(px,py); });
        ctx.stroke(); ctx.restore();
      };
      if(opts.showMargin){
        drawLine(lineAt(1), 'rgba(52,211,153,.55)', 2, true);
        drawLine(lineAt(-1), 'rgba(52,211,153,.55)', 2, true);
      }
      drawLine(lineAt(0), '#7dd3fc', 3, false);
    }

    const sv = opts.supportVectors || [];
    X.forEach((p,i)=>{
      const [px,py] = toPx(p[0],p[1],W,H,pad);
      const color = y[i]===1 ? '#fb923c' : '#38bdf8';
      if(sv.includes(i)){
        ctx.beginPath(); ctx.arc(px,py,17,0,7); ctx.strokeStyle='rgba(52,211,153,.9)'; ctx.lineWidth=3; ctx.stroke();
      }
      if(i===opts.highlightIdx){
        ctx.beginPath(); ctx.arc(px,py,20,0,7); ctx.strokeStyle=isLight ? 'rgba(0,0,0,.9)' : 'rgba(255,255,255,.9)'; ctx.lineWidth=2; ctx.stroke();
      }
      ctx.beginPath();
      ctx.shadowColor = color; ctx.shadowBlur = 12;
      ctx.fillStyle = color;
      ctx.arc(px,py,11,0,7);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if(opts.predPoint){
      const [px,py] = toPx(opts.predPoint[0], opts.predPoint[1], W,H,pad);
      const c = opts.predClass===1 ? '#fb923c' : (opts.predClass===-1 ? '#38bdf8' : '#c084fc');
      ctx.beginPath();
      ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 18;
      ctx.fillStyle = c;
      ctx.moveTo(px, py-14);
      for(let k=1;k<5;k++){ const ang = Math.PI/2 + k*2*Math.PI/5; ctx.lineTo(px+14*Math.cos(ang), py-14*Math.sin(ang)); }
      ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
    }
  }

  let eli10 = false;
  let currentLevel = 1;
  const levelNames = ["Meet the Data","What Are w and b?","Understand dot()","Follow One Data Point",
    "The Margin Challenge","Update w and b","Training Loop","Make a Prediction"];
  const badgeDefs = [
    {level:1, icon:"🧭", name:"Data Explorer"},
    {level:2, icon:"📐", name:"Boundary Builder"},
    {level:3, icon:"✖️", name:"Dot Product Master"},
    {level:5, icon:"🛡️", name:"Margin Master"},
    {level:7, icon:"🎯", name:"SVM Trainer"},
    {level:8, icon:"🔮", name:"AI Predictor"},
  ];
  let earned = new Set();
  let realW = [0,0], realB = 0;
  let trainGen = null, trainTimer = null, trainDone = false, lastYield = null;

  function ex(normal, simple){ return eli10 ? simple : normal; }

  window.svmQuest = {
    toggleEli10: function(){
      eli10 = !eli10;
      const toggle = document.getElementById('eli10Toggle');
      if(toggle) toggle.classList.toggle('active', eli10);
      renderLevel(currentLevel);
    },
    goTo: function(n){
      if(currentLevel<=8) awardBadge(currentLevel);
      currentLevel = n;
      renderLevel(n);
    },
    dotStep: function(step){
      if(step===1){
        document.getElementById('dstep0').innerHTML = '<span class="step-chip">Step 1</span> 2 × 4 = <b>8</b>';
        document.getElementById('dstep1').innerHTML = '<button class="btn" onclick="window.svmQuest.dotStep(2)">Calculate 3 × 5</button>';
        document.getElementById('dstep1').classList.add('show');
      } else if(step===2){
        document.getElementById('dstep1').innerHTML = '<span class="step-chip">Step 2</span> 3 × 5 = <b>15</b>';
        document.getElementById('dstep2').innerHTML = '<button class="btn" onclick="window.svmQuest.dotStep(3)">Add the results</button>';
        document.getElementById('dstep2').classList.add('show');
      } else if(step===3){
        document.getElementById('dstep2').innerHTML = '<span class="step-chip">Step 3</span> 8 + 15 = <b>23</b>';
        document.getElementById('dstep3').innerHTML = '<div class="explain-box"><code>dot([2,3], [4,5]) = 23</code></div>';
        document.getElementById('dstep3').classList.add('show');
        setVarPanel("dot([2,3], [4,5])\\n= 2×4 + 3×5\\n= 8 + 15\\n= 23");
        document.getElementById('dotNextBtn').disabled = false;
      }
    },
    l4Answer: function(i){
      const Xi=[2,3], yi=-1, w=[0.5,0.2], b=0;
      const dotVal = dot(Xi,w);
      const afterB = dotVal + b;
      const condition = yi*afterB;
      const steps = [
        {q:"What should we calculate next?", choices:["dot(X[i], w)","y[i] + b","X[i] - w"], correct:0,
         reveal:\`dot(X[i], w) = \${Xi[0]}×\${w[0]} + \${Xi[1]}×\${w[1]} = \${fmt(dotVal)}\`, code:[10]},
        {q:"What should we calculate next?", choices:["dot(X[i], w) + b","dot(X[i], w) × b","dot(X[i], w) − y[i]"], correct:0,
         reveal:\`dot(X[i], w) + b = \${fmt(dotVal)} + \${b} = \${fmt(afterB)}\`, code:[10]},
        {q:"What should we calculate next?", choices:["y[i] × result","result ÷ y[i]","result + y[i]²"], correct:0,
         reveal:\`y[i] × result = \${yi} × \${fmt(afterB)} = \${fmt(condition)}\`, code:[10]}
      ];
      const s = steps[window._l4step];
      const buttons = document.querySelectorAll('#mcqWrap .mcq-btn');
      if(i===s.correct){
        buttons[i].classList.add('correct');
        buttons.forEach(b=>b.setAttribute('disabled','true'));
        document.getElementById('l4reveal').style.display='block';
        document.getElementById('l4reveal').textContent = s.reveal;
        setVarPanel(s.reveal);
        setTimeout(()=>{
          window._l4step++;
          if(window._l4step<steps.length){ window._renderL4Quiz(steps); }
          else {
            document.getElementById('l4-quiz').innerHTML = \`<div class="explain-box">\${ex("condition tells the model: is this point on the right side, and how confidently?", "condition is like a report card score for this one dot.")}</div><div class="data-line">condition = \${fmt(condition)}</div>\`;
            document.getElementById('l4next').disabled = false;
          }
        }, 900);
      } else {
        buttons[i].classList.add('wrong');
        setTimeout(()=>buttons[i].classList.remove('wrong'), 600);
      }
    },
    toggleVar: function(id){ document.getElementById(id).classList.toggle('show'); },
    calcUpdate: function(){
      const oldW=0, lr=0.001, lambda=0.01, yi=-1, Xij=2;
      const newW = oldW - lr*(2*lambda*oldW - yi*Xij);
      const oldB = 0, newB = oldB - lr*(-yi);
      document.getElementById('l6result').innerHTML = \`
        <div class="explain-box">
          New w[j] = \${oldW} − \${lr} × (2×\${lambda}×\${oldW} − \${yi}×\${Xij}) = <b>\${fmt(newW)}</b><br>
          New b = \${oldB} − \${lr} × (−(\${yi})) = <b>\${fmt(newB)}</b>
        </div>\`;
      setVarPanel(\`w[j]: \${oldW} → \${fmt(newW)}\\nb: \${oldB} → \${fmt(newB)}\`);
      document.getElementById('l6next').disabled = false;
    },
    trainStart: function(){
      if(trainTimer) return;
      trainTimer = setInterval(()=>{
        if(trainDone){ clearInterval(trainTimer); trainTimer=null; return; }
        window.svmQuest.trainStep();
      }, 90);
    },
    trainPause: function(){ clearInterval(trainTimer); trainTimer=null; },
    trainStep: function(){
      if(trainDone) return;
      const res = trainGen.next();
      if(res.done){
        trainDone = true;
        clearInterval(trainTimer); trainTimer=null;
        realW = lastYield ? lastYield.w : [0,0];
        realB = lastYield ? lastYield.b : 0;
        document.getElementById('livePanel').innerHTML = \`<span class="stat-good">Training complete! Final w = [\${realW.map(fmt).join(', ')}], b = \${fmt(realB)}</span>\`;
        document.getElementById('l7next').disabled = false;
        highlightLines([27]);
        return;
      }
      const v = res.value;
      lastYield = v;
      const sv = supportVectors(v.w, v.b);
      drawGraph(document.getElementById('graph7'), {w:v.w, b:v.b, showMargin:true, supportVectors:sv, highlightIdx:v.i});
      highlightLines([10], v.updated ? [16,17,18,19,20,22] : [13,14,15]);
      document.getElementById('livePanel').innerHTML =
        \`Epoch: \${v.epoch+1}\\nPoint: \${v.i+1} / \${v.n}\\n\\nX[i] = [\${v.X_i.join(', ')}]   y[i] = \${v.y_i}\\nw = [\${v.w.map(fmt).join(', ')}]\\nb = \${fmt(v.b)}\\n\\ncondition = \${fmt(v.condition)}\\n\\nStatus:\\n\${v.updated ? '<span class="stat-bad">⚠ Update required</span>' : '<span class="stat-good">✓ Safe — shrinking w slightly</span>'}\`;
      setVarPanel(\`epoch=\${v.epoch+1}  i=\${v.i}\\ncondition=\${fmt(v.condition)}\\nw=[\${v.w.map(fmt).join(', ')}]  b=\${fmt(v.b)}\`);
    },
    trainRestart: function(){
      clearInterval(trainTimer); trainTimer=null;
      trainGen = trainGenerator(X, y, 0.001, 0.01, 40);
      trainDone = false; lastYield = null;
      realW=[0,0]; realB=0;
      document.getElementById('livePanel').textContent = "Press ▶ Start or ⏭ Next Step to begin.";
      document.getElementById('l7next').disabled = true;
      highlightLines([7,8]);
      drawGraph(document.getElementById('graph7'), {w:[0,0], b:0});
    },
    l8Guess: function(guess){
      const point = [5,6];
      const result = dot(point, realW) + realB;
      const predClass = result >= 0 ? 1 : -1;
      document.getElementById('l8reveal').innerHTML = \`
        <div class="explain-box">
          You guessed <b>\${guess}</b>.<br><br>
          result = dot([5,6], w) + b = \${fmt(result)}<br>
          result >= 0 ? 1 : -1 → <b>\${predClass}</b><br><br>
          \${ex("If the result is positive, we predict +1. Otherwise, we predict -1.", "Positive number → orange team (+1). Negative number → blue team (-1).")}
          <br><br>\${guess===predClass ? '✅ Your guess matched the model!' : 'The model predicted ' + predClass + ' — nice try!'}
        </div>\`;
      setVarPanel(\`result = dot([5,6], w) + b\\n= \${fmt(result)}\\nprediction = \${predClass}\`);
      drawGraph(document.getElementById('graph8'), {w:realW, b:realB, showMargin:true, supportVectors:supportVectors(realW,realB), predPoint:point, predClass});
      document.getElementById('l8next').disabled = false;
    },
    playAgain: function(){
      earned = new Set();
      realW=[0,0]; realB=0;
      currentLevel = 1;
      renderBadges();
      renderLevel(1);
    },
    showFullCode: function(){
      codeLines.forEach((_,i)=> document.getElementById('cl-'+i).classList.add('active'));
      document.getElementById('codeBody').scrollIntoView({behavior:'smooth', block:'start'});
    }
  };

  function renderBadges(){
    const strip = document.getElementById('badgeStrip');
    if(!strip) return;
    strip.innerHTML = badgeDefs.map(b=>
      \`<div class="badge \${earned.has(b.name)?'earned':''}" title="\${b.name}">\${b.icon}</div>\`
    ).join('');
  }
  function awardBadge(forLevel){
    const b = badgeDefs.find(bd=>bd.level===forLevel);
    if(b) earned.add(b.name);
    renderBadges();
  }

  function updateHeader(){
    const lbl = document.getElementById('levelLabel');
    if(lbl) lbl.textContent = currentLevel<=8 ? \`Level \${currentLevel} / 8\` : \`Complete!\`;
    const nm = document.getElementById('levelName');
    if(nm) nm.textContent = currentLevel<=8 ? levelNames[currentLevel-1] : "SVM Trained";
    const pf = document.getElementById('progressFill');
    if(pf) pf.style.width = Math.min(100, (currentLevel-1)/8*100 + (currentLevel<=8?6:100)) + '%';
  }

  function renderLevel1(){
    updateHeader();
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 1</div>
        <h2>Meet the Data</h2>
        <p>\${ex("Every machine learning model starts with data. Below are six points. Each point has an X value (its position) and a y value (which group it belongs to).", "Look at these dots! Some are blue, some are orange. That's all our AI knows so far — just dots and colors.")}</p>
        <canvas id="graph1"></canvas>
        <div class="data-line">X = [[1,2], [2,3], [3,3], [6,5], [7,8], [8,7]]\\ny = [-1, -1, -1, 1, 1, 1]</div>
        <div id="pointInfo1" class="data-line" style="display:none;"></div>
        <div class="explain-box">\${ex("<b>X</b> contains the input features. <b>y</b> tells us which class each point belongs to.", "<b>X</b> is where the dot is on the map. <b>y</b> is just its team color: blue team or orange team.")}</div>
        <p style="font-size:.85rem; color:var(--muted);">Click any point on the graph to inspect it.</p>
        <div class="btn-row"><button class="btn btn-primary" onclick="window.svmQuest.goTo(2)">Next Level →</button></div>
      </div>
    \`;
    highlightLines([]);
    setVarPanel("X = [[1,2],[2,3],[3,3],[6,5],[7,8],[8,7]]\\ny = [-1,-1,-1,1,1,1]");
    const canvas = document.getElementById('graph1');
    drawGraph(canvas, {});
    canvas.addEventListener('click', function(e){
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX-rect.left)/rect.width, my = (e.clientY-rect.top)/rect.height;
      const W = canvas.width, H = canvas.height, pad = 46*2;
      let best=-1, bestD=Infinity;
      X.forEach((p,i)=>{
        const [px,py] = toPx(p[0],p[1],W,H,pad);
        const d = Math.hypot(mx*W-px, my*H-py);
        if(d<bestD){bestD=d;best=i;}
      });
      if(bestD < 60){
        document.getElementById('pointInfo1').style.display='block';
        document.getElementById('pointInfo1').textContent = \`X[\${best}] = [\${X[best][0]}, \${X[best][1]}]\\ny[\${best}] = \${y[best]}\`;
        drawGraph(canvas, {highlightIdx:best});
        setVarPanel(\`X[\${best}] = [\${X[best][0]}, \${X[best][1]}]\\ny[\${best}] = \${y[best]}\`);
      }
    });
  }

  function renderLevel2(){
    updateHeader();
    const w0=0, w1=0, b=0;
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 2</div>
        <h2>What Are w and b? <span class="why-btn" onclick="document.getElementById('why2').classList.toggle('show')">?</span></h2>
        <div class="why-box" id="why2">Think of the line as a fence that separates two yards. w decides which way the fence tilts. b slides the whole fence left or right.</div>
        <p>\${ex("w controls the direction of the line. b moves the line.", "w tilts the fence. b slides the fence.")}</p>
        <canvas id="graph2"></canvas>
        <div class="data-line" id="wbLine2">w = [0, 0]\\nb = 0</div>
        <div class="slider-row">
          <label><span>w[0]</span><span id="w0val">0.0</span></label>
          <input type="range" id="s_w0" min="-2" max="2" step="0.1" value="0">
        </div>
        <div class="slider-row">
          <label><span>w[1]</span><span id="w1val">0.0</span></label>
          <input type="range" id="s_w1" min="-2" max="2" step="0.1" value="0">
        </div>
        <div class="slider-row">
          <label><span>b</span><span id="bval">0.0</span></label>
          <input type="range" id="s_b" min="-5" max="5" step="0.1" value="0">
        </div>
        <div class="explain-box">\${ex("Our goal is to find values of w and b that draw a line separating the two classes as well as possible.", "We're trying to slide and tilt this fence until blue dots are all on one side and orange dots are all on the other.")}</div>
        <div class="btn-row"><button class="btn btn-primary" onclick="window.svmQuest.goTo(3)">Next Level →</button></div>
      </div>
    \`;
    highlightLines([4,5]);
    setVarPanel("let w = [0, 0];\\nlet b = 0;");
    const canvas = document.getElementById('graph2');
    const draw = ()=>{
      const w0 = parseFloat(document.getElementById('s_w0').value);
      const w1 = parseFloat(document.getElementById('s_w1').value);
      const b = parseFloat(document.getElementById('s_b').value);
      document.getElementById('w0val').textContent = w0.toFixed(1);
      document.getElementById('w1val').textContent = w1.toFixed(1);
      document.getElementById('bval').textContent = b.toFixed(1);
      document.getElementById('wbLine2').textContent = \`w = [\${w0.toFixed(1)}, \${w1.toFixed(1)}]\\nb = \${b.toFixed(1)}\`;
      setVarPanel(\`w = [\${w0.toFixed(1)}, \${w1.toFixed(1)}]\\nb = \${b.toFixed(1)}\`);
      drawGraph(canvas, {w:[w0,w1], b});
    };
    ['s_w0','s_w1','s_b'].forEach(id=> document.getElementById(id).addEventListener('input', draw));
    draw();
  }

  function renderLevel3(){
    updateHeader();
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 3</div>
        <h2>Understand dot() <span class="why-btn" onclick="document.getElementById('why3').classList.toggle('show')">?</span></h2>
        <div class="why-box" id="why3">A dot product is just "multiply the matching pairs, then add everything up." That's it — no more, no less.</div>
        <p>\${ex("The dot product multiplies matching values and adds them together.", "You match up numbers, times them together, then add the answers.")}</p>
        <div class="data-line">a = [2, 3]\\nb = [4, 5]</div>
        <div id="dotSteps">
          <div class="calc-step" id="dstep0"><button class="btn" onclick="window.svmQuest.dotStep(1)">Calculate 2 × 4</button></div>
          <div class="calc-step" id="dstep1"></div>
          <div class="calc-step" id="dstep2"></div>
          <div class="calc-step" id="dstep3"></div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" id="dotNextBtn" disabled onclick="window.svmQuest.goTo(4)">Next Level →</button></div>
      </div>
    \`;
    document.getElementById('dstep0').classList.add('show');
    highlightLines([30,31,32]);
    setVarPanel("dot(a, b) = a.reduce((sum, value, i) => sum + value * b[i], 0)");
  }

  window._renderL4Quiz = function(steps){
    highlightLines(steps[Math.min(window._l4step,steps.length-1)].code);
    const s = steps[window._l4step];
    const box = document.getElementById('l4-quiz');
    box.innerHTML = \`
      <h3>What should we calculate next?</h3>
      <div id="mcqWrap">\${s.choices.map((c,i)=>\`<button class="mcq-btn" data-i="\${i}" onclick="window.svmQuest.l4Answer(\${i})">\${c}</button>\`).join('')}</div>
      <div class="explain-box" id="l4reveal" style="display:none;"></div>
    \`;
  };

  function renderLevel4(){
    updateHeader();
    const Xi=[2,3], yi=-1, w=[0.5,0.2], b=0;
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 4</div>
        <h2>Follow One Data Point</h2>
        <p>\${ex("Now we combine everything: the dot product, the bias, and the class label, into one number called condition.", "We're going to build one big check-up number for a single dot, step by step.")}</p>
        <div class="data-line">Selected point:\\nX[i] = [\${Xi[0]}, \${Xi[1]}]\\ny[i] = \${yi}\\nw = [\${w[0]}, \${w[1]}]\\nb = \${b}</div>
        <div id="l4-quiz"></div>
        <div class="btn-row"><button class="btn btn-primary" id="l4next" disabled onclick="window.svmQuest.goTo(5)">Next Level →</button></div>
      </div>
    \`;
    const dotVal = dot(Xi,w);
    const afterB = dotVal + b;
    const condition = yi*afterB;
    const steps = [
      {q:"What should we calculate next?", choices:["dot(X[i], w)","y[i] + b","X[i] - w"], correct:0,
       reveal:\`dot(X[i], w) = \${Xi[0]}×\${w[0]} + \${Xi[1]}×\${w[1]} = \${fmt(dotVal)}\`, code:[10]},
      {q:"What should we calculate next?", choices:["dot(X[i], w) + b","dot(X[i], w) × b","dot(X[i], w) − y[i]"], correct:0,
       reveal:\`dot(X[i], w) + b = \${fmt(dotVal)} + \${b} = \${fmt(afterB)}\`, code:[10]},
      {q:"What should we calculate next?", choices:["y[i] × result","result ÷ y[i]","result + y[i]²"], correct:0,
       reveal:\`y[i] × result = \${yi} × \${fmt(afterB)} = \${fmt(condition)}\`, code:[10]}
    ];
    window._l4step = 0;
    window._renderL4Quiz(steps);
    setVarPanel(\`X[i] = [\${Xi[0]}, \${Xi[1]}]\\ny[i] = \${yi}\\nw = [\${w[0]}, \${w[1]}]\\nb = \${b}\`);
  }

  function renderLevel5(){
    updateHeader();
    const w=[0.5,0.2], b=0;
    const sv = supportVectors(w,b);
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 5</div>
        <h2>The Margin Challenge <span class="why-btn" onclick="document.getElementById('why5').classList.toggle('show')">?</span></h2>
        <div class="why-box" id="why5">A wide, confident gap between the classes tends to generalize better to new points than a line that barely squeezes between them.</div>
        <p>\${ex("SVM doesn't only want the point on the correct side. It also wants the point far enough from the boundary.", "It's not enough to be on the right team's side — you need to stand far from the middle line too.")}</p>
        <canvas id="graph5"></canvas>
        <h3>condition >= 1</h3>
        <div id="l5list"></div>
        <div class="explain-box">\${ex("The closest points to the boundary are called <b>Support Vectors</b> — they're highlighted with a green ring.", "The dots closest to the line are the 'Support Vectors' — they matter most, so we circle them in green.")}</div>
        <div class="btn-row"><button class="btn btn-primary" onclick="window.svmQuest.goTo(6)">Next Level →</button></div>
      </div>
    \`;
    highlightLines([12]);
    drawGraph(document.getElementById('graph5'), {w,b,showMargin:true, supportVectors:sv});
    const list = document.getElementById('l5list');
    list.innerHTML = X.map((xi,i)=>{
      const cond = y[i]*(dot(xi,w)+b);
      const safe = cond>=1;
      return \`<div class="data-line">X[\${i}]=[\${xi[0]},\${xi[1]}]  y=\${y[i]}  condition=\${fmt(cond)}  →  <span class="\${safe?'tag-safe':'tag-danger'}">\${safe?'🟢 Safe':'🔴 Needs adjustment'}</span>\${sv.includes(i)?'  ⭐ Support Vector':''}</div>\`;
    }).join('');
    setVarPanel(\`w = [\${w[0]}, \${w[1]}]\\nb = \${b}\\nSupport Vectors: X[\${sv[0]}], X[\${sv[1]}]\`);
  }

  function renderLevel6(){
    updateHeader();
    const oldW=0, lr=0.001, lambda=0.01, yi=-1, Xij=2;
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 6</div>
        <h2>Update w and b</h2>
        <p>\${ex("When a point isn't safe, we nudge w and b a tiny bit to fix it.", "When a dot is on the wrong side (or too close), we gently push the fence to help it.")}</p>
        <h3>Click each variable to see what it means</h3>
        <div>
          <span class="var-chip" onclick="window.svmQuest.toggleVar('v1')">learningRate</span>
          <span class="var-chip" onclick="window.svmQuest.toggleVar('v2')">lambda</span>
          <span class="var-chip" onclick="window.svmQuest.toggleVar('v3')">w[j]</span>
          <span class="var-chip" onclick="window.svmQuest.toggleVar('v4')">y[i]</span>
          <span class="var-chip" onclick="window.svmQuest.toggleVar('v5')">X[i][j]</span>
        </div>
        <div class="var-def" id="v1">learningRate: how big a step we take each update. Small = careful and slow.</div>
        <div class="var-def" id="v2">lambda: keeps w from growing too large, so the line stays simple and general.</div>
        <div class="var-def" id="v3">w[j]: the current weight for feature j, before this update.</div>
        <div class="var-def" id="v4">y[i]: the correct class label for this point (-1 or 1).</div>
        <div class="var-def" id="v5">X[i][j]: this point's value for feature j.</div>
        <div class="data-line">Old w[j] = \${oldW}\\nlearningRate = \${lr}\\nlambda = \${lambda}\\ny[i] = \${yi}\\nX[i][j] = \${Xij}</div>
        <div class="btn-row"><button class="btn" onclick="window.svmQuest.calcUpdate()">Calculate the update</button></div>
        <div id="l6result"></div>
        <div class="btn-row"><button class="btn btn-primary" id="l6next" disabled onclick="window.svmQuest.goTo(7)">Next Level →</button></div>
      </div>
    \`;
    highlightLines([16,17,18,19,20,22]);
    setVarPanel(\`Old w[j] = \${oldW}\\nlearningRate = \${lr}\\nlambda = \${lambda}\\ny[i] = \${yi}\\nX[i][j] = \${Xij}\`);
  }

  function* trainGenerator(Xs, ys, lr, lambda, epochs){
    const n = Xs.length, features = Xs[0].length;
    let w = new Array(features).fill(0);
    let b = 0;
    for(let epoch=0; epoch<epochs; epoch++){
      for(let i=0; i<n; i++){
        const wBefore = w.slice(), bBefore = b;
        const d = dot(Xs[i], w);
        const condition = ys[i]*(d+b);
        let updated = false;
        if(condition >= 1){
          for(let j=0;j<features;j++){ w[j] -= lr*(2*lambda*w[j]); }
        } else {
          for(let j=0;j<features;j++){ w[j] -= lr*(2*lambda*w[j] - ys[i]*Xs[i][j]); }
          b -= lr*(-ys[i]);
          updated = true;
        }
        yield {epoch, i, X_i:Xs[i], y_i:ys[i], dot:d, condition, wBefore, bBefore, w:w.slice(), b, updated, n, features};
      }
    }
    return {w,b};
  }

  function renderLevel7(){
    updateHeader();
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 7 · Main Event</div>
        <h2>Training Loop</h2>
        <p>\${ex("This is the real algorithm running, one data point at a time, over and over, until the line settles into a good spot.", "Watch the fence wiggle into place as it looks at every dot, again and again.")}</p>
        <p style="font-size:.8rem; color:var(--muted);">For this playthrough we train for 40 epochs — enough to watch the boundary settle.</p>
        <canvas id="graph7"></canvas>
        <div class="live-panel" id="livePanel">Press ▶ Start or ⏭ Next Step to begin.</div>
        <div class="btn-row">
          <button class="btn btn-primary" id="startBtn" onclick="window.svmQuest.trainStart()">▶ Start</button>
          <button class="btn" id="pauseBtn" onclick="window.svmQuest.trainPause()">⏸ Pause</button>
          <button class="btn" onclick="window.svmQuest.trainStep()">⏭ Next Step</button>
          <button class="btn" onclick="window.svmQuest.trainRestart()">🔄 Restart</button>
        </div>
        <div class="btn-row"><button class="btn btn-primary" id="l7next" disabled onclick="window.svmQuest.goTo(8)">Continue to Level 8 →</button></div>
      </div>
    \`;
    window.svmQuest.trainRestart();
  }

  function renderLevel8(){
    updateHeader();
    document.getElementById('stage').innerHTML = \`
      <div class="card">
        <div class="kicker">Level 8</div>
        <h2>Make a Prediction</h2>
        <p>\${ex("Now that w and b are trained, we can use them to guess the class of a brand-new point.", "Now our fence is built! Let's use it to guess which team a new dot belongs to.")}</p>
        <div class="data-line">New point: [5, 6]</div>
        <h3>Which class do you think this point belongs to?</h3>
        <div class="btn-row">
          <button class="btn" onclick="window.svmQuest.l8Guess(-1)">Class -1</button>
          <button class="btn" onclick="window.svmQuest.l8Guess(1)">Class +1</button>
        </div>
        <div id="l8reveal"></div>
        <canvas id="graph8"></canvas>
        <div class="btn-row"><button class="btn btn-primary" id="l8next" disabled onclick="window.svmQuest.goTo(9)">See Final Results 🎉</button></div>
      </div>
    \`;
    highlightLines([34,35,36,37,38,39]);
    drawGraph(document.getElementById('graph8'), {w:realW, b:realB, showMargin:true, supportVectors:supportVectors(realW,realB)});
  }

  function renderFinal(){
    awardBadge(8);
    updateHeader();
    const preds = predict(X, {w:realW, b:realB});
    const point = [5,6];
    const predResult = dot(point, realW) + realB;
    const predClass = predResult >= 0 ? 1 : -1;
    document.getElementById('stage').innerHTML = \`
      <div class="card final-hero">
        <h2>🎉 SVM Training Complete!</h2>
        <p>\${ex("You walked through every part of the algorithm — from raw data to a trained decision boundary.", "You did it! You taught a computer to draw a line between two groups, one small step at a time.")}</p>
        <div class="badge-grid">\${badgeDefs.map(b=>\`<div class="badge \${earned.has(b.name)?'earned':''}" title="\${b.name}">\${b.icon}</div>\`).join('')}</div>
        <div class="data-line" style="text-align:left; display:inline-block;">Final w = [\${realW.map(fmt).join(', ')}]\\nFinal b = \${fmt(realB)}\\n\\nPredictions = [\${preds.join(', ')}]\\nNew point [5,6] → predicted class \${predClass}</div>
        <canvas id="graphFinal" style="margin-top:16px;"></canvas>
        <div class="btn-row" style="justify-content:center;">
          <button class="btn btn-primary" onclick="window.svmQuest.playAgain()">Play Again</button>
          <button class="btn" onclick="window.svmQuest.showFullCode()">Show Me The Full Code</button>
        </div>
      </div>
    \`;
    highlightLines([]);
    drawGraph(document.getElementById('graphFinal'), {w:realW, b:realB, showMargin:true, supportVectors:supportVectors(realW,realB), predPoint:point, predClass});
    setVarPanel(\`Final w = [\${realW.map(fmt).join(', ')}]\\nFinal b = \${fmt(realB)}\\nPredictions = [\${preds.join(', ')}]\`);
  }

  function renderLevel(n){
    currentLevel = n;
    const map = {1:renderLevel1,2:renderLevel2,3:renderLevel3,4:renderLevel4,5:renderLevel5,6:renderLevel6,7:renderLevel7,8:renderLevel8,9:renderFinal};
    (map[n] || renderLevel1)();
    renderBadges();
  }

  // Init
  renderCode();
  renderBadges();
  renderLevel(1);
`

export default function SVMQuestPage() {
  const { theme, systemTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    // Inject HTML
    containerRef.current.innerHTML = RAW_HTML
    
    // Inject and execute script
    const scriptEl = document.createElement('script')
    scriptEl.innerHTML = SCRIPT_LOGIC
    document.body.appendChild(scriptEl)

    return () => {
      // Cleanup global object and injected script on unmount
      if (document.body.contains(scriptEl)) {
        document.body.removeChild(scriptEl)
      }
      delete (window as any).svmQuest
    }
  }, [])

  // Sync theme class to html element manually to trigger the component's light mode CSS
  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme
    if (currentTheme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [theme, systemTheme])

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <NavPill />
      <div className="flex-1 w-full pt-20">
        <div ref={containerRef} />
      </div>
      <SiteFooter />
    </div>
  )
}
