<template>
  <div v-if="bannerAdsList.length > 0" class="section-banner-small">
    <div class="carousel">
      <!-- Start Carousel -->
      <el-carousel
        ref="_refCarouselSectionBannerSmall"
        indicator-position="none"
        arrow="never"
        :interval="TIME_CHANGE_BANNER_ADS"
        @change="handleChange"
      >
        <div class="pre-slide hidden-sm-and-up" @click="handlePreviousSlider">
          <el-icon color="#ffffff">
            <ArrowLeft />
          </el-icon>
        </div>
        <el-carousel-item v-for="(item, index) in bannerAdsList" :key="index">
          <el-image
            class="cursor-pointer"
            :src="item.image.url"
            fit="cover"
            @click="() => handleClick(item.url)"
          >
            <template #error>
              <div class="image-slot">
                <div class="image-slot">
                  <IconDefaultStore />
                </div>
              </div>
            </template>
          </el-image>
        </el-carousel-item>
        <div class="next-slide hidden-sm-and-up" @click="handleNextSlider">
          <el-icon color="#ffffff">
            <ArrowRight />
          </el-icon>
        </div>
      </el-carousel>
      <!-- End Carousel -->
      <!-- Start Button Control -->
      <div class="button-arrow d-flex justify-content-center hidden-xs-only">
        <div class="btn arrow-left" @click="handlePreviousSlider">
          <el-icon size="16px" color="#CCCCCC">
            <ArrowLeft />
          </el-icon>
        </div>
        <div class="btn arrow-right" @click="handleNextSlider">
          <el-icon size="16px" color="#CCCCCC">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="indicator hidden-sm-and-up">
        <div
          v-for="i in arrayImage.length"
          :key="i - 1"
          class="indicator-item"
          :class="{ active: i - 1 === positionSliderActive }"
          @mouseenter="handleBlur(i - 1)"
        />
      </div>
      <!-- End Button Control -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { ref, onBeforeMount, watch, onMounted, nextTick } from "vue";

import { BannerAdsStore } from "../../../../front/store/bannerAds";

import { BannerAds } from "../../../../front/models";

import { fetchBanner } from "../../../composables/getBannerAds";
import { TIME_CHANGE_BANNER_ADS } from "../../../constants";

const _refCarouselSectionBannerSmall = ref();
const positionSliderActive = ref(0);
const arrayImage = ref(["Rectangle.png", "Rectangle.png"]);

const bannerAdsStore = BannerAdsStore();
const bannerAdsList = ref<BannerAds[]>(bannerAdsStore.getBannerSmall);

const handlePreviousSlider = () => {
  _refCarouselSectionBannerSmall.value.prev();
};

const handleNextSlider = () => {
  _refCarouselSectionBannerSmall.value.next();
};

const handleBlur = (index) => {
  _refCarouselSectionBannerSmall.value?.setActiveItem(index);
};

const handleChange = (index) => {
  positionSliderActive.value = index;
};

const handleClick = (url: string | null) => {
  if (window && url) {
    window.open(url, "_blank")?.focus();
  }
};

watch(
  () => bannerAdsStore.getBannerSmall,
  () => (bannerAdsList.value = bannerAdsStore.getBannerSmall)
);

onBeforeMount(async () => {
  await fetchBanner({ fetchIfEmpty: true, forceFetch: true });
  bannerAdsList.value = bannerAdsStore.getBannerSmall;
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";

.section-banner-small {
  position: relative;
  background: rgba(96, 98, 102, 0.2);
  height: 720px;
  margin-bottom: 80px;

  .carousel {
    padding: 100px 15% 75px;

    .el-carousel {
      :deep(.el-carousel__container) {
        height: calc(1300px / 3);
        text-align: center;

        .el-carousel__item {
          .el-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .button-arrow {
      margin-top: 32px;
      gap: 20px;

      .btn {
        width: 80px;
        height: 80px;
        border: 1px solid $white-10;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(96, 98, 102, 0.8);

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .section-banner-small {
    .store-area {
      padding: 80px 12.5% 50px;

      :deep(.el-carousel__container) {
        height: calc(1300px / 4);
      }

      .carousel {
        .el-carousel {
          .button-arrow {
            margin-top: 28px;
            gap: 20px;

            .btn {
              width: 60px;
              height: 60px;
            }
          }
        }
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .section-banner-small {
    .store-area {
      padding: 60px 5% 30px;

      :deep(.el-carousel__container) {
        height: calc(1300px / 5);
      }

      .carousel {
        .el-carousel {
          .button-arrow {
            margin-top: 20px;
            gap: 18px;

            .btn {
              width: 50px;
              height: 50px;
            }
          }
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .section-banner-small {
    height: 157px;

    .carousel {
      padding: 24px 24px 8px;

      .el-carousel {
        :deep(.el-carousel__container) {
          height: 109px;
        }

        .pre-slide,
        .next-slide {
          display: flex;
          width: 25px;
          height: 25px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: absolute;
          z-index: 9;
          background-color: #303133cc;
          top: 50%;
          transform: translateY(-50%);

          &:hover {
            background-color: #303133ff;
          }
        }

        .pre-slide {
          left: 10px;
        }

        .next-slide {
          right: 10px;
        }

        .button-arrow {
          margin-top: 20px;
          gap: 18px;

          .btn {
            width: 50px;
            height: 50px;
          }
        }
      }
    }
  }
  .indicator {
    margin-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .indicator-item {
      width: 8px;
      height: 8px;
      background-color: $gray-text;
      border-radius: 100%;
      position: relative;
      cursor: pointer;

      &:after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 70%;
        height: 70%;
        border-radius: 100%;
        transform: translateX(-50%) translateY(-50%);
        background-color: $gray-800;
        transition: 0.2s ease-in;
      }

      &.active,
      &:hover {
        &:after {
          width: 0;
          height: 0;
        }
      }
    }
  }
}
</style>
