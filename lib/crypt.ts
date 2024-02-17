import bcryptjs from "bcryptjs";

export function hash(plainText: string) {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(plainText, salt);
  return hash;
}

export function compare(password: string, hash: string) {
  return bcryptjs.compareSync(password, hash);
}
