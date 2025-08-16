<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { Tag } from '@/core/elfland-addon-tags/core/tag'
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: Tag,
    required: true
  }
})

const elfland = useElfland()
const theme = elfland.theme

type RGBColor = { r: number; g: number; b: number };

/**
 * 根据数值范围计算渐变颜色
 * @param min 最小值
 * @param max 最大值
 * @param startColor 起始颜色（十六进制格式，如 "#FF0000"）
 * @param endColor 结束颜色（十六进制格式，如 "#00FF00"）
 * @param currentValue 当前值
 * @returns 计算后的颜色（十六进制格式）
 */
function calculateColor(
  min: number,
  max: number,
  startColor: string,
  endColor: string,
  currentValue: number
): string {
  // 边界检查
  if (currentValue <= min) return startColor
  if (currentValue >= max) return endColor

  // 防止除零错误
  if (min === max) return startColor

  // 将十六进制颜色转换为RGB对象
  function hexToRgb(hex: string): RGBColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) {
      throw new Error(`无效的颜色格式: ${hex}`)
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }

  // 将RGB对象转换为十六进制颜色
  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // 解析颜色
  const startRGB = hexToRgb(startColor)
  const endRGB = hexToRgb(endColor)

  // 计算当前值在范围内的比例（0到1之间）
  const ratio = (currentValue - min) / (max - min)

  // 线性插值计算RGB值
  const r = startRGB.r + (endRGB.r - startRGB.r) * ratio
  const g = startRGB.g + (endRGB.g - startRGB.g) * ratio
  const b = startRGB.b + (endRGB.b - startRGB.b) * ratio

  return rgbToHex(r, g, b)
}

/**
 * 根据数值范围计算渐变的字体大小
 * @param min        最小值
 * @param max        最大值
 * @param startSize  起始字体大小（px）
 * @param endSize    结束字体大小（px）
 * @param currentValue 当前值
 * @returns          计算后的字体大小（px）
 */
function calculateFontSize(
  min: number,
  max: number,
  startSize: number,
  endSize: number,
  currentValue: number
): number {
  // 边界处理
  if (currentValue <= min) return startSize
  if (currentValue >= max) return endSize

  // 防止除零
  if (min === max) return startSize

  // 线性插值
  const ratio = (currentValue - min) / (max - min)
  return startSize + (endSize - startSize) * ratio
}

const color = computed(() => {
  const t = theme.theme.value
  if (t === 'light') return calculateColor(1, 40, '#4a5565', '#4fadff', props.tag.size)
  else return calculateColor(1, 40, '#99a1af', '#4fadff', props.tag.size)
})
const size = computed(() => {
  return calculateFontSize(1, 40, 16, 32, props.tag.size) + 'px'
})
</script>

<template>
  <router-link
    :to="{ name: 'tags', query: {tag: tag.tag} }"
    :style="{color: color, fontSize: size}"
    class="p-2 hover:!text-moonlight-500 hover:underline transition-all duration-150"
  >
    <span>
      {{ tag.tag }}
    </span>
  </router-link>
</template>
