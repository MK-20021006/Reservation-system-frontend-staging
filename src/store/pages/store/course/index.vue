<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title v-if="storeData.getTypeStore !== SALON">
          {{ $t("site_name_title") }}{{ $t("store.list_course") }}
        </Title>
        <Title v-else>
          {{ $t("site_name_title") }}{{ $t("title_screen.list_coupon") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="course-header">
            <div v-if="storeData.getTypeStore !== SALON">
              {{ $t("store.list_course") }}
            </div>
            <div v-else>
              {{ $t("title_screen.list_coupon") }}
            </div>
          </div>
        </template>
        <template #button>
          <ButtonAdd :name="$t('create_new')" @click="addCourse" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            class="custom-form"
            :model="formSearch"
            label-position="left"
            inline
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('store.number')">
              <input-number
                v-model="formSearch.id"
                :placeholder="$t('store.number')"
              />
            </el-form-item>
            <el-form-item
              :label="
                storeData.getTypeStore !== SALON
                  ? $t('store.course_name')
                  : $t('coupon_name')
              "
            >
              <input-text
                v-model="formSearch.name"
                :placeholder="
                  storeData.getTypeStore !== SALON
                    ? $t('store.course_name')
                    : $t('coupon_name')
                "
              />
            </el-form-item>
            <el-form-item :label="$t('reservation_type')">
              <client-only>
                <el-select
                  v-model="formSearch.payment_type"
                  :placeholder="$t('reservation_type')"
                >
                  <el-option :label="$t('all')" :value="null" />
                  <el-option
                    v-for="item in reservationTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('store.publication_status')">
              <client-only>
                <el-select
                  v-model="formSearch.status"
                  :placeholder="$t('reservation_type')"
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
            <ButtonSearch :name="$t('button_search')" @click="handleSearch">
            </ButtonSearch>
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
          :row-class-name="tableRowClassName"
          @sort-change="headerSort"
        >
          <el-table-column
            width="100px"
            :label="$t('order')"
            type="index"
            :index="columnIndex"
          />
          <el-table-column
            min-width="90px"
            :label="$t('store.number')"
            prop="id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="140px"
            :label="
              storeData.getTypeStore !== SALON
                ? $t('store.course_name')
                : $t('coupon_name')
            "
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="140px"
            :label="
              storeData.getTypeStore !== SALON
                ? $t('front.course_content')
                : $t('front.coupon_content')
            "
            prop="contents"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="130px"
            :label="$t('reservation_type')"
            prop="payment_type"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>{{ DATA_RESERVATION_TYPE[scope.row.payment_type] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="130px"
            prop="day_works"
            :label="$t('store.reception_day')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span v-for="(item, index) in scope.row.day_works" :key="index">
                {{ DATA_DAY_FILTER[item] }}
                {{
                  scope.row.day_works.length !== 1 &&
                  index !== scope.row.day_works.length - 1
                    ? "・"
                    : ""
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="145px"
            prop="start_time"
            :label="$t('store.reception_time')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatTime(scope.row.start_time) }} ~
                {{ formatTime(scope.row.end_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="115px"
            :label="$t('store.stay_time')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="stay_time"
          >
            <template #default="scope">
              <span> {{ getTimeHours(scope.row.stay_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100px"
            :label="$t('unit_price')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
            prop="price"
          >
            <template #default="scope">
              <span> {{ priceDisplay(scope.row.price) + $t("yen") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="storeData.getTypeStore === RESTAURANT"
            min-width="145px"
            :label="$t('store.number_reverse')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="max_capacity"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span> {{ priceDisplay(scope.row.max_capacity) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="115px"
            :label="$t('store.publication_status')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="status"
          >
            <template #default="scope">
              <span>
                {{
                  findObj(DATA_STATUS_TYPE, "id", scope.row.status)?.name
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            width="180px"
            :label="$t('created')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            prop="created_at"
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
                <template v-if="isNotCrawler(scope.row)">
                  <icon-edit
                    v-if="hasPermCourseEdit"
                    @click="editCourse(scope.row.id)"
                  />
                  <icon-delete
                    v-if="hasPermCourseDelete"
                    @click="showModalDelete(scope.row.id)"
                  />
                </template>
                <template v-else-if="hasPermCourseEdit">
                  <icon-view @click="editCourse(scope.row.id)" />
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ModalConfirm
        :dialog-visible="dialogVisible"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteCourse"
      />
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="currentPage"
            :default-record="defaultRecord"
            :total="total"
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import {
  customIndex,
  formatDate,
  formatTime,
} from "../../../../shared/utils/format";
import { getPageDelete } from "../../../../shared/utils/dataPage";
import { CourseStore } from "../../../store/useCourse";
import CourseRequest from "../../../../shared/requests/CourseRequest";
import { ref, onBeforeMount, reactive, computed } from "vue";
import { useRouter } from "nuxt/app";
import { STORE_PAGINATION } from "~/../../src/shared/constants/pagination";
import {
  DATA_STATUS_TYPE,
  reservationTypeOptions,
  DATA_RESERVATION_TYPE,
  DATA_DAY_FILTER,
} from "../../../../shared/constants/reservation";
import InputText from "../../../../shared/components/input/InputText.vue";
import InputNumber from "../../../../shared/components/input/Phone.vue";
import ButtonSearch from "../../../../shared/components/button/Search";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import { SORT_ORDER } from "../../../../shared/constants";
import { getTypeSort } from "~/../../src/shared/utils";
import { Course, StoreStepActive } from "../../../models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { findObj } from "~/../../src/shared/utils/array";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { useAuthStore } from "~/../../src/store/store/store";
import { useMeStore } from "~/../../src/shared/stores/me";
import priceDisplay from "~/../../src/shared/utils/price";
import { getTimeHours } from "~/../../src/shared/utils/format";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import {
  SALON,
  RESTAURANT,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { isNotCrawler } from "~/../../src/shared/utils/crawl";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);
useHavePermission(Permission.CourseList);
const hasPermCourseEdit = useHavePermission(Permission.CourseEdit, false);
const hasPermCourseDelete = useHavePermission(Permission.CourseDelete, false);

const authStore = useAuthStore();
const storeData = useMeStore();
const { t } = i18n.global;
const courseTable = CourseStore();
const router = useRouter();
const currentPage = ref(1);
const defaultRecord = ref(STORE_PAGINATION.PER_PAGE);
const total = ref(0);
const idDelete = ref<number>();
const dialogVisible = ref(false);
const loading = ref(false);
const loadingDelete = ref(false);
const tableData = ref<Course[]>([]);
const noData = ref(t("no_data"));
const formSearch = ref({
  name: "",
  payment_type: null,
  id: null,
  status: null,
});

const columnIndex = (index: number) => {
  return customIndex(index, currentPage.value, defaultRecord.value);
};

const tableRowClassName = (row: any) => {
  if (
    row.row.staffs?.length <= 0 &&
    GROUP_TYPE_STORE.SAME.includes(storeData.getTypeStore)
  ) {
    return "staff-list";
  }
  return "";
};

const addCourse = () => {
  router.push("/store/course/create");
};

const editCourse = (id: number) => {
  router.push(`/store/course/edit/${id}`);
};

const showModalDelete = (id: number) => {
  idDelete.value = id;
  dialogVisible.value = true;
};

const deleteCourse = async () => {
  try {
    loadingDelete.value = true;
    await CourseRequest.delete(idDelete.value);
    deleteSuccess();
    currentPage.value = getPageDelete(currentPage.value, tableData.value);
    await getStepSetting();
    await getListCourse();
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    dialogVisible.value = false;
    idDelete.value = "";
    loadingDelete.value = false;
  }
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
};

const handleClose = () => {
  idDelete.value = "";
  dialogVisible.value = false;
};

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

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  currentPage.value = 1;
  loading.value = true;
  addConditionCategory();
  await getListCourse();
  loading.value = false;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getListCourse();
};

const handleSizeChange = (val) => {
  loading.value = true;
  defaultRecord.value = val;
  currentPage.value = 1;
  addConditionCategory();
  getListCourse();
};

const handleSearch = async () => {
  loading.value = true;
  currentPage.value = 1;
  addConditionCategory();
  await getListCourse();
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
};

const addConditionCategory = () => {
  courseTable.courseList = {
    search: formSearch.value,
    currentPage: currentPage.value,
    pageSize: defaultRecord.value,
    sort: sortTable,
  };
};

const getListCourse = async () => {
  loading.value = true;
  const params = {
    ...formSearch.value,
    ...sortTable,
    limit: defaultRecord.value,
    page: currentPage.value,
  };
  const data = (await CourseRequest.list<Course[]>(params)).data;
  tableData.value = data.data;
  total.value = data.total;
  currentPage.value = data.current_page;
  loading.value = false;
};

onBeforeMount(() => {
  if (courseTable.courseList?.search) {
    formSearch.value = courseTable.courseList.search;
    currentPage.value = courseTable.courseList.currentPage;
    defaultRecord.value = courseTable.courseList.pageSize;
  }
  if (courseTable.courseList?.sort) {
    sortTable.order_by = courseTable.courseList.sort.order_by;
    sortTable.direct = courseTable.courseList.sort.direct;
  }
  getListCourse();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

:deep(.custom-form) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }
}

:deep(.staff-list) {
  td {
    .cell {
      color: $red-color-medium;
    }
  }
}
</style>
