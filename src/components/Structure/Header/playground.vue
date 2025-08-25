<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { DataBoard } from '@element-plus/icons-vue'
</script>

<template>
  <router-link
    :to="{ name: 'ts-playground' }"
    class="flex items-center hover:text-moonlight-500"
    title="TS Playground"
  >
    <el-icon :size="24">
      <DataBoard />
    </el-icon>
  </router-link>
</template>
