<template>
  <div class="photo-image">
    <div class="photo-menu">
      <div
        v-for="item in data"
        :key="item"
        class="list-image-photo"
        @click="showImage(item.file.url)"
      >
        <img :src="item.file.url" />
      </div>
    </div>
    <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { Photo } from "~/../../src/front/models";

interface Prop {
  data: Photo[];
}

const props = defineProps<Prop>();
const { data } = toRefs(props);

const imageUrl = ref("");
const dialogVisible = ref(false);
const showImage = (url) => {
  if (url) {
    imageUrl.value = url;
    dialogVisible.value = true;
  }
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.photo-image {
  .photo-menu {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;

    .list-image-photo {
      width: calc(100% / 6 - 7px);
      margin-right: 8.4px;
      margin-bottom: 8px;
      cursor: pointer;

      img {
        width: 100%;
        object-fit: cover;
        height: 116px;

        &:hover {
          opacity: 0.5;
        }
      }

      &:nth-child(6n) {
        margin-right: 0;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .photo-image {
    .photo-menu {
      .list-image-photo {
        width: calc(100% / 3 - 1px);
        margin-right: 1.5px;
        margin-bottom: 1.5px;
        height: 116px;

        &:nth-child(3n) {
          margin-right: 0;
        }

        img {
          width: 100%;
          object-fit: cover;
          //height: auto;
        }
      }
    }
  }
}
</style>
