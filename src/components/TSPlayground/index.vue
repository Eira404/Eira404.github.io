<script setup lang="ts">
import SplitStructure from '@/components/SplitStructure/index.vue'
import fileList from './fileList.vue'
import MyCode from './code.vue'
import MyConsole from '@/components/Playground/console.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { deepClone } from '@/core/elfland/utils'

const elfland = useElfland()
const tsPlayground = elfland.tsPlayground
const eFiles = tsPlayground.selectedExampleFiles.value

const ratio1 = ref(0.15)
const ratio2 = ref(0.7)

const fileMap = ref<Record<string, string>>(eFiles)
const files = computed({
  get: () => Object.keys(fileMap.value),
  set: (val) => {
    fileMap.value = val.reduce((acc, cur) => {
      acc[cur] = fileMap.value[cur] || ''
      return acc
    }, {} as Record<string, string>)
  }
})
const openedFiles = ref<string[]>([])
const selectedFile = ref('')
watch(selectedFile, (val) => {
  if (openedFiles.value.includes(val)) return
  openedFiles.value.push(val)
})
selectedFile.value = '/index.ts'

const addFile = (fileName: string) => {
  fileMap.value[fileName] = ''
  selectedFile.value = fileName
}
const deleteFile = (fileName: string) => {
  delete fileMap.value[fileName]
  openedFiles.value = openedFiles.value.filter((file) => file !== fileName)
  if (selectedFile.value === fileName) selectedFile.value = '/index.ts'
}

const tsFile = computed({
  get: () => fileMap.value[selectedFile.value] || '',
  set: (val: string) => {
    fileMap.value[selectedFile.value] = val
  }
})

// Worker 与构建
// 为避免打包器把 Worker 变成内联字符串，这里使用 new URL(..., import.meta.url)
// 也可以改为 Vite 的 worker 语法：new Worker(new URL('...',{import.meta.url}), {type:'module'})
// const EsbuildWorker = new URL('@/worker/esbuild-worker.ts', import.meta.url)
let worker: Worker | null = null
// 控制台日志
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'
interface LogEntry { level: LogLevel; text: string; t: number }
const logs = ref<LogEntry[]>([])
function appendLog(type: LogLevel, ...xs: any[]) {
  const msg = xs.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')
  logs.value.push({ level: type, text: msg, t: Date.now() })
}

const run = async () => {
  if (!worker) return
  logs.value = []
  const fm = deepClone(fileMap.value) // 深拷贝去掉 Proxy
  worker.postMessage({ type: 'bundle', fileMap: fm, entry: '/index.ts' })
}

// 与 iframe 沙箱通信
import { runInSandbox } from '@/utils'
import { useElfland } from '@/core/elfland'
let stopSandbox: null | (()=>void) = null

onMounted(() => {
  worker = new Worker(new URL('@/worker/esbuild-worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = async (e) => {
    const { type, payload, error } = e.data ?? {}
    if (type === 'bundle:ok') {
      stopSandbox?.()
      stopSandbox = runInSandbox(payload.code, (msg) => {
        if (msg?.type === 'log') appendLog('log', ...msg.args)
        else if (msg?.type === 'error') appendLog('error', msg.message)
        else if (msg?.type === 'done') appendLog('info', '[Program finished]')
      })
    } else if (type === 'bundle:err') {
      appendLog('error', error ?? 'unknown error')
    }
  }

  // 快捷键运行
  const onKey = (ev: KeyboardEvent) => {
    const isRun = (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'enter'
    if (isRun) { ev.preventDefault(); run() }
  }
  window.addEventListener('keydown', onKey)

  // 初次自动运行
  run()

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
  })
})

onBeforeUnmount(() => {
  stopSandbox?.()
  worker?.terminate()
  worker = null
})

</script>

<template>
  <div class="h-full overflow-hidden">
    <SplitStructure
      v-model="ratio1"
      :min-a="20"
      :min-b="20"
    >
      <template #a>
        <fileList
          v-model:files="files"
          v-model:selected-file="selectedFile"
          @add-file="addFile"
          @delete-file="deleteFile"
        />
      </template>
      <template #b>
        <SplitStructure
          v-model="ratio2"
          :min-a="20"
          :min-b="20"
          direction="vertical"
        >
          <template #a>
            <MyCode
              v-model:opened-files="openedFiles"
              v-model:code="tsFile"
              v-model:selected-file="selectedFile"
              :title="selectedFile.slice(1)"
              @run="run"
            />
          </template>
          <template #b>
            <MyConsole v-model:logs="logs" />
          </template>
        </SplitStructure>
      </template>
    </SplitStructure>
  </div>
</template>
