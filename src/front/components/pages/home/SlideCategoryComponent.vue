<template>
  <div>
    <!-- START Component for PC -->
    <el-carousel
      ref="_refCarousel"
      :interval="5000"
      arrow="always"
      indicator-position="none"
      :autoplay="true"
      class="main-carousel"
      @change="handleChange"
    >
      <!-- START Large image top -->
      <el-carousel-item v-for="(item, key) in arrayImage" :key="key">
        <div class="slider-image">
          <el-image :src="useAssets(item.src)" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="content-main-slider">
            <p class="text-green__screen-top">
              <span class="text-black">あらゆる</span>
              <span>サービス</span>
              <span class="text-black">に</span>
              <span>対応</span>
              <span class="text-black">した</span>
            </p>
            <h3>予約ポータルサイト</h3>
            <h6>アークシア総合予約</h6>
          </div>
        </div>
      </el-carousel-item>
      <!-- END Large image top -->
      <!-- START Small image bottom -->
      <div v-if="!deviceStore.isMobile()" class="small-image">
        <div
          v-for="(item, index) in filterImagePC"
          :key="index"
          class="small-image-item"
          @mouseover="() => handleHover(index)"
          @click="() => handleClickSmallImage(item.content)"
        >
          <el-image :src="useAssets(item.src)" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="gallery">
            <p>{{ item.content }}</p>
            <p v-if="item.description">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <!-- END Small image bottom -->
    </el-carousel>
    <!-- END Component for PC -->
    <!-- START Component for mobile (width < 768px) -->
    <div v-if="deviceStore.isMobile()" class="small-image">
      <div class="pre-slide" @click="handlePreSlide">
        <el-icon color="#ffffff">
          <ArrowLeft />
        </el-icon>
      </div>
      <div
        v-for="(item, index) in filterImageMobile"
        :key="index"
        class="small-image-item"
        @mouseover="() => handleHover(index)"
        @click="() => handleClickSmallImage(item.content)"
      >
        <el-image :src="useAssets(item.src)" fit="cover">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="gallery">
          <p>{{ item.content }}</p>
          <p v-if="item.description">{{ item.description }}</p>
        </div>
      </div>
      <div
        class="next-slide"
        :class="{ 'is-focus': isFocus }"
        @click="handleNextSlide"
      >
        <el-icon color="#ffffff">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <!-- END Component for mobile (width < 768px) -->
    <div class="indicator">
      <div
        v-for="i in filterImagePC.length"
        :key="i - 1"
        class="indicator-item"
        :class="{ active: i - 1 === positionSliderActive }"
        @mouseenter="handleBlur(i - 1)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { useNuxtApp, useRouter } from "nuxt/app";

import {
  ArrowLeft,
  ArrowRight,
  Picture as IconPicture,
} from "@element-plus/icons-vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import useAssets from "~/../../src/front/composables/useAssets";
import { useStoreSearch } from "~/../../src/front/store/store";

const router = useRouter();
const storeSearch = useStoreSearch();
const { $bus } = useNuxtApp();

const _refCarousel = ref();
const positionSliderActive = ref(0);
const deviceStore = useDeviceStore();

interface Image {
  src: string;
  content: string;
}

interface Prop {
  arrayImage?: Image[];
}

const props = withDefaults(defineProps<Prop>(), {
  arrayImage: () => [],
});

const isFocus = ref(false);

const filterImageMobile = computed(() => {
  const nextIndex =
    positionSliderActive.value >= 5 ? 0 : positionSliderActive.value + 1;

  return [
    props.arrayImage.at(positionSliderActive.value - 1) as Image,
    props.arrayImage.at(positionSliderActive.value) as Image,
    props.arrayImage.at(nextIndex) as Image,
  ];
});

const filterImagePC = computed(() =>
  props.arrayImage.filter((item, index) => index < 6)
);

const handleChange = (index: any) => {
  positionSliderActive.value = index;
};

const handleHover = (index: any) => {
  _refCarousel.value?.setActiveItem(index);
};

const handleBlur = (index: any) => {
  _refCarousel.value?.setActiveItem(index);
};

const handlePreSlide = () => {
  _refCarousel.value.prev();
};

const handleNextSlide = () => {
  _refCarousel.value.next();
};

const handleClickSmallImage = async (content: string) => {
  storeSearch.headerSearch.keyword_name = content;
  $bus.$emit("searchStore", storeSearch.headerSearch);
  await router.push({ name: "store" });
};
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/variables.scss";

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.main-carousel {
  height: 1040px;

  :deep(.el-carousel__container) {
    height: 100%;

    .el-carousel__arrow--right {
      right: 160px;
    }

    .el-carousel__arrow--left {
      left: 160px;
    }

    .el-carousel__arrow {
      border-radius: 0;
      background-color: #303133cc;
      width: 80px;
      height: 80px;
      top: calc(50% - (216px / 2 - 120px / 2));
      transform: translateY(-50%);

      &:hover {
        background-color: #303133ff;
      }

      .el-icon {
        height: 22px;
        width: 22px;
      }

      svg {
        height: 22px;
        width: 22px;
      }
    }
  }
}

.slider-image {
  position: relative;
  width: 100%;
  height: 100%;

  .content-main-slider {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $white-color;
    position: absolute;
    left: 50%;
    top: calc(50% - (216px / 2 - 120px / 2));
    transform: translateY(-50%) translateX(-50%);
    font-family: variables.$fontFamily;
    text-align: center;
    width: 750px;

    .text-green__screen-top span {
      text-shadow: 1px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 1px 1px rgba(153, 153, 153, 0.35),
        1px -1px 1px rgba(153, 153, 153, 0.35),
        -1px -1px 1px rgba(153, 153, 153, 0.35),
        1px 0px 1px rgba(153, 153, 153, 0.35),
        0px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 0px 1px rgba(153, 153, 153, 0.35),
        0px -1px 1px rgba(153, 153, 153, 0.35);
    }

    p {
      font-size: 40px;
      font-weight: 400;
      line-height: 54px;
      letter-spacing: 0.44em;

      .text-black {
        color: #010304;
      }
      width: 100%;
    }

    h3 {
      color: $white-color;
      font-size: 48px;
      line-height: 46px;
      font-weight: 700;
      padding: 15px 0;
      background: #251e1c;
      margin: 15px 0;
      letter-spacing: 0.56em;
      width: 100%;
    }

    h6 {
      font-size: 56px;
      line-height: 46px;
      font-weight: 500;
      padding: 11px 0;
      color: #251e1c;
      background: $white-color;
      letter-spacing: 0.4em;
      width: 100%;
    }
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }

  .image-slot .el-icon {
    font-size: 30px;
  }
}

.small-image {
  display: flex;
  width: 100%;
  height: 216px;
  justify-content: center;
  align-items: center;
  background-color: $black-80;
  position: absolute;
  bottom: 0;
  left: 0;

  .root-slider {
    display: none;
  }

  .small-image-item {
    position: relative;
    margin: 0 8px;
    cursor: pointer;
    flex: 1;
    height: 184px;

    &:hover {
      .gallery {
        background-color: $black-80;
        width: 100%;
        height: 100%;
      }
    }

    .gallery {
      font-family: variables.$fontFamily;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: $white-color;
      font-weight: 400;
      font-size: 29px;
      text-shadow: 1px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 1px 1px rgba(153, 153, 153, 0.35),
        1px -1px 1px rgba(153, 153, 153, 0.35),
        -1px -1px 1px rgba(153, 153, 153, 0.35),
        1px 0px 1px rgba(153, 153, 153, 0.35),
        0px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 0px 1px rgba(153, 153, 153, 0.35),
        0px -1px 1px rgba(153, 153, 153, 0.35);
      gap: 10px;
      white-space: nowrap;
    }

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

.indicator {
  height: 48px;
  background-color: $black-100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  .indicator-item {
    width: 16px;
    height: 16px;
    background-color: $pink-color;
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
      background-color: $black-100;
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

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .main-carousel {
    height: 840px;

    :deep(.el-carousel__container) {
      height: 100%;

      .el-carousel__arrow--right {
        right: 90px;
      }

      .el-carousel__arrow--left {
        left: 90px;
      }

      .el-carousel__arrow {
        width: 50px;
        height: 50px;
        top: calc(50% - (134px / 2 - 116px / 2));
        transform: translateY(-50%);
      }
    }
  }

  .small-image {
    height: 134px;

    .small-image-item {
      height: 110px;

      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      top: calc(50% - (160px / 2 - 116px / 2));
      transform: translateY(-50%) translateX(-50%);
      width: 600px;

      p {
        font-size: 30px;
      }

      h3 {
        font-size: 35px;
      }

      h6 {
        font-size: 42px;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 760px;

    :deep(.el-carousel__container) {
      height: 100%;

      .el-carousel__arrow--right {
        right: 60px;
      }

      .el-carousel__arrow--left {
        left: 60px;
      }

      .el-carousel__arrow {
        top: calc(50% - 134px / 2);
        transform: translateY(calc(-50%));
      }
    }
  }

  .small-image {
    height: 134px;

    .small-image-item {
      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      top: calc(50% - 134px / 2);
      transform: translateY(-50%) translateX(-50%);
      width: 550px;

      p {
        font-size: 29px;
      }

      h3 {
        font-size: 35px;
      }

      h6 {
        font-size: 42px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 640px;
  }

  .small-image {
    .small-image-item {
      .gallery {
        font-size: 16px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .slider-image {
    .content-main-slider {
      left: 50%;
      top: 40%;
      transform: translateY(-50%) translateX(-50%);

      p {
        font-size: 25px;
        line-height: 40px;
      }

      h3 {
        font-size: 30px;
        line-height: 30px;
      }

      h6 {
        font-size: 35px;
        line-height: 35px;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .main-carousel {
    height: 480px;

    :deep(.el-carousel__container) {
      .el-carousel__arrow {
        display: none;
      }
    }
  }

  .small-image {
    position: relative;
    height: 92px;

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

    .small-image-item {
      height: 68px;

      .gallery {
        font-size: 16px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      left: 50%;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      width: 340px;

      p {
        font-size: 18px;
        line-height: 30px;
      }

      h3 {
        font-size: 20px;
        padding: 10px 0;
        line-height: 28px;
        margin: 10px 0;
      }

      h6 {
        font-size: 22px;
        padding: 10px 0;
        line-height: 30px;
      }
    }
  }

  .indicator {
    height: 16px;
    gap: 8px;

    .indicator-item {
      width: 8px;
      height: 8px;

      &:after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80%;
        height: 80%;
        border-radius: 100%;
        transform: translateX(-50%) translateY(-50%);
        background-color: $black-100;
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

@include res("xs-phone", $custom-breakpoints-spec) {
  .slider-image {
    :deep(.el-image) {
      img {
        object-position: -260px;
      }
    }
  }
}
</style>
