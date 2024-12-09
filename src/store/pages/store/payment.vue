<template>
  <div id="univapay" ref="_refElement">
    <!--NOW: cap:true-->
    <!--TAM: cap:false-->
    <span
      v-if="tokenUnivapay"
      :data-app-id="tokenUnivapay"
      :data-email="email"
      :data-amount="1"
      :data-capture="true"
      :data-store_id="storeId"
      :data-action_env="env"
      data-action="STORE_SAVE_PAYMENT"
      data-token-type="recurring"
      data-checkout="payment"
      data-currency="jpy"
      data-payment-type="card"
      data-inline="true"
      data-locale="ja-jp"
      data-inline-item-label-style="color:#000000cc; font-size: 16px"
      data-inline-field-style="width:100%;border:1px solid #dcdfe6; height:40px; outline:none;background-color:#ffffff"
      data-inline-item-error-style="font-size: 14px;line-height: 16px; color: #f56c6c;border:none;outline:none"
      data-inline-item-style="border:black;outline:none; padding: 0 8px"
    ></span>
    <button id="action-button" hidden class="hidden" @click="handleClick" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head";
import { URL_WIDGET_UNIVAPAY } from "~/../../src/shared/constants";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRuntimeConfig } from "#imports";
import { ERROR_CODE } from "~/../../src/shared/constants";

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
const tokenUnivapay = config.tokenSecret;
const env = config.environment;
const isMounted = ref(false);
const _refElement = ref();

const email = ref(((route.query?.email as string) || "").replace(" ", "+"));
const storeId = ref(route.query?.store_id);

const handleClick = async () => {
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
};

const handleListenMessageUnivapay = (event: any) => {
  const data = JSON.parse(event.data);
  if (data.type === "resize") {
    parent.postMessage({ type: "height.univapay", data: data.data.height });
  }
};

const timeinterval = ref<any>();
const count = ref(0);

onMounted(async () => {
  const el = document.querySelector(" #nuxt-page");
  if (el) {
    el.classList.add("full-page");
  }
  isMounted.value = true;

  window.addEventListener("message", (event: any) => {
    handleListenMessageUnivapay(event);
  });

  await nextTick(() => {
    timeinterval.value = setInterval(() => {
      if (count.value === 30) {
        clearInterval(timeinterval.value);
        parent.postMessage({ type: "loadingCompleted", data: true });
      }
      count.value++;
      const iFrame = document.querySelector("#univapay iframe");
      if (iFrame) {
        clearInterval(timeinterval.value);
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

:global(.full-page) {
  height: 100vh;
}

#univapay {
  width: 100%;
  height: 100%;
}
</style>
