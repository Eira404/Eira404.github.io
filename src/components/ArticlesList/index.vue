<script setup lang="ts">
import type { Article } from '@/core/elfland-addon-articles/core/article'
import type { PropType } from 'vue'
import item from './item.vue'

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 px-10 w-full">
    <item
      v-for="a in articles"
      :key="a.id"
      :article="a"
    />
  </div>
</template>
