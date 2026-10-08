import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';
import { EASING, DURATION, SCROLL, safeDuration } from '../animations/tokens';
import VenueSection from './VenueSection';

gsap.registerPlugin(ScrollTrigger);

interface ScratchCardProps {
  onRevealed?: () => void;
}

export default function ScratchCard({ onRevealed }: ScratchCardProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bottomCanvasRef = useRef<HTMLCanvasElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const revealedRef = useRef(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const CARD_WIDTH = 320;
  const CARD_HEIGHT = 192;

  const drawContent = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#FDFAF4';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(201,164,92,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = 'rgba(201,164,92,0.25)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = '#5A1822';
    ctx.font = `500 ${Math.round(w * 0.055)}px 'Cinzel', serif`;
    ctx.textAlign = 'center';
    ctx.fillText('AQD-E-NIKAH', w / 2, h * 0.22);

    ctx.strokeStyle = '#C9A45C';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.29);
    ctx.lineTo(w * 0.8, h * 0.29);
    ctx.stroke();

    ctx.fillStyle = '#9D5A60';
    ctx.font = `italic ${Math.round(w * 0.048)}px 'Cormorant Garamond', serif`;
    ctx.fillText('Friday', w / 2, h * 0.39);

    ctx.fillStyle = '#351016';
    ctx.font = `600 ${Math.round(w * 0.22)}px 'Cinzel', serif`;
    ctx.fillText(invitation.nikahDayNumeral, w / 2, h * 0.65);

    ctx.fillStyle = '#5A1822';
    ctx.font = `400 ${Math.round(w * 0.052)}px 'Cinzel', serif`;
    ctx.fillText(`${invitation.nikahMonth} ${invitation.nikahYear}`, w / 2, h * 0.76);

    ctx.strokeStyle = '#C9A45C';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.82);
    ctx.lineTo(w * 0.7, h * 0.82);
    ctx.stroke();

    ctx.fillStyle = '#5A1822';
    ctx.font = `500 ${Math.round(w * 0.052)}px 'Cinzel', serif`;
    ctx.fillText(invitation.nikahTime, w / 2, h * 0.91);
  }, []);

  const drawScratchSurface = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#4A1520');
    gradient.addColorStop(0.4, '#5A1822');
    gradient.addColorStop(1, '#3A1018');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(201,164,92,0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + (Math.random() - 0.5) * 2, h);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(201,164,92,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    ctx.strokeStyle = 'rgba(201,164,92,0.3)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(9, 9, w - 18, h - 18);

    const corners = [
      [12, 12], [w - 12, 12], [12, h - 12], [w - 12, h - 12]
    ] as const;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,164,92,0.5)';
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(201,164,92,0.75)';
    ctx.font = `500 ${Math.round(w * 0.042)}px 'Cinzel', serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', w / 2, h * 0.44);

    ctx.fillStyle = 'rgba(201,164,92,0.4)';
    ctx.font = `italic ${Math.round(w * 0.035)}px 'Cormorant Garamond', serif`;
    ctx.fillText('slide finger across card', w / 2, h * 0.58);

    ctx.save();
    ctx.translate(w / 2, h / 2 + 20);
    ctx.strokeStyle = 'rgba(201,164,92,0.15)';
    ctx.lineWidth = 0.5;
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (('clientX' in e ? e.clientX : e.clientX) - rect.left) * scaleX,
      y: (('clientY' in e ? e.clientY : e.clientY) - rect.top) * scaleY,
    };
  };

  const scratch = useCallback((x: number, y: number, radius: number) => {
    const ctx = topCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (lastPosRef.current) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPosRef.current = { x, y };
  }, []);

  const completeReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    gsap.to(topCanvasRef.current, {
      opacity: 0,
      duration: safeDuration(0.9),
      ease: EASING.elegant,
      onComplete: () => {
        onRevealed?.();
      },
    });
  }, [onRevealed]);

  const checkRevealProgress = useCallback(() => {
    if (revealedRef.current) return;
    const canvas = topCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const pct = transparent / (canvas.width * canvas.height);
    if (pct > 0.4) completeReveal();
  }, [completeReveal]);

  useEffect(() => {
    const bottomCanvas = bottomCanvasRef.current;
    const topCanvas = topCanvasRef.current;
    if (!bottomCanvas || !topCanvas) return;

    bottomCanvas.width = CARD_WIDTH;
    bottomCanvas.height = CARD_HEIGHT;
    topCanvas.width = CARD_WIDTH;
    topCanvas.height = CARD_HEIGHT;

    const bottomCtx = bottomCanvas.getContext('2d')!;
    const topCtx = topCanvas.getContext('2d')!;

    drawContent(bottomCtx, CARD_WIDTH, CARD_HEIGHT);
    drawScratchSurface(topCtx, CARD_WIDTH, CARD_HEIGHT);

    checkIntervalRef.current = setInterval(checkRevealProgress, 300);

    const onMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true;
      lastPosRef.current = null;
      const pos = getPos(e, topCanvas);
      scratch(pos.x, pos.y, 16);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      const pos = getPos(e, topCanvas);
      scratch(pos.x, pos.y, 16);
    };
    const onMouseUp = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      lastPosRef.current = null;
      const pos = getPos(e.touches[0], topCanvas);
      scratch(pos.x, pos.y, 24);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const pos = getPos(e.touches[0], topCanvas);
      scratch(pos.x, pos.y, 24);
    };
    const onTouchEnd = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    topCanvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    topCanvas.addEventListener('touchstart', onTouchStart, { passive: false });
    topCanvas.addEventListener('touchmove', onTouchMove, { passive: false });
    topCanvas.addEventListener('touchend', onTouchEnd);

    return () => {
      topCanvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      topCanvas.removeEventListener('touchstart', onTouchStart);
      topCanvas.removeEventListener('touchmove', onTouchMove);
      topCanvas.removeEventListener('touchend', onTouchEnd);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [drawContent, drawScratchSurface, scratch, checkRevealProgress]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.scratch-reveal-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: safeDuration(0.8),
          stagger: 0.12,
          ease: EASING.scrollReveal,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: SCROLL.start,
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 scratch-section"
      style={{ background: 'linear-gradient(180deg, #F7F0E5 0%, #F0E8D8 100%)' }}
      aria-label="Scratch card reveal"
    >
      <div className="max-w-sm mx-auto text-center">
        <p className="scratch-reveal-item scratch-intro-copy">
          Some moments are meant to be discovered.
        </p>
        <p className="scratch-reveal-item scratch-kicker">Scratch to Reveal</p>

        <div
          className="scratch-reveal-item scratch-card-shell"
          aria-label="Scratch card revealing the Nikah date"
        >
          <canvas ref={bottomCanvasRef} className="scratch-layer" aria-hidden />
          <canvas
            ref={topCanvasRef}
            className="scratch-layer scratch-canvas"
            aria-label="Scratch here to reveal the Nikah date"
            role="img"
          />
          {revealed && <div className="scratch-complete-glow" aria-hidden />}
        </div>

        <button
          onClick={completeReveal}
          className="scratch-reveal-item scratch-accessible-reveal"
          style={{ opacity: revealed ? 0 : 0.75 }}
          aria-label="Reveal the Nikah date without scratching"
        >
          Tap to reveal
        </button>

        {revealed && (
          <div className="scratch-reveal-item scratch-venue-wrap">
            <VenueSection
              label="Nikah Venue"
              venue={invitation.nikahVenue}
              address={invitation.nikahAddress}
              mapsUrl={invitation.nikahMapsUrl}
            />
          </div>
        )}
      </div>
    </section>
  );
}
