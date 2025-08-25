<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navList = [
  ['Eira404', '/', 'home']
  // ['归档', '/archives', 'archives'],
  // ['标签', '/tags', 'tags'],
  // ['分类', '/categories', 'categories'],
  // ['关系图', '/diagram', 'diagram']
  // ['关于', '/about', 'about']
]
</script>

<template>
  <div class="h-full flex gap-4 items-center">
    <router-link
      v-for="nav, i in navList"
      :key="i"
      :to="nav[1]"
      class="hover:text-elysia-500 text-2xl font-bold transition-all h-full flex items-center box-border border-b-2 border-transparent"
    >
      {{ nav[0] }}
    </router-link>
  </div>
</template>
