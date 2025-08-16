<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import c from './c.vue'

const route = useRoute()
const elfland = useElfland()
const articleIns = elfland.article
const article = articleIns.article
if (article.value === null) throw new Error('article is null')
const title = computed(() => article.value!.title)
const author = computed(() => article.value!.author)
const prev = computed(() => article.value!.prev)
const next = computed(() => article.value!.next)
const path = computed(() => window.location.protocol + '//' + window.location.host + route.path)
const srollToTop = () => {
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="flex flex-col p-12 gap-8 cursor-default pt-0">
    <div class="flex flex-col gap-2 p-4 px-8 rounded-r-2xl border-l-4 border-elysia-500 bg-elysia-500/10 relative overflow-hidden">
      <div>
        <span>本文作者：</span>
        <span>{{ author }}</span>
      </div>
      <div>
        <span>本文题目：</span>
        <span>{{ title }}</span>
      </div>
      <div>
        <span>本文链接：</span>
        <a
          :href="path"
          target="_blank"
        >{{ decodeURIComponent(path) }}</a>
      </div>
      <div>
        <span>版权声明：</span>
        <span>本博客所有文章除特别声明外，均默认采用 CC BY-NC-SA 许可协议。</span>
      </div>
      <c class="absolute -z-10 h-[120%] right-[-20px] top-1/2 -translate-y-1/2 text-elysia-500/80" />
    </div>
    <div class="flex justify-between items-center">
      <div
        class="flex justify-center items-center"
        @click="srollToTop"
      >
        <router-link
          :to="{ name: 'article', params: { articlePath: prev.path } }"
          :title="prev.title"
          class="px-[12px] py-[6px] flex justify-center items-center gap-2 border border-black/40 dark:border-white/40 rounded-lg hover:border-moonlight-500 transition-all duration-150 hover:text-moonlight-500"
        >
          <el-icon><ArrowLeft /></el-icon>
          <span class="text-lg">Prev</span>
        </router-link>
      </div>
      <div
        class="flex justify-center items-center"
        @click="srollToTop"
      >
        <router-link
          :to="{ name: 'article', params: { articlePath: next.path } }"
          :title="next.title"
          class="px-[12px] py-[6px] flex justify-center items-center gap-2 border border-black/40 dark:border-white/40 rounded-lg hover:border-moonlight-500 transition-all duration-150 hover:text-moonlight-500"
        >
          <span class="text-lg">Next</span>
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>
