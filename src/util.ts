import { fetchTranscript } from "youtube-transcript";
import { YTAvailableCaptionSpec } from "./types/youtube";
import { getVideoPreferences } from "./services/storage";
import { getVideoId } from "./services/youtube";
import { CaptionSettings } from "./types/caption-settings";
import { getCaptionSettings } from "./services/caption-settings";

export function initDualCaptions(video, moviePlayer, track1, track2, settings) {
  const subContainer = document.createElement("div");
  subContainer.id = "fx-extension-subtitles";

  Object.assign(subContainer.style, {
    position: "absolute",
    bottom: `${settings.position}%`,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    pointerEvents: "none",
    textAlign: "center",
    width: "80%",
    fontFamily: '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "center",
  });

  function createSubtitleLine(fontSize, textColor) {
    const line = document.createElement("span");

    Object.assign(line.style, {
      backgroundColor: hexToRgba(
        settings.backgroundColor,
        settings.backgroundOpacity / 100,
      ),
      color: textColor,
      fontSize: `${fontSize}px`,
      fontWeight: settings.fontWeight,
      padding: "2px 8px",
      borderRadius: "4px",
      whiteSpace: "pre-wrap",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
      display: "none",
    });

    return line;
  }

  const line1 = createSubtitleLine(settings.fontSize1, settings.textColor1);

  const line2 = createSubtitleLine(settings.fontSize2, settings.textColor2);

  subContainer.appendChild(line1);
  subContainer.appendChild(line2);

  moviePlayer.appendChild(subContainer);

  video.addEventListener("timeupdate", () => {
    const currentTimeMs = video.currentTime * 1000;

    const activeCap1 = track1.find(
      (cap) =>
        currentTimeMs >= cap.offset &&
        currentTimeMs <= cap.offset + cap.duration,
    );

    if (activeCap1) {
      line1.textContent = activeCap1.text;
      line1.style.display = "inline-block";
    } else {
      line1.style.display = "none";
    }

    const activeCap2 = track2.find(
      (cap) =>
        currentTimeMs >= cap.offset &&
        currentTimeMs <= cap.offset + cap.duration,
    );

    if (activeCap2) {
      line2.textContent = activeCap2.text;
      line2.style.display = "inline-block";
    } else {
      line2.style.display = "none";
    }
  });

  return subContainer;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function handleVideoLoad(lang1: string, lang2: string, settings) {
  console.log("handleVideoLoad");
  const videoId = getVideoId();
  if (!videoId) return;

  try {
    // 1. Fetch the array of transcripts using your existing code
    const t1 = await fetchTranscript(videoId, { lang: lang1 });
    const t2 = await fetchTranscript(videoId, { lang: lang2 });

    // 2. Locate the YouTube player elements
    const video = document.querySelector("video");
    const moviePlayer = document.querySelector("#movie_player");

    if (video && moviePlayer) {
      // Remove any previously injected extension caption boxes (crucial for dynamic navigation)
      const existingContainer = document.getElementById(
        "fx-extension-subtitles",
      );
      if (existingContainer) existingContainer.remove();

      // 3. Inject the UI overlay and pass the freshly fetched 't1' transcript array
      initDualCaptions(video, moviePlayer, t1, t2, settings);
    }
  } catch (error) {
    console.error("Failed to fetch or apply captions:", error);
  }
}

function disableCaptions() {
  console.log("disable captions");
  document.getElementById("fx-extension-subtitles")?.remove();
}

export function updateCaptionStyles(
  container: HTMLElement,
  settings: CaptionSettings,
) {
  const lines = container.querySelectorAll("span");

  const [line1, line2] = lines;

  Object.assign(container.style, {
    bottom: `${settings.position}%`,
  });

  if (line1) {
    Object.assign(line1.style, {
      fontSize: `${settings.fontSize1}px`,
      color: settings.textColor1,
      backgroundColor: hexToRgba(
        settings.backgroundColor,
        settings.backgroundOpacity / 100,
      ),
      fontWeight: settings.fontWeight,
    });
  }

  if (line2) {
    Object.assign(line2.style, {
      fontSize: `${settings.fontSize2}px`,
      color: settings.textColor2,
      backgroundColor: hexToRgba(
        settings.backgroundColor,
        settings.backgroundOpacity / 100,
      ),
      fontWeight: settings.fontWeight,
    });
  }
}

export async function enableAvailablePreferences(videoId: string) {
  const preferences = await getVideoPreferences(videoId);
  if (preferences) {
    const settings = await getCaptionSettings();
    handleVideoLoad(preferences.firstLang, preferences.secondLang, settings);
  }
}

export async function handleVideoChange() {
  console.log("video id is changing");
  const newVideoId = getVideoId();
  // Disable captions from the previous video
  disableCaptions();
  if (!newVideoId) return;
  //Enable captions for new video if preference available in storage
  await enableAvailablePreferences(newVideoId);
}
