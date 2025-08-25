<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { ElIcon, ElDialog, ElButton, ElInput } from 'element-plus'
import { DocumentAdd, Delete } from '@element-plus/icons-vue'
import { message } from '@/core/elfland/utils'

const files = defineModel('files', {
  type: Array as PropType<Array<string>>,
  required: true
})
const selectedFile = defineModel('selectedFile', {
  type: String,
  required: true
})
const emits = defineEmits<{
  addFile: [string],
  deleteFile: [string]
}>()

const dialogVisible = ref(false)
const fileName = ref('')
const addFile = () => {
  fileName.value = ''
  dialogVisible.value = true
}
const addFileConfirm = () => {
  if (!fileName.value) {
    message('请输入文件名')
    return
  }
  if (files.value.includes(fileName.value)) {
    message('文件已存在')
    return
  }
  if (fileName.value.includes('/') || fileName.value.includes('\\') || fileName.value.includes(' ')) {
    message('文件名不能包含 / \\ 空格')
    return
  }
  emits('addFile', '/' + fileName.value.trim())
  dialogVisible.value = false
}

const deleteDialogVisible = ref(false)
const deleteFileName = ref('')
const deleteFile = (fileName: string) => {
  deleteFileName.value = fileName
  deleteDialogVisible.value = true
}
const confirmDelete = () => {
  emits('deleteFile', deleteFileName.value)
  deleteDialogVisible.value = false
}
</script>

<template>
  <div class="h-full">
    <div class="h-8 flex gap-1 justify-between items-center px-2">
      <router-link
        :to="{ name: 'playground' }"
        class="text-[12px]"
      >
        HTML Playground
      </router-link>
      <el-icon
        :size="20"
        class="cursor-pointer"
        title="新建文件"
        @click="addFile"
      >
        <DocumentAdd />
      </el-icon>
    </div>
    <div
      style="height: calc(100% - 2rem);"
      class="flex flex-col"
    >
      <div
        v-for="f in files"
        :key="f"
        class="py-1 px-3 flex justify-between items-center hover:cursor-pointer hover:bg-gray-600/10 dark:hover:bg-gray-400/10"
        :class="{'bg-gray-600/10 dark:hover:bg-gray-400/10': f === selectedFile}"
        @click="selectedFile = f"
      >
        <span>{{ f.slice(1) }}</span>
        <span
          v-show="f !== '/index.ts'"
          @click.stop="deleteFile(f)"
        >
          <el-icon :size="20"><Delete /></el-icon>
        </span>
        <span
          v-show="f === '/index.ts'"
          class="text-[12px]"
        >run 入口文件</span>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Add File"
      width="400px"
    >
      <el-input
        v-model="fileName"
        placeholder="请输入ts文件名"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="addFileConfirm"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="deleteDialogVisible"
      title="Delete File"
      width="400px"
    >
      <span>你确定要删除文件{{ deleteFileName.slice(1) }}吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="confirmDelete"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
