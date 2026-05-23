/**
 * Browser entry point for the contact form.
 *
 * Wires the pure validators in `validation.js` to live form fields, renders
 * per-field feedback, and handles the submit lifecycle (validate ->
 * preventDefault -> success branch implemented in Batch 06).
 *
 * @module main
 */

import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateFormData,
} from "./validation.js";

const FIELD_NAMES = /** @type {const} */ ([
  "fullName",
  "email",
  "phone",
  "message",
]);

/** @type {Record<string, (value: string) => import("./validation.js").ValidationResult>} */
const FIELD_VALIDATORS = {
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
  message: validateMessage,
};

// Centralized DOM references. Looked up once at module load.
const form = document.getElementById("contactForm");
const submitButton = form?.querySelector(".submit-button") ?? null;
const successMessage = document.getElementById("successMessage");

const inputs = {
  fullName: /** @type {HTMLInputElement | null} */ (
    document.getElementById("fullName")
  ),
  email: /** @type {HTMLInputElement | null} */ (
    document.getElementById("email")
  ),
  phone: /** @type {HTMLInputElement | null} */ (
    document.getElementById("phone")
  ),
  message: /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById("message")
  ),
};

const errorElements = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  message: document.getElementById("messageError"),
};

/**
 * Reads the current values of every form field from the DOM.
 *
 * @returns {import("./validation.js").FormData}
 */
export function getFormData() {
  return {
    fullName: inputs.fullName?.value ?? "",
    email: inputs.email?.value ?? "",
    phone: inputs.phone?.value ?? "",
    message: inputs.message?.value ?? "",
  };
}

/**
 * Applies a validation result to a single field in the DOM.
 *
 * Sets/clears the error message, toggles `.is-valid`/`.is-invalid`, and
 * updates `aria-invalid`.
 *
 * @param {string} fieldName - One of fullName, email, phone, message.
 * @param {import("./validation.js").ValidationResult} result
 * @returns {void}
 */
export function renderFieldState(fieldName, result) {
  const input = inputs[fieldName];
  const errorEl = errorElements[fieldName];
  if (!input || !errorEl) return;

  if (result.isValid) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
    errorEl.textContent = "";
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = result.message;
  }
}

/**
 * Validates one field by name using its dedicated validator and renders
 * the result.
 *
 * @param {string} fieldName
 * @returns {import("./validation.js").ValidationResult}
 */
export function validateSingleField(fieldName) {
  const validator = FIELD_VALIDATORS[fieldName];
  const input = inputs[fieldName];
  if (!validator || !input) {
    return { isValid: true, message: "" };
  }
  const result = validator(input.value);
  renderFieldState(fieldName, result);
  return result;
}

/**
 * Validates every field and renders all states.
 *
 * @returns {boolean} True when every field is valid.
 */
export function validateAllFields() {
  const formData = getFormData();
  const results = validateFormData(formData);
  let allValid = true;
  for (const name of FIELD_NAMES) {
    renderFieldState(name, results[name]);
    if (!results[name].isValid) allValid = false;
  }
  return allValid;
}

// Wire blur listeners for live per-field feedback as the user moves through
// the form.
for (const name of FIELD_NAMES) {
  const input = inputs[name];
  if (!input) continue;
  input.addEventListener("blur", () => {
    validateSingleField(name);
  });
}

const SUCCESS_HIDE_MS = 3000;
const ORIGINAL_SUBMIT_TEXT = submitButton?.textContent ?? "Submit";
let successHideTimer = null;

/**
 * Toggles the visual + interactive submitting state on the submit button.
 *
 * @param {boolean} isSubmitting
 * @returns {void}
 */
export function setSubmittingState(isSubmitting) {
  if (!submitButton) return;
  if (isSubmitting) {
    submitButton.disabled = true;
    submitButton.classList.add("is-submitting");
    submitButton.textContent = "Submitting...";
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove("is-submitting");
    submitButton.textContent = ORIGINAL_SUBMIT_TEXT;
  }
}

/**
 * Reveals the green success message with the CSS fade-in animation.
 *
 * @returns {void}
 */
export function showSuccessMessage() {
  if (!successMessage) return;
  // Re-trigger the fade-in animation if the message was already visible by
  // toggling the class off and back on.
  successMessage.classList.remove("is-visible");
  // Force reflow so the animation restart is observed.
  void successMessage.offsetWidth;
  successMessage.classList.add("is-visible");
}

/**
 * Hides the success message.
 *
 * @returns {void}
 */
export function hideSuccessMessage() {
  if (!successMessage) return;
  successMessage.classList.remove("is-visible");
}

/**
 * Clears the form fields and removes any validation state classes / ARIA
 * flags / error text. Used after a successful submission.
 *
 * @returns {void}
 */
export function resetFormState() {
  for (const name of FIELD_NAMES) {
    const input = inputs[name];
    const errorEl = errorElements[name];
    if (input) {
      input.value = "";
      input.classList.remove("is-valid", "is-invalid");
      input.setAttribute("aria-invalid", "false");
    }
    if (errorEl) {
      errorEl.textContent = "";
    }
  }
}

// Submit handler. Always prevents the default browser navigation, validates
// every field, and on success runs the full success flow: capture data,
// briefly disable the button, show success, reset the form, then hide the
// success message after 3 seconds. The alert call is added in Batch 07.
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const allValid = validateAllFields();
  if (!allValid) {
    // Leave invalid values visible so the user can correct them.
    return;
  }

  // Capture submitted data BEFORE resetFormState clears the inputs. Batch 07
  // uses this for the alert.
  /* eslint-disable-next-line no-unused-vars */
  const submittedData = getFormData();

  setSubmittingState(true);
  showSuccessMessage();
  resetFormState();
  setSubmittingState(false);

  if (successHideTimer !== null) {
    clearTimeout(successHideTimer);
  }
  successHideTimer = setTimeout(() => {
    hideSuccessMessage();
    successHideTimer = null;
  }, SUCCESS_HIDE_MS);
});

// Export DOM-level helpers so integration tests can drive the form by name.
export { form, submitButton, successMessage, inputs, errorElements };
