import type { Plugin, OnResolveArgs } from 'esbuild-wasm'

const CDN = 'https://esm.sh'
const cache = new Map<string, string>()

function toCdnUrl(spec: string) {
// 给裸模块加 ?bundle，CDN 端预处理 CJS/依赖，减少内部根路径重写
  return `${CDN}/${spec}?bundle`
}

export function httpNpmPlugin(): Plugin {
  return {
    name: 'http-npm',
    setup(build) {
      // 裸模块 → CDN
      build.onResolve({ filter: /^[^.\/]|^\@/ }, (args: OnResolveArgs) => {
        return { path: toCdnUrl(args.path), namespace: 'http-url' }
      })

      // 绝对 http(s) URL
      build.onResolve({ filter: /^https?:\/\// }, (args) => ({ path: args.path, namespace: 'http-url' }))

      // 从 http-url 命名空间里的相对与根路径导入 → 相对于 importer 解析
      build.onResolve({ filter: /^\.\.?\//, namespace: 'http-url' }, (args) => {
        const url = new URL(args.path, args.importer).toString()
        return { path: url, namespace: 'http-url' }
      })
      build.onResolve({ filter: /^\//, namespace: 'http-url' }, (args) => {
        const url = new URL(args.path, args.importer).toString()
        return { path: url, namespace: 'http-url' }
      })

      build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
        if (cache.has(args.path)) return { contents: cache.get(args.path)!, loader: 'js' }
        const res = await fetch(args.path)
        if (!res.ok) throw new Error(`Failed to fetch ${args.path}: ${res.status}`)
        const text = await res.text()
        cache.set(args.path, text)
        return { contents: text, loader: 'js' }
      })
    }
  }
}
