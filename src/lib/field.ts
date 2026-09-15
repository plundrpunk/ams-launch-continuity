import { fieldStore } from "./fieldStore";

// Canvas 2D particle field. Points represent runs. Three states blended by t:
//   t = 0   scattered: slow per-point drift, dim, no lines
//   t = 0.5 linked:    points gather around cluster centers, hairlines join near neighbors
//   t = 1   loop:      points settle onto one closed curve and travel along it
// Pure TypeScript, no React. The owning component handles observers and cleanup.

type RGB = readonly [number, number, number];
const ACCENT: RGB = [99, 164, 230]; // #63A4E6
const ACCENT_DEEP: RGB = [46, 111, 169]; // #2E6FA9, canvas gradients only
const DIM: RGB = [152, 162, 174]; // #98A2AE
const TEXT: RGB = [232, 236, 241]; // #E8ECF1

interface Pt {
  ax: number; // scatter anchor, normalized
  ay: number;
  amp: number; // drift amplitude in px
  f1: number; // drift frequencies and phases
  f2: number;
  p1: number;
  p2: number;
  cl: number; // cluster index
  ca: number; // angle around cluster center
  cr: number; // radius factor 0..1
  cw: number; // angular speed
  lp: number; // loop phase 0..1
  ls: number; // loop speed, cycles per second
  ln: number; // normal offset across the loop band, -1..1
  sz: number; // radius in px
  a0: number; // base alpha when scattered
  br: number; // 1 for the few points that brighten
  tone: number; // 0..1 color mix toward text color on the loop
}

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (a: RGB, b: RGB, k: number): RGB => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;

// Small deterministic PRNG so the field composes the same way on every visit.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class ParticleField {
  private readonly ctx: CanvasRenderingContext2D;
  private pts: Pt[] = [];
  private pairs: number[] = [];
  private pos: Float32Array = new Float32Array(0);
  private curve: Float32Array = new Float32Array(0);
  private centers: Array<[number, number]> = [];
  private w = 0;
  private h = 0;
  private mobile = false;
  private t = 0;
  private time = 0;
  private last = 0;
  private px = 0;
  private py = 0;
  private raf = 0;
  private running = false;
  private inView = true;
  private pageVisible = true;
  private ro: ResizeObserver | null = null;
  private readonly loop = { cx: 0, cy: 0, rx: 0, ry: 0, rot: -0.38, band: 7 };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly reduced: boolean,
  ) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    if (reduced) this.t = 1;
  }

  mount() {
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.canvas);
    this.sync();
  }

  destroy() {
    this.ro?.disconnect();
    this.ro = null;
    this.stop();
  }

  setInView(v: boolean) {
    this.inView = v;
    this.sync();
  }

  setPageVisible(v: boolean) {
    this.pageVisible = v;
    this.sync();
  }

  private sync() {
    if (this.reduced) return; // static render, no loop
    if (this.inView && this.pageVisible) this.start();
    else this.stop();
  }

  private start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    this.mobile = w < 768;
    const n = w >= 1024 ? 1200 : w >= 768 ? 760 : 420;
    if (this.pts.length !== n) this.build(n);
    this.layout();
    if (this.reduced) this.draw();
  }

  private build(n: number) {
    const rnd = mulberry32(20260915);
    const pts: Pt[] = [];
    for (let i = 0; i < n; i++) {
      // Density weighted to the right half at desktop (copy sits left), lower half on mobile.
      let ax: number;
      let ay: number;
      if (this.mobile) {
        ax = 0.04 + 0.92 * rnd();
        ay = rnd() < 0.62 ? 0.4 + 0.58 * rnd() : 0.06 + 0.9 * rnd();
      } else {
        ax = rnd() < 0.72 ? 0.4 + 0.6 * Math.pow(rnd(), 0.75) : 0.03 + 0.94 * rnd();
        ay = 0.05 + 0.9 * rnd();
      }
      pts.push({
        ax,
        ay,
        amp: 5 + rnd() * 14,
        f1: 0.12 + rnd() * 0.3,
        f2: 0.1 + rnd() * 0.28,
        p1: rnd() * TAU,
        p2: rnd() * TAU,
        cl: Math.floor(rnd() * 6),
        ca: rnd() * TAU,
        cr: Math.pow(rnd(), 1.5),
        cw: (rnd() - 0.5) * 0.14,
        lp: rnd(),
        ls: 0.016 + rnd() * 0.03,
        ln: rnd() * 2 - 1,
        sz: 0.85 + rnd() * 1.05,
        a0: 0.3 + rnd() * 0.2,
        br: rnd() < 0.13 ? 1 : 0,
        tone: rnd(),
      });
    }
    this.pts = pts;
  }

  private layout() {
    const { w, h } = this;
    const C: Array<[number, number]> = this.mobile
      ? [
          [0.5, 0.32],
          [0.24, 0.52],
          [0.76, 0.54],
          [0.38, 0.74],
          [0.66, 0.82],
          [0.52, 0.6],
        ]
      : [
          [0.62, 0.28],
          [0.82, 0.5],
          [0.63, 0.7],
          [0.9, 0.24],
          [0.78, 0.86],
          [0.47, 0.44],
        ];
    this.centers = C.map(([x, y]) => [x * w, y * h]);
    const L = this.loop;
    if (this.mobile) {
      L.cx = w * 0.5;
      L.cy = h * 0.56;
      L.rx = w * 0.36;
      L.ry = h * 0.24;
      L.band = 5;
    } else {
      L.cx = w * 0.64;
      L.cy = h * 0.5;
      L.rx = Math.min(w * 0.26, h * 0.5);
      L.ry = h * 0.3;
      L.band = 7;
    }
    const N = 256;
    const cv = new Float32Array(N * 2 + 2);
    for (let i = 0; i <= N; i++) {
      const [x, y] = this.loopPoint(i / N, 0);
      cv[i * 2] = x;
      cv[i * 2 + 1] = y;
    }
    this.curve = cv;
    this.pos = new Float32Array(this.pts.length * 2);
    this.computePairs();
  }

  // Slightly irregular ellipse, rotated, with an optional offset across the band.
  private loopPoint(u: number, normal: number): [number, number] {
    const L = this.loop;
    const th = u * TAU;
    const rr = 1 + 0.05 * Math.sin(3 * th + 1.3) + 0.03 * Math.sin(5 * th + 0.4) + 0.025 * Math.sin(2 * th + 2.1);
    const x0 = L.rx * rr * Math.cos(th) + normal * L.band * Math.cos(th);
    const y0 = L.ry * rr * Math.sin(th) + normal * L.band * Math.sin(th);
    const c = Math.cos(L.rot);
    const s = Math.sin(L.rot);
    return [L.cx + x0 * c - y0 * s, L.cy + x0 * s + y0 * c];
  }

  private linkedPoint(p: Pt, time: number): [number, number] {
    const [cx, cy] = this.centers[p.cl];
    const R = Math.min(this.w, this.h) * (this.mobile ? 0.15 : 0.11);
    const ang = p.ca + time * p.cw;
    const r = p.cr * R;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  }

  // Two nearest neighbors per point inside its cluster, deduplicated. Computed once per layout.
  private computePairs() {
    const n = this.pts.length;
    const buckets: number[][] = Array.from({ length: this.centers.length }, () => []);
    this.pts.forEach((p, i) => buckets[p.cl].push(i));
    const lx = new Float32Array(n);
    const ly = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const [x, y] = this.linkedPoint(this.pts[i], 0);
      lx[i] = x;
      ly[i] = y;
    }
    const pairs: number[] = [];
    const seen = new Set<number>();
    for (const b of buckets) {
      for (const i of b) {
        let b1 = -1;
        let b2 = -1;
        let d1 = Infinity;
        let d2 = Infinity;
        for (const j of b) {
          if (j === i) continue;
          const dx = lx[i] - lx[j];
          const dy = ly[i] - ly[j];
          const d = dx * dx + dy * dy;
          if (d < d1) {
            d2 = d1;
            b2 = b1;
            d1 = d;
            b1 = j;
          } else if (d < d2) {
            d2 = d;
            b2 = j;
          }
        }
        for (const j of [b1, b2]) {
          if (j < 0) continue;
          const key = i < j ? i * n + j : j * n + i;
          if (seen.has(key)) continue;
          seen.add(key);
          pairs.push(i, j);
        }
      }
    }
    this.pairs = pairs;
  }

  private readonly frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    const target = clamp01(fieldStore.target);
    this.t += (target - this.t) * Math.min(1, dt * 5);
    // Pointer parallax, capped at 12px, smoothed.
    this.px += (fieldStore.pointerX * 12 - this.px) * Math.min(1, dt * 4);
    this.py += (fieldStore.pointerY * 12 - this.py) * Math.min(1, dt * 4);
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private strokeCurve(style: string, width: number) {
    const cv = this.curve;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(cv[0], cv[1]);
    for (let i = 2; i < cv.length; i += 2) ctx.lineTo(cv[i], cv[i + 1]);
    ctx.closePath();
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  private draw() {
    const { ctx, w, h, t, time, pts, pos } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(this.px, this.py);

    const s = smooth(0, 0.5, t); // scattered to linked
    const q = smooth(0.5, 1, t); // linked to loop
    const wLink = smooth(0.14, 0.42, t) * (1 - smooth(0.6, 0.9, t));
    const wLoop = smooth(0.62, 1, t);
    const n = pts.length;

    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const sx = p.ax * w + Math.sin(time * p.f1 + p.p1) * p.amp;
      const sy = p.ay * h + Math.cos(time * p.f2 + p.p2) * p.amp;
      const [lx, ly] = this.linkedPoint(p, time);
      const u = (p.lp + time * p.ls) % 1;
      const [ox, oy] = this.loopPoint(u, p.ln);
      const x1 = lerp(sx, lx, s);
      const y1 = lerp(sy, ly, s);
      pos[i * 2] = lerp(x1, ox, q);
      pos[i * 2 + 1] = lerp(y1, oy, q);
    }

    // Soft glow along the loop path: three strokes, no shadowBlur.
    if (wLoop > 0.01) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      this.strokeCurve(rgba(ACCENT_DEEP, 0.1 * wLoop), 22);
      this.strokeCurve(rgba(ACCENT, 0.12 * wLoop), 8);
      this.strokeCurve(rgba(ACCENT, 0.3 * wLoop), 1.5);
    }

    // Hairlines between near neighbors while linked.
    if (wLink > 0.01) {
      const maxD = 150 * 150;
      const pr = this.pairs;
      ctx.beginPath();
      for (let k = 0; k < pr.length; k += 2) {
        const i = pr[k];
        const j = pr[k + 1];
        const ax = pos[i * 2];
        const ay = pos[i * 2 + 1];
        const bx = pos[j * 2];
        const by = pos[j * 2 + 1];
        const dx = ax - bx;
        const dy = ay - by;
        if (dx * dx + dy * dy > maxD) continue;
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      }
      ctx.strokeStyle = rgba(ACCENT, 0.17 * wLink);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Points.
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const x = pos[i * 2];
      const y = pos[i * 2 + 1];
      if (x < -12 || y < -12 || x > w + 12 || y > h + 12) continue;
      const cLink = p.br ? ACCENT : DIM;
      const aLink = p.br ? 0.85 : p.a0 * 1.15;
      const cLoop = mix(ACCENT, TEXT, p.tone * 0.45);
      const aLoop = p.br ? 0.95 : 0.45 + p.tone * 0.35;
      const c1 = mix(DIM, cLink, s);
      const a1 = lerp(p.a0, aLink, s);
      const c = mix(c1, cLoop, q);
      const a = lerp(a1, aLoop, q);
      const r = p.sz * (p.br ? 1.25 : 1) * (1 - 0.15 * q);
      ctx.fillStyle = rgba(c, a);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    // One brighter head point leads the loop.
    if (wLoop > 0.01) {
      const [hx, hy] = this.loopPoint((time * 0.06) % 1, 0);
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 26);
      g.addColorStop(0, rgba(ACCENT, 0.5 * wLoop));
      g.addColorStop(1, rgba(ACCENT, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(hx, hy, 26, 0, TAU);
      ctx.fill();
      ctx.fillStyle = rgba(TEXT, 0.95 * wLoop);
      ctx.beginPath();
      ctx.arc(hx, hy, 3, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }
}
