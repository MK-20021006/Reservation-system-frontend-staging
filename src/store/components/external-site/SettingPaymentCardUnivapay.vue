<template>
  <div class="setting-payment-card">
    <connect-template
      :is-loading-connect="isLoadingConnect"
      :is-loading-save="isLoadingSave"
      :is-hidden-button-connect="true"
      :is-hidden-button-save="statusPayment"
      @save-data="submitForm"
    >
      <template #connect-type>
        <div v-if="!statusPayment" class="setting-card-content">
          <div class="card-information">
            <div class="title">{{ $t("booking.payment_method") }}</div>
            <div class="title-error">{{ $t("charge_1_yen") }}</div>
            <div class="card-list">
              <VisaCard class="card-icon" />
              <MasterCard class="card-icon" />
              <JCBCard class="card-icon" />
              <AmericanExpressCard class="card-icon" />
              <DinnerClubCard class="card-icon" />
            </div>
            <div id="checkout">
              <div v-if="errorCard" class="block-error">
                <p class="error-validate">
                  {{ errorCard }}
                </p>
              </div>
              <div v-loading="isLoadingConnect">
                <iframe
                  id="iframe-payment"
                  :src="`/store/payment?email=${storeData?.info?.store?.email}&store_id=${storeData?.info?.store?.id}`"
                />
              </div>
            </div>
          </div>
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
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import VisaCard from "~/../../src/front/components/Icon/VisaCard.vue";
import MasterCard from "~/../../src/front/components/Icon/MasterCard.vue";
import JCBCard from "~/../../src/front/components/Icon/JCBCard.vue";
import AmericanExpressCard from "~/../../src/front/components/Icon/AmericanExpressCard.vue";
import DinnerClubCard from "~/../../src/front/components/Icon/DinnerClubCard.vue";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";
import {
  messageError,
  customMessageErrorRow,
} from "~/../../src/shared/utils/notification";
import { ERROR_CODE } from "~/../../src/shared/constants";
import { ElMessage } from "element-plus";

interface Prop {
  statusPayment?: boolean;
  isUpdateCard: boolean;
}

const emits = defineEmits(["setStatusPaymentCard", "previousScreenConfirm"]);

const { t } = i18n.global;
const props = defineProps<Prop>();
const { statusPayment, isUpdateCard } = toRefs(props);
const authStore = useAuthStore();
const storeData = useMeStore();
const errorCard = ref();
const isLoadingConnect = ref(true);
const isLoadingSave = ref(false);
const heightElement = ref();
const timeInterval = ref();

const submitForm = async () => {
  const iFrame = document.getElementById("iframe-payment");
  const a = iFrame.contentWindow.document.querySelector("#action-button");
  isLoadingSave.value = true;
  if (a) {
    errorCard.value = null;
    a.click();
  }
};

const handleBack = () => {
  const iframe = document.getElementById("iframe-payment");
  if (iframe) {
    iframe.src = "";
    iframe.contentWindow.location.reload(true);
  }
};

watch(isUpdateCard, (value) => {
  if (value) {
    isLoadingConnect.value = true;
  } else {
    heightElement.value = "100px";
  }
});

const handleMessage = (data: any) => {
  if (data.type === "payment.error") {
    isLoadingConnect.value = false;
    if (data.data) {
      if (data.data?.includes("UNKNOWN_ERROR")) {
        messageError("errors.network");
      } else if (data.data?.includes(ERROR_CODE.CARD_LOCKED)) {
        errorCard.value = t("univapay.card_locked");
      } else if (data.data === ERROR_CODE.CHARGE_AMOUNT_TOO_HIGH) {
        customMessageErrorRow(
          "errors.charge_amount_limit",
          "errors.charge_amount_limit_footer"
        );
      } else if (data.data === ERROR_CODE.BOOKING_DELETE) {
        messageError("errors.booking_draft_delete");
      } else if (data.data === ERROR_CODE.ERROR_VALIDATE_BOOKING) {
        messageError("errors.booking_validate_payment");
      } else {
        errorCard.value = data.data;
      }
    }
    isLoadingSave.value = false;
  } else if (data.type === "payment.success") {
    timeInterval.value = setInterval(async () => {
      emits("setStatusPaymentCard", true);
      ElMessage({
        message: t("success.connect_payment_card"),
        type: "success",
        grouping: true,
      });
      await nextTick(() => {
        handleBack();
        getStepSetting();
        isLoadingSave.value = false;
      });
      clearInterval(timeInterval.value);
    }, 15000);
  }
  if (data.type === "height.univapay") {
    heightElement.value = `${data.data}px`;
    isLoadingSave.value = false;
  }
  if (data.type === "loadingCompleted") {
    isLoadingConnect.value = !data.data;
    isLoadingSave.value = false;
  }
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
  storeData.updateStatusStore(data.status);
};

onMounted(() => {
  getStepSetting();
  window.addEventListener(
    "message",
    (event) => {
      handleMessage(event.data);
    },
    false
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "message",
    (event) => {
      handleMessage(event.data);
    },
    false
  );
});
</script>

<style scoped lang="scss">
@use "~/../../src/shared/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(#iframe-payment) {
  width: 100%;
  height: v-bind(heightElement);
}

:deep(#checkout) {
  width: 400px;
}

:deep(.card-list) {
  width: 400px;
  display: flex;
  max-width: 400px;
  gap: 8px;
  justify-content: space-between;
  padding: 16px 5px 24px;
}

:deep(.setting-card-content) {
  display: flex;
  flex-direction: column;
  width: 100%;

  .title {
    font-size: 20px;
    font-weight: 500;
    padding: 0 5px;
  }

  .title-error {
    color: #c03522;
    font-size: 14px;
    padding: 0 5px;
    margin-top: 10px;
  }

  .block-error {
    margin-bottom: 12px;
  }

  :deep(.input-text) {
    height: 40px;
  }
}
</style>
