<template>
  <div
    v-loading="loading"
    class="photo"
    :class="{
      'show-photo': totalEvent > 0,
    }"
  >
    <div v-if="dataPhotoStaff.length > 0" class="list-event">
      <store-title :title="$t('event') + `(${totalEvent})`" />
      <div id="photo-event" class="image-photo">
        <div
          v-for="item in dataPhotoStaff"
          :key="item"
          class="list-image"
          @click="showImage(item.file.url)"
        >
          <img :src="item.file.url" />
          <div class="title-image">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="totalEvent > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="page"
          :total="totalEvent"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.STAFF)"
        />
      </div>
    </div>
    <div v-if="dataEvent.length > 0" class="list-event">
      <store-title :title="$t('event') + `(${totalEvent})`" />
      <div id="photo-event" class="image-photo">
        <div
          v-for="item in dataEvent"
          :key="item"
          class="list-image"
          @click="showImage(item.file.url)"
        >
          <img :src="item.file.url" />
          <div class="title-image">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="totalEvent > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="pageEvent"
          :total="totalEvent"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.EVENT)"
        />
      </div>
    </div>
    <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from "vue";
import { Photo } from "~/../../src/front/models";
import storeRequest from "~/../../src/shared/requests/front/store";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { useDeviceStore } from "~/../../src/front/store/device";

interface Prop {
  id: number;
  tabMenu?: string | number;
  typeStore: number;
  refBody: any;
}
const props = defineProps<Prop>();
const { id, tabMenu, typeStore, refBody } = toRefs(props);
const dataPhotoStaff = ref<Photo[]>([]);
const dataEvent = ref<Photo[]>([]);
const page = ref(1);
const pageCourse = ref(1);
const pageEvent = ref(1);
const pageStaff = ref(1);
const totalEvent = ref(0);
const pageSize = ref(35);
const loading = ref(false);
const imageUrl = ref("");
const dialogVisible = ref(false);
const { heightMenu } = useDeviceStore();

const showImage = (url: string) => {
  if (url) {
    imageUrl.value = url;
    dialogVisible.value = true;
  }
};

const handleCurrentChange = async (val: number, typeValue: string) => {
  pageEvent.value = val;
  const el = document.getElementById("photo-event");
  if (el && el.offsetTop) {
    window.scrollTo({
      top: el.offsetTop - heightMenu - 160,
      behavior: "smooth",
    });
  }
  await getListPhotoEvent();
};

const getListPhotoEvent = async () => {
  loading.value = true;
  const response = (
    await storeRequest.getImageStore<Photo[]>(id.value, {
      model: MODEL_TYPE.EVENT,
      page: pageEvent.value,
      limit: pageSize.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  dataEvent.value = response.data;
  totalEvent.value = response.pagination.total;
  loading.value = false;
};

onMounted(async () => {
  await getListPhotoEvent();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.show-photo {
  padding-bottom: 24px;
}

.photo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  .list-event,
  .list-event {
    width: 100%;
    background: $white-color;
    padding-bottom: 20px;
  }

  .image-photo {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 17px;

    .list-image {
      width: calc(100% / 5 - 12px);
      margin-right: 15px;
      margin-bottom: 16px;
      cursor: pointer;

      img {
        width: 100%;
        object-fit: cover;
        height: 160px;

        &:hover {
          opacity: 0.5;
        }
      }

      .title-image {
        width: 100%;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: -webkit-box;
      }

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }

  .list-photo-pagination {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }

  .store-title {
    &:first-child {
      margin-top: 0;
    }

    margin-top: 24px;
  }
}

@media screen and (min-width: 1400px) and (max-width: 1600px) {
  .photo {
    .image-photo {
      padding: 0 17px;

      .list-image {
        width: calc(100% / 4 - 6px);
        margin-right: 8px;
        margin-bottom: 16px;
        cursor: pointer;

        img {
          width: 100%;
          object-fit: cover;
          height: 160px;

          &:hover {
            opacity: 0.5;
          }
        }

        .title-image {
          text-align: center;
        }

        &:nth-child(5n) {
          margin-right: 8px;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px) {
  .photo {
    .image-photo {
      padding: 0 17px;

      .list-image {
        width: calc(100% / 2 - 8px);
        margin-right: 16px;
        margin-bottom: 16px;
        cursor: pointer;

        img {
          width: 100%;
          object-fit: cover;
          height: 160px;

          &:hover {
            opacity: 0.5;
          }
        }

        .title-image {
          text-align: center;
        }

        &:nth-child(5n) {
          margin-right: 16px;
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .photo {
    .image-photo {
      padding: 0 17px;

      .list-image {
        width: calc(100% / 2 - 8px);
        margin-right: 16px;
        margin-bottom: 16px;
        cursor: pointer;

        img {
          width: 100%;
          object-fit: cover;
          height: 160px;

          &:hover {
            opacity: 0.5;
          }
        }

        .title-image {
          text-align: center;
        }

        &:nth-child(5n) {
          margin-right: 16px;
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
