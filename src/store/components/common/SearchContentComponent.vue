<template>
  <div class="search">
    <slot name="form-search" />
  </div>
</template>

<style lang="scss" scoped>
@use "~/../../src/admin/assets/scss/variables.scss" as *;

.search {
  :deep(.el-form--inline .el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    line-height: 40px;
    height: 40px;
  }

  :deep(.el-input) {
    width: 222px;
    height: 40px;
  }

  :deep(.el-select) {
    .el-input {
      width: 170px;
      height: 40px;
    }
  }

  :deep(.el-button) {
    padding: 9px 20px;
    height: 40px;
    margin-bottom: 20px;
    float: right;
    background-color: $menuBg;
    color: $white-color;
    & > span {
      gap: 10px;
    }
  }
}
</style>
