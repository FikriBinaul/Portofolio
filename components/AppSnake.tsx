"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 20;
const ROWS = 14;
const CELL = 20;
const BEST_KEY = "fbu-snake-best";

type Status = "idle" | "playing" | "paused" | "over";
interface Pt {
  x: number;
  y: number;
}

/** Snake minigame — arrows/WASD to move, Space to pause, click canvas to start. */
export default function AppSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Pt[]>([]);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const queueRef = useRef<Pt[]>([]);
  const foodRef = useRef<Pt>({ x: 6, y: 6 });
  const scoreRef = useRef(0);
  const statusRef = useRef<Status>("idle");
  const loopRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0e0a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL + 0.5, 0);
      ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL + 0.5);
      ctx.lineTo(COLS * CELL, y * CELL + 0.5);
      ctx.stroke();
    }
    // food — pulsing berry
    const pulse = 0.65 + 0.35 * Math.sin(Date.now() / 200);
    ctx.fillStyle = `rgba(255,107,74,${pulse})`;
    ctx.beginPath();
    ctx.arc(foodRef.current.x * CELL + CELL / 2, foodRef.current.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    // snake
    snakeRef.current.forEach((s, i) => {
      const t = i / snakeRef.current.length;
      ctx.fillStyle = i === 0 ? "#32D74B" : `rgba(50,215,75,${0.9 - t * 0.55})`;
      const r = 3;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, r);
      ctx.fill();
    });
    // eyes on head
    const h = snakeRef.current[0];
    if (h && statusRef.current === "playing") {
      ctx.fillStyle = "#0a0e0a";
      const ex = dirRef.current.x !== 0 ? dirRef.current.x * 3 : 3;
      const ey = dirRef.current.y !== 0 ? dirRef.current.y * 3 : 0;
      ctx.beginPath();
      ctx.arc(h.x * CELL + CELL / 2 - ex + 3, h.y * CELL + CELL / 2 - ey - 3, 2, 0, Math.PI * 2);
      ctx.arc(h.x * CELL + CELL / 2 - ex - 3, h.y * CELL + CELL / 2 - ey - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [
      { x: 4, y: 7 },
      { x: 3, y: 7 },
      { x: 2, y: 7 },
    ];
    dirRef.current = { x: 1, y: 0 };
    queueRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    foodRef.current = { x: 12, y: 7 };
    draw();
  }, [draw]);

  const spawnFood = useCallback(() => {
    const occupied = new Set(snakeRef.current.map((s) => `${s.x},${s.y}`));
    let p: Pt = { x: 5, y: 5 };
    let guard = 0;
    do {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      guard++;
    } while (occupied.has(`${p.x},${p.y}`) && guard < 200);
    foodRef.current = p;
  }, []);

  const step = useCallback(() => {
    const s = statusRef.current;
    if (s !== "playing") return;
    const next = queueRef.current.shift() ?? dirRef.current;
    const head = snakeRef.current[0];
    const nx = head.x + next.x;
    const ny = head.y + next.y;
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return endGame();
    if (snakeRef.current.some((seg) => seg.x === nx && seg.y === ny)) return endGame();

    snakeRef.current.unshift({ x: nx, y: ny });
    if (nx === foodRef.current.x && ny === foodRef.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      spawnFood();
    } else {
      snakeRef.current.pop();
    }
    dirRef.current = next;
    draw();
  }, [spawnFood, draw]);

  const endGame = useCallback(() => {
    statusRef.current = "over";
    setStatus("over");
    if (loopRef.current !== null) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
    setBest((b) => {
      const nb = Math.max(b, scoreRef.current);
      try {
        localStorage.setItem(BEST_KEY, String(nb));
      } catch {
        /* ignore */
      }
      return nb;
    });
    draw();
  }, [draw]);

  const start = useCallback(() => {
    reset();
    statusRef.current = "playing";
    setStatus("playing");
    canvasRef.current?.focus();
    if (loopRef.current !== null) clearInterval(loopRef.current);
    const speed = () => Math.max(70, 150 - scoreRef.current * 3);
    const tick = () => {
      step();
      loopRef.current = window.setTimeout(tick, speed());
    };
    loopRef.current = window.setTimeout(tick, speed());
  }, [reset, step]);

  useEffect(() => {
    reset();
    return () => {
      if (loopRef.current !== null) clearInterval(loopRef.current);
    };
  }, [reset]);

  const onKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const map: Record<string, Pt> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (map[k]) {
      e.preventDefault();
      const cur = dirRef.current;
      const nxt = map[k];
      if (nxt.x !== -cur.x || nxt.y !== -cur.y) {
        queueRef.current.push(nxt);
        if (queueRef.current.length > 2) queueRef.current.shift();
      }
    } else if (k === " " || e.key === " ") {
      e.preventDefault();
      if (statusRef.current === "playing") {
        statusRef.current = "paused";
        setStatus("paused");
      } else if (statusRef.current === "paused") {
        statusRef.current = "playing";
        setStatus("playing");
      }
    } else if (e.key === "Enter" && statusRef.current === "over") {
      start();
    }
  };

  return (
    <div className="app-snake">
      <div className="snake-hud">
        <div className="snake-stat">
          SCORE <b>{score}</b>
        </div>
        <div className="snake-stat">
          BEST <b>{best}</b>
        </div>
        <div className="snake-status">{status.toUpperCase()}</div>
      </div>
      <div className="snake-frame">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          tabIndex={0}
          onKeyDown={onKey}
          onClick={() => {
            canvasRef.current?.focus();
            if (statusRef.current === "idle") start();
          }}
          aria-label="Snake game — arrows or WASD to move, Space to pause"
        />
        {status === "idle" && (
          <div className="snake-overlay">
            <div className="snake-overlay-title">SNAKE</div>
            <p>Eat. Grow. Don't hit the wall.</p>
            <button className="btn btn-fill" onClick={start}>
              ▶ Start Game
            </button>
            <p className="snake-hint">arrows / WASD · space = pause</p>
          </div>
        )}
        {status === "over" && (
          <div className="snake-overlay">
            <div className="snake-overlay-title">GAME OVER</div>
            <p>
              Score <b>{score}</b> · Best <b>{best}</b>
            </p>
            <button className="btn btn-fill" onClick={start}>
              ↻ Play Again
            </button>
          </div>
        )}
        {status === "paused" && (
          <div className="snake-overlay thin">
            <div className="snake-overlay-title">PAUSED</div>
            <p>press space to resume</p>
          </div>
        )}
      </div>
      <div className="snake-legend">click the grid to focus it, then play with the keyboard</div>
    </div>
  );
}