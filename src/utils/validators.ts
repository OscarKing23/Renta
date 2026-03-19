// ── Validadores reutilizables ──

export type ValidationError = {
    field: string;
    message: string;
};

/** Verifica que un string no esté vacío (después de trim). */
export function isRequired(value: string | undefined | null): boolean {
    return !!value && value.trim().length > 0;
}

/** Valida formato de email. */
export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

/** Valida teléfono: solo dígitos, espacios, +, -, (), de 7 a 15 dígitos. */
export function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/[\s\-()+ ]/g, '');
    return /^\d{7,15}$/.test(digits);
}

/** Valida que un string sea solo numérico. */
export function isNumeric(value: string): boolean {
    return /^\d+$/.test(value.replace(/\s/g, ''));
}

/** Valida formato de fecha YYYY-MM-DD. */
export function isValidDate(dateStr: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const d = new Date(dateStr + 'T00:00:00');
    return !isNaN(d.getTime());
}

/** Valida contraseña: mínimo 6 caracteres. */
export function isValidPassword(password: string): boolean {
    return password.length >= 6;
}

/** Valida número de tarjeta: exactamente 16 dígitos. */
export function isValidCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(digits);
}

/** Valida expiración de tarjeta: formato MM/AA, no expirada. */
export function isValidCardExpiry(expiry: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [mm, yy] = expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const expDate = new Date(2000 + yy, mm); // mes siguiente al de expiración
    return expDate > now;
}

/** Valida CVV: 3 o 4 dígitos. */
export function isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
}

// ── Validaciones por pantalla ──

export function validateLogin(email: string, password: string): ValidationError | null {
    if (!isRequired(email)) return { field: 'email', message: 'Ingresa tu correo electrónico' };
    if (!isValidEmail(email)) return { field: 'email', message: 'El correo electrónico no tiene un formato válido' };
    if (!isRequired(password)) return { field: 'password', message: 'Ingresa tu contraseña' };
    return null;
}

export function validateRegister(data: {
    nombre: string; email: string; telefono: string; password: string;
}): ValidationError | null {
    if (!isRequired(data.nombre)) return { field: 'nombre', message: 'Ingresa tu nombre completo' };
    if (!isRequired(data.email)) return { field: 'email', message: 'Ingresa tu correo electrónico' };
    if (!isValidEmail(data.email)) return { field: 'email', message: 'El correo electrónico no tiene un formato válido (ej: correo@ejemplo.com)' };
    if (!isRequired(data.telefono)) return { field: 'telefono', message: 'Ingresa tu número de teléfono' };
    if (!isValidPhone(data.telefono)) return { field: 'telefono', message: 'El teléfono debe tener entre 7 y 15 dígitos' };
    if (!isRequired(data.password)) return { field: 'password', message: 'Ingresa una contraseña' };
    if (!isValidPassword(data.password)) return { field: 'password', message: 'La contraseña debe tener al menos 6 caracteres' };
    return null;
}

export function validateCardPayment(data: {
    cardHolder: string; cardNumber: string; cardExpiry: string; cardCVV: string;
}): ValidationError | null {
    if (!isRequired(data.cardHolder)) return { field: 'cardHolder', message: 'Ingresa el nombre del titular de la tarjeta' };
    if (!isValidCardNumber(data.cardNumber)) return { field: 'cardNumber', message: 'El número de tarjeta debe tener 16 dígitos' };
    if (!isValidCardExpiry(data.cardExpiry)) return { field: 'cardExpiry', message: 'La fecha de expiración no es válida o la tarjeta está vencida' };
    if (!isValidCVV(data.cardCVV)) return { field: 'cardCVV', message: 'El CVV debe tener 3 o 4 dígitos' };
    return null;
}

export function validateContactForm(data: {
    nombre: string; telefono: string; mensaje: string;
}): ValidationError | null {
    if (!isRequired(data.nombre)) return { field: 'nombre', message: 'Ingresa tu nombre' };
    if (!isRequired(data.telefono)) return { field: 'telefono', message: 'Ingresa tu número de teléfono' };
    if (!isValidPhone(data.telefono)) return { field: 'telefono', message: 'El teléfono no tiene un formato válido' };
    if (!isRequired(data.mensaje)) return { field: 'mensaje', message: 'Escribe un mensaje' };
    return null;
}
