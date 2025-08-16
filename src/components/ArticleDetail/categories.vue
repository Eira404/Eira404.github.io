<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import type { Category } from '@/core/elfland-addon-articles/core/article'
import { Collection, PriceTag } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed } from 'vue'

const elfland = useElfland()
const articleIns = elfland.article

const article = articleIns.article
if (article.value === null) throw new Error('article is null')
const categories = computed(() => article.value!.categories)
type UseCategory = {
  category: string
  path: string
}
const categoriesList = computed<UseCategory[]>(() => {
  const res: UseCategory[] = []
  let path: string = ''
  const dfs = (category: Category) => {
    path += category.category + '/'
    res.push({
      category: category.category,
      path
    })
    if (category.child) dfs(category.child)
  }
  dfs(categories.value)
  res[res.length - 1].path = res[res.length - 1].path.slice(0, -1)
  return res
})
</script>

<template>
  <div>
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <span>当前笔记的分类</span>
        <span class="text-gray-600 dark:text-gray-400">{{ categoriesList.length }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="c, i in categoriesList"
        :key="i"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150"
      >
        <router-link
          :to="{ name: 'categories', query: { category: c.path } }"
          class="w-full flex items-center gap-2"
        >
          <el-icon><Collection /></el-icon>
          {{ c.category }}
        </router-link>
      </div>
    </div>
  </div>
</template>
