<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const elfland = useElfland()
const links = elfland.links
const chart = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (chart.value) links.render(chart.value)
})
onBeforeUnmount(() => {
  links.distory()
})
</script>

<template>
  <div
    ref="chart"
    class="w-full h-full"
  />
</template>
