import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

export default function NikahSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.nikah-detail-reveal');
      gsap.fromTo(items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 px-5 ceremony-detail-section" aria-label="Nikah ceremony details">
      <div className="max-w-md mx-auto text-center">
        <p className="nikah-detail-reveal ceremony-mini-label">Nikah Ceremony</p>
        <p className="nikah-detail-reveal ceremony-date-line">{invitation.nikahDate}</p>
        <p className="nikah-detail-reveal ceremony-time">{invitation.nikahTime}</p>
        <p className="nikah-detail-reveal ceremony-note">{invitation.nikahDinnerNote}</p>
      </div>
    </section>
  );
}
