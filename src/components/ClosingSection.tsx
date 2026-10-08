import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';
import {
    EASING,
    DURATION,
    safeDuration,
} from '../animations/tokens';

gsap.registerPlugin(ScrollTrigger);

function ClosingOrnament() {
    return (
        <svg
            viewBox="0 0 200 60"
            width="200"
            height="60"
            className="mx-auto"
            aria-hidden
        >
            <path
                d="M5,30 Q40,15 75,30 Q40,45 5,30Z"
                fill="none"
                stroke="#C9A45C"
                strokeWidth="0.6"
                opacity="0.6"
            />

            <path
                d="M5,30 L75,30"
                stroke="#C9A45C"
                strokeWidth="0.3"
                opacity="0.3"
            />

            <path
                d="M195,30 Q160,15 125,30 Q160,45 195,30Z"
                fill="none"
                stroke="#C9A45C"
                strokeWidth="0.6"
                opacity="0.6"
            />

            <path
                d="M125,30 L195,30"
                stroke="#C9A45C"
                strokeWidth="0.3"
                opacity="0.3"
            />

            <circle
                cx="100"
                cy="30"
                r="8"
                fill="#5A1822"
            />

            <circle
                cx="100"
                cy="30"
                r="6"
                fill="none"
                stroke="#C9A45C"
                strokeWidth="0.5"
            />

            <polygon
                points="100,23 102,28 107,28 103,31 105,36 100,33 95,36 97,31 93,28 98,28"
                fill="#C9A45C"
                opacity="0.8"
            />

            <line
                x1="78"
                y1="30"
                x2="90"
                y2="30"
                stroke="#C9A45C"
                strokeWidth="0.5"
                opacity="0.5"
            />

            <line
                x1="110"
                y1="30"
                x2="122"
                y2="30"
                stroke="#C9A45C"
                strokeWidth="0.5"
                opacity="0.5"
            />
        </svg>
    );
}

export default function ClosingSection() {
    const sectionRef =
        useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.closing-reveal',
                {
                    opacity: 0,
                    y: 16,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: safeDuration(0.9),
                    stagger: safeDuration(0.14),
                    ease: EASING.scrollReveal,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 78%',
                        toggleActions:
                            'play none none none',
                    },
                },
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 px-6 safe-pb"
            style={{
                background:
                    'linear-gradient(180deg, #F7F0E5 0%, #EDE0CC 40%, #351016 100%)',
            }}
            aria-label="Closing"
        >
            <div className="max-w-sm mx-auto text-center">

                {/* TOP DIVIDER */}

                <div
                    className="closing-reveal"
                    style={{
                        width: '60px',
                        height: '1px',
                        background:
                            'linear-gradient(to right, transparent, #C9A45C, transparent)',
                        margin: '0 auto 24px',
                        opacity: 0.7,
                    }}
                />

                {/* CLOSING LINES */}

                {invitation.closingLines.map(
                    (line, i) => (
                        <p
                            key={i}
                            className="closing-reveal"
                            style={{
                                fontFamily:
                                    'Cormorant Garamond, serif',
                                fontSize:
                                    'clamp(15px, 4.2vw, 18px)',
                                fontStyle: 'italic',
                                color:
                                    i === 0
                                        ? '#351016'
                                        : '#4A332B',
                                lineHeight: 1.75,
                                marginBottom:
                                    i === 0 ? 8 : 20,
                            }}
                        >
                            {line}
                        </p>
                    ),
                )}

                {/* DIVIDER */}

                <div
                    className="closing-reveal"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        maxWidth: '200px',
                        margin: '0 auto 20px',
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: '1px',
                            background:
                                'linear-gradient(to right, transparent, #C9A45C)',
                            opacity: 0.5,
                        }}
                    />

                    <span
                        style={{
                            color: '#C9A45C',
                            fontSize: '12px',
                        }}
                    >
            ✦
          </span>

                    <div
                        style={{
                            flex: 1,
                            height: '1px',
                            background:
                                'linear-gradient(to left, transparent, #C9A45C)',
                            opacity: 0.5,
                        }}
                    />
                </div>

                {/* =========================================================
            FINAL BLESSING
            ========================================================= */}

                <div className="closing-reveal">
                    <p
                        style={{
                            fontFamily:
                                'Cinzel, serif',
                            fontSize:
                                'clamp(19px, 5vw, 22px)',
                            letterSpacing: '0.12em',
                            color: '#5A1822',
                            fontWeight: 600,
                            marginBottom: 18,
                        }}
                    >
                        {invitation.closingBlessing}
                    </p>
                </div>

                {/* FINAL ORNAMENT */}

                <div
                    className="closing-reveal"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <ClosingOrnament />
                </div>

            </div>
        </section>
    );
}