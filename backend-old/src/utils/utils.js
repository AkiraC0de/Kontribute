import crypto from "crypto";

export const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateCryptoToken = () => {
  const TOKEN_BYTES = 32; // 256 bits of entropy

  return crypto.randomBytes(TOKEN_BYTES).toString('hex')
}

export const isValidEmail = (value) => {
  if (!value) return false
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return emailRegex.test(value);
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;

  const [username, domain] = email.split('@');
  
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }

  const visibleStart = username.substring(0, 2);
  const visibleEnd = username.substring(username.length - 1);
  const mask = '*'.repeat(username.length - 3 || 3);

  return `${visibleStart}${mask}${visibleEnd}@${domain}`;
};