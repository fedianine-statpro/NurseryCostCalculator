import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/wish-magic.css";

interface WishMagicProps {
  onAwaken?: () => void;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

function FairySilhouette() {
  return (
    <svg
      className="wish-fairy-drawing"
      viewBox="0 0 160 190"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wish-wing" x2="1" y2="1">
          <stop stopColor="#fffce9" stopOpacity=".95" />
          <stop offset=".55" stopColor="#c2eaf4" stopOpacity=".5" />
          <stop offset="1" stopColor="#d5c4ff" stopOpacity=".15" />
        </linearGradient>
        <linearGradient id="wish-dress" x2=".8" y2="1">
          <stop stopColor="#fff8cf" />
          <stop offset="1" stopColor="#c4d9d3" />
        </linearGradient>
      </defs>
      <g
        className="wish-fairy-wing wish-fairy-wing-left"
        fill="url(#wish-wing)"
        stroke="#fffbe3"
        strokeWidth=".8"
      >
        <path d="M80 89C55 21 5 18 16 61C20 79 44 89 80 89Z" />
        <path d="M76 91C29 72 12 105 34 112C52 118 69 102 76 91Z" />
        <path
          d="M76 85L27 42M70 89L23 62M72 94L38 103"
          fill="none"
          opacity=".6"
        />
      </g>
      <g
        className="wish-fairy-wing wish-fairy-wing-right"
        fill="url(#wish-wing)"
        stroke="#fffbe3"
        strokeWidth=".8"
      >
        <path d="M82 89C106 21 155 18 144 61C140 79 116 89 82 89Z" />
        <path d="M86 91C131 72 148 105 126 112C108 118 92 102 86 91Z" />
        <path
          d="M87 85L133 42M92 89L137 62M91 94L122 103"
          fill="none"
          opacity=".6"
        />
      </g>
      <path
        d="M77 137L67 163L63 176M85 136L94 160L101 169"
        fill="none"
        stroke="#f4d5ad"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M74 85Q80 80 87 85L90 108Q98 121 106 139Q80 153 54 138L72 106Z"
        fill="url(#wish-dress)"
      />
      <path
        d="M74 106Q84 111 89 106M69 121Q80 128 96 122M62 136Q81 140 101 136"
        fill="none"
        stroke="#9caa8c"
        strokeWidth=".8"
        opacity=".8"
      />
      <path
        d="M73 88L57 105L46 99M88 88L104 77L116 62"
        fill="none"
        stroke="#f4d5ad"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="81" cy="69" rx="11" ry="15" fill="#f5d7b3" />
      <path
        d="M68 70Q62 51 80 50Q101 50 95 78L88 73L90 61Q78 63 72 58L72 77Z"
        fill="#e0b871"
      />
      <path d="M71 56L74 47L80 52L87 45L91 55" fill="#fff2b0" />
      <path d="M112 69L128 43" stroke="#f5dc96" strokeWidth="2" />
      <path
        d="M128 32L131 40L139 43L131 46L128 54L125 46L117 43L125 40Z"
        fill="#fff8cf"
      />
      <circle cx="79" cy="68" r=".8" fill="#6c625b" />
      <path
        d="M82 75Q85 77 87 74"
        stroke="#b87d76"
        strokeWidth=".8"
        fill="none"
      />
    </svg>
  );
}

export default function WishMagic({ onAwaken }: WishMagicProps) {
  const [active, setActive] = useState(false);
  const [hasWished, setHasWished] = useState(false);
  const [fairyLoaded, setFairyLoaded] = useState(false);
  const [status, setStatus] = useState("");
  const button = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fairy = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const callback = useRef(onAwaken);
  callback.current = onAwaken;
  const startPoint = useRef({ x: 0, y: 0 });
  const completed = useRef(false);
  const reduced = useRef(false);
  const finish = useCallback(() => {
    if (!completed.current) {
      completed.current = true;
      callback.current?.();
    }
    setActive(false);
    setHasWished(true);
    setStatus("Your wish is on its way.");
  }, []);

  function makeWish() {
    if (active) return;
    const bounds = button.current?.getBoundingClientRect();
    startPoint.current = {
      x: bounds ? bounds.left + bounds.width / 2 : innerWidth / 2,
      y: bounds ? bounds.top + bounds.height / 2 : innerHeight / 2,
    };
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    completed.current = false;
    setStatus("");
    setActive(true);
  }

  useEffect(() => {
    if (!active) return;
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) {
      finish();
      return;
    }
    let width = innerWidth,
      height = innerHeight;
    let frame = 0,
      previous = 0;
    const particles: Spark[] = [];
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      element.width = width * dpr;
      element.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    document.body.classList.add("wish-is-flying");
    const duration = reduced.current ? 2100 : 8500;
    const started = performance.now();
    let burst = false;
    const emit = (x: number, y: number, count: number, explosive = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = explosive
          ? 1 + Math.random() * 3.6
          : 0.25 + Math.random() * 1.2;
        const life = explosive
          ? 48 + Math.random() * 55
          : 22 + Math.random() * 25;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          size: 0.6 + Math.random() * (explosive ? 2.4 : 1.8),
          hue: 39 + Math.random() * 17,
        });
      }
      if (particles.length > 210) particles.splice(0, particles.length - 210);
    };
    const star = (x: number, y: number, scale: number, angle: number) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      const glow = context.createRadialGradient(0, 0, 0, 0, 0, scale * 4.8);
      glow.addColorStop(0, "#fff6c6bb");
      glow.addColorStop(0.23, "#ffce6455");
      glow.addColorStop(1, "#ffce6400");
      context.fillStyle = glow;
      context.fillRect(-scale * 5, -scale * 5, scale * 10, scale * 10);
      context.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * i) / 4 - Math.PI / 2;
        const r = i % 2 ? scale * 0.3 : scale;
        if (i === 0) context.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else context.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      context.closePath();
      context.fillStyle = "#fffbe8";
      context.fill();
      context.restore();
    };
    const draw = (now: number) => {
      const elapsed = now - started;
      const t = Math.min(elapsed / duration, 1);
      const dt = Math.min((now - (previous || now)) / 16.667, 2);
      previous = now;
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.5;
      const centerY = Math.min(height * 0.42, 340);
      let x: number, y: number;
      if (reduced.current) {
        x = centerX;
        y = centerY;
      } else if (t < 0.25) {
        const a = t / 0.25;
        const ease = 1 - Math.pow(1 - a, 2);
        x = startPoint.current.x + (width * 0.78 - startPoint.current.x) * ease;
        y =
          startPoint.current.y +
          (height * 0.19 - startPoint.current.y) * ease -
          Math.sin(a * Math.PI) * 95;
      } else if (t < 0.64) {
        const a = (t - 0.25) / 0.39;
        x =
          width * 0.78 +
          (centerX - width * 0.78) * a +
          Math.sin(a * Math.PI * 2) * width * 0.18;
        y =
          height * 0.19 +
          (centerY - height * 0.19) * a -
          Math.sin(a * Math.PI * 2) * Math.min(height * 0.12, 100);
      } else {
        const a = Math.min((t - 0.64) / 0.36, 1);
        x = centerX - Math.sin(a * Math.PI) * width * 0.12;
        y = centerY - a * (centerY + 90);
      }
      context.globalCompositeOperation = "lighter";
      if (t < 0.84 && !reduced.current) emit(x, y, 3);
      if (!burst && t > (reduced.current ? 0.15 : 0.59)) {
        burst = true;
        emit(centerX, centerY, reduced.current ? 26 : 115, true);
        if (!completed.current) {
          completed.current = true;
          callback.current?.();
        }
        document.body.classList.add("wish-woodland-awake");
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.018 * dt;
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = Math.min(1, (p.life / p.maxLife) * 1.7);
        context.globalAlpha = alpha;
        context.fillStyle = `hsl(${p.hue} 95% 78%)`;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
        if (p.size > 1.8) {
          context.globalAlpha = alpha * 0.5;
          context.fillRect(p.x - p.size * 2, p.y - 0.4, p.size * 4, 0.8);
          context.fillRect(p.x - 0.4, p.y - p.size * 2, 0.8, p.size * 4);
        }
      }
      context.globalAlpha = t > 0.87 ? Math.max(0, (1 - t) / 0.13) : 1;
      if (!reduced.current || t < 0.7)
        star(x, y, reduced.current ? 19 : 13 + Math.sin(t * 24) * 2, t * 3);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      if (fairy.current) {
        const a = reduced.current
          ? 0.5
          : Math.max(0, Math.min(1, (t - 0.21) / 0.45));
        const fairyX = reduced.current
          ? centerX
          : width + 90 + (centerX - width - 90) * (1 - Math.pow(1 - a, 2));
        const fairyY = reduced.current
          ? centerY
          : height * 0.22 + Math.sin(a * Math.PI * 2) * 50 + a * 45;
        const opacity =
          t < 0.22
            ? 0
            : t > 0.77
              ? Math.max(0, (1 - t) / 0.23)
              : Math.min(1, (t - 0.22) / 0.1);
        fairy.current.style.transform = `translate3d(${fairyX}px,${fairyY}px,0) translate(-50%,-50%) rotate(${reduced.current ? 0 : Math.sin(a * Math.PI * 2) * 12}deg)`;
        fairy.current.style.opacity = String(opacity);
      }
      if (ring.current) {
        const a = Math.max(0, Math.min(1, (t - 0.57) / 0.32));
        ring.current.style.transform = `translate(-50%,-50%) scale(${reduced.current ? 1 : 0.2 + a * 2.5})`;
        ring.current.style.opacity = String(a > 0 ? (1 - a) * 0.75 : 0);
      }
      if (t >= 1) {
        finish();
        return;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", escape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", escape);
      document.body.classList.remove("wish-is-flying");
      document.body.classList.remove("wish-woodland-awake");
    };
  }, [active, finish]);

  return (
    <div className="wish-magic">
      <button
        ref={button}
        className={`wish-magic-button${active ? " is-casting" : ""}`}
        type="button"
        aria-label={hasWished ? "Make another wish" : "Make a wish"}
        disabled={active}
        onClick={makeWish}
      >
        <span className="wish-magic-orbit" aria-hidden="true" />
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <defs>
            <linearGradient id="wish-button-star" x2=".7" y2="1">
              <stop stopColor="#fffceb" />
              <stop offset=".5" stopColor="#ffe5a2" />
              <stop offset="1" stopColor="#bd873b" />
            </linearGradient>
          </defs>
          <path
            d="M40 7L47 29L69 40L47 47L40 73L32 48L10 40L32 31Z"
            fill="url(#wish-button-star)"
          />
          <path d="M40 15V40L18 40L35 35Z" fill="#fffcec" opacity=".9" />
        </svg>
        <span className="wish-magic-label">
          {hasWished ? "Make another wish" : "Make a wish"}
        </span>
      </button>
      <p className="wish-magic-status" role="status" aria-live="polite">
        {status}
      </p>
      {active && (
        <button className="wish-magic-finish" type="button" onClick={finish}>
          Skip
        </button>
      )}
      {active &&
        createPortal(
          <div
            className={`wish-magic-sky${reduced.current ? " wish-magic-reduced" : ""}`}
            aria-hidden="true"
          >
            <div className="wish-magic-wash" />
            <canvas ref={canvas} className="wish-magic-canvas" />
            <div className="wish-magic-ring" ref={ring} />
            <div className="wish-fairy" ref={fairy}>
              <div className="wish-fairy-aura" />
              {!fairyLoaded && <FairySilhouette />}
              <img
                className={
                  fairyLoaded
                    ? "wish-fairy-image is-loaded"
                    : "wish-fairy-image"
                }
                src={
                  import.meta.env.BASE_URL +
                  (reduced.current
                    ? "images/world/winter-fairy-rest.webp"
                    : "images/world/winter-fairy-flying.gif")
                }
                alt=""
                onLoad={() => setFairyLoaded(true)}
                onError={() => setFairyLoaded(false)}
              />
              <span className="wish-fairy-dust wish-fairy-dust-one">✦</span>
              <span className="wish-fairy-dust wish-fairy-dust-two">✧</span>
              <span className="wish-fairy-dust wish-fairy-dust-three">✦</span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
