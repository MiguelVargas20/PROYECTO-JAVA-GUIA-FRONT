import * as Yup from 'yup';

// Reglas para el Login
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

// Reglas para el Registro (el que te está pidiendo Register.jsx)
export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .required('El nombre de usuario es obligatorio'),
  email: Yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Debes confirmar tu contraseña'),
});