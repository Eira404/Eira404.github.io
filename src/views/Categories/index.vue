<script setup lang="ts">
import CategoriesList from '@/components/CategoriesList/index.vue'
import CategoryArticlesList from '@/components/CategoryArticlesList/index.vue'
import Structure from '@/components/Structure/default.vue'
</script>

<template>
  <Structure>
    <template #main>
      <CategoriesList />
      <CategoryArticlesList />
    </template>
  </Structure>
</template>
