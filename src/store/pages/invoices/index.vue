<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.list_revenue") }}</Title
        >
      </Head>
    </template>

    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_revenue") }}</template>
        <template #button>
          <ButtonExport :name="$t('button_export')" @click="handleExport" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            inline
            :model="formSearch"
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('keyword_search')">
              <input-text
                v-model="formSearch.keyword"
                class="keyword"
                :placeholder="$t('placeholder.keyword')"
              />
            </el-form-item>
            <el-form-item
              v-if="![EVENT, SALON].includes(typeStore)"
              :label="$t('course_name')"
            >
              <input-text
                v-model="formSearch.course_name"
                :placeholder="$t('course_name')"
              />
            </el-form-item>
            <el-form-item
              v-else-if="typeStore === SALON"
              :label="$t('course_tab_menu')"
            >
              <input-text
                v-model="formSearch.course_name"
                :placeholder="$t('course_tab_menu')"
              />
            </el-form-item>
            <el-form-item v-else :label="$t('event')">
              <input-text
                v-model="formSearch.course_name"
                :placeholder="$t('event')"
              />
            </el-form-item>
            <el-form-item :label="$t('payment_type')">
              <client-only>
                <el-select
                  v-model="formSearch.payment_type"
                  :placeholder="$t('payment_type')"
                  class="format-dropdown-input"
                >
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in PaymentMethod"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <div
              class="d-flex align-items-center justify-content-between group-radio-date"
            >
              <div class="d-flex radio-button">
                <el-radio-group
                  v-model="formSearch.search_type"
                  class="ml-4"
                  @change="handleChangeSearchDate"
                >
                  <el-radio :label="searchDatePayment.DATE_TIME" size="large">{{
                    $t("payment_date_time")
                  }}</el-radio>
                  <el-radio
                    :label="searchDatePayment.DATE_VISIT"
                    size="large"
                    >{{ $t("date_visit") }}</el-radio
                  >
                </el-radio-group>
                <div class="group-form-date">
                  <el-form-item
                    v-if="
                      formSearch.search_type === searchDatePayment.DATE_TIME
                    "
                    class="date-group"
                  >
                    <ClientOnly>
                      <CustomDatePicker
                        v-model="formSearch.start_date"
                        :type-date="getTypeDatePicker"
                        :format="format"
                        :placeholder="$t('start_date')"
                        class="input-date"
                        :disabled-date="disabledDateStartPayment"
                        @clear-data="clearData('start_date')"
                      />
                    </ClientOnly>
                    <ClientOnly>
                      <CustomDatePicker
                        v-model="formSearch.end_date"
                        :type-date="getTypeDatePicker"
                        :format="format"
                        :placeholder="$t('end_date')"
                        class="input-date"
                        :disabled-date="disabledDateEndPayment"
                        @clear-data="clearData('end_date')"
                      />
                    </ClientOnly>
                  </el-form-item>
                  <el-form-item v-else class="date-group">
                    <ClientOnly>
                      <CustomDatePicker
                        v-model="formSearch.start_order_date"
                        :type-date="getTypeDatePicker"
                        :format="format"
                        :placeholder="$t('start_date')"
                        class="input-date"
                        :disabled-date="disabledDateStartVisit"
                        @clear-data="clearData('start_order_date')"
                      />
                    </ClientOnly>
                    <ClientOnly>
                      <CustomDatePicker
                        v-model="formSearch.end_order_date"
                        :type-date="getTypeDatePicker"
                        :format="format"
                        :placeholder="$t('end_date')"
                        class="input-date"
                        :disabled-date="disabledDateEndVisit"
                        field="start_date"
                        @clear-data="clearData('end_order_date')"
                      />
                    </ClientOnly>
                  </el-form-item>
                </div>
              </div>
              <div class="btn-search">
                <ButtonSearch
                  :loading="isLoadingSearch"
                  :name="$t('button_search')"
                  @click="handleSearch"
                />
              </div>
            </div>
          </el-form>
          <div class="d-flex justify-content-between">
            <div></div>
            <el-form-item>
              <client-only>
                <el-radio-group v-model="tabPosition" @change="handleChangeTab">
                  <el-radio-button>
                    {{ $t("all") }}
                  </el-radio-button>
                  <el-radio-button :label="TYPE_MONTH">
                    {{ $t("monthly") }}
                  </el-radio-button>
                  <el-radio-button :label="TYPE_WEEK">
                    {{ $t("weekly") }}
                  </el-radio-button>
                  <el-radio-button :label="TYPE_DAY">
                    {{ $t("daily") }}
                  </el-radio-button>
                </el-radio-group>
              </client-only>
            </el-form-item>
          </div>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <client-only>
          <el-table
            v-if="!tabPosition"
            v-loading="isLoadingTable"
            class="table-content"
            :data="tableData"
            border
            :empty-text="noData"
            max-height="calc(100vh - 58px - 70px - 192px - 100px)"
            cell-class-name="text-row-2"
            @sort-change="headerSort"
          >
            <el-table-column
              min-width="110px"
              :label="$t('booking_number')"
              prop="reservation_code"
            >
              <template #default="scope">
                {{ scope.row?.reservation?.reservation_code }}</template
              >
            </el-table-column>
            <el-table-column
              min-width="125px"
              :label="$t('customer_name')"
              prop="order_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span>{{ scope.row?.reservation?.name }}</span>
                <span v-if="scope.row.reservation.order_name_kana">
                  ({{ scope.row?.reservation?.order_name_kana }})</span
                >
              </template>
            </el-table-column>
            <el-table-column
              v-if="typeStore !== EVENT"
              min-width="320px"
              :label="
                typeStore !== SALON ? $t('course_name') : $t('course_tab_menu')
              "
              class-name="show-full-data"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    getCourseMenuBooking(
                      scope.row?.reservation.booking_detail?.course?.name,
                      scope.row?.reservation.booking_detail?.menus
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              min-width="320px"
              :label="$t('event')"
              class-name="show-full-data"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row?.reservation.booking_detail?.event.name }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              width="150px"
              :label="$t('amount_money')"
              align="right"
              header-align="left"
              prop="amount"
            >
              <template #default="scope">
                {{ scope.row?.amount > 0 ? priceDisplay(scope.row?.amount) : 0
                }}{{ $t("yen") }}
              </template>
            </el-table-column>
            <el-table-column
              width="160px"
              :label="$t('payment_type')"
              prop="payment_type"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    findObj(PaymentMethod, "value", scope.row?.payment_type)
                      ?.label
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              width="140px"
              :label="$t('payment_date_time')"
              prop="paid_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span>
                  {{ formatDate(scope.row?.paid_at, "YYYY年MM月DD日") }}</span
                >
              </template>
            </el-table-column>

            <el-table-column
              width="140px"
              :label="$t('sales_date')"
              prop="created_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span>
                  {{
                    formatDate(scope.row?.created_at, "YYYY年MM月DD日")
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              width="105px"
              :label="$t('action')"
            >
              <template #default="scope">
                <icon-edit
                  class="icon-button button-edit group-button"
                  @click="
                    $router.push({
                      name: 'invoices-edit-id',
                      params: { id: scope.row.id },
                    })
                  "
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <InvoiceTable
        v-if="tabPosition"
        ref="_refTable"
        v-loading="isLoadingTable"
        :no-data="noData"
        :mode="tabPosition"
        :table-data="tableData"
        @header-sort="headerSortTable"
        @sort-table="sortTable"
      ></InvoiceTable>
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            v-if="pagination.total"
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { formatDate } from "~/../../src/shared/utils/format";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import { SORT_ORDER, STORE_PAGINATION } from "~/../../src/shared/constants";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import ButtonSearch from "../../../shared/components/button/Search.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  PaymentMethod,
  searchDatePayment,
} from "../../../shared/constants/payment";
import moment from "moment/moment";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { InvoiceInterface } from "../../models/invoice";
import { findObj } from "~/../../src/shared/utils/array";
import { useRouter } from "#imports";
import {
  exportFile,
  getEndDate,
  getTypeSort,
  getStartDate,
  totalPriceCourseMenuStaff,
} from "~/../../src/shared/utils";
import { messageError } from "~/../../src/shared/utils/notification";
import { TYPE_DAY, TYPE_MONTH, TYPE_WEEK } from "~/../../src/shared/constants";
import priceDisplay from "../../../shared/utils/price";
import InputText from "../../../shared/components/input/InputText.vue";
import CustomDatePicker from "~/../../src/shared/components/input/CustomDatePicker.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { EVENT, SALON } from "~/../../src/shared/constants/category";

const typeStore = useMeStore().getStoreType;
const format = ref("YYYY年MM月DD日");
const type = ref("date");
const router = useRouter();
const tabPosition = ref();
const dataTableStore = DataTableStore();
const { t } = i18n.global;
const tableData = ref([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isLoadingExport = ref(false);
const noData = ref(t("no_data"));
const invoicesData = ref<InvoiceInterface[]>();
const _refTable = ref();
const formResultAfterSubmitSearch = ref(null);

const formSearch = ref({
  keyword: null,
  course_name: "",
  payment_type: null,
  start_date: null,
  end_date: null,
  start_order_date: null,
  end_order_date: null,
  search_type: searchDatePayment.DATE_TIME,
});

const handleChangeSearchDate = () => {
  if (formSearch.value.search_type === searchDatePayment.DATE_TIME) {
    formSearch.value.start_order_date = null;
    formSearch.value.end_order_date = null;
  } else {
    formSearch.value.start_date = null;
    formSearch.value.end_date = null;
  }
};

const handleChangeTab = async () => {
  sortTable.order_by = "";
  pagination.currentPage = 1;
  if (tabPosition.value === TYPE_WEEK) {
    sortTable.mode = "week";
    type.value = "week";
    format.value = "YYYY年ww週　(MM/DD～)";
  } else if (tabPosition.value === TYPE_MONTH) {
    sortTable.mode = "month";
    format.value = "YYYY年MM月";
    type.value = "month";
  } else if (tabPosition.value === TYPE_DAY) {
    sortTable.mode = "day";
    format.value = "YYYY年MM月DD日";
    type.value = "date";
  } else {
    sortTable.mode = null;
    format.value = "YYYY年MM月DD日";
    type.value = "date";
  }
  await getDataInvoice();
};

const clearData = (field: string) => {
  formSearch.value[field] = null;
};

const getTypeDatePicker = computed(() => {
  return sortTable.mode === null || sortTable.mode === TYPE_DAY
    ? "date"
    : sortTable.mode;
});

const disabledDateStartPayment = (time: Date) => {
  if (tabPosition.value !== TYPE_DAY) {
    if (formSearch.value.end_date) {
      return moment(time) > moment(formSearch.value.end_date);
    }
  } else {
    if (formSearch.value.end_date) {
      return (
        moment(time) > moment(formSearch.value.end_date) ||
        moment(time) < moment(formSearch.value.end_date).subtract(2, "month")
      );
    }
  }
  return false;
};

const disabledDateEndPayment = (time: Date) => {
  if (tabPosition.value !== TYPE_DAY) {
    if (formSearch.value.start_date) {
      return moment(time) < moment(formSearch.value.start_date);
    }
  } else {
    if (formSearch.value.start_date) {
      return (
        moment(time) < moment(formSearch.value.start_date) ||
        moment(time) > moment(formSearch.value.start_date).add(2, "month")
      );
    }
  }
  return false;
};

const disabledDateStartVisit = (time: Date) => {
  if (tabPosition.value !== TYPE_DAY) {
    if (formSearch.value.end_order_date) {
      return moment(time) > moment(formSearch.value.end_order_date);
    }
  } else {
    if (formSearch.value.end_order_date) {
      return (
        moment(time) > moment(formSearch.value.end_order_date) ||
        moment(time) <
          moment(formSearch.value.end_order_date).subtract(2, "month")
      );
    }
  }
  return false;
};

const disabledDateEndVisit = (time: Date) => {
  if (tabPosition.value !== TYPE_DAY) {
    if (formSearch.value.start_order_date) {
      return moment(time) < moment(formSearch.value.start_order_date);
    }
  } else {
    if (formSearch.value.start_order_date) {
      return (
        moment(time) < moment(formSearch.value.start_order_date) ||
        moment(time) > moment(formSearch.value.start_order_date).add(2, "month")
      );
    }
  }
  return false;
};

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: STORE_PAGINATION.PER_PAGE,
});

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
  mode: null,
});

const getDataInvoice = async () => {
  tableData.value = [];
  try {
    isLoadingTable.value = true;
    const invoiceData = (
      await InvoiceRequest.list<InvoiceInterface[]>({
        ...formSearch.value,
        ...sortTable,
        end_date: getEndDate(sortTable.mode, formSearch.value.end_date),
        start_date: getStartDate(sortTable.mode, formSearch.value.start_date),
        start_order_date: getStartDate(
          sortTable.mode,
          formSearch.value.start_order_date
        ),
        end_order_date: getEndDate(
          sortTable.mode,
          formSearch.value.end_order_date
        ),
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = invoiceData?.data;
    pagination.total = invoiceData?.pagination.total;
    pagination.currentPage = invoiceData?.pagination.current_page;
    pagination.numberRecordPerPage = invoiceData?.pagination.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const addConditionSearchStore = () => {
  dataTableStore.invoiceList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataInvoice();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!invoicesData.value?.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStore();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  isLoadingTable.value = true;
  pagination.currentPage = 1;
  await getDataInvoice();
  addConditionSearchStore();
  isLoadingTable.value = false;
};

const headerSortTable = async ({
  prop,
  order,
}: {
  prop: string;
  order: string;
}) => {
  if (tabPosition.value) {
    sortTable.order_by = "created_at";
  } else {
    sortTable.order_by = prop;
  }

  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  isLoadingTable.value = true;
  pagination.currentPage = 1;
  await getDataInvoice();
  addConditionSearchStore();
  isLoadingTable.value = false;
};

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getDataInvoice();
  addConditionSearchStore();
  isLoadingTable.value = false;
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  isLoadingTable.value = true;
  await getDataInvoice();
  addConditionSearchStore();
  isLoadingTable.value = false;
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const params = {
      ...formResultAfterSubmitSearch.value,
      ...sortTable,
      end_date: getEndDate(sortTable.mode, formSearch.value.end_date),
      end_order_date: getEndDate(
        sortTable.mode,
        formSearch.value.end_order_date
      ),
      start_date: getStartDate(sortTable.mode, formSearch.value.start_date),
      start_order_date: getStartDate(
        sortTable.mode,
        formSearch.value.start_order_date
      ),
    };

    const res = await InvoiceRequest.export(params);
    if (res) {
      exportFile(res, getNameCSV());
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const getNameCSV = () => {
  if (tabPosition.value === TYPE_MONTH) {
    return "S017_売上一覧画面_月別";
  } else if (tabPosition.value === TYPE_WEEK) {
    return "S017_売上一覧画面_週別";
  } else if (tabPosition.value === TYPE_DAY) {
    return "S017_売上一覧画面_日別";
  } else {
    return "S017_売上一覧画面_すべて";
  }
};

onMounted(async () => {
  if (dataTableStore.invoiceList?.search) {
    formSearch.value = dataTableStore.invoiceList.search;
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
  }
  if (dataTableStore.invoiceList?.sort) {
    sortTable.order_by = dataTableStore.invoiceList.sort.order_by;
    sortTable.direct = dataTableStore.invoiceList.sort.direct;
  } else {
    sortTable.order_by = "created_at";
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = dataTableStore.invoiceList?.currentPage;
  pagination.numberRecordPerPage = dataTableStore.invoiceList?.pageSize;
  await getDataInvoice();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.form-search) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }
  .el-input {
    width: 274px;
  }

  .el-select {
    .el-input {
      width: 274px;
    }
  }

  .group-radio-date {
    display: flex;
    align-items: center;
    gap: 15px;

    .group-form-date {
      height: 40px;
    }

    .radio-button {
      gap: 15px;
    }

    .date-group {
      .input-date {
        width: 200px;
        margin-right: 12px;
      }
      .el-input {
        width: 190px;
      }
    }
  }
}

:deep(.btn-edit) {
  td {
    text-align: center;
  }
}

:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
  height: 40px;
}

:deep(.el-radio-button) {
  padding: 2px 4px;
  background-color: $gray-90;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: 0 0 0 0
    var(--el-radio-button-checked-border-color, var(--el-color-primary));
}

:deep(.el-radio-button:first-child) {
  border-radius: 4px 0 0 4px;

  .el-radio-button__inner {
    box-shadow: white;
    border-right: 2px;
    border-radius: 2px;
    border-left: 0;
  }
}

:deep(.el-radio-button:last-child) {
  border-radius: 0 4px 4px 0;

  .el-radio-button__inner {
    box-shadow: white;
    border-right: 2px;
    border-radius: 2px;
    border-left: 0;
  }
}

:deep(.el-radio-button__inner) {
  background-color: $gray-90;
  color: $black-80;
  border: 0;
}

:deep(svg) {
  cursor: pointer;

  &:hover {
    path {
      fill: #0071bcff;
    }
  }
}

:deep(.is-active) {
  .el-radio-button__inner {
    background-color: $white-color;
    color: $black-80;
    border-color: $white-color;
    border-radius: 2px;
  }
}

.footer {
  background-color: $white-color;
}
</style>
