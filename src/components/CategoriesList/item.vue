<script setup lang="ts" name="CategoriesItem">
defineOptions({
  name: 'CategoriesItem'
})
import { Category } from '@/core/elfland-addon-categories/core/category'
import articleItem from './article.vue'
import { ElIcon } from 'element-plus'
import { FolderAdd, FolderRemove } from '@element-plus/icons-vue'

const props = defineProps({
  category:{
    type: Category,
    required: true
  }
})
const category = props.category
</script>

<template>
  <div class="flex gap-1 flex-col text-lg">
    <div class="flex gap-2 items-center">
      <div
        class="select-none flex cursor-pointer"
        @click="category.fold = !category.fold"
      >
        <el-icon
          v-if="category.fold"
          :size="20"
        >
          <FolderAdd />
        </el-icon>
        <el-icon
          v-else
          :size="20"
        >
          <FolderRemove />
        </el-icon>
      </div>
      <router-link
        class="hover:text-moonlight-500"
        :to="{ name: 'categories', query: { category: category.path.slice(1) }}"
      >
        {{ category.category }}
      </router-link>
    </div>
    <div
      v-show="!category.fold"
      class="pl-4 flex gap-1 flex-col"
    >
      <CategoriesItem
        v-for="c in category.categories"
        :key="c.category"
        :category="c"
      />
      <div class="flex gap-1 flex-col">
        <articleItem
          v-for="a in category.selfArts"
          :key="a.id"
          :article="a"
        />
      </div>
    </div>
  </div>
</template>
