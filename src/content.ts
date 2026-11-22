import {
  handleVideoLoad,
  handleVideoChange,
  enableAvailablePreferences,
  updateCaptionStyles,
  initDualCaptions,
} from "./util";
import { getCaptionSettings } from "./services/caption-settings";
import { ExtensionMessage } from "./types/messages";
import browser from "webextension-polyfill";
import { fetchAvailableLanguages } from "./services/youtube";
console.log("🔥 CONTENT SCRIPT LOADED");
browser.runtime.onMessage.addListener(async (msg: unknown) => {
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
    const settings = await getCaptionSettings();
    handleVideoLoad(message.firstLang, message.secondLang, settings);
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

browser.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local" || !changes.captionSettings) return;
  const settings = await getCaptionSettings();
  updateCaptionStyles(
    document.getElementById("fx-extension-subtitles")!,
    settings,
  );
});
