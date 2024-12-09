<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">
        <IconHome />
        <span class="el-breadcrumb__root">{{ $t("site_name") }}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }"
        >promotion management
      </el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
$color-border: #e7e7e7;
$bg-breadcrumb: #ffffff;
$color-breadcrumb-text: #606266;
$color-breadcrumb-link: #909399;

.breadcrumb {
  padding: 0 12.5%;
  border: 1px solid $color-border;
  background-color: $bg-breadcrumb;

  :deep(.el-breadcrumb) {
    display: flex;
    height: 56px;

    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: $color-breadcrumb-text;

        &.is-link {
          color: $color-breadcrumb-link;
          font-weight: 400;
        }
      }

      .el-breadcrumb__root {
        margin-left: 15px;
        font-weight: 500;
        line-height: 22px;
        vertical-align: top;
      }
    }
  }
}
</style>
