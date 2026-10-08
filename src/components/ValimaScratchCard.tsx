import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';
import VenueSection from './VenueSection';

gsap.registerPlugin(ScrollTrigger);

export default function ValimaScratchCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const coverCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const W = 320;
  const H = 192;

  const drawReveal = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FDFAF4';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(201,164,92,.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, W - 12, H - 12);
    ctx.strokeStyle = 'rgba(201,164,92,.22)';
    ctx.strokeRect(11, 11, W - 22, H - 22);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#9D5A60';
    ctx.font = "italic 15px 'Cormorant Garamond', serif";
    ctx.fillText('Valima', W / 2, 40);

    ctx.fillStyle = '#351016';
    ctx.font = "600 67px 'Cinzel', serif";
    ctx.fillText(invitation.valimaDayNumeral, W / 2, 104);

    ctx.fillStyle = '#5A1822';
    ctx.font = "400 16px 'Cinzel', serif";
    ctx.fillText(`${invitation.valimaMonth} ${invitation.valimaYear}`, W / 2, 132);

    ctx.strokeStyle = '#C9A45C';
    ctx.beginPath();
    ctx.moveTo(100, 145);
    ctx.lineTo(220, 145);
    ctx.stroke();

    ctx.font = "500 17px 'Cinzel', serif";
    ctx.fillText(invitation.valimaTime, W / 2, 170);
  }, []);

  const drawCover = useCallback((ctx: CanvasRenderingContext2D) => {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#4A1520');
    g.addColorStop(.45, '#641C28');
    g.addColorStop(1, '#351016');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(201,164,92,.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, W - 12, H - 12);
    ctx.strokeStyle = 'rgba(201,164,92,.12)';
    ctx.lineWidth = .6;
    for (let x = 0; x < W; x += 5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 8, H); ctx.stroke();
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,236,186,.86)';
    ctx.font = "500 14px 'Cinzel', serif";
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', W / 2, 84);
    ctx.fillStyle = 'rgba(255,236,186,.48)';
    ctx.font = "italic 13px 'Cormorant Garamond', serif";
    ctx.fillText('discover the celebration date', W / 2, 116);
  }, []);

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
  };

  const scratch = useCallback((x: number, y: number) => {
    const canvas = coverCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineWidth = 34;
    ctx.beginPath();
    if (lastRef.current) { ctx.moveTo(lastRef.current.x, lastRef.current.y); }
    else { ctx.moveTo(x, y); }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill();
    lastRef.current = { x, y };
  }, []);

  const complete = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    gsap.to(coverCanvasRef.current, { opacity: 0, duration: .7, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    const reveal = revealCanvasRef.current;
    const cover = coverCanvasRef.current;
    if (!reveal || !cover) return;
    reveal.width = cover.width = W; reveal.height = cover.height = H;
    drawReveal(reveal.getContext('2d')!);
    drawCover(cover.getContext('2d')!);

    const progress = window.setInterval(() => {
      if (revealedRef.current) return;
      const data = cover.getContext('2d')!.getImageData(0, 0, W, H).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++;
      if (transparent / (W * H) > .4) complete();
    }, 280);

    const down = (e: MouseEvent) => { drawingRef.current = true; lastRef.current = null; const p = getPos(e, cover); scratch(p.x, p.y); };
    const move = (e: MouseEvent) => { if (drawingRef.current) { const p = getPos(e, cover); scratch(p.x, p.y); } };
    const up = () => { drawingRef.current = false; lastRef.current = null; };
    const touchDown = (e: TouchEvent) => { e.preventDefault(); drawingRef.current = true; lastRef.current = null; const p = getPos(e.touches[0], cover); scratch(p.x, p.y); };
    const touchMove = (e: TouchEvent) => { e.preventDefault(); if (drawingRef.current) { const p = getPos(e.touches[0], cover); scratch(p.x, p.y); } };

    cover.addEventListener('mousedown', down); window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    cover.addEventListener('touchstart', touchDown, { passive: false }); cover.addEventListener('touchmove', touchMove, { passive: false }); cover.addEventListener('touchend', up);
    return () => {
      window.clearInterval(progress);
      cover.removeEventListener('mousedown', down); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
      cover.removeEventListener('touchstart', touchDown); cover.removeEventListener('touchmove', touchMove); cover.removeEventListener('touchend', up);
    };
  }, [complete, drawCover, drawReveal, scratch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.valima-scratch-reveal', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none none' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="scratch-section valima-scratch-section">
      <div className="scratch-section-inner">
        <p className="valima-scratch-reveal scratch-intro-copy">And the celebration continues...</p>
        <p className="valima-scratch-reveal scratch-kicker">Discover the Valima</p>
        <div className="valima-scratch-reveal scratch-card-shell" aria-label="Scratch card revealing the Valima date">
          <canvas ref={revealCanvasRef} className="scratch-layer" aria-hidden="true" />
          <canvas ref={coverCanvasRef} className="scratch-layer scratch-canvas" aria-label="Scratch here to reveal the Valima date" role="img" />
          {revealed && <div className="scratch-complete-glow" aria-hidden="true" />}
        </div>
        <button className="scratch-accessible-reveal valima-scratch-reveal" onClick={complete} style={{ opacity: revealed ? 0 : .78 }}>
          Tap to reveal
        </button>
        {revealed && (
          <div className="valima-scratch-reveal scratch-venue-wrap">
            <VenueSection label="Valima Venue" venue={invitation.valimaVenue} address={invitation.valimaAddress} mapsUrl={invitation.valimaMapsUrl} />
          </div>
        )}
      </div>
    </section>
  );
}
