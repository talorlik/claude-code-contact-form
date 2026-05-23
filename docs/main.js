(function () {
  "use strict";

  var STORAGE_KEY = "contact-form-docs-theme";
  var CANONICAL_BASE = "https://talorlik.github.io/claude-code-contact-form";
  var THEMES = {
    dark: "dark",
    light: "light",
  };

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Theme persistence is progressive enhancement only.
    }
  }

  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored === THEMES.dark || stored === THEMES.light) {
      return stored;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return THEMES.light;
    }
    return THEMES.dark;
  }

  function updateThemeButton(theme) {
    var button = document.getElementById("themeToggle");
    if (!button) return;
    var isLight = theme === THEMES.light;
    button.setAttribute("aria-pressed", String(isLight));
    button.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme",
    );
    var icon = button.querySelector(".theme-toggle__icon");
    if (icon) {
      icon.textContent = isLight ? "D" : "L";
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeButton(theme);
  }

  function bindThemeToggle() {
    var button = document.getElementById("themeToggle");
    if (!button) return;
    button.addEventListener("click", function () {
      var current =
        document.documentElement.getAttribute("data-theme") || THEMES.dark;
      var next = current === THEMES.dark ? THEMES.light : THEMES.dark;
      applyTheme(next);
      storeTheme(next);
    });
  }

  function getMetaDescription() {
    var el = document.querySelector('meta[name="description"]');
    if (el && el.getAttribute("content")) {
      return el.getAttribute("content").trim();
    }
    return "";
  }

  function injectJsonLd() {
    var description = getMetaDescription();
    var payload = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": CANONICAL_BASE + "/#webpage",
          name: "Claude Code Contact Form | Project Showcase",
          url: CANONICAL_BASE + "/",
          description: description,
          inLanguage: "en",
          about: { "@id": CANONICAL_BASE + "/#software" },
        },
        {
          "@type": "SoftwareSourceCode",
          "@id": CANONICAL_BASE + "/#software",
          name: "Claude Code Contact Form",
          description: description,
          codeRepository:
            "https://github.com/talorlik/claude-code-contact-form",
          programmingLanguage: ["HTML", "CSS", "JavaScript"],
          runtimePlatform: "Web browser",
          author: {
            "@type": "Person",
            name: "Tal Orlik",
            url: "https://github.com/talorlik",
          },
        },
      ],
    };

    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(payload);
    document.head.appendChild(el);
  }

  document.documentElement.setAttribute("data-theme", getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js");
    applyTheme(getPreferredTheme());
    bindThemeToggle();
    injectJsonLd();
  });
})();
