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

  const [opened, setOpened] = useState(false);
  const [venueVisible, setVenueVisible] = useState(false);

  const venueTimerRef =
      useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (venueTimerRef.current) {
        clearTimeout(venueTimerRef.current);
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

    const pieces =
        Array.from(confettiRef.current.children) as HTMLElement[];

    const tl = gsap.timeline();

    /*
     * Small physical feedback when the box is tapped.
     */
    giftRef.current.classList.add('gift-box-opening');

    tl.to(giftRef.current, {
      scale: 0.94,
      duration: 0.12,
      ease: 'power2.in',
    })

        /*
         * Warm highlight immediately after the tap.
         */
        .to(giftRef.current, {
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
            lidRef.current,
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
            bowRef.current,
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
         * It rises slightly above the box so the complete card
         * remains visible instead of being buried inside it.
         */
        .to(
            innerDateRef.current,
            {
              opacity: 1,
              y: -18,
              scale: 1.015,
              duration: 0.68,
              ease: 'power3.out',
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
            },
            '-=0.5',
        )

        /*
         * Return the box to its normal scale.
         */
        .to(
            giftRef.current,
            {
              scale: 1,
              filter:
                  'drop-shadow(0 24px 24px rgba(70,35,20,.22))',
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                giftRef.current?.classList.remove(
                    'gift-box-opening',
                );
              },
            },
            '-=0.3',
        );

    /*
     * IMPORTANT:
     * Do not render the venue immediately.
     *
     * The date gets its own reveal first.
     * The venue is inserted later so its existing CSS
     * entrance animation can play naturally.
     */
    venueTimerRef.current = setTimeout(() => {
      setVenueVisible(true);
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

              <div ref={lidRef} className="gift-lid">
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