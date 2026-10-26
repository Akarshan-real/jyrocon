export const FONTS = {
  anta: 'Anta-Regular',
  rubikFade: 'Rubik80sFade-Regular',
  wallpoet: 'Wallpoet-Regular',
} as const;

export const TYPOGRAPHY = {
  cyberHeader: {
    fontFamily: FONTS.wallpoet,
    fontSize: 24,
    color: '#ffffff',
    letterSpacing: 2,
  },
  title: {
    fontFamily: FONTS.anta,
    fontSize: 20,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  body: {
    fontFamily: FONTS.anta,
    fontSize: 14,
    color: '#e0e0e0',
  },
  displayEffect: {
    fontFamily: FONTS.rubikFade,
    fontSize: 28,
    color: '#00e5ff',
  },
} as const;
