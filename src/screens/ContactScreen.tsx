import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, useToast } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { validateContactForm } from '../utils/validators';

export const ContactScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { showToast } = useToast();

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tipoEvento, setTipoEvento] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [errorField, setErrorField] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        setError('');
        setErrorField('');

        const err = validateContactForm({ nombre, telefono, mensaje });
        if (err) {
            setError(err.message);
            setErrorField(err.field);
            return;
        }

        setIsSending(true);
        try {
            // Simular envío (no hay endpoint aún)
            await new Promise(r => setTimeout(r, 1200));
            setSent(true);
            showToast('success', 'Mensaje enviado', 'Hemos recibido tu mensaje. Te contactaremos pronto.', 4000);
        } catch {
            showToast('error', 'Error', 'No se pudo enviar el mensaje. Intenta de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    const clearError = (field: string) => {
        if (errorField === field) { setError(''); setErrorField(''); }
    };

    return (
        <View style={styles.container}>
            <Header title="Contacto" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}
            >
                {/* Quick Contact Cards */}
                <View style={styles.quickCards}>
                    <TouchableOpacity activeOpacity={1} style={styles.quickCard} >
                        <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
                            <Ionicons name="logo-whatsapp" size={24} color="#4ADE80" />
                        </View>
                        <Text style={styles.quickLabel}>WhatsApp</Text>
                        <Text style={styles.quickHint}>Respuesta rápida</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.quickCard} >
                        <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(96,165,250,0.12)' }]}>
                            <Ionicons name="call-outline" size={24} color="#60A5FA" />
                        </View>
                        <Text style={styles.quickLabel}>Llamar</Text>
                        <Text style={styles.quickHint}>Lun - Sáb</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.quickCard} >
                        <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(212,168,67,0.12)' }]}>
                            <Ionicons name="mail-outline" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.quickLabel}>Email</Text>
                        <Text style={styles.quickHint}>24 hrs</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Form */}
                <View style={styles.formSection}>
                    <Text style={styles.formTitle}>Envíanos un mensaje</Text>
                    <Text style={styles.formSubtitle}>
                        Te responderemos lo más pronto posible
                    </Text>

                    {error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={16} color="#EF4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nombre *</Text>
                        <View style={[styles.inputContainer, errorField === 'nombre' && styles.inputError]}>
                            <Ionicons name="person-outline" size={18} color={errorField === 'nombre' ? '#EF4444' : colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Tu nombre completo"
                                placeholderTextColor={colors.textMuted}
                                value={nombre}
                                onChangeText={(t) => { setNombre(t); clearError('nombre'); }}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Teléfono *</Text>
                        <View style={[styles.inputContainer, errorField === 'telefono' && styles.inputError]}>
                            <Ionicons name="call-outline" size={18} color={errorField === 'telefono' ? '#EF4444' : colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="+52 (000) 000-0000"
                                placeholderTextColor={colors.textMuted}
                                value={telefono}
                                onChangeText={(t) => { setTelefono(t); clearError('telefono'); }}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Tipo de evento</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                            <Text style={styles.placeholderText}>Seleccionar tipo</Text>
                            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Mensaje *</Text>
                        <View style={[styles.inputContainer, styles.textArea, errorField === 'mensaje' && styles.inputError]}>
                            <TextInput
                                style={[styles.input, styles.textAreaInput]}
                                placeholder="Describe lo que necesitas para tu evento..."
                                placeholderTextColor={colors.textMuted}
                                value={mensaje}
                                onChangeText={(t) => { setMensaje(t); clearError('mensaje'); }}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={1}
                        style={[styles.sendButton, (isSending || sent) && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={isSending || sent}
                        
                    >
                        {isSending ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <Ionicons name={sent ? "checkmark-circle" : "send"} size={18} color="#FFF" />
                                <Text style={styles.sendButtonText}>
                                    {sent ? 'Mensaje enviado' : 'Enviar Mensaje'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Location placeholder */}
                <View style={styles.locationCard}>
                    <View style={styles.mapPlaceholder}>
                        <Ionicons name="location" size={32} color={colors.primary} />
                        <Text style={styles.mapText}>Ver ubicación en mapa</Text>
                    </View>
                    <View style={styles.addressInfo}>
                        <Ionicons name="location-outline" size={18} color={colors.primary} />
                        <View style={styles.addressText}>
                            <Text style={styles.addressTitle}>Nuestra Ubicación</Text>
                            <Text style={styles.addressValue}>
                                Av. Principal #123, Centro, Ciudad, Estado, CP 00000
                            </Text>
                        </View>
                    </View>
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
    // Quick Cards
    quickCards: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    quickCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    quickIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    quickLabel: {
        ...Typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: 2,
    },
    quickHint: {
        ...Typography.caption,
        color: colors.textMuted,
        fontSize: 10,
    },
    // Form
    formSection: {
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    formTitle: {
        ...Typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    formSubtitle: {
        ...Typography.bodySmall,
        color: colors.textMuted,
        marginBottom: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    inputLabel: {
        ...Typography.caption,
        color: colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: Spacing.sm,
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.05)',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)',
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    errorText: {
        ...Typography.caption,
        color: '#EF4444',
        flex: 1,
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        ...Typography.button,
        color: '#FFF',
    },
    input: {
        flex: 1,
        ...Typography.body,
        color: colors.textPrimary,
        paddingVertical: 0,
    },
    placeholderText: {
        flex: 1,
        ...Typography.body,
        color: colors.textMuted,
    },
    textArea: {
        alignItems: 'flex-start',
        minHeight: 100,
    },
    textAreaInput: {
        height: 80,
    },
    // Location
    locationCard: {
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mapPlaceholder: {
        height: 140,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    mapText: {
        ...Typography.caption,
        color: colors.textMuted,
    },
    addressInfo: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    addressText: {
        flex: 1,
    },
    addressTitle: {
        ...Typography.subtitle,
        color: colors.textPrimary,
        fontSize: 14,
        marginBottom: 2,
    },
    addressValue: {
        ...Typography.bodySmall,
        color: colors.textMuted,
    },
});
