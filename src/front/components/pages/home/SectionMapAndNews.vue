<template>
  <div class="map-and-news-container">
    <div class="left">
      <Map :show-type-store="props.showTypeStoreInModal" />
    </div>
    <div class="right">
      <div class="notice-label">
        <div class="notice-title">{{ $t("notice_user") }}</div>
        <div class="news">｜ news</div>
      </div>
      <div class="notice-list">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
        <el-scrollbar
          v-if="noticeList && noticeList.length"
          v-loading="loadingNoticeNew"
        >
          <div v-for="item in noticeList" :key="item.id" class="notice-item">
            <div class="created-date">
              {{ formatDate(item.start_date, "YYYY.MM.DD") }}
            </div>
            <el-popover
              placement="top-start"
              popper-class="notice-popover"
              :width="350"
              trigger="hover"
              :title="item.title"
              :content="item.body"
            >
              <template #reference>
                <div class="notice-content">
                  {{ item.title }}
                </div>
              </template>
            </el-popover>
          </div>
        </el-scrollbar>
        <div v-else class="no-data">
          {{ $t("no_data") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import Map from "./section/Map.vue";

import { Notice } from "~/../../src/shared/types/notice";
import NoticeCommonRequest from "../../../../shared/requests/NoticeCommonRequest";
import { formatDate } from "~/../../src/shared/utils/format";
import { LIMIT_NOTICE_TOP } from "~/../../src/shared/constants/notices";

type Props = {
  showTypeStoreInModal: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  showTypeStoreInModal: true,
});

const noticeList = ref([]);
const loadingNoticeNew = ref(false);

const getListNotices = async () => {
  try {
    loadingNoticeNew.value = true;
    const dataNotice = (
      await NoticeCommonRequest.list<Notice[]>({
        limit: LIMIT_NOTICE_TOP,
      })
    ).data as Notice;
    noticeList.value = dataNotice?.data;
  } catch (e) {
    return e;
  } finally {
    loadingNoticeNew.value = false;
  }
};

onMounted(async () => {
  await getListNotices();
});
</script>

<style lang="scss">
.notice-popover.el-popper {
  white-space: pre-wrap;
}
</style>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.map-and-news-container {
  padding: 0px 16% 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 76px;

  .notice-content {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-break: break-all;

    .el-popper {
      width: 200px;
    }
  }

  .left {
    width: 50%;

    .map-image {
      width: 100%;
      max-width: 606px;
      height: auto;
    }
  }

  .right {
    width: 50%;

    .notice-label {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .notice-title {
        font-size: 24px;
        line-height: 34px;
        font-weight: 700;
      }

      .news {
        font-size: 14px;
      }
    }

    .notice-list {
      background: #ffffff;
      box-shadow: -10px 20px 30px rgba(0, 0, 0, 0.05);
      padding: 45px 60px 29px 60px;
      position: relative;
      //height: 200px;

      .circle {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background-color: $yellow-200;
        position: absolute;
      }

      .circle-1 {
        top: 16px;
        left: 16px;
      }

      .circle-2 {
        top: 16px;
        right: 16px;
      }

      .circle-3 {
        bottom: 16px;
        right: 16px;
      }

      .circle-4 {
        bottom: 16px;
        left: 16px;
      }

      .notice-item {
        display: flex;
        gap: 28px;
        padding-bottom: 16px;

        .created-date {
          font-weight: 700;
          color: $yellow-100;
          min-width: 80px;
        }
      }

      .no-data {
        padding-bottom: 16px;
      }
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .map-and-news-container {
    gap: 32px;

    .left {
      width: 100%;
    }

    .right {
      width: 100%;

      .notice-list {
        padding: 32px 24px 16px 24px;

        .notice-item {
          gap: 24px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .map-and-news-container {
    padding: 0px 0px 80px;
    flex-direction: column;

    .right {
      padding: 0px 24px;
      .notice-list {
        .notice-item {
          .notice-content {
            -webkit-line-clamp: 2;
          }
        }
      }
    }
  }
}
</style>
