<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="isShowCancelPlan"
        :width="width"
        :before-close="handleCloseCancelPlan"
        :title="title"
        :show-close="false"
        :close-on-click-modal="false"
        align-center
      >
        <div class="option-radio-box">
          <el-radio-group v-model="optionCancel">
            <!--            <el-radio :label="true">{{ $t("cancel_now") }}</el-radio>-->
            <el-radio :label="false">{{ $t("cancel_deadline") }}</el-radio>
          </el-radio-group>
          <!--          <div v-if="optionCancel" class="option-description">-->
          <!--            {{ $t("cancel_now_description") }}-->
          <!--          </div>-->
          <div class="option-description">
            {{ $t("cancel_deadline_description") }}
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <button-white
              :name="$t('button.cancel')"
              @click="handleCloseCancelPlan"
            />
            <button-blue
              :name="$t('button.confirm')"
              :loading="loading"
              @click="handleCancelPlan"
            />
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";

interface Prop {
  isShowCancelPlan: boolean;
  title: string;
  width?: string;
  loading?: boolean;
  loadingCancelNow?: boolean;
}

const optionCancel = ref(false);
const props = withDefaults(defineProps<Prop>(), {
  isShowCancelPlan: false,
  title: "",
  width: "30%",
  loading: false,
  loadingCancelNow: false,
});
const { isShowCancelPlan, title, width, loading } = toRefs(props);
const emits = defineEmits(["handleCloseCancelPlan", "handleCancelPlan"]);
const handleCloseCancelPlan = () => {
  emits("handleCloseCancelPlan");
};

const handleCancelPlan = () => {
  emits("handleCancelPlan", optionCancel.value);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.modal-dialog {
  .option-radio-box {
    padding: 20px;

    .option-description {
      margin-top: 20px;
      color: $black-80;
    }
  }

  :deep(.el-dialog) {
    .el-dialog__header {
      font-weight: 400;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
