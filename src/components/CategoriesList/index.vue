<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import item from './item.vue'

const elfland = useElfland()
const categoriesIns = elfland.categories
const categories = categoriesIns.categories
</script>

<template>
  <div class="p-12">
    <item
      v-for="c in categories"
      :key="c.category"
      :category="c"
    />
  </div>
</template>
