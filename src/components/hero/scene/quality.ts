export type Quality = {
  particles: number;
  rings: number;
  coreDetail: number;
  links: boolean;
  scale: number;
  maxDpr: number;
  envResolution: number;
};

const QUALITY = {
  desktop: {
    particles: 1600,
    rings: 3,
    coreDetail: 1,
    links: true,
    scale: 1,
    maxDpr: 2,
    envResolution: 128,
  },
  tablet: {
    particles: 700,
    rings: 2,
    coreDetail: 1,
    links: true,
    scale: 0.95,
    maxDpr: 1.5,
    envResolution: 64,
  },
  mobile: {
    particles: 260,
    rings: 1,
    coreDetail: 0,
    links: false,
    scale: 1.15,
    maxDpr: 1.5,
    envResolution: 32,
  },
} satisfies Record<string, Quality>;

// Picked once on mount from viewport width and rough device capability.
export function getQuality(): Quality {
  const width = window.innerWidth;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowPower =
    (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;

  if (width < 768) return QUALITY.mobile;
  if (width < 1280 || lowPower) return QUALITY.tablet;
  return QUALITY.desktop;
}
