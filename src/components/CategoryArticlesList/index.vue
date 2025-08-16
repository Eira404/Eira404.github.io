<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ElIcon } from 'element-plus'
import { Sort } from '@element-plus/icons-vue'
import ArticlesList from '@/components/ArticlesList/index.vue'

const elfland = useElfland()
const categoriesIns = elfland.categories
const sortedArticels = categoriesIns.sortedArticels
const sortIsAsc = categoriesIns.sortIsAsc
</script>

<template>
  <div class="p-12 flex flex-col gap-4 pt-0">
    <div
      v-show="sortedArticels.length"
      class="flex justify-center items-center"
    >
      <div
        class="p-3 flex hover:text-moonlight-500 transition-all duration-150 border rounded-xl border-black/30 dark:border-white/30 select-none cursor-pointer"
        :title="sortIsAsc ? '升序' : '降序'"
        @click="sortIsAsc = !sortIsAsc"
      >
        <el-icon
          :size="20"
          class="transition-all duration-150"
          :class="[{ '-scale-x-100': sortIsAsc }]"
        ><Sort /></el-icon>
      </div>
    </div>
    <div>
      <ArticlesList :articles="sortedArticels" />
    </div>
  </div>
</template>
