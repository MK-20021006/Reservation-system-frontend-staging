<template>
  <div class="setting-payment-card">
    <connect-template
      :is-loading-connect="isLoadingConnect"
      :is-loading-save="isLoadingSave"
      :is-hidden-button-connect="true"
      :is-hidden-button-save="statusPayment"
      @save-data="handleSave(_formRef)"
    >
      <template #connect-type>
        <div v-if="!statusPayment" class="setting-card-content">
          <div class="card-information">
            <div class="title">{{ $t("booking.payment_method") }}</div>
            <div class="card-list">
              <VisaCard class="card-icon" />
              <MasterCard class="card-icon" />
              <JCBCard class="card-icon" />
              <AmericanExpressCard class="card-icon" />
              <DinnerClubCard class="card-icon" />
            </div>
          </div>

          <el-form
            ref="_formRef"
            class="data-form"
            :model="formDataCard"
            :rules="paymentRules"
            require-asterisk-position="right"
            label-position="left"
            :inline-message="true"
          >
            <div>
              <div class="label-text required-field">
                {{ $t("full_name_kanji") }}
              </div>
              <el-form-item
                prop="card_holder"
                class="align-items-center"
                :error="getError('card_holder')"
              >
                <input-text
                  v-model="formDataCard.card_holder"
                  :maxlength="MAX_LENGTH_NAME"
                />
              </el-form-item>
            </div>
            <div>
              <div class="label-text required-field">
                {{ $t("booking.card") }}
              </div>
              <el-form-item
                prop="card_number"
                class="align-items-center"
                :error="getError('card_number')"
              >
                <input-text
                  v-model="formDataCard.card_number"
                  :maxlength="19"
                  @input="handleCardNumber"
                />
              </el-form-item>
            </div>
            <div>
              <el-form-item class="align-items-center">
                <div class="div-block date-cvc d-flex w-100">
                  <div class="date-expired w-100">
                    <div class="label-text required-field">
                      {{ $t("booking.date_expired") }}
                    </div>
                    <el-form-item prop="dateCard">
                      <template #error="{ error }">
                        <p class="error-validate">{{ error }}</p>
                      </template>
                      <InputText
                        v-model="formDataCard.dateCard"
                        :maxlength="5"
                        @input="updateValue"
                      />
                      <p
                        v-if="getError('expiration_year')"
                        class="error-validate w-100"
                      >
                        {{ getError("expiration_year") }}
                      </p>
                      <p
                        v-if="getError('expiration_month')"
                        class="error-validate w-100"
                      >
                        {{ getError("expiration_month") }}
                      </p>
                    </el-form-item>
                  </div>
                  <div class="cvc w-100">
                    <div class="label-text required-field">
                      {{ $t("booking.cvc") }}
                    </div>
                    <el-form-item
                      prop="cvc"
                      class="cvc-input"
                      :error="getError('cvc')"
                    >
                      <InputText
                        v-model="formDataCard.cvc"
                        :maxlength="4"
                        @input="handleCvc"
                      />
                    </el-form-item>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div-inline
          v-else
          :label="'store.link_status_card'"
          :class-name="'connected-status'"
        >
          <template #form-item>
            <div v-if="statusPayment" class="confirmation-status">
              <IconCheck />
              <div class="status">
                {{ $t("store.cooperation_payment") }}
              </div>
            </div>
          </template>
        </div-inline>
      </template>
    </connect-template>
  </div>
</template>

<script lang="ts" setup>
import ConnectTemplate from "./ConnectTemplate";
import { reactive, ref, toRefs } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import { paymentRules } from "~/../../src/store/validates/settingPayment";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { MAX_LENGTH_NAME } from "~/../../src/shared/utils/validate";
import VisaCard from "~/../../src/front/components/Icon/VisaCard.vue";
import MasterCard from "~/../../src/front/components/Icon/MasterCard.vue";
import JCBCard from "~/../../src/front/components/Icon/JCBCard.vue";
import AmericanExpressCard from "~/../../src/front/components/Icon/AmericanExpressCard.vue";
import DinnerClubCard from "~/../../src/front/components/Icon/DinnerClubCard.vue";
import {
  formatCardNumber,
  formatDateYearCard,
  formatInputNumber,
} from "~/../../src/shared/utils/formatInput";
import moment from "moment/moment";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import StorePaymentSettingRequest from "~/../../src/shared/requests/StorePaymentSettingRequest";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";
import { messageError } from "~/../../src/shared/utils/notification";

interface Prop {
  statusPayment?: boolean;
}

const emits = defineEmits(["setStatusPaymentCard"]);

const { t } = i18n.global;
const props = defineProps<Prop>();
const { statusPayment } = toRefs(props);
const _formRef = ref<FormInstance>();
const errorData = ref({});
const authStore = useAuthStore();
const storeData = useMeStore();
const formDataCard = reactive({
  card_holder: "",
  card_number: "",
  expiration_year: "",
  expiration_month: "",
  cvc: "",
  dateCard: "",
});

const isLoadingConnect = ref(false);
const isLoadingSave = ref(false);

const handleCardNumber = (event: string) => {
  formDataCard.card_number = formatCardNumber(event);
};

const updateValue = (event: string) => {
  formDataCard.dateCard = formatDateYearCard(event);
  if (+formDataCard.dateCard >= 2) {
    formDataCard.dateCard = (+formDataCard.dateCard).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
  }
};

const handleCvc = (event: string) => {
  formDataCard.cvc = formatInputNumber(event);
};

const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    errorData.value = {};
    if (valid) {
      const stringArr = formDataCard.dateCard.split("/");
      const cardNumber = formDataCard.card_number.replaceAll(" ", "");
      if (stringArr.length) {
        formDataCard.expiration_month = stringArr[0];
      }
      if (stringArr.length === 2) {
        const nowYear = moment().year() + "";
        formDataCard.expiration_year = `${nowYear.substr(0, 2)}${stringArr[1]}`;
      }
      try {
        isLoadingSave.value = true;
        await StorePaymentSettingRequest.postSettingPaymentCard({
          ...formDataCard,
          card_number: cardNumber,
        });
        await getStepSetting();
        emits("setStatusPaymentCard", true);
        ElMessage({
          message: t("success.connect_payment_card"),
          type: "success",
          grouping: true,
        });
        _formRef.value.resetFields();
      } catch (e) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = e.response?._data?.errors;
        }
        if (e.response.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response?._data?.message);
        }
      } finally {
        isLoadingSave.value = false;
      }
    }
  });
};

const getError = (field: string) => {
  return errorData.value[field]?.[0];
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
};
</script>

<style scoped lang="scss">
@use "~/../../src/shared/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.setting-payment-card {
  .setting-card-content {
    .card-information {
      width: 50%;
      max-width: 270px;

      .title {
        font-size: 14px;
        font-weight: 700;
      }

      .card-list {
        padding: 16px 0 24px 0;
        display: flex;
        justify-content: space-between;
        gap: 8px;

        .card-icon {
          width: 50px;
          height: 32px;
        }
      }
    }

    .div-block {
      gap: 20px;
    }
  }
}
</style>
