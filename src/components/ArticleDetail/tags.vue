<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { PriceTag } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed } from 'vue'

const elfland = useElfland()
const articleIns = elfland.article

const article = articleIns.article
if (article.value === null) throw new Error('article is null')
const tags = computed(() => article.value!.tags)
</script>

<template>
  <div>
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <span>当前笔记的标签</span>
        <span class="text-gray-600 dark:text-gray-400">{{ tags.length }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="t, i in tags"
        :key="i"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150"
      >
        <router-link
          :to="{ name: 'tags', query: { tag: t.tag } }"
          class="w-full flex items-center gap-2"
        >
          <el-icon><PriceTag /></el-icon>
          {{ t.tag }}
        </router-link>
      </div>
    </div>
  </div>
</template>
