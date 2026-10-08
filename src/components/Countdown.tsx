import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatCountdown, pad } from '../lib/utils';
import { EASING, DURATION, SCROLL, safeDuration } from '../animations/tokens';

gsap.registerPlugin(ScrollTrigger);

interface CountdownProps {
  target: Date;
}

interface TimeUnit {
  label: string;
  value: number;
}

function CountdownUnit({ label, value }: TimeUnit) {
  const prevRef = useRef(value);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prevRef.current !== value && numRef.current) {
      gsap.fromTo(
        numRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: safeDuration(DURATION.countdownFlip), ease: EASING.cardRise }
      );
    }
    prevRef.current = value;
  }, [value]);

  return (
    <div className="text-center" style={{ minWidth: 'clamp(52px, 15vw, 72px)' }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          overflow: 'hidden',
        }}
      >
        <span
          ref={numRef}
          style={{
            display: 'block',
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(36px, 10vw, 56px)',
            fontWeight: 600,
            color: '#5A1822',
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}
        >
          {pad(value)}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(8px, 2.2vw, 10px)',
          letterSpacing: '0.25em',
          color: '#9D5A60',
          marginTop: 6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
    </div>
  );
}

function Separator() {
  return (
    <span
      style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(28px, 8vw, 40px)',
        color: '#C9A45C',
        opacity: 0.6,
        lineHeight: 1,
        alignSelf: 'flex-start',
        paddingTop: '2px',
      }}
      aria-hidden
    >
      :
    </span>
  );
}

export default function Countdown({ target }: CountdownProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState(() => formatCountdown(target.getTime() - Date.now()));

  useEffect(() => {
    const tick = () => setTime(formatCountdown(target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.countdown-reveal',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: safeDuration(0.8),
          stagger: safeDuration(0.12),
          ease: EASING.scrollReveal,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (time.expired) {
    return (
      <section
        ref={sectionRef}
        className="relative py-20 px-6"
        style={{ background: 'linear-gradient(180deg, #F0E8D8 0%, #F7F0E5 100%)' }}
        aria-label="Countdown"
      >
        <div className="max-w-sm mx-auto text-center">
          <p
            style={{
              fontFamily: 'Great Vibes, cursive',
              fontSize: 'clamp(40px, 11vw, 58px)',
              color: '#5A1822',
              lineHeight: 1.3,
            }}
          >
            Today We Celebrate
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6"
      style={{
        background: 'linear-gradient(180deg, #F0E8D8 0%, #EDE0CC 50%, #F0E8D8 100%)',
      }}
      aria-label="Countdown to the wedding"
    >
      <div className="max-w-sm mx-auto text-center">
        <div
          className="countdown-reveal"
          style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A45C, transparent)',
            margin: '0 auto 16px',
            opacity: 0.6,
          }}
        />

        <p
          className="countdown-reveal"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(18px, 5vw, 22px)',
            fontStyle: 'italic',
            color: '#5A1822',
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          Until We Celebrate Together
        </p>

        <div
          className="countdown-reveal"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(6px, 2vw, 14px)',
          }}
          aria-live="polite"
          aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds until the Valima`}
        >
          <CountdownUnit label="Days" value={time.days} />
          <Separator />
          <CountdownUnit label="Hours" value={time.hours} />
          <Separator />
          <CountdownUnit label="Minutes" value={time.minutes} />
          <Separator />
          <CountdownUnit label="Seconds" value={time.seconds} />
        </div>

        <p
          className="countdown-reveal"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(10px, 2.8vw, 12px)',
            letterSpacing: '0.18em',
            color: '#9D5A60',
            marginTop: 18,
            textTransform: 'uppercase',
          }}
        >
          25 October 2026 · 9:00 PM
        </p>

        <div
          className="countdown-reveal"
          style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A45C, transparent)',
            margin: '18px auto 0',
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
}
