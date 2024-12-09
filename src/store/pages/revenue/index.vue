<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("title_screen.list_revenue_store") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="menu-header">
            <div>{{ $t("front.payment_booking_history") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            :model="formSearch"
            label-position="left"
            inline
            class="custom-form"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.payment_status"
                  placeholder=" "
                  :default-first-option="true"
                >
                  <el-option :label="$t('all')" value="" />
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item :label="$t('store.fee_month')">
              <client-only>
                <el-date-picker
                  v-model="formSearch.start_month"
                  :editable="false"
                  :placeholder="$t('start_date')"
                  type="month"
                  class="mr-10"
                  :disabled-date="disabledDateStartMonth"
                  format="YYYY年MM月"
                  value-format="YYYY-MM"
                  clearable
                />
              </client-only>
              <client-only>
                <el-date-picker
                  v-model="formSearch.end_month"
                  :editable="false"
                  type="month"
                  :placeholder="$t('end_date')"
                  :disabled-date="disabledDateEndMonth"
                  format="YYYY年MM月"
                  value-format="YYYY-MM"
                  clearable
                />
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('store.due_date')">
              <client-only>
                <el-date-picker
                  v-model="formSearch.start_due_date"
                  :editable="false"
                  :placeholder="$t('start_date')"
                  type="date"
                  class="mr-10"
                  :disabled-date="disabledDateStart"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </client-only>
              <client-only>
                <el-date-picker
                  v-model="formSearch.end_due_date"
                  :editable="false"
                  type="date"
                  :placeholder="$t('end_date')"
                  :disabled-date="disabledDateEnd"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  clearable
                />
              </client-only>
            </el-form-item>
            <ButtonSearch
              :name="$t('button_search')"
              width="128px"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <el-table
          v-loading="loading"
          class="table-content"
          :data="tableData"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
          cell-class-name="text-row-2"
          :default-sort="defaultSort"
          :empty-text="noData"
          @sort-change="headerSort"
        >
          <el-table-column
            min-width="140px"
            :label="$t('store.fee_month')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{
                isCustomerBilling(scope.row)
                  ? formatDate(scope.row.due_date, "YYYY年MM月")
                  : formatDate(scope.row.month, "YYYY年MM月")
              }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="180px"
            :label="$t('content')"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>{{
                findObj(typePlanOption, "value", scope.row.contract?.type)
                  ?.label
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('store.total_charge')"
            prop="amount"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ priceDisplay(scope.row.amount) }} {{ $t("yen") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('store.billing_date')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.created_at) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('store.due_date')"
            prop="due_date"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="left"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.due_date) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('store.date_of_payment')"
            prop="paid_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="left"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.paid_at) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('status')"
            prop="status"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="left"
          >
            <template #default="scope">
              {{
                findObj(
                  paymentStatusBookingOptions,
                  "value",
                  scope.row.payment_status
                )?.label
              }}
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            align="center"
            :label="$t('action')"
            class-name="custom-action"
            fixed="right"
          >
            <template #default="scope">
              <div>
                <IconView
                  v-if="hasPermRevenueDetail"
                  @click="detailRevenue(scope.row.id)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <CommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.defaultRecord"
            :total="pagination.total"
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { formatDate } from "~~/../../src/shared/utils/format";
import { ref, onBeforeMount, reactive, computed } from "vue";
import { useRouter } from "nuxt/app";
import { STORE_PAGINATION } from "~/../../src/shared/constants/pagination";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import ButtonSearch from "~/../../src/shared/components/button/Search";
import { SORT_ORDER } from "~~/../../src/shared/constants";
import { getTypeSort } from "~/../../src/shared/utils";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  paymentStatusBookingOptions,
  PAYMENT_STATUS_BOOKING,
} from "~/../../src/shared/constants";
import SubscriptionRequest from "~/../../src/shared/requests/SubscriptionRequest";
import priceDisplay from "../../../shared/utils/price";
import { findObj } from "~/../../src/shared/utils";
import { SubscriptionInterface } from "~/../../src/store/models/subscription";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import {
  commonDisabledDateStartMonthNew,
  commonDisabledDateEndMonthNew,
} from "~/../../src/shared/utils";
import { typePlanOption } from "~/../../src/shared/constants";
import { TYPE_PLAN } from "~/../../src/shared/constants";

useHavePermission(Permission.SubscriptionList);
const hasPermRevenueDetail = useHavePermission(
  Permission.SubscriptionDetail,
  false
);

const { t } = i18n.global;
const router = useRouter();
const loading = ref(false);
const tableData = ref<SubscriptionInterface[]>([]);
const noData = ref(t("no_data"));
const dataTable = DataTableStore();
const formSearch = reactive({
  start_month: "",
  end_month: "",
  start_due_date: "",
  end_due_date: "",
  payment_status: "",
});

const status = paymentStatusBookingOptions.filter((item) => {
  return item.value !== PAYMENT_STATUS_BOOKING.REFUND;
});
const pagination = reactive({
  currentPage: 1,
  total: 0,
  defaultRecord: STORE_PAGINATION.PER_PAGE,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const detailRevenue = (id: number) => {
  router.push(`/revenue/detail/${id}`);
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  addConditionRevenue();
  getListRevenue();
};

const handleSizeChange = (val: number) => {
  pagination.defaultRecord = val;
  pagination.currentPage = 1;
  addConditionRevenue();
  getListRevenue();
};

const sortTable = reactive({
  order_by: "id",
  direct: SORT_ORDER.DESC,
});

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  loading.value = true;
  addConditionRevenue();
  await getListRevenue();
  loading.value = false;
};

const handleSearch = async () => {
  loading.value = true;
  pagination.currentPage = 1;
  addConditionRevenue();
  await getListRevenue();
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
  loading.value = false;
};

const addConditionRevenue = () => {
  dataTable.subscriptionList = {
    search: formSearch,
    currentPage: pagination.currentPage,
    pageSize: pagination.defaultRecord,
    sort: sortTable,
  };
};

const getListRevenue = async () => {
  loading.value = true;
  const params = {
    ...formSearch,
    ...sortTable,
    limit: pagination.defaultRecord,
    page: pagination.currentPage,
  };
  const data = (await SubscriptionRequest.list<SubscriptionInterface[]>(params))
    .data;
  tableData.value = data.data;
  pagination.total = data.pagination.total;
  pagination.currentPage = data.pagination.current_page;
  loading.value = false;
};

const disabledDateStartMonth = (time: Date) => {
  return commonDisabledDateStartMonthNew(time, formSearch.end_month);
};

const disabledDateEndMonth = (time: Date) => {
  return commonDisabledDateEndMonthNew(time, formSearch.start_month);
};

const disabledDateStart = (time: Date) => {
  return (
    formSearch.end_due_date &&
    time.getTime() > Date.parse(formSearch.end_due_date)
  );
};

const isCustomerBilling = (data: any) => {
  return data?.contract?.type === TYPE_PLAN.CUSTOMER_BILLING;
};

const disabledDateEnd = (time: Date) => {
  return (
    formSearch.start_due_date &&
    time.getTime() < Date.parse(formSearch.start_due_date)
  );
};

onBeforeMount(() => {
  if (dataTable.subscriptionList?.search) {
    formSearch.start_month =
      dataTable.subscriptionList.search.start_month || "";
    formSearch.end_month = dataTable.subscriptionList.search.end_month || "";
    formSearch.start_due_date =
      dataTable.subscriptionList.search.start_due_date || "";
    formSearch.end_due_date =
      dataTable.subscriptionList.search.end_due_date || "";
    formSearch.payment_status =
      dataTable.subscriptionList.search.payment_status || "";
    pagination.currentPage = dataTable.subscriptionList.currentPage;
    pagination.defaultRecord = dataTable.subscriptionList.pageSize;
  }
  if (dataTable.subscriptionList?.sort) {
    sortTable.order_by = dataTable.subscriptionList.sort.order_by;
    sortTable.direct = dataTable.subscriptionList.sort.direct;
  }
  getListRevenue();
});
</script>

<style lang="scss" scoped>
@use "~~/../../src/store/assets/scss/variables" as *;
:deep(.custom-form) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }

  .el-input {
    width: 180px;
  }

  .el-select {
    .el-input {
      width: 222px;
    }
  }
}

:deep(.category-delete) {
  td {
    .cell {
      color: $red-color-medium;
    }
  }
}

:deep(.custom-action) {
  svg {
    cursor: pointer;
  }
}
</style>
