<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navList = [
  ['About', '/', 'home'],
  ['Projects', '/archives', 'archives'],
  ['Blog', '/archives', 'archives'],
  ['Links', '/categories', 'categories']
]
</script>

<template>
  <div class="h-full flex gap-6 items-center">
    <router-link
      v-for="nav, i in navList"
      :key="i"
      :to="nav[1]"
      class="hover:text-moonlight-500 transition-all h-full flex items-center box-border border-b-2 border-transparent"
    >
      {{ nav[0] }}
    </router-link>
  </div>
</template>
