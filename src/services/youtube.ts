import browser from "webextension-polyfill";
import { YTAvailableCaptionSpec } from "../types/youtube";
import { ExtensionMessage } from "./../types/messages";

export async function getActiveTab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0];
}

export async function getLanguages(tabId: number) {
  return browser.tabs.sendMessage<ExtensionMessage>(tabId, {
    action: "get_languages",
  });
}

export async function applyCaptions(
  tabId: number,
  firstLang: string,
  secondLang: string,
) {
  return browser.tabs.sendMessage<ExtensionMessage>(tabId, {
    action: "apply_captions",
    firstLang,
    secondLang,
  });
}

export function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

export async function fetchAvailableLanguages(
  VID: string,
): Promise<YTAvailableCaptionSpec[] | undefined> {
  const resp = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "com.google.android.youtube/20.10.38 (Linux; U; Android 14)",
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "20.10.38",
        },
      },
      videoId: VID,
    }),
  });

  if (!resp.ok) return undefined;

  const data = await resp.json();
  const captionTracks =
    data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!captionTracks) return undefined;
  const captionData = captionTracks.map((c: any) => ({
    languageName: c.name.runs[0].text,
    languageCode: c.languageCode,
    baseUrl: c.baseUrl,
  }));
  return captionData;
}
