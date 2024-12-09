<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.customer_list") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.customer_list") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'customer-create' })"
          />
          <input-import-file
            :data="file"
            :is-import-file="isImportFile"
            @handle-change-file="importFile"
          />
          <ButtonExport
            :name="$t('button.download_template')"
            :loading="isLoadingExport"
            @click="handleExport"
          />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            inline
            class="form-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('full_name_kanji')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('full_name_kanji')"
              />
            </el-form-item>
            <el-form-item :label="$t('phone_number')">
              <InputText
                v-model="formSearch.phone_number"
                :placeholder="$t('phone_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('email_address')">
              <InputText
                v-model="formSearch.email"
                :placeholder="$t('placeholder.email')"
              />
            </el-form-item>
            <el-form-item :label="$t('type_login')">
              <client-only>
                <el-select v-model="formSearch.login_type">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in typeLoginOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <ButtonSearch :loading="loadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <client-only>
          <el-table
            v-loading="isLoadingTable"
            class="table-content"
            :data="tableData"
            border
            row-class-name="table-row"
            header-row-class-name="table-header"
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px)"
            cell-class-name="text-row-2"
            :empty-text="noData"
            @sort-change="headerSort"
          >
            <el-table-column
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndex"
            />
            <el-table-column
              :label="$t('full_name_kanji')"
              class="column-point"
              min-width="160px"
              prop="name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis"> {{ scope.row.name }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('email_address')"
              class="column-point"
              min-width="200px"
              prop="email"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            />
            <el-table-column
              :label="$t('phone_number')"
              class="column-point"
              min-width="130px"
              prop="phone_number"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.phone_number }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('gender')"
              min-width="130px"
              prop="gender"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{
                  scope.row.gender !== null
                    ? $t(
                        findObj(genderOptions, "value", scope.row.gender)
                          ? findObj(genderOptions, "value", scope.row.gender)
                              .label
                          : ""
                      )
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('birthday')"
              width="180px"
              prop="birth_day"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{ formatDate(scope.row.birth_day, "YYYY年MM月DD日") }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('address1')"
              min-width="190px"
              prop="address"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('address2')"
              min-width="190px"
              prop="address_detail"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                {{ scope.row.address_detail }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('type_login')"
              class="column-point"
              min-width="150px"
              prop="login_type"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div class="login-type">
                  <component
                    :is="checkIconLogin(scope.row.login_type)"
                    class="icon-login-type"
                  ></component>
                  <span class="ellipsis">
                    {{
                      scope.row.login_type !== null
                        ? $t(
                            findObj(
                              typeLoginOptions,
                              "value",
                              scope.row.login_type
                            ) !== null
                              ? findObj(
                                  typeLoginOptions,
                                  "value",
                                  scope.row.login_type
                                )?.label
                              : ""
                          )
                        : ""
                    }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.access_log')"
              class="column-point"
              min-width="120px"
              prop="total_visited"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ priceDisplay(scope.row.total_visited) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('store.last_visit')"
              class="column-point"
              width="200px"
              prop="last_visited"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{
                    formatDate(
                      scope.row.last_visited,
                      "YYYY年MM月DD日 HH:mm:ss"
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('action')"
              align="center"
              min-width="110px"
              fixed="right"
            >
              <template #default="scope">
                <IconEdit
                  class="icon-button button-edit"
                  @click="editCustomer(scope.row.id, scope.row.type)"
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <ConfirmPlan
        :dialog-visible="isShowModalPlanConfirm"
        @handle-close="handleCloseModalPlan"
        @handle-confirm="handleConfirmModalPlan"
      />
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
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
import { onMounted, reactive, ref } from "vue";
import CustomerRequest from "~/../../src/shared/requests/CustomerRequest";
import { typeLoginOptions } from "~/../../src/shared/constants/typeLogin";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants/pagination";
import { useRouter } from "nuxt/app";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { findObj } from "~/../../src/shared/utils/array";
import { genderOptions } from "~/../../src/shared/constants/user";
import InputImportFile from "~/../../src/shared/components/input/ImportFile.vue";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { exportFile } from "~/../../src/shared/utils";
import { customIndex } from "~/../../src/shared/utils";
import {
  importSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { checkIconLogin } from "~/../../src/shared/composables/loginType";
import priceDisplay from "~/../../src/shared/utils/price";
import { fullAddress } from "~/../../src/shared/utils";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import ButtonAdd from "~/../../src/shared/components/button/ButtonAdd.vue";

const { t } = i18n.global;
const router = useRouter();
const tableData = ref([]);
const dataTableStore = DataTableStore();
const isLoadingTable = ref(false);
const loadingSearch = ref(false);
const isImportFile = ref(false);
const isLoadingExport = ref(false);
const file = ref([]);
const noData = ref(t("no_data"));
const formResultAfterSubmitSearch = ref(null);
const isShowModalPlanConfirm = ref(false);
const formSearch = ref({
  id: null,
  name: "",
  phone_number: "",
  email: "",
  login_type: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const res: any = await CustomerRequest.exportCustomer({});
    if (res) {
      exportFile(res, "S057_顧客一覧画面");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const addConditionSearchStore = () => {
  dataTableStore.customerList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const importFile = async (file) => {
  const body = new FormData();
  body.append("file", file.raw);
  try {
    isImportFile.value = true;
    await CustomerRequest.importFile(body);
    await getDataCustomers();
    importSuccess();
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      messageError(e.response._data?.message);
    } else if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
      isShowModalPlanConfirm.value = true;
    }
  } finally {
    isImportFile.value = false;
  }
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const handleCurrentChange = async (val) => {
  pagination.currentPage = val;
  await getDataCustomers();
  addConditionSearchStore();
};

const handleSizeChange = async (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  await getDataCustomers();
  addConditionSearchStore();
};

const handleSearch = async () => {
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  loadingSearch.value = true;
  await getDataCustomers();
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
  if (!tableData.value?.length) {
    noData.value = t("no_result");
  }
  addConditionSearchStore();
  loadingSearch.value = false;
  isLoadingTable.value = false;
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  await getDataCustomers();
  addConditionSearchStore();
};

const editCustomer = (id, type) => {
  router.push(`/customer/detail/${id}?type=${type}`);
};

const getDataCustomers = async () => {
  try {
    isLoadingTable.value = true;
    const params = {
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    };
    const data = await CustomerRequest.list(params);
    if (loadingSearch.value && !data.data) {
      noData.value = t("no_result");
    }
    tableData.value = data.data?.data;
    pagination.total = data.data?.total;
    pagination.currentPage = data.data?.current_page;
    pagination.numberRecordPerPage = data.data?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (dataTableStore.customerList?.search) {
    formSearch.value = dataTableStore.customerList.search;
    pagination.currentPage = dataTableStore.customerList.currentPage;
    pagination.numberRecordPerPage = dataTableStore.customerList.pageSize;
  }
  if (dataTableStore.customerList?.sort) {
    sortTable.order_by = dataTableStore.customerList.sort.order_by;
    sortTable.direct = dataTableStore.customerList.sort.direct;
  }
  await getDataCustomers();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.search) .el-input {
  width: 200px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}

:deep(.btn-add) {
  background-color: #00a99d;
  border-color: #00a99d;
}

.login-type {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
