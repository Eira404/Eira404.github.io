<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MyCode from './code.vue'
import MySandbox from './sandbox.vue'
import MyConsole from './console.vue'
import { ElRadioGroup, ElRadioButton } from 'element-plus'
import { debounce } from '@/core/elfland/utils'
import { useElfland } from '@/core/elfland'

const elfland = useElfland()
const playground = elfland.playground
const selectedExampleFiles = playground.selectedExampleFiles

const selectedLang = ref<'HTML' | 'CSS' | 'JavaScript' | 'TypeScript'>('HTML')
const selectedShower = ref<'HTML' | 'Console'>('HTML')

const codeHtml = ref(selectedExampleFiles.value.html.code)
const codeCss = ref(selectedExampleFiles.value.css.code)
const codeJs = ref(selectedExampleFiles.value.js.code)
const codeTs = ref(selectedExampleFiles.value.ts.code)
const codeTsCompiled = ref('')

const tsReady = ref(false)
const tsMod = ref<any>(null)

const createCompileTS = () => {
  let timer: NodeJS.Timeout | null = null
  const compile = (val: string) => {
    const ts = tsMod.value
    if (!ts) {
      return `console.warn('TypeScript compiler not loaded yet. Running without TS.');`
    }
    try {
      const out = ts.transpileModule(codeTs.value, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.ESNext,
          sourceMap: false,
          lib: ['es2020', 'dom']
        }
      })
      return out.outputText
    } catch (err: any) {
      return `console.error('TS compile error:', ${JSON.stringify(String(err && (err.message || err)))} )`
    }
  }
  const tryCompile = (val: string) => {
    if (timer) clearTimeout(timer)
    timer = null
    codeTsCompiled.value = compile(val)
    if (tsMod.value) return
    timer = setTimeout(() => tryCompile(val), 100)
  }
  return tryCompile
}

const tryCompile = createCompileTS()
tryCompile(codeTs.value)
const tsUpdate = debounce((val: string) => {
  tryCompile(val)
}, 500)

watch(codeTs, (newVal) => {
  tsUpdate(newVal)
})

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'
interface LogEntry { level: LogLevel; text: string; t: number }
const logs = ref<LogEntry[]>([])

function onMsg(e: MessageEvent) {
  const data: any = e && e.data
  if (!data || data.source !== 'playground-console') return
  const { level, args } = data
  const line = (Array.isArray(args) ? args : [args]).map((x:any) => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')
  logs.value.push({ level, text: line, t: Date.now() })
}

onMounted(async () => {
  window.addEventListener('message', onMsg)
  try {
    tsMod.value = await import('typescript')
    tsReady.value = true
  } catch {
    tsReady.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMsg)
})

</script>

<template>
  <div class="h-full">
    <div class="h-10 flex items-center justify-between px-10">
      <div>
        <el-radio-group v-model="selectedLang">
          <el-radio-button label="HTML" />
          <el-radio-button label="CSS" />
          <el-radio-button label="JavaScript" />
          <el-radio-button label="TypeScript" />
        </el-radio-group>
      </div>
      <div>
        <el-radio-group v-model="selectedShower">
          <el-radio-button label="HTML" />
          <el-radio-button label="Console" />
        </el-radio-group>
      </div>
    </div>
    <div
      style="height: calc(100% - 40px);"
      class="flex"
    >
      <div class="h-full w-1/2">
        <MyCode
          v-show="selectedLang === 'HTML'"
          v-model:code="codeHtml"
          title="HTML"
          lang="html"
        />
        <MyCode
          v-show="selectedLang === 'CSS'"
          v-model:code="codeCss"
          title="CSS"
          lang="css"
        />
        <MyCode
          v-show="selectedLang === 'JavaScript'"
          v-model:code="codeJs"
          title="JavaScript"
          lang="js"
        />
        <MyCode
          v-show="selectedLang === 'TypeScript'"
          v-model:code="codeTs"
          title="TypeScript"
          lang="ts"
        />
      </div>
      <div class="w-1/2">
        <MySandbox
          v-show="selectedShower === 'HTML'"
          v-model:logs="logs"
          :html="codeHtml"
          :css="codeCss"
          :js="codeJs"
          :ts="codeTsCompiled"
        />
        <MyConsole
          v-show="selectedShower === 'Console'"
          v-model:logs="logs"
        />
      </div>
    </div>

  </div>
</template>
