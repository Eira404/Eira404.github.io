<script setup lang="ts">
import type { PropType } from 'vue'
import { ElIcon } from 'element-plus'
import github from './github.vue'
import web from './web.vue'
import { VideoPlay, MagicStick } from '@element-plus/icons-vue'

const props = defineProps({
  type: {
    type: String as PropType<'url' | 'github' | 'video' | 'arxiv'>,
    required: true
  },
  path: {
    type: String,
    required: true
  }
})
</script>

<template>
  <a
    :href="path"
    target="_blank"
    class="flex hover:bg-black/3 dark:hover:bg-white/5 border border-black/20 dark:border-white/20 rounded-full w-[40px] h-[40px] justify-center items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
  >
    <el-icon :size="24">
      <github v-if="type === 'github'" />
      <web v-else-if="type === 'url'" />
      <VideoPlay v-else-if="type === 'video'" />
      <MagicStick v-else-if="type === 'arxiv'" />
    </el-icon>
  </a>
</template>
