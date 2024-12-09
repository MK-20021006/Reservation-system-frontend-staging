<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.list_coupon") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.list_coupon") }}</template>
        <template #button>
          <ButtonAdd
            :name="$t('create_new')"
            @click="$router.push({ name: 'store-coupon-create' })"
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
            <el-form-item :label="$t('coupon_code')">
              <InputText
                v-model="formSearch.code"
                :placeholder="$t('coupon_code')"
              />
            </el-form-item>
            <el-form-item :label="$t('coupon_name')">
              <InputText
                v-model="formSearch.name"
                class="coupon-name"
                :placeholder="$t('coupon_name')"
              />
            </el-form-item>
            <el-form-item
              v-if="typeStore === RESTAURANT"
              :label="$t('applicable_course')"
            >
              <client-only>
                <el-select
                  v-model="formSearch.apply_courses"
                  multiple
                  collapse-tags
                  :teleported="false"
                  :placeholder="$t('placeholder.applicable_course')"
                  class="course-name custom-input-select-multi"
                >
                  <el-option
                    v-for="course_name_item in course_name"
                    :key="course_name_item.id"
                    :value="course_name_item.id"
                    :label="course_name_item.name"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item v-else :label="$t('applicable_event')">
              <client-only>
                <el-select
                  v-model="formSearch.apply_events"
                  multiple
                  collapse-tags
                  :teleported="false"
                  :placeholder="$t('placeholder.applicable_event')"
                  class="course-name custom-input-select-multi"
                >
                  <el-option
                    v-for="event_name_item in event_name"
                    :key="event_name_item.id"
                    :value="event_name_item.id"
                    :label="event_name_item.name"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('valid_state')">
              <client-only>
                <el-select v-model="formSearch.status">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in STATUS_COUPON_DATA"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item
              class="date-group"
              :label="$t('booking.date_expired')"
            >
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
          <el-table
            v-loading="isLoadingTable"
            class="table-content"
            :empty-text="noData"
            :data="couponsData"
            border
            :default-sort="defaultSort"
            max-height="calc(100vh - 58px - 70px - 192px - 50px)"
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
              min-width="130px"
              :label="$t('coupon_name')"
              prop="name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
            </el-table-column>
            <el-table-column
              width="160px"
              :label="$t('coupon_code')"
              prop="code"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            />

            <el-table-column
              min-width="120px"
              :label="$t('terms_of_use')"
              prop="description"
            >
            </el-table-column>
            <el-table-column
              min-width="250px"
              :label="
                typeStore === RESTAURANT
                  ? $t('applicable_course')
                  : $t('applicable_event')
              "
              prop="applicable_course"
            >
              <template #default="scope">
                <span v-if="typeStore === RESTAURANT && !scope.row.apply_all">
                  {{ getListCourse(scope.row.courses) }}
                </span>
                <span v-if="typeStore === EVENT && !scope.row.apply_all">
                  {{ getListEvent(scope.row.events) }}
                </span>
                <span v-else>
                  {{ $t("all") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              header-align="left"
              width="230px"
              :label="$t('discount')"
            >
              <template #default="scope">
                <span v-if="scope.row.discount_money !== null">
                  {{ priceDisplay(scope.row.discount_min) }}{{ $t("yen") }} ~
                  {{ priceDisplay(scope.row.discount_max) }}{{ $t("yen") }}
                </span>
                <span v-else> {{ scope.row.discount_percent }}% </span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="85px"
              :label="$t('total_number')"
              prop="quantity"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span>{{
                  scope.row.infinite_quantity
                    ? $t("unlimited")
                    : priceDisplay(scope.row.quantity)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="80px"
              :label="$t('usage')"
              prop="number_used"
            >
            </el-table-column>
            <el-table-column
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
              prop="start_date"
              width="260px"
              :label="$t('booking.date_expired')"
            >
              <template #default="scope">
                {{ formatDate(scope.row.start_date, "YYYY年MM月DD日") }}
                ~
                {{ formatDate(scope.row.end_date, "YYYY年MM月DD日") }}
              </template>
            </el-table-column>
            <el-table-column
              width="140px"
              :label="$t('created')"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
              prop="created_at"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ formatDate(scope.row.created_at) }}
                </span>
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
                    @click="
                      $router.push({
                        name: 'store-coupon-edit-id',
                        params: { id: scope.row.id },
                      })
                    "
                  />
                  <icon-delete @click="deleteRecord(scope.row.id)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </client-only>
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { CouponInterface } from "~/../../src/store/models/coupon";
import { formatDate } from "~/../../src/shared/utils/format";
import { DEFAULT_PAGE } from "~/../../src/store/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import ButtonSearch from "../../../../shared/components/button/Search.vue";
import CouponRequest from "~/../../src/shared/requests/CouponRequest";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  getPageDelete,
  getTypeSort,
  customIndex,
} from "~/../../src/shared/utils";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { customTrimValue } from "~/../../src/shared/utils";
import InputText from "../../../../shared/components/input/InputText.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  EVENT,
  CLASSROOM,
  CONSULTATION,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import { STATUS_COUPON_DATA } from "~/../../src/shared/constants/coupon";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { onBeforeMount } from "#imports";
import CourseRequest from "~/../../src/shared/requests/CourseRequest";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import { messageError } from "~/../../src/shared/utils/notification";
import moment from "moment/moment";
import priceDisplay from "~/../../src/shared/utils/price";
import { useMeStore } from "~/../../src/shared/stores/me";
import { FEE_TYPE_COUPON } from "~/../../src/shared/constants/coupon";

useHavePermission(Permission.CouponList);
const hasPermCouponEdit = useHavePermission(Permission.CouponEdit, false);
const hasPermCouponDelete = useHavePermission(Permission.CouponDelete, false);
useHasTypeStore([RESTAURANT, EVENT, MEDIAL_CARE, CLASSROOM, CONSULTATION]);

const dataTableStore = DataTableStore();
const { t } = i18n.global;
const couponsData = ref<CouponInterface[]>();
const isLoadingTable = ref(false);
const isLoadingSearch = ref(false);
const isShowModalConfirm = ref(false);
const noData = ref(t("no_data"));
const idDeleteRecord = ref(0);
const typeStore = useMeStore().getTypeStore;

const formSearch = ref({
  code: null,
  name: null,
  start_date: null,
  end_date: null,
  status: null,
  apply_courses: [],
  apply_events: [],
});
const course_name = ref([]);
const event_name = ref([]);

const getListCourse = (arrList: []) => {
  const arrayCourse = [];

  if (arrList && arrList.length > 0) {
    arrList.map((item: any) => {
      arrayCourse.push(item?.name);
    });
  }

  return arrayCourse.join("、");
};

const getListEvent = (arrList: []) => {
  const arrayEvent = [];

  if (arrList && arrList.length > 0) {
    arrList.map((item: any) => {
      arrayEvent.push(item?.name);
    });
  }

  return arrayEvent.join("、");
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
  if (dataTableStore.couponList?.search) {
    formSearch.value = dataTableStore.couponList.search;
  }

  if (dataTableStore.couponList?.sort) {
    sortTable.order_by = dataTableStore.couponList.sort.order_by;
    sortTable.direct = dataTableStore.couponList.sort.direct;
  }
  pagination.currentPage = dataTableStore.couponList?.currentPage;
  pagination.numberRecordPerPage = dataTableStore.couponList?.pageSize;
  await getListCoupon();

  if (typeStore === RESTAURANT) {
    const response = (await CourseRequest.list({ all: true }))?.data;
    response.forEach((item) => {
      course_name.value.push({ name: item.name, id: item.id });
    });
  } else {
    const response = (
      await EventRequest.list({
        all: true,
        has_check_end_date: 0,
        order_by: "id",
        direct: "DESC",
      })
    )?.data;

    response.forEach((item) => {
      event_name.value.push({ name: item.name, id: item.id });
    });
  }
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

const getListCoupon = async () => {
  isLoadingTable.value = true;
  let param = {
    ...formSearch.value,
    ...sortTable,
    page: pagination.currentPage,
    limit: pagination.numberRecordPerPage,
  };

  const applyItem =
    typeStore === RESTAURANT
      ? formSearch.value.apply_courses.length
        ? formSearch.value.apply_courses
        : null
      : formSearch.value.apply_events.length
      ? formSearch.value.apply_events
      : null;

  delete param.apply_courses;
  delete param.apply_events;

  let couponResponse = (
    await CouponRequest.getListCouponCustom<CouponInterface[]>(
      param,
      applyItem,
      typeStore
    )
  ).data;

  if (!couponResponse?.data.length && pagination.currentPage !== 1) {
    pagination.currentPage = pagination.currentPage - 1;
    couponResponse = (
      await CouponRequest.list<CouponInterface[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
  }
  couponsData.value = couponResponse?.data;
  couponsData.value?.forEach((item) => {
    if ((item.fee_type = FEE_TYPE_COUPON.MONEY)) {
      const minMaxDiscount = getMaxMinDiscount(item);
      item.discount_min = minMaxDiscount[0];
      item.discount_max = minMaxDiscount[1];
    }
  });

  isLoadingTable.value = false;
  pagination.total = couponResponse?.pagination.total;
  pagination.currentPage = couponResponse?.pagination.current_page;
  pagination.numberRecordPerPage = couponResponse?.pagination.per_page;
};

const getMaxMinDiscount = (couponData: object) => {
  let arrayDiscount = [];
  if (typeStore === EVENT) {
    arrayDiscount = [
      couponData.discount_money,
      couponData.discount_money_children,
      couponData.discount_money_man,
      couponData.discount_money_woman,
    ];
  } else {
    arrayDiscount = [
      couponData.discount_money,
      couponData.discount_money_children,
    ];
  }
  return [Math.min(...arrayDiscount), Math.max(...arrayDiscount)];
};

const addConditionSearchCoupon = () => {
  dataTableStore.couponList = {
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
    await getListCoupon();
    formResultAfterSubmitSearch.value = customTrimValue(formSearch.value);
    if (!couponsData.value.length) {
      noData.value = t("no_result");
    }
    addConditionSearchCoupon();
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
    await getListCoupon();
    addConditionSearchCoupon();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListCoupon();
    addConditionSearchCoupon();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListCoupon();
    addConditionSearchCoupon();
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
    await CouponRequest.delete(idDeleteRecord.value);
    pagination.currentPage = getPageDelete(
      pagination.currentPage,
      couponsData.value
    );
    await getListCoupon();
    deleteSuccess();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
      messageError(e.response._data?.message);
    } else {
      deleteError();
    }
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

  .course-name {
    .el-select__tags-text {
      max-width: 130px !important;
    }
  }

  .el-select {
    .el-input {
      width: 274px;
    }
  }

  .date-group {
    .input-date {
      margin-right: 12px;

      .el-input {
        width: 274px;
      }
    }
  }
}
</style>
