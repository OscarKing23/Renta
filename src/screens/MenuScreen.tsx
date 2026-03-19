import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { crossAlert } from '../utils/crossAlert';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useAuth } from '../context';

type MenuItem = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    screen?: string;
    color?: string;
    onPress?: () => void;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

export const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, logout } = useAuth();

    const MENU_SECTIONS: MenuSection[] = [
        {
            title: 'Mis pedidos',
            items: [
                { icon: 'cube-outline', label: 'Pedidos activos', screen: 'Compras' },
                { icon: 'time-outline', label: 'Historial de rentas', screen: 'Compras' },
                { icon: 'document-text-outline', label: 'Cotizaciones', screen: 'Carrito' },
            ],
        },
        {
            title: 'Servicios',
            items: [
                { icon: 'grid-outline', label: 'Catálogo completo', screen: 'Categorías' },
                { icon: 'gift-outline', label: 'Paquetes para eventos', screen: 'Categorías' },
                { icon: 'pricetag-outline', label: 'Promociones', color: '#4ADE80' },
            ],
        },
        {
            title: 'Soporte',
            items: [
                { icon: 'chatbubble-ellipses-outline', label: 'Chat en vivo', color: '#60A5FA' },
                { icon: 'help-circle-outline', label: 'Preguntas frecuentes' },
                { icon: 'call-outline', label: 'Contacto', screen: 'Contact' },
            ],
        },
        {
            title: 'Cuenta',
            items: [
                { icon: 'person-outline', label: 'Mi perfil', screen: 'Mi cuenta' },
                { icon: 'location-outline', label: 'Direcciones guardadas', screen: 'Mi cuenta' },
                { icon: 'card-outline', label: 'Métodos de pago', screen: 'Mi cuenta' },
                { icon: 'settings-outline', label: 'Configuración', screen: 'Configuración' },
            ],
        },
        {
            title: 'Información',
            items: [
                { icon: 'document-text-outline', label: 'Términos y condiciones' },
                { icon: 'arrow-undo-outline', label: 'Política de devoluciones' },
                { icon: 'business-outline', label: 'Sobre nosotros' },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <Header title="Menú" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Perfil resumido */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={28} color={colors.primary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.nombre || 'Usuario'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || ''}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={1}
                        style={styles.profileEditBtn}
                        onPress={() => navigation.navigate('Configuración')}
                    >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Secciones del menú */}
                {MENU_SECTIONS.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.card}>
                            {section.items.map((item, idx) => (
                                <TouchableOpacity activeOpacity={1}
                                    key={item.label}
                                    style={[
                                        styles.menuRow,
                                        idx < section.items.length - 1 && styles.menuRowBorder,
                                    ]}
                                    
                                    onPress={() => {
                                        if (item.screen) {
                                            navigation.navigate(item.screen);
                                        } else if (item.onPress) {
                                            item.onPress();
                                        }
                                    }}
                                >
                                    <View style={[styles.menuIconCircle, { backgroundColor: `${item.color || colors.primary}15` }]}>
                                        <Ionicons
                                            name={item.icon}
                                            size={20}
                                            color={item.color || colors.primary}
                                        />
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Cerrar sesión */}
                <View style={styles.section}>
                    <TouchableOpacity activeOpacity={1}
                        style={styles.logoutBtn}
                        
                        onPress={() => {
                            crossAlert(
                                'Cerrar sesión',
                                '¿Estás seguro de que deseas cerrar sesión?',
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout() },
                                ]
                            );
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    // Perfil
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Spacing.lg,
        marginBottom: 0,
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: `${colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    profileName: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    profileEmail: {
        ...Typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    profileEditBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Secciones
    section: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.caption,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    menuRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    menuLabel: {
        ...Typography.body,
        color: colors.textPrimary,
        flex: 1,
    },
    // Logout
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    logoutText: {
        ...Typography.subtitle,
        color: '#EF4444',
    },
});
