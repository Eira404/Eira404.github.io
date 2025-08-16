<script setup lang="ts">
import Structure from '@/components/Structure/home.vue'
import welcome from '@/components/HomeItems/welcome.vue'
import articles from '@/components/HomeItems/articles.vue'
import about from '@/components/HomeItems/about.vue'
import projects from '@/components/HomeItems/projects.vue'
</script>

<template>
  <Structure>
    <template #main>
      <div class="flex flex-col gap-4 w-full p-20">
        <welcome />
        <about />
        <articles />
        <projects />
      </div>
    </template>
  </Structure>
</template>
