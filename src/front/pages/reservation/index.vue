<template>
  <div class="booking-list-container">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("title_screen.bookings") }}</Title
      >
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div>
      <div
        class="header-content d-flex justify-content-between align-items-center"
      >
        <div class="title">{{ $t("front.reservation_list") }}</div>
        <el-form
          ref="formRef"
          class="data-form div-search"
          :model="formSearch"
          @keyup.enter="handleSearch"
        >
          <div class="div-search__status">
            <div class="status">{{ $t("status") }}</div>
            <ClientOnly>
              <el-form-item prop="status">
                <el-select
                  v-model="formSearch.status"
                  class="select-status"
                  @change="handleSearch"
                >
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in reservationStatusOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </ClientOnly>
          </div>
          <el-form-item prop="booking_id">
            <el-input
              v-model="formSearch.key_search"
              class="textbox-search"
              :placeholder="$t('placeholder.reservation_store_name')"
              clearable
            >
              <template #append>
                <el-button
                  :icon="Search"
                  :loading="loadingSearch"
                  @click="handleSearch"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading || loadingStore" class="booking-list-content">
        <div v-for="item in tableData" :key="item.id" class="booking-item">
          <div class="left img-nodata">
            <el-image
              v-if="item.store?.model_has_file[0]?.file?.url"
              :src="item.store?.model_has_file[0]?.file?.url"
              fit="cover"
            />
            <img v-else src="../../assets/images/default_store.svg" alt="" />
          </div>
          <div class="right">
            <div class="booking-info">
              <div class="store-name">{{ item.store?.name }}</div>
              <div class="booking-status d-flex align-items-center">
                <div
                  v-if="item.status === RESERVATION_STATUS.WAITING"
                  class="waiting status"
                >
                  <icon-shopping />
                  <span>{{ $t("booking.waiting") }}</span>
                </div>
                <div
                  v-else-if="item.status === RESERVATION_STATUS.COMPLETED"
                  class="fixed status"
                >
                  <span>{{ $t("booking.fixed") }}</span>
                </div>
                <div
                  v-else-if="item.status === RESERVATION_STATUS.VISITED"
                  class="visited status"
                >
                  <span>{{ $t("booking.visited") }}</span>
                </div>
                <div
                  v-else-if="item.status === RESERVATION_STATUS.CANCEL"
                  class="cancel status"
                >
                  <icon-cancel-shopping />
                  <span>{{ getSituation(item) }}</span>
                </div>
              </div>
              <div class="line"></div>
              <div class="member">
                <p
                  v-if="
                    !GROUP_TYPE_STORE.EVENT.includes(
                      item.store.model_has_type.type_id
                    )
                  "
                >
                  {{
                    getCourseMenuBooking(
                      item.detail?.course?.name,
                      item.detail?.menu_details
                    )
                  }}
                </p>
                <p v-else>{{ item.detail?.event?.name }}</p>
              </div>
              <div class="booking-date">
                <div class="d-flex align-items-center mr-30">
                  <icon-clock />
                  <span
                    v-if="
                      !GROUP_TYPE_STORE.EVENT.includes(
                        item.store.model_has_type.type_id
                      )
                    "
                    >{{
                      formatDate(item.order_time, "YYYY年MM月DD日 HH:mm:ss")
                    }}
                  </span>
                  <span v-else>
                    {{
                      formatDate(item.order_time) +
                      " " +
                      getLabelTime(
                        item?.event_time?.start,
                        item?.event_time?.end
                      )
                    }}
                  </span>
                </div>
                <div class="d-flex align-items-center">
                  <icon-person />
                  <span
                    >{{ item.total_people ? item.total_people : "" }}
                    {{ $t("last_name_kanji") }}</span
                  >
                </div>
              </div>
              <div class="booking-number">
                <span>{{ $t("reservation_number") }}: </span>
                <span>{{ item.reservation_code }}</span>
              </div>
            </div>
            <div class="group-button">
              <button-common
                :name="$t('button.confirmation')"
                background-color="#C03522"
                height="40px"
                width="125px"
                color="white"
                @click="reservationDetail(item.id)"
              />
              <button-common
                v-if="
                  dataStoreReview.includes(item.store?.id) &&
                  item.status === RESERVATION_STATUS.VISITED
                "
                class="btn-review review-booking"
                background-color="#82AD24"
                height="40px"
                width="125px"
                color="white"
                :name="$t('button.submit_review')"
                :total="countReview(item.store?.id)"
                @click="openModalAddReview(item.store?.id)"
              />
            </div>
          </div>
        </div>
        <div v-if="!pagination.total" class="text-center no-data">
          {{ noData }}
        </div>
        <LazyCommonPagination
          v-if="pagination.total"
          :current-page="pagination.currentPage"
          :default-record="pagination.numberRecordPerPage"
          :total="pagination.total"
          :paper-count="3"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        />
      </div>
    </div>
    <modal-comment
      v-if="dialogVisible"
      :title="$t('input_word_of_mouth')"
      :dialog-visible="dialogVisible"
      :loading="loadingAddComment"
      @handle-close="handleClose"
      @handle-submit="addReview"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  reservationStatusOptions,
  RESERVATION_STATUS,
} from "~/../../src/shared/constants/reservation";
import IconPerson from "~/../../src/front/components/Icon/IconPerson.vue";
import IconClock from "~/../../src/front/components/Icon/IconClock.vue";
import { FormInstance } from "element-plus";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import IconShopping from "~/../../src/front/components/Icon/IconShopping.vue";
import IconCancelShopping from "~/../../src/front/components/Icon/IconCancelShopping.vue";
import Search from "~/../../src/front/components/Icon/Search.vue";
import { onMounted, useRoute, useRouter } from "#imports";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { Booking } from "~/../../src/shared/types/booking";
import { formatDate, getLabelTime } from "~/../../src/shared/utils";
import { SORT_ORDER } from "~/../../src/shared/constants/sortType";
import { DataTableStore } from "~/../../src/front/store/dataTable";
import { getSituation } from "~/../../src/shared/utils";
import scrollToTop from "~/../../src/shared/utils/scroll";
import CommentRequest from "~/../../src/shared/requests/CommentRequest";
import { messageError } from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import commentRequest from "~/../../src/shared/requests/CommentRequest";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

definePageMeta({
  activeSidebar: {
    parentName: "reservation",
  },
  middleware: ["auth"],
});

const router = useRouter();
const route = useRoute();
const { t } = i18n.global;
const noData = ref(t("no_data"));
const loading = ref(false);
const loadingSearch = ref(false);
const dataTableStore = DataTableStore();
const tableData = ref([]);
const dataTitle = reactive([{ name: t("reservations"), path: "" }]);
const formResultAfterSubmitSearch = ref(null);
const formSearch = ref({
  status: null,
  key_search: "",
});
const dialogVisible = ref(false);
const loadingAddComment = ref(false);
const idStore = ref();
const dataStoreReview = ref<any>([]);
const loadingStore = ref(false);

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleClose = () => {
  dialogVisible.value = false;
  idStore.value = null;
};

const openModalAddReview = (id: number) => {
  idStore.value = id;
  dialogVisible.value = true;
};

const storeComment = async () => {
  try {
    loadingStore.value = true;
    dataStoreReview.value = [];
    dataStoreReview.value = (
      await commentRequest.listStoreReviews<any[]>()
    ).data;
  } catch (e: any) {
    dataStoreReview.value = [];
  } finally {
    loadingStore.value = false;
  }
};

const addReview = async (form: object) => {
  try {
    loadingAddComment.value = true;
    await CommentRequest.postReview({ ...form, store_id: idStore.value });
    dialogVisible.value = false;
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError("errors.review_count");
    }
  } finally {
    await storeComment();
    loadingAddComment.value = false;
  }
};

const getCourseMenuBooking = (course: string, menu: []) => {
  const arrayCourseMenu = [];
  if (course) {
    arrayCourseMenu.push(course);
  }
  if (menu && menu.length > 0) {
    menu.map((item: any) => {
      arrayCourseMenu.push(item.menu?.name);
    });
  }

  return arrayCourseMenu.join("、");
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    loading.value = true;
    await getListBooking();
    addConditionSearchStore();
  } finally {
    loading.value = false;
  }
};

const addConditionSearchStore = () => {
  dataTableStore.bookingList = {
    search: formResultAfterSubmitSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const handleSizeChange = (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getListBooking();
};

const formRef = ref<FormInstance>();

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: CUSTOMER_PAGINATION.PER_PAGE,
});

const countReview = (storeId: number) => {
  return dataStoreReview.value?.filter((item: number) => {
    return item === storeId;
  }).length;
};

const handleSearch = () => {
  loadingSearch.value = true;
  getListBooking();
  formResultAfterSubmitSearch.value = JSON.parse(
    JSON.stringify(formSearch.value)
  );
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
  addConditionSearchStore();
  loadingSearch.value = false;
};

const getListBooking = async () => {
  try {
    loading.value = true;
    const bookingList = (
      await BookingRequest.list<Booking[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    ).data;
    tableData.value = bookingList.data;
    pagination.total = bookingList.total;
    pagination.currentPage = bookingList.current_page;
    pagination.numberRecordPerPage = bookingList.per_page;
  } catch (e) {
    return e;
  } finally {
    loading.value = false;
    scrollToTop();
  }
};

const reservationDetail = (id: number) => {
  router.push({ name: "reservation-detail-id", params: { id: id } });
};

onMounted(async () => {
  scrollToTop();
  if (dataTableStore.bookingList?.search) {
    formSearch.value = dataTableStore.bookingList.search;
    pagination.currentPage = dataTableStore.bookingList.currentPage;
    pagination.numberRecordPerPage = dataTableStore.bookingList.pageSize;
  }
  if (dataTableStore.bookingList?.sort) {
    sortTable.order_by = dataTableStore.bookingList.sort.order_by;
    sortTable.direct = dataTableStore.bookingList.sort.direct;
  }
  await getListBooking();
  if (tableData.value.length > 0) {
    await storeComment();
  }
});
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.booking-list-container {
  width: 100%;
  padding: 32px;

  .no-data {
    border-top: 1px solid $black-10;
    padding: 20px 0;
  }

  .header-content {
    padding-bottom: 24px;

    .div-search {
      display: flex;

      &__status {
        display: flex;
        align-items: center;
      }
    }

    .title {
      font-size: 20px;
    }

    .status {
      min-width: 70px;
    }

    .select-status {
      margin: 0 24px 0 16px;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-select {
      width: 128px;
    }

    :deep(.el-input__wrapper) {
      width: 166px;
    }
  }

  .booking-list-content {
    .booking-item {
      padding: 24px 0;
      border-top: 1px solid $black-10;
      display: flex;
      gap: 36px;

      .left {
        .el-image,
        img {
          width: 296px;
          height: 144px;
        }
      }

      .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 36px;
        width: 100%;

        .booking-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: calc(100% - 100px);

          .store-name {
            font-size: 16px;
            line-height: 30px;
          }

          .booking-status {
            span {
              font-size: 12px;
              line-height: 20px;
              font-weight: 700;
            }

            .status {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .waiting,
            .fixed {
              color: $green-100;
            }

            .visited {
              color: $blue;
            }

            .cancel {
              color: $black-40;
            }
          }

          .line {
            border-top: 1px dashed $black-10;
          }

          .member,
          .booking-date {
            display: flex;
            align-items: center;

            span {
              font-size: 12px;
              line-height: 12px;
              padding-left: 10px;
            }
          }

          .booking-number {
            display: flex;
            min-width: 320px;
            color: $red-color;
            font-size: 18px;
            line-height: 26px;
          }
        }

        .group-button {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          width: 125px;

          .btn-review {
            margin-left: 0;
          }
        }
      }
    }

    :deep(.review-booking) {
      span {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .description {
          font-size: 10px;
          width: 100%;
        }
      }
    }

    .img-nodata img {
      object-fit: cover;
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .booking-list-container {
    padding: 24px;

    :deep(.custom-pagination) {
      flex-wrap: wrap;
      gap: 10px;
    }

    .header-content {
      padding-bottom: 24px;
      flex-direction: column;
      align-items: flex-start;
      gap: 32px;

      .div-search {
        width: 100%;
        display: grid;

        &__status {
          margin-bottom: 20px;
        }
      }

      .select-status {
        margin: 0 8px;
      }

      .el-select {
        width: 114px;
      }

      :deep(.el-input__wrapper) {
        width: calc(100% - 70px - 8px - 8px);
      }
    }

    .booking-list-content {
      .booking-item {
        padding: 16px 0;
        flex-direction: column;
        gap: 0;

        .left {
          .el-image {
            width: 240px;
            height: 120px;
          }
        }

        .right {
          gap: 16px;
          flex-direction: column;
          align-items: flex-start;

          .booking-info {
            width: 100%;

            .store-name {
              font-size: 14px;
              line-height: 20px;
            }

            .booking-number {
              font-size: 16px;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1025px) {
  .booking-list-container {
    .booking-list-content {
      .booking-item {
        .right {
          .group-button {
            width: unset;
          }
        }
      }
    }
  }
}
</style>
