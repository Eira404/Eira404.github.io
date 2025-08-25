<script setup lang="ts">
import MyHeader from './Header/index.vue'
</script>

<template>
  <div>
    <div class="sticky top-0 z-10 w-full box-content">
      <div class="h-14">
        <MyHeader />
      </div>
    </div>
    <div style="height: calc(100vh - 56px);">
      <slot name="main" />
    </div>
  </div>
</template>
