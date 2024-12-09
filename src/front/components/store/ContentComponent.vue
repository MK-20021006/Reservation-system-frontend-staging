<template>
  <div class="content-header">
    <NuxtLink v-if="!id" :to="`/store/${data.code}`" class="link-redirect" />
    <div class="list-store__name">
      <div class="list-store-name__wrap">
        <NuxtLink
          v-if="!id"
          :to="`/store/${data.code}`"
          class="list-store-name__wrap-text"
        >
          {{ data?.name ? data?.name : "" }}
        </NuxtLink>
        <div v-else class="list-store-name__wrap-text">
          {{ data?.name ? data?.name : "" }}
        </div>
      </div>
      <div class="list-store-name__area">
        {{ data?.transportation ? data?.transportation : "" }}
      </div>
    </div>
    <div class="list-store__time">
      <div
        v-if="data?.model_has_tag?.length > 0"
        class="list-store__time-title"
      >
        <span>{{ $t("genre") }}： </span>
        <span v-for="(item, index) in data.model_has_tag" :key="item.model_id">
          <span>{{ item.tag_store?.name }} </span>
          <span v-if="index !== data?.model_has_tag.length - 1"> 、</span>
        </span>
      </div>
      <div class="list-store__time-title">
        {{ data?.introduction ? data?.introduction : "" }}
      </div>
      <ul class="list-store__time-item">
        {{
          data?.comment_opening_time ? data?.comment_opening_time : ""
        }}
      </ul>
    </div>
    <div class="list-store__rate">
      <StoreEvaluateStartComponent
        :model-value="formatPriceFromMath(data?.reviews?.[0]?.avg, 2) || 0"
        class-name="detail-store"
      />
      <div class="recommend">
        <icon-chat-message />
        <span>{{ data?.reviews?.[0]?.count_review || 0 }}件</span>
      </div>
    </div>
    <div class="list-store__money">
      {{
        GROUP_TYPE_STORE.EVENT.includes(data?.model_has_type?.type_id)
          ? $t("event")
          : $t("front.cost")
      }}:
      <span>{{
        data?.min_price >= data?.min_price_children && data?.min_price_children
          ? priceDisplay(data?.min_price_children)
          : priceDisplay(data?.min_price)
      }}</span
      >{{ $t("yen") }}～<span>{{
        data?.max_price > data?.max_price_children
          ? priceDisplay(data?.max_price)
          : priceDisplay(data?.max_price_children)
      }}</span
      >{{ $t("yen") }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import priceDisplay from "../../../shared/utils/price";
import { DetailStore } from "~/../../src/front/models";
import StoreEvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { formatPriceFromMath } from "~/../../src/shared/utils";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  data: DetailStore;
  hideLink?: boolean;
  id?: number | null;
}

const props = withDefaults(defineProps<Prop>(), {
  data: undefined,
  hideLink: false,
  id: null,
});
const { data, id } = toRefs(props);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.content-header {
  position: relative;

  .link-redirect {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .list-store__name {
    border-bottom: 1px solid $grey-small-color;

    .list-store-name__wrap {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 8px;

      .list-store-name__wrap-text {
        color: $yellow-medium-color;
        font-weight: bold;
        text-decoration: none;
      }
    }

    .list-store-name__area {
      font-weight: 400;
      margin-bottom: 8px;
    }
  }

  .list-store__rate {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .recommend {
      margin-left: 17px;
      display: flex;
      font-size: 20px;
      align-items: center;

      svg {
        margin-right: 10px;
      }
    }
  }

  .list-store__time {
    margin-top: 8px;
    line-height: 15px;

    .list-store__time-title {
      line-height: 20px;
      white-space: pre-line;
    }

    .list-store__time-item {
      line-height: 20px;
      margin-top: 5px;
      white-space: pre-line;

      li {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        svg {
          margin-right: 4px;
        }
      }
    }
  }

  .list-store__money {
    color: $red-color;
    font-size: 20px;
  }
}
</style>
