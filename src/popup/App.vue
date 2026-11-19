<script setup>
import { ref, onMounted } from "vue";

import { getActiveTab, getLanguages, applyCaptions } from "./services/youtube";

const languages = ref([]);

const firstLang = ref("");
const secondLang = ref("");

const loading = ref(true);
const error = ref("");
const applying = ref(false);

let activeTabId = null;

onMounted(async () => {
  try {
    const tab = await getActiveTab();

    if (!tab?.id) {
      throw new Error("No active tab found.");
    }

    activeTabId = tab.id;

    const response = await getLanguages(activeTabId);
    console.log("response of getting current available languages", response);
    if (!response.languages) {
      error.value = response?.error || "Failed to load languages.";
      throw new Error(response?.error || "Failed to load languages.");
    }

    if (response.languages.length === 1)
      error.value = "Only one language available, use Youtube captions";

    languages.value = response.languages;

    if (response.selectedLanguages) {
      firstLang.value = response.selectedLanguages.firstLang;

      secondLang.value = response.selectedLanguages.secondLang;
    }
  } catch (err) {
    console.log(response);
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
  } catch (err) {
    error.value = "Failed to apply caption languages.";
  } finally {
    applying.value = false;
  }
}
</script>

<template>
  <div class="popup">
    <h2>YouTube Captions</h2>

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

      <button @click="handleApply" :disabled="applying">
        {{ applying ? "Applying..." : "Apply" }}
      </button>
    </template>
  </div>
</template>
