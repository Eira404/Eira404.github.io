<script setup lang="ts">
import Structure from '@/components/Structure/article.vue'
import ArticleToc from '@/components/ArticleToc/index.vue'
import ArticleMain from '@/components/ArticleMain/index.vue'
import ArticleDetail from '@/components/ArticleDetail/index.vue'
</script>

<template>
  <Structure>
    <template #left>
      <ArticleDetail />
    </template>
    <template #main>
      <ArticleMain />
    </template>
    <template #right>
      <ArticleToc />
    </template>
  </Structure>
</template>
