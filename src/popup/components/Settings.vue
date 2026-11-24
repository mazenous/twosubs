<script setup lang="ts">
import { ref, onMounted } from "vue";
import browser from "webextension-polyfill";
import {
  CaptionSettings,
  defaultCaptionSettings,
} from "../../types/caption-settings";

const SETTINGS_KEY = "captionSettings";

const settings = ref<CaptionSettings>({
  ...defaultCaptionSettings,
});

onMounted(async () => {
  const result = await browser.storage.local.get(SETTINGS_KEY);

  settings.value = {
    ...defaultCaptionSettings,
    ...(result[SETTINGS_KEY] as Partial<CaptionSettings> | undefined),
  };
});

async function saveSettings() {
  const plainSettings: CaptionSettings = {
    fontSize1: Number(settings.value.fontSize1),
    fontSize2: Number(settings.value.fontSize2),
    textColor1: settings.value.textColor1,
    textColor2: settings.value.textColor2,
    backgroundColor: settings.value.backgroundColor,
    backgroundOpacity: Number(settings.value.backgroundOpacity),
    fontWeight: settings.value.fontWeight,
    position: Number(settings.value.position),
  };

  await browser.storage.local.set({
    [SETTINGS_KEY]: plainSettings,
  });
}

async function resetSettings() {
  settings.value = { ...defaultCaptionSettings };
  await saveSettings();
}
</script>

<template>
  <!-- Original Caption -->
  <div>
    <n-text strong>Original Caption</n-text>
    <div class="setting">
      <n-text depth="3">Font Size</n-text>

      <div class="control">
        <n-slider
          v-model:value="settings.fontSize1"
          :min="12"
          :max="50"
          @update:value="saveSettings"
        />
        <span class="value">{{ settings.fontSize1 }}px</span>
      </div>
    </div>

    <div class="setting">
      <n-text depth="3">Text Color</n-text>

      <n-color-picker
        v-model:value="settings.textColor1"
        :show-alpha="false"
        @update:value="saveSettings"
      />
    </div>
  </div>
  <n-divider />
  <!-- Translated Caption -->
  <div>
    <n-text strong>Translated Caption</n-text>

    <div class="setting">
      <n-text depth="3">Font Size</n-text>

      <div class="control">
        <n-slider
          v-model:value="settings.fontSize2"
          :min="12"
          :max="50"
          @update:value="saveSettings"
        />
        <span class="value">{{ settings.fontSize2 }}px</span>
      </div>
    </div>

    <div class="setting">
      <n-text depth="3">Text Color</n-text>

      <n-color-picker
        v-model:value="settings.textColor2"
        :show-alpha="false"
        @update:value="saveSettings"
      />
    </div>
  </div>

  <n-divider />

  <!-- General Settings -->
  <div>
    <n-text strong>General</n-text>

    <div class="setting">
      <n-text depth="3">Background Color</n-text>

      <n-color-picker
        v-model:value="settings.backgroundColor"
        :show-alpha="false"
        @update:value="saveSettings"
      />
    </div>

    <div class="setting">
      <n-text depth="3">Background Opacity</n-text>

      <div class="control">
        <n-slider
          v-model:value="settings.backgroundOpacity"
          :min="0"
          :max="100"
          @update:value="saveSettings"
        />
        <span class="value">{{ settings.backgroundOpacity }}%</span>
      </div>
    </div>

    <div class="setting">
      <n-text depth="3">Font Weight</n-text>

      <n-select
        v-model:value="settings.fontWeight"
        :options="[
          { label: 'Normal', value: 'normal' },
          { label: 'Bold', value: 'bold' },
        ]"
        @update:value="saveSettings"
      />
    </div>

    <div class="setting">
      <n-text depth="3">Position</n-text>

      <div class="control">
        <n-slider
          v-model:value="settings.position"
          :min="5"
          :max="40"
          @update:value="saveSettings"
        />
        <span class="value">{{ settings.position }}%</span>
      </div>
    </div>
    <n-button
      class="reset-button"
      block
      secondary
      type="error"
      @click="resetSettings"
    >
      Reset to defaults
    </n-button>
  </div>
</template>

<style scoped>
.setting {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.control {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.value {
  min-width: 38px;
  text-align: right;
  font-size: 12px;
  color: #888;
}

.setting :deep(.n-color-picker) {
  width: 120px;
}

.setting :deep(.n-select) {
  width: 140px;
}

.reset-button {
  margin-top: 16px;
}
</style>
