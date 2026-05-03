// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues, validateSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // ✅ Añadido: Estado para campos tocados

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Manejo especial para checkboxes (como el de 'remember' o 'terms')
    const finalValue = type === 'checkbox' ? checked : value;

    setValues({
      ...values,
      [name]: finalValue,
    });
  };

  // ✅ Añadido: Función para marcar campos como "visitados"
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = (callback) => async (e) => {
    if (e && e.preventDefault) e.preventDefault(); // Evita recarga de página

    if (validateSchema) {
      try {
        // Validamos contra el esquema (Yup)
        await validateSchema.validate(values, { abortEarly: false });
        setErrors({});
        callback(values); // Ejecuta el onSubmit de tu componente
      } catch (err) {
        const validationErrors = {};
        if (err.inner) {
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
        }
        setErrors(validationErrors);
        
        // Opcional: Marcar todos como tocados al intentar enviar para mostrar errores
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);
      }
    } else {
      callback(values);
    }
  };

  return {
    values,
    errors,
    touched,      // ✅ Ahora lo devuelve
    handleChange,
    handleBlur,    // ✅ Ahora lo devuelve
    handleSubmit,
    setValues,
    setErrors     // Útil por si quieres limpiar errores manualmente
  };
};