<template>
  <ListScreenComponent class="booking-list">
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("store.device.title_screen") }}</Title
        >
      </Head>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            inline
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <!-- START Search for user name or reservation code -->
            <el-form-item :label="$t('device_name')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('device_name')"
                :width="'194px'"
              />
            </el-form-item>
            <!-- END Search for user name or reservation code -->
            <!-- START  status -->
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select v-model="formSearch.status">
                  <el-option value="" :label="$t('all')" />
                  <el-option
                    v-for="item in displayOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END  status -->
            <ButtonSearch
              :loading="isLoadingSearch"
              :name="$t('button_search')"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <!-- START custom table -->
      <div class="custom-table">
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :data="listDevice"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 40px - 10px - 20px - 34px - 16px - 58px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          :default-sort="defaultSort"
          @sort-change="headerSort"
        >
          <!-- START reservation code -->
          <el-table-column
            width="100px"
            :label="$t('order')"
            type="index"
            :index="columnIndex"
          />
          <!-- START device name -->
          <el-table-column
            width="120px"
            :label="$t('device_name')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <!-- END device code -->
          <!-- START order name -->
          <el-table-column min-width="150px" :label="$t('description')">
            <template #default="scope">
              <span> {{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <!-- END order_name -->
          <!-- START situation -->
          <el-table-column width="190px" :label="$t('quantity')">
            <template #default="scope">
              <span>{{
                scope.row.quantity !== null
                  ? priceDisplay(scope.row.quantity)
                  : $t("unlimited")
              }}</span>
            </template>
          </el-table-column>
          <!-- END situation -->
          <!-- START date of visit -->
          <el-table-column width="200px" :label="$t('status')">
            <template #default="scope">
              <span>{{
                $t(findObj(displayOptions, "value", scope.row.status)?.label)
              }}</span>
            </template>
          </el-table-column>
          <!-- END date of visit -->
          <!-- START event name -->
          <el-table-column
            width="320px"
            :label="
              typeStore !== SALON
                ? $t('store.device.correspondence_course')
                : $t('store.device.correspondence_coupon')
            "
          >
            <template #default="scope">
              <span>
                {{
                  scope.row.all_course === true
                    ? $t("all")
                    : getCourseMenuBooking("", scope.row.courses)
                }}
              </span>
            </template>
          </el-table-column>
          <!-- END event name -->
          <!-- START total people -->
          <el-table-column
            min-width="90px"
            :label="$t('store.device.correspondence_menu')"
          >
            <template #default="scope">
              <span>
                {{
                  scope.row.all_menu === true
                    ? $t("all")
                    : getCourseMenuBooking("", scope.row.menus)
                }}</span
              >
            </template>
          </el-table-column>
          <!-- END total people -->
          <!-- START action -->
          <el-table-column
            width="120px"
            fixed="right"
            :label="$t('action')"
            class-name="custom-action"
          >
            <template #default="scope">
              <div class="group-action">
                <icon-edit @click="redirectDetail(scope.row.id)" />
                <icon-delete @click="deleteRecord(scope.row.id)" />
              </div>
            </template>
          </el-table-column>
          <!-- END action -->
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
      <!-- END custom table -->
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
import { i18n } from "~/../../src/shared/plugins/i18n";
import { SORT_ORDER, STORE_PAGINATION } from "~/../../src/shared/constants";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { useReservation } from "../../store/useReservation";
import { Device } from "~/../../src/store/models/device";
import { Appearance } from "~/../../src/store/constants";
import { getTypeSort } from "~/../../src/shared/utils";
import { displayOptions } from "~/../../src/shared/constants/status";
import DeviceRequest from "~/../../src/shared/requests/DeviceRequest";
import InputText from "../../../shared/components/input/InputText.vue";
import ButtonSearch from "../../../shared/components/button/Search.vue";
import { customIndex } from "~/../../src/shared/utils";
import { findObj } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { messageError } from "~/../../src/shared/utils/notification";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { useRouter } from "#imports";
import { useMeStore } from "~/../../src/shared/stores/me";
import { SALON } from "~/../../src/shared/constants/category";

const reservationStore = useReservation();

const { t } = i18n.global;
const isLoadingTable = ref(false);
const noData = ref(t("no_data"));
const dataTableStore = DataTableStore();
const start = ref("");
const end = ref("");
const isLoadingSearch = ref<boolean>(false);
const listDevice = ref<Device[]>([]);
const isShowModalConfirm = ref(false);
const idDevice = ref(0);
const router = useRouter();
const typeStore = useMeStore().getTypeStore;

const formSearch = ref({
  name: "",
  status: "",
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: STORE_PAGINATION.PER_PAGE,
});

const sortTable = reactive({
  order_by: "id",
  direct: SORT_ORDER.ASC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const redirectDetail = async (id: number) => {
  await router.push({
    name: "store-device-detail-id",
    params: { id: id },
  });
};

const handleSearch = async () => {
  try {
    isLoadingSearch.value = true;
    pagination.currentPage = 1;
    await getListDevice();
    addConditionSearchBooking();
    if (!listDevice.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
  }
};

const deleteRecord = async (id: number) => {
  isShowModalConfirm.value = true;
  idDevice.value = id;
};

const handleClose = () => {
  isShowModalConfirm.value = false;
  idDevice.value = 0;
};

const handleConfirm = async () => {
  try {
    isLoadingTable.value = true;
    await DeviceRequest.delete(idDevice.value);
    isShowModalConfirm.value = false;
    await getListDevice();
    deleteSuccess();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      messageError(t("cannot_be_deleted"));
    } else {
      deleteError();
    }
  } finally {
    idDevice.value = 0;
    isLoadingTable.value = false;
    isShowModalConfirm.value = false;
  }
};

const getListDevice = async () => {
  if (reservationStore.appearanceDevice === Appearance.list) {
    try {
      isLoadingTable.value = true;
      const deviceResponse = (
        await DeviceRequest.list<Device[]>({
          ...formSearch.value,
          ...sortTable,
          start_date: start.value,
          end_date: end.value,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        })
      )?.data;
      listDevice.value = deviceResponse?.data;
      pagination.total = deviceResponse?.pagination?.total;
      pagination.currentPage = deviceResponse?.pagination?.current_page;
      pagination.numberRecordPerPage = deviceResponse?.pagination?.per_page;
    } finally {
      isLoadingTable.value = false;
    }
  }
};

const addConditionSearchBooking = () => {
  dataTableStore.deviceList = {
    search: formSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
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
    await getListDevice();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListDevice();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListDevice();
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

defineExpose({
  isLoadingTable,
});

watch(
  [() => reservationStore.getActiveTime, () => reservationStore.getViewMode],
  async (value) => {
    [start.value, end.value] = reservationStore.getDateRanger();
    pagination.currentPage = 1;
    await getListDevice();
    if (!listDevice.value.length) {
      noData.value = t("no_result");
    }
  }
);

watch(
  () => reservationStore.appearanceDevice,
  async (value) => {
    if (value === Appearance.list) {
      await getListDevice();
    }
  }
);

onMounted(async () => {
  if (dataTableStore.deviceList?.search) {
    formSearch.value = dataTableStore.deviceList.search;
    pagination.currentPage = dataTableStore.deviceList.currentPage;
    pagination.numberRecordPerPage = dataTableStore.deviceList.pageSize;
  }
  if (dataTableStore.deviceList?.sort) {
    sortTable.order_by = dataTableStore.deviceList.sort.order_by;
    sortTable.direct = dataTableStore.deviceList.sort.direct;
  }
  await getListDevice();
});
</script>

<style lang="scss" scoped>
.booking-list.screen-layout:deep {
  height: calc(100% - 34px - 16px);

  .el-scrollbar.scroll-content {
    height: calc(100% - 36px - 16px);

    .content {
      padding: 0;

      :deep(.form-search) {
        &.el-form--inline .el-form-item {
          margin-right: 96px;
        }

        .el-input {
          width: 222px;
          margin-right: 0;
        }

        .el-select {
          .el-input {
            width: 134px;
          }
        }
      }
    }
  }
}
</style>
