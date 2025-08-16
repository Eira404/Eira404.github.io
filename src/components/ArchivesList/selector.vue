<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ElIcon } from 'element-plus'
import { DocumentAdd, Document, Tickets, Sort } from '@element-plus/icons-vue'

const elfland = useElfland()
const articlesIns = elfland.articles

const sortMethodSelected = articlesIns.archivesSortMethodSelected
const sortMethodOptions = articlesIns.archivesSortMethodOptions
const sortMethodIsAsc = articlesIns.archivesSortMethodIsAsc
</script>

<template>
  <div class="sticky flex top-[32px] z-10 bg-bg dark:bg-bg-dark border border-black/30 dark:border-white/30 rounded-lg cursor-pointer select-none">
    <div
      class="p-3 flex hover:text-moonlight-500 transition-all duration-150"
      title="按创建时间排序"
      :class="[{ 'text-moonlight-500': sortMethodSelected === 'ByCreated' }]"
      @click="sortMethodSelected = 'ByCreated'"
    >
      <el-icon :size="20"><DocumentAdd /></el-icon>
    </div>
    <div
      class="p-3 flex hover:text-moonlight-500 transition-all duration-150 border-l border-black/30 dark:border-white/30"
      title="按修改时间排序"
      :class="[{ 'text-moonlight-500': sortMethodSelected === 'ByModified' }]"
      @click="sortMethodSelected = 'ByModified'"
    >
      <el-icon :size="20"><Document /></el-icon>
    </div>
    <div
      class="p-3 flex hover:text-moonlight-500 transition-all duration-150 border-l border-black/30 dark:border-white/30"
      title="按文章标题排序"
      :class="[{ 'text-moonlight-500': sortMethodSelected === 'ByTitlePinYin' }]"
      @click="sortMethodSelected = 'ByTitlePinYin'"
    >
      <el-icon :size="20"><Tickets /></el-icon>
    </div>
    <div
      class="p-3 flex hover:text-moonlight-500 transition-all duration-150 border-l border-black/30 dark:border-white/30"
      :title="sortMethodIsAsc ? '升序' : '降序'"
      @click="sortMethodIsAsc = !sortMethodIsAsc"
    >
      <el-icon
        :size="20"
        class="transition-all duration-150"
        :class="[{ '-scale-x-100': sortMethodIsAsc }]"
      ><Sort /></el-icon>
    </div>
  </div>
</template>
