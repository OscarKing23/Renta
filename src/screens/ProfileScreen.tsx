import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const MENU_ITEMS = [
    {
        id: '1',
        title: 'Mis Pedidos',
        icon: 'receipt-outline' as const,
        badge: '3',
    },
    {
        id: '2',
        title: 'Mis Favoritos',
        icon: 'heart-outline' as const,
    },
    {
        id: '3',
        title: 'Historial',
        icon: 'time-outline' as const,
    },
    {
        id: '4',
        title: 'Configuración',
        icon: 'settings-outline' as const,
    },
    {
        id: '5',
        title: 'Ayuda y Soporte',
        icon: 'help-circle-outline' as const,
    },
    {
        id: '6',
        title: 'Términos y Condiciones',
        icon: 'document-text-outline' as const,
    },
];

export const ProfileScreen: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Profile Header */}
                <LinearGradient
                    colors={['rgba(212,168,67,0.12)', 'transparent']}
                    style={[styles.profileHeader, { paddingTop: insets.top + Spacing.lg }]}
                >
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
                            style={styles.avatarGradient}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>RE</Text>
                            </View>
                        </LinearGradient>
                        <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.name}>RentaEvent Pro</Text>
                    <Text style={styles.email}>contacto@rentaevent.com</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>156</Text>
                            <Text style={styles.statLabel}>Pedidos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>4.9</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>2 años</Text>
                            <Text style={styles.statLabel}>Miembro</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity activeOpacity={1} key={item.id} style={styles.menuItem} >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon} size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            {item.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={Colors.textMuted}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity activeOpacity={1} style={styles.logoutButton} >
                    <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    // Profile Header
    profileHeader: {
        alignItems: 'center',
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatarGradient: {
        width: 88,
        height: 88,
        borderRadius: 44,
        padding: 3,
    },
    avatar: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...Typography.h2,
        color: Colors.primary,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.success,
        borderWidth: 3,
        borderColor: Colors.background,
    },
    name: {
        ...Typography.h2,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    email: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginBottom: Spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        width: '100%',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        ...Typography.subtitle,
        color: Colors.primary,
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.border,
    },
    // Menu
    menuSection: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    menuTitle: {
        ...Typography.body,
        color: Colors.textPrimary,
        flex: 1,
    },
    badge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    badgeText: {
        ...Typography.caption,
        color: Colors.textOnPrimary,
        fontSize: 11,
        fontWeight: '700',
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(248,113,113,0.3)',
        gap: Spacing.sm,
    },
    logoutText: {
        ...Typography.body,
        color: Colors.error,
        fontWeight: '600',
    },
});
