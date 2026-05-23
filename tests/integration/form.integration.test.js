// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_HTML_PATH = resolve(__dirname, "../../index.html");

// Compact country fixture covering the cases the tests exercise. Real
// world-countries data is far larger; we don't need it here.
const COUNTRY_FIXTURE = [
  { name: "Canada", iso2: "CA", iso3: "CAN", dialCode: "+1", flag: "🇨🇦" },
  { name: "Israel", iso2: "IL", iso3: "ISR", dialCode: "+972", flag: "🇮🇱" },
  { name: "United Kingdom", iso2: "GB", iso3: "GBR", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", iso2: "US", iso3: "USA", dialCode: "+1", flag: "🇺🇸" },
];

/**
 * Loads index.html into the jsdom document for the current test, then
 * dynamically imports main.js so its module-scope DOM lookups bind to the
 * just-loaded DOM. Each test gets a fresh module instance so timers and
 * cached state do not leak between tests.
 */
async function setupForm() {
  const html = readFileSync(INDEX_HTML_PATH, "utf8");
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");
  document.documentElement.innerHTML = parsed.documentElement.innerHTML;

  vi.resetModules();
  const mod = await import("../../javascript/main.js");
  // Let the picker-boot promise resolve (loadCountries -> picker init).
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  return mod;
}

const VALID_NATIONAL = "541234567";
// With default IL (+972) selected and `541234567` typed, the hidden #phone
// carries the concatenated form that getFormData/the success popup use.
const VALID_PHONE_SUBMITTED = "+972 541234567";
const VALID_VALUES = {
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  message: "I would like more information.",
};

function setField(name, value) {
  const el = document.getElementById(name);
  el.value = value;
  // Some handlers (national-number recompute) listen for 'input'.
  el.dispatchEvent(new Event("input"));
  return el;
}

function blur(name) {
  const el = document.getElementById(name);
  el.dispatchEvent(new Event("blur"));
}

function submitForm() {
  const form = document.getElementById("contactForm");
  form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
}

let alertSpy;
let fetchSpy;

beforeEach(() => {
  alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  // Stub fetch so the country-loader resolves to a known fixture without
  // hitting the filesystem from jsdom.
  fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => COUNTRY_FIXTURE,
  });
});

afterEach(() => {
  // Tests that opt into fake timers must call vi.useRealTimers themselves;
  // this is a safety net in case one forgets.
  if (vi.isFakeTimers()) vi.useRealTimers();
  alertSpy.mockRestore();
  fetchSpy.mockRestore();
});

describe("required field indicators", () => {
  it("shows required asterisks on labels and explains them in small print", async () => {
    await setupForm();

    const intro = document.querySelector(".contact-intro");
    expect(intro.textContent).not.toMatch(/all fields are required/i);

    const note = document.querySelector(".required-note");
    expect(note.textContent).toBe("Fields marked with (*) are required.");

    const labels = [...document.querySelectorAll(".form-label")];
    expect(labels).toHaveLength(4);
    expect(
      labels.map((label) => label.querySelector(".required-indicator")?.textContent)
    ).toEqual(["*", "*", "*", "*"]);
  });
});

describe("country picker boot", () => {
  it("paints the default selected country (Israel) into the trigger", async () => {
    await setupForm();
    const trigger = document.getElementById("countryTrigger");
    expect(trigger.textContent).toContain("🇮🇱");
    expect(trigger.textContent).toContain("+972");
    expect(trigger.getAttribute("aria-label")).toMatch(/Israel/);
  });

  it("seeds the hidden #phone with the default dial code", async () => {
    await setupForm();
    const hidden = document.getElementById("phone");
    expect(hidden.value).toBe("+972 ");
  });

  it("opens the popover on trigger click and focuses the search input", async () => {
    await setupForm();
    document.getElementById("countryTrigger").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    const popover = document.getElementById("countryPopover");
    expect(popover.hidden).toBe(false);
    // queueMicrotask defers focus; let it run.
    await Promise.resolve();
    expect(document.activeElement?.id).toBe("countrySearch");
  });

  it("filters the list as the user types in the search input", async () => {
    await setupForm();
    document.getElementById("countryTrigger").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    const search = document.getElementById("countrySearch");
    search.value = "IL";
    search.dispatchEvent(new Event("input"));
    const list = document.getElementById("countryList");
    const options = list.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0].getAttribute("data-iso2")).toBe("IL");
  });

  it("selects a country on click and updates the trigger + hidden phone", async () => {
    await setupForm();
    setField("nationalNumber", "1234567");
    document.getElementById("countryTrigger").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    // Click the United States option.
    const usOption = document.querySelector('[data-iso2="US"]');
    usOption.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.getElementById("countryTrigger").textContent).toContain(
      "+1"
    );
    expect(document.getElementById("phone").value).toBe("+1 1234567");
  });
});

describe("hidden #phone recomputation", () => {
  it("strips a single leading 0 from the national number", async () => {
    await setupForm();
    setField("nationalNumber", "0541234567");
    expect(document.getElementById("phone").value).toBe("+972 541234567");
  });

  it("keeps one 0 when the user typed two leading zeros", async () => {
    await setupForm();
    setField("nationalNumber", "00541234567");
    expect(document.getElementById("phone").value).toBe("+972 0541234567");
  });

  it("reflects a country change with the current national number typed", async () => {
    await setupForm();
    setField("nationalNumber", "0541234567");
    document.getElementById("countryTrigger").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    document
      .querySelector('[data-iso2="GB"]')
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.getElementById("phone").value).toBe("+44 541234567");
  });
});

describe("blur validation", () => {
  it("shows an error and marks invalid when an empty field is blurred", async () => {
    await setupForm();
    blur("fullName");
    const input = document.getElementById("fullName");
    const error = document.getElementById("fullNameError");
    expect(input.classList.contains("is-invalid")).toBe(true);
    expect(input.classList.contains("is-valid")).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(error.textContent).toMatch(/required/i);
  });

  it("shows a field-specific error for letters in the national-number input", async () => {
    await setupForm();
    setField("nationalNumber", "054abc4567");
    blur("nationalNumber");
    const input = document.getElementById("nationalNumber");
    const error = document.getElementById("phoneError");
    expect(input.classList.contains("is-invalid")).toBe(true);
    expect(error.textContent.length).toBeGreaterThan(0);
  });

  it("marks the national input valid when the resulting hidden phone is valid", async () => {
    await setupForm();
    setField("nationalNumber", "0541234567");
    blur("nationalNumber");
    const input = document.getElementById("nationalNumber");
    expect(input.classList.contains("is-valid")).toBe(true);
    expect(input.classList.contains("is-invalid")).toBe(false);
    expect(document.getElementById("phone").value).toBe("+972 541234567");
  });

  it("clears the error and marks valid when a valid value is blurred", async () => {
    await setupForm();
    setField("email", "taylor@example.com");
    blur("email");
    const input = document.getElementById("email");
    const error = document.getElementById("emailError");
    expect(input.classList.contains("is-valid")).toBe(true);
    expect(input.classList.contains("is-invalid")).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(error.textContent).toBe("");
  });

  it("flips a previously invalid field to valid on the next blur", async () => {
    await setupForm();
    setField("fullName", "A");
    blur("fullName");
    const input = document.getElementById("fullName");
    expect(input.classList.contains("is-invalid")).toBe(true);

    setField("fullName", "Taylor Smith");
    blur("fullName");
    expect(input.classList.contains("is-valid")).toBe(true);
    expect(input.classList.contains("is-invalid")).toBe(false);
  });
});

describe("submit with invalid data", () => {
  it("shows errors for every empty required field", async () => {
    await setupForm();
    submitForm();
    expect(document.getElementById("fullNameError").textContent).not.toBe("");
    expect(document.getElementById("emailError").textContent).not.toBe("");
    expect(document.getElementById("phoneError").textContent).not.toBe("");
    expect(document.getElementById("messageError").textContent).not.toBe("");
  });

  it("does not call alert or reveal the submitted-details popup", async () => {
    await setupForm();
    submitForm();
    expect(alertSpy).not.toHaveBeenCalled();
    const popup = document.getElementById("submissionPopup");
    expect(popup.hidden).toBe(true);
  });

  it("preserves the user's invalid input so they can correct it", async () => {
    await setupForm();
    setField("fullName", "John123");
    setField("email", "broken");
    submitForm();
    expect(document.getElementById("fullName").value).toBe("John123");
    expect(document.getElementById("email").value).toBe("broken");
  });
});

describe("submit with valid data", () => {
  async function fillValid() {
    await setupForm();
    setField("fullName", VALID_VALUES.fullName);
    setField("email", VALID_VALUES.email);
    setField("nationalNumber", VALID_NATIONAL);
    setField("message", VALID_VALUES.message);
  }

  it("shows the submitted-details popup with the concatenated phone", async () => {
    await fillValid();
    submitForm();
    expect(alertSpy).not.toHaveBeenCalled();
    const popup = document.getElementById("submissionPopup");
    expect(popup.hidden).toBe(false);
    expect(popup.classList.contains("is-visible")).toBe(true);
    const text = popup.textContent;
    expect(text).toContain("Message Sent");
    expect(document.getElementById("submittedFullName").textContent).toBe(
      VALID_VALUES.fullName
    );
    expect(document.getElementById("submittedEmail").textContent).toBe(
      VALID_VALUES.email
    );
    expect(document.getElementById("submittedPhone").textContent).toBe(
      VALID_PHONE_SUBMITTED
    );
    expect(document.getElementById("submittedMessage").textContent).toBe(
      VALID_VALUES.message
    );
  });

  it("closes the submitted-details popup from the X button", async () => {
    await fillValid();
    submitForm();
    const popup = document.getElementById("submissionPopup");
    document
      .getElementById("submissionPopupClose")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(popup.hidden).toBe(true);
    expect(popup.classList.contains("is-visible")).toBe(false);
  });

  it("closes the submitted-details popup when clicking outside the card", async () => {
    await fillValid();
    submitForm();
    const popup = document.getElementById("submissionPopup");
    popup.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(popup.hidden).toBe(true);
  });

  it("keeps the submitted-details popup open when clicking inside the card", async () => {
    await fillValid();
    submitForm();
    const popup = document.getElementById("submissionPopup");
    document
      .querySelector(".submission-popup__card")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(popup.hidden).toBe(false);
  });

  it("clears every field after submit", async () => {
    await fillValid();
    submitForm();
    expect(document.getElementById("fullName").value).toBe("");
    expect(document.getElementById("email").value).toBe("");
    expect(document.getElementById("nationalNumber").value).toBe("");
    expect(document.getElementById("message").value).toBe("");
  });

  it("resets the country picker back to the default (Israel) after submit", async () => {
    await fillValid();
    // Switch to a non-default country before submitting.
    document.getElementById("countryTrigger").dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
    document
      .querySelector('[data-iso2="US"]')
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // Re-fill the national number that the country-change cleared expectations of.
    setField("nationalNumber", VALID_NATIONAL);
    submitForm();
    const trigger = document.getElementById("countryTrigger");
    expect(trigger.textContent).toContain("🇮🇱");
    expect(document.getElementById("phone").value).toBe("+972 ");
  });

  it("removes validation border classes and resets aria-invalid after reset", async () => {
    await fillValid();
    submitForm();
    for (const id of ["fullName", "email", "nationalNumber", "message"]) {
      const el = document.getElementById(id);
      expect(el.classList.contains("is-valid")).toBe(false);
      expect(el.classList.contains("is-invalid")).toBe(false);
      expect(el.getAttribute("aria-invalid")).toBe("false");
    }
  });

  it("does not auto-hide the submitted-details popup after 3 seconds", async () => {
    await fillValid();
    vi.useFakeTimers();
    submitForm();
    const popup = document.getElementById("submissionPopup");
    vi.advanceTimersByTime(3000);
    expect(popup.hidden).toBe(false);
    expect(popup.classList.contains("is-visible")).toBe(true);
    vi.useRealTimers();
  });
});
