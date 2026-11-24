<script setup lang="ts">
import UploadSubtitle from "./UploadSubtitle.vue";
import { YTAvailableCaptionSpec } from "../../types/youtube";
import { ref } from "vue";

const emit = defineEmits<{
  uploaded: [payload: { text: string }];
}>();
const lang = defineModel<string>("lang", { required: true });
const parseError = ref("");
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
    <div>
      <UploadSubtitle
        v-model:parse-error="parseError"
        @uploaded="emit('uploaded', $event)"
      />
    </div>
  </n-flex>
  <n-text v-show="parseError !== ''">{{ parseError }}</n-text>
</template>
