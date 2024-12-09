<template>
  <div class="notice-list-container">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("title_screen.notices") }}</Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="notice-list">
      <div>
        <div
          class="header-content d-flex justify-content-between align-items-center"
        >
          <div class="title">
            {{ $t("title_screen.notices") }} ({{ pagination.total }})
          </div>
          <el-form
            class="data-form div-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <div class="div-search__status">
              <div class="status">{{ $t("status") }}</div>
              <ClientOnly>
                <el-form-item prop="status">
                  <el-select
                    v-model="formSearch.seen_status"
                    class="select-status"
                    :placeholder="$t('all')"
                    @change="handleSearch"
                  >
                    <el-option :value="null" :label="$t('all')"></el-option>
                    <el-option
                      v-for="item in statusSeenOptions"
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
                v-model="formSearch.keyword"
                v-input-trim
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('title_and_content')"
                clearable
              >
                <template #append>
                  <el-button
                    :loading="isloadingSearch"
                    :icon="Search"
                    @click="handleSearch"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-loading="isLoadingTable" class="notice-list-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(item, index) in noticeList"
              :key="item.id"
              class="notice-item"
              :index="item.id"
              :name="item.id"
              :class="{ 'last-item': index === noticeList.length - 1 }"
              @click="seenNotice(item.id)"
            >
              <template #title>
                <div class="box-notice__list align-items-center">
                  <span v-if="!item.seen_status" class="icon-seen__red"></span>
                  <span v-else class="icon-seen__white"></span>
                  <div v-if="item.actor?.store_image" class="notice-item__left">
                    <el-image :src="item.actor?.store_image" fit="cover" />
                  </div>
                  <div v-else class="notice-item__left">
                    <IconDefaultAvatar />
                  </div>
                  <div class="notice-item__title">
                    <component
                      :is="checkTemplateNotice(item.code)"
                      :id-booking="item.referer?.id"
                      :booking-number="item.referer?.reservation_code"
                      :shop-name="item.actor?.store_name"
                      :is-title="true"
                    ></component>
                    <div class="created-at">
                      {{ formatDate(item.created_at, "YYYY年MM月DD日 HH:mm") }}
                    </div>
                  </div>
                </div>
              </template>
              <div class="notice-content">
                <component
                  :is="checkTemplateNotice(item.code)"
                  :user-name="
                    getFullName(item.target?.first_name, item.target?.last_name)
                  "
                  :booking-number="item.referer?.reservation_code"
                  :shop-name="item.actor?.store_name"
                  :site-name="item.referer?.site_name"
                  :booking-date-time="item.referer?.order_time"
                  :booking-content="item.referer?.booking_content"
                  :shop-booking-url="item.referer?.shop_booking_url"
                  :booking-url="item.referer?.book_url"
                  :shop-book-confirm-url="item.referer?.shop_book_confirm_url"
                  :number-people="item.referer?.total_people"
                  :staff-name="item.referer?.booking_detail?.staff?.name"
                  :cancel-fee="item.referer?.fee_cancel"
                  :list-menu="item.referer?.booking_detail?.menus"
                  :type-category="item.referer?.booking_type"
                  :request-staff="
                    item.referer?.booking_detail?.staff?.request_staff
                  "
                  :is-title="false"
                ></component>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-if="!pagination.total" class="mt-16 text-center no-data">
            {{ noData }}
          </div>
        </div>
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
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, shallowRef } from "vue";
import { statusSeenOptions } from "~/../../src/shared/constants/seen";
import { i18n } from "~/../../src/shared/plugins/i18n";
import NoticeRequest from "~/../../src/shared/requests/NoticeRequest";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants/pagination";
import Search from "~/../../src/front/components/Icon/Search.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { useRoute } from "#imports";
import { Notice } from "~/../../src/shared/types/notice";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { STATUS } from "~/../../src/shared/constants/seen";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { TYPE_TEMPLATE } from "~/../../src/shared/constants/notices";
import { MAX_LENGTH_DEFAULT } from "~/../../src/shared/utils/validate";
import StoreApproveTemporaryBookingStore from "~/../../src/shared/components/template/notice/StoreApproveTemporaryBookingStore.vue";
import StoreApproveTemporaryBookingUser from "~/../../src/shared/components/template/notice/StoreApproveTemporaryBookingUser.vue";
import StoreCancelNowBookingStore from "~/../../src/shared/components/template/notice/StoreCancelNowBookingStore.vue";
import StoreCancelNowBookingUser from "~/../../src/shared/components/template/notice/StoreCancelNowBookingUser.vue";
import StoreCancelTemporaryBookingStore from "~/../../src/shared/components/template/notice/StoreCancelTemporaryBookingStore.vue";
import StoreCancelTemporaryBookingUser from "~/../../src/shared/components/template/notice/StoreCancelTemporaryBookingUser.vue";
import UserCancelNowBookingStore from "~/../../src/shared/components/template/notice/UserCancelNowBookingStore.vue";
import UserCancelNowBookingUser from "~/../../src/shared/components/template/notice/UserCancelNowBookingUser.vue";
import UserNowOrderStore from "~/../../src/shared/components/template/notice/UserNowOrderStore.vue";
import UserNowOrderUser from "~/../../src/shared/components/template/notice/UserNowOrderUser.vue";
import UserTemporaryOrderUser from "~/../../src/shared/components/template/notice/UserTemporaryOrderUser.vue";
import UserTemporaryOrderStore from "~/../../src/shared/components/template/notice/UserTemporaryOrderStore.vue";
import UserCancelTemporaryBookingStore from "~/../../src/shared/components/template/notice/UserCancelTemporaryBookingStore.vue";
import UserCancelTemporaryBookingUser from "~/../../src/shared/components/template/notice/UserCancelTemporaryBookingUser.vue";
import getFullName from "~/../../src/shared/utils/getFullName";
import scrollToTop from "~/../../src/shared/utils/scroll";

definePageMeta({
  middleware: ["auth"],
  activeSidebar: {
    parentName: "notices",
  },
});

const route = useRoute();
const { t } = i18n.global;
const noData = ref(t("no_data"));
const noticeList = ref([]);
const dataTitle = reactive([{ name: t("front.notification_list"), path: "" }]);
const templateNotice = shallowRef();
const activeNames = ref([]);

const checkTemplateNotice = (typeNotice: string) => {
  if (typeNotice == TYPE_TEMPLATE.StoreApproveTemporaryBookingStore) {
    return (templateNotice.value = StoreApproveTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreApproveTemporaryBookingUser) {
    return (templateNotice.value = StoreApproveTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelNowBookingStore) {
    return (templateNotice.value = StoreCancelNowBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelNowBookingUser) {
    return (templateNotice.value = StoreCancelNowBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelTemporaryBookingStore) {
    return (templateNotice.value = StoreCancelTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelTemporaryBookingUser) {
    return (templateNotice.value = StoreCancelTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelNowBookingStore) {
    return (templateNotice.value = UserCancelNowBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelNowBookingUser) {
    return (templateNotice.value = UserCancelNowBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelTemporaryBookingStore) {
    return (templateNotice.value = UserCancelTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelTemporaryBookingUser) {
    return (templateNotice.value = UserCancelTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserNowBookingStore) {
    return (templateNotice.value = UserNowOrderStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserNowBookingUser) {
    return (templateNotice.value = UserNowOrderUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserTemporaryBookingUser) {
    return (templateNotice.value = UserTemporaryOrderUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserTemporaryBookingStore) {
    return (templateNotice.value = UserTemporaryOrderStore);
  }
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataNotices();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataNotices();
};

const isLoadingTable = ref(false);
const isloadingSearch = ref(false);
const formSearch = ref({
  seen_status: null,
  keyword: "",
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: CUSTOMER_PAGINATION.PER_PAGE,
});

const getDataNotices = async () => {
  try {
    isLoadingTable.value = true;
    const noticeResponse = (
      await NoticeRequest.list<Notice[]>({
        ...formSearch.value,
        ...sortTable,
        page: pagination.currentPage,
        limit: pagination.numberRecordPerPage,
      })
    )?.data;

    noticeList.value = noticeResponse.data;
    pagination.total = noticeResponse.pagination.total;
    pagination.currentPage = noticeResponse.pagination?.current_page;
    pagination.numberRecordPerPage = noticeResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
    scrollToTop();
  }
};

const handleSearch = async () => {
  isloadingSearch.value = true;
  await getDataNotices();
  if (!pagination.total) {
    noData.value = t("no_result");
  }
  isloadingSearch.value = false;
};

const seenNotice = async (id: number) => {
  const indexIdNotice = noticeList.value.findIndex((item) => item.id === id);
  const isSeen = noticeList.value[indexIdNotice]?.seen_status;
  if (indexIdNotice !== -1 && isSeen != STATUS.IS_SEEN) {
    const data = await NoticeRequest.seenNotice(id);
    if (data.status_code === STATUS_CODE.SUCCESS) {
      noticeList.value[indexIdNotice].seen_status = STATUS.IS_SEEN;
    }
  }
};

onMounted(async () => {
  scrollToTop();
  await getDataNotices();
  if (route.query.id) {
    await seenNotice(Number(route.query.id));
    return activeNames.value.push(Number(route.query.id));
  }
});
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.notice-list-container {
  width: 100%;
  padding: 32px;

  .no-data {
    border-top: 1px solid $black-10;
    padding: 20px 0;
  }

  :deep(.booking-number) {
    color: $blue;

    &:hover {
      opacity: 0.6;
    }
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

    :deep(.el-select) {
      width: 128px;
    }

    :deep(.el-input__wrapper) {
      width: 190px;
    }
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      height: auto;
      line-height: 100%;
      border-top: 1px solid $gray-700;
      border-bottom: none;

      .el-icon::before {
        content: url("data:image/svg+xml;charset=UTF-8, <svg width='14' height='10' viewBox='0 0 18 10' fill='none' xmlns='http://www.w3.org/2000/svg'> <path d='M16.5002 0.991288L9.00017 8.30379L1.50017 0.991288C1.35967 0.850788 1.19567 0.780538 1.00817 0.780538C0.82067 0.780538 0.65667 0.850788 0.51617 0.991288C0.37567 1.13179 0.30542 1.29579 0.30542 1.48329C0.30542 1.67079 0.36792 1.82704 0.49292 1.95204L8.48492 9.73329C8.62542 9.87379 8.79742 9.94404 9.00092 9.94404C9.20442 9.94404 9.37642 9.87379 9.51692 9.73329L17.5089 1.97529C17.6339 1.83479 17.6964 1.66679 17.6964 1.47129C17.6964 1.27579 17.6262 1.11179 17.4857 0.979288C17.3452 0.846788 17.1812 0.780288 16.9937 0.779788C16.8062 0.779288 16.6422 0.849538 16.5017 0.990538L16.5002 0.991288Z' fill='black' fill-opacity='0.4'/> </svg>");
        width: 17px;
        height: 9px;
      }

      .el-collapse-item__arrow.is-active {
        transform: rotate(180deg);
      }
    }

    .el-collapse-item__content {
      padding-bottom: 0;
      font-size: 14px;
      line-height: 22px;
    }

    .el-collapse-item__wrap {
      border: none;
    }

    .last-item {
      border-bottom: 1px solid $gray-700;
    }

    .el-collapse-item__arrow {
      margin: 0 20px 0 auto;
    }
  }

  .notice-list-content {
    margin-bottom: 25px;

    .box-notice__list {
      display: flex;
      align-items: center;
      padding: 11px 5px 11px 0;

      .title-notice {
        font-size: 16px;
        line-height: 24px;
      }

      .created-at {
        font-size: 12px;
        line-height: 16px;
        padding-top: 4px;
      }
    }

    .notice-item {
      gap: 10px;

      .icon-seen__red {
        height: 12px;
        width: 12px;
        min-width: 12px;
        border-radius: 100%;
        background-color: $red-color;
      }

      .icon-seen__white {
        height: 12px;
        width: 12px;
        min-width: 12px;
      }

      .notice-item__left {
        margin: 0 12px;

        :deep(.el-image) img {
          height: 48px;
          width: 48px;
          border-radius: 100%;
        }
      }

      .notice-item__title {
        line-height: 24px;
        flex-direction: column;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .notice-content {
        padding: 0 84px 16px 84px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .notice-list-container {
    padding: 24px;

    .header-content {
      padding-bottom: 16px;
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

    :deep(.el-collapse .el-collapse-item__arrow) {
      display: none;
    }

    :deep(.custom-pagination) {
      flex-wrap: wrap;
      gap: 10px;
    }

    :deep(.notice-list-content .notice-item .notice-content) {
      padding: 0 5px 16px 84px;
    }
  }
}
</style>
