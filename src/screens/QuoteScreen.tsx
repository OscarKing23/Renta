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
import { LinearGradient } from 'expo-linear-gradient';
import { Header, Button } from '../components';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const QUOTE_ITEMS = [
    {
        id: '1',
        title: 'Silla Tiffany Dorada',
        price: 45,
        quantity: 100,
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80',
    },
    {
        id: '2',
        title: 'Mesa Redonda Elegante',
        price: 120,
        quantity: 10,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    },
    {
        id: '3',
        title: 'Mantel Satinado Blanco',
        price: 25,
        quantity: 10,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    },
];

export const QuoteScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const subtotal = QUOTE_ITEMS.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const delivery = 500;
    const total = subtotal + delivery;

    return (
        <View style={styles.container}>
            <Header title="Cotización" />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                {/* Item count */}
                <View style={styles.itemCount}>
                    <Ionicons name="cart-outline" size={18} color={Colors.primary} />
                    <Text style={styles.itemCountText}>
                        {QUOTE_ITEMS.length} productos en tu cotización
                    </Text>
                </View>

                {/* Items */}
                {QUOTE_ITEMS.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={styles.itemPrice}>${item.price}/día</Text>
                            <View style={styles.itemQty}>
                                <TouchableOpacity activeOpacity={1} style={styles.qtyBtn}>
                                    <Ionicons name="remove" size={14} color={Colors.textSecondary} />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity activeOpacity={1} style={styles.qtyBtn}>
                                    <Ionicons name="add" size={14} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.itemRight}>
                            <Text style={styles.itemTotal}>
                                ${(item.price * item.quantity).toLocaleString()}
                            </Text>
                            <TouchableOpacity activeOpacity={1} style={styles.deleteBtn}>
                                <Ionicons name="trash-outline" size={16} color={Colors.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Summary */}
                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Resumen</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>
                            ${subtotal.toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Entrega</Text>
                        <Text style={styles.summaryValue}>${delivery}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total por día</Text>
                        <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomTotal}>
                    <Text style={styles.bottomTotalLabel}>Total</Text>
                    <Text style={styles.bottomTotalValue}>${total.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        title="Contactar por WhatsApp"
                        icon={<Ionicons name="logo-whatsapp" size={20} color={Colors.textOnPrimary} />}
                        fullWidth
                    />
                </View>
            </View>
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
    itemCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    itemCountText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    // Item Card
    itemCard: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.sm,
    },
    itemInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    itemTitle: {
        ...Typography.subtitle,
        color: Colors.textPrimary,
        fontSize: 14,
        marginBottom: 2,
    },
    itemPrice: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.sm,
    },
    itemQty: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    itemRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 64,
    },
    itemTotal: {
        ...Typography.subtitle,
        color: Colors.primary,
        fontSize: 14,
    },
    deleteBtn: {
        padding: 4,
    },
    // Summary
    summary: {
        margin: Spacing.lg,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    summaryTitle: {
        ...Typography.subtitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        ...Typography.body,
        color: Colors.textMuted,
    },
    summaryValue: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
    },
    totalLabel: {
        ...Typography.subtitle,
        color: Colors.textPrimary,
    },
    totalValue: {
        ...Typography.price,
        color: Colors.primary,
        fontSize: 20,
    },
    // Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.md,
    },
    bottomTotal: {},
    bottomTotalLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    bottomTotalValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
});
