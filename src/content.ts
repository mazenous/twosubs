import {
  fetchAvailableLanguages,
  handleVideoLoad,
  handleVideoChange,
  enableAvailablePreferences,
} from "./util";
import { ExtensionMessage } from "./types/messages";
import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener((msg: unknown) => {
  const message = msg as ExtensionMessage;
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
  if (message.action === "apply_captions") {
    console.log("Selected captions:", message.firstLang, message.secondLang);
    handleVideoLoad(message.firstLang, message.secondLang);
  }
});

document.addEventListener("yt-navigate-finish", handleVideoChange);
document.addEventListener("DOMContentLoaded", () => {
  const videoId = new URLSearchParams(window.location.search).get("v");

  if (videoId) {
    enableAvailablePreferences(videoId);
  }
});
window.addEventListener("popstate", handleVideoChange);
