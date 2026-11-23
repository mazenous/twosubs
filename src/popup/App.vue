<script setup lang="ts">
import Settings from "./components/Settings.vue";
import LanguagesTab from "./components/LanguagesTab.vue";
import type { GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#2080f0",
    primaryColorHover: "#4098fc",
    primaryColorPressed: "#1060c9",
    primaryColorSuppl: "#4098fc",
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-card>
        <template #header>
          <div class="card-header">TwoSubs</div>
        </template>
        <n-tabs
          type="line"
          default-value="Languages"
          justify-content="space-evenly"
        >
          <n-tab-pane tab="Languages" name="Languages"
            ><LanguagesTab
          /></n-tab-pane>
          <n-tab-pane tab="Settings" name="Settings">
            <Settings />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-message-provider>
  </n-config-provider>
</template>
<style lang="css" scoped>
.card-header {
  font-weight: bold;
  text-align: center;
}
</style>
