<script setup lang="ts">
import LangIcon from './langIcon.vue'
import { useElfland } from '@/core/elfland'

const elfland = useElfland()
const lang = elfland.i18n.getLang()

function change() {
  elfland.i18n.toggleLang()
}
</script>

<template>
  <div
    class="cursor-pointer"
    @click="change"
  >
    <LangIcon
      class="transition-all"
      :class="{ 'platform-header-lang-icon--en-us': lang === 'en-US'}"
    />
  </div>
</template>

<style>
.platform-header-lang-icon--en-us {
  transform: scaleX(-1);
}
</style>
