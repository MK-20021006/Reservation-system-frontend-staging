<template>
  <div class="connect-univapay">
    <connect-template
      :is-loading-connect="isLoadingConnect"
      :is-loading-save="isLoadingSave"
      @connect-data="handleConnect(_formRef)"
      @save-data="handleSave(_formRef)"
    >
      <template #connect-type>
        <el-form
          ref="_formRef"
          class="data-form"
          :model="formData"
          :rules="paymentSettingRules"
          label-width="160px"
          require-asterisk-position="right"
          label-position="left"
          :inline-message="true"
        >
          <el-form-item
            :label="$t('store.token')"
            prop="token"
            required
            class="align-items-center"
          >
            <input-text
              v-model="formData.token"
              width="400px"
              type-input="password"
              :maxlength="MAX_LENGTH_TEXTAREA"
            />
          </el-form-item>
          <el-form-item
            :label="$t('store.secret')"
            prop="secret"
            required
            class="align-items-center"
          >
            <input-text
              v-model="formData.secret"
              width="400px"
              type-input="password"
              :maxlength="MAX_LENGTH_TEXTAREA"
            />
          </el-form-item>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div v-if="isStatusCard" class="confirmation-status">
                <IconCheck />
                <div class="status">
                  {{ $t("store.correct_information") }}
                </div>
              </div>
              <div v-else class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>
          <div-inline
            :label="'store.setting_guide'"
            :class-name="'setting-guide'"
          >
            <template #form-item>
              <div class="d-flex align-items-center">
                <!-- //TODO link -->
                <NuxtLink
                  :to="'https://jp.ar-xia.com/apply-univapay'"
                  target="_blank"
                  >UnivaPay
                </NuxtLink>
                <div>
                  {{ $t("store.go_to_the_member_store_application_page") }}
                </div>
              </div>
            </template>
          </div-inline>
          <div-inline
            :label="'univapay_linkage_method'"
            :class-name="'setting-guide'"
          >
            <template #form-item>
              <div>
                <a
                  class="text-guide"
                  target="_blank"
                  href="https://jp.ar-xia.com/univapay_linkage_method/"
                  >{{ $t("coordination_procedure") }}</a
                >
              </div>
            </template>
          </div-inline>
        </el-form>
      </template>
    </connect-template>
  </div>
</template>

<script lang="ts" setup>
import ConnectTemplate from "./ConnectTemplate";
import { computed, reactive, ref, toRefs } from "vue";
import type { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import PaymentRequest from "~/../../src/shared/requests/PaymentRequest";
import { PaymentSetting } from "~/../../src/store/models/payment";
import useAssetsFile from "~/../../src/store/composables/useAssetsFile";
import { paymentSettingRules } from "~/../../src/store/validates/settingPayment";
import { ElMessage } from "element-plus";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { MAX_LENGTH_TEXTAREA } from "~/../../src/shared/utils/validate";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";

interface Prop {
  data: PaymentSetting;
}

const emits = defineEmits(["setStatusPayment"]);
const { t } = i18n.global;
const props = defineProps<Prop>();
const { data: paymentSetting } = toRefs(props);
const _formRef = ref<FormInstance>();
const authStore = useAuthStore();
const storeData = useMeStore();

const isStatusCard = ref(!!props.data?.status);
const formData = reactive({
  token: "",
  secret: "",
});

const isLoadingConnect = ref(false);
const isLoadingSave = ref(false);

if (paymentSetting.value) {
  formData.secret = paymentSetting.value?.secret;
  formData.token = paymentSetting.value?.token;
}

const handleConnect = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingConnect.value = true;
        const data = await PaymentRequest.checkConnect(formData);
        isStatusCard.value = !!data.data;
        emits("setStatusPayment", isStatusCard.value);
      } catch (e) {
        emits("setStatusPayment", false);
      } finally {
        isLoadingConnect.value = false;
      }
    }
  });
};

const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingSave.value = true;
        const data = await PaymentRequest.applySetting<PaymentSetting>(
          formData
        );
        isStatusCard.value = !!data.data?.status;
        await getStepSetting();
        ElMessage({
          message: t("success.setting_payment_completed"),
          type: "success",
          grouping: true,
        });
        emits("setStatusPayment", isStatusCard.value);
      } catch (e) {
        ElMessage({
          message: t("errors.setting_payment_error"),
          type: "error",
          grouping: true,
        });
      } finally {
        isLoadingSave.value = false;
      }
    }
  });
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
  storeData.updateStatusStore(data.status);
};

const statusPayment = computed(() => {
  return isStatusCard;
});

defineExpose({
  statusPayment,
});
</script>
