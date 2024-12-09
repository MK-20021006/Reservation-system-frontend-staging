<template>
  <div id="univapay" ref="_refElement">
    <!--NOW: cap:true-->
    <!--TAM: cap:false-->
    <span
      v-if="tokenUnivapay"
      :data-app-id="tokenUnivapay"
      :data-email="email"
      :data-amount="amount"
      :data-capture="isCaptureAt"
      :data-booking_id="bookingId"
      :data-action_env="env"
      data-token-type="recurring"
      data-checkout="payment"
      data-currency="jpy"
      data-payment-type="card"
      data-inline="true"
      data-locale="ja-jp"
      data-inline-item-label-style="color:#000000cc"
      data-inline-field-style="width:100%;border:none;outline:none;background-color:#ffffff"
      data-inline-item-error-style="font-size: 11px;line-height: 16px; color: #f56c6c;border:none;outline:none"
      data-inline-item-style="border:none;outline:none; padding: 0 5px"
    ></span>
    <button id="action-button" hidden class="hidden" @click="handleClick" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head";
import { URL_WIDGET_UNIVAPAY } from "~/../../src/shared/constants";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import PaymentRequest from "~/../../src/shared/requests/PaymentRequest";
import { RESERVATION_TYPE } from "~/../../src/shared/constants/reservation";
import { useRoute, useRuntimeConfig } from "#imports";
import { ERROR_CODE } from "~/../../src/shared/constants";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

useHead({
  script: [
    {
      src: URL_WIDGET_UNIVAPAY,
      body: true,
    },
  ],
});

definePageMeta({
  layout: "check",
});

const config = useRuntimeConfig();
const route = useRoute();
const tokenUnivapay = ref(null);
const isMounted = ref(false);
const _refElement = ref();
const amount = ref(route.query?.amount);
const env = config.environment;

const email = ref(
  ((route.query?.order_email as string) || "").replace(" ", "+")
);

const isCaptureAt = ref(
  +route.query?.payment_type === RESERVATION_TYPE.INSTANT
);

const bookingId = ref(route.query?.bookingId);
const storeId = ref(+route.query?.storeId);

const handleClick = async () => {
  try {
    (await BookingRequest.getDataDraft(+bookingId.value as number)).data;
    const iFrame = document.querySelector("#univapay iframe");
    UnivapayCheckout.submit(iFrame)
      .then((data: any) => {
        if (data.charge && data.connectorId && data.token) {
          parent.postMessage({ type: "payment.success", data: data });
        } else {
          parent.postMessage({ type: "payment.error", data: null });
        }
      })
      .catch((errors: any) => {
        if (errors.message) {
          parent.postMessage({ type: "payment.error", data: errors.message });
        } else if (
          errors.data?.accept &&
          !errors.data?.cardNumber &&
          !errors.data?.cardholder &&
          !errors.data?.cvv &&
          !errors.data?.exp
        ) {
          parent.postMessage({
            type: "payment.error",
            data: ERROR_CODE.ERROR_VALIDATE_BOOKING,
          });
        } else if (!errors.data) {
          parent.postMessage({
            type: "payment.error",
            data: ERROR_CODE.CHARGE_AMOUNT_TOO_HIGH,
          });
        } else {
          parent.postMessage({ type: "payment.error", data: null });
        }
      });
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      parent.postMessage({
        type: "payment.error",
        data: ERROR_CODE.BOOKING_DELETE,
      });
    }
  }
};

const handleListenMessageUnivapay = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "resize") {
    parent.postMessage({ type: "height.univapay", data: data.data.height });
  }
};

const timeinterval = ref(null);
const count = ref(0);

onMounted(async () => {
  const el = document.querySelector(" #nuxt-page");
  if (el) {
    el.classList.add("full-page");
  }
  tokenUnivapay.value = (
    await PaymentRequest.getToken(storeId.value)
  )?.data?.token;
  isMounted.value = true;

  window.addEventListener("message", (event) => {
    handleListenMessageUnivapay(event);
  });

  await nextTick(() => {
    timeinterval.value = setInterval(() => {
      if (count.value === 30) {
        clearInterval(timeinterval);
        parent.postMessage({ type: "loadingCompleted", data: true });
      }
      count.value++;
      const iFrame = document.querySelector("#univapay iframe");
      if (iFrame) {
        clearInterval(timeinterval);
        parent.postMessage({ type: "loadingCompleted", data: true });
      }
    }, 1000);
  });
});

onBeforeUnmount(() => {
  const el = document.querySelector(" #nuxt-page");
  if (el) {
    el.classList.remove("full-page");
  }
  window.removeEventListener("message", (event) => {
    handleListenMessageUnivapay(event);
  });
  clearInterval(timeinterval.value);
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:global(.full-page) {
  height: 100vh;
}

//
#univapay {
  width: 100%;
  height: 100%;
}

.content-booking {
  flex: 1;
  width: 100%;
  padding: 32px 12.5%;

  .title {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 32px;
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .content-booking {
    padding: 32px 5%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .content-booking {
    padding: 24px 24px 32px;

    .title {
      margin-bottom: 24px;
    }
  }
}
</style>
