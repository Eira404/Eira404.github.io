import { ElflandAddon } from '@/core/elfland/core/addon-base'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Link } from './link'
import type { Elfland } from '@/core/elfland/core'
import * as echarts from 'echarts/core'
import { watch, type WatchHandle } from 'vue'

import { GraphChart } from 'echarts/charts'

import {
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  GraphChart as any,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])

export class Links extends ElflandAddon {
  private __linksIsGotten: boolean = false
  private __linksData: Map<number, Link> = new Map()
  private __linksRenderData: { nodes: { id: string, name: string, path: string, category: string}[], links: { source: string, target: string }[]} = {
    nodes: [],
    links: []
  }

  private __chartElement: HTMLDivElement | null = null
  private __myChart: echarts.ECharts | null = null
  private __watchHandleTheme: WatchHandle | null = null
  private __windowResizeFunc: any

  constructor(elfland: Elfland) {
    super(elfland)

    elfland.routerPromise.addCheck(this.check, this)
    this.__windowResizeFunc = this.resize.bind(this)
  }

  logoutCallback(): void {}

  private async check(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationRaw | void> {
    if (this.__linksIsGotten) return
    try {
      await this.__elfland.articles.waitingDataGet
      const articles = this.__elfland.articles.articles.value
      articles.forEach(a => {
        const linkIns = new Link(a.id, a.path, a.title)
        this.__linksData.set(a.id, linkIns)
        this.__linksRenderData.nodes.push({
          id: a.id.toString(),
          name: a.title,
          path: a.path,
          category: 'A'
        })
      })
      articles.forEach(a => {
        const nLink = this.__linksData.get(a.id) as Link
        a.links.forEach(l => {
          const link = this.__linksData.get(l.id)
          if (link) {
            link.in.push(nLink)
            nLink.out.push(link)
            const sid = Math.min(nLink.id, link.id)
            const tid = Math.max(nLink.id, link.id)
            this.__linksRenderData.links.push({
              source: sid.toString(),
              target: tid.toString()
            })
          }
        })
      })
      /** 过滤重复的边 */
      this.__linksRenderData.links = this.__linksRenderData.links.filter((l, i, arr) => {
        return arr.findIndex(l2 => l2.source === l.source && l2.target === l.target) === i
      })
      this.__linksIsGotten = true
    } catch (e) {
      console.error(e)
    }
  }

  getLinks(id: number) {
    return this.__linksData.get(id)
  }

  render(chartElement: HTMLDivElement) {
    this.__chartElement = chartElement
    if (this.__watchHandleTheme) this.__watchHandleTheme.stop()
    this.distory()
    const res = this.renderChart()
    this.__watchHandleTheme = watch(this.__elfland.theme.theme, (newVal) => {
      if (this.__myChart) {
        this.__myChart.dispose()
        this.__myChart = null
      }
      this.renderChart()
    })
    return res
  }

  distory() {
    window.removeEventListener('resize', this.__windowResizeFunc)
    if (this.__myChart) {
      this.__myChart.dispose()
      this.__myChart = null
    }
    if (this.__watchHandleTheme) {
      this.__watchHandleTheme.stop()
    }
  }

  private renderChart() {
    if (this.__chartElement === null) return
    const theme = this.__elfland.theme.theme.value
    const data = this.__linksRenderData
    const option: echarts.EChartsCoreOption = {
      title: {
        text: '关系图谱',
        subtext: '点击结点以跳转文章',
        top: '20px',
        left: '20px'
      },
      tooltip: {
        show: false
      },
      backgroundColor: 'rgba(0, 0, 0, 0)',
      series: [
        {
          type: 'graph',
          layout: 'force', // 使用自定义布局
          symbolSize: 20,
          roam: true,
          label: {
            show: true,
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 12,
            position: 'bottom'
          },
          force: {
            repulsion: 5000
          },
          edgeSymbol: ['none', 'none'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            show: false
          },
          data: data.nodes,
          links: data.links,
          categories: [{ name: 'A', itemStyle: { color: '#4fadff' }}],
          lineStyle: {
            opacity: 0.9,
            width: 2
          },
          emphasis: {
            focus: 'adjacency'
          },
          draggable: true // 允许节点拖动
        }
      ]
    }
    this.__myChart = echarts.init(this.__chartElement, theme === 'light' ? undefined : 'dark')
    this.__myChart.setOption(option)
    this.__myChart.on('click', (params) => {
      if (params.dataType === 'node' && params.data) {
        const data = params.data as { id: number, path: string, name: string}
        this.__elfland.routerPromise.router.push({
          name: 'article',
          params: {
            articlePath: data.path as string
          }
        })
      }
    })
    window.addEventListener('resize', this.__windowResizeFunc)
    return true
  }

  private resize() {
    if (this.__myChart) {
      this.__myChart.resize()
    }
  }
}
