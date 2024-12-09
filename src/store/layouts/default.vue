<template>
  <div id="main-store-layout">
    <StoreSidebarComponent :is-collapse="isCollapse" />
    <el-scrollbar always>
      <div class="main-container">
        <StoreHeaderComponent @toggle-sidebar="isCollapse = $event" />
        <div class="store-content">
          <slot />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isCollapse = ref(false);
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

$bg-main-content: #f3f3f3;

#main-store-layout {
  .main-container {
    position: relative;
    max-width: calc(100% - 270px);
    min-width: $minWidth;
    width: 100%;
    left: $sideBarWidth;
    min-height: 100vh;
    transition: 0.2s;

    &.active {
      max-width: calc(100% - $widthCollapse);
      left: $widthCollapse;
    }

    &.screen-plans {
      min-width: 1350px;
    }
  }

  .store-content {
    height: calc(100vh - $height-header);
    overflow: auto;
    background: $bg-main-content;
    padding: 20px;
  }

  :deep(.el-scrollbar) {
    .custom-scroll + .el-scrollbar__bar.is-horizontal {
      display: none;
    }
  }

  :deep(.el-scrollbar) {
    .el-scrollbar__bar.is-horizontal {
      z-index: 2050;
    }
  }
}
</style>
