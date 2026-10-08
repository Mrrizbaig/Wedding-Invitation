import React, { useRef, useEffect, useCallback } from 'react';
import { random, clamp } from '../lib/utils';

interface PetalSystemProps {
  burst: boolean;
  onBurstEnd: () => void;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  depth: number;
  color: string;
}

const PETAL_COLORS = [
  '#9D5A60',
  '#C9B89A',
  '#E8DDD0',
  '#C9A45C',
  '#B8876A',
];

function createPetal(
    w: number,
    h: number,
    top = false,
): Petal {
  const depth = random(0.15, 1);

  return {
    x: random(0, w),
    y: top
        ? random(-h * 0.3, 0)
        : random(0, h),

    vx:
        (random(0, 1) > 0.5 ? 1 : -1) *
        random(0.08, 0.35),

    vy:
        random(0.28, 0.85) *
        (0.65 + depth * 0.45),

    rotation: random(0, Math.PI * 2),

    rotationSpeed:
        (random(0, 1) > 0.5 ? 1 : -1) *
        random(0.003, 0.012),

    size:
        random(6, 13) *
        (0.65 + depth * 0.55),

    opacity:
        random(0.12, 0.38) *
        (0.5 + depth * 0.5),

    depth,

    color:
        PETAL_COLORS[
            Math.floor(
                random(0, PETAL_COLORS.length - 0.01),
            )
            ],
  };
}

export default function PetalSystem({
                                      burst,
                                      onBurstEnd,
                                    }: PetalSystemProps) {
  const canvasRef =
      useRef<HTMLCanvasElement>(null);

  const petalsRef =
      useRef<Petal[]>([]);

  const frameRef =
      useRef<number | null>(null);

  const burstRef =
      useRef(false);

  const lastFrameTimeRef =
      useRef(0);

  const timerRef =
      useRef<ReturnType<typeof setTimeout> | null>(
          null,
      );

  const visibleRef =
      useRef(true);

  const init = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const count =
        window.innerWidth < 768
            ? 16
            : 28;

    petalsRef.current = Array.from(
        { length: count },
        () =>
            createPetal(
                canvas.width,
                canvas.height,
            ),
    );
  }, []);

  /*
   * ------------------------------------------------------------
   * BURST STATE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!burst || burstRef.current) {
      return;
    }

    burstRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      burstRef.current = false;
      onBurstEnd();
    }, 650);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [burst, onBurstEnd]);

  /*
   * ------------------------------------------------------------
   * CANVAS + ANIMATION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const reducedMotion = window
        .matchMedia(
            '(prefers-reduced-motion: reduce)',
        )
        .matches;

    const touchDevice =
        window.matchMedia(
            '(pointer: coarse)',
        ).matches;

    /*
     * Desktop:
     *   ~60 FPS
     *
     * Touch devices:
     *   ~30 FPS
     *
     * The petals are intentionally subtle, so
     * 30 FPS is visually sufficient while cutting
     * the canvas workload significantly.
     */
    const targetFrameTime =
        touchDevice ? 1000 / 30 : 1000 / 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      init();
    };

    resize();

    window.addEventListener(
        'resize',
        resize,
        { passive: true },
    );

    const handleVisibilityChange = () => {
      visibleRef.current =
          document.visibilityState === 'visible';

      /*
       * Reset timing when returning to the page.
       * This prevents a huge delta after Safari
       * suspends the page.
       */
      lastFrameTimeRef.current = 0;
    };

    document.addEventListener(
        'visibilitychange',
        handleVisibilityChange,
    );

    if (reducedMotion) {
      return () => {
        window.removeEventListener(
            'resize',
            resize,
        );

        document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
        );
      };
    }

    const ctx =
        canvas.getContext('2d', {
          alpha: true,
        });

    if (!ctx) {
      return;
    }

    const draw = (time: number) => {
      if (!visibleRef.current) {
        frameRef.current =
            requestAnimationFrame(draw);

        return;
      }

      /*
       * Frame-rate limiter.
       */
      const previous =
          lastFrameTimeRef.current;

      if (
          previous !== 0 &&
          time - previous < targetFrameTime
      ) {
        frameRef.current =
            requestAnimationFrame(draw);

        return;
      }

      lastFrameTimeRef.current = time;

      /*
       * Normalize movement around 60 FPS.
       *
       * At 30 FPS the petals move twice as much
       * per rendered frame, preserving their
       * apparent speed.
       */
      const deltaScale =
          previous === 0
              ? 1
              : Math.min(
                  (time - previous) / 16.67,
                  2,
              );

      ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height,
      );

      const bursting =
          burstRef.current;

      const movementMultiplier =
          bursting ? 2.2 : 1;

      const opacityMultiplier =
          bursting ? 1.25 : 1;

      for (const p of petalsRef.current) {
        /*
         * Draw petal.
         */
        ctx.setTransform(
            1,
            0,
            0,
            1,
            p.x,
            p.y,
        );

        ctx.rotate(p.rotation);

        ctx.globalAlpha = clamp(
            p.opacity *
            opacityMultiplier,
            0,
            1,
        );

        ctx.fillStyle = p.color;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            p.size * 0.55,
            p.size * 0.28,
            0,
            0,
            Math.PI * 2,
        );

        ctx.fill();

        /*
         * Movement.
         */
        p.x +=
            (
                p.vx +
                Math.sin(p.y * 0.012) *
                0.08
            ) *
            movementMultiplier *
            deltaScale;

        p.y +=
            p.vy *
            movementMultiplier *
            deltaScale;

        p.rotation +=
            p.rotationSpeed *
            movementMultiplier *
            deltaScale;

        /*
         * Recycle.
         */
        if (
            p.y >
            canvas.height + 24
        ) {
          Object.assign(
              p,
              createPetal(
                  canvas.width,
                  canvas.height,
                  true,
              ),
          );

          p.y = -16;
        }

        if (p.x < -24) {
          p.x =
              canvas.width + 12;
        }

        if (
            p.x >
            canvas.width + 24
        ) {
          p.x = -12;
        }
      }

      /*
       * Restore normal canvas transform.
       */
      ctx.setTransform(
          1,
          0,
          0,
          1,
          0,
          0,
      );

      ctx.globalAlpha = 1;

      frameRef.current =
          requestAnimationFrame(draw);
    };

    frameRef.current =
        requestAnimationFrame(draw);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(
            frameRef.current,
        );
      }

      window.removeEventListener(
          'resize',
          resize,
      );

      document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
      );

      if (timerRef.current) {
        clearTimeout(
            timerRef.current,
        );
      }
    };
  }, [init]);

  return (
      <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 40,
          }}
          aria-hidden="true"
      />
  );
}