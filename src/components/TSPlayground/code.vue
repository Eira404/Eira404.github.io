<script setup lang="ts">
import MyCode from '@/components/Playground/code.vue'
import { ElButton, ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import type { PropType } from 'vue'

const code = defineModel('code', {
  required: true,
  type: String
})
const openedFiles = defineModel('openedFiles', {
  type: Array as PropType<string[]>,
  required: true
})
const selectedFile = defineModel('selectedFile', {
  type: String,
  required: true
})
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
const emits = defineEmits<{
  run: []
}>()

const run = () => {
  emits('run')
}

const closeFile = (file: string) => {
  const i = openedFiles.value.indexOf(file)
  openedFiles.value = openedFiles.value.filter((fileName) => fileName !== file)
  if (selectedFile.value === file) selectedFile.value = openedFiles.value[i - 1]
}

</script>

<template>
  <div class="h-full">
    <div class="h-full">
      <MyCode
        v-model:code="code"
        lang="ts"
        :title="title"
      >
        <template #header-left>
          <div
            v-for="f in openedFiles"
            :key="f"
            class="px-2 py-1 flex items-center gap-2 hover:cursor-pointer bg-bg dark:bg-bg-dark"
            :class="{'text-moonlight-500 !bg-[#fcfcfc] dark:!bg-[#282c34]': f === selectedFile}"
            @click="selectedFile = f"
          >
            <span>{{ f.slice(1) }}</span>
            <span
              v-show="f !== '/index.ts'"
              class="flex items-center"
              @click.stop="closeFile(f)"
            >
              <el-icon :size="20">
                <Close />
              </el-icon>
            </span>
          </div>
        </template>
        <template #header-right>
          <el-button
            plain
            size="small"
            @click="run"
          >Run</el-button>
        </template>
      </MyCode>
    </div>
  </div>
</template>
