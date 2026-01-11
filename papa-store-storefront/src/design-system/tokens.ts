/**
 * Pa-Pa Baby Shop Design System
 * Design Tokens - Colors, Typography, Spacing, Shadows
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Soft Coral Pink (Warm, inviting, great for CTAs)
  primary: {
    50: '#FFF5F3',
    100: '#FFE8E3',
    200: '#FFD4CC',
    300: '#FFB3A3',
    400: '#FF8A73',
    500: '#FF6B52', // Main primary
    600: '#E5503A',
    700: '#BF3D2B',
    800: '#992F21',
    900: '#732318',
  },

  // Secondary - Soft Baby Blue
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Main secondary
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Accent 1 - Mint Green (Fresh, clean)
  mint: {
    50: '#F0FDF9',
    100: '#CCFBEF',
    200: '#99F6E0',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Main mint
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Accent 2 - Warm Yellow (Sunny, cheerful)
  sunny: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308', // Main sunny
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
  },

  // Accent 3 - Soft Lavender (Gentle, calming)
  lavender: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7', // Main lavender
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Accent 4 - Peachy Blush
  peach: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main peach
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Neutrals - Warm Gray (Not cold, baby-friendly)
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAF9', // Warm off-white
    tertiary: '#F5F5F4',
    accent: '#FFF5F3', // Light coral tint
  },

  // Semantic colors
  semantic: {
    success: {
      light: '#D1FAE5',
      main: '#10B981',
      dark: '#059669',
    },
    warning: {
      light: '#FEF3C7',
      main: '#F59E0B',
      dark: '#D97706',
    },
    error: {
      light: '#FEE2E2',
      main: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#DBEAFE',
      main: '#3B82F6',
      dark: '#2563EB',
    },
  },

  // Special colors
  sale: '#EF4444',
  new: '#10B981',
  bestseller: '#F59E0B',
  lowStock: '#F97316',
}

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font families - 3-tier typography hierarchy (with Cyrillic support)
  fonts: {
    // Logo & Big Titles - high energy, fun, child-like
    display: '"Shantell Sans", cursive',
    // Product Names - soft, rounded, easy to scan
    heading: '"Comfortaa", system-ui, sans-serif',
    // Descriptions & Prices - clean, trustworthy, mobile-friendly
    body: '"Nunito", system-ui, sans-serif',
    // Monospace for prices/numbers
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  // Font sizes (in rem)
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Heading styles
  headings: {
    h1: {
      fontSize: '3rem',      // 48px
      fontWeight: '800',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',   // 36px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',  // 30px
      fontWeight: '700',
      lineHeight: '1.375',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',    // 24px
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '0',
    },
    h5: {
      fontSize: '1.25rem',   // 20px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1.125rem',  // 18px
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: '1.125rem',  // 18px
      lineHeight: '1.75',
    },
    base: {
      fontSize: '1rem',      // 16px
      lineHeight: '1.5',
    },
    small: {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.5',
    },
  },

  // Utility text styles
  utility: {
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.25',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: '600',
      lineHeight: '1',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
}

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
}

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px - Slightly rounded, playful
  md: '0.625rem',   // 10px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
}

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Playful colored shadows
  primary: '0 4px 14px 0 rgb(255 107 82 / 0.25)',
  secondary: '0 4px 14px 0 rgb(14 165 233 / 0.25)',
}

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
}

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
}
