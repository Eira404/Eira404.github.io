<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import MyBase from './default.vue'
import { computed } from 'vue'
import ArticlesList from '@/components/ArticlesList/index.vue'

const elfland = useElfland()
const articlesIns = elfland.articles
const articles = computed(() => articlesIns.articles.value.slice(0, 10))
</script>

<template>
  <MyBase
    title="Posts"
    :more="true"
    name="archives"
    prompt="More posts"
  >
    <template #main>
      <ArticlesList :articles="articles" />
    </template>
  </MyBase>
</template>
