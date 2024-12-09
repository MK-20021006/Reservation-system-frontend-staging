<template>
  <div v-if="dataReview.length" class="review-recruitment">
    <div class="review-header">
      <div class="review-header-title">
        {{ $t("front.recruitment.review_of_stup") }}
      </div>
    </div>
    <div v-for="item in dataReview" class="review-item">
      <div class="review-item__images">
        <img v-if="item.image.url" :src="item.image.url" alt="" />
        <img v-else src="../../../assets/images/default_store.svg" alt="" />
      </div>
      <div class="review-item__body">
        <p class="review-item__body--title">
          {{ item.title }}
        </p>
        <p class="review-item__body--text">
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import { Recruitment } from "~/../../src/shared/types/recruitment";
interface Prop {
  dataReview?: Recruitment;
}

const props = withDefaults(defineProps<Prop>(), {
  dataReview: [],
});

toRefs(props);
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.review-recruitment {
  .review-header {
    &-title {
      background-color: #b4985c33;
      color: #b4985c;
      font-weight: bold;
      padding: 12px 24px;
      font-size: 15px;
      margin-bottom: 15px;
      border-radius: 3px;
    }
  }

  .review-item {
    display: flex;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e4e4e4;

    &__images {
      width: 160px;
      height: 160px;
    }

    &__images img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__body {
      width: calc(100% - 160px);
      padding-left: 15px;
      text-align: justify;

      &--title {
        padding-bottom: 8px;
        font-size: 16px;
        line-height: 24px;
        font-weight: bold;
        white-space: break-spaces;
      }

      &--text {
        font-size: 14px;
        line-height: 22px;
        white-space: break-spaces;
      }
    }

    img:hover {
      opacity: 0.6;
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .review-recruitment {
    .review-item {
      display: block;
      border-bottom: 0 !important;
      margin-bottom: 0;

      &__body {
        padding-bottom: 15px;
        border-bottom: 1px solid $grey-small-color;

        &--title {
          padding-top: 16px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .review-recruitment {
    .review-item {
      padding: 0 24px;

      &__body {
        padding-bottom: 15px;
        border-bottom: 1px solid $grey-small-color;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
