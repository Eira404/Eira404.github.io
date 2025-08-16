<script setup lang="ts">
import { Project } from '@/core/elfland-addon-projects/core/projects-database'
import icon from './icon.vue'

const props = defineProps({
  project: {
    type: Project,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col gap-3 p-4 border border-black/20 dark:border-white/20 rounded-xl">
    <div>
      <span
        class="text-xl"
        v-html="project.name"
      />
    </div>
    <div v-if="project.author">
      <span
        class="text-gray-600 dark:text-gray-400 text-sm break-words"
        v-html="project.author"
      />
    </div>
    <div
      v-if="project.role"
      class="text-gray-600 dark:text-gray-400 text-sm flex flex-wrap gap-2"
    >
      <span>角色:</span>
      <span v-html="project.role" />
    </div>
    <div
      v-if="project.contributors"
      class="text-gray-600 dark:text-gray-400 text-sm break-words flex flex-wrap gap-2"
    >
      <span>贡献者:</span>
      <a
        v-for="c in project.contributors"
        :key="c"
        :href="c"
        target="_blank"
        class="hover:underline hover:text-moonlight-500"
      >{{ c }}</a>
    </div>
    <div>
      <p
        class="leading-5 text-sm"
        v-html="project.description"
      />
    </div>
    <div v-if="project.notes">
      <p
        class="leading-5 text-sm text-gray-600 dark:text-gray-400"
        v-html="project.notes"
      />
    </div>
    <div class="flex gap-2 items-center">
      <icon
        v-if="project.github"
        type="github"
        :path="project.github"
      />
      <icon
        v-if="project.url"
        type="url"
        :path="project.url"
      />
      <icon
        v-if="project.video"
        type="video"
        :path="project.video"
      />
      <icon
        v-if="project.arxiv"
        type="arxiv"
        :path="project.arxiv"
      />
    </div>
  </div>
</template>
