// ejemplo dentro de un form
import { keepLetters, keepNumbers, REGEX_ONLY_LETTERS, REGEX_ONLY_NUMBERS, isEmail } from "../../Utils/validators";

// Letras (incluye acentos y espacios)
export const REGEX_ONLY_LETTERS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
// Números
export const REGEX_ONLY_NUMBERS = /^[0-9]+$/;
// Email simple
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function onlyLetters(value = "") {
  return REGEX_ONLY_LETTERS.test(value.trim());
}
export function onlyNumbers(value = "") {
  return REGEX_ONLY_NUMBERS.test(value.trim());
}
export function isEmail(value = "") {
  return REGEX_EMAIL.test(value.trim());
}

// Sanitizadores suaves para onChange (no rompen UX)
export function keepLetters(input = "") {
  return input.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+/g, "");
}
export function keepNumbers(input = "") {
  return input.replace(/[^0-9]+/g, "");
}
