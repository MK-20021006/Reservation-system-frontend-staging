<template>
  <div
    v-loading="loading"
    class="photo"
    :class="{
      'show-photo':
        totalStaff > 0 ||
        totalMenu > 0 ||
        totalCourse > 0 ||
        totalStaffImage > 0,
    }"
  >
    <div v-if="dataPhotoStaff.length > 0" class="list-staff">
      <store-title :title="$t('staff') + `(${totalStaff})`" />
      <div id="photo-staff" class="image-photo">
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
      <div v-if="totalStaff > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="page"
          :total="totalStaff"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.STAFF)"
        />
      </div>
    </div>
    <div v-if="dataPhotoStaffImage.length > 0" class="list-staff">
      <store-title :title="$t('staff_image') + `(${totalStaffImage})`" />
      <div id="photo-staff-image" class="image-photo">
        <div
          v-for="item in dataPhotoStaffImage"
          :key="item"
          class="list-image"
          @click="showImage(item.file.url)"
        >
          <img :src="item.file.url" />
          <div class="title-image">
            {{ item.name }} <span v-if="item.content">|</span>
            {{ item.content }}
          </div>
        </div>
      </div>
      <div v-if="totalStaffImage > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="pageStaffImage"
          :total="totalStaffImage"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.STAFF_IMAGE)"
        />
      </div>
    </div>
    <div v-if="dataPhotoCourse.length > 0" class="list-course">
      <store-title
        :title="
          (typeStore !== SALON ? $t('course') : $t('coupon')) +
          `(${totalCourse})`
        "
      />
      <div id="photo-course" class="image-photo">
        <div
          v-for="item in dataPhotoCourse"
          :key="item"
          class="list-image"
          @click="showImage(item.file.url)"
        >
          <img :src="item.file.url" />
          <div class="title-image">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="totalCourse > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="pageCourse"
          :total="totalCourse"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.COURSE)"
        />
      </div>
    </div>
    <div v-if="dataPhotoMenu.length > 0" class="list-menu">
      <store-title :title="$t('menu') + `(${totalMenu})`" />
      <div id="photo-menu" class="image-photo">
        <div
          v-for="item in dataPhotoMenu"
          :key="item"
          class="list-image"
          @click="showImage(item.file.url)"
        >
          <img :src="item.file.url" />
          <div class="title-image">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="totalMenu > pageSize" class="list-photo-pagination">
        <InputPagination
          v-model="pageMenu"
          :total="totalMenu"
          :page-size="pageSize"
          @current-change="handleCurrentChange($event, MODEL_TYPE.MENU)"
        />
      </div>
    </div>
    <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRefs } from "vue";
import { Photo } from "~/../../src/front/models";
import storeRequest from "~/../../src/shared/requests/front/store";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { useDeviceStore } from "~/../../src/front/store/device";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  id: number;
  tabMenu?: string | number;
  typeStore: number;
  refBody: any;
}
const props = defineProps<Prop>();
const { id, tabMenu, typeStore, refBody } = toRefs(props);
const dataPhotoCourse = ref<Photo[]>([]);
const dataPhotoMenu = ref<Photo[]>([]);
const dataPhotoStaff = ref<Photo[]>([]);
const dataPhotoStaffImage = ref<Photo[]>([]);
const page = ref(1);
const pageCourse = ref(1);
const pageMenu = ref(1);
const pageStaff = ref(1);
const pageStaffImage = ref(1);
const totalCourse = ref(0);
const totalMenu = ref(0);
const totalStaff = ref(0);
const totalStaffImage = ref(0);
const pageSize = ref(15);
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
  if (typeValue === MODEL_TYPE.COURSE) {
    pageCourse.value = val;
    const el = document.getElementById("photo-course");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - heightMenu - 160,
        behavior: "smooth",
      });
    }
    await getListPhotoCourse();
  } else if (typeValue === MODEL_TYPE.MENU) {
    pageMenu.value = val;
    const el = document.getElementById("photo-menu");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - heightMenu - 160,
        behavior: "smooth",
      });
    }
    await getListPhotoMenu();
  } else if (typeValue === MODEL_TYPE.STAFF) {
    pageStaff.value = val;
    const el = document.getElementById("photo-staff");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - heightMenu - 160,
        behavior: "smooth",
      });
    }
    await getListPhotoStaff();
  } else {
    pageStaffImage.value = val;
    const el = document.getElementById("photo-staff-image");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - heightMenu - 160,
        behavior: "smooth",
      });
    }
    await getListPhotoStaffImage();
  }
};
const getListPhotoCourse = async () => {
  loading.value = true;
  const response = (
    await storeRequest.getImageStore<Photo[]>(id.value, {
      model: MODEL_TYPE.COURSE,
      page: pageCourse.value,
      limit: pageSize.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  dataPhotoCourse.value = response.data;
  totalCourse.value = response.pagination.total;
  loading.value = false;
};

const getListPhotoMenu = async () => {
  loading.value = true;
  const response = (
    await storeRequest.getImageStore<Photo[]>(id.value, {
      model: MODEL_TYPE.MENU,
      page: pageMenu.value,
      limit: pageSize.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  dataPhotoMenu.value = response.data;
  totalMenu.value = response.pagination.total;
  loading.value = false;
};
const getListPhotoStaff = async () => {
  loading.value = true;
  const response = (
    await storeRequest.getImageStore<Photo[]>(id.value, {
      model: MODEL_TYPE.STAFF,
      page: pageStaff.value,
      limit: pageSize.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  dataPhotoStaff.value = response.data;
  totalStaff.value = response.pagination.total;
  loading.value = false;
};

const getListPhotoStaffImage = async () => {
  loading.value = true;
  const response = (
    await storeRequest.getImageStore<Photo[]>(id.value, {
      model: MODEL_TYPE.STAFF_IMAGE,
      page: pageStaffImage.value,
      limit: pageSize.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  dataPhotoStaffImage.value = response.data;
  totalStaffImage.value = response.pagination.total;
  loading.value = false;
};

onMounted(async () => {
  await getListPhotoCourse();
  await getListPhotoStaff();
  await getListPhotoMenu();
  await getListPhotoStaffImage();
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

  .list-menu,
  .list-course,
  .list-staff {
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
