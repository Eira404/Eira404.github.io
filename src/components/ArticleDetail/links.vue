<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ElIcon } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const props = defineProps({
  in: {
    type: Boolean,
    default: true
  }
})

const elfland = useElfland()
const articleIns = elfland.article
const linksIns = elfland.links

const article = articleIns.article
if (article.value === null) throw new Error('article is null')
const links = computed(() => linksIns.getLinks(article.value!.id))
if (links.value === undefined) throw new Error('links is undefined')
const linksOut = computed(() => links.value!.out)
const linksIn = computed(() => links.value!.in)

const scrollToTop = () => {
  window.scrollTo(0, 0)
}
</script>

<template>
  <div>
    <div class="mb-4">
      <div
        v-if="props.in"
        class="flex items-center justify-between"
      >
        <span>链接当前笔记</span>
        <span class="text-gray-600 dark:text-gray-400">{{ linksIn.length }}</span>
      </div>
      <div
        v-else
        class="flex items-center justify-between"
      >
        <span>当前笔记中的链接</span>
        <span class="text-gray-600 dark:text-gray-400">{{ linksOut.length }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="d, i in props.in ? linksIn : linksOut"
        :key="i"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-moonlight-500 transition-all duration-150"
        @click="scrollToTop"
      >
        <router-link
          :to="d.path"
          class="w-full flex items-center gap-2"
        >
          <el-icon><Link /></el-icon>
          {{ d.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>
