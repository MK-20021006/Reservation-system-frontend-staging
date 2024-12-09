<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.list_event") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_event") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'store-event-create' })"
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
            <el-form-item :label="$t('event')">
              <InputText v-model="formSearch.name" :placeholder="$t('event')" />
            </el-form-item>
            <el-form-item :label="$t('publish')">
              <client-only>
                <el-select
                  v-model="formSearch.published"
                  :placeholder="$t('publish')"
                >
                  <el-option :label="$t('all')" :value="null" />
                  <el-option
                    v-for="item in DATA_STATUS_TYPE"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <!--            <el-form-item :label="$t('reservation_type')">-->
            <!--              <client-only>-->
            <!--                <el-select-->
            <!--                  v-model="formSearch.reservation_type"-->
            <!--                  :placeholder="$t('reservation_type')"-->
            <!--                >-->
            <!--                  <el-option :value="null" :label="$t('all')"></el-option>-->
            <!--                  <el-option-->
            <!--                    v-for="item in reservationTypeOptions"-->
            <!--                    :key="item.value"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value"-->
            <!--                  >-->
            <!--                  </el-option>-->
            <!--                </el-select>-->
            <!--              </client-only>-->
            <!--            </el-form-item>-->

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
          :data="eventsData"
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
            min-width="120px"
            :label="$t('event')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="200px"
            :label="$t('company')"
            prop="description"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />

          <el-table-column
            min-width="100px"
            :label="$t('reservable_number')"
            prop="number_seats"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            header-align="left"
            align="right"
          />
          <el-table-column
            min-width="170px"
            :label="$t('booking.fee')"
            header-align="left"
          >
            <template #default="scope">
              <div class="group-fee">
                <div>
                  {{
                    scope.row.fee_type === TYPE_FEE.AGE
                      ? $t("adult")
                      : $t("male")
                  }}
                </div>
                <div>{{ priceDisplay(scope.row?.price) }}{{ $t("yen") }}</div>
              </div>
              <div class="group-fee">
                <div>
                  {{
                    scope.row.fee_type === TYPE_FEE.AGE
                      ? $t("child")
                      : $t("female")
                  }}
                </div>
                <div>
                  {{ priceDisplay(scope.row?.price_children) }}{{ $t("yen") }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="260px"
            :label="$t('valid_period')"
            prop="start_date"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span v-if="scope.row.start_date || scope.row.end_date">
                {{ formatDate(scope.row.start_date) }}～{{
                  formatDate(scope.row.end_date)
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            width="130px"
            :label="$t('reservation_type')"
            prop="reservation_type"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{
                  $t(
                    findObj(
                      reservationTypeOptions,
                      "value",
                      scope.row.reservation_type
                    )?.label
                  )
                }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            width="140px"
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
          <el-table-column
            width="110px"
            :label="$t('action')"
            class-name="custom-action"
            fixed="right"
          >
            <template #default="scope">
              <div class="group-action">
                <icon-edit
                  v-if="hasPermEventEdit"
                  @click="
                    $router.push({
                      name: 'store-event-edit-id',
                      params: { id: scope.row.id },
                    })
                  "
                />
                <icon-delete
                  v-if="hasPermEventDelete"
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
          <CommonPagination
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
import { EventInterface } from "~/../../src/store/models/event";
import { formatDate } from "~/../../src/shared/utils/format";
import { DEFAULT_PAGE } from "~/../../src/store/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import ButtonSearch from "../../../../shared/components/button/Search.vue";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { getPageDelete, customIndex } from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { customTrimValue } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import InputText from "../../../../shared/components/input/InputText.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { EVENT } from "~/../../src/shared/constants/category";
import { DATA_STATUS_TYPE } from "~/../../src/shared/constants/reservation";
import { TYPE_FEE } from "~/../../src/shared/constants/event";
import { reservationTypeOptions } from "~/../../src/shared/constants/reservation";
import { findObj } from "~/../../src/shared/utils";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

useHavePermission(Permission.EventList);
const hasPermEventEdit = useHavePermission(Permission.EventEdit, false);
const hasPermEventDelete = useHavePermission(Permission.EventDelete, false);

useHasTypeStore([EVENT]);

const dataTableStore = DataTableStore();
const { t } = i18n.global;
const eventsData = ref<EventInterface[]>();
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isShowModalConfirm = ref(false);
const noData = ref(t("no_data"));
const idDeleteRecord = ref(0);

const formSearch = ref({
  name: null,
  published: null,
  reservation_type: null,
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

const getListEvent = async () => {
  isLoadingTable.value = true;
  let eventResponse = (
    await EventRequest.list<EventInterface[]>({
      ...formSearch.value,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    })
  ).data;
  if (!eventResponse.data.length && pagination.currentPage !== 1) {
    pagination.currentPage = pagination.currentPage - 1;
    eventResponse = (
      await EventRequest.list<EventInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
  }
  eventsData.value = eventResponse?.data;

  isLoadingTable.value = false;
  pagination.total = eventResponse?.pagination.total;
  pagination.currentPage = eventResponse?.pagination.current_page;
  pagination.numberRecordPerPage = eventResponse?.pagination.per_page;
};

const addConditionSearchEvent = () => {
  dataTableStore.eventList = {
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
    await getListEvent();
    formResultAfterSubmitSearch.value = customTrimValue(formSearch.value);
    if (!eventsData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchEvent();
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
    await getListEvent();
    addConditionSearchEvent();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListEvent();
    addConditionSearchEvent();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListEvent();
    addConditionSearchEvent();
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
    await EventRequest.delete(idDeleteRecord.value);
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      eventsData.value
    );
    await getListEvent();
    deleteSuccess();
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
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
  if (dataTableStore.eventList?.search) {
    formSearch.value = dataTableStore?.eventList.search;
  }
  if (dataTableStore.eventList?.sort) {
    sortTable.order_by = dataTableStore?.eventList.sort.order_by;
    sortTable.direct = dataTableStore?.eventList.sort.direct;
  }
  pagination.currentPage = dataTableStore.eventList?.currentPage;
  pagination.numberRecordPerPage = dataTableStore.eventList?.pageSize;
  await getListEvent();
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

:deep(.group-fee) {
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 15px;
  }
}
</style>
