"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Point = { x: number; y: number };
type Shape = "circle" | "star" | "triangle" | "line" | "square" | "rune";

type RuneInfo = {
  icon: string;
  name: string;
  flavor: string;
  color: string;
};

const RUNES: Record<Shape, RuneInfo> = {
  circle: { icon: "◯", name: "Cyclic Seal", flavor: "endless flow", color: "#ec4899" },
  star: { icon: "✦", name: "Stellar Array", flavor: "summons starlight", color: "#f59e0b" },
  triangle: { icon: "△", name: "Elemental Rune", flavor: "fire · earth · sky", color: "#8b5cf6" },
  square: { icon: "◻", name: "Warding Glyph", flavor: "defensive barrier", color: "#10b981" },
  line: { icon: "—", name: "Severance", flavor: "cuts through fate", color: "#06b6d4" },
  rune: { icon: "✧", name: "Unknown Sigil", flavor: "form uncertain", color: "#94a3b8" },
};

function recognize(pts: Point[]): Shape {
  if (pts.length < 8) return "line";

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const size = Math.max(w, h);

  if (size < 20) return "line";

  // path length
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }

  // closed check
  const dStartEnd = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y);
  const closed = dStartEnd < size * 0.35;

  // aspect
  const aspect = w / Math.max(h, 1);

  // straight line heuristic
  const diagonal = Math.hypot(w, h);
  if (!closed && len < diagonal * 1.4) return "line";

  // circularity via distance from center
  const dists = pts.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const avgDist = dists.reduce((a, b) => a + b, 0) / dists.length;
  const variance = dists.reduce((a, d) => a + Math.pow(d - avgDist, 2), 0) / dists.length;
  const stddev = Math.sqrt(variance);
  const circularity = stddev / avgDist;

  // count peaks in distance (star / n-gon points)
  const smooth: number[] = [];
  const window = 3;
  for (let i = 0; i < dists.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = -window; j <= window; j++) {
      const k = i + j;
      if (k >= 0 && k < dists.length) {
        sum += dists[k];
        count++;
      }
    }
    smooth.push(sum / count);
  }

  let peaks = 0;
  for (let i = 4; i < smooth.length - 4; i++) {
    if (
      smooth[i] > smooth[i - 3] &&
      smooth[i] > smooth[i + 3] &&
      smooth[i] > avgDist * 1.12
    ) {
      peaks++;
      i += 3;
    }
  }

  if (closed) {
    if (circularity < 0.18 && aspect > 0.7 && aspect < 1.4) return "circle";
    if (peaks >= 4) return "star";
    if (peaks === 3) return "triangle";
    if (aspect > 0.7 && aspect < 1.4 && circularity > 0.12 && circularity < 0.3) return "square";
    return "circle";
  }

  return "rune";
}

export function RuneCanvas({ parentRef }: { parentRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const drawingRef = useRef(false);
  const trailRef = useRef<{ x: number; y: number; life: number }[]>([]);
  const rafRef = useRef<number>(0);
  const [activeRune, setActiveRune] = useState<{ id: number; shape: Shape; x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const getLocalPoint = (e: PointerEvent): Point => {
      const rect = parent.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select")) return;
      if (e.button !== 0) return;
      drawingRef.current = true;
      pointsRef.current = [getLocalPoint(e)];
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = getLocalPoint(e);
      trailRef.current.push({ x: p.x, y: p.y, life: 1 });
      if (trailRef.current.length > 80) trailRef.current.shift();

      if (drawingRef.current) {
        const last = pointsRef.current[pointsRef.current.length - 1];
        if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 2) {
          pointsRef.current.push(p);
        }
      }
    };

    const onPointerUp = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      const pts = pointsRef.current;
      if (pts.length > 5) {
        const shape = recognize(pts);
        const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
        const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
        setActiveRune({ id: Date.now(), shape, x: cx, y: cy });
      }
      pointsRef.current = [];
    };

    parent.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ambient trail
      const trail = trailRef.current;
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        t.life *= 0.94;
        if (t.life < 0.02) continue;
        const radius = 1.5 + t.life * 4;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 72, 153, ${t.life * 0.4})`;
        ctx.fill();
      }
      trailRef.current = trail.filter((t) => t.life > 0.02);

      // active drawing
      const pts = pointsRef.current;
      if (pts.length > 1) {
        ctx.strokeStyle = "rgba(236, 72, 153, 0.85)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(236, 72, 153, 0.6)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
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

  useEffect(() => {
    if (!activeRune) return;
    const t = setTimeout(() => setActiveRune(null), 2400);
    return () => clearTimeout(t);
  }, [activeRune]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />
      <AnimatePresence>
        {activeRune && (
          <motion.div
            key={activeRune.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute z-0 flex flex-col items-center"
            style={{
              left: activeRune.x,
              top: activeRune.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.4, ease: "linear" }}
              className="font-serif text-6xl"
              style={{ color: RUNES[activeRune.shape].color, textShadow: `0 0 24px ${RUNES[activeRune.shape].color}` }}
            >
              {RUNES[activeRune.shape].icon}
            </motion.div>
            <div className="mt-2 text-center">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: RUNES[activeRune.shape].color }}>
                {RUNES[activeRune.shape].name}
              </div>
              <div className="font-serif text-xs italic text-muted">
                {RUNES[activeRune.shape].flavor}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
