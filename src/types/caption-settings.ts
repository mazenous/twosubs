export interface CaptionSettings {
  fontSize1: number;
  fontSize2: number;
  textColor1: string;
  textColor2: string;
  backgroundColor: string;
  backgroundOpacity: number;
  fontWeight: "normal" | "bold";
  position: number;
}

export const defaultCaptionSettings: CaptionSettings = {
  fontSize1: 34,
  fontSize2: 30,
  textColor1: "#ffea00",
  textColor2: "#ffffff",
  backgroundColor: "#080808",
  backgroundOpacity: 75,
  fontWeight: "bold",
  position: 12,
};
