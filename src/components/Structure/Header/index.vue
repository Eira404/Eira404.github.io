<script setup lang="ts">
import links from './links.vue'
import theme from './theme.vue'
import lang from './lang.vue'
import search from './search.vue'
import rightLinks from './right-links.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const scrollY = ref(0)
const scrollYIsLess = ref(false)
const hideHeader = computed(() => scrollY.value >= 100 && scrollYIsLess.value)

const handleScroll = () => {
  if (window.scrollY > scrollY.value) scrollYIsLess.value = true
  else scrollYIsLess.value = false
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

handleScroll()

</script>

<template>
  <header
    class="w-full h-full flex items-center justify-center pr-6 pl-6 border-b border-black/20 dark:border-white/20 backdrop-blur-lg transition-all duration-300"
    :class="{ '-translate-y-full': hideHeader }"
  >
    <div class="flex items-center justify-between w-full max-w-[1500px] h-full">
      <div class="flex items-center gap-4 h-full">
        <links />
      </div>
      <div class="flex items-center gap-6 select-none">
        <rightLinks />
        <search />
        <theme />
        <lang />
      </div>
    </div>
  </header>
</template>
