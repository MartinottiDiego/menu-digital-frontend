const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Typos de dominio frecuentes → sugerencia correcta.
const DOMAIN_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yahoo.con': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
};

const NAME_LETTERS = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
const NAME_REGEX = new RegExp(`^[${NAME_LETTERS}'’.\\- ]+$`);

/** Normaliza un teléfono AR a su número nacional (10 díg: área + abonado). */
export function normalizeArgPhone(value: string): string {
  let d = (value || '').replace(/\D/g, '');
  if (d.startsWith('54')) {
    d = d.slice(2);
    if (d.startsWith('9')) d = d.slice(1);
  }
  if (d.startsWith('0')) d = d.slice(1);
  return d;
}

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (!EMAIL_REGEX.test(v)) return 'Email inválido';
  const domain = v.split('@')[1]?.toLowerCase();
  if (domain && DOMAIN_TYPOS[domain]) {
    return `¿Quisiste decir @${DOMAIN_TYPOS[domain]}?`;
  }
  return null;
}

export function validatePhone(value: string): string | null {
  const d = normalizeArgPhone(value);
  if (d.length !== 10) return 'Ingresá un teléfono válido (ej: 2364 12-3456)';
  if (/^(\d)\1{9}$/.test(d)) return 'Ingresá un teléfono real';
  return null;
}

export function validateCustomerName(value: string): string | null {
  const v = value.trim().replace(/\s+/g, ' ');
  if (v.length < 5 || v.split(' ').filter(Boolean).length < 2) {
    return 'Ingresá nombre y apellido';
  }
  if (!NAME_REGEX.test(v)) return 'Usá solo letras (sin números ni símbolos)';
  const letterCount = (w: string) =>
    (w.match(new RegExp(`[${NAME_LETTERS}]`, 'g')) || []).length;
  if (v.split(' ').some((w) => letterCount(w) < 2)) {
    return 'Ingresá nombre y apellido completos';
  }
  if (/(.)\1{3,}/i.test(v)) return 'Ingresá un nombre real';
  return null;
}

export interface CheckoutFormErrors {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerEmail?: string;
}

export function validateCheckoutForm(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  const nameError = validateCustomerName(data.customerName);
  if (nameError) errors.customerName = nameError;

  const phoneError = validatePhone(data.customerPhone);
  if (phoneError) errors.customerPhone = phoneError;

  // Email obligatorio (se usa para enviar el comprobante del pedido).
  if (!data.customerEmail?.trim()) {
    errors.customerEmail = 'El email es obligatorio';
  } else {
    const emailError = validateEmail(data.customerEmail);
    if (emailError) errors.customerEmail = emailError;
  }

  return errors;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(data: {
  email: string;
  password: string;
}): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email requerido';
  } else {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }

  if (!data.password) {
    errors.password = 'Contraseña requerida';
  } else if (data.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  return errors;
}
