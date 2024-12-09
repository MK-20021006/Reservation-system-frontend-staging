<template>
  <div class="list-review">
    <div v-for="item in data" :key="item.id" class="data-review">
      <div class="parent-review">
        <div class="parent-review__image">
          <img
            v-if="item.customer?.avatar?.url"
            :src="item.customer?.avatar?.url"
            alt=""
          />
          <img v-else src="../../assets/images/default_store.png" alt="" />
        </div>
        <div class="parent-review__content">
          <div class="name">
            {{ item.nickname }}{{ item.nickname ? $t("san") : "" }}
          </div>
          <div v-if="isShowStore" class="store-name__review">
            <span class="mr-5">{{ $t("name_store") + "：" }}</span>
            <nuxt-link @click="showDetailReviewStore(item.store.code)">
              {{ item.store?.name }}
            </nuxt-link>
          </div>
          <div class="title">{{ item.title }}</div>
          <div class="description">
            <show-more-text
              :text="item.content"
              :more-text="$t('show_more_text')"
            />
          </div>
          <div class="rate">
            <StoreEvaluateStartComponent
              :model-value="item.star"
              :icon-disabled="false"
              :show-score="true"
              class-name="show-rate"
            />
            <span class="dots"> · </span>
            <icon-clock />
            <span>{{ getDate(item.created_at) }}</span>
          </div>
        </div>
      </div>
      <div v-if="item.reply" class="children-review">
        <div class="parent-review__image">
          <img
            v-if="item.reply?.replier?.avatar?.url"
            :src="item.reply?.replier?.avatar?.url"
          />
          <img v-else src="../../assets/images/default_store.png" alt="" />
        </div>
        <div class="parent-review__content">
          <div class="name">{{ item.store?.name }}</div>
          <div class="description">
            <show-more-text
              :text="item.reply.content"
              :more-text="$t('show_more_text')"
            />
          </div>
          <div class="rate">
            <icon-clock />
            <span>{{ getDate(item.reply?.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ShowMoreText from "~/../../src/front/components/common/ShowMoreText.vue";
import { ReviewInterface } from "~/../../src/front/models/review";
import moment from "moment";
import StoreEvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { useRouter } from "#imports";

interface Prop {
  data: ReviewInterface[];
  type: number;
  isShowStore?: boolean;
}

const router = useRouter();
const props = withDefaults(defineProps<Prop>(), {
  data: () => [],
});

const { t } = i18n.global;

const getDate = (date: string) => {
  const hour = moment().diff(moment(date), "hour");
  const minute = moment().diff(moment(date), "minutes");
  const minuteShow = minute - hour * 60;
  if (minute <= 5) {
    return t("review_new");
  }
  if (hour >= 24) {
    const format = "YYYY/MM/DD" + t("date_access");
    return moment(date).format(format);
  }
  return (
    moment().diff(moment(date), "hour") +
    t("before_hour") +
    minuteShow +
    t("before_minute")
  );
};

const showDetailReviewStore = (code: string) => {
  router.push(
    `/store/${code}?tab=${menuRestaurant.RATE}&menu=${menuRestaurant.RATE}`
  );
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.list-review {
  gap: 10px;
  display: flex;
  flex-wrap: wrap;

  .data-review {
    width: 100%;
  }

  .store-name__review {
    display: flex;
    align-items: center;
  }

  .parent-review,
  .children-review {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .parent-review__image {
      width: 48px;
      height: 48px;
      border-radius: 100%;
      object-fit: cover;
      margin-right: 8px;

      img {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        object-fit: cover;
      }
    }

    .parent-review__content {
      font-size: 12px;
      width: calc(100% - 56px);

      .name {
        color: $blue-80;
        font-weight: bold;
      }

      .title {
        font-weight: 700;
      }

      .rate {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        color: rgba(0, 0, 0, 0.4);

        .dots {
          margin-right: 10px;
          font-weight: bold;
          color: $black-color;
        }

        :deep(.el-rate) {
          margin-right: 10px;
        }

        svg {
          margin-right: 10px;
        }
      }
    }
  }

  .children-review {
    margin-left: 58px;
    margin-top: 9px;
  }
}
</style>
