import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface CategoryChipProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    isActive?: boolean;
    onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    label,
    icon,
    isActive = false,
    onPress,
}) => {
    return (
        <TouchableOpacity activeOpacity={1}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={onPress}
            
        >
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                    name={icon}
                    size={18}
                    color={isActive ? Colors.textOnPrimary : Colors.primary}
                />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primaryLight,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    iconContainerActive: {
        backgroundColor: Colors.primaryDark,
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    labelActive: {
        color: Colors.textOnPrimary,
    },
});
