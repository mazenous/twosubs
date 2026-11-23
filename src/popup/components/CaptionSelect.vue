<script setup lang="ts">
import UploadSubtitle from "./UploadSubtitle.vue";
import { YTAvailableCaptionSpec } from "../../types/youtube";

const lang = defineModel<string>("lang", { required: true });

defineProps<{
  title: string;
  languages: YTAvailableCaptionSpec[];
}>();
</script>

<template>
  <label>{{ title }}</label>
  <n-flex justify="space-between">
    <div style="flex: 0.75%">
      <n-select
        v-model:value="lang"
        :options="
          languages.map((lang) => ({
            label: lang.languageName,
            value: lang.languageCode,
          }))
        "
      />
    </div>
    <div><UploadSubtitle /></div>
  </n-flex>
</template>
