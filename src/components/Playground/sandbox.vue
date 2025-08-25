<script setup lang="ts">
import { debounce } from '@/core/elfland/utils'
import { computed, ref, watch, type PropType } from 'vue'

const props = defineProps({
  html: {
    type: String,
    required: true
  },
  css: {
    type: String,
    required: true
  },
  js: {
    type: String,
    required: true
  },
  ts: {
    type: String,
    required: true
  }
})
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'
interface LogEntry { level: LogLevel; text: string; t: number }
const logs = defineModel('logs', {
  required: true,
  type: Array as PropType<LogEntry[]>
})

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeContent = computed(() => buildSrcdoc(props.html, props.css, props.js, props.ts))
const iframeSrcDoc = ref(iframeContent.value)
const srcDocUpdate = debounce((val: string) => {
  iframeSrcDoc.value = val
}, 500)
const trySet = setIframe()
trySet(iframeSrcDoc.value)
watch(iframeContent, (newVal) => {
  srcDocUpdate(newVal)
})
watch(iframeSrcDoc, (newVal) => {
  trySet(newVal)
})

function setIframe() {
  let timer: NodeJS.Timeout | null = null
  const trySet = (val: string) => {
    if (timer) clearTimeout(timer)
    timer = null
    if (iframeRef.value) {
      logs.value = []
      iframeRef.value.srcdoc = val
    } else {
      timer = setTimeout(() => trySet(val), 100)
    }
  }
  return trySet
}

function escapeScript(str: string) {
  return str.replace(/<\/script>/gi, '<\/script>')
}
function buildSrcdoc(html: string, css: string, js: string, tsCompiled: string) {
  const jsSafe = escapeScript(js)
  const tsSafe = escapeScript(tsCompiled)
  const cssSafe = css
  const htmlSafe = html
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>html,body{height:100%;} ${cssSafe}</style>
  <script>
  // Console & error relay
  (function(){
    const send = (level, args)=>{
      try { parent.postMessage({ source:'playground-console', level, args: args.map((a)=>{
        try{
          if (typeof a === 'string') return a;
          if (a && a.stack) return a.stack;
          if (a instanceof Element) return '<' + a.tagName.toLowerCase() + '>';
          const seen = new WeakSet();
          return JSON.stringify(a, (k,v)=>{ if (typeof v==='object' && v!==null){ if (seen.has(v)) return '[Circular]'; seen.add(v);} return v; }, 2);
        }catch(e){ return String(a); }
      }) }, '*'); } catch(_){}
    };
    ['log','info','warn','error','debug'].forEach(m=>{
      const orig = console[m];
      console[m] = function(){ send(m, Array.from(arguments)); try{orig && orig.apply(console, arguments)}catch(_){} };
    });
    window.addEventListener('error', function(e){ send('error', [ (e && e.message ? e.message : 'Error') + (e && e.filename ? (' @ ' + e.filename + ':' + e.lineno + ':' + e.colno) : '') ]); });
    window.addEventListener('unhandledrejection', function(e){ send('error', ['Unhandled Rejection: ' + (e && e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : '')]); });
  })();
  <\/script>
</head>
<body>
  ${htmlSafe}
  <script>${tsSafe}<\/script>
  <script>${jsSafe}<\/script>
</body>
</html>`
}
</script>

<template>
  <div class="h-full overflow-auto w-full">
    <iframe
      ref="iframeRef"
      title="preview"
      sandbox="allow-scripts allow-modals allow-forms allow-popups"
      class="w-full h-full"
    />
  </div>
</template>
