<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

const elfland = useElfland()
const ins = elfland.theme
const theme = elfland.theme.theme

function change() {
  ins.toggle()
}
</script>

<template>
  <span
    class="flex items-center cursor-pointer"
    @click="change"
  >
    <el-icon
      v-show="theme === 'light'"
      size="24"
    ><Sunny /></el-icon>
    <el-icon
      v-show="theme === 'dark'"
      size="24"
    ><Moon /></el-icon>
  </span>
</template>
