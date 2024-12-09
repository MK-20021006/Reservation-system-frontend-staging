<template>
  <div>
    <el-carousel
      ref="_refCarousel"
      height="400px"
      :autoplay="true"
      direction="horizontal"
      arrow="never"
      :interval="5000"
      indicator-position="none"
      :initial-index="0"
      :prefix-icon="IconLeftImage"
    >
      <template #default>
        <div v-if="dataImage.length > 1" class="prev-image" @click="prevImage">
          <IconLeftImage />
        </div>
        <div v-if="dataImage.length > 1" class="next-image" @click="nextImage">
          <IconRightImage />
        </div>
        <el-carousel-item v-for="item in dataImage" :key="item">
          <div class="show-icon-next">
            <img :src="item.url" />
          </div>
        </el-carousel-item>
        <el-carousel-item v-if="dataImage.length === 0">
          <img src="../../assets/images/default_store.svg" />
        </el-carousel-item>
      </template>
    </el-carousel>
    <div class="smail-image">
      <div
        v-for="(itemImage, index) in dataImage"
        :key="itemImage"
        class="smail-image-item"
        @click="handleHover(index)"
        @mouseover="handleHover(index)"
      >
        <img :src="itemImage.url" />
      </div>
      <div
        v-for="itemImage in imageLength"
        :key="itemImage"
        class="smail-image-item"
      >
        <img src="../../assets/images/default_store.svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs, ref, computed, watchEffect } from "vue";
import IconLeftImage from "~/../../src/front/components/Icon/LeftImage.vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
const { data } = toRefs(props);
const imageLength = ref(0);

const prevImage = () => {
  _refCarousel.value.prev();
};

const nextImage = () => {
  _refCarousel.value.next();
};

const _refCarousel = ref();
const handleHover = (index: number) => {
  _refCarousel.value.setActiveItem(index);
};

const dataImage = computed(() => {
  const dataGet: any[] = [];
  if (data.value) {
    data.value.filter((item, index) => {
      if (index < 10) {
        dataGet.push(item);
      }
    });
  }
  return dataGet;
});

watchEffect(() => {
  imageLength.value = 5 - Number(dataImage.value?.length);
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.el-carousel--horizontal {
  padding: 0 1px;

  .el-carousel__container {
    .prev-image,
    .next-image {
      position: absolute;
      top: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 12.5px;
      height: 25px;
      cursor: pointer;
      z-index: 10;
      transform: translateY(-50%);
    }

    .prev-image {
      left: 5%;
    }

    .next-image {
      right: 5%;
    }

    .el-carousel__item {
      height: 400px;
      max-height: 400px;
      width: 100%;

      &:hover {
        opacity: 0.5;
      }

      img {
        object-fit: cover;
        width: 100%;
        height: 400px;
      }
    }
  }
}

.smail-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  gap: 4px;

  .smail-image-item {
    position: relative;
    width: calc(100% / 5);
    height: auto;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }

    a {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px) {
  .smail-image {
    .smail-image-item {
      img {
        height: 120px;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .smail-image {
    .smail-image-item {
      img {
        height: 100px;
      }
    }
  }
}
@include res("sm-and-down", $breakpoints-spec) {
  .smail-image {
    .smail-image-item {
      img {
        height: 80px;
      }
    }
  }
}
</style>
