<template>
  <div class="section-photo-of-industry">
    <div class="store-area">
      <el-carousel
        ref="_refCarouselSectionFour"
        indicator-position="none"
        arrow="never"
        :autoplay="false"
        :initial-index="0"
        @change="handleChange"
      >
        <div
          class="pre-slide hidden-sm-and-up"
          @click="handlePreviousSliderSectionFour"
        >
          <el-icon color="#ffffff">
            <ArrowLeft />
          </el-icon>
        </div>
        <el-carousel-item v-for="(item, index) in arrayImage" :key="index">
          <el-image :src="useAssets(item)" fit="cover">
            <template #error>
              <div class="image-slot">
                <div class="image-slot">
                  <IconDefaultStore />
                </div>
              </div>
            </template>
          </el-image>
        </el-carousel-item>
        <div
          class="next-slide hidden-sm-and-up"
          @click="handleNextSliderSectionFour"
        >
          <el-icon color="#ffffff">
            <ArrowRight />
          </el-icon>
        </div>
      </el-carousel>
      <div class="button-arrow d-flex justify-content-center hidden-xs-only">
        <div class="btn arrow-left" @click="handlePreviousSliderSectionFour">
          <el-icon size="16px" color="#CCCCCC">
            <ArrowLeft />
          </el-icon>
        </div>
        <div class="btn arrow-right" @click="handleNextSliderSectionFour">
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
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { ref } from "vue";
import useAssets from "~/../../src/front/composables/useAssets";

const _refCarouselSectionFour = ref();
const positionSliderActive = ref(0);
const arrayImage = ref(["Industry.png", "Industry.png"]);

const handlePreviousSliderSectionFour = () => {
  _refCarouselSectionFour.value.prev();
};

const handleNextSliderSectionFour = () => {
  _refCarouselSectionFour.value.next();
};

const handleBlur = (index) => {
  _refCarouselSectionFour.value?.setActiveItem(index);
};

const handleChange = (index) => {
  positionSliderActive.value = index;
};
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";

.section-photo-of-industry {
  .store-area {
    padding: 100px 16% 75px;
    background-color: rgba(96, 98, 102, 0.2);

    :deep(.el-carousel__container) {
      height: calc(1300px / 3);
      text-align: center;
    }

    .el-carousel {
      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    .button-arrow {
      margin-top: 32px;
      gap: 20px;

      .btn {
        width: 80px;
        height: 80px;
        background-color: rgba(96, 98, 102, 0.8);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .section-photo-of-industry {
    .store-area {
      padding: 80px 12.5% 50px;

      :deep(.el-carousel__container) {
        height: calc(1300px / 4);
      }

      .el-carousel {
      }

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

@include res("sm-and-down", $breakpoints-spec) {
  .section-photo-of-industry {
    .store-area {
      padding: 60px 5% 30px;

      :deep(.el-carousel__container) {
        height: calc(1300px / 5);
      }

      .el-carousel {
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

@include res("xs-only", $breakpoints-spec) {
  .section-photo-of-industry {
    height: 157px;

    .store-area {
      padding: 24px 24px 8px;

      :deep(.el-carousel__container) {
        height: 109px;
      }

      .el-carousel {
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
