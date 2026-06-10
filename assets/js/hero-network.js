const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

let raf;

function resize() {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

function w() { return canvas.offsetWidth; }
function h() { return canvas.offsetHeight; }

// ── Globus z punktów + łuki połączeń ──

const DOT_ROWS = 18;       // równoleżniki
const DOTS_PER_ROW = 36;   // punkty na równoleżniku
const ROT_SPEED = 0.0028;

let rotation = 0;
let dots = [];
let arcs = [];
let time = 0;

function radius() { return Math.min(w(), h()) * 0.36; }
function cx() { return w() / 2; }
function cy() { return h() / 2; }

function buildDots() {
  dots = [];
  for (let i = 1; i < DOT_ROWS; i++) {
    const lat = (i / DOT_ROWS) * Math.PI - Math.PI / 2;
    const count = Math.max(6, Math.round(DOTS_PER_ROW * Math.cos(lat)));
    for (let j = 0; j < count; j++) {
      const lon = (j / count) * Math.PI * 2;
      dots.push({ lat, lon });
    }
  }
}

// rzutowanie 3D -> 2D (oś Y pionowa, obrót wokół niej)
function project(lat, lon) {
  const r = radius();
  const x3 = Math.cos(lat) * Math.sin(lon + rotation);
  const y3 = Math.sin(lat);
  const z3 = Math.cos(lat) * Math.cos(lon + rotation);
  return {
    x: cx() + x3 * r,
    y: cy() - y3 * r,
    z: z3, // -1 (tył) .. 1 (przód)
  };
}

class Arc {
  constructor() {
    this.a = dots[Math.floor(Math.random() * dots.length)];
    this.b = dots[Math.floor(Math.random() * dots.length)];
    this.t = 0;
    this.speed = 0.011 + Math.random() * 0.008;
    this.lift = 0.25 + Math.random() * 0.2; // wysokość łuku nad powierzchnią
  }

  // punkt na łuku w 3D (interpolacja sferyczna + uniesienie)
  pointAt(t) {
    const lat = this.a.lat + (this.b.lat - this.a.lat) * t;
    let dLon = this.b.lon - this.a.lon;
    if (dLon > Math.PI) dLon -= Math.PI * 2;
    if (dLon < -Math.PI) dLon += Math.PI * 2;
    const lon = this.a.lon + dLon * t;
    const lift = 1 + Math.sin(t * Math.PI) * this.lift;

    const r = radius() * lift;
    const x3 = Math.cos(lat) * Math.sin(lon + rotation);
    const y3 = Math.sin(lat);
    const z3 = Math.cos(lat) * Math.cos(lon + rotation);
    return { x: cx() + x3 * r, y: cy() - y3 * r, z: z3 };
  }

  update() {
    this.t += this.speed;
    return this.t < 1.35; // chwila na wygaśnięcie śladu
  }

  draw() {
    const head = Math.min(this.t, 1);
    const tail = Math.max(0, this.t - 0.35);

    // ślad łuku
    ctx.beginPath();
    let started = false;
    for (let t = tail; t <= head; t += 0.02) {
      const p = this.pointAt(t);
      if (p.z < -0.15) { started = false; continue; }
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(96,165,250,0.55)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // głowica
    if (this.t <= 1) {
      const p = this.pointAt(head);
      if (p.z > -0.15) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        g.addColorStop(0, "rgba(147,197,253,0.9)");
        g.addColorStop(1, "rgba(37,99,235,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
      }
    }
  }
}

function frame() {
  ctx.clearRect(0, 0, w(), h());
  time++;
  rotation += ROT_SPEED;

  // delikatna poświata za globusem
  const glow = ctx.createRadialGradient(cx(), cy(), radius() * 0.2, cx(), cy(), radius() * 1.4);
  glow.addColorStop(0, "rgba(37,99,235,0.08)");
  glow.addColorStop(1, "rgba(37,99,235,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w(), h());

  // punkty globusa
  dots.forEach((d) => {
    const p = project(d.lat, d.lon);
    if (p.z < -0.2) return; // tylna półkula niewidoczna
    const depth = (p.z + 0.2) / 1.2; // 0..1
    const alpha = 0.12 + depth * 0.55;
    const size = 0.8 + depth * 1.1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96,165,250,${alpha})`;
    ctx.fill();
  });

  // nowy łuk co ~20 klatek
  if (time % 20 === 0 && arcs.length < 14) {
    arcs.push(new Arc());
  }
  arcs = arcs.filter((a) => { const alive = a.update(); if (alive) a.draw(); return alive; });

  raf = requestAnimationFrame(frame);
}

function init() {
  resize();
  buildDots();
  frame();
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(raf);
  resize();
  frame();
});

init();
