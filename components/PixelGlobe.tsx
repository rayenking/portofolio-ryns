"use client";

import { useEffect, useRef } from "react";

type Particle = {
  sx: number;
  sy: number;
  sz: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  delay: number;
  trailOffsetX: number;
  trailOffsetY: number;
  size: number;
  alpha: number;
};

type Point = { x: number; y: number };
type Mode = "sphere" | "follow" | "shape";

function fibSphere(n: number) {
  const pts: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

function sampleCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w: number,
  h: number,
  step = 5
): Point[] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#000";
  draw(ctx, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const out: Point[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) out.push({ x, y });
    }
  }
  return out;
}

function shapeRingO(size = 320): Point[] {
  return sampleCanvas(
    (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const outer = Math.min(w, h) / 2 - 8;
      const inner = outer - 34;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      ctx.fill("evenodd");
    },
    size,
    size,
    4
  );
}

function shapeCat(size = 340): Point[] {
  return sampleCanvas(
    (ctx, w, h) => {
      const cx = w / 2;
      const cy = h / 2 + 10;
      // head (fill)
      ctx.beginPath();
      ctx.ellipse(cx, cy, 90, 82, 0, 0, Math.PI * 2);
      ctx.fill();
      // ears
      ctx.beginPath();
      ctx.moveTo(cx - 86, cy - 40);
      ctx.lineTo(cx - 58, cy - 108);
      ctx.lineTo(cx - 26, cy - 44);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 26, cy - 44);
      ctx.lineTo(cx + 58, cy - 108);
      ctx.lineTo(cx + 86, cy - 40);
      ctx.closePath();
      ctx.fill();
    },
    size,
    size,
    4
  );
}

function shapeText(text: string, font: string, w: number, h: number, step = 4): Point[] {
  return sampleCanvas(
    (ctx, width, height) => {
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
    },
    w,
    h,
    step
  );
}

function detectShape(pts: Point[]): "O" | "N" | "ryns" {
  if (pts.length < 8) return "ryns";
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  const size = Math.max(w, h);
  if (size < 40) return "ryns";

  const dStartEnd = Math.hypot(
    pts[0].x - pts[pts.length - 1].x,
    pts[0].y - pts[pts.length - 1].y
  );
  const closed = dStartEnd < size * 0.4;
  const aspect = w / Math.max(h, 1);

  if (closed && aspect > 0.6 && aspect < 1.6) {
    // roughly circular → O
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const dists = pts.map((p) => Math.hypot(p.x - cx, p.y - cy));
    const avg = dists.reduce((a, b) => a + b, 0) / dists.length;
    const variance = dists.reduce((a, d) => a + (d - avg) ** 2, 0) / dists.length;
    const circ = Math.sqrt(variance) / avg;
    if (circ < 0.3) return "O";
  }

  // check for N: 3+ vertical legs (down → up → down) with horizontal span
  if (!closed && aspect > 0.5 && h > 40) {
    let peaks = 0;
    const smooth: number[] = [];
    const window = 3;
    for (let i = 0; i < pts.length; i++) {
      let s = 0;
      let c = 0;
      for (let j = -window; j <= window; j++) {
        const k = i + j;
        if (k >= 0 && k < pts.length) {
          s += pts[k].y;
          c++;
        }
      }
      smooth.push(s / c);
    }
    let dir = 0;
    let reversals = 0;
    for (let i = 4; i < smooth.length - 4; i++) {
      const d = smooth[i + 4] - smooth[i];
      if (Math.abs(d) < h * 0.05) continue;
      const newDir = d > 0 ? 1 : -1;
      if (dir !== 0 && newDir !== dir) reversals++;
      dir = newDir;
    }
    if (reversals >= 2) return "N";
    // fallback: N from box_corners
    peaks = 0;
    for (let i = 3; i < smooth.length - 3; i++) {
      if (smooth[i] < smooth[i - 3] && smooth[i] < smooth[i + 3]) peaks++;
    }
    if (peaks >= 1 && aspect > 0.7) return "N";
  }

  return "ryns";
}

export function PixelGlobe({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef<Mode>("sphere");
  const drawingRef = useRef(false);
  const drawingPointsRef = useRef<Point[]>([]);
  const pointerRef = useRef<Point | null>(null);
  const pointerTrailRef = useRef<Point[]>([]);
  const angleRef = useRef(0);
  const tiltRef = useRef(0);
  const shapeTimerRef = useRef(0);
  const followUpRef = useRef<null | "cat">(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(120);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 700;
    const spherePts = fibSphere(N);
    particlesRef.current = spherePts.map((p) => ({
      sx: p.x,
      sy: p.y,
      sz: p.z,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      homeX: 0,
      homeY: 0,
      targetX: 0,
      targetY: 0,
      startX: 0,
      startY: 0,
      delay: 0,
      trailOffsetX: (Math.random() - 0.5) * 40,
      trailOffsetY: (Math.random() - 0.5) * 40,
      size: 1.0 + Math.random() * 1.2,
      alpha: 1,
    }));

    let width = 0;
    let height = 0;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = width < 768;
      centerRef.current = {
        x: mobile ? width * 0.82 : Math.min(width - 260, width * 0.78),
        y: mobile ? 200 : 280,
      };
      radiusRef.current = mobile ? 80 : 130;

      const angle = angleRef.current;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (const p of particlesRef.current) {
        const x = p.sx * cos - p.sz * sin;
        const z = p.sx * sin + p.sz * cos;
        const scale = radiusRef.current * (1 + z * 0.22);
        if (p.px === 0 && p.py === 0) {
          p.px = centerRef.current.x + x * scale;
          p.py = centerRef.current.y + p.sy * scale;
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const getLocal = (e: PointerEvent): Point => {
      const rect = parent.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const morphTo = (targets: Point[]) => {
      if (targets.length === 0) return;
      // shuffle
      const t = targets.slice();
      for (let i = t.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [t[i], t[j]] = [t[j], t[i]];
      }
      const ps = particlesRef.current;
      // max delay in frames — particles build up one-by-one
      const maxDelay = 180;
      for (let i = 0; i < ps.length; i++) {
        const tp = t[i % t.length];
        ps[i].targetX = tp.x;
        ps[i].targetY = tp.y;
        ps[i].startX = ps[i].px;
        ps[i].startY = ps[i].py;
        ps[i].vx = 0;
        ps[i].vy = 0;
        // ease-out distribution: sparse at start, dense at end
        // u in [0,1], 1 - (1-u)^2 is ease-out
        const u = Math.random();
        ps[i].delay = (1 - (1 - u) * (1 - u)) * maxDelay;
      }
      stateRef.current = "shape";
      shapeTimerRef.current = 0;
    };

    const triggerShape = (points: Point[]) => {
      const cx = centerRef.current.x;
      const cy = centerRef.current.y;
      const shape = detectShape(points);

      if (shape === "O") {
        const pts = shapeRingO(320).map((p) => ({
          x: cx + p.x - 160,
          y: cy + p.y - 160,
        }));
        followUpRef.current = "cat";
        morphTo(pts);
        return;
      }

      if (shape === "N") {
        const font = "bold 160px Instrument Serif, serif";
        const w = 620;
        const h = 220;
        const pts = shapeText("Nanda", font, w, h, 4).map((p) => ({
          x: cx + p.x - w / 2,
          y: cy + p.y - h / 2,
        }));
        followUpRef.current = null;
        morphTo(pts);
        return;
      }

      // default Ryns
      const font = "bold 180px Instrument Serif, serif";
      const w = 540;
      const h = 230;
      const pts = shapeText("Ryns", font, w, h, 4).map((p) => ({
        x: cx + p.x - w / 2,
        y: cy + p.y - h / 2,
      }));
      followUpRef.current = null;
      morphTo(pts);
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drawingRef.current = true;
      const p = getLocal(e);
      drawingPointsRef.current = [p];
      pointerRef.current = p;
      pointerTrailRef.current = [p];
      stateRef.current = "follow";

      // prevent scroll/pan on touch
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        e.preventDefault();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        e.preventDefault();
      }
      const p = getLocal(e);
      pointerRef.current = p;
      const last = drawingPointsRef.current[drawingPointsRef.current.length - 1];
      if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 3) {
        drawingPointsRef.current.push(p);
      }
      // maintain a short trail for snake head positions
      pointerTrailRef.current.push(p);
      if (pointerTrailRef.current.length > 120) pointerTrailRef.current.shift();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      pointerRef.current = null;
      pointerTrailRef.current = [];
      const pts = drawingPointsRef.current;
      if (pts.length > 6) {
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const size = Math.max(
          Math.max(...xs) - Math.min(...xs),
          Math.max(...ys) - Math.min(...ys)
        );
        if (size > 30) {
          triggerShape(pts);
        } else {
          stateRef.current = "sphere";
        }
      } else {
        stateRef.current = "sphere";
      }
      drawingPointsRef.current = [];
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        e.preventDefault();
      }
    };

    parent.addEventListener("pointerdown", onPointerDown, { passive: false });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: false });
    window.addEventListener("pointercancel", onPointerUp, { passive: false });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (stateRef.current === "sphere") {
        angleRef.current += 0.0045;
        tiltRef.current = Math.sin(Date.now() * 0.0003) * 0.15;
      }

      const center = centerRef.current;
      const radius = radiusRef.current;
      const ang = angleRef.current;
      const tilt = tiltRef.current;
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const ps = particlesRef.current;

      for (const p of ps) {
        const x = p.sx * cosA - p.sz * sinA;
        const z = p.sx * sinA + p.sz * cosA;
        const y = p.sy;
        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        const scale = radius * (1 + z2 * 0.22);
        p.homeX = center.x + x * scale;
        p.homeY = center.y + y2 * scale;
        p.alpha = 0.22 + ((z2 + 1) / 2) * 0.78;
      }

      if (stateRef.current === "sphere") {
        for (const p of ps) {
          p.targetX = p.homeX;
          p.targetY = p.homeY;
        }
      } else if (stateRef.current === "follow") {
        // particles form a snake trail behind the pointer
        const trail = pointerTrailRef.current;
        if (trail.length > 0) {
          for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            // distribute along trail from head (latest) to tail (oldest)
            // older particles go further back in trail; use index mod trail length
            const trailIdx = Math.max(
              0,
              trail.length - 1 - Math.floor((i / ps.length) * trail.length)
            );
            const tp = trail[trailIdx];
            p.targetX = tp.x + p.trailOffsetX;
            p.targetY = tp.y + p.trailOffsetY;
          }
        }
      } else if (stateRef.current === "shape") {
        shapeTimerRef.current++;
        if (shapeTimerRef.current === 300 && followUpRef.current === "cat") {
          // transition O → cat
          const pts = shapeCat(340).map((p) => ({
            x: center.x + p.x - 170,
            y: center.y + p.y - 170,
          }));
          morphTo(pts);
          followUpRef.current = null;
          shapeTimerRef.current = 0;
          stateRef.current = "shape";
        } else if (shapeTimerRef.current > 380) {
          stateRef.current = "sphere";
        }
      }

      for (const p of ps) {
        if (stateRef.current === "shape") {
          const moveDuration = 45;
          const elapsed = shapeTimerRef.current - p.delay;
          if (elapsed <= 0) {
            // still waiting — stay at start position
            p.px = p.startX;
            p.py = p.startY;
          } else {
            const t = Math.min(elapsed / moveDuration, 1);
            // ease-out cubic: quick snap into place
            const eased = 1 - (1 - t) * (1 - t) * (1 - t);
            p.px = p.startX + (p.targetX - p.startX) * eased;
            p.py = p.startY + (p.targetY - p.startY) * eased;
          }
          p.vx = 0;
          p.vy = 0;
        } else {
          const dx = p.targetX - p.px;
          const dy = p.targetY - p.py;
          let k = 0.08;
          let damp = 0.72;
          if (stateRef.current === "follow") {
            k = 0.12;
            damp = 0.78;
          }
          p.vx = (p.vx + dx * k) * damp;
          p.vy = (p.vy + dy * k) * damp;
          p.px += p.vx;
          p.py += p.vy;
        }

        const a =
          stateRef.current === "shape"
            ? 0.95
            : stateRef.current === "follow"
              ? 0.85
              : p.alpha;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 72, 153, ${a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      parent.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [parentRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    />
  );
}
