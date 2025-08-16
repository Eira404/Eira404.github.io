<script setup lang="ts">
import type { Project } from '@/core/elfland-addon-projects/core/projects-database'
import type { PropType } from 'vue'
import item from './item.vue'

const props = defineProps({
  projects: {
    type: Array as PropType<Project[]>,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <item
      v-for="p in projects"
      :key="p.name"
      :project="p"
    />
  </div>
</template>
