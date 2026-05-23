// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_HTML_PATH = resolve(__dirname, "../../index.html");

/**
 * Loads index.html into the jsdom document for the current test, then
 * dynamically imports main.js so its module-scope DOM lookups bind to the
 * just-loaded DOM. Each test gets a fresh module instance so timers and
 * cached state do not leak between tests.
 */
async function setupForm() {
  const html = readFileSync(INDEX_HTML_PATH, "utf8");
  // Use the parsed document to swap body and head contents.
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");
  document.documentElement.innerHTML = parsed.documentElement.innerHTML;

  vi.resetModules();
  // Import after the DOM is in place so module-scope lookups find elements.
  const mod = await import("../../javascript/main.js");
  return mod;
}

const VALID_VALUES = {
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  phone: "+972541234567",
  message: "I would like more information.",
};

function setField(name, value) {
  const el = document.getElementById(name);
  el.value = value;
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

beforeEach(() => {
  alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  alertSpy.mockRestore();
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

  it("shows a field-specific error for letters in phone", async () => {
    await setupForm();
    setField("phone", "054abc4567");
    blur("phone");
    const input = document.getElementById("phone");
    const error = document.getElementById("phoneError");
    expect(input.classList.contains("is-invalid")).toBe(true);
    expect(error.textContent.length).toBeGreaterThan(0);
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

  it("does not call alert", async () => {
    await setupForm();
    submitForm();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("does not reveal the success message", async () => {
    await setupForm();
    submitForm();
    const success = document.getElementById("successMessage");
    expect(success.classList.contains("is-visible")).toBe(false);
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
    setField("phone", VALID_VALUES.phone);
    setField("message", VALID_VALUES.message);
  }

  it("calls alert with the submitted values", async () => {
    await fillValid();
    submitForm();
    expect(alertSpy).toHaveBeenCalledTimes(1);
    const text = alertSpy.mock.calls[0][0];
    expect(text).toContain("Submitted Data:");
    expect(text).toContain(`Name: ${VALID_VALUES.fullName}`);
    expect(text).toContain(`Email: ${VALID_VALUES.email}`);
    expect(text).toContain(`Phone: ${VALID_VALUES.phone}`);
    expect(text).toContain(`Message: ${VALID_VALUES.message}`);
  });

  it("reveals the success message", async () => {
    await fillValid();
    submitForm();
    const success = document.getElementById("successMessage");
    expect(success.classList.contains("is-visible")).toBe(true);
  });

  it("clears every field after submit", async () => {
    await fillValid();
    submitForm();
    expect(document.getElementById("fullName").value).toBe("");
    expect(document.getElementById("email").value).toBe("");
    expect(document.getElementById("phone").value).toBe("");
    expect(document.getElementById("message").value).toBe("");
  });

  it("removes validation border classes and resets aria-invalid after reset", async () => {
    await fillValid();
    submitForm();
    for (const id of ["fullName", "email", "phone", "message"]) {
      const el = document.getElementById(id);
      expect(el.classList.contains("is-valid")).toBe(false);
      expect(el.classList.contains("is-invalid")).toBe(false);
      expect(el.getAttribute("aria-invalid")).toBe("false");
    }
  });

  it("hides the success message after the 3-second timer", async () => {
    await fillValid();
    submitForm();
    const success = document.getElementById("successMessage");
    expect(success.classList.contains("is-visible")).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(success.classList.contains("is-visible")).toBe(false);
  });

  it("does not hide the success message before the 3-second timer fires", async () => {
    await fillValid();
    submitForm();
    const success = document.getElementById("successMessage");
    vi.advanceTimersByTime(2999);
    expect(success.classList.contains("is-visible")).toBe(true);
  });
});
