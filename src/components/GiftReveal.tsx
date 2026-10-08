import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MapPin } from 'lucide-react';
import { invitation } from '../data/invitation';

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    side: i % 2 === 0 ? 'left' : 'right',
    top: 28 + ((i * 19) % 48),
    delay: (i % 8) * 0.035,
    rotation: ((i * 47) % 180) - 90,
}));

export default function GiftReveal() {
    const sectionRef = useRef<HTMLElement>(null);
    const giftRef = useRef<HTMLButtonElement>(null);
    const lidRef = useRef<HTMLDivElement>(null);
    const bowRef = useRef<HTMLDivElement>(null);
    const confettiRef = useRef<HTMLDivElement>(null);
    const innerDateRef = useRef<HTMLDivElement>(null);

    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const venueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [opened, setOpened] = useState(false);
    const [venueVisible, setVenueVisible] = useState(false);

    /*
     * Clean up every animation/timer when the component leaves the DOM.
     *
     * This is especially important on mobile Safari because an interrupted
     * GSAP animation should not keep compositing detached DOM elements.
     */
    useEffect(() => {
        return () => {
            timelineRef.current?.kill();
            timelineRef.current = null;

            if (venueTimerRef.current) {
                clearTimeout(venueTimerRef.current);
                venueTimerRef.current = null;
            }
        };
    }, []);

    const openGift = () => {
        if (
            opened ||
            !giftRef.current ||
            !lidRef.current ||
            !bowRef.current ||
            !confettiRef.current ||
            !innerDateRef.current
        ) {
            return;
        }

        setOpened(true);
        setVenueVisible(false);

        const gift = giftRef.current;
        const lid = lidRef.current;
        const bow = bowRef.current;
        const dateCard = innerDateRef.current;

        const pieces = Array.from(
            confettiRef.current.children,
        ) as HTMLElement[];

        /*
         * Prevent any previous/incomplete timeline from continuing.
         */
        timelineRef.current?.kill();

        /*
         * Small physical feedback when the box is tapped.
         */
        gift.classList.add('gift-box-opening');

        /*
         * Use GSAP's timeline directly and retain a reference so it can
         * be killed safely if the component is removed during the animation.
         */
        const tl = gsap.timeline({
            onComplete: () => {
                gift.classList.remove('gift-box-opening');
                timelineRef.current = null;
            },
        });

        timelineRef.current = tl;

        tl.to(gift, {
            scale: 0.94,
            duration: 0.12,
            ease: 'power2.in',
        })

            /*
             * Warm highlight immediately after the tap.
             */
            .to(gift, {
                scale: 0.99,
                filter:
                    'drop-shadow(0 24px 28px rgba(201,164,92,.42))',
                duration: 0.22,
                ease: 'power2.out',
            })

            /*
             * Open only the gift lid.
             */
            .to(
                lid,
                {
                    rotationX: -108,
                    y: -34,
                    z: 20,
                    duration: 0.72,
                    ease: 'power3.inOut',
                },
                '-=0.02',
            )

            /*
             * Bow disappears with the opening.
             */
            .to(
                bow,
                {
                    y: -12,
                    scale: 0.88,
                    opacity: 0,
                    duration: 0.34,
                    ease: 'power2.in',
                },
                '-=0.54',
            )

            /*
             * DATE IS THE FIRST CONTENT TO BE REVEALED.
             *
             * The date card remains inside the gift DOM hierarchy,
             * preserving the existing visual composition.
             *
             * force3D keeps the animated element on a compositor layer,
             * which helps Safari render the transform/opacity animation
             * more consistently.
             */
            .to(
                dateCard,
                {
                    opacity: 1,
                    y: -18,
                    scale: 1.015,
                    duration: 0.68,
                    ease: 'power3.out',
                    force3D: true,
                },
                '-=0.18',
            )

            /*
             * Confetti comes after the date reveal begins.
             */
            .to(
                pieces,
                {
                    opacity: 1,
                    x: (i) =>
                        pieces[i].dataset.side === 'left'
                            ? -70 - (i % 5) * 18
                            : 70 + (i % 5) * 18,
                    y: (i) => -12 + (i % 7) * 15,
                    rotation: (i) =>
                        parseFloat(
                            pieces[i].dataset.rotation || '0',
                        ),
                    duration: 0.95,
                    stagger: 0.018,
                    ease: 'power2.out',
                    force3D: true,
                },
                '-=0.5',
            )

            /*
             * Return the box to its normal scale.
             */
            .to(
                gift,
                {
                    scale: 1,
                    filter:
                        'drop-shadow(0 24px 24px rgba(70,35,20,.22))',
                    duration: 0.3,
                    ease: 'power2.out',
                },
                '-=0.3',
            );

        /*
         * The date gets its own moment before the venue appears.
         *
         * Keep the existing timing exactly as before.
         */
        venueTimerRef.current = setTimeout(() => {
            setVenueVisible(true);
            venueTimerRef.current = null;
        }, 1450);
    };

    return (
        <section
            ref={sectionRef}
            className="gift-reveal-section"
            aria-label="Valima date reveal"
        >
            <div className="gift-reveal-inner">
                <h2 className="gift-title">The Valima</h2>

                <p className="gift-instruction">
                    Tap the surprise to reveal the date
                </p>

                <div className="gift-stage gift-stage-flat">
                    <div
                        ref={confettiRef}
                        className="gift-confetti"
                        aria-hidden="true"
                    >
                        {CONFETTI.map((piece) => (
                            <span
                                key={piece.id}
                                data-side={piece.side}
                                data-rotation={piece.rotation}
                                style={{
                                    top: `${piece.top}%`,
                                    left:
                                        piece.side === 'left'
                                            ? '47%'
                                            : '53%',
                                    animationDelay: `${piece.delay}s`,
                                }}
                            />
                        ))}
                    </div>

                    <button
                        ref={giftRef}
                        className="gift-box gift-flat-box"
                        type="button"
                        onClick={openGift}
                        aria-label="Open the gift to reveal the Valima date"
                    >
                        <div
                            className="gift-box-depth"
                            aria-hidden="true"
                        />

                        <div className="gift-body">
                            <span className="gift-ribbon gift-ribbon-horizontal" />
                            <span className="gift-ribbon gift-ribbon-vertical" />
                            <span className="gift-body-highlight" />
                        </div>

                        <div
                            ref={lidRef}
                            className="gift-lid"
                        >
                            <span className="gift-lid-edge" />
                            <span className="gift-ribbon gift-ribbon-horizontal" />
                            <span className="gift-ribbon gift-ribbon-vertical" />
                        </div>

                        <div
                            ref={bowRef}
                            className="gift-bow"
                            aria-hidden="true"
                        >
                            <span className="bow-loop bow-left" />
                            <span className="bow-loop bow-right" />
                            <span className="bow-knot" />
                        </div>

                        <div
                            ref={innerDateRef}
                            className="gift-inside-date"
                            aria-hidden={!opened}
                        >
                            <span>SUNDAY</span>
                            <strong>25</strong>
                            <span>OCTOBER 2026</span>
                            <em>9:00 PM</em>
                        </div>
                    </button>
                </div>

                {venueVisible && (
                    <div
                        className="gift-venue-card gift-valima-venue"
                        aria-live="polite"
                    >
                        <p className="gift-venue-label">
                            Valima Venue
                        </p>

                        <h3>{invitation.valimaVenue}</h3>

                        <address>
                            {invitation.valimaAddress.map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                        </address>

                        <a
                            href={invitation.valimaMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gift-directions"
                        >
                            <MapPin size={17} strokeWidth={1.6} />
                            Open Directions
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}