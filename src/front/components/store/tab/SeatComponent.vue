<template>
  <div v-for="item in data" :key="item.type_id" class="photo-seat">
    <store-title :title="item.name" />
    <div class="image-photo-seat">
      <div v-for="file in item.file" :key="file" class="list-image-seat">
        <img
          v-if="file.url"
          :src="file.url"
          alt=""
          @click="showImage(file.url)"
        />
        <img v-else src="../../../assets/images/default_store.svg" alt="" />
        <el-popover
          placement="top-start"
          :title="file.name"
          :content="file.description"
          :width="340"
          trigger="hover"
          :teleported="false"
        >
          <template #reference>
            <div class="title-image">
              {{ file.name }}
              <span v-if="file.description"> | {{ file.description }}</span>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
  <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
</template>

<script lang="ts" setup>
import { defineProps, toRefs, ref } from "vue";
import typeRequest from "~/../../src/shared/requests/TypeRequest";
import { Type } from "~/../../src/shared/models";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { TYPE_PARAMS } from "~/../../src/shared/constants/booking";

const typeSeat = ref<Type[]>([]);
typeSeat.value = (
  await typeRequest.getAllType(MODEL_TYPE.SEAT, TYPE_PARAMS.BOOKING)
).data;

const props = defineProps({
  data: {
    require: true,
    type: Array,
  },
});
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
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.photo-seat {
  :deep(.el-popper) {
    white-space: pre-wrap;
  }

  .image-photo-seat {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;

    .list-image-seat {
      cursor: pointer;
      width: calc(100% / 2 - 8px);
      margin-right: 16px;
      margin-bottom: 8px;

      .title-image {
        width: 100%;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: -webkit-box;
      }

      img {
        width: 100%;
        object-fit: cover;
        height: 441px;

        &:hover {
          opacity: 0.5;
        }
      }

      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}

@include res("md-only", $breakpoints-spec) {
  .photo-seat {
    .image-photo-seat {
      padding: 0 16px;
      .list-image-seat {
        img {
          height: 163px;
          object-fit: cover;
        }
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .photo-seat {
    .image-photo-seat {
      padding: 0 16px;
      .list-image-seat {
        img {
          height: 163px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .photo-seat {
    .image-photo-seat {
      padding: 0 16px;
      .list-image-seat {
        img {
          height: 163px;
        }
      }
    }
  }
}
</style>
