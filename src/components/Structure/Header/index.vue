<script setup lang="ts">
import links from './links.vue'
import theme from './theme.vue'
// import lang from './lang.vue'
import github from './github.vue'

</script>

<template>
  <header class="w-full h-full flex items-center justify-center pr-6 pl-6 border-b border-black/20 dark:border-white/20 backdrop-blur-lg ">
    <div class="flex items-center justify-between w-full max-w-[1200px] h-full">
      <div class="flex items-center gap-4 h-full">
        <links />
      </div>
      <div class="flex items-center gap-4 select-none">
        <!-- <lang /> -->
        <theme />
        <github />
      </div>
    </div>
  </header>
</template>
