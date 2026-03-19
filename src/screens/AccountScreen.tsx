import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { crossAlert } from '../utils/crossAlert';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useAuth } from '../context';

export const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        crossAlert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout() },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Mi cuenta" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />

            <View style={styles.block}>
                {/* Avatar */}
                <View style={styles.avatarRow}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={32} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{user?.nombre || 'Usuario'}</Text>
                        <Text style={styles.description}>{user?.email || ''}</Text>
                    </View>
                </View>

                {/* Datos */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{user?.nombre || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Correo</Text>
                    <Text style={styles.value}>{user?.email || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Teléfono</Text>
                    <Text style={styles.value}>{user?.telefono || '-'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Dirección</Text>
                    <Text style={styles.value}>{user?.direccion || 'Sin registrar'}</Text>
                </View>

                {/* Cerrar sesión */}
                <TouchableOpacity activeOpacity={1}
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    
                >
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    block: {
        margin: Spacing.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        gap: Spacing.sm,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.sm,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: `${colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...Typography.h3,
        color: colors.textPrimary,
    },
    description: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        marginTop: 2,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 4,
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    primaryButtonText: {
        ...Typography.button,
        color: colors.textOnPrimary,
        fontSize: 14,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 4,
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    secondaryButtonText: {
        ...Typography.button,
        color: colors.textPrimary,
        fontSize: 14,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        paddingVertical: Spacing.sm + 4,
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    logoutText: {
        ...Typography.button,
        color: '#EF4444',
        fontSize: 14,
    },
    infoRow: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: Spacing.sm,
    },
    label: {
        ...Typography.caption,
        color: colors.textMuted,
    },
    value: {
        ...Typography.body,
        color: colors.textPrimary,
        marginTop: 2,
    },
});
