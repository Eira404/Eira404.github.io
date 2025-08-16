<script setup lang="ts">
import type { Article } from '@/core/elfland-addon-articles/core/article'
import type { PropType } from 'vue'
import { ElIcon } from 'element-plus'
import { ArrowRightBold } from '@element-plus/icons-vue'

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true
  }
})
const MONTHS_3L = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
</script>

<template>
  <router-link
    class="py-3 px-4 flex justify-between items-center text-sm border border-black/20 dark:border-white/20 hover:bg-black/3 dark:hover:bg-white/5  hover:text-moonlight-500 rounded-xl transition-all duration-150"
    :to="{ name: 'article', params: { articlePath: article.path}}"
  >
    <div class="flex gap-4 items-cente">
      <div class="flex gap-1 items-center text-gray-600 dark:text-gray-400">
        {{ MONTHS_3L[article.created.getMonth()] }}
        {{ article.created.getDate() }}
        ,
        {{ article.created.getFullYear() }}
      </div>
      <div>
        {{ article.title }}
      </div>
    </div>
    <div>
      <el-icon><ArrowRightBold /></el-icon>
    </div>
  </router-link>
</template>
