// content_scripts/content.ts
import { fetchAvailableLanguages } from "./util";
import { fetchTranscript } from "youtube-transcript";
declare const browser: any;

(async () => {
  try {
    const videoId = new URLSearchParams(window.location.search).get("v");

    if (videoId) {
      const languages = await fetchAvailableLanguages(videoId);

      console.log(languages);
    } else {
      console.log("No video ID found on this tab layout.");
    }
  } catch (error) {
    console.error("Failed to acquire track payloads:", error);
  }
})();

function initDualCaptions(video, moviePlayer, track1, track2) {
  // Main Wrapper Container
  const subContainer = document.createElement("div");
  subContainer.id = "fx-extension-subtitles";

  Object.assign(subContainer.style, {
    position: "absolute",
    bottom: "12%", // Adjust to '88%' if you prefer track 2 at the top of the video screen
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    pointerEvents: "none",
    textAlign: "center",
    width: "80%",
    fontFamily: '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
    display: "flex",
    flexDirection: "column",
    gap: "6px", // Generates clean space between the two subtitle lines
    alignItems: "center",
  });

  // Base styling structure helper for individual lines
  function createSubtitleLine(customColor = "#ffffff") {
    const lineSpan = document.createElement("span");
    Object.assign(lineSpan.style, {
      backgroundColor: "rgba(8, 8, 8, 0.75)",
      color: customColor,
      fontSize: "34px",
      padding: "2px 8px",
      borderRadius: "4px",
      whiteSpace: "pre-wrap",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
      display: "none", // Hidden by default until matched
    });
    return lineSpan;
  }

  // Create line blocks (Tip: Making the second line yellow makes reading dual-subs much easier)
  const line2 = createSubtitleLine("#ffffff"); // Track 1 (White)
  const line1 = createSubtitleLine("#ffea00"); // Track 2 (Yellow)

  subContainer.appendChild(line1);
  subContainer.appendChild(line2);
  moviePlayer.appendChild(subContainer);

  // Monitor continuous playback loop
  video.addEventListener("timeupdate", () => {
    const currentTimeMs = video.currentTime * 1000;

    // --- Sync Track 1 ---
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

    // --- Sync Track 2 ---
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
}

// Function to extract the video ID from the current YouTube URL
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

async function handleVideoLoad() {
  const videoId = getVideoId();
  if (!videoId) return;

  try {
    // 1. Fetch the array of transcripts using your existing code
    const t1 = await fetchTranscript(videoId, { lang: "nl" });
    const t2 = await fetchTranscript(videoId, { lang: "en" });

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
      initDualCaptions(video, moviePlayer, t1, t2);
    }
  } catch (error) {
    console.error("Failed to fetch or apply captions:", error);
  }
}

// Listen for YouTube's dynamic page transitions (Single Page App navigation)
window.addEventListener("yt-navigate-finish", handleVideoLoad);

// Fallback for initial direct page loads
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  handleVideoLoad();
} else {
  window.addEventListener("DOMContentLoaded", handleVideoLoad);
}
