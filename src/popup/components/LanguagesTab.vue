<script setup lang="ts">
import { ref, onMounted } from "vue";
import browser from "webextension-polyfill";
import {
  saveVideoPreferences,
  getVideoPreferences,
} from "../../services/storage";
import {
  getActiveTab,
  getLanguages,
  applyCaptions,
} from "../../services/youtube";

import { YTAvailableCaptionSpec } from "../../types/youtube";
import { ExtensionMessage, GetLanguagesResponse } from "../../types/messages";
import CaptionSelect from "./CaptionSelect.vue";
import {
  downloadCaptionsZip,
  CaptionTrack,
} from "../../services/download-captions";

const languages = ref<YTAvailableCaptionSpec[]>([]);

const firstLang = ref("");
const secondLang = ref("");
const downloading = ref(false);
const loading = ref(true);
const error = ref("");
const applying = ref(false);

const firstUploadedFile = ref<File | null>(null);
const secondUploadedFile = ref<File | null>(null);

async function handleFirstUpload(payload: { text: string }) {
  await sendUploadedSubtitle(payload.text, "first");
}

async function handleSecondUpload(payload: { text: string }) {
  await sendUploadedSubtitle(payload.text, "second");
}

async function sendUploadedSubtitle(
  subtitleText: string,
  captionOrder: "first" | "second",
) {
  if (!activeTabId) {
    error.value = "No active tab.";
    return;
  }

  await browser.tabs.sendMessage<ExtensionMessage>(activeTabId, {
    action: "apply_uploaded_subtitle",
    subtitleText,
    captionOrder,
  });
}
let activeTabId: number | null = null;
let videoId: null | string = "";

onMounted(async () => {
  try {
    const tab = await getActiveTab();
    videoId = new URL(tab.url!).searchParams.get("v");

    if (!tab?.id) {
      throw new Error("No active tab found.");
    }

    activeTabId = tab.id;
    if (!tab.url?.includes("youtube.com")) {
      // error.value = "Only available for Youtube";
      // return;
    }
    const response = (await getLanguages(activeTabId)) as GetLanguagesResponse;
    if (!response.languages) {
      error.value = response?.error || "No languages available";
      return;
      // throw new Error(response?.error || "Failed to load languages.");
    }
    if (response.languages.length <= 1)
      error.value = "Only one language available, use Youtube captions";
    languages.value = response.languages;
    const preferences = await getVideoPreferences(videoId!);

    if (preferences) {
      firstLang.value = preferences.firstLang;
      secondLang.value = preferences.secondLang;
    }
  } catch (err) {
    console.log(err);
    error.value = "Make sure you are on an active YouTube video page.";
  } finally {
    loading.value = false;
  }
});

async function downloadCaptions() {
  console.log("downloadCpations");
  downloading.value = true;
  const captions = (await browser.tabs.sendMessage<ExtensionMessage>(
    activeTabId!,
    {
      action: "download_captions",
    },
  )) as CaptionTrack[];
  await downloadCaptionsZip(captions);
  downloading.value = false;
}

async function handleApply() {
  if (!activeTabId) return;

  applying.value = true;
  error.value = "";

  try {
    await applyCaptions(activeTabId, firstLang.value, secondLang.value);
    await saveVideoPreferences(videoId!, {
      firstLang: firstLang.value,
      secondLang: secondLang.value,
    });
  } catch (err) {
    console.log(err);
    error.value = "Failed to apply caption languages.";
  } finally {
    applying.value = false;
  }
}
</script>
<template>
  <div v-if="loading">Loading languages...</div>
  <div v-else-if="error">
    {{ error }}
  </div>

  <template v-else>
    <CaptionSelect
      title="First language"
      v-model:lang="firstLang"
      :languages="languages"
      @uploaded="handleFirstUpload"
    />
    <CaptionSelect
      title="Second language"
      v-model:lang="secondLang"
      :languages="languages"
      @uploaded="handleSecondUpload"
    />
    <!-- TODO: add kind of on going sign when button is clicked or like it is disabled or enabled... -->
    <n-flix>
      <n-button
        type="primary"
        class="button"
        @click="handleApply"
        :disabled="applying"
      >
        {{ applying ? "Applying..." : "Apply" }}
      </n-button>
      <n-button
        type="primary"
        class="button"
        :loading="downloading"
        :disabled="
          videoId === null || activeTabId === null || languages.length === 0
        "
        @click="downloadCaptions"
      >
        Download Captions
      </n-button>
    </n-flix>
  </template>
</template>
<style>
.button {
  margin-top: 13px;
}
.button {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
button:hover {
  background: #1d4ed8;
}
</style>
