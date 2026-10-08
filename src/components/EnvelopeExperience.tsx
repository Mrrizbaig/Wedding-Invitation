import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { gsap } from "gsap";

import WaxSeal from "./WaxSeal";
import "../styles/envelope-hero.css";

interface EnvelopeExperienceProps {
    onReveal: () => void;
    onComplete: () => void;
    petalBurst?: () => void;
    onMusicStart?: () => void;
}

export default function EnvelopeExperience({
                                               onReveal,
                                               onComplete,
                                               petalBurst,
                                               onMusicStart,
                                           }: EnvelopeExperienceProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const flapRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);

    const openingLightRef = useRef<HTMLDivElement>(null);
    const goldenBurstRef = useRef<HTMLDivElement>(null);
    const transitionLightRef = useRef<HTMLDivElement>(null);

    const [opening, setOpening] = useState(false);

    const hasOpenedRef = useRef(false);

    /*
     * ============================================================
     * LOCK PAGE SCROLL
     * ============================================================
     */

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const previousTouchAction = document.body.style.touchAction;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        document.documentElement.classList.add(
            "invitation-locked",
        );

        return () => {
            document.body.style.overflow = previousOverflow;
            document.body.style.touchAction = previousTouchAction;

            document.documentElement.classList.remove(
                "invitation-locked",
            );
        };
    }, []);

    /*
     * ============================================================
     * INITIAL STATE
     * ============================================================
     */

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(envelopeRef.current, {
                scale: 1,
                opacity: 1,
            });

            gsap.set(flapRef.current, {
                rotateX: 0,
                transformOrigin: "50% 13.46%",
            });

            gsap.set(sealRef.current, {
                scale: 1,
            });

            gsap.set(openingLightRef.current, {
                opacity: 0,
                scale: 0.03,
            });

            gsap.set(goldenBurstRef.current, {
                opacity: 0,
                scale: 0.03,
            });

            gsap.set(transitionLightRef.current, {
                opacity: 0,
                scale: 0.1,
            });
        }, stageRef);

        return () => ctx.revert();
    }, []);

    /*
     * ============================================================
     * VERY SUBTLE IDLE MOVEMENT
     * ============================================================
     */

    useEffect(() => {
        if (!envelopeRef.current || opening) {
            return;
        }

        const tween = gsap.to(envelopeRef.current, {
            scale: 1.0025,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        return () => {
            tween.kill();
        };
    }, [opening]);

    /*
     * ============================================================
     * OPEN ENVELOPE
     *
     * The sequence is deliberately paced:
     *
     * 0.00  seal responds
     * 0.10  warm light begins
     * 0.16  flap starts opening
     * 1.71  flap reaches fully open
     * 1.70  subtle petal burst
     * 1.78  camera begins pushing forward
     * 2.05  golden transition
     * 2.38  website reveal
     * 3.12  intro complete
     *
     * MUSIC:
     *
     * The music starts immediately when the wax seal is pressed.
     * This is intentionally before the GSAP animation so the
     * browser recognizes the playback as a direct user interaction.
     * ============================================================
     */

    const handleOpen = () => {
        if (hasOpenedRef.current) {
            return;
        }

        hasOpenedRef.current = true;

        /*
         * ========================================================
         * START BACKGROUND MUSIC
         * ========================================================
         *
         * This is called directly from the wax-seal click.
         *
         * The actual audio element is owned by App.tsx so that
         * the music continues after this envelope component
         * unmounts.
         */

        onMusicStart?.();

        setOpening(true);

        const flap = flapRef.current;
        const seal = sealRef.current;
        const envelope = envelopeRef.current;

        const openingLight =
            openingLightRef.current;

        const goldenBurst =
            goldenBurstRef.current;

        const transitionLight =
            transitionLightRef.current;

        if (
            !flap ||
            !seal ||
            !envelope ||
            !openingLight ||
            !goldenBurst ||
            !transitionLight
        ) {
            return;
        }

        const timeline = gsap.timeline({
            defaults: {
                overwrite: "auto",
            },
        });

        /*
         * ========================================================
         * 0.00 — 0.16s
         *
         * SEAL PRESS
         * ========================================================
         *
         * Very subtle.
         *
         * The seal should feel physically pressed,
         * not bounce around.
         */

        timeline.to(
            seal,
            {
                scale: 0.95,
                duration: 0.16,
                ease: "power2.out",
            },
            0,
        );

        /*
         * ========================================================
         * 0.10 — 0.55s
         *
         * INITIAL WARM LIGHT
         * ========================================================
         *
         * A restrained glow begins inside the envelope.
         *
         * It should NOT explode immediately.
         */

        timeline.to(
            openingLight,
            {
                opacity: 0.7,
                scale: 0.18,
                duration: 0.45,
                ease: "power2.out",
            },
            0.1,
        );

        /*
         * ========================================================
         * 0.16 — 1.71s
         *
         * UPPER FLAP OPENS
         * ========================================================
         *
         * This is the main physical motion.
         *
         * The entire upper flap PNG contains:
         *
         * - complete upper flap
         * - floral artwork
         * - gold edges
         * - complete wax seal
         */

        timeline.to(
            flap,
            {
                rotateX: -178,
                duration: 1.55,
                ease: "power3.inOut",
            },
            0.16,
        );

        /*
         * ========================================================
         * 0.45 — 1.55s
         *
         * LIGHT BUILDS WITH THE FLAP
         * ========================================================
         */

        timeline.to(
            openingLight,
            {
                scale: 0.75,
                opacity: 0.9,
                duration: 1.05,
                ease: "power2.out",
            },
            0.45,
        );

        /*
         * ========================================================
         * 0.95 — 1.40s
         *
         * FIRST GOLDEN BLOOM
         * ========================================================
         */

        timeline.to(
            goldenBurst,
            {
                opacity: 0.55,
                scale: 0.55,
                duration: 0.45,
                ease: "power2.out",
            },
            0.95,
        );

        /*
         * ========================================================
         * 1.45 — 2.05s
         *
         * MAIN GOLDEN BLOOM
         * ========================================================
         *
         * The flap is now nearly open before the strongest
         * light expansion happens.
         */

        timeline.to(
            goldenBurst,
            {
                opacity: 0.95,
                scale: 2.6,
                duration: 0.6,
                ease: "power3.out",
            },
            1.45,
        );

        /*
         * ========================================================
         * 1.55 — 2.15s
         *
         * LIGHT EXPANDS AFTER THE FLAP
         * ========================================================
         *
         * This creates the important visual hierarchy:
         *
         *     flap opens
         *          ↓
         *     viewer registers opening
         *          ↓
         *     golden light blooms
         */

        timeline.to(
            openingLight,
            {
                scale: 2.5,
                opacity: 0.58,
                duration: 0.6,
                ease: "power2.out",
            },
            1.55,
        );

        /*
         * ========================================================
         * 1.70s
         *
         * PETAL BURST
         * ========================================================
         */

        if (petalBurst) {
            timeline.call(
                () => {
                    petalBurst();
                },
                [],
                1.7,
            );
        }

        /*
         * ========================================================
         * 1.78 — 2.45s
         *
         * CAMERA PUSH
         * ========================================================
         *
         * The camera does not move until the flap has essentially
         * finished opening.
         */

        timeline.to(
            envelope,
            {
                scale: 1.16,
                duration: 0.67,
                ease: "power2.inOut",
            },
            1.78,
        );

        /*
         * ========================================================
         * 2.05 — 2.50s
         *
         * GOLDEN TRANSITION
         * ========================================================
         */

        timeline.to(
            transitionLight,
            {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                ease: "power2.inOut",
            },
            2.05,
        );

        /*
         * ========================================================
         * 2.38s
         *
         * WEBSITE REVEAL
         * ========================================================
         */

        timeline.call(
            () => {
                onReveal();
            },
            [],
            2.38,
        );

        /*
         * ========================================================
         * 2.38 — 3.08s
         *
         * ZOOM THROUGH GOLD
         * ========================================================
         */

        timeline.to(
            transitionLight,
            {
                scale: 5,
                opacity: 1,
                duration: 0.7,
                ease: "power3.in",
            },
            2.38,
        );

        /*
         * ========================================================
         * ENVELOPE FADES BEHIND GOLDEN TRANSITION
         * ========================================================
         */

        timeline.to(
            envelope,
            {
                scale: 1.45,
                opacity: 0,
                duration: 0.68,
                ease: "power2.in",
            },
            2.4,
        );

        /*
         * ========================================================
         * 3.12s
         *
         * COMPLETE
         * ========================================================
         */

        timeline.call(
            () => {
                onComplete();
            },
            [],
            3.12,
        );
    };

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <div
            ref={stageRef}
            className={`ref-envelope-stage ${
                opening ? "is-opening" : ""
            }`}
            aria-label="Wedding invitation"
        >
            {/* ====================================================
                ENVELOPE
               ==================================================== */}

            <div
                ref={envelopeRef}
                className="ref-envelope"
            >
                {/* =================================================
                    STATIONARY BASE
                   ================================================= */}

                <img
                    className="ref-envelope-base"
                    src="/images/envelope-base.png"
                    alt=""
                    draggable={false}
                />

                {/* =================================================
                    INITIAL GOLDEN LIGHT
                   ================================================= */}

                <div
                    ref={openingLightRef}
                    className="ref-opening-light"
                />

                {/* =================================================
                    GOLDEN BLOOM
                   ================================================= */}

                <div
                    ref={goldenBurstRef}
                    className="ref-golden-burst"
                />

                {/* =================================================
                    UPPER FLAP

                    envelope-flap.png already contains:

                    - complete upper flap
                    - floral artwork
                    - gold edges
                    - complete wax seal

                    No clip-path is required.
                    No CSS triangle is required.
                   ================================================= */}

                <div
                    ref={flapRef}
                    className="ref-top-flap"
                >
                    <img
                        className="ref-top-flap-image"
                        src="/images/envelope-flap.png"
                        alt=""
                        draggable={false}
                    />

                    {/* =============================================
                        INVISIBLE SEAL HIT AREA

                        The visible seal is part of the PNG.
                        This element exists only for interaction.
                       ============================================= */}

                    <div
                        ref={sealRef}
                        className="ref-seal-hit-area"
                    >
                        <WaxSeal
                            onPress={handleOpen}
                            cracked={opening}
                        />
                    </div>
                </div>

                {/* =================================================
                    FINAL GOLD TRANSITION
                   ================================================= */}

                <div
                    ref={transitionLightRef}
                    className="ref-transition-light"
                />
            </div>

            {/* ====================================================
                ACCESSIBILITY
               ==================================================== */}

            <button
                type="button"
                className="ref-envelope-accessibility"
                onClick={handleOpen}
                aria-label="Open wedding invitation"
            >
                Open invitation
            </button>
        </div>
    );
}