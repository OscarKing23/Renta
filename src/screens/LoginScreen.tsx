import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useAuth } from '../context';
import { validateLogin, validateRegister } from '../utils/validators';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { login, register } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Campos
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [direccion, setDireccion] = useState('');

    const handleSubmit = async () => {
        setError('');
        setErrorField('');

        // Validación de formato y campos vacíos
        if (isRegister) {
            const err = validateRegister({ nombre, email, telefono, password });
            if (err) {
                setError(err.message);
                setErrorField(err.field);
                return;
            }
        } else {
            const err = validateLogin(email, password);
            if (err) {
                setError(err.message);
                setErrorField(err.field);
                return;
            }
        }

        setLoading(true);
        try {
            const result = isRegister
                ? await register({ nombre, email, telefono, password, direccion })
                : await login(email, password);

            if (!result.success) {
                setError(result.error || 'Ocurrió un error inesperado. Intenta de nuevo.');
            }
        } catch {
            setError('No se pudo conectar al servidor. Verifica tu conexión e intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setErrorField('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo / Icono */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="storefront" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.appName}>Renta Eventos</Text>
                    <Text style={styles.appTagline}>
                        {isRegister ? 'Crea tu cuenta' : 'Inicia sesión para continuar'}
                    </Text>
                </View>

                {/* Error */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={18} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Formulario */}
                <View style={styles.form}>
                    {isRegister && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre completo *</Text>
                            <View style={[styles.inputWrapper, errorField === 'nombre' && styles.inputError]}>
                                <Ionicons name="person-outline" size={18} color={errorField === 'nombre' ? '#EF4444' : colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: María García López"
                                    placeholderTextColor={colors.textMuted}
                                    value={nombre}
                                    onChangeText={(t) => { setNombre(t); if (errorField === 'nombre') { setError(''); setErrorField(''); } }}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico *</Text>
                        <View style={[styles.inputWrapper, errorField === 'email' && styles.inputError]}>
                            <Ionicons name="mail-outline" size={18} color={errorField === 'email' ? '#EF4444' : colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="correo@ejemplo.com"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={(t) => { setEmail(t); if (errorField === 'email') { setError(''); setErrorField(''); } }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {isRegister && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Teléfono *</Text>
                            <View style={[styles.inputWrapper, errorField === 'telefono' && styles.inputError]}>
                                <Ionicons name="call-outline" size={18} color={errorField === 'telefono' ? '#EF4444' : colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="55 1234 5678"
                                    placeholderTextColor={colors.textMuted}
                                    value={telefono}
                                    onChangeText={(t) => { setTelefono(t); if (errorField === 'telefono') { setError(''); setErrorField(''); } }}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña *</Text>
                        <View style={[styles.inputWrapper, errorField === 'password' && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={18} color={errorField === 'password' ? '#EF4444' : colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor={colors.textMuted}
                                value={password}
                                onChangeText={(t) => { setPassword(t); if (errorField === 'password') { setError(''); setErrorField(''); } }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity activeOpacity={1} onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {isRegister && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Dirección (opcional)</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="location-outline" size={18} color={colors.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Av. Ejemplo 123, Col. Centro"
                                    placeholderTextColor={colors.textMuted}
                                    value={direccion}
                                    onChangeText={setDireccion}
                                />
                            </View>
                        </View>
                    )}

                    {/* Botón principal */}
                    <TouchableOpacity activeOpacity={1}
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Ionicons
                                    name={isRegister ? 'person-add' : 'log-in'}
                                    size={20}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.submitButtonText}>
                                    {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Cambiar modo */}
                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>
                            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        </Text>
                        <TouchableOpacity activeOpacity={1} onPress={toggleMode}>
                            <Text style={styles.switchLink}>
                                {isRegister ? 'Iniciar sesión' : 'Regístrate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const makeStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: Spacing.lg,
            paddingBottom: 40,
        },
        // Logo
        logoContainer: {
            alignItems: 'center',
            marginBottom: Spacing.xl,
        },
        logoCircle: {
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: `${colors.primary}18`,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.md,
        },
        appName: {
            ...Typography.h2,
            color: colors.primary,
            fontWeight: '700',
        },
        appTagline: {
            ...Typography.bodySmall,
            color: colors.textSecondary,
            marginTop: Spacing.xs,
        },
        // Error
        errorBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderWidth: 1,
            borderColor: 'rgba(239,68,68,0.3)',
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.md,
            gap: Spacing.sm,
        },
        errorText: {
            ...Typography.bodySmall,
            color: '#EF4444',
            flex: 1,
        },
        // Form
        form: {
            gap: Spacing.md,
        },
        inputGroup: {
            gap: 6,
        },
        label: {
            ...Typography.caption,
            color: colors.textSecondary,
            fontWeight: '600',
            marginLeft: 2,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: BorderRadius.md,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm + 2,
            gap: Spacing.sm,
        },
        inputError: {
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239,68,68,0.05)',
        },
        input: {
            ...Typography.body,
            color: colors.textPrimary,
            flex: 1,
        },
        // Submit
        submitButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            borderRadius: BorderRadius.md,
            paddingVertical: Spacing.md,
            gap: Spacing.sm,
            marginTop: Spacing.sm,
        },
        submitButtonDisabled: {
            opacity: 0.7,
        },
        submitButtonText: {
            ...Typography.button,
            color: '#FFFFFF',
            fontSize: 16,
        },
        // Switch
        switchRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: Spacing.xs,
            marginTop: Spacing.sm,
        },
        switchText: {
            ...Typography.bodySmall,
            color: colors.textSecondary,
        },
        switchLink: {
            ...Typography.bodySmall,
            color: colors.primary,
            fontWeight: '700',
        },
    });
