<template>
  <div class="payment-setting-container">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("store.payment_setting") }}</Title
      >
    </Head>
    <el-scrollbar>
      <div class="payment-setting-content">
        <div class="title-item">
          <div class="left">
            <icon-univapay />
            <span class="pl-10">{{
              $t("store.univapay_payment_linkage")
            }}</span>
          </div>
          <div class="right">
            <template v-if="isStatusConnect">
              <div class="status-color linked"></div>
              <div class="status">{{ $t("store.cooperating") }}</div>
            </template>
            <template v-else>
              <div class="status-color not-linked"></div>
              <div class="status">{{ $t("store.not_linked") }}</div>
            </template>
          </div>
        </div>
        <connect-univa-pay
          ref="_refPayment"
          :data="paymentSetting"
          @set-status-payment="isStatusConnect = $event"
        />
      </div>

      <!--Payment card-->
      <!-- TODO all text label -->
      <div class="payment-setting-content">
        <div class="title-item">
          <div class="left">
            <icon-univapay />
            <span class="pl-10">{{
              $t("payment_information_to_the_system")
            }}</span>
          </div>
          <div class="right">
            <template v-if="statusPaymentCard">
              <div class="status-color linked"></div>
              <div class="status">{{ $t("store.cooperating") }}</div>
              <button-common
                color="white"
                class="btn-update"
                :name="'button.linked_update'"
                :height="'32px'"
                :background-color="'#0071BC'"
                @click="updateCardPayment"
              ></button-common>
            </template>
            <template v-else-if="isUpdateCard">
              <button-white
                class="btn-cancel"
                :height="'32px'"
                :name="$t('button.cancel')"
                @click="handleCloseUpdateCardPayment"
              />
            </template>
            <template v-else>
              <div class="status-color not-linked"></div>
              <div class="status">{{ $t("store.not_linked") }}</div>
            </template>
          </div>
        </div>
        <component
          :is="component"
          ref="_refSettingCardPayment"
          :data="paymentSetting"
          :is-update-card="isUpdateCard"
          :status-payment="statusPaymentCard"
          @set-status-payment-card="handleCloseUpdateCardPayment"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, shallowRef } from "vue";
import ConnectUnivaPay from "~/../../src/store/components/external-site/ConnectUnivaPay.vue";
import IconUnivapay from "~/../../src/store/components/Icon/IconUnivapay.vue";
import { PaymentSetting } from "~/../../src/store/models/payment";
import PaymentRequest from "~/../../src/shared/requests/PaymentRequest";
import StorePaymentSettingRequest from "~/../../src/shared/requests/StorePaymentSettingRequest";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";

interface PaymentCardStatus {
  data: boolean;
}
const SettingPaymentCardUnivapay = defineAsyncComponent(
  () =>
    import(
      "~/../../src/store/components/external-site/SettingPaymentCardUnivapay.vue"
    )
);
const component = shallowRef(SettingPaymentCardUnivapay);

const _refPayment = ref();
const _refSettingCardPayment = ref();
const isUpdateCard = ref(false);
const isStatusConnect = ref(true);
const paymentSetting = ref<PaymentSetting>();
const statusPaymentCard = ref(false);

paymentSetting.value = (await PaymentRequest.setting<PaymentSetting>())?.data;

isStatusConnect.value = !!paymentSetting.value?.status;

const response =
  await StorePaymentSettingRequest.getPaymentStatusStore<PaymentCardStatus>();

const updateCardPayment = () => {
  statusPaymentCard.value = false;
  isUpdateCard.value = true;
};

const handleCloseUpdateCardPayment = () => {
  statusPaymentCard.value = true;
  isUpdateCard.value = false;
};

statusPaymentCard.value = response?.data || false;
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.payment-setting-container {
  height: 100%;

  .payment-setting-content {
    background-color: white;
    box-shadow: 0px 2px 4px $black-5;
    border-radius: 4px;
    padding-bottom: 24px;
    margin-bottom: 22px;

    .title-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 12px 20px;

      .left {
        display: flex;
        align-items: center;
        font-size: 16px;
      }

      .right {
        display: flex;
        align-items: center;

        .status-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.linked {
            background-color: $green-100;
          }

          &.not-linked {
            background-color: $black-40;
          }
        }

        .status {
          padding-left: 8px;

          &.not-link-title {
            padding-right: 0;
          }
        }
      }
    }

    :deep(.data-form) {
      width: 38%;
      min-width: 560px;

      .connected-status {
        .label-text {
          padding-top: 0;
        }
      }

      .setting-guide {
        margin-bottom: 33px;

        .label-text {
          padding-top: 0;
        }
      }
    }

    :deep(.confirmation-status) {
      display: flex;
      align-items: center;

      .status {
        padding-left: 8px;
      }
    }

    .btn-update,
    .btn-cancel {
      margin-left: 24px;
    }
  }
}
</style>
