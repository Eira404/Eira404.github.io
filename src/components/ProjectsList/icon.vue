<script setup lang="ts">
import type { PropType } from 'vue'
import { ElIcon } from 'element-plus'
import github from './github.vue'
import web from './web.vue'
import { VideoPlay, MagicStick, Notebook, Memo } from '@element-plus/icons-vue'
import { type RouteLocationRaw } from 'vue-router'

const props = defineProps({
  type: {
    type: String as PropType<'url' | 'github' | 'video' | 'arxiv' | 'docs' | 'blog-docs' | 'blog'>,
    required: true
  },
  path: {
    type: String,
    default: ''
  },
  to: {
    type: Object as PropType<RouteLocationRaw>,
    default: () => ({ name: 'home' })
  },
  inBlog: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <a
    v-if="!inBlog"
    :href="path"
    target="_blank"
    class="flex hover:bg-black/3 dark:hover:bg-white/5 border border-black/20 dark:border-white/20 rounded-full w-[40px] h-[40px] justify-center items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
  >
    <el-icon :size="24">
      <github v-if="type === 'github'" />
      <web v-else-if="type === 'url'" />
      <VideoPlay v-else-if="type === 'video'" />
      <MagicStick v-else-if="type === 'arxiv'" />
      <Notebook v-else-if="type === 'docs'" />
      <Notebook v-else-if="type === 'blog-docs'" />
      <Memo v-else-if="type === 'blog'" />
    </el-icon>
  </a>
  <router-link
    v-else
    :to="to"
    class="flex hover:bg-black/3 dark:hover:bg-white/5 border border-black/20 dark:border-white/20 rounded-full w-[40px] h-[40px] justify-center items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
  >
    <el-icon :size="24">
      <github v-if="type === 'github'" />
      <web v-else-if="type === 'url'" />
      <VideoPlay v-else-if="type === 'video'" />
      <MagicStick v-else-if="type === 'arxiv'" />
      <Notebook v-else-if="type === 'docs'" />
      <Notebook v-else-if="type === 'blog-docs'" />
      <Memo v-else-if="type === 'blog'" />
    </el-icon>
  </router-link>
</template>
