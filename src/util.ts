export async function fetchAvailableLanguages(VID: string) {
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

  const captionData = captionTracks.map((c: any) => ({
    languageName: c.name.runs[0].text,
    languageCode: c.languageCode,
    baseUrl: c.baseUrl,
  }));
  return captionData;
}
