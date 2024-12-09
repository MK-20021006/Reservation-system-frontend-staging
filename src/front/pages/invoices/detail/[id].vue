<template>
  <div v-loading="loading" class="payment-detail-container">
    <Head>
      <Title
        >{{ $t("site_name_title")
        }}{{ $t("title_screen.payment_detail") }}</Title
      >
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="title font-weight-500">
      {{ $t("title_screen.payment_detail") }}
    </div>
    <div class="content-detail">
      <div class="store-info d-flex align-items-center justify-content-between">
        <el-image
          :src="
            invoiceDetail?.store?.image?.url ||
            '../../assets/images/default_store.svg'
          "
          fit="cover"
        />
        <div class="store">
          <div class="store-name font-weight-500">
            {{ invoiceDetail?.store.name }}
          </div>
          <div class="payment-created">
            {{ formatDate(invoiceDetail?.created_at, "YYYY年MM月DD日 HH:mm") }}
          </div>
        </div>
      </div>
      <div class="info-detail">
        <div class="info-item">
          <div>{{ $t("payment_number") }}</div>
          <div>{{ invoiceDetail?.id }}</div>
        </div>
        <div class="info-item">
          <div>{{ $t("payment.method") }}</div>
          <div>{{ payment_type }}</div>
        </div>
        <div class="info-item">
          <div>{{ $t("status") }}</div>
          <div>{{ status }}</div>
        </div>
        <div class="info-item">
          <div>{{ $t("reservation_number") }}</div>
          <div
            class="text-link text-underline cursor-pointer"
            @click="redirectReservation"
          >
            {{ invoiceDetail?.reservation?.reservation_code }}
          </div>
        </div>
      </div>
      <div
        class="total-amount d-flex justify-content-between align-items-center"
      >
        <div class="total">{{ $t("total") }}</div>
        <div class="amount">
          {{ priceDisplay(invoiceDetail?.amount) }}{{ $t("yen") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  paymentStatusBookingOptions,
  PaymentMethod,
} from "~/../../src/shared/constants/payment";
import { onBeforeMount, reactive, ref } from "vue";
import { findObj } from "~/../../src/shared/utils/array";
import priceDisplay from "~/../../src/shared/utils/price";
import scrollToTop from "~/../../src/shared/utils/scroll";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { useRoute, useRouter } from "#imports";
import { InvoiceInterface } from "../../../models/invoice";
import { formatDate } from "~/../../src/shared/utils/format";
import { i18n } from "~/../../src/shared/plugins/i18n";

definePageMeta({
  middleware: ["auth"],
  activeSidebar: {
    parentName: "invoices",
  },
});

const { t } = i18n.global;
const loading = ref(true);
const invoiceDetail = ref<InvoiceInterface | null>(null);
const route = useRoute();
const router = useRouter();
const dataTitle = reactive([
  { name: t("title_screen.invoice_history"), path: "" },
]);

const status = ref();
const payment_type = ref();

const getDataResponse = async () => {
  if (route.params?.id) {
    try {
      loading.value = true;
      invoiceDetail.value = (
        await InvoiceRequest.show(+route.params.id as number)
      )?.data as InvoiceInterface;
    } catch (_) {
      await router.push({ name: "invoices" });
    } finally {
      status.value = findObj(
        paymentStatusBookingOptions,
        "value",
        invoiceDetail.value?.payment_status
      )?.label;
      payment_type.value = findObj(
        PaymentMethod,
        "value",
        invoiceDetail.value?.payment_type
      )?.label;
      loading.value = false;
    }
  }
};
onBeforeMount(async () => {
  scrollToTop();
  await getDataResponse();
});

const redirectReservation = () => {
  router.push(
    `/reservation/detail/${invoiceDetail.value?.reservation.reservation_id}`
  );
};
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.payment-detail-container {
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

  .title,
  .store-name {
    font-size: 20px;
    line-height: 28px;
  }

  .content-detail {
    margin-top: 32px;
    padding: 32px;
    width: 80%;
    border: 1px solid $gray-600;
    background-color: $gray-20;

    .store-info {
      gap: 24px 24px;

      .el-image {
        width: 60px;
        min-width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      .store {
        text-align: right;

        .payment-created {
          padding-top: 8px;
          color: $black-200;
        }
      }
    }

    .info-detail {
      border-bottom: 1px solid $gray-500;
      margin: 24px 0;

      .info-item {
        height: 40px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid $gray-500;
        border-bottom: none;
      }
    }

    .total-amount {
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;

      .amount {
        color: $red-color;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .payment-detail-container {
    padding: 24px 16px;

    .content-detail {
      margin-top: 24px;
      padding: 32px 24px;
      width: 100%;
    }
  }
}
</style>
