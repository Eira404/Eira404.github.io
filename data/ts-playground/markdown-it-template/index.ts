import TemplateForTest from './TemplateForTest.ts'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

TemplateForTest.forEach(f => {
  md.use(f)
})

const doc =
`
{{template-name-1|warning content|type=warning}}

{{template-name-1|warning content}}

{{template-name-2|content|chars=a,b,c,d,e|color=red}}

{{template-name-3|content|a,b,c,d,e|red}}

{{template-name-4|chars=a,b,c,d,e|color=red}}
`

const res = md.render(doc)

console.log(res)
