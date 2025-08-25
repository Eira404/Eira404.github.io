import type { Plugin } from 'esbuild-wasm'

export function virtualFsPlugin(fileMap: Record<string, string>): Plugin {
  return {
    name: 'virtual-fs',
    setup(build) {
      const isHttpImporter = (imp?: string) => !!imp && /^(https?:)?\/\//.test(imp)

      // 仅拦截来自本地虚拟文件的相对导入，不处理 http(s) 模块里的导入
      build.onResolve({ filter: /^\.\.\// }, (args) => {
        if (isHttpImporter(args.importer)) return null
        const url = new URL(args.path, 'file://' + args.resolveDir + '/')
        return { path: url.pathname, namespace: 'virtual' }
      })
      build.onResolve({ filter: /^\.\// }, (args) => {
        if (isHttpImporter(args.importer)) return null
        const url = new URL(args.path, 'file://' + args.resolveDir + '/')
        return { path: url.pathname, namespace: 'virtual' }
      })
      build.onResolve({ filter: /^\// }, (args) => {
        if (isHttpImporter(args.importer)) return null
        return { path: args.path, namespace: 'virtual' }
      })

      build.onLoad({ filter: /.*/, namespace: 'virtual' }, async (args) => {
        const path = args.path
        const contents = fileMap[path]
        if (contents == null) return null
        const loader = path.endsWith('.tsx') ? 'tsx'
          : path.endsWith('.ts') ? 'ts'
            : path.endsWith('.jsx') ? 'jsx'
              : path.endsWith('.js') ? 'js' : 'ts'
        const resolveDir = path.substring(0, path.lastIndexOf('/')) || '/'
        return { contents, loader, resolveDir }
      })
    }
  }
}
