// Responsive utility functions

export const responsive = {
  // Get responsive class based on screen size
  getClass: (classes: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }) => {
    return [
      classes.default,
      classes.sm && `sm:${classes.sm}`,
      classes.md && `md:${classes.md}`,
      classes.lg && `lg:${classes.lg}`,
      classes.xl && `xl:${classes.xl}`,
    ]
      .filter(Boolean)
      .join(' ');
  },

  // Get responsive grid columns
  gridCols: (cols: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }) => {
    return [
      cols.default && `grid-cols-${cols.default}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
    ]
      .filter(Boolean)
      .join(' ');
  },

  // Get responsive spacing
  spacing: (space: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }) => {
    return [
      space.default,
      space.sm && `sm:${space.sm}`,
      space.md && `md:${space.md}`,
      space.lg && `lg:${space.lg}`,
      space.xl && `xl:${space.xl}`,
    ]
      .filter(Boolean)
      .join(' ');
  },

  // Get responsive text size
  textSize: (sizes: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }) => {
    return [
      sizes.default,
      sizes.sm && `sm:${sizes.sm}`,
      sizes.md && `md:${sizes.md}`,
      sizes.lg && `lg:${sizes.lg}`,
      sizes.xl && `xl:${sizes.xl}`,
    ]
      .filter(Boolean)
      .join(' ');
  },
};

// Clamp function for responsive values
export function clamp(min: number, val: number, max: number): number {
  return Math.min(Math.max(min, val), max);
}

// Convert viewport units to pixels
export function vwToPx(vw: number, viewportWidth = window.innerWidth): number {
  return (vw * viewportWidth) / 100;
}

export function vhToPx(vh: number, viewportHeight = window.innerHeight): number {
  return (vh * viewportHeight) / 100;
}

// Responsive breakpoint detection
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function getBreakpoint(): keyof typeof breakpoints | 'xs' {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

export function isBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

// Touch device detection
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

// PWA detection
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

// Safe area calculations
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
}