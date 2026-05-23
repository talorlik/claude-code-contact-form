/**
 * Pure validation logic for the contact form.
 *
 * This module does not touch the DOM. Functions here are reusable from both
 * the browser entry point (`main.js`) and the test suite.
 *
 * @module validation
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the value passed validation.
 * @property {string} message - Error message when invalid, otherwise an empty string.
 */

/**
 * @typedef {Object} FormData
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} message
 */

/**
 * @typedef {Object} FormValidationResult
 * @property {ValidationResult} fullName
 * @property {ValidationResult} email
 * @property {ValidationResult} phone
 * @property {ValidationResult} message
 */

// Regex constants. Kept at module scope so callers (and tests) can reference
// them and so the regexes are compiled once.
export const NAME_REGEX = /^[a-zA-Zא-ת .-]+$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone format: "+<dialCode> <nationalNumber>".
//   - dialCode: 1-4 digits, first digit 1-9 (no leading 0).
//   - single space separator.
//   - nationalNumber: 4-14 digits, first digit 1-9 (caller is expected to
//     strip a single leading 0 BEFORE validating; see stripLeadingZero).
// Total digit count stays within the E.164 max of 15 (4 + 11 = 15 in the
// extreme case).
export const PHONE_REGEX = /^\+[1-9]\d{0,3} [1-9]\d{3,13}$/;

export const NAME_MIN = 2;
export const NAME_MAX = 30;
// Min: "+1 1234" = 7 chars. Max: "+1234 12345678901" = 17 chars.
export const PHONE_MIN = 7;
export const PHONE_MAX = 17;
export const MESSAGE_MIN = 10;

const ok = () => ({ isValid: true, message: "" });
const fail = (message) => ({ isValid: false, message });

/**
 * Validates a full name.
 *
 * Trims whitespace, requires a non-empty value between 2 and 30 characters,
 * and allows only English letters, Hebrew letters, spaces, dots, and hyphens.
 *
 * @param {string} value - Raw full-name input value.
 * @returns {ValidationResult}
 */
export function validateFullName(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return fail("Full name is required.");
  }
  if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
    return fail(
      `Full name must be between ${NAME_MIN} and ${NAME_MAX} characters.`
    );
  }
  if (!NAME_REGEX.test(trimmed)) {
    return fail(
      "Full name may only contain letters, spaces, dots, and hyphens."
    );
  }
  return ok();
}

/**
 * Validates an email address.
 *
 * Trims whitespace, requires a non-empty value, and requires the value to
 * match a permissive email regex with at least a 2-character TLD.
 *
 * @param {string} value - Raw email input value.
 * @returns {ValidationResult}
 */
export function validateEmail(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return fail("Email is required.");
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return fail("Please enter a valid email address, for example name@example.com.");
  }
  return ok();
}

/**
 * Validates a phone number in the form `+<dialCode> <nationalNumber>`.
 *
 * Trims whitespace, requires a non-empty value of 7-17 characters, and
 * requires the value to match `PHONE_REGEX`. Callers that present a
 * separate country picker and national-number input should strip a single
 * leading 0 from the national portion (see `stripLeadingZero`) before
 * concatenating and passing the result here.
 *
 * @param {string} value - Raw phone input value.
 * @returns {ValidationResult}
 */
export function validatePhone(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return fail("Phone is required.");
  }
  if (trimmed.length < PHONE_MIN || trimmed.length > PHONE_MAX) {
    return fail(
      `Phone must be between ${PHONE_MIN} and ${PHONE_MAX} characters.`
    );
  }
  if (!PHONE_REGEX.test(trimmed)) {
    return fail(
      "Phone must be in the form +<code> <number>, digits only, and must not start with 0."
    );
  }
  return ok();
}

/**
 * Removes exactly one leading `0` from the input, if present.
 *
 * Used by the form's national-number handler to normalize a habit (typing
 * `0541234567` instead of `541234567`) before concatenating with the
 * selected country's dial code. Removing only one zero means `00...` still
 * fails validation, which is the intended behavior.
 *
 * @param {string} value
 * @returns {string}
 */
export function stripLeadingZero(value) {
  const s = String(value ?? "");
  return s.startsWith("0") ? s.slice(1) : s;
}

/**
 * Validates a message body.
 *
 * Trims whitespace, requires a non-empty value, and requires at least 10
 * characters of content.
 *
 * @param {string} value - Raw message input value.
 * @returns {ValidationResult}
 */
export function validateMessage(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return fail("Message is required.");
  }
  if (trimmed.length < MESSAGE_MIN) {
    return fail(`Message must be at least ${MESSAGE_MIN} characters.`);
  }
  return ok();
}

/**
 * Validates the full form payload.
 *
 * Returns a result object keyed by field name. Callers can derive the
 * overall validity from `Object.values(result).every((r) => r.isValid)`.
 *
 * @param {FormData} formData
 * @returns {FormValidationResult}
 */
export function validateFormData(formData) {
  const data = formData ?? {};
  return {
    fullName: validateFullName(data.fullName ?? ""),
    email: validateEmail(data.email ?? ""),
    phone: validatePhone(data.phone ?? ""),
    message: validateMessage(data.message ?? ""),
  };
}
