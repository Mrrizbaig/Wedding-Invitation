// Animation constants — edit here to tune the entire site

export const EASING = {
  elegant: 'power3.inOut',
  reveal: 'power2.out',
  exit: 'power2.in',
  envelopeFlap: 'power2.inOut',
  cardRise: 'power3.out',
  scrollReveal: 'power2.out',
  ornamentDraw: 'power1.inOut',
  gentle: 'sine.inOut',
} as const;

export const DURATION = {
  // Envelope opening
  sealReact: 0.15,
  sealCrack: 0.35,
  flapOpen: 0.85,
  cardRise: 0.75,
  envelopeRecede: 0.6,
  cardScale: 0.9,

  // Content reveals
  sectionReveal: 0.8,
  staggerChild: 0.12,
  ornamentDraw: 1.4,
  pageTransition: 0.5,

  // Countdown
  countdownFlip: 0.28,
} as const;

export const DELAY = {
  sealCrack: 0.15,
  flapAfterSeal: 0.45,
  cardAfterFlap: 0.85,
  envelopeRecede: 1.2,
  cardExpand: 1.55,
  contentAppear: 2.3,
} as const;

export const SCROLL = {
  start: 'top 82%',
  end: 'bottom 15%',
  scrubLight: 0.5,
} as const;

/** Returns true when the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Returns 0.001 (instant) when reduced motion is preferred, else the given duration */
export function safeDuration(d: number): number {
  return prefersReducedMotion() ? 0.001 : d;
}
