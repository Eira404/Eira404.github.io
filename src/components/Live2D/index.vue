<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ARTILive2D } from '@/core/elfland-addon-live2d/core/models/ARTILive2D'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { AudioAnalyzer } from '@/core/elfland-addon-music-player/core/audio-analyzer'
import { VocalLipSync } from '@/core/elfland-addon-music-player/core/vocal-lipsync'

const props = defineProps({
  pos: {
    default: () => {
      return {
        left: '0',
        top: '0',
        right: 'none',
        bottom: 'none'
      }
    },
    type: Object
  },
  dragable: {
    default: true,
    type: Boolean
  },
  direction: {
    default: 'xy',
    type: String
  }
})

const elfland = useElfland()
const live2d = elfland.live2d
const live2dModel = new ARTILive2D()
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

const currentX = ref('')
const currentY = ref('')
const initialX = ref(0)
const initialY = ref(0)
const dragging = ref(false)

const left = computed(() => currentX.value || props.pos.left)
const right = computed(() => currentX.value !== '' ? 'none' : props.pos.right)
const top = computed(() => currentY.value || props.pos.top)
const bottom = computed(() => currentY.value !== '' ? 'none' : props.pos.bottom)
const useDirection = computed(() => props.direction.toLocaleLowerCase())

const dragStart = (e: MouseEvent) => {
  if (e.target !== canvas.value) return
  if (!props.dragable) return
  initialX.value = e.offsetX
  initialY.value = e.offsetY
  dragging.value = true

  window.addEventListener('mousemove', drag)
  window.addEventListener('mouseup', dragEnd)
}

const drag = (e: MouseEvent) => {
  if (dragging.value && container.value) {
    const width = container.value.getBoundingClientRect().width
    const height = container.value.getBoundingClientRect().height
    const x = e.clientX - initialX.value
    const y = e.clientY - initialY.value
    let cx = Math.max(0, Math.min(x, window.innerWidth - width)).toString() + 'px'
    let cy = Math.max(0, Math.min(y, window.innerHeight - height)).toString() + 'px'
    if (useDirection.value.indexOf('x') === -1) cx = ''
    if (useDirection.value.indexOf('y') === -1) cy = ''
    currentX.value = cx
    currentY.value = cy
    live2dModel.setHitIgnore(true)
  }
}

const dragEnd = () => {
  dragging.value = false

  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', dragEnd)
}

onMounted(async () => {
  if (canvas.value && canvasContainer.value) {
    live2d.show({
      view: canvas.value,
      autoStart: true,
      resizeTo: canvasContainer.value,
      backgroundAlpha: 0
    })
    await live2d.add(live2dModel)
  }
})
onBeforeUnmount(() => {
  live2d.destroy()
})

const analyzer = new AudioAnalyzer({
  // src: '/static/audio/ly.mp3',  // 换成你的音频
  src: '/static/audio/nygs-2.mp3',  // 换成你的音频
  fftSize: 4096,
  kFftSize: 16384,
  smoothingTimeConstant: 0.8,
  crossOrigin: 'anonymous',
  monitorOutput: true,
  volume: 0.05
})

const setParam = (param: string, value: number) => {
  live2dModel.setParameter(param, value)
}

const lipsync = new VocalLipSync(analyzer.ctx, analyzer.src, setParam, {
  // 可按需要微调
  gateDbfs: -55,
  inMinDbfs: -50,
  inMaxDbfs: -15,
  attackMs: 25,
  releaseMs: 110,
  mouthOpenParam: 'ParamMouthOpenY',
  mouthFormParam: 'ParamMouthForm' // 如果没有此参数，可删掉
})

const play = async () => {
  // await analyzer.play()
  // tick()
}

const tick = () => {
  const { mouthOpen, vocal, beat } = lipsync.update()

  // 你可以用 beat 给头部/身体做轻微摆动
  // 例如：ParamAngleZ、ParamBodyAngleZ 等
  const sway = (beat - 0.3) * 0.05 // 小幅度
  live2dModel.setParameter('ParamAngleZ', sway)
  // console.log(mouthOpen, vocal, beat, sway)

  requestAnimationFrame(tick)
}

</script>

<template>
  <div
    ref="container"
    class="live2d-container select-none"
    :style="{
      '--left': left,
      '--right': right,
      '--top': top,
      '--bottom': bottom
    }"
    @mousedown="dragStart"
    @click="play"
  >
    <div
      ref="canvasContainer"
      class="live2d-canvas-container"
    >
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<style>
.live2d-container {
  position: fixed;
  z-index: 999999;
  left: var(--left, none);
  top: var(--top, none);
  right: var(--right, none);
  bottom: var(--bottom, none);
}
.live2d-canvas-container {
  position: relative;
  width: 310px;
  height: 250px;
  /* width: 500px;
  height: 500px*/
}
.live2d-console {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s;
  opacity: 0;
}
.live2d-container:hover .live2d-console {
  transition: opacity 0.3s;
  opacity: 1;
}
</style>
