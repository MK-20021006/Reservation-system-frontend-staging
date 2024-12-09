<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.seat_list") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.seat_list") }}</template>
        <template #button>
          <template v-if="statusConnectExternal && isSettingExternalSite">
            <span>{{ $t("integration_status") + ": " }}</span>
            <span>{{
              findObj(statusCrawlSeat, "value", statusCrawl).label
            }}</span>
            <IconSync
              :class="{ 'rotage-btn': isLoadingSyncData }"
              class="icon-sync"
              @click="syncData"
            ></IconSync>
          </template>

          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'store-seat-create' })"
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
            :model="formSearch"
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('crawler_site')">
              <el-select v-model="formSearch.type" placeholder="">
                <el-option :value="null" :label="$t('all')" />
                <el-option
                  v-for="item in SITE_DATA"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('number')">
              <InputText v-model="formSearch.id" :placeholder="$t('number')" />
            </el-form-item>
            <el-form-item :label="$t('seat_name')">
              <InputText
                v-model="formSearch.name"
                :placeholder="$t('seat_name')"
              />
            </el-form-item>
            <el-form-item :label="$t('category')">
              <ClientOnly>
                <el-select v-model="formSearch.type_seat_id" placeholder="">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in seatCategories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </ClientOnly>
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
          :data="seatsData"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          :default-sort="defaultSort"
          @sort-change="headerSort"
        >
          <el-table-column
            width="100px"
            :label="$t('order')"
            type="index"
            :index="columnIndex"
          />
          <el-table-column width="120px" :label="$t('crawler_site')">
            <template #default="scope">
              <span>{{ getNameCrawler(scope.row.crawl_site) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="90px"
            :label="$t('number')"
            prop="id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="130px"
            :label="$t('category')"
            prop="type_name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row?.model_has_type?.type?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120px"
            :label="$t('seat_name')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />

          <el-table-column
            min-width="120px"
            :label="$t('description')"
            prop="description"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="120px"
            :label="$t('number_of_people')"
            prop="capacity"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{ priceDisplay(scope.row.min_capacity) }}～{{
                priceDisplay(scope.row.capacity)
              }}
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :label="$t('store.number_table')"
            prop="quantity"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{ priceDisplay(scope.row.quantity) }}
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :label="$t('store.max_reception')"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{ priceDisplay(scope.row.capacity * scope.row.quantity) }}
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
              <span>
                {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}</span
              >
            </template>
          </el-table-column>
          <el-table-column width="180px" :label="$t('eating_log')">
            <template #default="scope">
              <span> {{ scope.row.seat_tabelog_id }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" :label="$t('store.gurunavi')">
            <template #default="scope">
              <span> {{ scope.row.seat_grunavi_id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :label="$t('action')"
            class-name="custom-action"
            fixed="right"
          >
            <template #default="scope">
              <div class="group-action">
                <template v-if="isNotCrawler(scope.row)">
                  <icon-edit
                    v-if="hasPermSeatEdit"
                    @click="
                      $router.push({
                        name: 'store-seat-edit-id',
                        params: { id: scope.row.id },
                      })
                    "
                  />
                  <icon-delete
                    v-if="hasPermSeatDelete"
                    @click="deleteRecord(scope.row.id)"
                  />
                </template>
                <template v-else-if="hasPermSeatEdit">
                  <icon-view
                    @click="
                      $router.push({
                        name: 'store-seat-edit-id',
                        params: { id: scope.row.id },
                      })
                    "
                  />
                </template>
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
import { computed, onMounted, reactive, ref } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { Seat, Type } from "~/../../src/store/models";
import { formatDate } from "~/../../src/shared/utils/format";
import { DEFAULT_PAGE } from "~/../../src/store/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import ButtonSearch from "../../../../shared/components/button/Search.vue";
import seatRequest from "~~/../../src/shared/requests/SeatRequest";
import TypeRequest from "~/../../src/shared/requests/TypeRequest";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  getPageDelete,
  getTypeSort,
  customIndex,
} from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import priceDisplay from "~/../../src/shared/utils/price";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { isNotCrawler, getNameCrawler } from "~/../../src/shared/utils/crawl";
import {
  DATA_CRAWLER_SITE,
  SITE_TYPE_GOOGLE,
  SITE_TYPE_HOTPEPPER_BEAUTY,
} from "~/../../src/shared/constants/siteCrawl";
import { useMeStore } from "~/../../src/shared/stores/me";
import { findObj } from "~/../../src/shared/utils";
import { statusCrawlSeat } from "~/../../src/shared/constants";
import storeRequest from "~/../../src/shared/requests/StoreRequest";
import useSettingExternalSite from "~/../../src/store/composables/useSettingExternalSite";

useHavePermission(Permission.SeatList);
const hasPermSeatEdit = useHavePermission(Permission.SeatEdit, false);
const hasPermSeatDelete = useHavePermission(Permission.SeatDelete, false);

useHasTypeStore([RESTAURANT]);

const dataTableStore = DataTableStore();
const { t } = i18n.global;
const seatsData = ref<Seat[]>();
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isShowModalConfirm = ref(false);
const noData = ref(t("no_data"));
const idDeleteRecord = ref(0);
const seatCategories = ref<Type[]>([]);

const statusCrawl = ref(null);
const meStore = useMeStore();
const storeId = meStore.getStoreId;
const isSettingExternalSite = Number(useMeStore().isSettingExternalSite);
const statusConnectExternal = await useSettingExternalSite(
  isSettingExternalSite,
  meStore.typeStore
);

if (isSettingExternalSite) {
  statusCrawl.value = (await storeRequest.getStatusCrawlSeat()).data.status;
}

const SITE_DATA = DATA_CRAWLER_SITE.filter(
  (item) =>
    item.id !== SITE_TYPE_GOOGLE && item.id !== SITE_TYPE_HOTPEPPER_BEAUTY
);

const formSearch = ref({
  type: null,
  id: null,
  name: "",
  type_seat_id: null,
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

const getListSeat = async () => {
  isLoadingTable.value = true;
  let seatsResponse = (
    await seatRequest.list<Seat[]>({
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    })
  ).data;
  if (!seatsResponse?.data.length && pagination.currentPage !== 1) {
    --pagination.currentPage;
    dataTableStore.seatList.currentPage = pagination.currentPage;
    seatsResponse = (
      await seatRequest.list<Seat[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
  }
  isLoadingTable.value = false;
  seatsData.value = seatsResponse?.data;
  pagination.total = seatsResponse.total;
  pagination.currentPage = seatsResponse.current_page;
  pagination.numberRecordPerPage = seatsResponse.per_page;
};

const addConditionSearchSeat = () => {
  dataTableStore.seatList = {
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
    await getListSeat();
    formResultAfterSubmitSearch.value = JSON.parse(
      JSON.stringify(formSearch.value)
    );
    if (!seatsData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchSeat();
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
    await getListSeat();
    addConditionSearchSeat();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListSeat();
    addConditionSearchSeat();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListSeat();
    addConditionSearchSeat();
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
    await seatRequest.delete(idDeleteRecord.value);
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      seatsData.value
    );
    deleteSuccess();
    dataTableStore.seatList.currentPage = pagination.currentPage;
    await getListSeat();
  } catch (e: any) {
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
const isLoadingSyncData = ref(false);

const syncData = async () => {
  isLoadingSyncData.value = true;
  try {
    await seatRequest.synchronizedData();
    statusCrawl.value = (await storeRequest.getStatusCrawlSeat()).data.status;

    await getListSeat();
  } catch (e) {}
  isLoadingSyncData.value = false;
};
const getListTypeSeat = async () => {
  seatCategories.value = (
    await TypeRequest.getAllType(MODEL_TYPE.SEAT, null, true, storeId)
  ).data;
  seatCategories.value.forEach((item) => {
    item.name = item.name + " (" + getNameCrawler(item.crawl_site) + ")";
  });
};

onMounted(async () => {
  if (dataTableStore.seatList?.search) {
    formSearch.value = dataTableStore.seatList.search;
    pagination.currentPage = dataTableStore.seatList.currentPage;
    pagination.numberRecordPerPage = dataTableStore.seatList.pageSize;
  }
  if (dataTableStore.seatList?.sort) {
    sortTable.order_by = dataTableStore.seatList.sort.order_by;
    sortTable.direct = dataTableStore.seatList.sort.direct;
  }
  await getListSeat();
  await getListTypeSeat();
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
      width: 200px;
    }
  }
}

:deep(.icon-sync) {
  cursor: pointer;
}

:deep(.group-button) {
  align-items: center;
}

.rotage-btn {
  transform: rotate(-360deg);
  transition: 1s;
}
</style>
