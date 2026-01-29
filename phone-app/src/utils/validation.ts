export function validateEmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!e) return "Email is required.";
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  if (!ok) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) return "Password must include letters and numbers.";
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

