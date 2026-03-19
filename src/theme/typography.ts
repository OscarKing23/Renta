import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
    h1: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    body: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22,
    },
    bodySmall: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
    },
    caption: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    button: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    price: {
        fontSize: 22,
        fontWeight: '700',
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};
