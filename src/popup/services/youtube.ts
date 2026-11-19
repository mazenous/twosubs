import browser from "webextension-polyfill";
import { YTAvailableLanguageSpec } from "../../util";

export async function getActiveTab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0];
}

export async function getLanguages(tabId: number) {
  return browser.tabs.sendMessage(tabId, {
    action: "get_languages",
  });
}

export async function applyCaptions(
  tabId: number,
  firstLang: string,
  secondLang: string,
) {
  return browser.tabs.sendMessage(tabId, {
    action: "apply_captions",
    firstLang,
    secondLang,
  });
}
