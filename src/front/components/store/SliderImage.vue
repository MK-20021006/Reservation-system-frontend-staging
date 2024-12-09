<template>
  <div>
    <el-carousel
      ref="_refCarousel"
      height="220px"
      :autoplay="true"
      :interval="5000"
      direction="horizontal"
      arrow="never"
      indicator-position="none"
      :initial-index="0"
    >
      <el-carousel-item v-for="item in dataImage" :key="item">
        <NuxtLink :to="`store/${id}`"></NuxtLink>
        <img :src="item.file?.url" />
      </el-carousel-item>
      <el-carousel-item v-if="dataImage.length === 0">
        <NuxtLink :to="`store/${id}`"></NuxtLink>
        <img src="../../assets/images/default_store.svg" />
      </el-carousel-item>
    </el-carousel>
    <div class="smail-image">
      <div
        v-for="(itemImage, index) in dataImage"
        :key="itemImage"
        class="smail-image-item"
        @mouseover="handleHover(index)"
      >
        <NuxtLink :to="`store/${id}`"></NuxtLink>
        <img :src="itemImage.file?.url" />
      </div>
      <div
        v-for="itemImage in imageLength"
        :key="itemImage"
        class="smail-image-item"
      >
        <NuxtLink :to="`store/${id}`"></NuxtLink>
        <img src="../../assets/images/default_store.svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs, ref, computed } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});
const { data, id } = toRefs(props);

const dataImage = computed(() => {
  return data.value.filter((item, index) => {
    if (index < 3) {
      return item;
    }
  });
});

const imageLength = 3 - Number(dataImage.value.length);
const _refCarousel = ref();
const handleHover = (index) => {
  _refCarousel.value.setActiveItem(index);
};
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;

.el-carousel--horizontal {
  overflow: hidden;

  .el-carousel__container {
    .el-carousel__item {
      height: 220px;
      max-height: 220px;
      width: 100%;
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
        height: 220px;
        object-fit: cover;
        cursor: pointer;
      }
    }
  }
}

.smail-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;

  .smail-image-item {
    position: relative;
    width: calc(100% / 3 - 4px);
    margin-right: 6px;
    height: 70px;

    &:last-child {
      margin-right: 0;
    }

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
      height: 100%;
      max-width: 100%;
      object-fit: cover;
    }
  }
}

@media screen and (max-width: 850px) {
  .el-carousel--horizontal {
    display: none;
  }

  .smail-image {
    .smail-image-item {
      position: relative;
      width: calc(100% / 3 - 1px);
      margin-right: 1.5px;
      height: 124px;
    }
  }
}
</style>
