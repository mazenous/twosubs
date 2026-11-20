// content_scripts/content.ts
import {
  fetchAvailableLanguages,
  handleVideoLoad,
  handleVideoChange,
} from "./util";
import { ExtensionMessage } from "./types/messages";

//@ts-ignore
browser.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.action === "get_languages") {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");

    if (!videoId) {
      return Promise.resolve({
        success: false,
        error: "No video found",
      });
    }

    return fetchAvailableLanguages(videoId)
      .then((languages) => ({
        success: true,
        languages,
      }))
      .catch((err) => ({
        success: false,
        error: err.message,
      }));
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

document.addEventListener("yt-navigate-finish", handleVideoChange);
window.addEventListener("popstate", handleVideoChange);
