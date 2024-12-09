<template>
  <div class="screen-layout">
    <slot name="head" />
    <slot name="header-content" />
    <el-scrollbar always class="scroll-content">
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-scrollbar>
    <slot name="footer" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

.screen-layout {
  height: 100%;

  :deep(.el-scrollbar.scroll-content) {
    background: #ffffff;
    height: calc(100% - 50px - 72px);

    .el-scrollbar__view {
      height: 100%;
    }

    & > .el-scrollbar__bar.is-horizontal {
      display: none;
    }
  }
}

.content {
  background-color: $white-color;
  height: 100%;
  padding: 20px 20px 0 20px;
}

:deep(.footer) {
  display: flex;
  flex-direction: column;

  &.divider:before {
    content: "";
    width: 100%;
    display: block;
    border-top: 1px solid #0000001a;
  }

  .group-button {
    background-color: $white-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    height: 72px;
  }
}
</style>
