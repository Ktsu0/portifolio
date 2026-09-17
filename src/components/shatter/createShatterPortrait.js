import Matter from "matter-js";

const { Engine, Bodies, Body, Composite, Vector } = Matter;
const SVG_NS = "http://www.w3.org/2000/svg";

// Mundo fixo (escalado via CSS para caber no container)
const W = 440;
const BOWL = { x: 220, y: 220, r: 220 };
const PS = 320; // diâmetro da foto
const PR = PS / 2;
const ORIGIN = { x: BOWL.x - PR, y: BOWL.y - PR };
const SNAP_DIST = 30;
const IDLE_MS = 5000;
const ANT_COUNT = 3;
const MOVING = new Set(["enter", "seek", "carry", "leave", "flee"]);

// ---------- Geometry ----------
function circlePolygon(cx, cy, r, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

function lerpAt(p, q, fp, fq) {
  const t = fp / (fp - fq);
  return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
}

function clipHalfPlane(poly, a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
  const f = (p) => (p.x - mx) * dx + (p.y - my) * dy;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i], prev = poly[(i + poly.length - 1) % poly.length];
    const fc = f(cur), fp = f(prev);
    if (fc <= 0) {
      if (fp > 0) out.push(lerpAt(prev, cur, fp, fc));
      out.push(cur);
    } else if (fp <= 0) {
      out.push(lerpAt(prev, cur, fp, fc));
    }
  }
  return out;
}

function voronoiCells(seeds, boundary) {
  return seeds.map((s, i) => {
    let poly = boundary;
    for (let j = 0; j < seeds.length; j++) {
      if (i !== j && poly.length) poly = clipHalfPlane(poly, s, seeds[j]);
    }
    return poly;
  });
}

function polygonArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

function polygonCentroid(poly) {
  let cx = 0, cy = 0;
  const a = polygonArea(poly);
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const cross = p.x * q.y - q.x * p.y;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

// Sementes em anéis ao redor do impacto: o Voronoi vira uma teia radial,
// que é como vidro realmente racha a partir de um ponto.
function impactSeeds(impact) {
  const seeds = [{ x: impact.x + (Math.random() - 0.5) * 6, y: impact.y + (Math.random() - 0.5) * 6 }];
  const rings = [
    { count: 4, radius: PR * 0.36, spread: 0.14 },
    { count: 6, radius: PR * 0.78, spread: 0.10 },
  ];
  rings.forEach((ring, ri) => {
    const base = Math.random() * Math.PI * 2 + (ri ? Math.PI / ring.count : 0);
    for (let i = 0; i < ring.count; i++) {
      const ang = base + (i / ring.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const rr = ring.radius * (1 + (Math.random() - 0.5) * ring.spread * 2);
      const p = { x: impact.x + Math.cos(ang) * rr, y: impact.y + Math.sin(ang) * rr };
      if (Math.hypot(p.x - PR, p.y - PR) > PR - 8) continue;
      if (seeds.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 28)) continue;
      seeds.push(p);
    }
  });
  let tries = 0;
  while (seeds.length < 7 && tries++ < 400) {
    const ang = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * (PR - 10);
    const p = { x: PR + Math.cos(ang) * rr, y: PR + Math.sin(ang) * rr };
    if (seeds.every((s) => Math.hypot(s.x - p.x, s.y - p.y) >= 34)) seeds.push(p);
  }
  return seeds;
}

function uniqueInternalEdges(cells) {
  const map = new Map();
  cells.forEach((cell) => {
    for (let i = 0; i < cell.length; i++) {
      const a = cell[i], b = cell[(i + 1) % cell.length];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (Math.hypot(mx - PR, my - PR) > PR - 1.5) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 3) continue;
      const ka = `${a.x.toFixed(1)},${a.y.toFixed(1)}`;
      const kb = `${b.x.toFixed(1)},${b.y.toFixed(1)}`;
      const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      if (!map.has(key)) map.set(key, { a, b });
    }
  });
  return [...map.values()];
}

// Linha tensa com ondulação fina + um cotovelo ocasional.
function hairline(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const n = Math.max(2, Math.round(len / 11));
  const px = -dy / len, py = dx / len;
  const kinkAt = Math.random() < 0.5 ? 1 + Math.floor(Math.random() * (n - 1)) : -1;
  const kink = (Math.random() - 0.5) * 5;
  const pts = [a];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    let off = (Math.random() - 0.5) * 1.6;
    if (kinkAt >= 0) off += kink * (1 - Math.abs(i - kinkAt) / n);
    pts.push({ x: a.x + dx * t + px * off, y: a.y + dy * t + py * off });
  }
  pts.push(b);
  return pts;
}

function buildCracks(edges, impact) {
  const dist = (p) => Math.hypot(p.x - impact.x, p.y - impact.y);
  const lines = [];

  edges.forEach((e) => {
    const near = dist(e.a) <= dist(e.b) ? e.a : e.b;
    const far = near === e.a ? e.b : e.a;
    lines.push({ pts: hairline(near, far), kind: "main", start: dist(near) });
  });

  const junctions = new Map();
  edges.forEach((e) => [e.a, e.b].forEach((p) => {
    if (Math.hypot(p.x - PR, p.y - PR) < PR - 2) junctions.set(`${p.x.toFixed(1)},${p.y.toFixed(1)}`, p);
  }));
  junctions.forEach((j) => {
    if (Math.random() < 0.45) return;
    const away = Math.atan2(j.y - impact.y, j.x - impact.x);
    const ang = away + (Math.random() - 0.5) * 1.6;
    const len = 6 + Math.random() * 11;
    const end = { x: j.x + Math.cos(ang) * len, y: j.y + Math.sin(ang) * len };
    lines.push({ pts: hairline(j, end), kind: "splinter", start: dist(j) });
  });

  const micro = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < micro; i++) {
    const ang = (i / micro) * Math.PI * 2 + Math.random() * 0.6;
    const len = 4 + Math.random() * 8;
    const s = { x: impact.x + Math.cos(ang) * 1.5, y: impact.y + Math.sin(ang) * 1.5 };
    const end = { x: impact.x + Math.cos(ang) * len, y: impact.y + Math.sin(ang) * len };
    lines.push({ pts: hairline(s, end), kind: "splinter", start: 0 });
  }

  return lines.map((l) => {
    const len = l.pts.reduce((s, p, i) => (i ? s + Math.hypot(p.x - l.pts[i - 1].x, p.y - l.pts[i - 1].y) : 0), 0);
    return { ...l, delay: (l.start / PR) * 380 + Math.random() * 40, dur: 160 + len * 1.6 };
  });
}

function pathD(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function polygonClip(poly) {
  return `polygon(${poly.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(", ")})`;
}

function polygonPoints(poly) {
  return poly.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

function normAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function lerpAngle(a, b, k) {
  return a + normAngle(b - a) * k;
}

function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function div(className) {
  const el = document.createElement("div");
  if (className) el.className = className;
  return el;
}

export function createShatterPortrait(root, { photoUrl, classes: c }) {
  const uid = Math.random().toString(36).slice(2, 7);
  const ids = { glass: `glass-${uid}`, vig: `vig-${uid}`, vigMask: `vigmask-${uid}`, glow: `glow-${uid}` };

  // ---------- DOM ----------
  root.innerHTML = "";
  const arena = div(c.arena);
  root.appendChild(arena);

  const defsSvg = svgEl("svg", { width: 0, height: 0, style: "position:absolute", "aria-hidden": "true" });
  defsSvg.innerHTML = `<defs>
    <linearGradient id="${ids.glass}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.20" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.06" />
      <stop offset="1" stop-color="#bfdbfe" stop-opacity="0.13" />
    </linearGradient>
    <radialGradient id="${ids.vig}" gradientUnits="userSpaceOnUse" cx="${PR}" cy="${PR}" r="${PR}">
      <stop offset="0.62" stop-color="#fff" stop-opacity="1" />
      <stop offset="0.92" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
    <mask id="${ids.vigMask}" maskUnits="userSpaceOnUse" x="0" y="0" width="${PS}" height="${PS}">
      <rect width="${PS}" height="${PS}" fill="url(#${ids.vig})" />
    </mask>
    <filter id="${ids.glow}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.3" />
    </filter>
  </defs>`;
  arena.appendChild(defsSvg);

  const bowlEl = div(c.bowl);
  bowlEl.style.left = `${BOWL.x - BOWL.r}px`;
  bowlEl.style.top = `${BOWL.y - BOWL.r}px`;
  bowlEl.style.width = bowlEl.style.height = `${BOWL.r * 2}px`;
  arena.appendChild(bowlEl);

  const ghost = div(c.ghost);
  const ghostPhoto = div(c.ghostPhoto);
  ghostPhoto.style.backgroundImage = `url("${photoUrl}")`;
  const ghostSvg = svgEl("svg", { viewBox: `0 0 ${PS} ${PS}` });
  ghost.append(ghostPhoto, ghostSvg);
  arena.appendChild(ghost);

  const piecesLayer = div(c.pieces);
  arena.appendChild(piecesLayer);

  const coin = div(c.coin);
  const coinFace = div(c.coinFace);
  coinFace.style.backgroundImage = `url("${photoUrl}")`;
  const glassBase = div(c.glassBase);
  const glassSheen = div(c.glassSheen);
  const cracksSvg = svgEl("svg", { viewBox: `0 0 ${PS} ${PS}`, class: c.cracks });
  const coinHit = div(c.coinHit);
  coin.append(coinFace, glassBase, glassSheen, cracksSvg, coinHit);
  arena.appendChild(coin);

  const antsLayer = div(c.ants);
  arena.appendChild(antsLayer);

  [coin, ghost].forEach((el) => {
    el.style.left = `${ORIGIN.x}px`;
    el.style.top = `${ORIGIN.y}px`;
    el.style.width = el.style.height = `${PS}px`;
  });

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let scale = 1;
  function fit() {
    scale = root.clientWidth / W || 1;
    arena.style.transform = `scale(${scale})`;
  }
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(root);

  function arenaPoint(e) {
    const rect = arena.getBoundingClientRect();
    const s = rect.width / W;
    return { x: (e.clientX - rect.left) / s, y: (e.clientY - rect.top) / s };
  }

  // x (em coordenadas do mundo) já fora da borda direita da tela
  function offscreenRightX() {
    const rect = arena.getBoundingClientRect();
    const s = rect.width / W;
    return (window.innerWidth - rect.left) / s + 60;
  }

  // ---------- Pattern ----------
  let pattern = null;
  let crackSeq = 0;

  function makePattern(impact) {
    const boundary = circlePolygon(PR, PR, PR, 72);
    const cells = voronoiCells(impactSeeds(impact), boundary)
      .filter((cell) => cell.length >= 3 && Math.abs(polygonArea(cell)) > 350);
    const edges = uniqueInternalEdges(cells);
    return { impact, cells, edges, cracks: buildCracks(edges, impact) };
  }

  function renderCracks() {
    cracksSvg.innerHTML = "";
    const defs = svgEl("defs", {});
    cracksSvg.appendChild(defs);

    pattern.cracks.forEach((cr) => {
      const id = `cg-${uid}-${++crackSeq}`;
      const first = cr.pts[0], last = cr.pts[cr.pts.length - 1];
      const grad = svgEl("linearGradient", {
        id, gradientUnits: "userSpaceOnUse", x1: first.x, y1: first.y, x2: last.x, y2: last.y,
      });
      const peak = cr.kind === "main" ? 0.95 : 0.6;
      [[0, 0.35], [0.14, peak], [0.82, peak], [1, 0.08]].forEach(([o, op]) => {
        grad.appendChild(svgEl("stop", { offset: o, "stop-color": "#fff", "stop-opacity": op }));
      });
      defs.appendChild(grad);

      const d = pathD(cr.pts);
      const style = `--d:${cr.delay.toFixed(0)}ms; --dur:${cr.dur.toFixed(0)}ms`;
      const layers = cr.kind === "main"
        ? [
            { stroke: "rgba(255,255,255,0.28)", width: 2.6, extra: { filter: `url(#${ids.glow})` } },
            { stroke: "rgba(0,0,0,0.45)", width: 1.3, extra: { transform: "translate(0.6 0.8)" } },
            { stroke: `url(#${id})`, width: 0.8 },
          ]
        : [
            { stroke: "rgba(0,0,0,0.35)", width: 0.9, extra: { transform: "translate(0.4 0.6)" } },
            { stroke: `url(#${id})`, width: 0.6 },
          ];
      layers.forEach((l) => {
        cracksSvg.appendChild(svgEl("path", {
          d, pathLength: "1", stroke: l.stroke, "stroke-width": l.width, style, ...(l.extra || {}),
        }));
      });
    });

    ghostSvg.innerHTML = "";
    pattern.cells.forEach((cell) => ghostSvg.appendChild(svgEl("polygon", { points: polygonPoints(cell) })));
  }

  function setPattern(impactLocal) {
    const dx = impactLocal.x - PR, dy = impactLocal.y - PR;
    const d = Math.hypot(dx, dy);
    const max = PR * 0.72;
    const impact = d > max ? { x: PR + (dx / d) * max, y: PR + (dy / d) * max } : impactLocal;
    pattern = makePattern(impact);
    renderCracks();
  }

  function localPoint(e) {
    const rect = coinHit.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * PS, y: ((e.clientY - rect.top) / rect.height) * PS };
  }

  // ---------- Tilt + sheen ----------
  let tRX = 0, tRY = 0, cRX = 0, cRY = 0;
  let tGX = 42, tGY = 30, cGX = 42, cGY = 30;
  let tiltRaf = null;

  function tiltTick() {
    cRX += (tRX - cRX) * 0.12;
    cRY += (tRY - cRY) * 0.12;
    cGX += (tGX - cGX) * 0.16;
    cGY += (tGY - cGY) * 0.16;
    const hovering = coin.classList.contains(c.isHovering);
    coin.style.transform = `rotateX(${cRX.toFixed(2)}deg) rotateY(${cRY.toFixed(2)}deg) scale(${hovering ? 1.015 : 1})`;
    coin.style.setProperty("--gx", `${cGX.toFixed(1)}%`);
    coin.style.setProperty("--gy", `${cGY.toFixed(1)}%`);
    const moving = Math.abs(tRX - cRX) > 0.02 || Math.abs(tRY - cRY) > 0.02 ||
      Math.abs(tGX - cGX) > 0.05 || Math.abs(tGY - cGY) > 0.05;
    tiltRaf = moving ? requestAnimationFrame(tiltTick) : null;
  }

  function kickTilt() {
    if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltTick);
  }

  // ---------- Physics ----------
  const engine = Engine.create();
  engine.gravity.y = 1;

  (function buildBowlWalls() {
    const n = 64, thick = 26;
    const len = (2 * Math.PI * BOWL.r) / n + 3;
    const parts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = BOWL.r + thick / 2 - 2;
      parts.push(Bodies.rectangle(BOWL.x + Math.cos(a) * rr, BOWL.y + Math.sin(a) * rr, len, thick, {
        isStatic: true, angle: a + Math.PI / 2, friction: 0.6, restitution: 0.1,
      }));
    }
    Composite.add(engine.world, parts);
  })();

  let state = "coin"; // coin | puzzle | solving
  let pieces = [];
  let solvedCount = 0;
  let idleTimer = null;
  let shatterTime = 0;
  let loopRaf = null;
  let lastFrame = 0;
  let destroyed = false;

  function clampToBowl(pt, margin) {
    const dx = pt.x - BOWL.x, dy = pt.y - BOWL.y;
    const d = Math.hypot(dx, dy);
    const max = BOWL.r - margin;
    if (d <= max) return pt;
    return { x: BOWL.x + (dx / d) * max, y: BOWL.y + (dy / d) * max };
  }

  function createPieces() {
    pieces = [];
    piecesLayer.innerHTML = "";
    pattern.cells.forEach((cell, i) => {
      const cen = polygonCentroid(cell);
      const home = { x: cen.x + ORIGIN.x, y: cen.y + ORIGIN.y };
      const worldVerts = cell.map((p) => ({ x: p.x + ORIGIN.x, y: p.y + ORIGIN.y }));
      const body = Bodies.fromVertices(home.x, home.y, [worldVerts], {
        friction: 0.5, frictionStatic: 0.7, restitution: 0.12, frictionAir: 0.012, density: 0.002,
      }, true);

      const el = div(c.piece);
      el.style.left = `${ORIGIN.x}px`;
      el.style.top = `${ORIGIN.y}px`;
      el.style.width = el.style.height = `${PS}px`;
      el.style.clipPath = polygonClip(cell);
      el.style.webkitClipPath = polygonClip(cell);
      el.style.transformOrigin = `${cen.x}px ${cen.y}px`;

      // Caco de vidro: foto recortada + preenchimento fosco + aresta clara,
      // para o caco existir mesmo onde a foto é transparente.
      const clipId = `shard-${uid}-${i}-${Date.now()}`;
      const svg = svgEl("svg", { viewBox: `0 0 ${PS} ${PS}`, width: PS, height: PS });
      const defs = svgEl("defs", {});
      const clip = svgEl("clipPath", { id: clipId });
      clip.appendChild(svgEl("polygon", { points: polygonPoints(cell) }));
      defs.appendChild(clip);
      svg.appendChild(defs);
      svg.appendChild(svgEl("image", {
        href: photoUrl, width: PS, height: PS, "clip-path": `url(#${clipId})`,
        mask: `url(#${ids.vigMask})`, preserveAspectRatio: "none",
      }));
      svg.appendChild(svgEl("polygon", { points: polygonPoints(cell), class: c.shardGlass, fill: `url(#${ids.glass})` }));
      el.appendChild(svg);
      piecesLayer.appendChild(el);

      const radius = Math.sqrt(Math.abs(polygonArea(cell)) / Math.PI);
      const p = { body, el, home, radius, solved: false, claimedBy: null, held: false, dragging: false, placing: null };
      el._piece = p;
      pieces.push(p);
      Composite.add(engine.world, body);
    });
  }

  function syncPieces() {
    for (const p of pieces) {
      if (p.solved) continue;
      const { x, y } = p.body.position;
      p.el.style.transform = `translate(${(x - p.home.x).toFixed(2)}px, ${(y - p.home.y).toFixed(2)}px) rotate(${p.body.angle.toFixed(4)}rad)`;
    }
  }

  function burst(impact) {
    pieces.forEach((p) => {
      const d = Vector.sub(p.body.position, impact);
      const n = (d.x || d.y) ? Vector.normalise(d) : { x: 0, y: -1 };
      const s = 2.5 + Math.random() * 3;
      Body.setVelocity(p.body, { x: n.x * s, y: n.y * s - 2.5 });
      Body.setAngularVelocity(p.body, (Math.random() - 0.5) * 0.25);
    });
  }

  function releasePiece(p) {
    if (!p.held) return;
    p.held = false;
    p.claimedBy = null;
    p.el.classList.remove(c.isHeld);
    Body.setStatic(p.body, false);
  }

  function startPlacing(p) {
    const pos = p.body.position;
    p.placing = { sx: pos.x, sy: pos.y, sa: normAngle(p.body.angle), t0: performance.now(), dur: 280 };
    Body.setStatic(p.body, true);
    p.held = false;
    p.dragging = false;
    p.el.classList.remove(c.isDragging, c.isHeld);
  }

  function updatePlacing(now) {
    for (const p of pieces) {
      if (!p.placing) continue;
      const k = Math.min(1, (now - p.placing.t0) / p.placing.dur);
      const e = 1 - Math.pow(1 - k, 3);
      Body.setPosition(p.body, {
        x: p.placing.sx + (p.home.x - p.placing.sx) * e,
        y: p.placing.sy + (p.home.y - p.placing.sy) * e,
      });
      Body.setAngle(p.body, p.placing.sa * (1 - e));
      if (k >= 1) finalizePiece(p);
    }
  }

  function finalizePiece(p) {
    p.placing = null;
    p.solved = true;
    p.claimedBy = null;
    Composite.remove(engine.world, p.body);
    p.el.style.transform = "translate(0px, 0px) rotate(0rad)";
    p.el.classList.add(c.solved);
    void p.el.offsetWidth;
    p.el.classList.add(c.solvedPulse);
    solvedCount++;
    if (solvedCount === pieces.length) onAllSolved();
  }

  // ---------- Drag ----------
  function onPointerDown(e) {
    const el = e.target.closest(`.${c.piece}`);
    if (!el || state === "coin") return;
    if (state === "solving") {
      sendAntsRunning();
      state = "puzzle";
      startIdleWatch();
    }
    const p = el._piece;
    if (p.solved || p.placing) return;
    if (p.held) releasePiece(p);
    p.dragging = true;
    Body.setStatic(p.body, true);
    Body.setVelocity(p.body, { x: 0, y: 0 });
    Body.setAngularVelocity(p.body, 0);
    const pt = arenaPoint(e);
    p.grab = { x: pt.x - p.body.position.x, y: pt.y - p.body.position.y };
    p.lastPt = pt;
    p.lastT = performance.now();
    p.vel = { x: 0, y: 0 };
    el.classList.add(c.isDragging);
    el.setPointerCapture(e.pointerId);
    registerInteraction();
  }

  function onPointerMove(e) {
    const el = e.target.closest(`.${c.piece}`);
    if (!el) return;
    const p = el._piece;
    if (!p || !p.dragging) return;
    const pt = arenaPoint(e);
    const now = performance.now();
    const dt = Math.max(1, now - p.lastT);
    p.vel = { x: (pt.x - p.lastPt.x) / dt * 16, y: (pt.y - p.lastPt.y) / dt * 16 };
    p.lastPt = pt;
    p.lastT = now;
    const target = clampToBowl({ x: pt.x - p.grab.x, y: pt.y - p.grab.y }, p.radius + 10);
    Body.setPosition(p.body, target);
    Body.setAngle(p.body, normAngle(p.body.angle) * 0.86);
  }

  function onPointerUp(e) {
    const el = e.target.closest(`.${c.piece}`);
    if (!el) return;
    const p = el._piece;
    if (!p || !p.dragging) return;
    p.dragging = false;
    el.classList.remove(c.isDragging);
    const d = Math.hypot(p.body.position.x - p.home.x, p.body.position.y - p.home.y);
    if (d < SNAP_DIST && Math.abs(normAngle(p.body.angle)) < 0.6) {
      startPlacing(p);
    } else {
      Body.setStatic(p.body, false);
      const sp = Math.hypot(p.vel.x, p.vel.y);
      const k = sp > 14 ? 14 / sp : 1;
      Body.setVelocity(p.body, { x: p.vel.x * k, y: p.vel.y * k });
    }
    registerInteraction();
  }

  piecesLayer.addEventListener("pointerdown", onPointerDown);
  piecesLayer.addEventListener("pointermove", onPointerMove);
  piecesLayer.addEventListener("pointerup", onPointerUp);
  piecesLayer.addEventListener("pointercancel", onPointerUp);

  // ---------- Ants ----------
  const ANT_SVG = `
<svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true">
  <g stroke="#8a3512" stroke-width="1.15" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path class="${c.leg} ${c.a}" style="--dir:1;  transform-origin:22px 10px" d="M22,10 L26.5,5 L31,1.5"/>
    <path class="${c.leg} ${c.b}" style="--dir:-1; transform-origin:22px 14px" d="M22,14 L26.5,19 L31,22.5"/>
    <path class="${c.leg} ${c.b}" style="--dir:1;  transform-origin:20px 9.4px" d="M20,9.4 L20.5,4 L18.5,0"/>
    <path class="${c.leg} ${c.a}" style="--dir:-1; transform-origin:20px 14.6px" d="M20,14.6 L20.5,20 L18.5,24"/>
    <path class="${c.leg} ${c.a}" style="--dir:1;  transform-origin:18px 10px" d="M18,10 L13,5 L8,1.5"/>
    <path class="${c.leg} ${c.b}" style="--dir:-1; transform-origin:18px 14px" d="M18,14 L13,19 L8,22.5"/>
  </g>
  <ellipse cx="10.5" cy="12" rx="7" ry="4.4" fill="#a63d14" stroke="#d2531f" stroke-width=".5"/>
  <ellipse cx="17.5" cy="12" rx="1.6" ry="1.2" fill="#8a3512"/>
  <ellipse cx="20.5" cy="12" rx="4" ry="2.9" fill="#a63d14" stroke="#d2531f" stroke-width=".5"/>
  <g class="${c.head}">
    <circle cx="26.8" cy="12" r="3.1" fill="#8a3512"/>
    <path d="M29.4,11 L31.5,9.8 M29.4,13 L31.5,14.2" stroke="#8a3512" stroke-width="1" stroke-linecap="round"/>
    <g stroke="#8a3512" stroke-width=".9" fill="none" stroke-linecap="round">
      <path class="${c.antenna} ${c.l}" style="--dir:1;  transform-origin:28px 10.5px" d="M28,10.5 L31,6 L35,4"/>
      <path class="${c.antenna} ${c.r}" style="--dir:-1; transform-origin:28px 13.5px" d="M28,13.5 L31,18 L35,20"/>
    </g>
  </g>
</svg>`;

  let ants = [];
  let antSeq = 0;

  function createAnt(delay) {
    const el = div(c.ant);
    el.innerHTML = ANT_SVG;
    const x = offscreenRightX();
    const y = BOWL.y + 10 + Math.random() * 50;
    el.style.transform = `translate(${x - 20}px, ${y - 12}px) rotate(${Math.PI}rad)`;
    antsLayer.appendChild(el);
    const ant = {
      id: ++antSeq, el, x, y, angle: Math.PI,
      state: "wait", t: delay, piece: null, phase: Math.random() * Math.PI * 2,
      entry: { x: BOWL.x + BOWL.r * 0.7, y: BOWL.y + 20 + Math.random() * 40 },
    };
    ants.push(ant);
    return ant;
  }

  function setAntMode(ant, walking, sniffing, carrying, fleeing = false) {
    ant.el.classList.toggle(c.walking, walking);
    ant.el.classList.toggle(c.sniffing, sniffing);
    ant.el.classList.toggle(c.carrying, carrying);
    ant.el.classList.toggle(c.fleeing, fleeing);
  }

  function moveToward(ant, target, speed, dt) {
    const dx = target.x - ant.x, dy = target.y - ant.y;
    const dist = Math.hypot(dx, dy);
    const stepLen = speed * dt;
    if (dist <= Math.max(2, stepLen)) {
      ant.x = target.x;
      ant.y = target.y;
      return true;
    }
    ant.x += (dx / dist) * stepLen;
    ant.y += (dy / dist) * stepLen;
    ant.angle = lerpAngle(ant.angle, Math.atan2(dy, dx), 0.14);
    return false;
  }

  function pickPiece(ant) {
    let best = null, bestD = Infinity;
    for (const p of pieces) {
      if (p.solved || p.claimedBy || p.dragging || p.placing) continue;
      const d = Math.hypot(p.body.position.x - ant.x, p.body.position.y - ant.y);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  function holdDistance(p) {
    return p.radius * 0.72 + 9;
  }

  function sendAway(ant, stateName) {
    ant.piece = null;
    ant.state = stateName;
    ant.exit = { x: offscreenRightX(), y: ant.y + (Math.random() - 0.5) * 30 };
    setAntMode(ant, true, false, false, stateName === "flee");
  }

  // Formigas não se atravessam: afastamento suave quando ficam perto.
  function separateAnts() {
    for (const a of ants) {
      if (!MOVING.has(a.state)) continue;
      for (const b of ants) {
        if (a === b || b.state === "wait" || b.state === "gone") continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        const minD = (a.state === "carry" || b.state === "carry") ? 30 : 21;
        if (d > 0.01 && d < minD) {
          const push = (minD - d) * 0.35;
          a.x += (dx / d) * push;
          a.y += (dy / d) * push;
        }
      }
    }
  }

  function updateAnts(dt, now) {
    for (const ant of ants) {
      switch (ant.state) {
        case "wait":
          ant.t -= dt;
          if (ant.t <= 0) { ant.state = "enter"; setAntMode(ant, true, false, false); }
          break;

        case "enter":
          if (moveToward(ant, ant.entry, 58, dt)) ant.state = "seek";
          break;

        case "seek": {
          if (!ant.piece) {
            const p = pickPiece(ant);
            if (!p) {
              if (!pieces.some((q) => !q.solved)) sendAway(ant, "leave");
              else setAntMode(ant, false, false, false);
              break;
            }
            p.claimedBy = ant.id;
            ant.piece = p;
            setAntMode(ant, true, false, false);
          }
          const p = ant.piece;
          if (p.solved || p.dragging) { ant.piece = null; break; }
          const pos = p.body.position;
          const dx = ant.x - pos.x, dy = ant.y - pos.y;
          const d = Math.hypot(dx, dy) || 1;
          const target = { x: pos.x + (dx / d) * (p.radius * 0.55), y: pos.y + (dy / d) * (p.radius * 0.55) };
          if (moveToward(ant, target, 52, dt)) {
            ant.state = "sniff";
            ant.t = 0.7;
            ant.angle = Math.atan2(pos.y - ant.y, pos.x - ant.x);
            setAntMode(ant, false, true, false);
          }
          break;
        }

        case "sniff":
          ant.t -= dt;
          if (ant.t <= 0) {
            const p = ant.piece;
            Body.setStatic(p.body, true);
            Body.setVelocity(p.body, { x: 0, y: 0 });
            p.held = true;
            p.el.classList.add(c.isHeld);
            ant.state = "carry";
            setAntMode(ant, true, false, true);
          }
          break;

        case "carry": {
          const p = ant.piece;
          const hold = holdDistance(p);
          const hx = p.home.x - ant.x, hy = p.home.y - ant.y;
          const hd = Math.hypot(hx, hy) || 1;
          const target = { x: p.home.x - (hx / hd) * hold, y: p.home.y - (hy / hd) * hold };
          const arrived = moveToward(ant, target, 38, dt);
          Body.setPosition(p.body, { x: ant.x + Math.cos(ant.angle) * hold, y: ant.y + Math.sin(ant.angle) * hold });
          Body.setAngle(p.body, normAngle(p.body.angle) * 0.9);
          if (arrived) {
            ant.state = "place";
            ant.t = 0.4;
            setAntMode(ant, false, false, false);
            startPlacing(p);
          }
          break;
        }

        case "place":
          ant.t -= dt;
          if (ant.t <= 0) { ant.piece = null; ant.state = "seek"; setAntMode(ant, true, false, false); }
          break;

        case "leave":
          if (moveToward(ant, ant.exit, 60, dt)) ant.state = "gone";
          break;

        case "flee":
          if (moveToward(ant, ant.exit, 170, dt)) ant.state = "gone";
          break;
      }
    }

    separateAnts();

    for (const ant of ants) {
      if (ant.state === "gone") { ant.el.remove(); continue; }
      const walking = ant.el.classList.contains(c.walking);
      const wob = walking ? Math.sin(now * 0.012 + ant.phase) * 1.4 : 0;
      const rx = ant.x - Math.sin(ant.angle) * wob;
      const ry = ant.y + Math.cos(ant.angle) * wob;
      ant.el.style.transform = `translate(${(rx - 20).toFixed(1)}px, ${(ry - 12).toFixed(1)}px) rotate(${ant.angle.toFixed(3)}rad)`;
    }
    ants = ants.filter((a) => a.state !== "gone");
  }

  // Pessoa voltou a mexer (pegou um caco, ou quebrou a foto de novo enquanto
  // elas ainda estavam na tela): largam tudo e correm para fora.
  function sendAntsRunning() {
    for (const ant of ants) {
      if (ant.state === "gone" || ant.state === "flee") continue;
      if (ant.piece) {
        if (ant.piece.held) releasePiece(ant.piece);
        ant.piece.claimedBy = null;
      }
      sendAway(ant, "flee");
    }
  }

  // ---------- Loop ----------
  function frame(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    Engine.update(engine, 1000 / 60);
    updatePlacing(now);
    updateAnts(dt, now);
    syncPieces();
    if (state === "coin" && ants.length === 0) { loopRaf = null; return; }
    loopRaf = requestAnimationFrame(frame);
  }

  function ensureLoop() {
    if (!loopRaf) { lastFrame = performance.now(); loopRaf = requestAnimationFrame(frame); }
  }

  // ---------- State ----------
  function shatter(e) {
    if (state !== "coin") return;
    if (!pattern) setPattern(localPoint(e));
    state = "puzzle";
    sendAntsRunning(); // quebrou de novo com formigas ainda na tela: elas fogem
    solvedCount = 0;
    shatterTime = performance.now();
    createPieces();
    syncPieces();
    coin.classList.add(c.isHidden);
    coin.classList.remove(c.isHovering);
    root.classList.add(c.isBroken);
    burst({ x: pattern.impact.x + ORIGIN.x, y: pattern.impact.y + ORIGIN.y });
    setTimeout(() => { if (state !== "coin") ghost.classList.add(c.isVisible); }, 700);
    ensureLoop();
    startIdleWatch();
  }

  function backToCoin() {
    stopIdleWatch();
    state = "coin";
    for (const p of pieces) { if (!p.solved) Composite.remove(engine.world, p.body); }
    pieces = [];
    piecesLayer.innerHTML = "";
    ghost.classList.remove(c.isVisible);
    root.classList.remove(c.isBroken);
    coin.classList.remove(c.isHidden);
    pattern = null;
    cracksSvg.innerHTML = "";
    for (const ant of ants) {
      if (ant.state !== "leave" && ant.state !== "flee" && ant.state !== "gone") sendAway(ant, "leave");
    }
    ensureLoop();
  }

  function onAllSolved() {
    stopIdleWatch();
    setTimeout(() => { if (state !== "coin" && !destroyed) backToCoin(); }, 700);
  }

  // ---------- Idle / scroll-away ----------
  let observer = null;

  function registerInteraction() {
    if (state === "puzzle") startIdleWatch();
  }

  function startIdleWatch() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (state === "puzzle") callAnts(); }, IDLE_MS);
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting && state === "puzzle" && performance.now() - shatterTime > 1500) callAnts();
        });
      }, { threshold: 0 });
    }
    observer.observe(root);
  }

  function stopIdleWatch() {
    clearTimeout(idleTimer);
    if (observer) observer.unobserve(root);
  }

  function callAnts() {
    if (state !== "puzzle") return;
    state = "solving";
    stopIdleWatch();
    for (const p of pieces) {
      if (p.dragging) { p.dragging = false; p.el.classList.remove(c.isDragging); Body.setStatic(p.body, false); }
    }
    for (let i = 0; i < ANT_COUNT; i++) createAnt(0.2 + i * 0.9);
    ensureLoop();
  }

  // ---------- Hover / click ----------
  function onEnter(e) {
    if (state !== "coin") return;
    setPattern(localPoint(e));
    void cracksSvg.getBoundingClientRect();
    coin.classList.add(c.isHovering);
    kickTilt();
  }

  function onMove(e) {
    if (!canHover || reduceMotion) return;
    const rect = coinHit.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    tRY = nx * 9;
    tRX = -ny * 9;
    tGX = 50 + nx * 20;
    tGY = 34 + ny * 18;
    kickTilt();
  }

  function onLeave() {
    coin.classList.remove(c.isHovering);
    tRX = 0; tRY = 0; tGX = 42; tGY = 30;
    kickTilt();
  }

  coinHit.addEventListener("mouseenter", onEnter);
  coinHit.addEventListener("mousemove", onMove);
  coinHit.addEventListener("mouseleave", onLeave);
  coinHit.addEventListener("click", shatter);

  return {
    destroy() {
      destroyed = true;
      stopIdleWatch();
      if (observer) observer.disconnect();
      ro.disconnect();
      if (loopRaf) cancelAnimationFrame(loopRaf);
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      coinHit.removeEventListener("mouseenter", onEnter);
      coinHit.removeEventListener("mousemove", onMove);
      coinHit.removeEventListener("mouseleave", onLeave);
      coinHit.removeEventListener("click", shatter);
      piecesLayer.removeEventListener("pointerdown", onPointerDown);
      piecesLayer.removeEventListener("pointermove", onPointerMove);
      piecesLayer.removeEventListener("pointerup", onPointerUp);
      piecesLayer.removeEventListener("pointercancel", onPointerUp);
      Composite.clear(engine.world, false);
      root.innerHTML = "";
    },
  };
}
