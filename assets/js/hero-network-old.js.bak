const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

const NODE_COUNT = 22;
const CONNECTION_DIST = 160;
const SPEED = 0.35;

let nodes = [];
let pulses = [];
let raf;

function resize() {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

function w() { return canvas.offsetWidth; }
function h() { return canvas.offsetHeight; }

class Node {
  constructor() {
    this.x = Math.random() * w();
    this.y = Math.random() * h();
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r = Math.random() * 2 + 1.5;
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w()) this.vx *= -1;
    if (this.y < 0 || this.y > h()) this.vy *= -1;
    this.phase += 0.025;
  }

  draw() {
    const pulse = Math.sin(this.phase) * 0.25 + 0.75;

    // glow
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
    g.addColorStop(0, `rgba(37,99,235,${0.25 * pulse})`);
    g.addColorStop(1, "rgba(37,99,235,0)");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96,165,250,${pulse})`;
    ctx.fill();
  }
}

class Pulse {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.t = 0;
    this.speed = 0.007 + Math.random() * 0.007;
  }

  update() {
    this.t += this.speed;
    return this.t < 1;
  }

  draw() {
    const x = this.a.x + (this.b.x - this.a.x) * this.t;
    const y = this.a.y + (this.b.y - this.a.y) * this.t;

    const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
    g.addColorStop(0, "rgba(147,197,253,0.85)");
    g.addColorStop(1, "rgba(37,99,235,0)");
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
  }
}

let tick = 0;

function frame() {
  ctx.clearRect(0, 0, w(), h());

  // connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < CONNECTION_DIST) {
        const alpha = (1 - d / CONNECTION_DIST) * 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  nodes.forEach((n) => { n.update(); n.draw(); });

  // spawn pulse every ~45 frames
  tick++;
  if (tick % 45 === 0) {
    const pairs = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST) pairs.push([nodes[i], nodes[j]]);
      }
    }
    if (pairs.length) {
      const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
      pulses.push(new Pulse(a, b));
    }
  }

  pulses = pulses.filter((p) => { const alive = p.update(); if (alive) p.draw(); return alive; });

  raf = requestAnimationFrame(frame);
}

function init() {
  resize();
  nodes = Array.from({ length: NODE_COUNT }, () => new Node());
  frame();
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(raf);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  resize();
  frame();
});

init();
