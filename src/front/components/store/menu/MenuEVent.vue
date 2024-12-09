<template>
  <div>
    <ClientOnly>
      <el-menu
        ref="_refMenu"
        v-click-outside="handleClickOutsideSubmenu"
        :default-active="modelValue"
        class="menu-event"
        mode="horizontal"
        menu-trigger="click"
        :ellipsis="false"
        unique-opened
        @select="handleSelect"
        @open="handleOpen"
      >
        <el-menu-item :index="menuRestaurant.TOP">{{ $t("top") }}</el-menu-item>
        <el-menu-item
          v-if="checkTypeStore(dataCheckSalon, typeStore)"
          :index="menuRestaurant.PHOTO"
        >
          {{ $t("photo_gallery") }}</el-menu-item
        >
        <el-menu-item :index="menuRestaurant.EVENT">
          {{ $t("event") }}
        </el-menu-item>
        <el-menu-item :index="menuRestaurant.RATE">{{
          $t("rate")
        }}</el-menu-item>
        <el-menu-item :index="menuRestaurant.INFORMATION">
          {{ $t("information") }}
        </el-menu-item>
      </el-menu>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { onBeforeMount, ref, toRefs } from "vue";
import storeRequest from "~/../../src/shared/requests/front/store";
import { MenuCategory } from "~/../../src/front/models";
import categoryID from "~/../../src/shared/constants/category";
import { useDeviceStore } from "~/../../src/front/store/device";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";

interface Menu {
  all: number;
  cooking: number;
  drink: number;
  lunch: number;
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
}

const _refMenu = ref(null);
const deviceTable = useDeviceStore();
const props = defineProps<Prop>();
const emits = defineEmits(["update:modelValue", "handleChangeTab"]);
const { modelValue, typeStore, id, dataMenuCategory, refBody } = toRefs(props);
const data = ref<dataImage>(null);
const open = ref("");
const dataCheckSalon = ref([SALON]);
const dataCheckRestaurant = ref([RESTAURANT]);

const handleSelect = async (e, tab) => {
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

const getCountImage = async () => {
  data.value = (await storeRequest.getCountImageStore(id.value))
    .data as dataImage;
};

const handleOpen = (e) => {
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
    const indexParent = arr.findIndex((item) => item.parent_id === parentId);
    if (indexParent === -1) {
      return false;
    }
  }
  return arr.length !== 0;
};

const showClassMenu = () => {
  if (typeStore.value === SALON) {
    return "el-menu-salon";
  }
  return "el-menu-demo";
};

onBeforeMount(() => {
  if (typeStore.value === RESTAURANT) {
    getCountImage();
  }
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
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
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.el-menu-demo {
  overflow: visible;

  .el-menu-item {
    @include menu-item;
    margin-right: 3px;
    width: calc(100% / 6 - 3px);

    &:last-child {
      margin-right: 0;
    }
  }

  .el-sub-menu {
    width: calc(100% / 6 - 2px);
    margin-right: 3px;
    color: $black-color;

    :deep(.el-sub-menu__title) {
      border: unset;
      color: $black-color;
      background: $grey-50;
      display: flex;
      justify-content: space-between;
      padding: 0 18px;

      span {
        width: 80%;
        font-weight: 700;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .el-menu-popup {
      border-bottom: 0;

      .el-menu {
        .el-menu-item {
          border-bottom: 1px solid $grey-50;
          height: 48px;
          width: 100%;
          display: flex;
          background: $white-color;
          color: $menuText;
          font-weight: 400;
          padding: 0 10px;

          &:last-child {
            border-bottom: 0;
          }

          svg {
            margin-right: 3%;
          }
        }

        .el-menu-item:hover {
          background: #b4985c;
          color: $white-color;
        }

        .is-active {
          background: $yellow-color;
          border: unset;
          color: $white-color !important;
        }
      }

      ul {
        color: red;
      }
    }
  }

  @include menu-active;
}

// SALON
.el-menu-salon {
  overflow: visible;
  flex-wrap: wrap;

  .el-menu-item {
    @include menu-item;

    margin-right: 3px;
    width: calc(100% / 6 - 3px);

    &:last-child {
      margin-right: 0;
    }
  }

  @include menu-active;
}

@include res("sm-and-down", $breakpoints-spec) {
  .el-menu-demo {
    .el-menu-item {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      width: calc(100% / 6);
      margin-right: 0;
      padding: 0 4px;
    }

    .el-sub-menu {
      width: calc(100% / 6);
      text-align: center;
      padding: 0;
      margin-right: 0;

      :deep(.el-sub-menu__title) {
        padding: 0 4px;

        span {
          width: 90%;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .el-menu-salon {
    overflow: visible;

    .el-menu-item {
      @include menu-item;

      padding: 0 2px;
      margin-right: 0;
      width: calc(100% / 6);
    }

    @include menu-active;
  }
}
</style>
