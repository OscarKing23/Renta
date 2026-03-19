import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';

/* ── Servicios ── */
const SERVICES = [
    { id: '1', icon: 'people-outline' as const, title: 'Renta de mobiliario', desc: 'Sillas, mesas, manteles y más para cualquier tipo de evento.' },
    { id: '2', icon: 'balloon-outline' as const, title: 'Brincolines e inflables', desc: 'Diversión garantizada para los más pequeños de la fiesta.' },
    { id: '3', icon: 'flower-outline' as const, title: 'Decoración y arreglos', desc: 'Centros de mesa, arreglos florales y decoración temática.' },
    { id: '4', icon: 'car-outline' as const, title: 'Entrega y montaje', desc: 'Llevamos, armamos y recogemos. Tú solo disfruta tu evento.' },
    { id: '5', icon: 'pricetag-outline' as const, title: 'Paquetes todo incluido', desc: 'Combina mobiliario, decoración y entretenimiento con descuento.' },
    { id: '6', icon: 'headset-outline' as const, title: 'Asesoría personalizada', desc: 'Te ayudamos a planear cada detalle de tu evento.' },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Header title="Alquiler de eventos" />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Buscador */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar sillas, mesas, manteles, inflables..."
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                {/* Botones de navegación */}
                <View style={styles.navRow}>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Inicio')}>
                        <Ionicons name="home-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Inicio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Categorías')}>
                        <Ionicons name="grid-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Categorías</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Carrito')}>
                        <Ionicons name="cart-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Carrito</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Compras')}>
                        <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Compras</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Mi cuenta')}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Mi cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Menú')}>
                        <Ionicons name="menu-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Menú</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.navBtn} onPress={() => navigation.navigate('Configuración')}>
                        <Ionicons name="settings-outline" size={20} color={colors.primary} />
                        <Text style={styles.navBtnText}>Config.</Text>
                    </TouchableOpacity>
                </View>

                {/* Banner */}
                <TouchableOpacity activeOpacity={1}  style={styles.heroBanner}>
                    <LinearGradient
                        colors={['rgba(212,168,67,0.18)', 'rgba(212,168,67,0.05)', colors.background]}
                        style={styles.heroGradient}
                    >
                        <Text style={styles.heroTitle}>Catálogo para eventos</Text>
                        <Text style={styles.heroSubtitle}>Renta por día con entrega programada</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Servicios */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nuestros servicios</Text>
                </View>
                <View style={styles.servicesGrid}>
                    {SERVICES.map((service) => (
                        <View key={service.id} style={styles.serviceCard}>
                            <View style={styles.serviceIconCircle}>
                                <Ionicons name={service.icon} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.serviceTitle}>{service.title}</Text>
                            <Text style={styles.serviceDesc}>{service.desc}</Text>
                        </View>
                    ))}
                </View>

                {/* Quiénes somos */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quiénes somos</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        Somos una empresa especializada en renta de mobiliario y artículos para
                        eventos sociales y corporativos. Ofrecemos montaje, entrega puntual y
                        atención personalizada para que tu evento sea un éxito.
                    </Text>
                </View>

                {/* Contacto */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Contacto</Text>
                </View>
                <View style={styles.contactCard}>
                    <TouchableOpacity activeOpacity={1} style={styles.contactItem} >
                        <Ionicons name="call-outline" size={18} color={colors.primary} />
                        <Text style={styles.contactText}>Teléfono: +52 55 1234 5678</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.contactItem} >
                        <Ionicons name="logo-whatsapp" size={18} color={colors.success} />
                        <Text style={styles.contactText}>WhatsApp: +52 55 1234 5678</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.contactItem} >
                        <Ionicons name="mail-outline" size={18} color={colors.info} />
                        <Text style={styles.contactText}>Correo: contacto@rentaeventos.com</Text>
                    </TouchableOpacity>
                </View>

                {/* Horarios de atención */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Horarios de atención</Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.scheduleRow}>
                        <Ionicons name="time-outline" size={18} color={colors.primary} />
                        <Text style={styles.scheduleDay}>Lunes a Viernes</Text>
                        <Text style={styles.scheduleTime}>9:00 – 19:00</Text>
                    </View>
                    <View style={styles.scheduleDivider} />
                    <View style={styles.scheduleRow}>
                        <Ionicons name="time-outline" size={18} color={colors.primary} />
                        <Text style={styles.scheduleDay}>Sábados</Text>
                        <Text style={styles.scheduleTime}>9:00 – 15:00</Text>
                    </View>
                    <View style={styles.scheduleDivider} />
                    <View style={styles.scheduleRow}>
                        <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                        <Text style={[styles.scheduleDay, { color: colors.textMuted }]}>Domingos</Text>
                        <Text style={[styles.scheduleTime, { color: colors.textMuted }]}>Cerrado</Text>
                    </View>
                </View>

                {/* Ubicación */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Ubicación</Text>
                </View>
                <View style={styles.infoCard}>
                    {/* Mapa de Google Maps */}
                    <TouchableOpacity activeOpacity={1}
                        
                        onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=19.4326,-99.1520')}
                        style={styles.mapContainer}
                    >
                        <Image
                            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=19.4326,-99.1520&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C19.4326,-99.1520&key=&style=feature:all%7Celement:geometry%7Ccolor:0x242f3e&style=feature:all%7Celement:labels.text.stroke%7Ccolor:0x242f3e&style=feature:all%7Celement:labels.text.fill%7Ccolor:0x746855' }}
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                        <View style={styles.mapOverlay}>
                            <Ionicons name="map" size={32} color={colors.primary} />
                            <Text style={styles.mapOverlayText}>Toca para ver en Google Maps</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.locationRow, { marginTop: Spacing.md }]}>
                        <Ionicons name="location" size={20} color={colors.primary} />
                        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                            <Text style={styles.locationMainText}>Av. Reforma #1250, Col. Centro</Text>
                            <Text style={styles.locationSubText}>Ciudad de México, CP 06000</Text>
                        </View>
                    </View>
                    <View style={[styles.locationRow, { marginTop: Spacing.sm }]}>
                        <Ionicons name="navigate-outline" size={18} color={colors.textMuted} />
                        <Text style={[styles.locationSubText, { marginLeft: Spacing.sm }]}>A 5 min de la estación Juárez del Metro</Text>
                    </View>

                    <TouchableOpacity activeOpacity={1}
                        style={styles.directionsButton}
                        
                        onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&destination=19.4326,-99.1520')}
                    >
                        <Ionicons name="navigate" size={18} color={colors.background} />
                        <Text style={styles.directionsButtonText}>Cómo llegar</Text>
                    </TouchableOpacity>
                </View>

                {/* Derechos reservados */}
                <Text style={styles.copyright}>
                    © 2026 Alquiler de Eventos. Todos los derechos reservados.
                </Text>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
    },
    searchInput: {
        ...Typography.body,
        color: colors.textPrimary,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    // Hero
    heroBanner: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    heroGradient: {
        padding: Spacing.lg,
    },
    heroTitle: {
        ...Typography.h2,
        color: colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    heroSubtitle: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
    },
    // Sections
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        ...Typography.h3,
        color: colors.textPrimary,
    },
    seeAll: {
        ...Typography.caption,
        color: colors.primary,
    },
    infoCard: {
        marginHorizontal: Spacing.lg,
        backgroundColor: colors.card,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
    },
    infoText: {
        ...Typography.body,
        color: colors.textSecondary,
    },
    contactCard: {
        marginHorizontal: Spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    contactText: {
        ...Typography.bodySmall,
        color: colors.textPrimary,
    },
    // Services
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    serviceCard: {
        width: '48.5%',
        backgroundColor: colors.card,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
    },
    serviceIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(212,168,67,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    serviceTitle: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    serviceDesc: {
        ...Typography.caption,
        color: colors.textSecondary,
        lineHeight: 16,
    },
    // Map
    mapContainer: {
        width: '100%',
        aspectRatio: 2,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
        backgroundColor: colors.surfaceLight,
        marginBottom: Spacing.xs,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,15,20,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapOverlayText: {
        ...Typography.bodySmall,
        color: colors.textPrimary,
        marginTop: Spacing.xs,
    },
    directionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 2,
        marginTop: Spacing.md,
        gap: Spacing.xs,
    },
    directionsButtonText: {
        ...Typography.subtitle,
        color: colors.background,
    },
    // Location
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationMainText: {
        ...Typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    locationSubText: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
    },
    // Schedule
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    scheduleDay: {
        ...Typography.body,
        color: colors.textPrimary,
        flex: 1,
    },
    scheduleTime: {
        ...Typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
    scheduleDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: Spacing.sm,
    },
    // Nav row
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.xs,
    },
    navBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 2,
    },
    navBtnText: {
        ...Typography.caption,
        color: colors.textSecondary,
        fontSize: 10,
    },
    copyright: {
        ...Typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
        fontSize: 11,
    },
});
