<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.list_recruitment") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_recruitment") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="
              $router.push({ name: 'recruitment-information-setting-create' })
            "
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
            <el-form-item :label="$t('keyword_search')">
              <InputText
                v-model="formSearch.keyword"
                :placeholder="$t('placeholder.occupation_and_content')"
              />
            </el-form-item>
            <el-form-item :label="$t('status')">
              <client-only>
                <el-select
                  v-model="formSearch.enable"
                  :placeholder="$t('placeholder.applicable_course')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in STATUS_RECRUITMENT_DATA"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item class="date-group" :label="$t('display_period')">
              <client-only
                ><el-date-picker
                  v-model="formSearch.start_date"
                  :editable="false"
                  :disabled-date="disabledDateStart"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  class="input-date"
                  :placeholder="$t('start_date')"
              /></client-only>
              <client-only
                ><el-date-picker
                  v-model="formSearch.end_date"
                  :editable="false"
                  :disabled-date="disabledDateEnd"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  :placeholder="$t('end_date')"
              /></client-only>
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
        <client-only>
          <DragTable
            :animate="500"
            handle=".handle"
            @change-index="changeIndex"
          >
            <template #tableName="{ setRef }">
              <el-table
                :ref="(el) => setRef(el)"
                v-el-table-infinite-scroll="load"
                v-loading="isLoadingTable"
                :infinite-scroll-disabled="disabledLoad"
                class="table-content"
                :data="recruitmentsData"
                border
                :empty-text="noData"
                max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 120px - 72px - 20px)"
                cell-class-name="text-row-2"
                row-class-name="table-row"
                @sort-change="headerSort"
              >
                <el-table-column align="center" width="80px">
                  <template #default>
                    <IconChange class="handle drag" @change="changeIndex" />
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="125px"
                  :label="$t('order')"
                  type="index"
                  :sortable="true"
                  :sort-orders="['ascending', 'descending']"
                />
                <el-table-column
                  min-width="200px"
                  :label="$t('occupation')"
                  prop="job_title"
                />
                <el-table-column
                  width="150px"
                  :label="$t('recruitment_details')"
                  prop="recruitment_detail"
                />
                <el-table-column
                  width="280px"
                  :label="$t('display_period')"
                  prop="period"
                >
                  <template #default="scope">
                    <span
                      >{{ formatDate(scope.row.start_date) }} -
                      {{ formatDate(scope.row.end_date) }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  width="120px"
                  :label="$t('working_hours')"
                  prop="working_time"
                />
                <el-table-column
                  width="140px"
                  align="right"
                  header-align="left"
                  :label="$t('salary')"
                  prop="salary"
                >
                </el-table-column>
                <el-table-column
                  width="140px"
                  :label="$t('created_at')"
                  prop="created_at"
                >
                  <template #default="scope">
                    <span> {{ formatDate(scope.row.created_at) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="140px"
                  :label="$t('status')"
                  prop="enable"
                >
                  <template #default="scope">
                    <span>
                      {{
                        findObj(
                          STATUS_RECRUITMENT_DATA,
                          "value",
                          scope.row.enable
                        )?.label
                      }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  width="140px"
                  :label="$t('manager')"
                  prop="manager"
                />
                <el-table-column
                  width="180px"
                  :label="$t('contact_information')"
                  prop="contact"
                />
                <el-table-column
                  align="center"
                  width="105px"
                  :label="$t('action')"
                  class-name="custom-action"
                  fixed="right"
                >
                  <template #default="scope">
                    <div class="group-action">
                      <icon-edit
                        class="icon-button button-edit group-button"
                        @click="
                          $router.push({
                            name: 'recruitment-information-setting-edit-id',
                            params: { id: scope.row.id },
                          })
                        "
                      />
                      <icon-delete @click="deleteRecord(scope.row.id)" />
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
            </template>
          </DragTable>
        </client-only>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { formatDate } from "~/../../src/shared/utils/format";
import { DEFAULT_PAGE_RECRUITMENT } from "~/../../src/store/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import ButtonAdd from "~/../../src/shared/components/button/ButtonAdd.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import RecruitmentRequest from "~/../../src/shared/requests/RecruitmentRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { getPageDelete, getTypeSort } from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { customTrimValue } from "~/../../src/shared/utils";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import moment from "moment/moment";
import priceDisplay from "../../../shared/utils/price";
import DragTable from "~/../../src/shared/components/common/DragTable.vue";
import { STATUS_RECRUITMENT_DATA } from "~/../../src/shared/constants/recruitment";
import { onBeforeMount } from "#imports";
import { findObj } from "../../../shared/utils";
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";
import useRecruitment from "~/../../src/store/composables/useRecruitment";

useRecruitment();

const dataTableStore = DataTableStore();
const { t } = i18n.global;
const recruitmentsData = ref<[]>([]);
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isShowModalConfirm = ref(false);
const noData = ref(t("no_data"));
const idDeleteRecord = ref(0);
const el = ref(null);

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: DEFAULT_PAGE_RECRUITMENT,
  lastPage: 1,
});

const disabledLoad = computed(
  () => isLoadingTable.value || pagination.currentPage === pagination.lastPage
);

const load = async () => {
  if (disabledLoad.value) return;

  pagination.currentPage++;
  await getListRecruitment();
};

const formSearch = ref({
  keyword: null,
  enable: null,
  start_date: null,
  end_date: null,
});

const sortTable = reactive({
  order_by: "id",
  direct: SORT_ORDER.ASC,
});

const isChangeIndex = ref(false);

const changeIndex = async ({ id, index }) => {
  isChangeIndex.value = true;
  isLoadingTable.value = true;
  recruitmentsData.value = [];
  try {
    await RecruitmentRequest.reOrderIndex(id, index);
    await getListRecruitment();
  } finally {
    isChangeIndex.value = false;
  }
};

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const disabledDateStart = (time: Date) => {
  return (
    formSearch.value.end_date &&
    moment(time) > moment(formSearch.value.end_date)
  );
};

const disabledDateEnd = (time: Date) => {
  return (
    formSearch.value.start_date &&
    moment(time).isSameOrBefore(
      moment(formSearch.value.start_date).subtract(1, "day")
    )
  );
};

onBeforeMount(async () => {
  if (dataTableStore.recruitmentList?.search) {
    formSearch.value = dataTableStore.recruitmentList.search;
  }

  if (dataTableStore.recruitmentList?.sort) {
    sortTable.order_by = dataTableStore.recruitmentList.sort.order_by;
    sortTable.direct = dataTableStore.recruitmentList.sort.direct;
  }
  await getListRecruitment();
});

const formResultAfterSubmitSearch = ref(null);

const getListRecruitment = async () => {
  isLoadingTable.value = true;
  let recruitmentResponse = (
    await RecruitmentRequest.list<[]>({
      ...formSearch.value,
      ...sortTable,
      page:
        isChangeIndex.value || isLoadingSearch.value
          ? 1
          : pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    })
  ).data;

  if (isChangeIndex.value) {
    recruitmentsData.value = recruitmentResponse.data;
    disabledLoad.value = false;
  } else {
    recruitmentsData.value.push(...recruitmentResponse.data);
  }
  isLoadingTable.value = false;
  pagination.total = recruitmentResponse?.pagination.total;
  pagination.currentPage = recruitmentResponse?.pagination.current_page;
  pagination.numberRecordPerPage = recruitmentResponse?.pagination.per_page;
  pagination.lastPage = recruitmentResponse?.pagination.last_page;
};

const addConditionSearchRecruitment = () => {
  dataTableStore.recruitmentList = {
    search: formSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const handleSearch = async () => {
  recruitmentsData.value = [];
  disabledLoad.value = false;
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getListRecruitment();
    formResultAfterSubmitSearch.value = customTrimValue(formSearch.value);
    if (!recruitmentsData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchRecruitment();
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
    await getListRecruitment();
    addConditionSearchRecruitment();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListRecruitment();
    addConditionSearchRecruitment();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListRecruitment();
    addConditionSearchRecruitment();
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
    await RecruitmentRequest.delete(idDeleteRecord.value);
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      recruitmentsData.value
    );
    await getListRecruitment();
    deleteSuccess();
  } catch (e) {
    deleteError();
  } finally {
    idDeleteRecord.value = 0;
    isLoadingTable.value = false;
    isShowModalConfirm.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.form-search) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }

  .el-input {
    width: 274px;
  }

  .recruitment-name {
    width: 310px;
  }

  .el-select {
    .el-input {
      width: 120px;
    }
  }

  .date-group {
    .input-date {
      margin-right: 12px;
    }

    .el-input {
      width: 170px;
    }
  }
}

:deep(.drag) {
  cursor: pointer;
}

:deep(.el-scrollbar) {
  .el-scrollbar__wrap {
    height: auto !important;
  }
}
</style>
