import React, { useMemo, useRef, useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';

interface ButtonProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    const onPressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    const isDisabled = disabled || loading;

    if (variant === 'primary') {
        return (
            <Animated.View style={[
                fullWidth && { width: '100%' },
                { transform: [{ scale: scaleAnim }], opacity: isDisabled ? 0.5 : 1 },
            ]}>
                <TouchableOpacity activeOpacity={1}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    
                    disabled={isDisabled}
                    style={[fullWidth && { width: '100%' }]}
                >
                    <LinearGradient
                        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.button, fullWidth && { width: '100%' }]}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.textOnPrimary} size="small" />
                        ) : (
                            <>
                                {icon && <>{icon}</>}
                                <Text style={styles.primaryText}>{title}</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[
            fullWidth && { width: '100%' },
            { transform: [{ scale: scaleAnim }], opacity: isDisabled ? 0.5 : 1 },
        ]}>
            <TouchableOpacity activeOpacity={1}
                style={[
                    styles.button,
                    variant === 'outline' && styles.outline,
                    variant === 'ghost' && styles.ghost,
                    fullWidth && { width: '100%' },
                ]}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                
                disabled={isDisabled}
            >
                {icon && <>{icon}</>}
                <Text
                    style={[
                        styles.primaryText,
                        variant === 'outline' && styles.outlineText,
                        variant === 'ghost' && styles.ghostText,
                    ]}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    primaryText: {
        ...Typography.button,
        color: colors.textOnPrimary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    ghostText: {
        color: colors.primary,
    },
});
