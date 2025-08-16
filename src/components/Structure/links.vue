<script setup lang="ts">
import MyHeader from './Header/index.vue'
</script>

<template>
  <div class="w-full h-screen">
    <div class="sticky top-0 z-10 w-full box-content">
      <div class="h-14">
        <MyHeader />
      </div>
    </div>
    <div
      class="w-full"
      style="height: calc(100vh - 56px);"
    >
      <slot name="main" />
    </div>
  </div>
</template>
