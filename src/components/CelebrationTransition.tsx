import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, DURATION, SCROLL, safeDuration } from '../animations/tokens';

gsap.registerPlugin(ScrollTrigger);

function OrnamentalSVG() {
  return (
    <svg
      viewBox="0 0 280 80"
      width="280"
      height="80"
      className="mx-auto celebration-ornament"
      aria-hidden
    >
      <g opacity="0.7">
        <path d="M10,40 Q50,20 90,40 Q50,60 10,40Z" fill="none" stroke="#C9A45C" strokeWidth="0.7" />
        <path d="M20,40 Q52,28 84,40" fill="none" stroke="#C9A45C" strokeWidth="0.4" />
        <line x1="10" y1="40" x2="90" y2="40" stroke="#C9A45C" strokeWidth="0.3" opacity="0.4" />
        <circle cx="10" cy="40" r="2" fill="#C9A45C" opacity="0.6" />
        <path d="M30,40 Q50,30 70,40" fill="none" stroke="#C9A45C" strokeWidth="0.3" opacity="0.5" />
        <path d="M25,38 L25,42" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
        <path d="M45,35 L45,45" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
        <path d="M65,38 L65,42" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
      </g>

      <g opacity="0.7" transform="translate(280,0) scale(-1,1)">
        <path d="M10,40 Q50,20 90,40 Q50,60 10,40Z" fill="none" stroke="#C9A45C" strokeWidth="0.7" />
        <path d="M20,40 Q52,28 84,40" fill="none" stroke="#C9A45C" strokeWidth="0.4" />
        <line x1="10" y1="40" x2="90" y2="40" stroke="#C9A45C" strokeWidth="0.3" opacity="0.4" />
        <circle cx="10" cy="40" r="2" fill="#C9A45C" opacity="0.6" />
        <path d="M30,40 Q50,30 70,40" fill="none" stroke="#C9A45C" strokeWidth="0.3" opacity="0.5" />
        <path d="M25,38 L25,42" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
        <path d="M45,35 L45,45" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
        <path d="M65,38 L65,42" stroke="#C9A45C" strokeWidth="0.4" opacity="0.4" />
      </g>

      <g transform="translate(140,40)">
        <circle r="12" fill="#5A1822" />
        <circle r="10" fill="none" stroke="#C9A45C" strokeWidth="0.6" />
        <polygon
          points="0,-8 2,-3 7,-7 3,-2 8,0 3,2 7,7 2,3 0,8 -2,3 -7,7 -3,2 -8,0 -3,-2 -7,-7 -2,-3"
          fill="#C9A45C"
          opacity="0.85"
        />
        <circle r="2.5" fill="#5A1822" />
        <circle r="1.5" fill="#C9A45C" opacity="0.8" />
      </g>

      <line x1="100" y1="40" x2="125" y2="40" stroke="#C9A45C" strokeWidth="0.6" opacity="0.5" />
      <line x1="155" y1="40" x2="180" y2="40" stroke="#C9A45C" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

export default function CelebrationTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ornamentRef.current,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: safeDuration(1.0),
          ease: EASING.scrollReveal,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: safeDuration(0.9),
          ease: EASING.scrollReveal,
          delay: safeDuration(0.2),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to('.celebration-ornament circle:last-child', {
          rotation: 360,
          transformOrigin: 'center center',
          duration: 20,
          ease: 'none',
          repeat: -1,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #EDE0CC 0%, #E8D8C4 50%, #EDE0CC 100%)',
      }}
      aria-label="Celebration transition"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03 }}
        aria-hidden
      >
        <svg viewBox="0 0 390 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M195,10 C120,10 80,60 80,110 L80,200 L310,200 L310,110 C310,60 270,10 195,10Z"
            fill="none" stroke="#5A1822" strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-sm mx-auto text-center">
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A45C, transparent)',
            margin: '0 auto 20px',
            opacity: 0.6,
          }}
        />

        <div ref={ornamentRef}>
          <OrnamentalSVG />
        </div>

        <div ref={textRef} style={{ marginTop: 20 }}>
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(20px, 5.5vw, 26px)',
              fontStyle: 'italic',
              color: '#5A1822',
              lineHeight: 1.5,
              marginBottom: 6,
            }}
          >
            And the celebration continues...
          </p>
          <p
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#9D5A60',
              textTransform: 'uppercase',
            }}
          >
            You are warmly invited
          </p>
        </div>

        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A45C, transparent)',
            margin: '20px auto 0',
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
}
