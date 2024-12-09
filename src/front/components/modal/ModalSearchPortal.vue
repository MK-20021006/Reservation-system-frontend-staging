<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :align-center="true"
      >
        <slot name="body" />
        <template #footer>
          <slot name="footer" />
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "30%",
});
const { dialogVisible, width } = toRefs(props);
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-dialog) {
    width: 450px;
    .el-dialog__header {
      font-weight: 400;
      padding: 10px 20px;
      .el-dialog__title {
        font-size: 16px;
      }
    }

    .el-dialog__footer {
      padding-top: 20px;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
