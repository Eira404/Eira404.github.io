<script setup lang="ts">
import beautify from 'js-beautify'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { ayuLight } from 'thememirror'
import { computed, ref } from 'vue'
import { debounce } from '@/core/elfland/utils'
import { useElfland } from '@/core/elfland'
import { ElButton } from 'element-plus'

const elfland = useElfland()
const theme = elfland.theme

type LangDict = {
  html: any
  css: any
  js: any
  ts: any
}
type LangKeys = keyof LangDict

const props = defineProps({
  title: {
    default: '',
    type: String
  },
  lang: {
    default: 'html',
    validator: (val: string) => {
      const allowedTypes = ['html', 'css', 'js', 'ts']
      return allowedTypes.indexOf(val) !== -1
    },
    type: String
  }
})

const code = defineModel('code', {
  required: true,
  type: String
})

const emit = defineEmits<{
  change: []
}>()
defineExpose({ format, clear })

const dict: LangDict = {
  html: [html(), beautify.html],
  css: [css(), beautify.css],
  js: [javascript({ jsx: false, typescript: false }), beautify.js],
  ts: [javascript({ jsx: false, typescript: true }), beautify.js]
}

const codemirror = ref()
const extensions = computed(() => [
  dict[props.lang as LangKeys][0],
  theme.theme.value === 'light' ? ayuLight : oneDark
])
const formatter = dict[props.lang as LangKeys][1]

const codeChange = debounce(() => {
  emit('change')
}, 600)

function format() {
  const res = formatter(code.value, {
    'indent_size': '2',
    'indent_char': ' ',
    'max_preserve_newlines': '1',
    'preserve_newlines': true,
    'keep_array_indentation': false,
    'break_chained_methods': false,
    'indent_scripts': 'normal',
    'brace_style': 'collapse',
    'space_before_conditional': true,
    'unescape_strings': false,
    'jslint_happy': false,
    'end_with_newline': false,
    'wrap_line_length': '0',
    'indent_inner_html': false,
    'comma_first': false,
    'e4x': false,
    'indent_empty_lines': false
  })
  code.value = res
}

function clear() {
  code.value = ''
}

</script>

<template>
  <div class="h-full">
    <div class="h-8 px-4 flex justify-between items-center">
      <div class="flex items-center">
        <slot name="header-left">
          {{ title }}
        </slot>
      </div>
      <div class="flex gap-2 items-center">
        <slot name="header-right" />
        <el-button
          plain
          size="small"
          @click="format"
        >Format</el-button>
        <el-button
          plain
          size="small"
          @click="clear"
        >Clear</el-button>
      </div>
    </div>
    <div
      class="cm-container"
      style="height: calc(100% - 32px);"
    >
      <Codemirror
        ref="codemirror"
        v-model="code"
        :style="{ height: '100%', width: '100%' }"
        class="blog-codemirror"
        :extensions="extensions"
        :indent-with-tab="true"
        :tab-size="2"
        @change="codeChange"
      />
    </div>
  </div>
</template>
