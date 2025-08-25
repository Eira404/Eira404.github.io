import * as esbuild from 'esbuild-wasm'
import { virtualFsPlugin } from './plugins/virtualFs'
import { httpNpmPlugin } from './plugins/httpNpm'

let inited = false

async function ensureInit() {
  if (inited) return
  await esbuild.initialize({
    wasmURL: '/esbuild.wasm',
    worker: false
  })
  inited = true
}

export async function bundle(fileMap: Record<string, string>, entry = '/index.ts') {
  await ensureInit()
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    sourcemap: 'inline',
    plugins: [virtualFsPlugin(fileMap), httpNpmPlugin()]
  })
  return result.outputFiles[0].text
}
