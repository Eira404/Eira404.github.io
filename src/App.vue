<script setup lang="ts">
import Live2D from '@/components/Live2D/index.vue'
const width = window.innerWidth

</script>

<template>
  <div>
    <router-view />
    <Live2D
      :pos="{ right: `${Math.max(0, width / 2 - 1000)}px`, bottom: '0'}"
      direction="x"
    />
  </div>
</template>
