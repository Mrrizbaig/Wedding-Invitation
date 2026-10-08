import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';
import {
    EASING,
    DURATION,
    SCROLL,
    safeDuration,
} from '../animations/tokens';

gsap.registerPlugin(ScrollTrigger);

export default function QuranSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.quran-reveal',
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: safeDuration(1.0),
                    stagger: safeDuration(0.18),
                    ease: EASING.scrollReveal,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="quran-section"
            ref={sectionRef}
            className="relative py-20 px-6"
            style={{
                background:
                    'linear-gradient(180deg, #F7F0E5 0%, #FAF5EE 50%, #F7F0E5 100%)',
            }}
            aria-label="Quranic verse"
        >
            <div className="max-w-sm mx-auto text-center">
                <div
                    className="quran-reveal"
                    style={{
                        width: '40px',
                        height: '1px',
                        background:
                            'linear-gradient(to right, transparent, #C9A45C, transparent)',
                        margin: '0 auto 20px',
                        opacity: 0.7,
                    }}
                />

                <p
                    className="quran-reveal"
                    style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '11px',
                        letterSpacing: '0.28em',
                        color: '#9D5A60',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                    }}
                >
                    {invitation.ayahReference}
                </p>

                <div
                    className="quran-reveal"
                    style={{
                        background:
                            'rgba(90,24,34,0.03)',
                        border:
                            '1px solid rgba(201,164,92,0.2)',
                        borderRadius: 2,
                        padding:
                            'clamp(16px, 5vw, 24px) clamp(14px, 4vw, 20px)',
                        marginBottom: 16,
                    }}
                >
                    <p
                        lang="ar"
                        aria-label="Quran verse in Arabic"
                        style={{
                            fontFamily: 'Amiri, serif',
                            fontSize:
                                'clamp(18px, 5.5vw, 26px)',
                            color: '#351016',
                            direction: 'rtl',
                            lineHeight: 2.2,
                            letterSpacing: '0.02em',
                        }}
                    >
                        {invitation.ayahArabic}
                    </p>
                </div>

                <div className="quran-reveal">
                    <div
                        style={{
                            width: '30px',
                            height: '1px',
                            background:
                                'linear-gradient(to right, transparent, #C9A45C, transparent)',
                            margin: '0 auto 14px',
                            opacity: 0.5,
                        }}
                    />

                    <p
                        style={{
                            fontFamily:
                                'Cormorant Garamond, serif',
                            fontSize:
                                'clamp(17px, 4.5vw, 20px)',
                            fontStyle: 'italic',
                            color: '#4A332B',
                            lineHeight: 1.85,
                            maxWidth: '300px',
                            margin: '0 auto',
                        }}
                    >
                        &ldquo;
                        {invitation.ayahTranslation}
                        &rdquo;
                    </p>
                </div>

                <div
                    className="quran-reveal"
                    style={{
                        width: '40px',
                        height: '1px',
                        background:
                            'linear-gradient(to right, transparent, #C9A45C, transparent)',
                        margin: '20px auto 0',
                        opacity: 0.7,
                    }}
                />
            </div>
        </section>
    );
}