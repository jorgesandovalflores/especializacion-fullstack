// src/common/utils/mask.util.ts
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return user[0] + '***@' + domain;
}