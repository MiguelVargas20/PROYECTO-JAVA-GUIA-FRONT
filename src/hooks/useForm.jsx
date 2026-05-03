// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues, validateSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (onSubmit) => {
    if (validateSchema) {
      try {
        await validateSchema.validate(values, { abortEarly: false });
        setErrors({});
        onSubmit(values);
      } catch (err) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    } else {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues
  };
};