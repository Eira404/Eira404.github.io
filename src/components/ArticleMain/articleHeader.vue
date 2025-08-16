<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { formatDate } from '@/core/elfland/utils'
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { DocumentAdd, Document, User } from '@element-plus/icons-vue'

const elfland = useElfland()
const articleIns = elfland.article
const article = articleIns.article
if (article.value === null) throw new Error('article is null')
const title = computed(() => article.value!.title)
const author = computed(() => article.value!.author)
const created = computed(() => new Date(article.value!.created))
const modified = computed(() => new Date(article.value!.modified))
</script>

<template>
  <div class="flex flex-col p-12 gap-4 cursor-default pb-0">
    <div class="text-3xl text-center font-bold font-[kaiti,serif]">
      <span>{{ title }}</span>
    </div>
    <div
      class="text-lg flex gap-2 items-center justify-center font-bold font-[kaiti,serif]"
      title="作者"
    >
      <el-icon><User /></el-icon>
      <span>{{ author }}</span>
    </div>
    <div class="flex gap-4 items-center justify-center">
      <div
        class="flex gap-1 items-center"
        title="创建时间"
      >
        <el-icon><DocumentAdd /></el-icon>
        <span>{{ formatDate(created) }}</span>
      </div>
      <div
        class="flex gap-1 items-center"
        title="修改时间"
      >
        <el-icon><Document /></el-icon>
        <span>{{ formatDate(modified) }}</span>
      </div>
    </div>
  </div>
</template>
