import { PluginOption } from 'vite'
import { copyFileSync, readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import fg from 'fast-glob'
import { load } from 'js-yaml'
import { pinyin } from 'pinyin-pro'

const MD_DIR = 'C:/obsidian/研究生'
const DEV_RES_DIR = 'public/data'
const PROD_RES_DIR = 'dist/data'

function decodeYamlInMd(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\n---/)
  if (!match) return { meta: {}, body: md }

  const lines = match[1].split('\n')
  const meta: Record<string, string> = {}
  for (const line of lines) {
    const colon = line.indexOf(':')
    if (colon > 0) {
      const key = line.slice(0, colon).trim()
      const val = line.slice(colon + 1).trim()
      meta[key] = val
    }
  }
  const body = md.slice(match[0].length).trim()
  return { meta, body }
}

interface TagInfo {
  lineNo: number
  tags: string[]
}

function decodeAllTags(md: string): TagInfo {
  let result: TagInfo = {
    lineNo: 0,
    tags: []
  }
  const lines = md.split(/\r?\n/)
  const tagReg = /#([^\s#]+)/g   // 捕获 #后面到空格或行尾的内容

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const matches = Array.from(line.matchAll(tagReg))
    if (matches.length) {
      result = {
        lineNo: i + 1,
        tags: matches.map(m => m[1]) // 去掉 #
      }
      break
    }
  }
  return result
}

function decodeObsidianImages(md: string): string {
  return md.replace(/!\[\[([^\]]+)\]\]/g, (_, inner) => {
    const file = inner.trim().replace(/\s+/g, '-')
    return `![Obsidian图片](${file})`
  })
}

function decodeObsidianLinks(md: string): { text: string; links: string[] } {
  const links: string[] = []

  // const text = md.replace(/(?<=^|\s)\[\[([^\]]+)\]\](?=\s|$)/g, (_, inner) => {
  //   links.push(inner)        // 收集 xxx
  //   return `{{link|${inner}}}`   // 替换
  // })
  const text = md.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    links.push(inner)        // 收集 xxx
    return `{{link|${inner}}}`   // 替换
  })

  return { text, links }
}

const removeTopNLines = (str: string, n: number): string => str.split('\n').slice(n).join('\n')

function decodeYamlToJson(path: string) {
  const yml = readFileSync(resolve(path), 'utf-8')
  const json = load(yml)
  return json
}

function generateTsJson(outDir: string): string[] {
  const SRC_DIR = 'data/ts-playground'
  mkdirSync(outDir, { recursive: true })

  const folders = readdirSync(SRC_DIR, { withFileTypes: true })
  const dirNames: string[] = []

  for (const entry of folders) {
    if (!entry.isDirectory()) continue

    const dirPath = resolve(SRC_DIR, entry.name)
    const files = readdirSync(dirPath, { withFileTypes: true })

    const jsonArr: { 'name': string; 'code': string }[] = []

    for (const file of files) {
      if (!file.isFile() || extname(file.name) !== '.ts') continue

      const filePath = resolve(dirPath, file.name)
      const content  = readFileSync(filePath, 'utf-8')

      jsonArr.push({
        'name': file.name,
        'code': content
      })
    }

    // 写 JSON
    const outPath = resolve(outDir, `${entry.name}.json`)
    writeFileSync(outPath, JSON.stringify(jsonArr, null, 2), 'utf-8')
    dirNames.push(entry.name)
  }
  console.log('✅ TS Playground 已生成 JSON：', dirNames)
  return dirNames
}

function generatePlaygroundJson(outDir: string): string[] {
  const SRC_DIR = 'data/playground'
  mkdirSync(outDir, { recursive: true })

  const folders = readdirSync(SRC_DIR, { withFileTypes: true })
  const dirNames: string[] = []

  for (const entry of folders) {
    if (!entry.isDirectory()) continue

    const dirPath = resolve(SRC_DIR, entry.name)
    const files = readdirSync(dirPath, { withFileTypes: true })

    const jsonArr: { 'name': string; 'code': string; 'type': string }[] = []

    for (const file of files) {
      if (!file.isFile()) continue
      const fileExtname = extname(file.name)
      if (['.html', '.css', '.js', '.ts'].includes(fileExtname)) {
        const filePath = resolve(dirPath, file.name)
        const content  = readFileSync(filePath, 'utf-8')
        jsonArr.push({
          name: file.name,
          code: content,
          type: fileExtname.slice(1)
        })
      }
    }

    // 写 JSON
    const outPath = resolve(outDir, `${entry.name}.json`)
    writeFileSync(outPath, JSON.stringify(jsonArr, null, 2), 'utf-8')
    dirNames.push(entry.name)
  }
  console.log('✅ Playground 已生成 JSON：', dirNames)
  return dirNames
}

function buildRES(isDev: boolean) {
  const outDir = isDev
    ? resolve(DEV_RES_DIR)   // dev 时放在 public，自动挂载到 /
    : resolve(PROD_RES_DIR)     // build 时放在 dist

  mkdirSync(outDir, { recursive: true })

  // 找出所有 md
  const files = fg.sync(`${MD_DIR}/*.md`)
  const name2id: Map<string, number> = new Map()
  const id2name: Map<number, string> = new Map()
  files.forEach((f, i) => {
    const doc = readFileSync(f, 'utf8')
    const dataRes = decodeYamlInMd(doc)
    if (dataRes.meta['可见性'] !== '公开') return
    const tail = f.split(/[/\\]/).pop()! // xxx.md
    const name = tail.split('.')[0]!
    name2id.set(name, i)
    id2name.set(i, name)
  })

  const bodyList: string[] = []
  const list = files.map((f, i) => {
    const name = id2name.get(i)
    if (name === undefined) return null
    const stat = statSync(f)
    const doc = readFileSync(f, 'utf8')
    const dataRes = decodeYamlInMd(doc)
    const data = {
      title: dataRes.meta['标题'] || 'Unknown',
      path: dataRes.meta['路径'] || 'Unknown',
      time: dataRes.meta['时间'] || 'Unknown',
      author: dataRes.meta['作者'] || 'Unknown',
      categories: dataRes.meta['分类'] || '',
      visible: dataRes.meta['可见性'] === '公开'
    }
    const categories = data.categories.split('/').filter(c => c !== '')
    const tags = decodeAllTags(dataRes.body)
    const body = removeTopNLines(dataRes.body, tags.lineNo)
    const body1 = decodeObsidianImages(body)
    const linksData = decodeObsidianLinks(body1)
    const links = Array.from(new Set(linksData.links))
    bodyList.push(linksData.text)
    return {
      id: i,
      title: data.title,
      titlePinYin: pinyin(data.title, { toneType: 'none', nonZh: 'consecutive' }),
      path: data.path,
      author: data.author,
      body: linksData.text,
      categories,
      tags: tags.tags,
      links,
      created: stat.birthtime,
      modified: stat.mtime
    }
  }).filter(i => i !== null)

  const assetFiles = fg.sync(`${MD_DIR}/assets/*`, { onlyFiles: true })
  assetFiles.forEach(f => {
    const tail = (f.split(/[/\\]/).pop()!).replace(/\ /g, '-')
    if (bodyList.findIndex(b => b.includes(tail)) === -1) return
    const dest = resolve(outDir, 'assets', tail) // 自动处理空格/中文
    mkdirSync(resolve(outDir, 'assets'), { recursive: true }) // 再保险一次
    copyFileSync(f, dest)
  })

  const friends = decodeYamlToJson('data/friends.yml')
  const projects = decodeYamlToJson('data/projects.yml')
  const projectsEn = decodeYamlToJson('data/projects-en.yml')
  const about = decodeYamlToJson('data/about.yml')
  const aboutEn = decodeYamlToJson('data/about-en.yml')
  const tsJsonList = generateTsJson(outDir + '/ts-playground')
  const playgroundJsonList = generatePlaygroundJson(outDir + '/playground')

  const json = {
    docs: list,
    friends,
    projects: {
      'zh-CN': projects,
      'en-US': projectsEn
    },
    about: {
      'zh-CN': about,
      'en-US': aboutEn
    },
    tsJsonList,
    playgroundJsonList
  }

  writeFileSync(resolve(outDir, 'RES.json'), JSON.stringify(json, null, isDev ? 2 : 0))

  console.log(`🔄 ${isDev ? 'dev' : 'build'} RES.json (${list.length} items)`)
}

export function copyFiles(): PluginOption {
  return {
    name: 'vite-plugin-copy-404',
    // 构建结束后再复制
    closeBundle() {
      const from1 = resolve('dist/index.html')
      const to1   = resolve('dist/404.html')
      const from2 = resolve('.nojekyll')
      const to2 = resolve('dist/.nojekyll')
      copyFileSync(from1, to1)
      copyFileSync(from2, to2)
      console.log('✅ copy files')
    }
  }
}

export function buildMdRES(): PluginOption {
  return {
    name: 'vite-plugin-build-res',
    // dev 阶段：启动 + 监听
    configureServer(server) {
      buildRES(true)
      server.watcher.add(MD_DIR)
      server.watcher.on('all', (_, path) => {
        if (path.endsWith('.md') || path.endsWith('.yml')) buildRES(true)
      })
    },
    // build 阶段
    closeBundle() {
      buildRES(false)
    }
  }
}
