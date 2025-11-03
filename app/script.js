document.addEventListener("DOMContentLoaded", () => {
  const supportedLangs = ["en", "de", "es", "fr", "ja", "pt"];
  let lang = getLanguage(supportedLangs);

  loadTranslations(lang);

  const planButtons = document.querySelectorAll(".plan-button");
  planButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      planButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });
  });
});

function getLanguage(supportedLangs) {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");

  if (langParam && supportedLangs.includes(langParam)) {
    return langParam;
  }

  const browserLang = navigator.language.split("-")[0];
  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }

  return "en";
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`../assets/langs/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Translation file not found for lang: ${lang}`);
    }
    const translations = await response.json();

    document.querySelectorAll("[data-key]").forEach((element) => {
      const key = element.getAttribute("data-key");
      if (translations[key]) {
        element.innerHTML = translations[key];
      }
    });

    adjustFontSizes(lang);
  } catch (error) {
    console.error(`Could not load translations for "${lang}":`, error);
    if (lang !== "en") {
      console.log("Falling back to English.");
      loadTranslations("en");
    }
  }
}

function adjustFontSizes(lang) {
  const longTextLangs = ["de", "pt", "es", "fr"];

  if (longTextLangs.includes(lang)) {
    document.querySelectorAll(".plan-title, .continue-btn").forEach((el) => {
      if (el.textContent.length > 15) {
        el.style.fontSize = "14px";
      }
    });
  }
}
