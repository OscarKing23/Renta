import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';

interface HeaderProps {
    title: string;
    showSearch?: boolean;
    showBack?: boolean;
    onBackPress?: () => void;
    onHomePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showSearch = false,
    showBack = false,
    onBackPress,
    onHomePress,
}) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    return (
        <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
            <View style={styles.topRow}>
                {showBack ? (
                    <View style={styles.navButtons}>
                        <TouchableOpacity activeOpacity={1} onPress={onHomePress} style={styles.backButton}>
                            <Ionicons name="home" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={onBackPress} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.logoContainer}>
                        <Ionicons name="diamond" size={22} color={colors.primary} />
                    </View>
                )}
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity activeOpacity={1} style={styles.notifButton}>
                    <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
            {showSearch && (
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar sillas, mesas, paquetes..."
                        placeholderTextColor={colors.textMuted}
                    />
                    <TouchableOpacity activeOpacity={1} style={styles.filterButton}>
                        <Ionicons name="options-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const makeStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Spacing.sm,
        },
        logoContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.primary,
        },
        navButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        backButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            ...Typography.h3,
            color: colors.textPrimary,
            flex: 1,
            marginLeft: Spacing.md,
        },
        notifButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: BorderRadius.md,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm + 2,
            borderWidth: 1,
            borderColor: colors.border,
        },
        searchInput: {
            flex: 1,
            ...Typography.bodySmall,
            color: colors.textPrimary,
            marginLeft: Spacing.sm,
            paddingVertical: 0,
        },
        filterButton: {
            marginLeft: Spacing.sm,
        },
    });
