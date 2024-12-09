<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="$t('label_qr_code')"
    :width="width"
    align-center
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="box-qr__code">
      <el-image :src="lineQrCode"> </el-image>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <button-white :name="$t('button.cancel')" @click="handleClose" />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  lineQrCode?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "80%",
  lineQrCode: "",
});

const { dialogVisible } = toRefs(props);
const emits = defineEmits(["handleCloseView"]);
const handleClose = () => {
  emits("handleCloseView");
};
</script>

<style lang="scss" scoped>
.box-qr__code .el-image {
  width: 100%;
}
.qr-code__label {
  font-weight: bold;
  margin-bottom: 15px;
  align-items: center;

  svg {
    margin-right: 10px;
  }
}
</style>
