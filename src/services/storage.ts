import browser from "webextension-polyfill";

export interface VideoPreferences {
  firstLang: string;
  secondLang: string;
}

export async function getVideoPreferences(
  videoId: string,
): Promise<VideoPreferences | null> {
  const result = await browser.storage.local.get("videoPreferences");
  const allPreferences = (result.videoPreferences ?? {}) as Record<
    string,
    VideoPreferences
  >;

  return allPreferences[videoId] ?? null;
}

export async function saveVideoPreferences(
  videoId: string,
  preferences: VideoPreferences,
): Promise<void> {
  const result = await browser.storage.local.get("videoPreferences");

  const allPreferences = (result.videoPreferences ?? {}) as Record<
    string,
    VideoPreferences
  >;

  allPreferences[videoId] = preferences;

  await browser.storage.local.set({
    videoPreferences: allPreferences,
  });
}

export async function removeVideoPreferences(videoId: string): Promise<void> {
  const result = await browser.storage.local.get("videoPreferences");

  const allPreferences = (result.videoPreferences ?? {}) as Record<
    string,
    VideoPreferences
  >;

  delete allPreferences[videoId];

  await browser.storage.local.set({
    videoPreferences: allPreferences,
  });
}
