<script setup lang="ts">
import type { PropType } from 'vue'
import { ElButton } from 'element-plus'

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'
interface LogEntry { level: LogLevel; text: string; t: number }
const logs = defineModel('logs', {
  required: true,
  type: Array as PropType<LogEntry[]>
})
</script>

<template>
  <div class="h-full">
    <div class="h-8 flex items-center justify-between px-3">
      <div>
        Console
      </div>
      <div>
        <el-button
          plain
          size="small"
          @click="logs = []"
        >
          Clear
        </el-button>
      </div>
    </div>
    <div
      style="height: calc(100% - 32px);"
      class="bg-[#0b1020] text-[#e5e7eb] overflow-auto font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] text-[13px] p-3"
    >
      <template v-if="logs.length===0">
        <div class="console-line muted">Console output will appear here…</div>
      </template>
      <template v-else>
        <div
          v-for="(l, idx) in logs"
          :key="l.t + '-' + idx"
          class="console-line"
          :class="l.level"
        >
          <span class="time">[{{ new Date(l.t).toLocaleTimeString() }}]</span>
          <span class="lvl">{{ l.level.toUpperCase() }}</span>
          <span class="txt">{{ l.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.console-line { display:block; padding:2px 0; white-space: pre-wrap; word-break: break-word; }
.console-line .time { opacity:.6; margin-right:8px; }
.console-line .lvl { opacity:.6; margin-right:8px; }
.console-line.warn { color: #f3f99d; }
.console-line.error { color: #ff6b6b; }
.console-line.muted { color: #94a3b8; }
</style>
