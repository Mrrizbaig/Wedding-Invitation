import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import EnvelopeExperience from './components/EnvelopeExperience';
import PetalSystem from './components/PetalSystem';
import InvitationIntro from './components/InvitationIntro';
import GiftReveal from './components/GiftReveal';
import QuranSection from './components/QuranSection';
import Countdown from './components/Countdown';
import ClosingSection from './components/ClosingSection';

import { invitation } from './data/invitation';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    /*
     * ============================================================
     * STATE
     * ============================================================
     */

    const [envelopeOpened, setEnvelopeOpened] =
        useState(false);

    const [envelopeVisible, setEnvelopeVisible] =
        useState(true);

    const [petalBurst, setPetalBurst] =
        useState(false);

    const [musicPlaying, setMusicPlaying] =
        useState(false);

    const [musicVisible, setMusicVisible] =
        useState(false);

    /*
     * ============================================================
     * REFS
     * ============================================================
     */

    const mainRef =
        useRef<HTMLDivElement>(null);

    const lenisRef =
        useRef<Lenis | null>(null);

    const audioRef =
        useRef<HTMLAudioElement | null>(null);

    /*
     * Tracks whether the user has explicitly muted
     * the music.
     *
     * Manual mute always has priority over automatic
     * Quran behavior.
     */
    const userMutedRef =
        useRef(false);

    /*
     * Tracks whether music was automatically paused
     * because the Quran section entered the central
     * reading zone.
     */
    const quranPausedRef =
        useRef(false);

    /*
     * Prevents multiple audio fade animations from
     * fighting each other.
     */
    const musicFadeRef =
        useRef<gsap.core.Tween | null>(null);

    /*
     * Tracks whether the page/browser has moved into
     * the background.
     *
     * IMPORTANT:
     * Returning to the page does NOT automatically
     * restart music.
     */
    const pageHiddenRef =
        useRef(false);

    /*
     * ============================================================
     * AUDIO INITIALIZATION
     * ============================================================
     */

    useEffect(() => {
        const audio =
            new Audio('/audio/music.mp3');

        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;

        audioRef.current = audio;

        return () => {
            musicFadeRef.current?.kill();
            musicFadeRef.current = null;

            audio.pause();
            audio.currentTime = 0;

            audioRef.current = null;
        };
    }, []);

    /*
     * ============================================================
     * STOP MUSIC WHEN PAGE/BROWSER BECOMES INACTIVE
     * ============================================================
     *
     * Mobile browsers do not reliably fire beforeunload when
     * the browser/app is sent to the background or dismissed.
     *
     * visibilitychange:
     *     Handles switching away from the page/app.
     *
     * pagehide:
     *     Provides an additional safeguard when the page is
     *     being dismissed, navigated away from, or closed.
     *
     * We intentionally STOP the music and do not automatically
     * restart it when the user returns.
     * ============================================================
     */

    useEffect(() => {
        const stopMusic =
            () => {
                const audio =
                    audioRef.current;

                if (!audio) {
                    return;
                }

                /*
                 * Mark the page as inactive.
                 */
                pageHiddenRef.current =
                    true;

                /*
                 * Cancel any active fade animation.
                 */
                musicFadeRef.current?.kill();
                musicFadeRef.current =
                    null;

                /*
                 * Clear automatic Quran pause state.
                 *
                 * This is important because otherwise the Quran
                 * observer could interpret the later page return
                 * as a reason to resume the music.
                 */
                quranPausedRef.current =
                    false;

                /*
                 * Stop and reset the audio.
                 */
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 0;

                setMusicPlaying(false);
            };

        const handleVisibilityChange =
            () => {
                if (
                    document.visibilityState ===
                    'hidden'
                ) {
                    stopMusic();

                    return;
                }

                /*
                 * The user has returned to the page.
                 *
                 * DO NOT automatically restart music.
                 *
                 * The user must explicitly press the
                 * music control again.
                 */
                pageHiddenRef.current =
                    false;
            };

        const handlePageHide =
            () => {
                stopMusic();
            };

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange,
        );

        window.addEventListener(
            'pagehide',
            handlePageHide,
        );

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );

            window.removeEventListener(
                'pagehide',
                handlePageHide,
            );
        };
    }, []);

    /*
     * ============================================================
     * START MUSIC
     * ============================================================
     *
     * Called directly from the wax-seal interaction.
     *
     * Keeping audio.play() inside the user interaction chain
     * is important for Safari/iOS autoplay restrictions.
     * ============================================================
     */

    const startMusic =
        useCallback(() => {
            const audio =
                audioRef.current;

            if (
                !audio ||
                userMutedRef.current ||
                pageHiddenRef.current ||
                document.visibilityState ===
                'hidden'
            ) {
                return;
            }

            audio
                .play()
                .then(() => {
                    /*
                     * The page may have become hidden while
                     * the play promise was resolving.
                     *
                     * Do not allow playback to resume in
                     * that situation.
                     */
                    if (
                        pageHiddenRef.current ||
                        document.visibilityState ===
                        'hidden'
                    ) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = 0;
                        setMusicPlaying(false);

                        return;
                    }

                    setMusicPlaying(true);

                    musicFadeRef.current?.kill();

                    musicFadeRef.current =
                        gsap.to(audio, {
                            volume: 0.28,
                            duration: 2.2,
                            ease: 'power2.out',
                        });
                })
                .catch((error) => {
                    console.warn(
                        'Background music could not start:',
                        error,
                    );
                });
        }, []);

    /*
     * ============================================================
     * MANUAL MUSIC TOGGLE
     * ============================================================
     */

    const toggleMusic =
        useCallback(() => {
            const audio =
                audioRef.current;

            /*
             * Never start music while the document is hidden.
             */
            if (
                !audio ||
                document.visibilityState ===
                'hidden'
            ) {
                return;
            }

            /*
             * ----------------------------------------------------
             * CURRENTLY PLAYING
             *
             * User is manually muting the music.
             * ----------------------------------------------------
             */

            if (!audio.paused) {
                userMutedRef.current =
                    true;

                musicFadeRef.current?.kill();

                musicFadeRef.current =
                    gsap.to(audio, {
                        volume: 0,
                        duration: 0.45,
                        ease: 'power2.out',

                        onComplete: () => {
                            audio.pause();

                            setMusicPlaying(
                                false,
                            );
                        },
                    });

                return;
            }

            /*
             * ----------------------------------------------------
             * CURRENTLY PAUSED
             *
             * User is manually enabling the music.
             * ----------------------------------------------------
             */

            userMutedRef.current =
                false;

            /*
             * Manual user action overrides the automatic
             * Quran pause.
             */
            quranPausedRef.current =
                false;

            audio
                .play()
                .then(() => {
                    /*
                     * Make sure the page did not become hidden
                     * while the play promise was resolving.
                     */
                    if (
                        pageHiddenRef.current ||
                        document.visibilityState ===
                        'hidden'
                    ) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = 0;
                        setMusicPlaying(false);

                        return;
                    }

                    setMusicPlaying(true);

                    musicFadeRef.current?.kill();

                    musicFadeRef.current =
                        gsap.to(audio, {
                            volume: 0.28,
                            duration: 0.8,
                            ease: 'power2.out',
                        });
                })
                .catch((error) => {
                    console.warn(
                        'Music could not resume:',
                        error,
                    );
                });
        }, []);

    /*
     * ============================================================
     * SHOW MUSIC CONTROL
     * ============================================================
     *
     * The control appears only after the envelope has completely
     * transitioned into the main invitation.
     * ============================================================
     */

    useEffect(() => {
        if (
            !envelopeVisible &&
            envelopeOpened
        ) {
            const timer =
                window.setTimeout(() => {
                    setMusicVisible(true);
                }, 450);

            return () => {
                window.clearTimeout(timer);
            };
        }

        /*
         * If the envelope is visible again for any reason,
         * keep the control hidden.
         */
        setMusicVisible(false);
    }, [
        envelopeVisible,
        envelopeOpened,
    ]);

    /*
     * ============================================================
     * QURAN MUSIC BEHAVIOR
     * ============================================================
     *
     * We intentionally do not check whether the entire Quran
     * section is visible.
     *
     * Instead, IntersectionObserver creates a virtual reading
     * zone in the CENTER of the viewport.
     *
     * rootMargin:
     *
     *   -35% top
     *   -35% bottom
     *
     * leaves approximately the central 30% of the viewport.
     *
     * Quran enters center:
     *     -> music fades out
     *     -> music pauses
     *
     * Quran leaves center:
     *     -> music resumes
     *
     * Manual mute always has priority.
     * ============================================================
     */

    useEffect(() => {
        if (!envelopeOpened) {
            return;
        }

        const quranSection =
            document.getElementById(
                'quran-section',
            );

        if (!quranSection) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    const entry =
                        entries[0];

                    if (!entry) {
                        return;
                    }

                    const audio =
                        audioRef.current;

                    if (!audio) {
                        return;
                    }

                    /*
                     * ------------------------------------------------
                     * QURAN ENTERS CENTRAL READING ZONE
                     * ------------------------------------------------
                     */

                    if (entry.isIntersecting) {
                        /*
                         * Manual mute has priority.
                         */
                        if (
                            userMutedRef.current
                        ) {
                            return;
                        }

                        /*
                         * If the page is hidden, do nothing.
                         */
                        if (
                            pageHiddenRef.current ||
                            document.visibilityState ===
                            'hidden'
                        ) {
                            return;
                        }

                        /*
                         * Already automatically paused.
                         */
                        if (
                            quranPausedRef.current
                        ) {
                            return;
                        }

                        quranPausedRef.current =
                            true;

                        musicFadeRef.current?.kill();

                        musicFadeRef.current =
                            gsap.to(audio, {
                                volume: 0,
                                duration: 0.65,
                                ease: 'power2.out',

                                onComplete: () => {
                                    /*
                                     * Only pause if Quran is
                                     * still responsible for the
                                     * pause and the user has not
                                     * manually muted/unmuted.
                                     */
                                    if (
                                        quranPausedRef.current &&
                                        !userMutedRef.current &&
                                        !pageHiddenRef.current &&
                                        document.visibilityState !==
                                        'hidden'
                                    ) {
                                        audio.pause();

                                        setMusicPlaying(
                                            false,
                                        );
                                    }
                                },
                            });

                        return;
                    }

                    /*
                     * ------------------------------------------------
                     * QURAN LEAVES CENTRAL READING ZONE
                     * ------------------------------------------------
                     */

                    if (
                        quranPausedRef.current &&
                        !userMutedRef.current &&
                        !pageHiddenRef.current &&
                        document.visibilityState !==
                        'hidden'
                    ) {
                        quranPausedRef.current =
                            false;

                        audio
                            .play()
                            .then(() => {
                                /*
                                 * Check again because the page
                                 * could have been backgrounded
                                 * while play() was resolving.
                                 */
                                if (
                                    pageHiddenRef.current ||
                                    document.visibilityState ===
                                    'hidden'
                                ) {
                                    audio.pause();
                                    audio.currentTime = 0;
                                    audio.volume = 0;
                                    setMusicPlaying(
                                        false,
                                    );

                                    return;
                                }

                                setMusicPlaying(
                                    true,
                                );

                                musicFadeRef.current?.kill();

                                musicFadeRef.current =
                                    gsap.to(
                                        audio,
                                        {
                                            volume: 0.28,
                                            duration: 0.9,
                                            ease: 'power2.out',
                                        },
                                    );
                            })
                            .catch(
                                (error) => {
                                    console.warn(
                                        'Music could not resume after Quran section:',
                                        error,
                                    );
                                },
                            );
                    }
                },
                {
                    /*
                     * Central reading zone.
                     */
                    root: null,

                    rootMargin:
                        '-35% 0px -35% 0px',

                    threshold: 0,
                },
            );

        observer.observe(quranSection);

        return () => {
            observer.disconnect();
        };
    }, [envelopeOpened]);

    /*
     * ============================================================
     * SCROLL + SCROLLTRIGGER
     * ============================================================
     *
     * DESKTOP
     * --------
     * Lenis smooth wheel scrolling is retained.
     *
     * TOUCH DEVICES
     * -------------
     * iOS Safari and Android Chrome use their native scrolling
     * system.
     *
     * We deliberately do NOT create a Lenis RAF loop on touch
     * devices.
     *
     * Native touch scrolling is already heavily optimized by the
     * browser compositor. Adding another interpolation loop on
     * top of it provides little visual benefit while consuming
     * additional CPU time.
     *
     * The visual section animations themselves remain.
     * ============================================================
     */

    useEffect(() => {
        if (!envelopeOpened) {
            return;
        }

        const isTouchDevice =
            window.matchMedia(
                '(pointer: coarse)',
            ).matches;

        let lenis: Lenis | null =
            null;

        let rafId:
            | number
            | null = null;

        /*
         * --------------------------------------------------------
         * DESKTOP
         * --------------------------------------------------------
         */

        if (!isTouchDevice) {
            lenis = new Lenis({
                lerp: 0.10,

                smoothWheel: true,

                smoothTouch: false,

                touchMultiplier: 1,
            });

            lenisRef.current =
                lenis;

            lenis.on(
                'scroll',
                ScrollTrigger.update,
            );

            const raf = (
                time: number,
            ) => {
                lenis?.raf(time);

                rafId =
                    requestAnimationFrame(
                        raf,
                    );
            };

            rafId =
                requestAnimationFrame(
                    raf,
                );
        } else {
            /*
             * ----------------------------------------------------
             * TOUCH
             * ----------------------------------------------------
             *
             * Native browser scrolling.
             *
             * ScrollTrigger still receives the browser's native
             * scroll events.
             * ----------------------------------------------------
             */

            lenisRef.current = null;
        }

        /*
         * --------------------------------------------------------
         * MAIN INVITATION INTRO
         * --------------------------------------------------------
         */

        if (mainRef.current) {
            gsap.fromTo(
                mainRef.current,
                {
                    opacity: 0,

                    scale: 1.035,

                    y: 12,
                },
                {
                    opacity: 1,

                    scale: 1,

                    y: 0,

                    duration: 1.15,

                    ease: 'power3.out',

                    delay: 0.02,
                },
            );

            /*
             * ----------------------------------------------------
             * INVITATION SECTIONS
             * ----------------------------------------------------
             *
             * Each section uses ONE ScrollTrigger timeline
             * containing both visual animations.
             *
             * This reduces ScrollTrigger bookkeeping while
             * preserving the existing visual movement.
             * ----------------------------------------------------
             */

            const sections =
                gsap.utils.toArray<HTMLElement>(
                    '#invitation-content > section',
                );

            sections.forEach(
                (section, index) => {
                    const content =
                        section.firstElementChild as
                            | HTMLElement
                            | null;

                    if (!content) {
                        return;
                    }

                    const timeline =
                        gsap.timeline({
                            scrollTrigger: {
                                trigger:
                                section,

                                start: isTouchDevice
                                    ? 'top 88%'
                                    : 'top 94%',

                                end: isTouchDevice
                                    ? 'top 62%'
                                    : 'top 52%',

                                scrub: isTouchDevice
                                    ? 0.35
                                    : 0.75,
                            },
                        });

                    /*
                     * Section fade / movement.
                     */
                    timeline.fromTo(
                        section,
                        {
                            opacity: 0.82,

                            y: 8,
                        },
                        {
                            opacity: 1,

                            y: 0,

                            ease: 'none',

                            duration: 1,
                        },
                        0,
                    );

                    /*
                     * Section content movement.
                     */
                    timeline.fromTo(
                        content,
                        {
                            y:
                                index === 0
                                    ? 18
                                    : 20,

                            scale: 0.985,

                            rotateX: 1.5,
                        },
                        {
                            y: 0,

                            scale: 1,

                            rotateX: 0,

                            ease: 'none',

                            duration: 1,
                        },
                        0,
                    );
                },
            );

            /*
             * Force ScrollTrigger to recalculate all
             * section positions after the invitation has
             * entered the DOM.
             */
            ScrollTrigger.refresh();
        }

        /*
         * --------------------------------------------------------
         * CLEANUP
         * --------------------------------------------------------
         */

        return () => {
            /*
             * Destroy Lenis only when desktop created it.
             */
            if (lenis) {
                lenis.destroy();
            }

            /*
             * Stop desktop RAF.
             */
            if (rafId !== null) {
                cancelAnimationFrame(
                    rafId,
                );
            }

            lenisRef.current = null;

            /*
             * Kill only ScrollTriggers belonging to the
             * invitation content.
             *
             * This avoids interfering with other GSAP
             * animations/components.
             */
            ScrollTrigger.getAll().forEach(
                (trigger) => {
                    const element =
                        trigger.trigger;

                    if (
                        element instanceof
                        HTMLElement &&
                        element.closest(
                            '#invitation-content',
                        )
                    ) {
                        trigger.kill();
                    }
                },
            );
        };
    }, [envelopeOpened]);

    /*
     * ============================================================
     * ENVELOPE CALLBACKS
     * ============================================================
     */

    const handleEnvelopeReveal =
        useCallback(() => {
            setEnvelopeOpened(true);
        }, []);

    const handleEnvelopeComplete =
        useCallback(() => {
            setEnvelopeVisible(false);
        }, []);

    /*
     * ============================================================
     * PETAL CALLBACKS
     * ============================================================
     */

    const handlePetalBurst =
        useCallback(() => {
            setPetalBurst(true);
        }, []);

    const handleBurstEnd =
        useCallback(() => {
            setPetalBurst(false);
        }, []);

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <div
            className="relative min-h-screen"
            style={{
                background: '#F7F0E5',
            }}
        >
            {/*
             * ====================================================
             * MUSIC CONTROL
             * ====================================================
             */}

            {musicVisible && (
                <button
                    type="button"
                    onClick={toggleMusic}
                    aria-label={
                        musicPlaying
                            ? 'Mute background music'
                            : 'Play background music'
                    }
                    className="wedding-music-control"
                >
                    <span
                        className={
                            musicPlaying
                                ? 'music-icon music-icon-playing'
                                : 'music-icon music-icon-muted'
                        }
                    >
                        {musicPlaying
                            ? '♫'
                            : '♪'}
                    </span>
                </button>
            )}

            {/*
             * ====================================================
             * PETALS
             * ====================================================
             */}

            <PetalSystem
                burst={petalBurst}
                onBurstEnd={
                    handleBurstEnd
                }
            />

            {/*
             * ====================================================
             * ENVELOPE
             * ====================================================
             */}

            {envelopeVisible && (
                <EnvelopeExperience
                    onReveal={
                        handleEnvelopeReveal
                    }
                    onComplete={
                        handleEnvelopeComplete
                    }
                    petalBurst={
                        handlePetalBurst
                    }
                    onMusicStart={
                        startMusic
                    }
                />
            )}

            {/*
             * ====================================================
             * MAIN INVITATION
             * ====================================================
             */}

            <div
                id="invitation-content"
                ref={mainRef}
                className={`invitation-content invitation-main ${
                    envelopeOpened
                        ? 'invitation-main-visible'
                        : ''
                }`}
                style={{
                    opacity:
                        envelopeOpened
                            ? 1
                            : 0,
                }}
            >
                <InvitationIntro />

                <GiftReveal />

                <QuranSection />

                <Countdown
                    target={
                        invitation.countdownTarget
                    }
                />

                <ClosingSection />
            </div>
        </div>
    );
}