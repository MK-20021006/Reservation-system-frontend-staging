<template>
  <div>
    <el-carousel
      ref="_refCarousel"
      :interval="5000"
      arrow="always"
      indicator-position="none"
      :autoplay="false"
      class="main-carousel"
      :initial-index="arrayImage.length - 1"
      @change="handleChange"
    >
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
      <!--hidden ipad-->
      <div
        v-if="deviceStore.breakPoint >= BreakPointDevice.MD"
        class="smail-image"
      >
        <div
          v-for="(item, index) in filterImagePC"
          :key="index"
          class="smail-image-item"
          @click="() => handleClick(index)"
          @mouseover="() => handleHover(index)"
        >
          <el-image :src="useAssets(item.src)" fit="cover" :lazy="true">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="gallery">
            <p class="description">{{ item.content.description }}</p>
            <p v-show="item.content?.description_detail" class="description">
              {{ item.content.description_detail }}
            </p>
            <el-divider />
            <p class="title">{{ item.content.title }}</p>
          </div>
        </div>
      </div>
    </el-carousel>
    <!--Thumbnail Image in Mobile < 1025px-->
    <div
      v-if="deviceStore.breakPoint < BreakPointDevice.MD"
      class="smail-image"
    >
      <div
        v-for="(item, index) in filterImagePC"
        :key="index"
        class="smail-image-item"
        @click="() => handleClick(index)"
      >
        <el-image :src="useAssets(item.src)" fit="cover" :lazy="true">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="gallery">
          <p class="description">{{ item.content.description }}</p>
          <p v-show="item.content?.description_detail" class="description">
            {{ item.content.description_detail }}
          </p>
          <el-divider />
          <p class="title">{{ item.content.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, nextTick } from "vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import typeStoreCategory from "~/../../src/shared/constants/category";
import { BreakPointDevice } from "~/../../src/shared/constants";
import { useRouter } from "#imports";
import useAssets from "~/../../src/front/composables/useAssets";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

const router = useRouter();
const _refCarousel = ref();
const positionSliderActive = ref(-1);
const deviceStore = useDeviceStore();
const categorySelected = ref(inject("categorySelectedGlobal", ""));

const arrayImage = ref([
  {
    src: "home/beauty.jpg",
    content: {
      description: "ヘアサロン ネイルサロン エステサロン",
      description_detail: "りらくサロン まつげサロン",
      title: "美容・リラク",
    },
  },
  {
    src: "home/restaurant_min.jpg",
    content: {
      description: "レストラン 飲食店 宴会予約",
      title: "飲食",
    },
  },
  {
    src: "home/medical_min.jpg",
    content: {
      description: "クリニック 歯科医院 整骨院",
      title: "医療",
    },
  },
  {
    src: "home/school_min.jpg",
    content: {
      description: "ヨガ教室 塾 料理教室 スポーツクラブ",
      title: "教室",
    },
  },
  {
    src: "home/consultation_min.jpg",
    content: {
      description: "弁護士 社労士 行政書士 結婚相談",
      title: "相談",
    },
  },
  {
    src: "home/event_min.jpg",
    content: {
      description: "工場見学 レジャー お見合いパーティー",
      title: "イベント",
    },
  },
  {
    src: "home/top_header.jpg",
    content: {
      description: "総合予約システム",
      title: "予約ARXIA",
    },
  },
]);

const filterImagePC = computed(() =>
  arrayImage.value.filter((item, index) => index < 6)
);

const handleChange = (index) => {
  positionSliderActive.value = index;
};

const handleClick = (index) => {
  categorySelected.value = `${+index + 1}`;
  useCookie(persistKeys.MENU).value = categorySelected.value;
  nextTick(() => {
    switch (index + 1) {
      case typeStoreCategory.RESTAURANT:
        router.push({ name: "top-restaurant" });
        break;
      case typeStoreCategory.SALON:
        router.push({ name: "top-salon" });
        break;
      case typeStoreCategory.MEDIAL_CARE:
        router.push({ name: "top-medical-care" });
        break;
      case typeStoreCategory.CLASSROOM:
        router.push({ name: "top-school" });
        break;
      case typeStoreCategory.EVENT:
        router.push({ name: "top-event" });
        break;
      case typeStoreCategory.CONSULTATION:
        router.push({ name: "top-consultation" });
        break;
      default:
        router.push({ name: "top-restaurant" });
        break;
    }
  });
};

const handleHover = (index) => {
  categorySelected.value = `${+index + 1}`;
  useCookie(persistKeys.MENU).value = categorySelected.value;
};

onBeforeUnmount(() => {
  categorySelected.value = "";
});
</script>
<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "../../../../shared/assets/scss/variables.scss";

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

  &.el-carousel--horizontal {
    overflow-y: hidden;
  }

  :deep(.el-carousel__container) {
    height: 100%;

    .el-carousel__arrow {
      display: none;

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

.smail-image {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;

  .root-slider {
    display: none;
  }

  .smail-image-item {
    position: relative;
    cursor: pointer;
    flex: 1;
    height: 240px;

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
      justify-content: flex-end;
      align-items: flex-start;
      font-size: 32px;
      color: $white-color;
      font-weight: 400;
      padding-left: 24px;
      padding-right: 80px;
      padding-bottom: 24px;
      text-shadow: 1px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 1px 1px rgba(153, 153, 153, 0.35),
        1px -1px 1px rgba(153, 153, 153, 0.35),
        -1px -1px 1px rgba(153, 153, 153, 0.35),
        1px 0px 1px rgba(153, 153, 153, 0.35),
        0px 1px 1px rgba(153, 153, 153, 0.35),
        -1px 0px 1px rgba(153, 153, 153, 0.35),
        0px -1px 1px rgba(153, 153, 153, 0.35);

      .description {
        font-size: 12px;
        line-height: 18px;
      }

      .el-divider {
        width: 100px;
        margin: 8px 0 4px;
        border: 2px solid $white-color;
      }

      .title {
        font-size: 20px;
        font-weight: 700;
        line-height: 28px;
      }
    }

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .main-carousel {
    height: 840px;

    :deep(.el-carousel__container) {
      height: 100%;
    }
  }

  .smail-image {
    height: 160px;

    .smail-image-item {
      height: 100%;

      .gallery {
        padding-left: 16px;
        padding-right: 30px;

        .description {
          font-size: 11px;
          line-height: 18px;
        }

        .el-divider {
          width: 100px;
          margin: 8px 0 4px;
          border: 1px solid $white-color;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
          line-height: 26px;
        }
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

  .smail-image {
    flex-wrap: wrap;

    .smail-image-item {
      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 640px;

    :deep(.el-carousel__container) {
      height: 100%;
    }
  }

  .smail-image {
    position: relative;
    height: 100%;
    flex-wrap: wrap;

    .smail-image-item {
      height: 180px;
      flex: 1 1 calc(100% / 3);

      .gallery {
        padding-bottom: 16px;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      left: 50%;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      width: 470px;

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
    height: 556px;
  }

  .smail-image {
    position: relative;
    height: 100%;
    flex-wrap: wrap;

    .smail-image-item {
      height: 140px;
      flex: 1 1 calc(100% / 2);

      .gallery {
        padding-bottom: 12px;
        padding-left: 12px;
        padding-right: 12px;

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .el-divider {
          width: 100px;
          margin: 8px 0 4px;
          border: 1px solid $white-color;
        }

        .title {
          font-size: 20px;
          font-weight: 700;
          line-height: 28px;
        }
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
}

@include res("xs-phone", $custom-breakpoints-spec) {
  .slider-image {
    :deep(.el-image) {
      img {
        object-position: -425px;
      }
    }
  }
}
</style>
