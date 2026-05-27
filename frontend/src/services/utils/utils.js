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