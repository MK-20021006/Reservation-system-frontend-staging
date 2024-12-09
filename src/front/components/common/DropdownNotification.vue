<template>
  <div>
    <el-badge
      ref="_refNotification"
      :value="countNoticeListNews"
      :hidden="!countNoticeListNews"
      :max="99"
      class="item"
    >
      <IconNotification class="cursor-pointer" />
    </el-badge>
    <el-popover
      :teleported="false"
      :virtual-ref="_refNotification"
      trigger="hover"
      :width="120"
      popper-class="custom-dropdown-notification"
    >
      <div class="body-popup-notices">
        <div class="header d-flex">
          <div class="title">{{ $t("news") }}</div>
          <div class="number">({{ pagination.total || 0 }})</div>
        </div>
        <el-scrollbar
          v-loading="loadingNoticeNews"
          max-height="360px"
          class="body"
        >
          <div
            v-for="item in dataNoticeNews"
            :key="item.id"
            @click="redirectNoticeItem(item.id)"
          >
            <div class="item item-notice d-flex">
              <div class="item-image">
                <el-image
                  v-if="item.actor?.store_image"
                  fit="cover"
                  :src="item.actor?.store_image"
                ></el-image>
                <div v-else>
                  <IconDefaultAvatar />
                </div>
              </div>
              <div class="item-body overflow-hidden">
                <component
                  :is="checkTemplateNotice(item.code)"
                  :id-booking="item.referer?.id"
                  :booking-number="item.referer?.reservation_code"
                  :shop-name="item.actor?.store_name"
                  :is-title="true"
                ></component>
                <div class="time mb-8">
                  {{ formatDate(item.created_at, "YYYY年MM月DD日 HH:mm") }}
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div
          v-if="dataNoticeNews && dataNoticeNews.length"
          class="footer d-flex justify-content-center"
        >
          <el-button @click="redirectNotice">{{ $t("see_more") }}</el-button>
        </div>
        <div v-else class="no-data">{{ $t("no_data") }}</div>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, shallowRef } from "vue";
import NoticeRequest from "~/../../src/shared/requests/NoticeRequest";
import {
  LIMIT_DEFAULT,
  TYPE_TEMPLATE,
} from "~/../../src/shared/constants/notices";
import { useRouter, useRoute } from "nuxt/app";
import { formatDate } from "~/../../src/shared/utils/format";
import { Notice } from "~/../../src/shared/types/notice";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { STATUS } from "~/../../src/shared/constants/seen";
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

const router = useRouter();
const route = useRoute();
const loadingNoticeNews = ref(true);
const _refNotification = ref();
const dataNoticeNews = ref([]);
const countNoticeListNews = ref(0);
const templateTitleNotice = shallowRef();

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const pagination = reactive({
  total: 0,
});

const getListNotices = async () => {
  try {
    loadingNoticeNews.value = true;

    const dataNoticeListNews = await NoticeRequest.list<Notice[]>(
      {
        ...sortTable,
      },
      true
    );
    pagination.total = dataNoticeListNews.data?.pagination?.total;
    dataNoticeNews.value = dataNoticeListNews.data?.data.slice(
      0,
      LIMIT_DEFAULT
    );

    countNoticeListNews.value = dataNoticeListNews.data?.unseen_notification;
  } catch (e) {
    return e;
  } finally {
    loadingNoticeNews.value = false;
  }
};

const checkTemplateNotice = (typeNotice) => {
  if (typeNotice == TYPE_TEMPLATE.StoreApproveTemporaryBookingStore) {
    return (templateTitleNotice.value = StoreApproveTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreApproveTemporaryBookingUser) {
    return (templateTitleNotice.value = StoreApproveTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelNowBookingStore) {
    return (templateTitleNotice.value = StoreCancelNowBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelNowBookingUser) {
    return (templateTitleNotice.value = StoreCancelNowBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelTemporaryBookingStore) {
    return (templateTitleNotice.value = StoreCancelTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.StoreCancelTemporaryBookingUser) {
    return (templateTitleNotice.value = StoreCancelTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelNowBookingStore) {
    return (templateTitleNotice.value = UserCancelNowBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelNowBookingUser) {
    return (templateTitleNotice.value = UserCancelNowBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelTemporaryBookingStore) {
    return (templateTitleNotice.value = UserCancelTemporaryBookingStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserCancelTemporaryBookingUser) {
    return (templateTitleNotice.value = UserCancelTemporaryBookingUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserNowBookingStore) {
    return (templateTitleNotice.value = UserNowOrderStore);
  }
  if (typeNotice == TYPE_TEMPLATE.UserNowBookingUser) {
    return (templateTitleNotice.value = UserNowOrderUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserTemporaryBookingUser) {
    return (templateTitleNotice.value = UserTemporaryOrderUser);
  }
  if (typeNotice == TYPE_TEMPLATE.UserTemporaryBookingStore) {
    return (templateTitleNotice.value = UserTemporaryOrderStore);
  }
};

const redirectNotice = () => {
  router.push("/notices");
};

const redirectNoticeItem = (id) => {
  return router.push({ name: "notices", query: { id } });
};

defineExpose({
  countNoticeListNews,
});

onMounted(() => {
  getListNotices();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;

:deep(.el-image) img {
  height: 48px;
  width: 48px;
  border-radius: 100%;
}

:deep(.el-badge__content.el-badge__content--danger) {
  display: inline-flex;
}

:deep(.el-badge__content) {
  border: none;
}

:deep(.el-badge .cursor-pointer:focus) {
  outline: none;
}

:deep(.el-badge__content.is-fixed) {
  top: 3px;
  cursor: pointer;
}

:deep(.body-popup-notices) {
  z-index: 999999;
  padding: 15px;
}

:deep(.el-scrollbar__thumb) {
  background-color: unset;
}

.header {
  color: $red-color;
  gap: 5px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 15px;
}

.body {
  max-height: 360px;
  overflow-y: auto;

  .item {
    gap: 16px;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px 0;

    :deep(.el-image) img {
      height: 48px;
      width: 48px;
      border-radius: 100%;
    }

    .item-body {
      color: $black-80;

      :deep(.booking-number) {
        color: $blue;

        &:hover {
          opacity: 0.6;
        }
      }

      .title {
        margin-bottom: 4px;

        p {
          color: $red-color;
          display: inline-block;
          max-width: 60px;
          vertical-align: middle;
        }
      }

      .time,
      .description {
        font-size: 12px;
      }

      .time {
        margin-bottom: 8px;
      }
    }
  }
  .item-notice {
    cursor: pointer;
  }
}

.footer {
  margin: 20px 0;

  .el-button {
    background-color: $red-color;
    color: $white-color;
    max-width: 150px;
    width: 100%;
    height: 40px;
    font-weight: 500;
  }
}

.no-data {
  padding: 12px 10px;
  color: $black-80;
}
</style>
