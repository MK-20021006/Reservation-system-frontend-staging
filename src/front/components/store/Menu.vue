<template>
  <div :class="showClassMenu">
    <div class="btn-back" @click="prevMenu">
      <icon-left />
    </div>
    <ClientOnly>
      <el-menu
        ref="_refMenu"
        v-click-outside="handleClickOutsideSubmenu"
        :default-active="modelValue"
        class="el-menu-demo"
        mode="horizontal"
        menu-trigger="click"
        :ellipsis="false"
        unique-opened
        @select="handleSelect"
        @open="handleOpen"
      >
        <el-menu-item
          ref="_refWidthMenu"
          :disabled="isDisabled"
          :index="menuRestaurant.TOP"
          >{{ $t("top") }}</el-menu-item
        >
        <el-menu-item
          v-if="checkTypeStore(dataCheckRestaurant, typeStore)"
          :disabled="isDisabled"
          :index="menuRestaurant.SEAT"
        >
          {{ $t("seat_menu") }}</el-menu-item
        >
        <el-menu-item
          v-if="EVENT === typeStore"
          ref="_refEvent"
          :disabled="isDisabled"
          :index="menuRestaurant.EVENT"
        >
          {{ $t("event") }}</el-menu-item
        >
        <el-sub-menu
          v-if="checkTypeStore(dataCheckRestaurant, typeStore)"
          ref="_refCourse"
          :disabled="isDisabled"
          :index="menuRestaurant.COURSE_MENU"
          :popper-append-to-body="true"
          popper-class="el-menu-popup"
        >
          <template #title>
            <span class="all-name">{{ $t("course_name") }}</span>
            <span class="all-name-tooltip">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="160px"
                :title="$t('course_name')"
              >
                <template #reference>
                  <div class="notice-content">
                    {{ $t("course_name") }}
                  </div>
                </template>
              </el-popover>
            </span>
          </template>
          <el-menu-item
            :index="menuRestaurant.COURSE_MENU_TAB_COURSE"
            @click="checkScroll"
          >
            <icon-right />
            {{ $t("course") }}
          </el-menu-item>
          <template v-for="parent in data?.menu?.list" :key="parent.parent.id">
            <el-menu-item
              v-if="checkMenu(parent.parent.id)"
              :index="`${menuRestaurant.COURSE_MENU_SUB}${parent.parent.id}`"
              @click="checkScroll"
            >
              <icon-right /> {{ parent.parent.name }}
            </el-menu-item>
          </template>
          <el-menu-item
            :index="menuRestaurant.COURSE_MENU_TAB_PHOTO"
            @click="checkScroll"
            ><icon-right /> {{ $t("photo") }}</el-menu-item
          >
        </el-sub-menu>
        <el-menu-item
          v-if="checkTypeStore(dataCheckSalon, typeStore)"
          ref="_refCourse"
          :disabled="isDisabled"
          :index="menuRestaurant.COURSE_MENU"
        >
          {{
            typeStore !== SALON ? $t("course_name") : $t("course_tab_menu")
          }}</el-menu-item
        >
        <el-menu-item
          v-if="typeStore !== RESTAURANT"
          ref="_refImage"
          :disabled="isDisabled"
          :index="menuRestaurant.PHOTO"
        >
          {{ $t("photo_gallery") }}</el-menu-item
        >
        <el-sub-menu
          v-if="checkTypeStore(dataCheckRestaurant, typeStore)"
          ref="_refImage"
          :disabled="isDisabled"
          :index="menuRestaurant.PHOTO"
          :popper-append-to-body="true"
          popper-class="el-menu-popup"
        >
          <template #title>
            <span>{{ $t("photo") }}</span></template
          >
          <el-menu-item
            :index="menuRestaurant.PHOTO_TAB_ALL"
            @click="checkScroll"
            ><icon-right /> {{ $t("all") }}（{{ data?.total }}）</el-menu-item
          >
          <el-menu-item
            :index="menuRestaurant.PHOTO_TAB_COURSE"
            @click="checkScroll"
            ><icon-right /> {{ $t("course") }}（{{
              data?.course
            }}）</el-menu-item
          >
          <el-menu-item
            :index="menuRestaurant.PHOTO_TAB_SEAT"
            @click="checkScroll"
            ><icon-right /> {{ $t("seat_menu") }}（{{
              data?.seat
            }}）</el-menu-item
          >
          <template v-for="parent in data?.menu?.list" :key="parent.parent.id">
            <el-menu-item
              v-if="parent.total"
              :index="`${menuRestaurant.PHOTO_TAB_SUB}${parent.parent.id}`"
              @click="checkScroll"
              ><icon-right /> {{ parent.parent.name }}（{{
                parent.total
              }}）</el-menu-item
            >
          </template>
        </el-sub-menu>
        <el-menu-item
          v-if="dataCheckSalon.includes(typeStore)"
          ref="_refStaff"
          :disabled="isDisabled"
          :index="menuRestaurant.STAFF"
        >
          {{ $t("staff") }}
        </el-menu-item>
        <el-menu-item
          ref="_refReview"
          :disabled="isDisabled"
          :index="menuRestaurant.RATE"
          >{{ $t("rate") }}</el-menu-item
        >
        <el-menu-item
          :disabled="isDisabled"
          :index="menuRestaurant.INFORMATION"
        >
          {{ $t("information") }}
        </el-menu-item>
        <el-menu-item
          v-if="jobOffer === HAVE_JOB_OFFER"
          :disabled="isDisabled"
          :index="menuRestaurant.RECRUITMENT"
        >
          {{ $t("front.recruitment.recruitment_information") }}
        </el-menu-item>
      </el-menu>
    </ClientOnly>
    <div class="btn-next" @click="nextMenu">
      <icon-add-menu />
    </div>
  </div>
</template>

<script lang="ts" setup>
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { onBeforeMount, ref, toRefs, computed } from "vue";
import storeRequest from "~/../../src/shared/requests/front/store";
import { MenuCategory } from "~/../../src/front/models";
import { useDeviceStore } from "~/../../src/front/store/device";
import {
  RESTAURANT,
  SALON,
  MEDIAL_CARE,
  EVENT,
  CONSULTATION,
  CLASSROOM,
} from "~/../../src/shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";
import { HAVE_JOB_OFFER } from "~/../../src/shared/constants";

interface ListImage {
  parent: any;
  total: number;
}

interface Menu {
  all: number;
  list: ListImage[];
}

interface dataImage {
  total: number;
  store: number;
  course: number;
  menu: Menu;
  seat: number;
  other: number;
}

interface Prop {
  modelValue: string;
  typeStore: number | null | undefined;
  id: number;
  dataMenuCategory: MenuCategory[] | undefined;
  refBody: any;
  isDisabled: boolean;
  jobOffer: number;
}

const _refCourse = ref();
const _refEvent = ref();
const _refMenu = ref(null);
const deviceTable = useDeviceStore();
const props = defineProps<Prop>();
const emits = defineEmits(["update:modelValue", "handleChangeTab"]);
const { modelValue, typeStore, id, dataMenuCategory, refBody, jobOffer } =
  toRefs(props);
const data = ref<dataImage>();
const open = ref<null | string>("");
const dataCheckSalon = ref([SALON, CLASSROOM, CONSULTATION, MEDIAL_CARE]);
const dataCheckRestaurant = ref([RESTAURANT]);
const _refWidthMenu = ref();
const _refReview = ref();
const _refImage = ref();
const _refStaff = ref();

const handleSelect = async (e: any, tab: any) => {
  if (modelValue.value !== e) {
    await window.scrollTo({
      top: refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
    await setTimeout(() => {
      window.scrollTo({
        top: refBody.value.offsetTop - deviceTable.heightMenu - 110,
        behavior: "smooth",
      });
    }, 200);
  }
  emits("handleChangeTab", tab, e);
  open.value = null;
};

const checkScroll = async () => {
  await window.scrollTo({
    top: refBody.value.offsetTop - deviceTable.heightMenu - 110,
  });
};

const getCountImage = async () => {
  data.value = (await storeRequest.getCountImageStore(id.value))
    .data as dataImage;
};

const handleOpen = (e: any) => {
  open.value = e;
};

const handleClickOutsideSubmenu = () => {
  if (_refMenu.value && open.value) {
    _refMenu.value.close(open.value);
    open.value = null;
  }
};

const checkMenu = (parentId: number) => {
  const arr: any = [];
  if (dataMenuCategory.value && dataMenuCategory.value.length > 0) {
    dataMenuCategory.value.filter((item) => {
      const index = arr.findIndex(
        (parent: any) => parent.parent_id === item.parent_id
      );
      if (index === -1 && item.menus.length > 0) {
        arr.push({
          parent_id: item.parent_id,
          menus: item.menus,
        });
      } else if (index !== -1 && item.menus.length > 0) {
        arr[index].menus = [...arr[index].menus, ...item.menus];
      }
    });
    const indexParent = arr.findIndex(
      (item: any) => item.parent_id === parentId
    );
    if (indexParent === -1) {
      return false;
    }
  }
  return arr.length !== 0;
};

const showClassMenu = computed(() => {
  if (
    typeStore.value &&
    [SALON, MEDIAL_CARE, CLASSROOM, CONSULTATION, RESTAURANT].includes(
      typeStore.value
    )
  ) {
    if (jobOffer.value === HAVE_JOB_OFFER) {
      return "menu-tab-detail";
    }
    return "menu-tab-detail menu-detail-by-plan";
  } else if (jobOffer.value === HAVE_JOB_OFFER) {
    return "menu-tab-detail-event";
  }
  return "menu-tab-detail-event menu-detail-by-plan-event";
});

const nextMenu = () => {
  const scrollPos = _refWidthMenu.value?.$el?.clientWidth;
  const widthMenu = _refMenu.value?.$el?.scrollWidth;
  const left = _refMenu.value?.$el.scrollLeft;
  if (scrollPos + left < widthMenu && _refMenu.value) {
    _refMenu.value.$el.scrollLeft += scrollPos;
  }
};

const prevMenu = () => {
  const scrollPos = _refWidthMenu.value?.$el?.clientWidth;
  const left = _refMenu.value?.$el.scrollLeft;
  if (left && _refMenu.value) {
    _refMenu.value.$el.scrollLeft -= scrollPos;
  }
};

const scrollCourse = async () => {
  const leftScroll = _refCourse.value?.$el.offsetLeft;
  if (leftScroll && _refMenu.value) {
    _refMenu.value.$el.scrollLeft = leftScroll;
  }
};

const scrollEvent = async () => {
  const leftScroll = _refEvent.value?.$el.offsetLeft;
  if (leftScroll && _refMenu.value) {
    _refMenu.value.$el.scrollLeft = leftScroll;
  }
};

const scrollReview = async () => {
  const leftScroll = _refReview.value?.$el.offsetLeft;
  if (leftScroll && _refMenu.value) {
    _refMenu.value.$el.scrollLeft = leftScroll;
  }
};

const scrollImage = async () => {
  const leftScroll = _refImage.value?.$el.offsetLeft;
  if (leftScroll && _refMenu.value) {
    _refMenu.value.$el.scrollLeft = leftScroll;
  }
};

const scrollStaff = async () => {
  const leftScroll = _refStaff.value?.$el.offsetLeft;
  if (leftScroll && _refMenu.value) {
    _refMenu.value.$el.scrollLeft = leftScroll;
  }
};

defineExpose({
  scrollCourse,
  scrollEvent,
  scrollReview,
  scrollImage,
  scrollStaff,
});

onBeforeMount(async () => {
  if (typeStore.value === RESTAURANT) {
    await getCountImage();
  }
  if (
    modelValue.value === menuRestaurant.COURSE_MENU ||
    modelValue.value === menuRestaurant.COURSE_MENU_TAB_COURSE
  ) {
    const leftScroll = _refCourse.value?.$el.offsetLeft;
    if (leftScroll && _refMenu.value) {
      _refMenu.value.$el.scrollLeft = leftScroll;
    }
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@mixin menu-active {
  .is-active {
    background: $yellow-color;
    border: unset;
    color: $white-color;

    :deep(.el-sub-menu__title) {
      background: $yellow-color;
      color: $white-color;
    }
  }

  .is-opened {
    :deep(.el-sub-menu__title) {
      background: $white-color;
      color: $black-80;
    }
  }
}

@mixin menu-item {
  background: $grey-50;
  color: $black-color;
  border: unset;
  font-weight: 700;
  padding: 0 18px;
  text-align: center;
}

:deep(.el-menu) {
  --el-menu-text-color: #ffffff;
  --el-menu-hover-text-color: #000000cc;
  --el-menu-bg-color: #ffffff;
  --el-menu-hover-bg-color: #b4985c;
  --el-menu-active-color: #ffffff;
  --el-menu-item-height: 48px;
  --el-menu-level: 0;
  width: 100%;
  border-bottom: 2px solid #b4985c;
  padding: 0;
}

@mixin button-back-next {
  .btn-back,
  .btn-next {
    display: none;
    width: 40px;
    height: 52px;
    background: #f3f3f3;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #b4985c;
  }
}

:deep(.el-menu-item.is-disabled) {
  opacity: 1;
  background-color: #e6e6e6 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #b4985c !important;
}

.menu-tab-detail {
  :deep(.el-menu) {
    &.el-menu-demo {
      .el-sub-menu {
        background-color: #e6e6e6;
        .el-sub-menu__title {
          opacity: 1;
        }
      }
    }
  }
}

.menu-tab-detail {
  display: flex;
  @include button-back-next;

  // RESTAURANT SALON
  /* Hide scrollbar for Chrome, Safari and Opera */
  .el-menu-demo::-webkit-scrollbar {
    display: none;
  }

  .el-menu-demo {
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 2px;

    .el-menu-item {
      @include menu-item;
      width: calc(100% / 7);
    }

    .el-sub-menu {
      width: calc(100% / 7);
      color: $black-color;

      :deep(.el-sub-menu__title) {
        border: unset;
        color: $black-color;
        background: $grey-50;
        display: flex;
        justify-content: space-between;
        padding: 0 18px;

        span {
          font-weight: 700;
        }

        .all-name-tooltip {
          display: none;
        }
      }
    }

    @include menu-active;
  }
}

.menu-tab-detail-event {
  display: flex;
  @include button-back-next;

  .el-menu-demo::-webkit-scrollbar {
    display: none;
  }

  .el-menu-demo {
    overflow-x: scroll;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 2px;

    .el-menu-item {
      @include menu-item;
      width: calc(100% / 6);
    }

    @include menu-active;
  }
}

.menu-detail-by-plan {
  .el-menu-demo {
    .el-menu-item {
      width: calc(100% / 6);
    }

    .el-sub-menu {
      width: calc(100% / 6);
    }
  }
}

.menu-detail-by-plan-event {
  .el-menu-demo {
    .el-menu-item {
      width: calc(100% / 5);
    }
  }
}

@media screen and (max-width: 1400px) and (min-width: 1200px) {
  .menu-tab-detail {
    // RESTAURANT SALON
    .el-menu-demo {
      .el-sub-menu {
        :deep(.el-sub-menu__title) {
          span {
            width: 80%;
            font-weight: 700;
          }

          .all-name {
            display: none;
          }

          .all-name-tooltip {
            display: unset;

            .notice-content {
              width: 100%;
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      @include menu-active;
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .menu-tab-detail {
    .btn-back,
    .btn-next {
      display: flex;
    }

    .el-menu-demo {
      width: calc(100% - 80px);

      .el-menu-item {
        width: 184px;
        min-width: 184px;
      }

      .el-sub-menu {
        width: 184px;
        min-width: 184px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .menu-tab-detail-event {
    .btn-back,
    .btn-next {
      display: flex;
    }

    .el-menu-demo {
      width: calc(100% - 80px);

      .el-menu-item {
        width: 184px;
        min-width: 184px;
      }

      .el-sub-menu {
        width: 184px;
        min-width: 184px;
      }
    }
  }
}
</style>
