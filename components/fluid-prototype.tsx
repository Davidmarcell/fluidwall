"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Mode } from "../lib/mobile-plan";

type Tool = "velocity" | "density" | "bounds";
type CameraState = "idle" | "requesting" | "active" | "denied";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  color: string;
};

type Props = {
  modes: Mode[];
};

const tools: Array<{ id: Tool; label: string; helper: string }> = [
  { id: "velocity", label: "Flow", helper: "Drag to push fluid" },
  { id: "density", label: "Ink", helper: "Paint density" },
  { id: "bounds", label: "Wall", helper: "Sketch a boundary" },
];

export function FluidPrototype({ modes }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spawnRef = useRef<(x: number, y: number, dx: number, dy: number) => void>(() => {});
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [activeModeId, setActiveModeId] = useState(modes[0]?.id ?? "flow");
  const [activeTool, setActiveTool] = useState<Tool>("velocity");
  const [isTouching, setIsTouching] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [lowPower, setLowPower] = useState(false);
  const [notice, setNotice] = useState("Plan mode: touch the canvas to test the mobile gesture layer.");

  const activeMode = useMemo(
    () => modes.find((mode) => mode.id === activeModeId) ?? modes[0],
    [activeModeId, modes],
  );

  useEffect(() => {
    setNotice(`${activeMode.name} mode selected. ${activeMode.mobilePattern}`);
    const timeout = window.setTimeout(
      () => setNotice("Plan mode: touch the canvas to test the mobile gesture layer."),
      2600,
    );

    return () => window.clearTimeout(timeout);
  }, [activeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let particles: Particle[] = [];
    const palette = activeMode.palette;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * pixelRatio);
      canvas.height = Math.floor(rect.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      particles = Array.from({ length: lowPower ? 22 : 42 }, (_, index) => ({
        x: rect.width * (0.18 + ((index * 37) % 61) / 100),
        y: rect.height * (0.18 + ((index * 29) % 59) / 100),
        vx: Math.sin(index) * 0.45,
        vy: Math.cos(index * 1.7) * 0.45,
        radius: 10 + ((index * 11) % 28),
        life: 0.4 + ((index * 13) % 55) / 100,
        color: palette[index % palette.length],
      }));
    };

    spawnRef.current = (x, y, dx, dy) => {
      const count = lowPower ? 5 : 10;
      for (let index = 0; index < count; index += 1) {
        const spread = activeTool === "bounds" ? 0.4 : 1.2;
        particles.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 18,
          vx: dx * 0.06 + (Math.random() - 0.5) * spread,
          vy: dy * 0.06 + (Math.random() - 0.5) * spread,
          radius: activeTool === "bounds" ? 9 : 16 + Math.random() * 22,
          life: activeTool === "density" ? 1 : 0.74,
          color: activeTool === "bounds" ? "#f8fafc" : palette[index % palette.length],
        });
      }
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);

      const background = context.createLinearGradient(0, 0, rect.width, rect.height);
      background.addColorStop(0, activeMode.id === "gallery" ? "#f8fafc" : "#06111f");
      background.addColorStop(1, activeMode.id === "gallery" ? "#e2e8f0" : "#12091f");
      context.fillStyle = background;
      context.fillRect(0, 0, rect.width, rect.height);

      particles = particles
        .map((particle) => {
          const next = {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.992,
            vy: particle.vy * 0.992,
            life: particle.life * 0.992,
          };

          if (next.x < -40) next.x = rect.width + 40;
          if (next.x > rect.width + 40) next.x = -40;
          if (next.y < -40) next.y = rect.height + 40;
          if (next.y > rect.height + 40) next.y = -40;

          return next;
        })
        .filter((particle) => particle.life > 0.08)
        .slice(-140);

      particles.forEach((particle) => {
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius,
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "rgba(3, 7, 18, 0)");
        context.globalAlpha = Math.min(0.72, particle.life);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (activeMode.id === "vectors") {
        context.globalAlpha = 0.46;
        context.strokeStyle = "#d9ff85";
        for (let x = 24; x < rect.width; x += 34) {
          for (let y = 34; y < rect.height; y += 42) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + Math.sin((x + y) / 40) * 12, y + Math.cos((x - y) / 35) * 12);
            context.stroke();
          }
        }
      }

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      spawnRef.current = () => {};
    };
  }, [activeMode, activeTool, lowPower]);

  const emitFromPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const lastPoint = lastPointRef.current ?? point;
    spawnRef.current(point.x, point.y, point.x - lastPoint.x, point.y - lastPoint.y);
    lastPointRef.current = point;
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsTouching(true);
    setNotice(`${tools.find((tool) => tool.id === activeTool)?.helper}.`);
    emitFromPointer(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    lastPointRef.current = null;
    setIsTouching(false);
  };

  const requestCamera = async () => {
    setCameraState("requesting");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("denied");
      setNotice("Camera APIs are unavailable here, so the touch-only fallback remains active.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((track) => track.stop());
      setCameraState("active");
      setNotice("Camera state approved. The next build step can wire frames into the solver.");
    } catch {
      setCameraState("denied");
      setNotice("Camera denied. Touch-only mode remains the supported fallback state.");
    }
  };

  return (
    <section className="prototype" aria-labelledby="prototype-title">
      <div className="section-heading">
        <p className="eyebrow">Interactive plan mode</p>
        <h2 id="prototype-title">Mobile shell, gestures, and states</h2>
        <p>
          This prototype translates Fluid Wall&apos;s desktop controls into the mobile interaction model
          that can evolve into the production solver port.
        </p>
      </div>

      <div className="phone-and-panel">
        <div className="phone" aria-label="Mobile prototype preview">
          <div className="phone-status">
            <span>Fluid Wall</span>
            <span>{lowPower ? "30 FPS" : "60 FPS"}</span>
          </div>
          <canvas
            ref={canvasRef}
            className="fluid-canvas"
            aria-label="Touch fluid prototype canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={(event) => {
              if (isTouching) emitFromPointer(event);
            }}
            onPointerCancel={handlePointerUp}
            onPointerUp={handlePointerUp}
          />
          <div className={`touch-state ${isTouching ? "is-active" : ""}`}>
            {isTouching ? "Touch active" : "Ready for touch"}
          </div>
          <div className="notice">{notice}</div>
          <div className="mode-strip" role="tablist" aria-label="Fluid display modes">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={mode.id === activeMode.id ? "is-selected" : ""}
                type="button"
                role="tab"
                aria-selected={mode.id === activeMode.id}
                onClick={() => setActiveModeId(mode.id)}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-panel">
          <div className="control-card">
            <h3>Thumb tools</h3>
            <div className="tool-grid">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  className={tool.id === activeTool ? "is-selected" : ""}
                  type="button"
                  onClick={() => {
                    setActiveTool(tool.id);
                    setNotice(`${tool.label} tool selected. ${tool.helper}.`);
                  }}
                >
                  <span>{tool.label}</span>
                  <small>{tool.helper}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="control-card">
            <h3>Runtime states</h3>
            <button className="state-row" type="button" onClick={() => setLowPower((value) => !value)}>
              <span>
                <strong>Low power</strong>
                <small>Lower particle count and pixel ratio.</small>
              </span>
              <b>{lowPower ? "On" : "Off"}</b>
            </button>
            <button className="state-row" type="button" onClick={requestCamera}>
              <span>
                <strong>Camera input</strong>
                <small>Permission path for Kinect replacement.</small>
              </span>
              <b>{cameraState}</b>
            </button>
          </div>

          <div className="control-card selected-mode">
            <h3>{activeMode.name} mode</h3>
            <p>{activeMode.summary}</p>
            <dl>
              <div>
                <dt>Native</dt>
                <dd>{activeMode.nativeControl}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{activeMode.mobilePattern}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
