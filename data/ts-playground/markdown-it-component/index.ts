import ComponentForTest from './ComponentForTest.ts'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

ComponentForTest.forEach(f => {
  md.use(f)
})

const doc =
`
{|classify|classifies=中文,English,Français
|-
你好世界！
|-
Hello world!
|-
Bonjour le monde!
|}
`

const res = md.render(doc)

console.log(res)
