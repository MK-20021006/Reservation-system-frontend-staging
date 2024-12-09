<template>
  <div v-if="bannerAdsList.length > 0" class="section-banner-large">
    <div class="store-area"></div>
    <el-carousel
      ref="_refCarousel"
      class="carousel"
      indicator-position="none"
      arrow="never"
      :interval="TIME_CHANGE_BANNER_ADS"
      :initial-index="0"
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
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { ref, onBeforeMount, watch, onMounted, nextTick } from "vue";

import { BannerAdsStore } from "../../../../front/store/bannerAds";

import { BannerAds } from "../../../../front/models";

import { fetchBanner } from "../../../composables/getBannerAds";
import { TIME_CHANGE_BANNER_ADS } from "../../../constants";

const _refCarousel = ref();
const positionSliderActive = ref(0);
const arrayImage = ref(["Rectangle.png", "Rectangle.png"]);

const bannerAdsStore = BannerAdsStore();
const bannerAdsList = ref<BannerAds[]>([]);

const handlePreviousSlider = () => {
  _refCarousel.value.prev();
};

const handleNextSlider = () => {
  _refCarousel.value.next();
};

const handleBlur = (index) => {
  _refCarousel.value?.setActiveItem(index);
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
  () => bannerAdsStore.getBannerLarge,
  () => (bannerAdsList.value = bannerAdsStore.getBannerLarge)
);

onBeforeMount(async () => {
  await fetchBanner({ fetchIfEmpty: true, forceFetch: true });
  bannerAdsList.value = bannerAdsStore.getBannerLarge;
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";

.section-banner-large {
  position: relative;
  margin-bottom: 80px;
  .store-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(96, 98, 102, 0.2);
    height: 560px;
  }

  :deep(.el-carousel__container) {
    height: calc(1300px * 5 / 9);
    text-align: center;
  }

  .carousel {
    padding: 106px 15% 0;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .button-arrow {
    margin-top: 26px;
    gap: 32px;

    .btn {
      width: 80px;
      height: 80px;
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

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .section-banner-large {
    .store-area {
      height: 440px;
    }

    :deep(.el-carousel__container) {
      height: calc(1300px * 3 / 7);
    }

    .carousel {
      padding: 100px 12.5% 0;
    }

    .button-arrow {
      margin-top: 22px;
      gap: 20px;
      .btn {
        width: 60px;
        height: 60px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .section-banner-large {
    .store-area {
      height: 320px;
    }

    :deep(.el-carousel__container) {
      height: calc(1300px * 3 / 9);
    }

    .carousel {
      padding: 60px 5% 0;
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

@include res("xs-only", $breakpoints-spec) {
  .section-banner-large {
    .store-area {
      height: 243px;
    }

    .carousel {
      padding: 24px 24px 8px;

      :deep(.el-carousel__container) {
        height: 182px;

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
      }
    }

    .button-arrow {
      margin-top: 20px;
      gap: 18px;
      .btn {
        width: 50px;
        height: 50px;
      }
    }

    .indicator {
      margin-bottom: 8px;
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
