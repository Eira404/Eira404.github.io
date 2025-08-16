<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import ArticlesList from '@/components/ArticlesList/index.vue'
import selector from './selector.vue'

const elfland = useElfland()
const articlesIns = elfland.articles

const sortedArchives = articlesIns.sortedArchives
</script>

<template>
  <div class="p-4 flex gap-4 flex-col items-center w-full">
    <selector />
    <ArticlesList :articles="sortedArchives" />
  </div>
</template>
