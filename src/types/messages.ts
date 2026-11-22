import type { YTAvailableCaptionSpec } from "./youtube";

export type ExtensionMessage =
  | {
      action: "get_languages";
    }
  | {
      action: "apply_captions";
      firstLang: string;
      secondLang: string;
    };

export interface GetLanguagesResponse {
  success: boolean;
  languages?: YTAvailableCaptionSpec[];
  error?: string;
  selectedLanguages?: {
    firstLang: string;
    secondLang: string;
  };
}
