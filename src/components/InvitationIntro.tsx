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

function BismillahSection() {
    return (
        <div className="text-center mb-6">
            <p
                lang="ar"
                aria-label="Bismillah ir-Rahman ir-Rahim"
                style={{
                    fontFamily: 'Amiri, serif',
                    fontSize: 'clamp(24px, 7vw, 36px)',
                    color: '#5A1822',
                    direction: 'rtl',
                    lineHeight: 1.8,
                    marginBottom: 8,
                }}
            >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            <div
                style={{
                    width: '80px',
                    height: '1px',
                    background:
                        'linear-gradient(to right, transparent, #C9A45C, transparent)',
                    margin: '0 auto',
                }}
            />
        </div>
    );
}

function OrnamentDivider({
                             narrow,
                         }: {
    narrow?: boolean;
}) {
    return (
        <div
            className="flex items-center gap-3 mx-auto"
            style={{
                maxWidth: narrow ? '160px' : '240px',
                margin: '16px auto',
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: '1px',
                    background:
                        'linear-gradient(to right, transparent, rgba(201,164,92,0.6))',
                }}
            />

            <span
                style={{
                    color: '#C9A45C',
                    fontSize: '10px',
                    lineHeight: 1,
                }}
            >
        ✦
      </span>

            <div
                style={{
                    flex: 1,
                    height: '1px',
                    background:
                        'linear-gradient(to left, transparent, rgba(201,164,92,0.6))',
                }}
            />
        </div>
    );
}

/*
 * ================================================================
 * COUPLE CARD
 * ================================================================
 */

function CoupleCard({
                        label,
                        groomName,
                        groomTitle,
                        brideFather,
                        brideTitle,
                    }: {
    label: string;
    groomName: string;
    groomTitle: string;
    brideFather: string;
    brideTitle: string;
}) {
    return (
        <div className="couple-card">
            <p className="couple-label">
                {label}
            </p>

            <p className="couple-groom">
                {groomName}
            </p>

            <p className="couple-groom-title">
                {groomTitle}
            </p>

            <p className="couple-with">
                with
            </p>

            <p className="couple-bride">
                Daughter of
            </p>

            <p className="couple-bride-father">
                {brideFather
                    .replace(/^Daughter of\s+/i, '')
                    .trim()}
            </p>

            <p className="couple-bride-title">
                {brideTitle}
            </p>
        </div>
    );
}

export default function InvitationIntro() {
    const sectionRef =
        useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.intro-reveal',
                {
                    opacity: 0,
                    y: 24,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: safeDuration(
                        DURATION.sectionReveal,
                    ),
                    stagger: safeDuration(
                        DURATION.staggerChild,
                    ),
                    ease: EASING.scrollReveal,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 90%',
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
            className="relative min-h-screen flex items-center justify-center py-20 px-5 paper-texture intro-reference-hero"
            style={{
                background:
                    'linear-gradient(180deg, #f5eadb 0%, #fbf6ee 44%, #f4e7d5 100%)',
            }}
            aria-label="Formal wedding invitation"
        >
            <article
                className="relative w-full max-w-[390px] mx-auto paper-texture intro-reference-page"
                style={{
                    background: 'rgba(253,250,244,.58)',
                    padding:
                        'clamp(34px, 9vw, 54px) clamp(22px, 6vw, 38px)',
                    borderRadius: 0,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: '7px',
                        border:
                            '0.5px solid rgba(201,164,92,0.35)',
                        pointerEvents: 'none',
                    }}
                />

                {[false, true].flatMap((flipX) =>
                    [false, true].map((flipY) => (
                        <svg
                            key={`${flipX}-${flipY}`}
                            viewBox="0 0 16 16"
                            width={14}
                            height={14}
                            className="absolute"
                            style={{
                                top: flipY ? 'auto' : 5,
                                bottom: flipY ? 5 : 'auto',
                                left: flipX ? 'auto' : 5,
                                right: flipX ? 5 : 'auto',
                                transform: `scale(${flipX ? -1 : 1}, ${
                                    flipY ? -1 : 1
                                })`,
                                opacity: 0.45,
                            }}
                            aria-hidden
                        >
                            <path
                                d="M1,1 L7,1 M1,1 L1,7"
                                stroke="#C9A45C"
                                strokeWidth="0.8"
                                fill="none"
                            />

                            <circle
                                cx="1"
                                cy="1"
                                r="0.8"
                                fill="#C9A45C"
                            />
                        </svg>
                    )),
                )}

                <div className="text-center">
                    {/* =========================================================
              BISMILLAH
              ========================================================= */}

                    <div className="intro-reveal">
                        <BismillahSection />
                    </div>

                    {/* =========================================================
              OPENING WORDING
              ========================================================= */}

                    <div className="intro-reveal">
                        <p
                            style={{
                                fontFamily:
                                    'Cormorant Garamond, serif',
                                fontSize:
                                    'clamp(16px, 4.4vw, 19px)',
                                fontStyle: 'italic',
                                color: '#5A1822',
                                lineHeight: 1.75,
                            }}
                        >
                            In the Name of Allah
                            <br />

                            <span
                                style={{
                                    fontWeight: 500,
                                }}
                            >
                The Most Beneficent &amp; The Most Merciful
              </span>
                        </p>
                    </div>

                    <div className="intro-reveal">
                        <OrnamentDivider />
                    </div>

                    {/* =========================================================
              GUARDIANSHIP
              ========================================================= */}

                    <div className="intro-reveal">
                        <p
                            style={{
                                fontFamily: 'Cinzel, serif',
                                fontSize: '9px',
                                letterSpacing: '0.22em',
                                color: '#9D5A60',
                                marginBottom: 10,
                                textTransform: 'uppercase',
                            }}
                        >
                            Under the Guardianship of
                        </p>

                        {invitation.guardians.map(
                            (g, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginBottom:
                                            i === 0 ? 12 : 0,
                                    }}
                                >
                                    <p
                                        style={{
                                            fontFamily:
                                                'Cormorant Garamond, serif',
                                            fontSize:
                                                'clamp(17px, 4.6vw, 20px)',
                                            fontWeight: 500,
                                            color: '#351016',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {g.name}
                                    </p>

                                    {g.title && (
                                        <p
                                            style={{
                                                fontFamily:
                                                    'Cormorant Garamond, serif',
                                                fontSize:
                                                    'clamp(14px, 3.7vw, 16px)',
                                                color: '#9D5A60',
                                                fontStyle: 'italic',
                                                marginTop: 2,
                                            }}
                                        >
                                            ({g.title})
                                        </p>
                                    )}
                                </div>
                            ),
                        )}
                    </div>

                    <div className="intro-reveal">
                        <OrnamentDivider narrow />
                    </div>

                    {/* =========================================================
              FORMAL INVITATION WORDING
              ========================================================= */}

                    <div className="intro-reveal">
                        <p
                            style={{
                                fontFamily:
                                    'Cormorant Garamond, serif',
                                fontSize:
                                    'clamp(16px, 4.3vw, 19px)',
                                fontStyle: 'italic',
                                color: '#4A332B',
                                lineHeight: 1.9,
                            }}
                        >
                            {invitation.formalWording}
                        </p>
                    </div>

                    {/* =========================================================
              TWO SONS + THEIR BRIDES
              ========================================================= */}

                    <div className="intro-reveal">
                        <div className="couples-grid">
                            {invitation.sons.map(
                                (son) => (
                                    <CoupleCard
                                        key={son.groomName}
                                        label={son.label}
                                        groomName={
                                            son.groomName
                                        }
                                        groomTitle={
                                            son.groomTitle
                                        }
                                        brideFather={
                                            son.brideFather
                                        }
                                        brideTitle={
                                            son.brideTitle
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </div>

                    {/* =========================================================
              IN SHA ALLAH
              ========================================================= */}

                    <div className="intro-reveal">
                        <OrnamentDivider narrow />
                    </div>

                    <div className="intro-reveal">
                        <p
                            style={{
                                fontFamily: 'Cinzel, serif',
                                fontSize:
                                    'clamp(18px, 4.8vw, 21px)',
                                letterSpacing: '0.15em',
                                color: '#5A1822',
                                fontWeight: 600,
                            }}
                        >
                            {invitation.inShaaAllah}
                        </p>
                    </div>

                    {/* =========================================================
              PRESENCE
              ========================================================= */}

                    <div
                        className="intro-reveal"
                        style={{ marginTop: 10 }}
                    >
                        <p
                            style={{
                                fontFamily:
                                    'Cormorant Garamond, serif',
                                fontSize:
                                    'clamp(16px, 4.2vw, 19px)',
                                fontStyle: 'italic',
                                color: '#4A332B',
                                lineHeight: 1.8,
                            }}
                        >
                            {invitation.presenceText}
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
}