<template>
  <div ref="_refNavbar" class="navbar-mobile">
    <div class="header-menu" :class="{ 'is-disable-click': isDisabled }">
      <div class="logo" @click="home">
        <ArxiaLogoMobile class="cursor-pointer" />
      </div>
      <div class="toggle-icon cursor-pointer" @click="handleToggle">
        <component :is="component" />
      </div>
    </div>
    <div class="sidebar-menu" :class="{ 'is-disable-click': isDisabled }">
      <el-scrollbar view-style="height:100%">
        <el-collapse
          v-model="activeNames"
          :accordion="true"
          @change="handleChange"
        >
          <el-collapse-item
            v-for="(item, index) in arrayType"
            :key="index"
            :name="item.id"
            :class="{
              'is-active': item.id === currentTab,
            }"
          >
            <template #title>
              <IconBeauSalon v-if="isSalon(item.id)" />
              <IconMenu v-if="isRestaurant(item.id)" />
              <IconMedicalCare v-if="isMedialCare(item.id)" />
              <IconClassRoom v-if="isClassRoom(item.id)" />
              <IconConsultation v-if="isConsultation(item.id)" />
              <IconEvent v-if="isEvent(item.id)" />
              <div>{{ item.name }}</div>
            </template>
            <div class="area-search">
              <SearchHeaderHome
                v-if="isSalon(item.id)"
                :type="SALON"
                @handle-click="changeRoute"
              />
              <SearchHeaderHome
                v-if="isRestaurant(item.id)"
                :type="RESTAURANT"
                @handle-click="changeRoute"
              />
              <SearchHeaderHome
                v-if="isMedialCare(item.id)"
                :type="MEDIAL_CARE"
                @handle-click="changeRoute"
              />
              <SearchHeaderHome
                v-if="isClassRoom(item.id)"
                :type="CLASSROOM"
                @handle-click="changeRoute"
              />
              <SearchHeaderHome
                v-if="isConsultation(item.id)"
                :type="CONSULTATION"
                @handle-click="changeRoute"
              />
              <SearchHeaderHome
                v-if="isEvent(item.id)"
                :type="EVENT"
                @handle-click="changeRoute"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-menu
          ref="_refMenu"
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="menubar-mobile"
          text-color="#fff"
          :unique-opened="true"
          :default-active="activeMenu"
        >
          <el-menu-item v-if="meStore.info" index="7" @click="profile">
            <template #title>
              <div class="menu-item">
                <div class="icon">
                  <el-avatar
                    :size="24"
                    shape="square"
                    class="avatar-customer"
                    :src="avatarUrl"
                    @error="() => true"
                  >
                    <img src="/assets/images/no-avatar.png" alt="" />
                  </el-avatar>
                </div>
                <div>{{ meStore.info?.fullname }}</div>
              </div>
            </template>
          </el-menu-item>
          <el-menu-item v-else index="7" @click="login">
            <template #title>
              <div class="menu-item">
                <div class="icon user-login">
                  <IconUserSmall />
                </div>
                <div>{{ $t("front.my_page") }}</div>
              </div>
            </template>
          </el-menu-item>
          <el-menu-item
            v-if="meStore.info && !meStore.info?.is_login_social"
            index="10"
            @click="toChangePassword"
          >
            <template #title>
              <div class="menu-item">
                <div class="icon icon-lock">
                  <IconLockWhite />
                </div>
                <div>{{ $t("title_screen.change_password") }}</div>
              </div>
            </template>
          </el-menu-item>
          <el-menu-item v-if="meStore.info" index="8" @click="notice">
            <template #title>
              <div class="menu-item">
                <div class="icon">
                  <el-badge
                    :value="countNotice"
                    :hidden="!countNotice"
                    :max="99"
                    class="qty-notice"
                  >
                    <IconNotification
                      ref="_refNotification"
                      class="ring cursor-pointer"
                    />
                  </el-badge>
                </div>
                <div>{{ $t("news") }}</div>
              </div>
            </template>
          </el-menu-item>
          <el-menu-item v-if="meStore.info && !isLoginLine" index="9">
            <template #title>
              <div class="menu-item" @click="logout">
                <div class="icon">
                  <IconLogout />
                </div>
                <div>{{ $t("logout") }}</div>
              </div>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArxiaLogoMobile from "~/../../src/shared/components/icon/ArxiaLogoMobile.vue";
import {
  onMounted,
  ref,
  shallowRef,
  watch,
  computed,
  onBeforeUnmount,
  nextTick,
} from "vue";
import IconExpand from "~/../../src/front/components/Icon/Expand.vue";
import IconCollapse from "~/../../src/front/components/Icon/Collapse.vue";
import SearchHeaderHome from "~/../../src/front/components/pages/home/SearchHeaderHome.vue";
import { useRoute, useRouter } from "#imports";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import resetStore from "~/../../src/admin/composables/resetStore";
import {
  isClassRoom,
  isConsultation,
  isEvent,
  isMedialCare,
  isRestaurant,
  isSalon,
} from "~/../../src/shared/constants/typeStore";
import typeStoreCategory, {
  CLASSROOM,
  CONSULTATION,
  dataTypeStore,
  EVENT,
  MEDIAL_CARE,
  RESTAURANT,
  SALON,
} from "~/../../src/shared/constants/category";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useNuxtApp } from "nuxt/app";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import { BOOKING_SOURCE_LINE } from "~/../../src/shared/constants/booking";
import { TYPE_SOCIAL } from "~/../../src/shared/constants/typeLogin";
import { useStoreSearch } from "~/../../src/front/store/store";

interface Prop {
  countNotice?: number;
}

withDefaults(defineProps<Prop>(), {
  countNotice: 0,
});

const router = useRouter();
const route = useRoute();
const isDisabled = ref(false);
const meStore = useMeStore();
const menu = useCookie(persistKeys.MENU);
const _refNavbar = ref();
const component = shallowRef(IconExpand);
const _refMenu = ref();
const arrayType = dataTypeStore;
const storeSearch = useStoreSearch();

const avatarUrl = computed(() => meStore.getAvatar);
//default active
const activeNames = ref(null);
const activeMenu = ref(null);
const currentTab = ref(null);

const { $bus } = useNuxtApp();
$bus.$on("changeCookie", (value) => {
  menu.value = value;
  activeMenu.value = +value;
});

const handleChange = (val: number) => {
  activeMenu.value = null;
  activeNames.value = null;
  useCookie(persistKeys.MENU).value = `${val}`;
  nextTick(() => {
    storeSearch.setHeaderSearch();
    switch (val) {
      case typeStoreCategory.RESTAURANT:
        router.push({ name: "top-restaurant" });
        break;
      case typeStoreCategory.SALON:
        router.push({ name: "top-salon" });
        break;
      case typeStoreCategory.MEDIAL_CARE:
        router.push({ name: "top-medical-care" });
        break;
      case typeStoreCategory.CLASSROOM:
        router.push({ name: "top-school" });
        break;
      case typeStoreCategory.EVENT:
        router.push({ name: "top-event" });
        break;
      case typeStoreCategory.CONSULTATION:
        router.push({ name: "top-consultation" });
        break;
    }
  });
};

const isLoginLine = computed(() => {
  const bookingSource = useCookie(persistKeys.BOOKING_SOURCE).value;
  const storeBooking = useCookie(persistKeys.STORE_LINE).value;
  const typeLogin = useCookie(persistKeys.TYPE_LOGIN).value;
  return (
    storeBooking &&
    Number(bookingSource) === BOOKING_SOURCE_LINE &&
    typeLogin === TYPE_SOCIAL.LINE
  );
});

const changeRoute = () => {
  component.value = IconExpand;
  _refNavbar.value.classList.remove("opened");
  document.body.classList.remove("overflow-hidden");
};

const handleToggle = () => {
  if (component.value === IconExpand) {
    openMenu();
  } else {
    closeMenu();
  }
};

const openMenu = () => {
  component.value = IconCollapse;
  _refNavbar.value.classList.add("opened");
  document.body.classList.add("overflow-hidden");
};

const closeMenu = () => {
  component.value = IconExpand;
  _refNavbar.value.classList.remove("opened");
  document.body.classList.remove("overflow-hidden");
};

const home = () => {
  activeNames.value = [];
  menu.value = "";
  router.push({ name: "index" });
  closeMenu();
};

const login = () => {
  router.push({ name: "login" });
  closeMenu();
};

const toChangePassword = () => {
  router.push({ name: "change-password" });
  closeMenu();
};
const notice = () => {
  router.push({ name: "notices" });
  closeMenu();
};

const profile = () => {
  router.push({ name: "profile" });
  closeMenu();
};

const logout = async () => {
  try {
    await authRequest.logout();
  } catch (e) {
  } finally {
    const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
    cookieToken.value = null;
    resetStore();
    router.push({ name: "login" });
    closeMenu();
  }
};

watch(
  menu,
  (value) => {
    activeNames.value = value;
  },
  { deep: true }
);

const setActiveTab = (name) => {
  activeNames.value = null;
  activeMenu.value = null;
  switch (name) {
    case "top-restaurant":
      useCookie(persistKeys.MENU).value = `${RESTAURANT}`;
      activeNames.value = RESTAURANT;
      currentTab.value = RESTAURANT;
      break;
    case "top-salon":
      useCookie(persistKeys.MENU).value = `${SALON}`;
      activeNames.value = SALON;
      currentTab.value = SALON;
      break;
    case "top-medical-care":
      useCookie(persistKeys.MENU).value = `${MEDIAL_CARE}`;
      activeNames.value = MEDIAL_CARE;
      currentTab.value = MEDIAL_CARE;
      break;
    case "top-school":
      useCookie(persistKeys.MENU).value = `${CLASSROOM}`;
      activeNames.value = CLASSROOM;
      currentTab.value = CLASSROOM;
      break;
    case "top-event":
      useCookie(persistKeys.MENU).value = `${EVENT}`;
      activeNames.value = EVENT;
      currentTab.value = EVENT;
      break;
    case "top-consultation":
      useCookie(persistKeys.MENU).value = `${CONSULTATION}`;
      activeNames.value = CONSULTATION;
      currentTab.value = CONSULTATION;
      break;
    case "profile":
      activeMenu.value = 7;
      break;
    case "login":
      activeMenu.value = 7;
      break;
    case "notices":
      activeMenu.value = 8;
      break;
    case "change-password":
      activeMenu.value = 10;
      break;
    case "index":
      activeNames.value = null;
      activeMenu.value = null;
      currentTab.value = null;
      break;
    default:
      activeNames.value = +menu.value;
      break;
  }
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}

watch(
  () => route.name,
  (value) => {
    setActiveTab(value);
  }
);

onMounted(() => {
  setActiveTab(route.name);
});

onBeforeUnmount(() => {
  $bus.$off("changeCookie");
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../shared/assets/scss/variables.scss";

:deep(.el-collapse-item__arrow) {
  display: none;
}

.is-disable-click {
  pointer-events: none;
}

.navbar-mobile.opened {
  height: 100%;

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__wrap {
      border-bottom: none;
    }

    .el-collapse-item__header {
      font-family: variables.$fontFamily;
      background-color: $background-header-tab;
      color: $white-color;
      font-size: 16px;
      padding: 0 16px;
      border: none;
      gap: 10px;

      &:hover {
        background-color: $yellow-low-color;
        color: $white-color;

        svg {
          path {
            fill: $white-color;
          }
        }
      }
    }

    .el-collapse-item.is-active {
      .el-collapse-item__header {
        &:hover {
          background-color: $yellow-low-color;
          color: $white-color;

          svg {
            path {
              fill: $white-color;
            }
          }
        }

        background-color: $yellow-low-color;
        color: $white-color;

        svg {
          path {
            fill: $white-color;
          }
        }
      }
    }

    .el-collapse-item__content {
      background-color: $black-100;
      color: $white-color;
      padding: 16px 16px 0;
    }
  }

  .menubar-mobile {
    height: 100%;
    background-color: $background-header-tab;
    border-right: 0;

    .qty-notice {
      display: flex;

      :deep(.el-badge__content.el-badge__content--danger) {
        display: block;
      }

      :deep(.el-badge__content) {
        border: none;
      }

      :deep(.el-badge .cursor-pointer:focus) {
        outline: none;
      }

      :deep(.el-badge__content.is-fixed) {
        top: 0;
        right: 20px;
        cursor: pointer;
        display: inline-flex;
        font-size: 9px;
      }
    }
  }

  .sidebar-menu {
    height: calc(100vh - 71px);
    top: 72px;
    z-index: 1001;
    overflow: auto;
  }
}

.navbar-mobile {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2041;
  width: 100%;

  .header-menu {
    //position: fixed;
    background-color: $black-100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 10px 16px 16px;
    height: 72px;

    .toggle-icon {
      height: 72px;
      line-height: 72px;
    }

    svg {
      vertical-align: middle;
    }
  }

  .sidebar-menu {
    width: 100%;
    position: absolute;
    top: 72px;
    left: 0;
    height: 0;
    overflow: hidden;
  }

  .menu-item {
    font-family: variables.$fontFamily;
    display: flex;
    gap: 10px;

    .ring:deep {
      width: 28px;
      height: 22px;
    }

    .icon {
      display: flex;
      align-items: center;

      &.user-login {
        width: 28px;
        padding: 0 5px;

        svg {
          width: 17px;
          height: 24px;
        }
      }

      .el-avatar--square {
        border-radius: 0;
      }
    }
  }

  :deep(.el-menu.menubar-mobile) {
    height: calc(100% - 288px);

    .el-menu-item * {
      vertical-align: baseline;
      font-size: 16px;
    }

    .el-sub-menu {
      & > .el-menu {
        background-color: $background-tab;

        & > .el-menu-item {
          display: block;
          height: auto;
          padding: 0 16px;
          cursor: unset;

          &:hover {
            background-color: $background-tab;
          }
        }
      }

      &.is-opened {
        .el-sub-menu__title {
          background-color: $yellow-color !important;
        }

        .menu-item {
          .icon {
            svg {
              path {
                fill: $white-color;
              }
            }
          }
        }
      }
    }

    & > .el-menu-item {
      background-color: $background-header-tab;
      padding: 16px;
      height: 48px;
      line-height: 48px;

      &.is-active {
        color: $yellow-low-color;

        .icon {
          svg {
            path {
              fill: $yellow-low-color;
            }
          }
        }
      }

      &:hover {
        background-color: $yellow-low-color !important;
        color: $white-color;

        .icon {
          svg {
            path {
              fill: $white-color;
            }
          }
        }
      }
    }

    .el-sub-menu__title {
      background-color: $background-header-tab !important;
      padding: 0 16px;
      height: 48px;
      font-size: 16px;

      .menu-item {
        height: 48px;
        line-height: 48px;
      }

      &:hover {
        background-color: $yellow-low-color !important;
      }
    }

    .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}

:deep(.area-search) {
  padding: 8px 0 22px;

  .area--search__header {
    padding: 0;
    gap: 16px;

    .el-input.input-custom {
      width: 100%;
    }

    .el-date-editor.el-input {
      --el-date-editor-width: 100%;
    }

    .el-select {
      width: 100%;
    }

    .el-button {
      margin: 0 auto;
    }
  }
}
</style>
