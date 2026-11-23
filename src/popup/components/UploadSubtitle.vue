<script setup lang="ts">
import { ref } from "vue";

const fileInput = ref<HTMLInputElement | null>(null);

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  console.log("Selected:", file.name);
  // console.log(await file.text());
  //here the work should be done,
  // first set button on loading
  // start parsing the button with some checks, like if it has a matching length
  // and the correct structure otherwise set an error below the button
  // when everything works fine and the text got parsed this should be the caption
  // to render
}
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept=".srt,.json"
    hidden
    @change="handleFileChange"
  />

  <n-button @click="fileInput?.click()"> Upload subtitle </n-button>
</template>
