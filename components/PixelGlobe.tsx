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
  size: number;
  alpha: number;
};

type Point = { x: number; y: number };
type Mode = "sphere" | "shape";

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

function sampleText(
  text: string,
  font: string,
  w: number,
  h: number,
  step = 4
): Point[] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#000";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const out: Point[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 128) out.push({ x, y });
    }
  }
  return out;
}

function isClosedLoop(pts: Point[]) {
  if (pts.length < 10) return false;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  if (size < 50) return false;
  const d = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y);
  return d < size * 0.45;
}

export function PixelGlobe({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef<Mode>("sphere");
  const drawingRef = useRef(false);
  const drawingPointsRef = useRef<Point[]>([]);
  const angleRef = useRef(0);
  const tiltRef = useRef(0);
  const shapeTimerRef = useRef(0);
  const centerRef = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(80);
  const rafRef = useRef(0);
  const explodeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 480;
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
      size: 1.0 + Math.random() * 1.0,
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
        x: mobile ? width * 0.82 : Math.min(width - 220, width * 0.78),
        y: mobile ? 180 : 260,
      };
      radiusRef.current = mobile ? 55 : 95;

      // init particles to sphere positions
      const angle = angleRef.current;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (const p of particlesRef.current) {
        const x = p.sx * cos - p.sz * sin;
        const z = p.sx * sin + p.sz * cos;
        const scale = radiusRef.current * (1 + z * 0.2);
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

    const distToSphere = (p: Point) => {
      return Math.hypot(p.x - centerRef.current.x, p.y - centerRef.current.y);
    };

    const triggerShape = (points: Point[]) => {
      const cx = centerRef.current.x;
      const cy = centerRef.current.y;
      let targets: Point[] = [];
      let font = "bold 140px Instrument Serif, serif";
      let text = "Ryns";
      let w = 500;
      let h = 200;

      if (isClosedLoop(points)) {
        text = "O";
        font = "bold 220px Instrument Serif, serif";
        w = 300;
        h = 300;
      }

      targets = sampleText(text, font, w, h, 5).map((p) => ({
        x: cx + p.x - w / 2,
        y: cy + p.y - h / 2,
      }));

      if (targets.length === 0) return;

      // shuffle for organic morph
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const t = targets[i % targets.length];
        ps[i].targetX = t.x;
        ps[i].targetY = t.y;
      }
      stateRef.current = "shape";
      shapeTimerRef.current = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select")) return;
      if (e.button !== 0) return;
      drawingRef.current = true;
      drawingPointsRef.current = [getLocal(e)];

      // if click started near sphere, explode briefly
      if (distToSphere(drawingPointsRef.current[0]) < radiusRef.current * 1.2) {
        explodeRef.current = 1;
        for (const p of particlesRef.current) {
          const dx = p.px - centerRef.current.x;
          const dy = p.py - centerRef.current.y;
          const d = Math.hypot(dx, dy) || 1;
          p.vx += (dx / d) * (4 + Math.random() * 3);
          p.vy += (dy / d) * (4 + Math.random() * 3);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const p = getLocal(e);
      const last = drawingPointsRef.current[drawingPointsRef.current.length - 1];
      if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 3) {
        drawingPointsRef.current.push(p);
      }
    };

    const onPointerUp = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      const pts = drawingPointsRef.current;
      if (pts.length > 6) {
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const size = Math.max(
          Math.max(...xs) - Math.min(...xs),
          Math.max(...ys) - Math.min(...ys)
        );
        if (size > 30) triggerShape(pts);
      }
      drawingPointsRef.current = [];
    };

    parent.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

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

      // compute sphere projections (homeX/Y)
      for (const p of ps) {
        let x = p.sx * cosA - p.sz * sinA;
        let z = p.sx * sinA + p.sz * cosA;
        let y = p.sy;
        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        const scale = radius * (1 + z2 * 0.25);
        p.homeX = center.x + x * scale;
        p.homeY = center.y + y2 * scale;
        p.alpha = 0.2 + ((z2 + 1) / 2) * 0.8;
      }

      if (stateRef.current === "sphere") {
        for (const p of ps) {
          p.targetX = p.homeX;
          p.targetY = p.homeY;
        }
      } else if (stateRef.current === "shape") {
        shapeTimerRef.current++;
        if (shapeTimerRef.current > 200) {
          stateRef.current = "sphere";
        }
      }

      if (explodeRef.current > 0) {
        explodeRef.current *= 0.85;
        if (explodeRef.current < 0.02) explodeRef.current = 0;
      }

      // integrate and draw
      for (const p of ps) {
        const dx = p.targetX - p.px;
        const dy = p.targetY - p.py;
        const k = stateRef.current === "shape" ? 0.06 : 0.08;
        const damp = stateRef.current === "shape" ? 0.82 : 0.72;
        p.vx = (p.vx + dx * k) * damp;
        p.vy = (p.vy + dy * k) * damp;
        p.px += p.vx;
        p.py += p.vy;

        const a = stateRef.current === "shape" ? 0.95 : p.alpha;
        const color = stateRef.current === "shape" ? "236, 72, 153" : "236, 72, 153";
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${a})`;
        ctx.fill();
      }

      // draw active trail
      const path = drawingPointsRef.current;
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.strokeStyle = "rgba(236, 72, 153, 0.55)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(236, 72, 153, 0.4)";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
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
