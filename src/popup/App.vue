<script setup lang="ts">
import { ref, onMounted } from "vue";
import { saveVideoPreferences, getVideoPreferences } from "../services/storage";
import { getActiveTab, getLanguages, applyCaptions } from "../services/youtube";
import Settings from "./components/Settings.vue";
import {
  defaultCaptionSettings,
  CaptionSettings,
} from "../types/caption-settings";
import { YTAvailableCaptionSpec } from "../types/youtube";
import { GetLanguagesResponse } from "../types/messages";
const languages = ref<YTAvailableCaptionSpec[]>([]);
const SETTINGS_KEY = "captionSettings";

const settings = ref<CaptionSettings>({
  ...defaultCaptionSettings,
});
const firstLang = ref("");
const secondLang = ref("");

const loading = ref(true);
const error = ref("");
const applying = ref(false);

let activeTabId: number | null = null;
let videoId: null | string = "";

onMounted(async () => {
  const result = await browser.storage.local.get(SETTINGS_KEY);

  settings.value = {
    ...defaultCaptionSettings,
    ...result[SETTINGS_KEY],
  };
  try {
    const tab = await getActiveTab();
    videoId = new URL(tab.url!).searchParams.get("v");

    if (!tab?.id) {
      throw new Error("No active tab found.");
    }

    activeTabId = tab.id;
    if (!tab.url?.includes("youtube.com")) {
      error.value = "Only available for Youtube";
      return;
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
  <n-card>
    <template #header>
      <div class="card-header">TwoSubs</div>
    </template>
    <n-tabs
      type="line"
      default-value="Languages"
      justify-content="space-evenly"
    >
      <n-tab-pane tab="Languages" name="Languages">
        <div v-if="loading">Loading languages...</div>

        <div v-else-if="error">
          {{ error }}
        </div>

        <template v-else>
          <label>First language</label>

          <select v-model="firstLang">
            <option
              v-for="lang in languages"
              :key="lang.languageCode"
              :value="lang.languageCode"
            >
              {{ lang.languageName }}
            </option>
          </select>

          <label>Second language</label>

          <select v-model="secondLang">
            <option
              v-for="lang in languages"
              :key="lang.languageCode"
              :value="lang.languageCode"
            >
              {{ lang.languageName }}
            </option>
          </select>
          <!-- TODO: add kind of on going sign when button is clicked or like it is disabled or enabled... -->
          <button @click="handleApply" :disabled="applying">
            {{ applying ? "Applying..." : "Apply" }}
          </button>
        </template>
      </n-tab-pane>
      <n-tab-pane tab="Settings" name="Settings">
        <Settings />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<style lang="css" scoped>
.card-header {
  font-weight: bold;
  text-align: center;
}
</style>
