<script setup lang="ts">
import articleHeader from './articleHeader.vue'
import articleFooter from './articleFooter.vue'
import { useElfland } from '@/core/elfland'
const elfland = useElfland()
const articleIns = elfland.article

const md = articleIns.renderedMd
</script>

<template>
  <div class="relative">
    <articleHeader />
    <div class="markdown-body">
      <article v-html="md" />
    </div>
    <articleFooter />
  </div>
</template>
