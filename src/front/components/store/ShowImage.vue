<template>
  <div>
    <client-only>
      <el-dialog :model-value="dialogVisible" :before-close="handleClose">
        <el-image width="100%" :src="url" />
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";

interface Prop {
  url: string;
  dialogVisible: boolean;
}

const props = defineProps<Prop>();
const emits = defineEmits(["handleClose", "update:dialogVisible"]);

const { dialogVisible } = toRefs(props);

const handleClose = () => {
  emits("handleClose");
  emits("update:dialogVisible", false);
};
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "element-plus/theme-chalk/src/common/var" as *;

:deep(.el-dialog) {
  --el-dialog-width: 50%;
  --el-dialog-margin-top: 15vh;
  --el-dialog-bg-color: var(--el-bg-color);
  --el-dialog-box-shadow: var(--el-box-shadow);
  --el-dialog-title-font-size: var(--el-font-size-large);
  --el-dialog-content-font-size: 14px;
  --el-dialog-font-line-height: var(--el-font-line-height-primary);
  --el-dialog-padding-primary: 20px;
  --el-dialog-border-radius: var(--el-border-radius-small);
  position: relative;
  margin: var(--el-dialog-margin-top, 15vh) auto 50px;
  background: var(--el-dialog-bg-color);
  border-radius: var(--el-dialog-border-radius);
  box-shadow: var(--el-dialog-box-shadow);
  box-sizing: border-box;
  width: var(--el-dialog-width, 50%);

  .el-dialog__header {
    .el-dialog__headerbtn {
      top: 0;
    }
  }

  .el-dialog__body {
    padding: 20px 20px;

    .el-image {
      width: 100%;

      img {
        object-fit: contain;
        height: auto;
        max-height: 600px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;

    .el-dialog__body {
      padding: 20px 20px;

      .el-image {
        width: 100%;
        max-height: 600px;

        img {
          object-fit: contain;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;
    margin: 25vh auto;

    .el-dialog__body {
      padding: 20px 20px;

      .el-image {
        width: 100%;
        max-height: 400px;

        img {
          height: 400px;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
