import browser from "webextension-polyfill";
import {
  CaptionSettings,
  defaultCaptionSettings,
} from "../types/caption-settings";

const SETTINGS_KEY = "captionSettings";

export async function getCaptionSettings(): Promise<CaptionSettings> {
  const result = await browser.storage.local.get(SETTINGS_KEY);

  return {
    ...defaultCaptionSettings,
    ...(result[SETTINGS_KEY] as Partial<CaptionSettings> | undefined),
  };
}

export async function saveCaptionSettings(
  settings: CaptionSettings,
): Promise<void> {
  await browser.storage.local.set({
    [SETTINGS_KEY]: settings,
  });
}
