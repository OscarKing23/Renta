import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, useToast } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useCart } from '../context';

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const insets = useSafeAreaInsets();
    const { addItem } = useCart();
    const { showToast } = useToast();
    const product = route.params?.product || {
        title: 'Silla Tiffany Dorada',
        price: '$45',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80',
        stock: 150,
    };

    const stock = product.stock ?? 0;
    const inStock = stock > 0;

    const [quantity, setQuantity] = useState(1);

    return (
        <View style={styles.container}>
            {/* Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={[styles.backButton, { top: insets.top + Spacing.sm }]}>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => navigation.navigate('Inicio')}
                        style={styles.iconButton}
                    >
                        <Ionicons name="home" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => navigation.goBack()}
                        style={styles.iconButton}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.heartButton, { top: insets.top + Spacing.sm }]}>
                    <TouchableOpacity activeOpacity={1} style={styles.iconButton}>
                        <Ionicons name="heart-outline" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Header Info */}
                <View style={styles.headerInfo}>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color={colors.primary} />
                        <Text style={styles.rating}>4.9</Text>
                        <Text style={styles.reviews}>(128 reviews)</Text>
                    </View>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>
                        {product.price} <Text style={styles.priceUnit}>/ día</Text>
                    </Text>
                </View>

                {/* Quick Info */}
                <View style={styles.quickInfo}>
                    {[
                        {
                            icon: (inStock ? 'checkmark-circle' : 'close-circle') as const,
                            label: 'Stock',
                            value: inStock ? `${stock} piezas` : 'Agotado',
                            color: inStock ? '#22c55e' : '#ef4444',
                        },
                        { icon: 'car-outline' as const, label: 'Entrega', value: 'Gratis', color: colors.primary },
                        { icon: 'shield-checkmark-outline' as const, label: 'Garantía', value: 'Incluida', color: colors.primary },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.quickInfoItem}>
                            <Ionicons name={item.icon} size={20} color={item.color} />
                            <Text style={[styles.quickInfoValue, idx === 0 && { color: item.color }]}>{item.value}</Text>
                            <Text style={styles.quickInfoLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>
                        Elegante silla estilo Tiffany con acabado dorado, perfecta para bodas,
                        XV años, eventos corporativos y celebraciones especiales. Estructura
                        resistente de policarbonato con cojín incluido.
                    </Text>
                </View>

                {/* Specifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Especificaciones</Text>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Material</Text>
                        <Text style={styles.specValue}>Policarbonato</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Color</Text>
                        <Text style={styles.specValue}>Dorado</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Peso máx.</Text>
                        <Text style={styles.specValue}>120 kg</Text>
                    </View>
                    <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.specLabel}>Incluye</Text>
                        <Text style={styles.specValue}>Cojín blanco</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity activeOpacity={1}
                        style={styles.qtyButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Ionicons name="remove" size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity activeOpacity={1}
                        style={styles.qtyButton}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Ionicons name="add" size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        title={`Agregar al carrito (${quantity})`}
                        onPress={() => {
                            const priceNum = typeof product.price === 'string'
                                ? parseInt(product.price.replace(/[^0-9]/g, ''), 10)
                                : product.price;
                            addItem({
                                id: product.id || '0',
                                name: product.title || product.name,
                                price: priceNum,
                                image: product.image,
                            }, quantity);
                            showToast(
                                'success',
                                'Agregado al carrito',
                                `${quantity}x ${product.title || product.name} agregado(s).`,
                            );
                        }}
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    imageContainer: {
        width: width,
        height: width * 0.75,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        left: Spacing.lg,
        flexDirection: 'row',
        gap: 8,
    },
    heartButton: {
        position: 'absolute',
        right: Spacing.lg,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.overlay,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginTop: -BorderRadius.xl,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        backgroundColor: colors.background,
    },
    headerInfo: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        gap: 4,
    },
    rating: {
        ...Typography.caption,
        color: colors.primary,
        fontWeight: '700',
    },
    reviews: {
        ...Typography.caption,
        color: colors.textMuted,
        marginLeft: 2,
    },
    title: {
        ...Typography.h2,
        color: colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    price: {
        ...Typography.price,
        color: colors.primary,
    },
    priceUnit: {
        ...Typography.body,
        color: colors.textMuted,
        fontWeight: '400',
    },
    quickInfo: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    quickInfoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    quickInfoValue: {
        ...Typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    quickInfoLabel: {
        ...Typography.caption,
        color: colors.textMuted,
        fontSize: 11,
    },
    section: {
        padding: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        marginBottom: Spacing.md,
    },
    description: {
        ...Typography.body,
        color: colors.textSecondary,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    specLabel: {
        ...Typography.body,
        color: colors.textMuted,
    },
    specValue: {
        ...Typography.body,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: Spacing.md,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    qtyButton: {
        padding: Spacing.md,
    },
    qtyText: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        paddingHorizontal: Spacing.sm,
    },
});
