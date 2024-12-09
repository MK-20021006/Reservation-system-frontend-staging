<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :show-close="false"
        :close-on-click-modal="false"
        align-center
      >
        <template #header>
          <div>{{ title }}</div>
          <div v-if="headerName" class="header-name">{{ headerName }}</div>
          <div v-if="isWarningPayment && !title" class="warning-payment">
            <div>{{ $t("payment_failed") }}</div>
            <div>{{ $t("following_reasons") }}</div>
            <div class="warning-payment__item">
              {{ "・" + $t("attempted_multiple") }}
            </div>
            <div class="warning-payment__item">
              {{ "・" + $t("insufficient_balance") }}
            </div>
            <div class="warning-payment__item">
              {{ "・" + $t("incorrect_card") }}
            </div>
            <div class="warning-payment__item">
              {{ "・" + $t("token_has_expired") }}
            </div>
            <div>{{ $t("please_check") }}</div>
          </div>
          <div v-if="isTimeMaintenance" class="warning-payment text-center">
            <div>{{ $t("under_maintenance") }}</div>
            <div>{{ $t("our_customers") }}</div>
            <div>{{ $t("service_resumes") }}</div>
          </div>
          <div v-if="content">{{ content }}</div>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <button-white
              :name="nameCancel"
              :disabled="loading"
              @click="handleClose"
            />
            <button-blue
              v-if="!isHiddenButtonConfirm"
              :name="nameConfirm"
              :loading="loading"
              @click="handleConfirm"
            />
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";

interface Prop {
  dialogVisible: boolean;
  title: string;
  nameCancel?: string;
  nameConfirm?: string;
  width?: string;
  loading?: boolean;
  headerName?: string;
  isWarningPayment?: boolean;
  isTimeMaintenance?: boolean;
  isHiddenButtonConfirm?: boolean;
  content?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  nameCancel: "",
  nameConfirm: "",
  headerName: "",
  width: "32%",
  loading: false,
  isWarningPayment: false,
  isTimeMaintenance: false,
  isHiddenButtonConfirm: false,
  content: "",
});

const { dialogVisible, title, nameConfirm, nameCancel, width, loading } =
  toRefs(props);
const emits = defineEmits(["handleClose", "handleConfirm"]);
const handleClose = () => {
  emits("handleClose");
};

const handleConfirm = () => {
  emits("handleConfirm");
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-overlay) {
    z-index: 2051 !important;
  }
  .header-name {
    margin-top: 20px;
    font-size: 18px;
  }

  :deep(.el-dialog__header) {
    font-size: 18px;
    line-height: 35px;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  .warning-payment {
    font-size: 18px;

    &__item {
      margin-left: 20px;
    }
  }
}
</style>
