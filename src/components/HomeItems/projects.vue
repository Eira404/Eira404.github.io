<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import MyBase from './default.vue'
import ProjectsList from '@/components/ProjectsList/index.vue'

const elfland = useElfland()
const projectsIns = elfland.projects
const projects = projectsIns.pinnedProjects
</script>

<template>
  <MyBase
    title="Projects"
    :more="true"
    name="about"
    prompt="More projects"
  >
    <template #main>
      <div class="px-10 pt-1 leading-5 flex flex-col gap-2">
        <ProjectsList :projects="projects" />
      </div>
    </template>
  </MyBase>
</template>
