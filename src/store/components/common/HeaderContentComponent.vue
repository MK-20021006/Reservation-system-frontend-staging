<template>
  <div class="header-content d-flex justify-content-between align-items-center">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="group-button d-flex">
      <slot name="button" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/../../src/admin/assets/scss/variables.scss" as *;

.header-content {
  --bg-button-add: #529b2e;
  height: 40px;
  margin-bottom: 10px;

  .title {
    font-size: 20px;
  }
  .group-button {
    gap: 10px;

    :deep(.el-button) {
      height: 40px;
      padding: 9px 20px;
      font-weight: 700;

      &:hover {
        border-color: transparent !important;
        opacity: 0.8;
      }

      span {
        gap: 4px;
      }
    }
  }
}
</style>
