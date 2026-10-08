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
    const [envelopeOpened, setEnvelopeOpened] = useState(false);
    const [envelopeVisible, setEnvelopeVisible] = useState(true);
    const [petalBurst, setPetalBurst] = useState(false);

    const [musicPlaying, setMusicPlaying] = useState(false);
    const [musicVisible, setMusicVisible] = useState(false);

    const mainRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    /*
     * Tracks whether the user has explicitly muted the music.
     *
     * This has priority over the automatic Quran behavior.
     */
    const userMutedRef = useRef(false);

    /*
     * Tracks whether music was automatically paused because
     * the Quran section entered the central reading zone.
     */
    const quranPausedRef = useRef(false);

    /*
     * Prevents multiple fade animations from fighting each other.
     */
    const musicFadeRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const audio = new Audio('/audio/music.mp3');

        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;

        audioRef.current = audio;

        return () => {
            musicFadeRef.current?.kill();

            audio.pause();
            audio.currentTime = 0;
            audioRef.current = null;
        };
    }, []);

    /*
     * Start music after the wax seal is pressed.
     */
    const startMusic = useCallback(() => {
        const audio = audioRef.current;

        if (!audio || userMutedRef.current) {
            return;
        }

        audio
            .play()
            .then(() => {
                setMusicPlaying(true);

                musicFadeRef.current?.kill();

                musicFadeRef.current = gsap.to(audio, {
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
     * Manual music toggle.
     *
     * Manual mute has priority over all automatic Quran behavior.
     */
    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        /*
         * Currently playing -> USER MUTES.
         */
        if (!audio.paused) {
            userMutedRef.current = true;

            musicFadeRef.current?.kill();

            musicFadeRef.current = gsap.to(audio, {
                volume: 0,
                duration: 0.45,
                ease: 'power2.out',
                onComplete: () => {
                    audio.pause();
                    setMusicPlaying(false);
                },
            });

            return;
        }

        /*
         * Currently paused -> USER ENABLES MUSIC.
         *
         * This clears the manual mute state.
         */
        userMutedRef.current = false;

        audio
            .play()
            .then(() => {
                setMusicPlaying(true);

                musicFadeRef.current?.kill();

                musicFadeRef.current = gsap.to(audio, {
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
     * Show the music control only after the envelope has
     * completely transitioned into the main invitation.
     */
    useEffect(() => {
        if (!envelopeVisible && envelopeOpened) {
            const timer = window.setTimeout(() => {
                setMusicVisible(true);
            }, 450);

            return () => {
                window.clearTimeout(timer);
            };
        }
    }, [envelopeVisible, envelopeOpened]);

    /*
     * Quran music behavior.
     *
     * IMPORTANT:
     *
     * We do NOT check whether the entire Quran section is visible.
     *
     * Instead, IntersectionObserver creates a virtual "reading zone"
     * in the CENTER of the viewport.
     *
     * rootMargin:
     *   -35% top
     *   -35% bottom
     *
     * leaves approximately the central 30% of the screen as the
     * active reading zone.
     *
     * Therefore:
     *
     * Quran enters center -> pause music.
     * Quran leaves center -> resume music.
     *
     * This works even when the Quran section is taller than the
     * viewport, which is common on mobile.
     */
    useEffect(() => {
        if (!envelopeOpened) {
            return;
        }

        const quranSection =
            document.getElementById('quran-section');

        if (!quranSection) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (!entry) {
                    return;
                }

                const audio = audioRef.current;

                if (!audio) {
                    return;
                }

                /*
                 * Quran is inside the central reading zone.
                 */
                if (entry.isIntersecting) {
                    /*
                     * If the user manually muted the music,
                     * do absolutely nothing.
                     */
                    if (userMutedRef.current) {
                        return;
                    }

                    /*
                     * Already automatically paused.
                     */
                    if (quranPausedRef.current) {
                        return;
                    }

                    quranPausedRef.current = true;

                    musicFadeRef.current?.kill();

                    musicFadeRef.current = gsap.to(audio, {
                        volume: 0,
                        duration: 0.65,
                        ease: 'power2.out',
                        onComplete: () => {
                            /*
                             * Only pause if Quran is still responsible
                             * for the pause and the user hasn't manually
                             * muted/unmuted in the meantime.
                             */
                            if (
                                quranPausedRef.current &&
                                !userMutedRef.current
                            ) {
                                audio.pause();
                                setMusicPlaying(false);
                            }
                        },
                    });

                    return;
                }

                /*
                 * Quran has left the central reading zone.
                 *
                 * Resume music automatically unless the user
                 * explicitly muted it.
                 */
                if (
                    quranPausedRef.current &&
                    !userMutedRef.current
                ) {
                    quranPausedRef.current = false;

                    audio
                        .play()
                        .then(() => {
                            setMusicPlaying(true);

                            musicFadeRef.current?.kill();

                            musicFadeRef.current = gsap.to(
                                audio,
                                {
                                    volume: 0.28,
                                    duration: 0.9,
                                    ease: 'power2.out',
                                },
                            );
                        })
                        .catch((error) => {
                            console.warn(
                                'Music could not resume after Quran section:',
                                error,
                            );
                        });
                }
            },
            {
                /*
                 * Creates a central reading zone:
                 *
                 * 0%  -------------------- 100%
                 *
                 *       [ 30% zone ]
                 *
                 *       top -35%
                 *       bottom -35%
                 */
                root: null,
                rootMargin: '-35% 0px -35% 0px',
                threshold: 0,
            },
        );

        observer.observe(quranSection);

        return () => {
            observer.disconnect();
        };
    }, [envelopeOpened]);

    /*
     * Lenis + ScrollTrigger.
     */
    useEffect(() => {
        if (!envelopeOpened) {
            return;
        }

        const isMobile = window
            .matchMedia('(max-width: 767px)')
            .matches;

        const lenis = new Lenis({
            lerp: isMobile ? 0.14 : 0.10,
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 1,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        const rafId = {
            current: 0,
        };

        const raf = (time: number) => {
            lenis.raf(time);
            rafId.current = requestAnimationFrame(raf);
        };

        rafId.current = requestAnimationFrame(raf);

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

            const sections =
                gsap.utils.toArray<HTMLElement>(
                    '#invitation-content > section',
                );

            sections.forEach((section, index) => {
                const content =
                    section.firstElementChild as HTMLElement | null;

                if (!content) {
                    return;
                }

                gsap.fromTo(
                    section,
                    {
                        opacity: 0.82,
                        y: 8,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 94%',
                            end: 'top 56%',
                            scrub: 0.75,
                        },
                    },
                );

                gsap.fromTo(
                    content,
                    {
                        y: index === 0 ? 18 : 20,
                        scale: 0.985,
                        rotateX: 1.5,
                    },
                    {
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 90%',
                            end: 'top 52%',
                            scrub: 0.75,
                        },
                    },
                );
            });

            ScrollTrigger.refresh();
        }

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId.current);
        };
    }, [envelopeOpened]);

    const handleEnvelopeReveal = useCallback(() => {
        setEnvelopeOpened(true);
    }, []);

    const handleEnvelopeComplete = useCallback(() => {
        setEnvelopeVisible(false);
    }, []);

    const handlePetalBurst = useCallback(() => {
        setPetalBurst(true);
    }, []);

    const handleBurstEnd = useCallback(() => {
        setPetalBurst(false);
    }, []);

    return (
        <div
            className="relative min-h-screen"
            style={{
                background: '#F7F0E5',
            }}
        >
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
                        {musicPlaying ? '♫' : '♪'}
                    </span>
                </button>
            )}

            <PetalSystem
                burst={petalBurst}
                onBurstEnd={handleBurstEnd}
            />

            {envelopeVisible && (
                <EnvelopeExperience
                    onReveal={handleEnvelopeReveal}
                    onComplete={handleEnvelopeComplete}
                    petalBurst={handlePetalBurst}
                    onMusicStart={startMusic}
                />
            )}

            <div
                id="invitation-content"
                ref={mainRef}
                className={`invitation-content invitation-main ${
                    envelopeOpened
                        ? 'invitation-main-visible'
                        : ''
                }`}
                style={{
                    opacity: envelopeOpened ? 1 : 0,
                }}
            >
                <InvitationIntro />

                <GiftReveal />

                <QuranSection />

                <Countdown
                    target={invitation.countdownTarget}
                />

                <ClosingSection />
            </div>
        </div>
    );
}