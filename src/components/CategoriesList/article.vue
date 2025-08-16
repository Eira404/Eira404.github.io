<script setup lang="ts">
import { Article } from '@/core/elfland-addon-articles/core/article'
import { ElIcon } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const props = defineProps({
  article: {
    type: Article,
    required: true
  }
})
</script>

<template>
  <router-link
    class="hover:text-moonlight-500 hover:underline flex items-center gap-2"
    :to="{ name: 'article', params: { articlePath: article.path }}"
  >
    <el-icon><Document /></el-icon>
    {{ article.title }}
  </router-link>
</template>
