<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :before-close="handleClose"
        :show-close="false"
        :title="$t('sms_target_transmission')"
        :close-on-click-modal="false"
        align-center
      >
        <template #default>
          <div class="sms-body">
            <el-radio-group v-model="formData.pack_sms">
              <div class="sms-body__item">
                <div class="option-checkbox">
                  <div class="option-checkbox__item">
                    <el-radio :label="BUY_SMS_100" class="radio-check-plans"
                      >{{ $t("month") }} {{ BUY_SMS_100 }}
                      {{ $t("through") }}(@{{
                        priceDisplay(
                          formatPriceFromMath(dataSms._100 / BUY_SMS_100, 2)
                        )
                      }}) {{ priceDisplay(dataSms._100)
                      }}{{ $t("yen") }}</el-radio
                    >
                    <div class="space-item"></div>
                    <el-divider class="space-vertical" direction="vertical" />
                    <div class="auto-renew">
                      <div>{{ $t("auto_updating") }}</div>
                      <div class="space-item"></div>
                      <el-radio-group v-model="formData.auto_renew_sms_100">
                        <el-radio :label="AUTO_RENEW.TRUE">{{
                          $t("do")
                        }}</el-radio>
                        <el-radio :label="AUTO_RENEW.FALSE">{{
                          $t("do_not")
                        }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="date-option">
                    {{ $t("end_date") }}: {{ endOfMonth }}
                  </div>
                </div>
              </div>
              <div class="sms-body__item">
                <div class="option-checkbox">
                  <div class="option-checkbox__item">
                    <el-radio :label="BUY_SMS_300" class="radio-check-plans"
                      >{{ $t("month") }} {{ BUY_SMS_300 }}
                      {{ $t("through") }}(@{{
                        priceDisplay(
                          formatPriceFromMath(dataSms._300 / BUY_SMS_300, 2)
                        )
                      }}) {{ priceDisplay(dataSms._300)
                      }}{{ $t("yen") }}</el-radio
                    >
                    <div class="space-item"></div>
                    <el-divider class="space-vertical" direction="vertical" />
                    <div class="auto-renew">
                      <div>{{ $t("auto_updating") }}</div>
                      <div class="space-item"></div>
                      <el-radio-group v-model="formData.auto_renew_sms_300">
                        <el-radio :label="AUTO_RENEW.TRUE">{{
                          $t("do")
                        }}</el-radio>
                        <el-radio :label="AUTO_RENEW.FALSE">{{
                          $t("do_not")
                        }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="date-option">
                    {{ $t("end_date") }}: {{ endOfMonth }}
                  </div>
                </div>
              </div>
              <div class="sms-body__item">
                <div class="option-checkbox">
                  <div class="option-checkbox__item">
                    <el-radio :label="BUY_SMS_500" class="radio-check-plans"
                      >{{ $t("month") }} {{ BUY_SMS_500 }}
                      {{ $t("through") }}(@{{
                        priceDisplay(
                          formatPriceFromMath(dataSms._500 / BUY_SMS_500, 2)
                        )
                      }}) {{ priceDisplay(dataSms._500)
                      }}{{ $t("yen") }}</el-radio
                    >
                    <div class="space-item"></div>
                    <el-divider class="space-vertical" direction="vertical" />
                    <div class="auto-renew">
                      <div>{{ $t("auto_updating") }}</div>
                      <div class="space-item"></div>
                      <el-radio-group v-model="formData.auto_renew_sms_500">
                        <el-radio :label="AUTO_RENEW.TRUE">{{
                          $t("do")
                        }}</el-radio>
                        <el-radio :label="AUTO_RENEW.FALSE">{{
                          $t("do_not")
                        }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="date-option">
                    {{ $t("end_date") }}: {{ endOfMonth }}
                  </div>
                </div>
              </div>
              <div class="sms-body__item">
                <div class="option-checkbox">
                  <div class="option-checkbox__item">
                    <el-radio :label="BUY_SMS_1000" class="radio-check-plans"
                      >{{ $t("month") }} {{ BUY_SMS_1000 }}
                      {{ $t("through") }}(@{{
                        priceDisplay(
                          formatPriceFromMath(dataSms._1000 / BUY_SMS_1000, 2)
                        )
                      }}) {{ priceDisplay(dataSms._1000)
                      }}{{ $t("yen") }}</el-radio
                    >
                    <div class="space-item"></div>
                    <el-divider class="space-vertical" direction="vertical" />
                    <div class="auto-renew">
                      <div>{{ $t("auto_updating") }}</div>
                      <div class="space-item"></div>
                      <el-radio-group v-model="formData.auto_renew_sms_1000">
                        <el-radio :label="AUTO_RENEW.TRUE">{{
                          $t("do")
                        }}</el-radio>
                        <el-radio :label="AUTO_RENEW.FALSE">{{
                          $t("do_not")
                        }}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="date-option">
                    {{ $t("end_date") }}: {{ endOfMonth }}
                  </div>
                </div>
              </div>
            </el-radio-group>
          </div>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <button-white
              :name="$t('button.cancel')"
              :disabled="loading"
              @click="handleClose"
            />
            <button-blue
              :name="$t('button.buy_sms')"
              :loading="loading"
              @click="handleBuySms"
            />
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";
import { AUTO_RENEW } from "~/../../src/shared/constants/plan";
import priceDisplay from "~/../../src/shared/utils/price";
import {
  BUY_SMS_1000,
  BUY_SMS_500,
  BUY_SMS_300,
  BUY_SMS_100,
} from "~/../../src/shared/constants";
import moment from "moment";

import { formatPriceFromMath } from "~/../../src/shared/utils";
interface Prop {
  dialogVisible: boolean;
  title: string;
  dataSms?: any;
  packageUsed?: any;
  loading?: boolean;
}
const endOfMonth = moment().endOf("month").format("YYYY年MM月DD日");

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  dataSms: [],
  packageUsed: {},
  loading: false,
});
const { dialogVisible, loading, dataSms, packageUsed } = toRefs(props);
const formData = reactive({
  pack_sms: packageUsed.value?.pack ? packageUsed.value?.pack : BUY_SMS_100,
  auto_renew_sms_100: AUTO_RENEW.TRUE,
  auto_renew_sms_300: AUTO_RENEW.FALSE,
  auto_renew_sms_500: AUTO_RENEW.FALSE,
  auto_renew_sms_1000: AUTO_RENEW.FALSE,
});
const formDataSubmit = {
  pack: 0,
  auto_renew: AUTO_RENEW.FALSE,
};
const dialogVisibleConfirm = ref(false);
const emits = defineEmits(["handleClose", "handleBuySms"]);
const handleClose = () => {
  dialogVisibleConfirm.value = false;
  resetForm();
  emits("handleClose");
};

const resetForm = () => {
  formData.pack_sms = 0;
  formData.auto_renew_sms_100 = AUTO_RENEW.TRUE;
  formData.auto_renew_sms_300 = AUTO_RENEW.FALSE;
  formData.auto_renew_sms_500 = AUTO_RENEW.FALSE;
  formData.auto_renew_sms_1000 = AUTO_RENEW.FALSE;
};
const handleBuySms = () => {
  if (formData.pack_sms === BUY_SMS_100) {
    formDataSubmit.pack = formData.pack_sms;
    formDataSubmit.auto_renew = formData.auto_renew_sms_100;
  } else if (formData.pack_sms === BUY_SMS_300) {
    formDataSubmit.pack = formData.pack_sms;
    formDataSubmit.auto_renew = formData.auto_renew_sms_300;
  } else if (formData.pack_sms === BUY_SMS_500) {
    formDataSubmit.pack = formData.pack_sms;
    formDataSubmit.auto_renew = formData.auto_renew_sms_500;
  } else if (formData.pack_sms === BUY_SMS_1000) {
    formDataSubmit.pack = formData.pack_sms;
    formDataSubmit.auto_renew = formData.auto_renew_sms_1000;
  }
  emits("handleBuySms", formDataSubmit);
};

onMounted(() => {
  if (
    formData.pack_sms === BUY_SMS_100 &&
    packageUsed.value?.auto_renew !== null &&
    packageUsed.value?.auto_renew !== undefined
  ) {
    formData.auto_renew_sms_100 = packageUsed.value?.auto_renew;
  } else if (
    formData.pack_sms === BUY_SMS_300 &&
    packageUsed.value?.auto_renew !== null &&
    packageUsed.value?.auto_renew !== undefined
  ) {
    formData.auto_renew_sms_300 = packageUsed.value?.auto_renew;
  } else if (
    formData.pack_sms === BUY_SMS_500 &&
    packageUsed.value?.auto_renew !== null &&
    packageUsed.value?.auto_renew !== undefined
  ) {
    formData.auto_renew_sms_500 = packageUsed.value?.auto_renew;
  } else if (
    formData.pack_sms === BUY_SMS_1000 &&
    packageUsed.value?.auto_renew !== null &&
    packageUsed.value?.auto_renew !== undefined
  ) {
    formData.auto_renew_sms_1000 = packageUsed.value?.auto_renew;
  }
});
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-overlay) {
    z-index: 2051 !important;
  }

  .text-confirm-buy {
    font-size: 18px;
  }

  .sms-body {
    margin: 25px;

    .sms-body__item {
      margin-bottom: 25px;
    }
  }

  .space-item,
  .space-vertical {
    margin: 0 25px;
  }

  .option-checkbox,
  .option-checkbox__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .auto-renew {
      display: flex;
      align-items: center;
    }
  }

  .radio-check-plans {
    width: 180px;
  }

  :deep(.el-dialog) {
    .el-dialog__header {
      font-weight: 400;
    }

    .el-dialog__body {
      padding: 0;
    }
  }

  :deep(.el-radio-group) {
    display: unset;
    font-size: unset;
  }
}
</style>
