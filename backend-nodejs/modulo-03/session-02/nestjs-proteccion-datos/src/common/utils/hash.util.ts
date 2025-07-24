import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10); // genera una sal aleatoria
  return await bcrypt.hash(password, salt); // aplica hash con sal
}

export async function comparePasswords(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}