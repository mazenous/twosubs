// content_scripts/content.ts
import { fetchAvailableLanguages, handleVideoLoad } from "./util";

//@ts-ignore
browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  //@ts-ignore
  if (message.action === "get_languages") {
    // Extract videoId from URL if not already provided
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");

    if (!videoId) {
      sendResponse({ success: false, error: "No video found" });
      return true; // Keep channel open
    }

    // Call your existing fetch function
    fetchAvailableLanguages(videoId)
      .then((languages) => {
        sendResponse({ success: true, languages: languages });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message });
      });

    return true; // Crucial: Tells Firefox to wait for the async promise to resolve
  }

  // Handle saving the user's caption choices
  //@ts-ignore
  if (message.action === "apply_captions") {
    //@ts-ignore
    console.log("Selected captions:", message.firstLang, message.secondLang);
    //@ts-ignore
    handleVideoLoad(message.firstLang, message.secondLang);
  }
});
