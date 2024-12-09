<template>
  <div class="payment-list-container">
    <Head>
      <Title
        >{{ $t("site_name_title")
        }}{{ $t("front.payment_booking_history") }}</Title
      >
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div
      class="header-content d-flex justify-content-between align-items-center"
    >
      <div class="title">{{ $t("front.payment_booking_history") }}</div>
      <el-form
        ref="formRef"
        class="data-form div-search"
        :model="formSearch"
        @keyup.enter="handleSearch"
      >
        <div class="div-search__status">
          <div class="status">{{ $t("status") }}</div>
          <ClientOnly>
            <el-form-item prop="status">
              <el-select
                v-model="formSearch.payment_status"
                class="select-status"
                @change="handleSearch"
              >
                <el-option :value="null" :label="$t('all')"></el-option>
                <el-option
                  v-for="item in paymentStatusBookingOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></el-option>
              </el-select>
            </el-form-item>
          </ClientOnly>
        </div>
        <el-form-item prop="booking_id">
          <el-input
            v-model="formSearch.store_name"
            :placeholder="$t('placeholder.search_by_store_name')"
            clearable
          >
            <template #append>
              <el-button
                :icon="Search"
                :loading="isLoadingSearch"
                @click="handleSearch"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="isLoadingTable" class="payment-list-content">
      <div>
        <div v-if="!listPayment.length" class="text-center no-data">
          {{ noData }}
        </div>
        <div
          v-for="item in listPayment"
          :key="item.id"
          class="payment-item"
          @click="
            $router.push({
              name: 'invoices-detail-id',
              params: { id: item.id },
            })
          "
        >
          <div class="left">
            <el-image
              :src="
                item?.store?.image?.url ||
                '../../assets/images/default_store.svg'
              "
              fit="cover"
            />
            <div class="payment-info">
              <div class="store-name">{{ item.store?.name }}</div>
              <div class="booking-status">
                <div v-if="item.payment_status === PAYMENT_STATUS_BOOKING.PAID">
                  <span>{{ $t("booking.payment_completed2") }}</span>
                </div>
                <div
                  v-else-if="
                    item.payment_status === PAYMENT_STATUS_BOOKING.UNPAID
                  "
                >
                  <span>{{ $t("booking.unsettled") }}</span>
                </div>
                <div
                  v-else-if="
                    item.payment_status === PAYMENT_STATUS_BOOKING.REFUND
                  "
                >
                  <span>{{ $t("booking.refunded") }}</span>
                </div>
                <div
                  v-else-if="
                    item.payment_status === PAYMENT_STATUS_BOOKING.WAITING
                  "
                >
                  <span>{{ $t("booking.waiting_payment") }}</span>
                </div>
              </div>
              <div class="payment-created">
                {{ formatDate(item.created_at, "YYYY年MM月DD日 HH:mm") }}
              </div>
              <div class="amount amount-mobile">
                {{ priceDisplay(item.amount) }}{{ $t("yen") }}
              </div>
            </div>
          </div>
          <div class="right">
            <div class="amount hidden-sm-and-down">
              {{ priceDisplay(item.amount) }}{{ $t("yen") }}
            </div>
          </div>
        </div>
      </div>
      <LazyCommonPagination
        v-if="pagination.total"
        class="custom-page"
        :current-page="pagination.currentPage"
        :default-record="pagination.numberRecordPerPage"
        :total="pagination.total"
        :paper-count="3"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { PAYMENT_STATUS_BOOKING } from "~/../../src/shared/constants/payment";
import { FormInstance } from "element-plus";
import {
  CUSTOMER_PAGINATION,
  paymentStatusBookingOptions,
  SORT_ORDER,
} from "~/../../src/shared/constants";
import Search from "~/../../src/front/components/Icon/Search.vue";
import { InvoiceInterface } from "../../../front/models/invoice";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { DataTableStore } from "../../store/dataTable";
import { i18n } from "~/../../src/shared/plugins/i18n";
import priceDisplay from "~/../../src/shared/utils/price";
import { formatDate } from "~/../../src/shared/utils/format";
import { useDeviceStore } from "../../store/device";
import scrollToTop from "~/../../src/shared/utils/scroll";

definePageMeta({
  middleware: ["auth"],
  activeSidebar: {
    parentName: "invoices",
  },
});
const { t } = i18n.global;
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const formResultAfterSubmitSearch = ref(null);
const noData = ref(t("no_data"));
const dataTableStore = DataTableStore();
const loading = ref(false);
const formRef = ref<FormInstance>();
const dataTitle = reactive([
  { name: t("title_screen.invoice_history"), path: "" },
]);

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: CUSTOMER_PAGINATION.PER_PAGE,
});

const sortTable = reactive({
  order_by: "created_at",
  direct: SORT_ORDER.DESC,
});

const formSearch = ref({
  id: null,
  payment_status: null,
  store_name: null,
  payment_type: null,
});

if (dataTableStore.invoiceList?.search) {
  formSearch.value = dataTableStore.invoiceList.search;
}
const listPayment = ref<InvoiceInterface[]>([]);
const getListPayment = async () => {
  try {
    isLoadingTable.value = true;
    const invoiceData = (
      await InvoiceRequest.list<InvoiceInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    listPayment.value = invoiceData?.data;
    pagination.total = invoiceData?.pagination.total;
    pagination.currentPage = invoiceData?.pagination.current_page;
    pagination.numberRecordPerPage = invoiceData?.pagination.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
    scrollToTop();
  }
};
const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getListPayment();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!listPayment.value?.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStore();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const addConditionSearchStore = () => {
  dataTableStore.invoiceList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
  };
};
const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListPayment();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListPayment();
    addConditionSearchStore();
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  scrollToTop();
  await getListPayment();
});
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.payment-list-container {
  width: 100%;
  padding: 32px;

  .no-data {
    border-top: 1px solid $black-10;
    padding: 20px 0;
  }

  .booking-status {
    margin-bottom: 5px;

    .status {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .header-content {
    padding-bottom: 24px;

    .div-search {
      display: flex;

      &__status {
        display: flex;
        align-items: center;
      }
    }

    .title {
      font-size: 20px;
    }

    .status {
      min-width: 75px;
    }

    .select-status {
      margin: 0 24px 0 16px;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-select {
      width: 128px;
    }

    :deep(.el-input__wrapper) {
      width: 170px;
    }
  }

  .payment-list-content {
    .payment-item {
      cursor: pointer;
      padding: 8px 16px;
      border-top: 1px solid $gray-700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .left {
        display: flex;

        .el-image {
          width: 48px;
          min-width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .payment-info {
          padding-left: 8px;

          .store-name {
            font-size: 16px;
            line-height: 24px;
            padding-bottom: 4px;
          }

          .payment-created {
            color: $black-200;
            font-size: 12px;
            line-height: 16px;
          }
        }
      }

      .amount {
        font-weight: 700;
        font-size: 18px;
        line-height: 26px;
        color: $red-color;
        min-width: 110px;
        text-align: right;

        &.amount-mobile {
          display: none;
        }
      }
    }
  }
}

.payment-item:nth-last-child(1) {
  border-bottom: 1px solid $gray-700;
  margin-bottom: 24px;
}

@include res("sm-and-down", $breakpoints-spec) {
  .payment-list-container {
    padding: 24px;

    .header-content {
      padding-bottom: 24px;
      flex-direction: column;
      align-items: flex-start;
      gap: 32px;

      .div-search {
        width: 100%;
        display: grid;

        &__status {
          margin-bottom: 20px;
        }
      }

      .select-status {
        margin: 0 8px;
      }

      .el-select {
        width: 114px;
      }

      :deep(.el-input__wrapper) {
        width: calc(100% - 70px - 8px - 8px);
      }
    }

    .payment-list-content {
      .payment-item {
        .left {
          width: 100%;

          .payment-info {
            width: calc(100% - 48px);
          }
        }

        .amount {
          &.amount-mobile {
            display: block;
            padding-top: 20px;
          }
        }
      }
    }
    .custom-pagination {
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  :deep(.el-pagination) {
    padding: 0;
  }
}
</style>
