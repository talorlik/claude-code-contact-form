/**
 * Browser entry point for the contact form.
 *
 * Wires the pure validators in `validation.js` to live form fields, renders
 * per-field feedback on blur, and on a valid submit runs the success
 * sequence (submitted-details popup, reset, button-state restoration).
 *
 * @module main
 */

import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateFormData,
  stripLeadingZero,
} from "./validation.js";
import { loadCountries } from "./countries.js";
import { createCountryPicker } from "./countryPicker.js";

const DEFAULT_COUNTRY_ISO2 = "IL";

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
const submissionPopup = document.getElementById("submissionPopup");
const submissionPopupClose = /** @type {HTMLButtonElement | null} */ (
  document.getElementById("submissionPopupClose")
);

const submittedOutput = {
  fullName: document.getElementById("submittedFullName"),
  email: document.getElementById("submittedEmail"),
  phone: document.getElementById("submittedPhone"),
  message: document.getElementById("submittedMessage"),
};

// The visible "phone" field is the national-number input; the hidden #phone
// carries the concatenated `+<dialCode> <nationalNumber>` value that the
// form submits. `inputs.phone` therefore points at the visible element so
// blur listeners and renderFieldState target what the user actually sees.
const inputs = {
  fullName: /** @type {HTMLInputElement | null} */ (
    document.getElementById("fullName")
  ),
  email: /** @type {HTMLInputElement | null} */ (
    document.getElementById("email")
  ),
  phone: /** @type {HTMLInputElement | null} */ (
    document.getElementById("nationalNumber")
  ),
  message: /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById("message")
  ),
};

const hiddenPhoneInput = /** @type {HTMLInputElement | null} */ (
  document.getElementById("phone")
);
const countryTriggerEl = /** @type {HTMLButtonElement | null} */ (
  document.getElementById("countryTrigger")
);
const countryPopoverEl = document.getElementById("countryPopover");
const countrySearchEl = /** @type {HTMLInputElement | null} */ (
  document.getElementById("countrySearch")
);
const countryListEl = document.getElementById("countryList");

/** @type {import("./countryPicker.js").CountryPickerApi | null} */
let countryPickerApi = null;
/** @type {import("./countries.js").Country | null} */
let selectedCountry = null;

const errorElements = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  message: document.getElementById("messageError"),
};

/**
 * Reads the current values of every form field from the DOM.
 *
 * The `phone` value is read from the hidden #phone input, which is kept in
 * sync with the country picker and national-number input by
 * `recomputeHiddenPhone()`.
 *
 * @returns {import("./validation.js").FormData}
 */
export function getFormData() {
  return {
    fullName: inputs.fullName?.value ?? "",
    email: inputs.email?.value ?? "",
    phone: hiddenPhoneInput?.value ?? "",
    message: inputs.message?.value ?? "",
  };
}

/**
 * Recomputes the hidden #phone value from the current country selection and
 * national-number input. Strips exactly one leading 0 from the national
 * portion before concatenating.
 *
 * @returns {void}
 */
export function recomputeHiddenPhone() {
  if (!hiddenPhoneInput) return;
  const nat = stripLeadingZero(inputs.phone?.value ?? "");
  const dial = selectedCountry?.dialCode ?? "";
  // Always include the space so an empty national number still trips the
  // regex (which requires `+<code> \d{4,14}`).
  hiddenPhoneInput.value = `${dial} ${nat}`;
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
 * For phone, validates against the hidden #phone value (the concatenated
 * `+<dialCode> <nationalNumber>` form) rather than the visible national-
 * number input, since the validator's regex covers the full format.
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
  let valueToValidate = input.value;
  if (fieldName === "phone") {
    recomputeHiddenPhone();
    valueToValidate = hiddenPhoneInput?.value ?? "";
  }
  const result = validator(valueToValidate);
  renderFieldState(fieldName, result);
  return result;
}

/**
 * Validates every field and renders all states.
 *
 * @returns {boolean} True when every field is valid.
 */
export function validateAllFields() {
  recomputeHiddenPhone();
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

// Keep the hidden #phone mirror in sync with the visible national-number
// input on every keystroke. This is not required for validation
// correctness (validate* paths recompute before reading), but it keeps
// DevTools and any external observers honest about the submitted value.
inputs.phone?.addEventListener("input", () => {
  recomputeHiddenPhone();
});

const ORIGINAL_SUBMIT_TEXT = submitButton?.textContent ?? "Submit";

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
 * Reveals the submitted-details success popup.
 *
 * @param {import("./validation.js").FormData} formData
 * @returns {void}
 */
export function showSubmissionPopup(formData) {
  if (
    !submissionPopup ||
    !submittedOutput.fullName ||
    !submittedOutput.email ||
    !submittedOutput.phone ||
    !submittedOutput.message
  ) {
    return;
  }
  submittedOutput.fullName.textContent = formData.fullName;
  submittedOutput.email.textContent = formData.email;
  submittedOutput.phone.textContent = formData.phone;
  submittedOutput.message.textContent = formData.message;
  submissionPopup.hidden = false;
  submissionPopup.classList.add("is-visible");
  submissionPopupClose?.focus();
}

/**
 * Hides the submitted-details success popup.
 *
 * @returns {void}
 */
export function hideSubmissionPopup() {
  if (!submissionPopup) return;
  submissionPopup.classList.remove("is-visible");
  submissionPopup.hidden = true;
}

submissionPopupClose?.addEventListener("click", hideSubmissionPopup);

submissionPopup?.addEventListener("click", (event) => {
  if (event.target === submissionPopup) {
    hideSubmissionPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && submissionPopup?.hidden === false) {
    hideSubmissionPopup();
  }
});

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
  // Reset the country picker (if loaded) back to the default and clear the
  // hidden #phone mirror so the next submission starts from a clean state.
  if (countryPickerApi) {
    countryPickerApi.setSelectedByIso2(DEFAULT_COUNTRY_ISO2);
    // setSelectedByIso2 does not fire onChange, so update selectedCountry +
    // hidden mirror manually to mirror what onChange would have done.
    selectedCountry = countryPickerApi.getSelected();
  }
  recomputeHiddenPhone();
}

// Submit handler. Always prevents the default browser navigation, validates
// every field, and on success runs the full success flow: capture data,
// briefly disable the button, show the submitted-details popup, reset the form,
// then restore the button state.
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const allValid = validateAllFields();
  if (!allValid) {
    // Leave invalid values visible so the user can correct them.
    return;
  }

  // Capture submitted data BEFORE resetFormState clears the inputs so the
  // popup can echo what the user actually typed.
  const submittedData = getFormData();

  setSubmittingState(true);
  showSubmissionPopup(submittedData);
  resetFormState();
  setSubmittingState(false);
});

/**
 * Falls back to a plain phone input when the country list cannot load. The
 * hidden #phone becomes visible, the country trigger + popover are removed,
 * and the national-number input is hidden. Validation continues to read
 * #phone, so the only behavior change is that the user types the full
 * international number themselves (the pre-picker UX).
 *
 * @returns {void}
 */
function fallbackToPlainPhoneInput() {
  if (!hiddenPhoneInput || !inputs.phone) return;
  // Swap the hidden #phone back to a visible tel input.
  hiddenPhoneInput.type = "tel";
  hiddenPhoneInput.classList.add("form-input");
  hiddenPhoneInput.placeholder = "+972541234567";
  hiddenPhoneInput.setAttribute("autocomplete", "tel");
  hiddenPhoneInput.setAttribute("aria-describedby", "phoneError");
  hiddenPhoneInput.setAttribute("aria-invalid", "false");
  hiddenPhoneInput.required = true;
  // Hide the picker UI and the national-only input.
  countryTriggerEl?.setAttribute("hidden", "");
  countryPopoverEl?.setAttribute("hidden", "");
  inputs.phone.setAttribute("hidden", "");
  inputs.phone.removeAttribute("required");
  // Repoint inputs.phone at the now-visible #phone so blur/render targets
  // it and the validator runs against its raw value.
  inputs.phone = hiddenPhoneInput;
  hiddenPhoneInput.addEventListener("blur", () => {
    validateSingleField("phone");
  });
  // Repoint the label so clicking it focuses the right input. The label
  // for= still points at "nationalNumber"; rebinding by id avoids touching
  // the HTML in two places.
  const label = document.querySelector('label[for="nationalNumber"]');
  if (label) label.setAttribute("for", "phone");
}

// Boot: load the country list and create the picker. If the JSON fails to
// load, fall back to a plain phone input so the form remains usable.
(async () => {
  if (!countryTriggerEl || !countryPopoverEl || !countrySearchEl || !countryListEl) {
    return;
  }
  try {
    const countries = await loadCountries();
    countryPickerApi = createCountryPicker({
      triggerEl: countryTriggerEl,
      popoverEl: countryPopoverEl,
      searchInputEl: countrySearchEl,
      listEl: countryListEl,
      countries,
      defaultIso2: DEFAULT_COUNTRY_ISO2,
      onChange: (country) => {
        selectedCountry = country;
        recomputeHiddenPhone();
        validateSingleField("phone");
      },
    });
    selectedCountry = countryPickerApi.getSelected();
    recomputeHiddenPhone();
  } catch (err) {
    console.error("Country picker disabled:", err);
    fallbackToPlainPhoneInput();
  }
})();

// Export DOM-level helpers so integration tests can drive the form by name.
export {
  form,
  submitButton,
  submissionPopup,
  submissionPopupClose,
  inputs,
  errorElements,
  hiddenPhoneInput,
};
