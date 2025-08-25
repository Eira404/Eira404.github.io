<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Direction = 'horizontal' | 'vertical'

const props = withDefaults(defineProps<{
  /** 分割方向：horizontal=左右分栏，vertical=上下分栏 */
  direction?: Direction
  /** 初始比例（左/上 面板占比），0~1 */
  modelValue?: number
  /** 左/上 面板的最小尺寸（px） */
  minA?: number
  /** 右/下 面板的最小尺寸（px） */
  minB?: number
  /** 分隔条粗细（px） */
  gutter?: number
  /** 是否禁用拖动 */
  disabled?: boolean
}>(), {
  direction: 'horizontal',
  modelValue: 0.5,
  minA: 80,
  minB: 80,
  gutter: 4,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [number],
  'change': [number],
  'drag-start': [],
  'drag-end': []
}>()

const container = ref<HTMLElement | null>(null)
const ratio = ref(Math.min(0.95, Math.max(0.05, props.modelValue)))
const dragging = ref(false)

const isHorizontal = computed(() => props.direction === 'horizontal')
const containerClass = computed(() => ({
  'split-container': true,
  'is-horizontal': isHorizontal.value,
  'is-vertical': !isHorizontal.value,
  'is-dragging': dragging.value
}))

const paneAStyle = computed(() => {
  // 使用 flex-basis 百分比可以在容器尺寸改变时保持比例
  return {
    flexBasis: `calc(${ratio.value * 100}% - ${props.gutter / 2}px)`
  }
})
const paneBStyle = computed(() => {
  return {
    flexBasis: `calc(${(1 - ratio.value) * 100}% - ${props.gutter / 2}px)`
  }
})
const gutterStyle = computed(() => ({
  // 让分隔条“撑开”到正确粗细
  [isHorizontal.value ? 'width' : 'height']: `${props.gutter}px`,
  [isHorizontal.value ? 'height' : 'width']: '100%',
  cursor: isHorizontal.value ? 'col-resize' : 'row-resize'
}))

let removeWindowListeners: (() => void) | null = null

function onGutterPointerDown(e: PointerEvent) {
  if (props.disabled) return
  if (!container.value) return
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  emit('drag-start')

  const rect = container.value.getBoundingClientRect()
  const total = isHorizontal.value ? rect.width : rect.height
  const minA = props.minA ?? 0
  const minB = props.minB ?? 0

  const move = (ev: PointerEvent) => {
    if (!container.value) return
    const pos = isHorizontal.value ? ev.clientX - rect.left : ev.clientY - rect.top
    // 将像素位置转为比例，并考虑最小尺寸
    const minRatio = Math.max(minA / total, 0)
    const maxRatio = 1 - Math.max(minB / total, 0)
    const next = Math.min(maxRatio, Math.max(minRatio, pos / total))
    if (next !== ratio.value) {
      ratio.value = next
      emit('update:modelValue', ratio.value)
    }
  }

  const up = () => {
    dragging.value = false
    emit('drag-end')
    emit('change', ratio.value)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    removeWindowListeners = null
  }

  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerup', up, { passive: true })
  removeWindowListeners = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}

onMounted(() => {
  // 同步外部 v-model 初值
  ratio.value = clamp(props.modelValue)
})
onBeforeUnmount(() => {
  removeWindowListeners?.()
})

function clamp(v: number) {
  return Math.min(0.98, Math.max(0.02, v))
}
</script>

<template>
  <div
    ref="container"
    :class="containerClass"
    role="group"
    aria-label="Split Pane"
  >
    <div
      class="pane pane-a"
      :style="paneAStyle"
    >
      <slot name="a" />
    </div>

    <div
      class="gutter bg-bg-dark/20 dark:bg-bg/20"
      :style="gutterStyle"
      :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
      :aria-grabbed="dragging ? 'true' : 'false'"
      tabindex="0"
      @pointerdown="onGutterPointerDown"
      @keydown.prevent.stop="
        (e) => {
          if (disabled) return
          const step = e.shiftKey ? 0.05 : 0.01
          if (isHorizontal && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            const delta = e.key === 'ArrowLeft' ? -step : step
            const next = clamp(ratio + delta)
            ratio = next
            $emit('update:modelValue', ratio)
            $emit('change', ratio)
          } else if (!isHorizontal && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            const delta = e.key === 'ArrowUp' ? -step : step
            const next = clamp(ratio + delta)
            ratio = next
            $emit('update:modelValue', ratio)
            $emit('change', ratio)
          }
        }
      "
    />

    <div
      class="pane pane-b"
      :style="paneBStyle"
    >
      <slot name="b" />
    </div>
  </div>
</template>

<style scoped>
.split-container {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  user-select: none;
  /* 平滑拖动时避免内容被选中 */
}

.split-container.is-horizontal {
  flex-direction: row;
}

.split-container.is-vertical {
  flex-direction: column;
}

.pane {
  min-width: 0;
  min-height: 0;
  overflow: auto; /* 让面板自身可滚动 */
  flex-grow: 0;
  flex-shrink: 0;
}

.gutter {
  flex: 0 0 auto;
  touch-action: none; /* 允许精确的指针事件 */
  display: inline-block;
  position: relative;
  outline: none;
}
.gutter::after {
  /* 中线视觉提示（不设颜色，继承当前色） */
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 2px;
  height: 60%;
}
.split-container.is-horizontal .gutter::after {
  height: 60%;
}
.split-container.is-vertical .gutter::after {
  width: 60%;
  height: 2px;
}

.split-container.is-dragging {
  cursor: col-resize;
}
.split-container.is-dragging.is-vertical {
  cursor: row-resize;
}
</style>
