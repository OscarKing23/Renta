import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { crossAlert } from '../utils/crossAlert';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useAuth } from '../context';

const SETTINGS_SECTIONS = [
    {
        title: 'General',
        items: [
            { icon: 'language-outline' as const, label: 'Idioma', value: 'Español' },
            { icon: 'location-outline' as const, label: 'Región', value: 'México' },
            { icon: 'cash-outline' as const, label: 'Moneda', value: 'MXN ($)' },
        ],
    },
    {
        title: 'Notificaciones',
        items: [
            { icon: 'notifications-outline' as const, label: 'Push', toggle: true, defaultValue: true },
            { icon: 'mail-outline' as const, label: 'Correo electrónico', toggle: true, defaultValue: false },
            { icon: 'chatbubble-outline' as const, label: 'SMS', toggle: true, defaultValue: false },
        ],
    },
    {
        title: 'Información',
        items: [
            { icon: 'document-text-outline' as const, label: 'Términos y condiciones', value: '' },
            { icon: 'shield-checkmark-outline' as const, label: 'Política de privacidad', value: '' },
            { icon: 'information-circle-outline' as const, label: 'Versión', value: '1.0.0' },
        ],
    },
];

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors, isLightMode, toggleTheme } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { user, updateProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [telefono, setTelefono] = useState(user?.telefono || '');
    const [email, setEmail] = useState(user?.email || '');
    const [direccion, setDireccion] = useState(user?.direccion || '');

    const handleSave = async () => {
        try {
            await updateProfile({ nombre, telefono, email, direccion });
            setIsEditing(false);
            crossAlert('Éxito', 'Datos actualizados correctamente');
        } catch {
            crossAlert('Error', 'No se pudieron guardar los cambios');
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Configuración"
                showBack
                onBackPress={() => navigation.goBack()}
                onHomePress={() => navigation.navigate('Inicio')}
            />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Datos personales */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Datos personales</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                            <Text style={styles.editBtn}>{isEditing ? 'Guardar' : 'Editar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        {[
                            { icon: 'person-outline' as const, label: 'Nombre', value: nombre, setter: setNombre },
                            { icon: 'call-outline' as const, label: 'Teléfono', value: telefono, setter: setTelefono, keyboard: 'phone-pad' as const },
                            { icon: 'mail-outline' as const, label: 'Correo', value: email, setter: setEmail, keyboard: 'email-address' as const },
                            { icon: 'location-outline' as const, label: 'Dirección', value: direccion, setter: setDireccion },
                        ].map((field, idx, arr) => (
                            <View key={field.label} style={[styles.row, idx < arr.length - 1 && styles.rowBorder]}>
                                <View style={styles.rowLeft}>
                                    <Ionicons name={field.icon} size={20} color={colors.primary} />
                                    <View style={styles.fieldContent}>
                                        <Text style={styles.fieldLabel}>{field.label}</Text>
                                        {isEditing ? (
                                            <TextInput
                                                style={styles.fieldInput}
                                                value={field.value}
                                                onChangeText={field.setter}
                                                keyboardType={field.keyboard || 'default'}
                                                placeholderTextColor={colors.textMuted}
                                            />
                                        ) : (
                                            <Text style={styles.fieldValue}>{field.value}</Text>
                                        )}
                                    </View>
                                </View>
                                {isEditing && (
                                    <Ionicons name="create-outline" size={16} color={colors.textMuted} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tema */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Apariencia</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="moon-outline" size={20} color={colors.primary} />
                                <Text style={styles.rowLabel}>Modo claro</Text>
                            </View>
                            <Switch
                                value={isLightMode}
                                onValueChange={toggleTheme}
                                thumbColor={isLightMode ? colors.primary : colors.textMuted}
                                trackColor={{ false: colors.surfaceLight, true: 'rgba(212,168,67,0.35)' }}
                            />
                        </View>
                    </View>
                </View>

                {/* Secciones dinámicas */}
                {SETTINGS_SECTIONS.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.card}>
                            {section.items.map((item, idx) => (
                                <View
                                    key={item.label}
                                    style={[
                                        styles.row,
                                        idx < section.items.length - 1 && styles.rowBorder,
                                    ]}
                                >
                                    <View style={styles.rowLeft}>
                                        <Ionicons name={item.icon} size={20} color={colors.primary} />
                                        <Text style={styles.rowLabel}>{item.label}</Text>
                                    </View>
                                    {'toggle' in item && item.toggle ? (
                                        <Switch
                                            value={item.defaultValue}
                                            thumbColor={item.defaultValue ? colors.primary : colors.textMuted}
                                            trackColor={{ false: colors.surfaceLight, true: 'rgba(212,168,67,0.35)' }}
                                        />
                                    ) : (
                                        <View style={styles.rowRight}>
                                            {'value' in item && item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
                                            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
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
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.caption,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    editBtn: {
        ...Typography.caption,
        color: colors.primary,
        fontWeight: '700',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    rowLabel: {
        ...Typography.body,
        color: colors.textPrimary,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    rowValue: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
    },
    fieldContent: {
        flex: 1,
    },
    fieldLabel: {
        ...Typography.caption,
        color: colors.textMuted,
        marginBottom: 2,
    },
    fieldValue: {
        ...Typography.body,
        color: colors.textPrimary,
    },
    fieldInput: {
        ...Typography.body,
        color: colors.textPrimary,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        paddingVertical: 2,
        paddingHorizontal: 0,
    },
});
