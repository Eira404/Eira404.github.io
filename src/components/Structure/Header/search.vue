<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <router-link
    :to="{ name: 'ts-playground' }"
    class="flex items-center hover:text-moonlight-500"
    title="TS Playground"
  >
    <el-icon :size="24">
      <Search />
    </el-icon>
  </router-link>
</template>
