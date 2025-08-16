<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ElIcon } from 'element-plus'
import { Sort } from '@element-plus/icons-vue'
import ArticlesList from '@/components/ArticlesList/index.vue'
import tag from './tag.vue'

const elfland = useElfland()
const tagsIns = elfland.tags
const tags = tagsIns.tags
const sortedArticels = tagsIns.sortedArticels
const sortIsAsc = tagsIns.sortIsAsc
</script>

<template>
  <div class="flex flex-col gap-4 p-12">
    <div class="p-8 pt-0 flex flex-wrap gap-2">
      <tag
        v-for="t in tags"
        :key="t.tag"
        :tag="t"
      />
    </div>
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
