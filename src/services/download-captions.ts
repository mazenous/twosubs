import JSZip from "jszip";
interface Caption {
  offset: number;
  duration: number;
  text: string;
  lang?: string;
}

export interface CaptionTrack {
  languageCode: string;
  captions: Caption[];
}

export async function downloadCaptionsZip(tracks: CaptionTrack[]) {
  const zip = new JSZip();
  for (const track of tracks) {
    const filename = `${track.languageCode}.json`;

    zip.file(filename, JSON.stringify(track.captions, null, 2));
  }

  const blob = await zip.generateAsync({
    type: "blob",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "youtube-captions.zip";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
