<script setup lang="ts">
import { useElfland } from '@/core/elfland'
import { ElScrollbar } from 'element-plus'
import { ElIcon } from 'element-plus'
import links from './links.vue'
import tags from './tags.vue'
import categories from './categories.vue'
import { Back, Collection, Link, PriceTag, Right, Connection } from '@element-plus/icons-vue'
import { ref } from 'vue'

const elfland = useElfland()
const articleIns = elfland.article

const article = articleIns.article
if (article.value === null) throw new Error('文章不存在')
const activeName = ref('in')

</script>

<template>
  <div class="pt-18 h-full">
    <div class="h-full">
      <div class="flex w-full items-center justify-center">
        <router-link
          class="flex cursor-pointer items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out"
          :to="{ name: 'links'}"
          title="文章关系图谱"
        >
          <el-icon :size="24"><Connection /></el-icon>
        </router-link>
        <div
          class="flex cursor-pointer items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out"
          title="反向链接"
          :class="{ 'text-moonlight-500': activeName === 'in' }"
          @click="activeName = 'in'"
        >
          <div class="w-[24px] h-[24px] relative block">
            <el-icon :size="24"><Link /></el-icon>
            <el-icon
              :size="12"
              class="!absolute left-[14px] bottom-[-2px]"
            ><Back /></el-icon>
          </div>
        </div>
        <div
          class="flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out"
          title="出链"
          :class="{ 'text-moonlight-500': activeName === 'out' }"
          @click="activeName = 'out'"
        >
          <div class="w-[24px] h-[24px] relative block">
            <el-icon :size="24"><Link /></el-icon>
            <el-icon
              :size="12"
              class="!absolute left-[14px] bottom-[-2px]"
            ><Right /></el-icon>
          </div>
        </div>
        <div
          class="flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out"
          title="标签"
          :class="{ 'text-moonlight-500': activeName === 'tags' }"
          @click="activeName = 'tags'"
        >
          <el-icon :size="24"><PriceTag /></el-icon>
        </div>
        <div
          class="flex cursor-pointer relative items-center justify-center p-3 hover:text-moonlight-500 transition-all duration-150 ease-in-out"
          title="分类"
          :class="{ 'text-moonlight-500': activeName === 'categories' }"
          @click="activeName = 'categories'"
        >
          <el-icon :size="24"><Collection /></el-icon>
        </div>
      </div>
      <el-scrollbar height="100%">
        <div class="p-12 pt-8">
          <links
            v-if="activeName === 'in' "
            :in="true"
          />
          <links
            v-else-if="activeName === 'out' "
            :in="false"
          />
          <tags v-else-if="activeName === 'tags' " />
          <categories v-else-if="activeName === 'categories' " />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
