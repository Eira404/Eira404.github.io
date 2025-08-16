<script setup lang="ts">
import type { ResTocItem } from '@/core/elfland-addon-article'
import { ref } from 'vue'

const props = defineProps<{
  data: ResTocItem,
  active: boolean
}>()
const pld: string[] = [
  'pl-0', // 0
  'pl-0',
  'pl-4',
  'pl-8',
  'pl-12',
  'pl-16',
  'pl-20'
]
const pl = pld[props.data.l] || 'pl-20'
const a = ref<HTMLAnchorElement | null>(null)
const top = () => {
  return a.value ? a.value.offsetTop : 0
}
defineExpose({ top })
</script>

<template>
  <a
    ref="a"
    :href="data.a"
    :class="[active ? 'text-moonlight-500' : '', pl]"
    :title="data.n"
    class="hover:text-moonlight-500 transition-all duration-150 cursor-pointer truncate py-1"
  >
    {{ data.n }}
  </a>
</template>
