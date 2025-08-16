<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import item from './item.vue'

const elfland = useElfland()
const articleIns = elfland.article
const toc = articleIns.rendererMdToc
const activePath = ref('')
const activeIndex = ref(-1)
const tocItemRefs = ref<InstanceType<typeof item>[]>([])
const activePromptDisplay = computed(() => {
  return activeIndex.value !== -1
})
const activePromptTop = computed(() => {
  if (activePromptDisplay.value === false) return 50
  const item = tocItemRefs.value[activeIndex.value]
  if (!item) return 50
  return item.top() + 4 + 2
})
const watchHandle = watch(toc, () => {
  setTimeout(() => {
    refresh()
    handleScroll()
  }, 0)
})
let headings:HTMLAnchorElement[] = []

const refresh = () => {
  headings = Array.from(document.querySelectorAll<HTMLAnchorElement>('.markdown-body :is(h1,h2,h3,h4,h5,h6)[id]')).map(el => el.childNodes[0]).filter(el => el instanceof HTMLAnchorElement)
}

const handleScroll = () => {
  let closest: HTMLAnchorElement | null = null
  let index = -1
  const min = 90
  headings.forEach((h, i) => {
    const top = h.getBoundingClientRect().top
    if (top < min) {
      closest = h
      index = i
    }
  })
  activePath.value = closest !== null ? (closest as HTMLAnchorElement).getAttribute('href') as string : ''
  activeIndex.value = index
}

onMounted(() => {
  refresh()
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  watchHandle()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="flex flex-col relative p-12">
    <div class="mb-4">
      <span>Content</span>
    </div>
    <div
      class="absolute w-[4px] h-[20px] bg-moonlight-500 transition-all duration-150 rounded-2xl pointer-none left-[30px]"
      :style="{top: activePromptTop + 'px', opacity: activePromptDisplay ? 1 : 0}"
    />
    <item
      v-for="t, i in toc"
      ref="tocItemRefs"
      :key="i"
      :data="t"
      :active="t.a === activePath"
    />
  </div>
</template>
