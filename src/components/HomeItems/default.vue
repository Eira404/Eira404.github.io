<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
defineProps({
  title: {
    type: String,
    required: true
  },
  more: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  prompt: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="flex flex-col gap-y-5 md:flex-row md:gap-y-0">
    <div class="text-xl font-semibold md:min-w-36">
      <h2>{{ title }}</h2>
    </div>
    <div class="flex flex-1 flex-col gap-y-3">
      <slot name="main" />
      <div
        v-if="more"
        class="flex items-center justify-end px-10"
      >
        <router-link
          :to="{ name }"
          class="px-2 py-1 flex items-center gap-2 border border-black/30 dark:border-white/30 rounded-xl hover:bg-black/3 dark:hover:bg-white/5  hover:text-moonlight-500 transition-all duration-150"
        >
          {{ prompt }}
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>
  </section>
</template>
