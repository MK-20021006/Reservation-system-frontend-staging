<template>
  <div class="custom-image">
    <el-carousel
      ref="_refCarousel"
      height="200px"
      :interval="5000"
      :autoplay="true"
      direction="horizontal"
      indicator-position="none"
      arrow="never"
      :initial-index="0"
    >
      <template #default>
        <div v-if="dataImage?.length > 1" class="prev-image" @click="prevImage">
          <IconLeftImage />
        </div>
        <div v-if="dataImage?.length > 1" class="next-image" @click="nextImage">
          <IconRightImage />
        </div>
        <el-carousel-item v-for="(item, index) in dataImage" :key="item">
          <div class="custom-image-slider">
            <img :src="item?.url" />
            <div class="show-content">
              <div class="name ellipsis">
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  width="250px"
                  :title="name"
                >
                  <template #reference>
                    <div class="notice-content">
                      {{ name }}
                    </div>
                  </template>
                </el-popover>
              </div>
              <div class="transportation ellipsis">
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  width="250px"
                  :title="transportation"
                >
                  <template #reference>
                    <div class="notice-content">
                      {{ transportation }}
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
            <div class="item">{{ index + 1 }}/{{ dataImage?.length }}</div>
          </div>
        </el-carousel-item>
        <el-carousel-item
          v-if="dataImage?.length === 0"
          class="custom-image-slider"
        >
          <img src="../../assets/images/default_store.svg" />
          <div class="show-content">
            <div class="name ellipsis">
              <el-popover
                placement="bottom"
                trigger="hover"
                width="250px"
                :title="name"
              >
                <template #reference>
                  <div class="notice-content">
                    {{ name }}
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="transportation ellipsis">
              <el-popover
                placement="bottom"
                trigger="hover"
                width="250px"
                :title="transportation"
              >
                <template #reference>
                  <div class="notice-content">
                    {{ transportation }}
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
        </el-carousel-item>
      </template>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs, computed, ref } from "vue";
import { ModelHasFile } from "~/../../src/shared/models";

interface Prop {
  data: ModelHasFile[];
  name: string;
  transportation?: string;
  id: number;
}
const props = defineProps<Prop>();
const { data, id } = toRefs(props);

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
const _refCarousel = ref();
const prevImage = () => {
  _refCarousel.value.prev();
};

const nextImage = () => {
  _refCarousel.value.next();
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.el-carousel--horizontal {
  margin-bottom: 16px;

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
      height: 200px;
      width: 100%;
      cursor: pointer;

      img {
        object-fit: cover;
        width: 100%;
        height: 200px;
        cursor: pointer;
      }
    }

    .custom-image-slider {
      position: relative;

      .item {
        position: absolute;
        top: 10px;
        right: 10px;
        color: $white-color;
        font-size: 12px;
      }

      .show-content {
        position: absolute;
        bottom: 16px;
        left: 16px;
        color: $white-color;
        font-size: 12px;
        padding-right: 16px;

        .name {
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .transportation {
          font-size: 12px;
          -webkit-line-clamp: 2;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
