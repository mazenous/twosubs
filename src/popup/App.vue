<script setup>
import { ref, onMounted } from "vue";
import { saveVideoPreferences, getVideoPreferences } from "./services/storage";
import { getActiveTab, getLanguages, applyCaptions } from "./services/youtube";

const languages = ref([]);

const firstLang = ref("");
const secondLang = ref("");

const loading = ref(true);
const error = ref("");
const applying = ref(false);

let activeTabId = null;
let videoId = "";

onMounted(async () => {
  try {
    const tab = await getActiveTab();
    videoId = new URL(tab.url).searchParams.get("v");

    if (!tab?.id) {
      throw new Error("No active tab found.");
    }

    activeTabId = tab.id;
    if (!tab.url.includes("youtube.com")) {
      error.value = "Only available for Youtube";
      return;
    }
    const response = await getLanguages(activeTabId);
    if (!response.languages) {
      error.value = response?.error || "No languages available";
      return;
      // throw new Error(response?.error || "Failed to load languages.");
    }

    if (response.languages.length <= 1)
      error.value = "Only one language available, use Youtube captions";

    languages.value = response.languages;
    const preferences = await getVideoPreferences(videoId);

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
    await saveVideoPreferences(videoId, {
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
  <div class="popup">
    <h2>TwoSubs</h2>

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
  </div>
</template>
