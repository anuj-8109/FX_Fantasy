import React, { useEffect } from "react";

const LanguageSelector = () => {
  useEffect(() => {
    // Google Translate init function
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,fr,de,es,gu,ta,te,pa",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div className="flex justify-center items-center mt-4">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default LanguageSelector;
