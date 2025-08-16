<script setup lang="ts">
import MyHeader from './Header/index.vue'
import MyFooter from './Footer/index.vue'
</script>

<template>
  <div>
    <div class="sticky top-0 z-10 w-full box-content">
      <div class="h-14">
        <MyHeader />
      </div>
    </div>
    <div class="max-w-[1000px] mx-auto">
      <slot name="main" />
    </div>
    <div>
      <MyFooter />
    </div>
  </div>
</template>
