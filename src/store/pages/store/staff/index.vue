<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.list_staff") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_staff") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'store-staff-create' })"
          />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            label-width="120px"
            inline
            :model="formSearch"
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('store.staff_number')">
              <InputText
                v-model="formSearch.id"
                :placeholder="$t('store.staff_number')"
              />
            </el-form-item>
            <el-form-item :label="$t('store.staff_name')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('store.staff_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('store.position')">
              <InputText
                v-model="formSearch.positions"
                :placeholder="$t('store.position')"
              />
            </el-form-item>

            <ButtonSearch
              :loading="isLoadingSearch"
              :name="$t('button_search')"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :empty-text="noData"
          :data="staffsData"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
          cell-class-name="text-row-2"
          @sort-change="headerSort"
        >
          <el-table-column
            width="100px"
            :label="$t('order')"
            type="index"
            :index="columnIndex"
          />
          <el-table-column
            min-width="145px"
            :label="$t('store.staff_number')"
            prop="id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="130px"
            :label="$t('store.staff_name')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="120px"
            :label="$t('store.selfPR')"
            prop="info"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />

          <el-table-column
            min-width="120px"
            :label="$t('store.work_years')"
            prop="year_works"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="140px"
            :label="$t('store.nomination_fee')"
            prop="fee"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span> {{ priceDisplay(scope.row.fee) }}{{ $t("yen") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="130px"
            :label="$t('store.position')"
            prop="positions"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row.model_has_tag?.[0]?.tag?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="180px"
            :label="$t('created')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ formatDate(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="110px"
            :label="$t('action')"
            class-name="custom-action"
            fixed="right"
          >
            <template #default="scope">
              <div class="group-action">
                <icon-edit
                  v-if="hasPermStaffEdit"
                  @click="
                    $router.push({
                      name: 'store-staff-edit-id',
                      params: { id: scope.row.id },
                    })
                  "
                />
                <icon-delete
                  v-if="hasPermStaffDelete"
                  @click="deleteRecord(scope.row.id)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <ModalConfirm
          :dialog-visible="isShowModalConfirm"
          :title="$t('title_delete')"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          :loading="isLoadingTable"
          @handle-close="handleClose"
          @handle-confirm="handleConfirm"
        />
      </div>
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
import { onMounted, reactive, ref } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { StaffInterface } from "~/../../src/shared/models/staff";
import { formatDate } from "~/../../src/shared/utils/format";
import { DEFAULT_PAGE } from "~/../../src/store/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import ButtonSearch from "../../../../shared/components/button/Search.vue";
import StaffRequest from "~/../../src/shared/requests/StaffRequest";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { getPageDelete } from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { customTrimValue } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import InputText from "../../../../shared/components/input/InputText.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { customIndex } from "~/../../src/shared/utils";

useHavePermission(Permission.StaffList);
const hasPermStaffEdit = useHavePermission(Permission.StaffEdit, false);
const hasPermStaffDelete = useHavePermission(Permission.StaffDelete, false);
useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const dataTableStore = DataTableStore();
const { t } = i18n.global;
const staffsData = ref<StaffInterface[]>();
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isShowModalConfirm = ref(false);
const noData = ref(t("no_data"));
const idDeleteRecord = ref(0);

const formSearch = ref({
  id: null,
  name: "",
  positions: null,
});

const formResultAfterSubmitSearch = ref(null);

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: DEFAULT_PAGE,
});

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const getListStaff = async () => {
  isLoadingTable.value = true;
  let staffResponse = (
    await StaffRequest.list<StaffInterface[]>({
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    })
  ).data;
  if (!staffResponse.data.length && pagination.currentPage !== 1) {
    pagination.currentPage = pagination.currentPage - 1;
    staffResponse = (
      await StaffRequest.list<StaffInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
  }
  staffsData.value = staffResponse?.data;

  isLoadingTable.value = false;
  pagination.total = staffResponse.total;
  pagination.currentPage = staffResponse.current_page;
  pagination.numberRecordPerPage = staffResponse.per_page;
};

const addConditionSearchStaff = () => {
  dataTableStore.staffList = {
    search: formSearch.value,
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
    await getListStaff();
    formResultAfterSubmitSearch.value = customTrimValue(formSearch.value);
    if (!staffsData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchStaff();
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
  try {
    isLoadingTable.value = true;
    pagination.currentPage = 1;
    await getListStaff();
    addConditionSearchStaff();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListStaff();
    addConditionSearchStaff();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListStaff();
    addConditionSearchStaff();
  } finally {
    isLoadingTable.value = false;
  }
};

const deleteRecord = async (id: number) => {
  isShowModalConfirm.value = true;
  idDeleteRecord.value = id;
};

const handleClose = () => {
  isShowModalConfirm.value = false;
  idDeleteRecord.value = 0;
};

const handleConfirm = async () => {
  try {
    isLoadingTable.value = true;
    await StaffRequest.delete(idDeleteRecord.value);
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      staffsData.value
    );
    await getListStaff();
    deleteSuccess();
  } catch (e) {
    if (e?.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e?.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    idDeleteRecord.value = 0;
    isLoadingTable.value = false;
    isShowModalConfirm.value = false;
  }
};

onMounted(async () => {
  if (dataTableStore.staffList?.search) {
    formSearch.value = dataTableStore.staffList.search;
  }
  if (dataTableStore.staffList?.sort) {
    sortTable.order_by = dataTableStore.staffList.sort.order_by;
    sortTable.direct = dataTableStore.staffList.sort.direct;
  }
  pagination.currentPage = dataTableStore.staffList?.currentPage;
  pagination.numberRecordPerPage = dataTableStore.staffList?.pageSize;
  await getListStaff();
});
</script>

<style lang="scss" scoped>
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
}
</style>
