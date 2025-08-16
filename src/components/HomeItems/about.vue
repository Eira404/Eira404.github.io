<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import MyBase from './default.vue'

const elfland = useElfland()
const aboutIns = elfland.about
const about = aboutIns.about
</script>

<template>
  <MyBase
    title="About"
    :more="false"
    name="about"
    prompt="More about me"
  >
    <template #main>
      <div class="px-10 pt-1 leading-5 flex flex-col gap-2">
        <p
          v-for="a, i in about"
          :key="i"
          v-html="a"
        />
      </div>
    </template>
  </MyBase>
</template>
