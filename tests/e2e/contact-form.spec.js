import { test, expect } from "@playwright/test";

const VALID = {
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  // The national number the user types; the picker contributes the +972
  // dial code, so the submitted phone is "+972 541234567".
  nationalNumber: "541234567",
  phoneSubmitted: "+972 541234567",
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

test("country picker defaults to Israel and seeds the hidden phone", async ({
  page,
}) => {
  const trigger = page.locator("#countryTrigger");
  await expect(trigger).toContainText("+972");
  // The flag emoji is in the trigger label as well.
  await expect(trigger).toHaveAttribute("aria-label", /Israel/);
  // Hidden #phone starts with "+972 " (no national digits yet).
  await expect(page.locator("#phone")).toHaveValue("+972 ");
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

  for (const id of ["#fullName", "#email", "#nationalNumber", "#message"]) {
    await expect(page.locator(id)).toHaveClass(/is-invalid/);
  }

  await page.waitForTimeout(50);
  expect(alertFired).toBe(false);
});

test("entering letters in the national-number input shows a phone error on blur", async ({
  page,
}) => {
  const nat = page.locator("#nationalNumber");
  await nat.fill("054abc4567");
  await nat.blur();
  await expect(page.locator("#phoneError")).not.toHaveText("");
  await expect(nat).toHaveClass(/is-invalid/);
});

test("country picker is searchable by ISO code and selects on Enter", async ({
  page,
}) => {
  await page.locator("#countryTrigger").click();
  const popover = page.locator("#countryPopover");
  await expect(popover).toBeVisible();
  const search = page.locator("#countrySearch");
  await search.fill("US");
  // First filtered option should be the United States.
  const firstOption = page.locator("#countryList [role='option']").first();
  await expect(firstOption).toHaveAttribute("data-iso2", "US");
  await search.press("Enter");
  await expect(page.locator("#countryTrigger")).toContainText("+1");
  await expect(popover).toBeHidden();
});

test("country picker is searchable by full name", async ({ page }) => {
  await page.locator("#countryTrigger").click();
  await page.locator("#countrySearch").fill("Israel");
  const firstOption = page.locator("#countryList [role='option']").first();
  await expect(firstOption).toHaveAttribute("data-iso2", "IL");
});

test("valid submission strips a leading 0 and shows the submitted-details popup", async ({
  page,
}) => {
  let alertFired = false;
  page.on("dialog", async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });

  await page.locator("#fullName").fill(VALID.fullName);
  await page.locator("#email").fill(VALID.email);
  // Type with the leading 0 the spec calls out — the picker should strip it.
  await page.locator("#nationalNumber").fill("0" + VALID.nationalNumber);
  await page.locator("#message").fill(VALID.message);

  await page.getByRole("button", { name: "Submit" }).click();

  expect(alertFired).toBe(false);

  const popup = page.locator("#submissionPopup");
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("Message Sent");
  await expect(page.locator("#submittedFullName")).toHaveText(VALID.fullName);
  await expect(page.locator("#submittedEmail")).toHaveText(VALID.email);
  await expect(page.locator("#submittedPhone")).toHaveText(VALID.phoneSubmitted);
  await expect(page.locator("#submittedMessage")).toHaveText(VALID.message);

  // Fields cleared, picker reset to IL default.
  await expect(page.locator("#fullName")).toHaveValue("");
  await expect(page.locator("#email")).toHaveValue("");
  await expect(page.locator("#nationalNumber")).toHaveValue("");
  await expect(page.locator("#message")).toHaveValue("");
  await expect(page.locator("#countryTrigger")).toContainText("+972");
  await expect(page.locator("#phone")).toHaveValue("+972 ");

  await page.getByRole("button", { name: "Close submitted details" }).click();
  await expect(popup).toBeHidden();
});

test("submitted-details popup closes when clicking outside it", async ({
  page,
}) => {
  await page.locator("#fullName").fill(VALID.fullName);
  await page.locator("#email").fill(VALID.email);
  await page.locator("#nationalNumber").fill(VALID.nationalNumber);
  await page.locator("#message").fill(VALID.message);

  await page.getByRole("button", { name: "Submit" }).click();

  const popup = page.locator("#submissionPopup");
  await expect(popup).toBeVisible();
  await popup.click({ position: { x: 8, y: 8 } });
  await expect(popup).toBeHidden();
});

test("changing the country re-runs phone validation", async ({ page }) => {
  // Type a valid Israeli national number first.
  await page.locator("#nationalNumber").fill("541234567");
  await page.locator("#nationalNumber").blur();
  await expect(page.locator("#nationalNumber")).toHaveClass(/is-valid/);
  await expect(page.locator("#phone")).toHaveValue("+972 541234567");

  // Switch country to US. The same national number remains valid under
  // the regex (4-14 digits), so it should stay valid but with a new dial.
  await page.locator("#countryTrigger").click();
  await page.locator("#countrySearch").fill("US");
  await page.locator("#countrySearch").press("Enter");
  await expect(page.locator("#phone")).toHaveValue("+1 541234567");
  await expect(page.locator("#nationalNumber")).toHaveClass(/is-valid/);
});
