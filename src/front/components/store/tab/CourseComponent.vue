<template>
  <div v-loading="loading">
    <div id="course" class="menu-course">
      <div v-if="total > 0 && !idCourse" class="top-course__title">
        <StoreTitle
          :title="typeStore !== SALON ? $t('course') : $t('coupon')"
        />
      </div>
      <StoreCourse
        :data="course"
        :detail-course="dataDetailCourse"
        :id-course="idCourse"
        :type-store="typeStore"
        @handle-detail="detailCourse"
        @handle-click="handleClick"
        @handle-click-menu-course="handleClickMenuCourse"
        @handle-click-coupon-course="handleClickCouponCourse"
      />
      <div v-if="total > course.length && !idCourse" class="top-course-many">
        <ButtonCommon
          :name="
            typeStore !== SALON
              ? $t('show_more_course')
              : $t('show_more_coupon')
          "
          background-color="#ffffff"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="160px"
          :disabled="loading"
          @click="showMoreCourse"
        />
      </div>
    </div>
    <div
      v-for="(item, index) in dataMenu"
      :id="`menu-${item.parent_id}`"
      :key="index"
      class="menu"
    >
      <StoreTitle v-if="item.menus.length > 0" :title="item.name" />
      <div v-if="typeStore === RESTAURANT">
        <div v-for="category in item.data" :key="category.id">
          <StoreTitle
            v-if="category.menus.length > 0"
            class="title-category"
            :title="category.name_category"
          />
          <StoreMenuType
            :type-store="typeStore"
            :data="category.menus"
            @handle-click-menu="handleClickMenu"
          />
        </div>
      </div>
      <StoreMenuType
        v-else
        :type-store="typeStore"
        :data="item.menus"
        @handle-click-menu="handleClickMenu"
      />
    </div>
    <div id="photo" class="photo">
      <StoreTitle
        v-if="photo.length > 0"
        :title="typeStore === RESTAURANT ? $t('photo') : $t('photo_gallery')"
      />
      <StoreImage :data="photo" />
      <div v-if="totalPhoto > photo.length" class="top-course-many">
        <ButtonCommon
          :name="$t('show_more_photo')"
          background-color="#ffffff"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="143px"
          @click="showMorePhoto"
        />
        <div class="next" @click="showMorePhoto"><IconNext /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs, watch, computed, onUnmounted } from "vue";
import courseRequest from "~/../../src/shared/requests/front/course";
import { Course, MenuCategory, Photo } from "~/../../src/front/models";
import storeGuestRequest from "~/../../src/shared/requests/front/store";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { STATUS_TYPE } from "~/../../src/shared/constants/reservation";
import { useDeviceStore } from "~/../../src/front/store/device";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import { TYPE_PARAMS } from "~/../../src/shared/constants/booking";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  id: number;
  menu: MenuCategory[];
  idCourse: number | null;
  tab: string;
  typeStore: number;
}

const props = defineProps<Prop>();
const { id, menu, idCourse, tab, typeStore } = toRefs(props);
const deviceTable = useDeviceStore();

const photo = ref<Photo[]>([]);
const totalPhoto = ref(0);
const pagePhoto = ref(1);
const course = ref([]);
const total = ref(0);
const page = ref(1);
const loading = ref(false);
const dataDetailCourse = ref<Course>();

const emits = defineEmits([
  "handleClick",
  "showDetail",
  "showMoreCourse",
  "showDataImage",
  "handleClickMenu",
  "handleClickMenuCourse",
  "handleClickCouponCourse",
]);
const showMoreCourse = async () => {
  page.value = page.value + 1;
  await getListCourse();
};

const showMorePhoto = async () => {
  emits("showDataImage");
};

const handleClick = (id: number) => {
  emits("handleClick", id);
};

const detailCourse = (id: number) => {
  emits("showDetail", id);
};

const handleClickMenu = (idMenu: number) => {
  emits("handleClickMenu", idMenu);
};

const handleClickMenuCourse = (idCourse: number) => {
  emits("handleClickMenuCourse", idCourse);
};

const handleClickCouponCourse = (id: number, course_id: number) => {
  emits("handleClickCouponCourse", id, course_id);
};

const dataMenu = computed(() => {
  const arr: any[] = [];
  if (menu.value?.length > 0 && typeStore.value === RESTAURANT) {
    menu.value.forEach((item) => {
      const index = arr.findIndex(
        (parent) => parent.parent_id === item.parent_id
      );
      if (index === -1 && item.menus.length > 0) {
        arr.push({
          parent_id: item.parent_id,
          name: item.parent.name,
          data: [
            {
              name_category: item.name,
              id_category: item.id,
              menus: item.menus,
            },
          ],
          menus: item.menus,
        });
      } else if (index !== -1 && item.menus.length > 0) {
        arr[index].menus = [...arr[index].menus, ...item.menus];
        arr[index].data.push({
          name_category: item.name,
          id_category: item.id,
          menus: item.menus,
        });
      }
    });
    arr.sort((item, itemNext) => {
      return item.parent_id - itemNext.parent_id;
    });
  } else if (menu.value?.length > 0) {
    menu.value.forEach((item) => {
      const index = arr.findIndex((parent) => parent.category_id === item.id);
      if (index === -1 && item.menus.length > 0) {
        arr.push({
          parent_id: item.parent_id,
          category_id: item.id,
          name: item.name,
          menus: item.menus,
        });
      } else if (index !== -1 && item.menus.length > 0) {
        arr[index].menus = [...arr[index].menus, ...item.menus];
      }
    });
  }
  return arr;
});

const getListCourse = async (key?: boolean) => {
  loading.value = true;
  const response = (
    await courseRequest.list<Course[]>(
      {
        store_id: id.value,
        limit: 4,
        page: page.value,
        status: STATUS_TYPE.PUBLIC,
        type: TYPE_PARAMS.BOOKING,
      },
      key
    )
  ).data;
  course.value = [...course.value, ...response.data];
  total.value = response.total;
  loading.value = false;
};

const getListPhoto = async () => {
  loading.value = true;
  const response = (
    await storeGuestRequest.getImageStore<Photo[]>(id.value, {
      model: "all",
      limit: 12,
      page: page.value,
      order_by: "created_at",
      direct: "DESC",
    })
  ).data;
  photo.value = [...photo.value, ...response.data];
  totalPhoto.value = response.pagination.total;
  loading.value = false;
};

const showDetailCourse = async (key?: boolean) => {
  loading.value = true;
  dataDetailCourse.value = (await courseRequest.show(+idCourse.value, key))
    .data as Course;
  loading.value = false;
};

watch(
  [idCourse, tab],
  async ([value, valueTab]) => {
    if (value) {
      photo.value = [];
      course.value = [];
      totalPhoto.value = 0;
      total.value = 0;
      await showDetailCourse(false);
    } else {
      await getListCourse(true);
      await getListPhoto();
    }
    setTimeout(() => {
      scrollTab();
    }, 700);
  },
  { deep: true }
);

const scrollTab = () => {
  if (tab.value === menuRestaurant.COURSE_MENU_TAB_PHOTO) {
    const el = document.getElementById("photo");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - deviceTable.heightMenu - 110,
        behavior: "smooth",
      });
    }
  } else if (
    tab.value === menuRestaurant.COURSE_MENU_TAB_COURSE ||
    tab.value === menuRestaurant.COURSE_MENU
  ) {
    const el = document.getElementById("course");
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - deviceTable.heightMenu - 110,
        behavior: "smooth",
      });
    }
  } else {
    const idParam = tab.value.replace(menuRestaurant.COURSE_MENU_SUB, "");
    const el = document.getElementById(`menu-${idParam}`);
    if (el && el.offsetTop) {
      window.scrollTo({
        top: el.offsetTop - deviceTable.heightMenu - 110,
        behavior: "smooth",
      });
    }
  }
};

defineExpose({
  scrollTab,
});

onMounted(async () => {
  if (idCourse.value) {
    await showDetailCourse(false);
  } else {
    await getListCourse(true);
    await getListPhoto();
  }
  setTimeout(() => {
    scrollTab();
  }, 800);
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.menu-course {
  .course {
    &:first-child {
      margin-top: 0;
    }
  }

  .top-course__title {
    margin-bottom: 24px;
  }

  .top-course-many {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}

.menu {
  margin-top: 24px;

  :deep(.title-category) {
    background: rgb(232 209 160 / 20%);

    &:first-child {
      margin-top: 10px;
    }
  }
}

.photo {
  margin-top: 24px;

  .top-course-many {
    width: 100%;
    display: flex;
    justify-content: center;

    .next {
      display: none;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .menu {
    margin-top: 10px;
  }

  .photo {
    margin-bottom: 8px;

    .top-course-many {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 16px;
      margin: 8px 0;

      .next {
        display: flex;
        width: 30%;
        justify-content: flex-end;

        svg {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
