import * as Yup from 'yup';

/* ══ LOGIN ═══════════════════════════════════════════════════
   Validación básica antes de llamar al back.
   El back recibe: { username, password }
══════════════════════════════════════════════════════════ */
export const loginSchema = Yup.object({
  username: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .required('El usuario o correo es requerido'),

  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es requerida'),
});

/* ══ REGISTER ════════════════════════════════════════════════
   El back recibe (UsuarioRegistroDto):
   {
     nombre, apellido,
     docId:     { tipo, numero },
     telefono,  correo,
     direccion: { ciudad, direccion },
     fechaNacimiento,
     username,  password
   }
   confirmPassword → solo validación front, NO se envía al back.
══════════════════════════════════════════════════════════ */
export const registerSchema = Yup.object({

  // ── Datos personales ──────────────────────────────────
  nombre: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El nombre es requerido'),

  apellido: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El apellido es requerido'),

  // ── Documento ─────────────────────────────────────────
  docTipo: Yup.string()
    .oneOf(['CC', 'TI', 'CE', 'PA'], 'Tipo de documento inválido')
    .required('Selecciona el tipo de documento'),

  docNumero: Yup.string()
    .matches(/^\d+$/, 'Solo se permiten números')        // solo dígitos
    .min(6, 'Mínimo 6 dígitos')
    .max(15, 'Máximo 15 dígitos')
    .required('El número de documento es requerido'),

  // ── Contacto ──────────────────────────────────────────
  correo: Yup.string()
    .email('Ingresa un correo válido')
    .required('El correo es requerido'),

  telefono: Yup.string()
    .matches(/^\d{10}$/, 'Debe tener exactamente 10 dígitos')  // Colombia
    .optional()
    .nullable(),

  // ── Dirección (opcionales) ────────────────────────────
  ciudad:         Yup.string().optional().nullable(),
  direccionTexto: Yup.string().optional().nullable(),

  // ── Fecha de nacimiento: mayor de 15 años ─────────────
  fechaNacimiento: Yup.date()
    .nullable()
    .optional()
    .max(
      // Hoy menos 15 años
      new Date(new Date().setFullYear(new Date().getFullYear() - 15)),
      'Debes tener al menos 15 años'
    )
    .typeError('Fecha inválida'),

  // ── Credenciales ──────────────────────────────────────
  username: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Solo letras, números, puntos, guiones y guiones bajos. Sin espacios'
    )
    .required('El usuario es requerido'),

  password: Yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .required('La contraseña es requerida'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});