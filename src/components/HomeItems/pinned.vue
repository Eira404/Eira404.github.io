<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import MyBase from './default.vue'

const elfland = useElfland()
const projects = elfland.projects
const pinnedProjects = projects.pinnedProjects
</script>

<template>
  <MyBase
    v-if="pinnedProjects.length"
    title="Projects"
  >
    asc
  </MyBase>
</template>
