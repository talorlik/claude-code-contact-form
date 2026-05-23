import { test, expect } from "@playwright/test";

const VALID = {
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  phone: "+972541234567",
  message: "I would like more information.",
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("page loads with the Contact Us heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { level: 1, name: "Contact Us" })
  ).toBeVisible();
});

test("submitting an empty form shows every required error and no alert", async ({
  page,
}) => {
  let alertFired = false;
  page.on("dialog", async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });

  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator("#fullNameError")).not.toHaveText("");
  await expect(page.locator("#emailError")).not.toHaveText("");
  await expect(page.locator("#phoneError")).not.toHaveText("");
  await expect(page.locator("#messageError")).not.toHaveText("");

  for (const id of ["#fullName", "#email", "#phone", "#message"]) {
    await expect(page.locator(id)).toHaveClass(/is-invalid/);
  }

  // Give any (incorrectly) fired dialog a chance to surface.
  await page.waitForTimeout(50);
  expect(alertFired).toBe(false);
});

test("entering letters in phone shows a phone-specific error on blur", async ({
  page,
}) => {
  const phone = page.locator("#phone");
  await phone.fill("054abc4567");
  await phone.blur();
  await expect(page.locator("#phoneError")).not.toHaveText("");
  await expect(phone).toHaveClass(/is-invalid/);
});

test("valid submission alerts submitted data, clears form, and shows then hides success", async ({
  page,
}) => {
  let alertText = "";
  page.on("dialog", async (dialog) => {
    alertText = dialog.message();
    await dialog.accept();
  });

  await page.locator("#fullName").fill(VALID.fullName);
  await page.locator("#email").fill(VALID.email);
  await page.locator("#phone").fill(VALID.phone);
  await page.locator("#message").fill(VALID.message);

  await page.getByRole("button", { name: "Submit" }).click();

  // Alert content matches the spec format.
  expect(alertText).toContain("Submitted Data:");
  expect(alertText).toContain(`Name: ${VALID.fullName}`);
  expect(alertText).toContain(`Email: ${VALID.email}`);
  expect(alertText).toContain(`Phone: ${VALID.phone}`);
  expect(alertText).toContain(`Message: ${VALID.message}`);

  // Fields are cleared.
  await expect(page.locator("#fullName")).toHaveValue("");
  await expect(page.locator("#email")).toHaveValue("");
  await expect(page.locator("#phone")).toHaveValue("");
  await expect(page.locator("#message")).toHaveValue("");

  // Success message visible.
  const success = page.locator("#successMessage");
  await expect(success).toHaveClass(/is-visible/);

  // Success message disappears after the 3-second timer (allow a small
  // grace window for the timer to fire on slower machines).
  await expect(success).not.toHaveClass(/is-visible/, { timeout: 5000 });
});
