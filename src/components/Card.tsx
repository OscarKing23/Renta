import React, { useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

interface CardProps {
    title: string;
    price: string;
    image: string;
    onPress?: () => void;
    index?: number;
}

export const Card: React.FC<CardProps> = ({ title, price, image, onPress, index = 0 }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY }, { scale: scaleAnim }],
        }}>
            <TouchableOpacity activeOpacity={1}
                style={styles.container}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>{price}</Text>
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={styles.subtitle}>Por día</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.85,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    priceBadge: {
        position: 'absolute',
        bottom: Spacing.sm,
        right: Spacing.sm,
        backgroundColor: colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    priceText: {
        ...Typography.caption,
        color: colors.textOnPrimary,
        fontWeight: '700',
    },
    info: {
        padding: Spacing.md,
    },
    title: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.caption,
        color: colors.textMuted,
    },
});
