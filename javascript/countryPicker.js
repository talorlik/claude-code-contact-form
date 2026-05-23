/**
 * Searchable country-code combobox.
 *
 * DOM module: takes pre-existing elements (trigger button, popover, search
 * input, options list) and wires them into an accessible combobox following
 * the ARIA 1.2 combobox-with-listbox-popup pattern.
 *
 * Generic — does not know about phone validation, the form, or what the
 * selection is "for". Communicates selection changes through the
 * `onChange` callback.
 *
 * @module countryPicker
 */

import { searchCountries } from "./countries.js";

/**
 * @typedef {import("./countries.js").Country} Country
 */

/**
 * @typedef {Object} CountryPickerOptions
 * @property {HTMLButtonElement} triggerEl - The combobox button that opens/closes the popover.
 * @property {HTMLElement} popoverEl - The container that holds the search input and options list.
 * @property {HTMLInputElement} searchInputEl - The search input inside the popover.
 * @property {HTMLElement} listEl - The `<ul role="listbox">` that holds option elements.
 * @property {Country[]} countries - The full country list (already loaded).
 * @property {string} [defaultIso2] - ISO2 of the initially selected country (default: first in list).
 * @property {(country: Country) => void} [onChange] - Called whenever the selected country changes.
 */

/**
 * @typedef {Object} CountryPickerApi
 * @property {() => void} open
 * @property {() => void} close
 * @property {() => Country | null} getSelected
 * @property {(iso2: string) => void} setSelectedByIso2
 */

const OPTION_ID_PREFIX = "country-option-";

/**
 * Creates a searchable country-code combobox bound to the provided
 * elements. Returns an imperative API for the caller (form code) to drive
 * the selection from outside (e.g., during form reset).
 *
 * @param {CountryPickerOptions} options
 * @returns {CountryPickerApi}
 */
export function createCountryPicker({
  triggerEl,
  popoverEl,
  searchInputEl,
  listEl,
  countries,
  defaultIso2,
  onChange,
}) {
  /** @type {Country | null} */
  let selected = null;
  /** @type {Country[]} */
  let filtered = countries.slice();
  /** Index into `filtered` for keyboard navigation. -1 = no active option. */
  let activeIndex = -1;
  let isOpen = false;

  // Wire ARIA attributes that don't change after init.
  const listboxId = listEl.id || "country-listbox";
  listEl.id = listboxId;
  triggerEl.setAttribute("role", "combobox");
  triggerEl.setAttribute("aria-haspopup", "listbox");
  triggerEl.setAttribute("aria-controls", listboxId);
  triggerEl.setAttribute("aria-expanded", "false");
  triggerEl.type = "button"; // ensure no implicit submit inside the form
  listEl.setAttribute("role", "listbox");

  /**
   * Updates the trigger button's visible content + accessible label.
   * @param {Country} country
   */
  function paintTrigger(country) {
    triggerEl.innerHTML = "";
    const flag = document.createElement("span");
    flag.className = "country-trigger__flag";
    flag.setAttribute("aria-hidden", "true");
    flag.textContent = country.flag;
    const dial = document.createElement("span");
    dial.className = "country-trigger__dial";
    dial.textContent = country.dialCode;
    const caret = document.createElement("span");
    caret.className = "country-trigger__caret";
    caret.setAttribute("aria-hidden", "true");
    caret.textContent = "▾"; // ▾
    triggerEl.append(flag, dial, caret);
    triggerEl.setAttribute(
      "aria-label",
      `Country code, currently ${country.flag} ${country.dialCode} ${country.name}`
    );
  }

  /** Renders the currently filtered list to the DOM. */
  function paintList() {
    listEl.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("li");
      empty.className = "country-list__empty";
      empty.textContent = "No matches";
      listEl.appendChild(empty);
      searchInputEl.removeAttribute("aria-activedescendant");
      return;
    }
    filtered.forEach((c, i) => {
      const li = document.createElement("li");
      li.id = `${OPTION_ID_PREFIX}${c.iso2}`;
      li.className = "country-option";
      li.setAttribute("role", "option");
      li.setAttribute("data-iso2", c.iso2);
      if (selected && c.iso2 === selected.iso2) {
        li.setAttribute("aria-selected", "true");
        li.classList.add("is-selected");
      } else {
        li.setAttribute("aria-selected", "false");
      }
      if (i === activeIndex) {
        li.classList.add("is-active");
      }

      const flag = document.createElement("span");
      flag.className = "country-option__flag";
      flag.setAttribute("aria-hidden", "true");
      flag.textContent = c.flag;
      const name = document.createElement("span");
      name.className = "country-option__name";
      name.textContent = c.name;
      const dial = document.createElement("span");
      dial.className = "country-option__dial";
      dial.textContent = c.dialCode;
      li.append(flag, name, dial);
      listEl.appendChild(li);
    });

    if (activeIndex >= 0 && activeIndex < filtered.length) {
      searchInputEl.setAttribute(
        "aria-activedescendant",
        `${OPTION_ID_PREFIX}${filtered[activeIndex].iso2}`
      );
      const activeEl = listEl.children[activeIndex];
      if (activeEl && typeof activeEl.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    } else {
      searchInputEl.removeAttribute("aria-activedescendant");
    }
  }

  function setActiveIndex(next) {
    if (filtered.length === 0) {
      activeIndex = -1;
      return;
    }
    if (next < 0) next = filtered.length - 1;
    if (next >= filtered.length) next = 0;
    activeIndex = next;
    paintList();
  }

  function applyFilter(query) {
    filtered = searchCountries(query);
    // Reset active to first match when filter changes (or -1 if empty).
    activeIndex = filtered.length > 0 ? 0 : -1;
    paintList();
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    popoverEl.hidden = false;
    triggerEl.setAttribute("aria-expanded", "true");
    searchInputEl.value = "";
    applyFilter("");
    // Defer focus so click events that opened the popover finish first.
    queueMicrotask(() => searchInputEl.focus());
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    popoverEl.hidden = true;
    triggerEl.setAttribute("aria-expanded", "false");
    triggerEl.focus();
  }

  function selectByIso2(iso2, { fireChange = true } = {}) {
    const country = countries.find((c) => c.iso2 === iso2);
    if (!country) return;
    const changed = !selected || selected.iso2 !== country.iso2;
    selected = country;
    paintTrigger(country);
    if (changed && fireChange && onChange) {
      onChange(country);
    }
  }

  function selectFromActiveIndex() {
    if (activeIndex < 0 || activeIndex >= filtered.length) return;
    selectByIso2(filtered[activeIndex].iso2);
    close();
  }

  // ---- event wiring ----

  triggerEl.addEventListener("click", () => {
    if (isOpen) close();
    else open();
  });

  triggerEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  searchInputEl.addEventListener("input", () => {
    applyFilter(searchInputEl.value);
  });

  searchInputEl.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex(activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        selectFromActiveIndex();
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  });

  listEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const li = target.closest('[role="option"]');
    if (!li) return;
    const iso2 = li.getAttribute("data-iso2");
    if (iso2) {
      selectByIso2(iso2);
      close();
    }
  });

  // Click outside the popover (and not on the trigger) closes it.
  document.addEventListener("click", (event) => {
    if (!isOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (popoverEl.contains(target) || triggerEl.contains(target)) return;
    close();
  });

  // ---- init ----
  popoverEl.hidden = true;
  // Pick the default selection without firing onChange (initial state, not a
  // user-driven change).
  const initialIso2 =
    (defaultIso2 && countries.find((c) => c.iso2 === defaultIso2)?.iso2) ||
    countries[0]?.iso2;
  if (initialIso2) {
    selectByIso2(initialIso2, { fireChange: false });
  }

  return {
    open,
    close,
    getSelected: () => selected,
    setSelectedByIso2: (iso2) => selectByIso2(iso2, { fireChange: false }),
  };
}
