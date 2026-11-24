// Patterns

const NAME_PATTERN = /^\p{L}+(?: \p{L}+)*$/u;
const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const PASSWORD_ALLOWED = /^[\p{L}\p{Nd}!-\/:-@\[-`{-~]+$/u;
const SPECIAL = /[!-\/:-@\[-`{-~]/;
const LOWER = /\p{Ll}/u;
const UPPER = /\p{Lu}/u;
const DIGIT = /\d/;

//---------------------------------------------------------------------------

export function normalizeName(name) {
  return (name ?? "").trim().replace(/\s+/g, " ");
}

function utf8Length(str) {
  let bytes = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    bytes += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }
  return bytes;
}

export function validateName(name) {
  const n = normalizeName(name);
  if (!n) {
    return "Digite seu nome.";
  }
  if (n.length < 3 || n.length > 255) {
    return "O nome deve ter entre 3 e 255 caracteres.";
  }
  if (!NAME_PATTERN.test(n)) {
    return "O nome deve conter apenas letras.";
  }
  return "";
}

export function validateEmail(email) {
  const e = (email ?? "").trim();
  if (!e) {
    return "Digite seu e-mail.";
  }
  if (e.length < 6 || e.length > 255) {
    return "O e-mail deve ter entre 6 e 255 caracteres.";
  }
  if (!EMAIL_PATTERN.test(e)) {
    return "Digite um e-mail válido.";
  }
  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Digite a senha.";
  }
  if (password.length < 8) {
    return "A senha deve ter no mínimo 8 caracteres.";
  }
  if (!PASSWORD_ALLOWED.test(password)) {
    return "A senha contém caracteres inválidos (emojis e espaços não são permitidos).";
  }
  if (utf8Length(password) > 72) {
    return "A senha é muito longa.";
  }
  if (
    !LOWER.test(password) ||
    !UPPER.test(password) ||
    !DIGIT.test(password) ||
    !SPECIAL.test(password)
  ) {
    return "A senha deve ter letra minúscula, maiúscula, número e caractere especial.";
  }
  return "";
}
