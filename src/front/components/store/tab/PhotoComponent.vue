<template>
  <div v-loading="loading" class="photo" :class="{ 'show-photo': total > 0 }">
    <store-title :title="$t(title)" />
    <div id="photo-screen" class="image-photo">
      <div
        v-for="item in data"
        :key="item"
        class="list-image"
        @click="showImage(item.file.url)"
      >
        <img :src="item.file.url" />
        <div class="title-image">{{ item.name }}</div>
      </div>
    </div>
    <div v-if="total > 0 && total > pageSize" class="list-photo-pagination">
      <InputPagination
        v-model="page"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from "vue";
import { Photo, MenuCategory } from "~/../../src/front/models";
import storeRequest from "~/../../src/shared/requests/front/store";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { useDeviceStore } from "~/../../src/front/store/device";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";

interface Prop {
  id: number;
  tabMenu?: string | number;
  typeStore: number;
  refBody: any;
  menu: MenuCategory[];
}
const props = defineProps<Prop>();
const { id, tabMenu, typeStore, refBody, menu } = toRefs(props);
const data = ref<Photo[]>([]);
const page = ref(1);
const total = ref(0);
const pageSize = ref(35);
const loading = ref(false);
const model = ref("all");
const title = ref("");
const imageUrl = ref("");
const dialogVisible = ref(false);
const { heightMenu } = useDeviceStore();

const showImage = (url: string) => {
  if (url) {
    imageUrl.value = url;
    dialogVisible.value = true;
  }
};
const handleCurrentChange = async (val: number) => {
  page.value = val;
  await getListPhoto();
  window.scrollTo({
    top: refBody.value.offsetTop - heightMenu - 110,
    behavior: "smooth",
  });
};

const getModel = (value: string) => {
  if (typeStore.value === RESTAURANT) {
    if (value === menuRestaurant.PHOTO_TAB_SEAT) {
      model.value = MODEL_TYPE.SEAT;
      title.value = "seat_menu";
    } else if (value === menuRestaurant.PHOTO_TAB_COURSE) {
      title.value = "course";
      model.value = MODEL_TYPE.COURSE;
    } else if (value === menuRestaurant.PHOTO_TAB_ALL) {
      model.value = MODEL_TYPE.ALL;
      title.value = "all";
    } else {
      model.value = value.replace(menuRestaurant.PHOTO_TAB_SUB, "");
      const parent = menu.value.find((item) => {
        return item.parent_id === Number(model.value);
      });
      if (parent) {
        title.value = String(parent.parent?.name);
      } else {
        title.value = "";
      }
    }
  } else if (typeStore.value === SALON) {
    model.value = MODEL_TYPE.ALL;
    title.value = "all_photo";
  }
};

const getListPhoto = async (key?: boolean) => {
  try {
    getModel(tabMenu.value);
    loading.value = true;
    data.value = [];
    total.value = 0;
    const response = (
      await storeRequest.getImageStore<Photo[]>(
        id.value,
        {
          model: model.value,
          page: page.value,
          limit: pageSize.value,
          order_by: "created_at",
          direct: "DESC",
        },
        key
      )
    ).data;
    data.value = response.data;
    total.value = response.pagination.total;
  } catch (error: any) {
  } finally {
    loading.value = false;
  }
};

watch(
  () => tabMenu,
  async (value) => {
    page.value = 1;
    await getListPhoto();
  },
  { deep: true }
);

onMounted(async () => {
  await getListPhoto(true);
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
  background: $white-color;

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
