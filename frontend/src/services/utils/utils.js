export const formatValidationErrors = (backendErrors) => {
  const errorMap = {};

  backendErrors.forEach(({ field, message }) => {
    if (!errorMap[field]) {
      errorMap[field] = message;
    } else {
      
    errorMap[field] += `\n${message}`;
    }
  });

  return errorMap; 
};

export const isValidString = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
};

export const isValidEmail = (value) => {
  if (!value) return false
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return emailRegex.test(value);
};

export const isValidName = (value) => {
  if (!value) return false
  const nameRegex = new RegExp(/^[A-Za-z]?[A-Za-z ]*$/);

  return nameRegex.test(value);
} 