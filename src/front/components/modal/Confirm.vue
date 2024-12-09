<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :title="title"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="showClose"
      >
        <slot name="body" />
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";

interface Prop {
  dialogVisible: boolean;
  title?: string;
  nameCancel?: string;
  nameConfirm?: string;
  width?: string;
  loading?: boolean;
  showClose?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  nameCancel: "",
  nameConfirm: "",
  width: "30%",
  loading: false,
  showClose: true,
});
const { dialogVisible, title, width, loading } = toRefs(props);
const emits = defineEmits(["handleClose"]);
const handleClose = () => {
  emits("handleClose");
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.el-dialog__body) {
  padding: 0;
  border-top: 1px solid $gray-50;
  margin-top: 14px;
}

:deep(.el-dialog__header) {
  .el-dialog__headerbtn {
    top: 0;
  }
}
</style>
