import { bundle } from './build'

self.onmessage = async (e: MessageEvent) => {
  const { type, fileMap, entry } = e.data ?? {}
  if (type === 'bundle') {
    try {
      const code = await bundle(fileMap, entry);
      (self as any).postMessage({ type: 'bundle:ok', payload: { code }})
    } catch (err: any) {
      (self as any).postMessage({ type: 'bundle:err', error: String(err?.message || err) })
    }
  }
}
