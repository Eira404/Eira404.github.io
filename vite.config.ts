import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

import { buildMdRES, copy404 } from './vite.config.helper'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    fs: {
      // 允许访问 C 盘
      allow: ['C:/obsidian/研究生', 'C:/code/vue/Eira404']
    },
    watch: {
      ignored: [
        '**/DumpStack.log.tmp',
        '**/hiberfil.sys', // 这样写就够了
        '**/pagefile.sys', // 加一个保险
        '**/swapfile.sys',
        '**/node_modules/**',
        '**/.git/**'
      ]
    }
  },
  plugins: [vue(), vueDevTools(), tailwindcss(), copy404(), buildMdRES()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('echarts')) return 'echarts'
          if (id.includes('zrender')) return 'zrender'
          if (id.includes('katex')) return 'katex'
          if (id.includes('typescript')) return 'typescript'
          if (id.includes('@pixi')) return '@pixi'
          if (id.includes('@codemirror')) return '@codemirror'
          if (id.includes('node_modules')) return 'vendor'
        }
      }
    }
  }
})
