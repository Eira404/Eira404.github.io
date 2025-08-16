<script setup lang="ts">
import MyHeader from './Header/index.vue'
import MyFooter from './Footer/index.vue'
import { ElScrollbar } from 'element-plus'

</script>

<template>
  <div>
    <div class="sticky top-0 z-10 w-full box-content">
      <div class="h-14">
        <MyHeader />
      </div>
    </div>
    <div class="w-[340px] fixed top-0 bottom-0 left-0 h-full">
      <slot name="left" />
    </div>
    <main class="pl-[340px] block">
      <div class="flex w-full">
        <div style="width: calc(100% - 340px);">
          <slot name="main" />
        </div>
        <div class="w-[340px]">
          <div
            style="height: calc(100vh - 56px);"
            class="sticky top-16"
          >
            <el-scrollbar height="100%">
              <slot name="right" />
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div>
        <MyFooter />
      </div>
    </main>
  </div>
</template>
