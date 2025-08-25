export function runInSandbox(esmCode: string, onMessage: (data:any)=>void) {
  const iframe = document.createElement('iframe')
  // 需要写入 iframe 文档，因此必须允许 same-origin，否则父页面拿不到 contentDocument
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
  // about:blank + onload 后再写入，避免某些浏览器下 contentDocument 为 null
  iframe.src = 'about:blank'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const bootstrap = new Blob([
    `const send=(type,args)=>parent.postMessage({type,args},'*');
` +
`const origLog=console.log;console.log=(...a)=>{send('log',a);origLog(...a)};
`
  ], { type: 'text/javascript' })
  const bootstrapUrl = URL.createObjectURL(bootstrap)

  const handler = (e: MessageEvent) => onMessage?.(e.data)
  window.addEventListener('message', handler)

  const writeIntoIframe = () => {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) {
      onMessage?.({ type: 'error', message: 'Sandbox not ready: contentDocument is null' })
      return
    }
    doc.open()
    doc.write(`<script src="${bootstrapUrl}"><\/script>
` +
`<script type="module">
` +
`${esmCode}
` +
`window.addEventListener('error',e=>parent.postMessage({type:'error',message:e.message},'*'));
` +
`parent.postMessage({type:'done'},'*');
` +
`<\/script>`)
    doc.close()
  }

  if (iframe.contentDocument?.readyState === 'complete') {
    writeIntoIframe()
  } else {
    iframe.addEventListener('load', writeIntoIframe, { once: true })
  }

  return () => {
    window.removeEventListener('message', handler)
    URL.revokeObjectURL(bootstrapUrl)
    iframe.remove()
  }
}
