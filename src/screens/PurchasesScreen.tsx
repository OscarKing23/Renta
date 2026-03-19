import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useOrders } from '../context';

const ESTADO_LABELS: Record<string, { label: string; color: string }> = {
    borrador: { label: 'Borrador', color: '#94a3b8' },
    confirmado: { label: 'Confirmado', color: '#60a5fa' },
    en_renta: { label: 'En camino', color: '#fbbf24' },
    devuelto: { label: 'Entregado', color: '#4ade80' },
    cancelado: { label: 'Cancelado', color: '#f87171' },
};

export const PurchasesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { orders, isLoading, fetchOrders } = useOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <View style={styles.container}>
            <Header title="Compras" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Historial de compras</Text>

                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: Spacing.xl }} />
                    ) : orders.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={56} color={colors.textMuted} />
                            <Text style={styles.emptyTitle}>Sin pedidos aún</Text>
                            <Text style={styles.emptySubtitle}>
                                Tus pedidos aparecerán aquí después de completar una compra
                            </Text>
                        </View>
                    ) : (
                        orders.map((order) => {
                            const est = ESTADO_LABELS[order.estado] || ESTADO_LABELS.borrador;
                            const itemsText = order.items.map(i => i.nombre).join(', ');
                            return (
                                <View key={order.id_pedido} style={styles.purchaseCard}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.purchaseId}>Pedido #{order.id_pedido}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: `${est.color}22` }]}>
                                            <View style={[styles.statusDot, { backgroundColor: est.color }]} />
                                            <Text style={[styles.statusText, { color: est.color }]}>{est.label}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.purchaseItems} numberOfLines={2}>{itemsText || 'Sin productos'}</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.total}>${Number(order.costo_total).toLocaleString()}</Text>
                                        <Text style={styles.date}>
                                            {new Date(order.fecha_pedido).toLocaleDateString('es-MX', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                    <View style={styles.dateRange}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                                        <Text style={styles.dateRangeText}>
                                            {new Date(order.fecha_renta).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                            {' → '}
                                            {new Date(order.fecha_devolucion).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                        </Text>
                                    </View>
                                    {order.hora_entrega && (
                                        <View style={styles.dateRange}>
                                            <Ionicons name="time-outline" size={14} color={colors.primary} />
                                            <Text style={styles.dateRangeText}>Entrega: {order.hora_entrega} hrs</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
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
    section: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing.xl * 2,
        gap: Spacing.sm,
    },
    emptyTitle: {
        ...Typography.h3,
        color: colors.textPrimary,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        ...Typography.body,
        color: colors.textMuted,
        textAlign: 'center',
    },
    purchaseCard: {
        borderRadius: BorderRadius.md,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    purchaseId: {
        ...Typography.body,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 5,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    statusText: {
        ...Typography.caption,
        fontWeight: '700',
    },
    purchaseItems: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    total: {
        ...Typography.subtitle,
        color: colors.primary,
    },
    date: {
        ...Typography.caption,
        color: colors.textMuted,
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    dateRangeText: {
        ...Typography.caption,
        color: colors.textMuted,
    },
});
