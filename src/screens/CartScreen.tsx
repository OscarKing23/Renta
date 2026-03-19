import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    LayoutAnimation,
    UIManager,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { crossAlert } from '../utils/crossAlert';
import { validateCardPayment } from '../utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { Header, useToast } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useCart, useOrders } from '../context';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animateLayout = () => {
    if (Platform.OS !== 'web') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
};

// ── Mini calendario inline ──
type MiniCalendarProps = {
    selected: string; // YYYY-MM-DD
    minDate: string;
    onSelect: (date: string) => void;
    colors: ThemeColors;
};

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const toYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selected, minDate, onSelect, colors }) => {
    const today = new Date();
    const selParts = selected.split('-').map(Number);
    const [viewYear, setViewYear] = useState(selParts[0]);
    const [viewMonth, setViewMonth] = useState(selParts[1] - 1);

    const goBack = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const goForward = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // Generar días del mes
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // Lunes = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const canGoBack = viewYear > today.getFullYear() ||
        (viewYear === today.getFullYear() && viewMonth > today.getMonth());

    return (
        <View style={{ marginTop: 8 }}>
            {/* Header del mes */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity activeOpacity={1} onPress={goBack} disabled={!canGoBack} style={{ padding: 6 }}>
                    <Ionicons name="chevron-back" size={20} color={canGoBack ? colors.textPrimary : colors.textMuted} />
                </TouchableOpacity>
                <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 15 }}>
                    {MONTHS_ES[viewMonth]} {viewYear}
                </Text>
                <TouchableOpacity activeOpacity={1} onPress={goForward} style={{ padding: 6 }}>
                    <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Días de la semana */}
            <View style={{ flexDirection: 'row' }}>
                {DAYS_ES.map(d => (
                    <View key={d} style={{ flex: 1, alignItems: 'center', paddingBottom: 6 }}>
                        <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600' }}>{d}</Text>
                    </View>
                ))}
            </View>

            {/* Celdas del calendario */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {cells.map((day, i) => {
                    if (day === null) {
                        return <View key={`e${i}`} style={{ width: '14.28%', height: 36 }} />;
                    }
                    const dateStr = toYMD(new Date(viewYear, viewMonth, day));
                    const isSelected = dateStr === selected;
                    const isDisabled = dateStr < minDate;
                    const isToday = dateStr === toYMD(today);

                    return (
                        <TouchableOpacity activeOpacity={1}
                            key={dateStr}
                            disabled={isDisabled}
                            onPress={() => onSelect(dateStr)}
                            style={{
                                width: '14.28%',
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isSelected ? colors.primary : 'transparent',
                                borderWidth: isToday && !isSelected ? 1 : 0,
                                borderColor: colors.primary,
                            }}>
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: isSelected || isToday ? '700' : '400',
                                    color: isDisabled
                                        ? colors.textMuted
                                        : isSelected
                                            ? '#FFF'
                                            : colors.textPrimary,
                                }}>
                                    {day}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { items, removeItem, updateQuantity, clearCart, total } = useCart();
    const { checkout } = useOrders();
    const { showToast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'efectivo'>('tarjeta');
    const [isProcessing, setIsProcessing] = useState(false);
    const checkoutScaleAnim = useRef(new Animated.Value(1)).current;

    // Datos de tarjeta
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    // Sub-opción de efectivo
    const [cashOption, setCashOption] = useState<'tienda' | 'entrega'>('tienda');
    const CLABE = '1234567897412365';

    // Fechas por defecto: mañana y pasado mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const todayStr = toYMD(new Date());
    const tomorrowStr = toYMD(tomorrow);
    const [fechaRenta, setFechaRenta] = useState(toYMD(tomorrow));
    const [fechaDevolucion, setFechaDevolucion] = useState(toYMD(dayAfter));
    const [showCalendar, setShowCalendar] = useState<'entrega' | 'devolucion' | null>(null);
    const [horaEntrega, setHoraEntrega] = useState('10:00');

    // Cuando cambia la fecha de renta, asegurar que devolución sea posterior
    const handleSelectRenta = (date: string) => {
        setFechaRenta(date);
        // Si la devolución es anterior o igual a la nueva renta, ajustar
        if (fechaDevolucion <= date) {
            const next = new Date(date);
            next.setDate(next.getDate() + 1);
            setFechaDevolucion(toYMD(next));
        }
        setShowCalendar(null);
    };

    const handleSelectDevolucion = (date: string) => {
        setFechaDevolucion(date);
        setShowCalendar(null);
    };

    // Fecha mínima para devolución: día siguiente a la renta
    const minDevolucion = (() => {
        const d = new Date(fechaRenta);
        d.setDate(d.getDate() + 1);
        return toYMD(d);
    })();

    const formatCardNumber = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 4);
        if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const copyClabe = async () => {
        await Clipboard.setStringAsync(CLABE);
        showToast('success', 'Copiado', 'Clave bancaria copiada al portapapeles');
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;

        // Validación de tarjeta
        if (paymentMethod === 'tarjeta') {
            const err = validateCardPayment({ cardHolder, cardNumber, cardExpiry, cardCVV });
            if (err) {
                showToast('warning', 'Datos de tarjeta', err.message);
                return;
            }
        }

        setIsProcessing(true);
        // Animación de pulso en el botón de checkout
        Animated.sequence([
            Animated.timing(checkoutScaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(checkoutScaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        try {
            const result = await checkout({
                items: items.map(i => ({
                    id_producto: i.id,
                    cantidad: i.quantity,
                    precio_unitario: i.price,
                })),
                metodo_pago: paymentMethod === 'tarjeta' ? 'tarjeta' : (cashOption === 'tienda' ? 'efectivo_tienda' : 'efectivo_entrega'),
                fecha_renta: fechaRenta,
                fecha_devolucion: fechaDevolucion,
                hora_entrega: horaEntrega,
            });
            if (result.success) {
                animateLayout();
                clearCart();
                showToast('success', '¡Pedido confirmado!', `Tu pedido #${result.orderId} ha sido procesado.`, 4000);
                setTimeout(() => navigation.navigate('Compras'), 1500);
            } else {
                showToast('error', 'Error al guardar', result.error || 'No se pudo procesar el pedido. Intenta de nuevo.');
            }
        } catch {
            showToast('error', 'Error de conexión', 'No se pudo conectar al servidor. Tu carrito se ha conservado.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Carrito" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
                <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={64} color={colors.textMuted} />
                    <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                    <Text style={styles.emptySubtitle}>Agrega productos desde el catálogo</Text>
                    <TouchableOpacity activeOpacity={1}
                        style={styles.browseBtn}
                        onPress={() => navigation.navigate('Categorías')}
                        
                    >
                        <Text style={styles.browseBtnText}>Ver catálogo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Carrito" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Productos agregados ({items.length})</Text>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>{item.quantity} x ${item.price.toFixed(2)}</Text>
                                <View style={styles.qtyRow}>
                                    <TouchableOpacity activeOpacity={1}
                                        style={styles.qtyBtn}
                                        onPress={() => {
                                            animateLayout();
                                            updateQuantity(item.id, item.quantity - 1);
                                        }}
                                    >
                                        <Ionicons name="remove" size={14} color={colors.textPrimary} />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity activeOpacity={1}
                                        style={styles.qtyBtn}
                                        onPress={() => {
                                            animateLayout();
                                            updateQuantity(item.id, item.quantity + 1);
                                        }}
                                    >
                                        <Ionicons name="add" size={14} color={colors.textPrimary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1}
                                        style={styles.deleteBtn}
                                        onPress={() => {
                                            animateLayout();
                                            removeItem(item.id);
                                            showToast('info', 'Producto eliminado', `${item.name} se eliminó del carrito`);
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.itemTotal}>
                                ${(item.quantity * item.price).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fecha de renta</Text>
                    <View style={styles.dateRow}>
                        <TouchableOpacity activeOpacity={1}
                            style={[styles.dateBox, showCalendar === 'entrega' && styles.dateBoxActive]}
                            onPress={() => setShowCalendar(showCalendar === 'entrega' ? null : 'entrega')}
                            
                        >
                            <Ionicons name="calendar-outline" size={16} color={colors.primary} style={{ marginBottom: 2 }} />
                            <Text style={styles.dateLabel}>Entrega</Text>
                            <Text style={styles.dateValue}>{fechaRenta.split('-').reverse().join('-')}</Text>
                        </TouchableOpacity>
                        <Ionicons name="arrow-forward" size={18} color={colors.textMuted} />
                        <TouchableOpacity activeOpacity={1}
                            style={[styles.dateBox, showCalendar === 'devolucion' && styles.dateBoxActive]}
                            onPress={() => setShowCalendar(showCalendar === 'devolucion' ? null : 'devolucion')}
                            
                        >
                            <Ionicons name="calendar-outline" size={16} color={colors.primary} style={{ marginBottom: 2 }} />
                            <Text style={styles.dateLabel}>Devolución</Text>
                            <Text style={styles.dateValue}>{fechaDevolucion.split('-').reverse().join('-')}</Text>
                        </TouchableOpacity>
                    </View>
                    {showCalendar === 'entrega' && (
                        <MiniCalendar
                            selected={fechaRenta}
                            minDate={tomorrowStr}
                            onSelect={handleSelectRenta}
                            colors={colors}
                        />
                    )}
                    {showCalendar === 'devolucion' && (
                        <MiniCalendar
                            selected={fechaDevolucion}
                            minDate={minDevolucion}
                            onSelect={handleSelectDevolucion}
                            colors={colors}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Horario de entrega</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((hora) => {
                            const isActive = horaEntrega === hora;
                            return (
                                <TouchableOpacity activeOpacity={1}
                                    key={hora}
                                    style={[styles.timeChip, isActive && styles.timeChipActive]}
                                    onPress={() => setHoraEntrega(hora)}
                                    
                                >
                                    <Ionicons
                                        name="time-outline"
                                        size={14}
                                        color={isActive ? colors.textOnPrimary : colors.textSecondary}
                                    />
                                    <Text style={[styles.timeChipText, isActive && styles.timeChipTextActive]}>
                                        {hora}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Método de pago</Text>
                    <View style={styles.optionsRow}>
                        <TouchableOpacity activeOpacity={1}
                            style={[
                                styles.paymentBtn,
                                paymentMethod === 'tarjeta' && styles.paymentBtnActive,
                            ]}
                            onPress={() => setPaymentMethod('tarjeta')}
                            
                        >
                            <Ionicons
                                name="card-outline"
                                size={18}
                                color={
                                    paymentMethod === 'tarjeta'
                                        ? colors.textOnPrimary
                                        : colors.textSecondary
                                }
                            />
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === 'tarjeta' && styles.paymentTextActive,
                                ]}
                            >
                                Tarjeta
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1}
                            style={[
                                styles.paymentBtn,
                                paymentMethod === 'efectivo' && styles.paymentBtnActive,
                            ]}
                            onPress={() => setPaymentMethod('efectivo')}
                            
                        >
                            <Ionicons
                                name="cash-outline"
                                size={18}
                                color={
                                    paymentMethod === 'efectivo'
                                        ? colors.textOnPrimary
                                        : colors.textSecondary
                                }
                            />
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === 'efectivo' && styles.paymentTextActive,
                                ]}
                            >
                                Efectivo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── Detalles según método de pago ── */}
                    {paymentMethod === 'tarjeta' && (
                        <View style={styles.cardForm}>
                            <Text style={styles.cardFormTitle}>Datos de la tarjeta</Text>
                            <TextInput
                                style={styles.cardInput}
                                placeholder="Nombre del titular"
                                placeholderTextColor={colors.textMuted}
                                value={cardHolder}
                                onChangeText={setCardHolder}
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.cardInput}
                                placeholder="Número de tarjeta"
                                placeholderTextColor={colors.textMuted}
                                value={cardNumber}
                                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                                keyboardType="number-pad"
                                maxLength={19}
                            />
                            <View style={styles.cardRow}>
                                <TextInput
                                    style={[styles.cardInput, { flex: 1 }]}
                                    placeholder="MM/AA"
                                    placeholderTextColor={colors.textMuted}
                                    value={cardExpiry}
                                    onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                                    keyboardType="number-pad"
                                    maxLength={5}
                                />
                                <TextInput
                                    style={[styles.cardInput, { flex: 1 }]}
                                    placeholder="CVV"
                                    placeholderTextColor={colors.textMuted}
                                    value={cardCVV}
                                    onChangeText={(t) => setCardCVV(t.replace(/\D/g, '').slice(0, 4))}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    )}

                    {paymentMethod === 'efectivo' && (
                        <View style={styles.cashOptions}>
                            {/* Opción 1: Tienda de conveniencia */}
                            <TouchableOpacity activeOpacity={1}
                                style={[
                                    styles.cashOptionCard,
                                    cashOption === 'tienda' && styles.cashOptionCardActive,
                                ]}
                                onPress={() => setCashOption('tienda')}
                                
                            >
                                <View style={styles.cashOptionHeader}>
                                    <View style={[
                                        styles.radioCircle,
                                        cashOption === 'tienda' && styles.radioCircleActive,
                                    ]}>
                                        {cashOption === 'tienda' && <View style={styles.radioDot} />}
                                    </View>
                                    <Ionicons name="storefront-outline" size={20} color={cashOption === 'tienda' ? colors.primary : colors.textSecondary} />
                                    <Text style={[
                                        styles.cashOptionTitle,
                                        cashOption === 'tienda' && { color: colors.primary },
                                    ]}>Pagar en tienda de conveniencia</Text>
                                </View>
                                {cashOption === 'tienda' && (
                                    <View style={styles.clabeBox}>
                                        <Text style={styles.clabeLabel}>Clave bancaria de referencia:</Text>
                                        <View style={styles.clabeRow}>
                                            <Text style={styles.clabeValue}>{CLABE}</Text>
                                            <TouchableOpacity activeOpacity={1} onPress={copyClabe} style={styles.copyBtn}>
                                                <Ionicons name="copy-outline" size={18} color={colors.primary} />
                                                <Text style={styles.copyBtnText}>Copiar</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.clabeHint}>
                                            Presenta esta clave en cualquier tienda OXXO, 7-Eleven o similar para realizar tu pago.
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* Opción 2: Pagar al entregar */}
                            <TouchableOpacity activeOpacity={1}
                                style={[
                                    styles.cashOptionCard,
                                    cashOption === 'entrega' && styles.cashOptionCardActive,
                                ]}
                                onPress={() => setCashOption('entrega')}
                                
                            >
                                <View style={styles.cashOptionHeader}>
                                    <View style={[
                                        styles.radioCircle,
                                        cashOption === 'entrega' && styles.radioCircleActive,
                                    ]}>
                                        {cashOption === 'entrega' && <View style={styles.radioDot} />}
                                    </View>
                                    <Ionicons name="cube-outline" size={20} color={cashOption === 'entrega' ? colors.primary : colors.textSecondary} />
                                    <Text style={[
                                        styles.cashOptionTitle,
                                        cashOption === 'entrega' && { color: colors.primary },
                                    ]}>Pagar al recibir los productos</Text>
                                </View>
                                {cashOption === 'entrega' && (
                                    <View style={styles.clabeBox}>
                                        <Text style={styles.clabeHint}>
                                            Paga en efectivo directamente al repartidor cuando recibas tus productos el día de la entrega.
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.totalLabel}>Total a pagar</Text>
                    <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    <Text style={styles.methodHint}>Método: {paymentMethod}</Text>
                </View>
            </ScrollView>

            {/* Botón de pagar fijo abajo */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
                <View style={styles.bottomTotal}>
                    <Text style={styles.bottomTotalLabel}>Total</Text>
                    <Text style={styles.bottomTotalValue}>${total.toFixed(2)}</Text>
                </View>
                <Animated.View style={{ flex: 1, transform: [{ scale: checkoutScaleAnim }] }}>
                    <TouchableOpacity activeOpacity={1}
                        style={[styles.checkoutBtn, isProcessing && { opacity: 0.6 }]}
                        onPress={handleCheckout}
                        disabled={isProcessing}
                        
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        <Text style={styles.checkoutBtnText}>
                            {isProcessing ? 'Procesando...' : 'Confirmar y pagar'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
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
    // Empty state
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
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
    },
    browseBtn: {
        marginTop: Spacing.md,
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 4,
        paddingHorizontal: Spacing.xl,
    },
    browseBtnText: {
        ...Typography.button,
        color: colors.textOnPrimary,
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
    itemCard: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemLeft: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    itemName: {
        ...Typography.body,
        color: colors.textPrimary,
    },
    itemMeta: {
        ...Typography.caption,
        color: colors.textMuted,
        marginBottom: Spacing.xs,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    qtyBtn: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        ...Typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    deleteBtn: {
        marginLeft: Spacing.sm,
        padding: 4,
    },
    itemTotal: {
        ...Typography.subtitle,
        color: colors.primary,
    },
    // Date
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    dateBox: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: Spacing.md,
        alignItems: 'center',
    },
    dateBoxActive: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceLight,
    },
    // Time chips
    timeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full || 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    timeChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    timeChipText: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    timeChipTextActive: {
        color: colors.textOnPrimary,
    },
    dateLabel: {
        ...Typography.caption,
        color: colors.textMuted,
        marginBottom: 4,
    },
    dateValue: {
        ...Typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    paymentBtn: {
        flex: 1,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    paymentBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    paymentText: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    paymentTextActive: {
        color: colors.textOnPrimary,
    },
    // Card form
    cardForm: {
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    cardFormTitle: {
        ...Typography.bodySmall,
        color: colors.textMuted,
        marginBottom: 2,
    },
    cardInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm + 2,
        paddingHorizontal: Spacing.md,
        color: colors.textPrimary,
        ...Typography.body,
    },
    cardRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    // Cash options
    cashOptions: {
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    cashOptionCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: colors.surface,
        padding: Spacing.md,
    },
    cashOptionCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceLight,
    },
    cashOptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    cashOptionTitle: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
        flex: 1,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleActive: {
        borderColor: colors.primary,
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    clabeBox: {
        marginTop: Spacing.sm,
        marginLeft: 32,
    },
    clabeLabel: {
        ...Typography.caption,
        color: colors.textMuted,
        marginBottom: 4,
    },
    clabeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    clabeValue: {
        ...Typography.body,
        color: colors.primary,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    copyBtnText: {
        ...Typography.caption,
        color: colors.primary,
        fontWeight: '600',
    },
    clabeHint: {
        ...Typography.caption,
        color: colors.textMuted,
        marginTop: Spacing.xs,
        lineHeight: 18,
    },
    summaryCard: {
        marginTop: Spacing.lg,
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: Spacing.lg,
    },
    totalLabel: {
        ...Typography.bodySmall,
        color: colors.textMuted,
    },
    totalValue: {
        ...Typography.price,
        color: colors.primary,
        marginVertical: Spacing.xs,
    },
    methodHint: {
        ...Typography.caption,
        color: colors.textSecondary,
        textTransform: 'capitalize',
    },
    // Bottom bar
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: Spacing.sm,
    },
    bottomTotal: {},
    bottomTotalLabel: {
        ...Typography.caption,
        color: colors.textMuted,
    },
    bottomTotalValue: {
        ...Typography.h3,
        color: colors.primary,
    },
    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    checkoutBtnText: {
        ...Typography.button,
        color: colors.textOnPrimary,
        fontSize: 14,
    },
});
