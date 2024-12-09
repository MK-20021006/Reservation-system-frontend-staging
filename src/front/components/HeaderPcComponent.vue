<template>
  <div class="header">
    <div
      ref="_refHeader"
      class="header-top"
      :class="{ 'is-disable-click': isDisabled }"
    >
      <div class="txt-left">{{ $t("reservation_portal_site") }}</div>
      <div class="txt-right user-logged d-flex align-items-center">
        <div v-if="meStore.info" class="user-name d-flex align-items-center">
          <ClientOnly>
            <CommonDropdownNotification ref="_refNotice" />
          </ClientOnly>
          <el-divider direction="vertical" />
          <ClientOnly>
            <div class="user-name" @click="$router.push({ name: 'index' })">
              {{ meStore.info?.fullname }}
            </div>
            <div
              ref="_refInfo"
              class="user-info d-flex align-items-center cursor-pointer"
            >
              <div class="d-flex align-items-center">
                <el-avatar
                  :size="24"
                  shape="square"
                  class="avatar-customer"
                  :src="avatarUrl"
                  @error="() => true"
                >
                  <img src="/assets/images/no-avatar.png" alt="" />
                </el-avatar>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </div>
            </div>
            <el-popover
              :teleported="false"
              :virtual-ref="_refInfo"
              :width="50"
              popper-class="custom-dropdown-info"
            >
              <ul class="list-item">
                <li @click="$router.push({ name: 'profile' })">
                  {{ $t("front.my_page") }}
                </li>
                <li
                  v-if="meStore.info && !meStore.info?.is_login_social"
                  @click="$router.push({ name: 'change-password' })"
                >
                  {{ $t("title_screen.change_password") }}
                </li>
                <li v-if="!isLoginLine" @click="logout">{{ $t("logout") }}</li>
              </ul>
            </el-popover>
          </ClientOnly>
        </div>
        <router-link v-else to="/login">
          <div class="box-text__login">
            <p>{{ $t("front.login_my_page") }}</p>
            <IconUserSmall />
          </div>
        </router-link>
      </div>
    </div>
    <div
      ref="_refMenu"
      class="header__menu"
      :class="[
        { 'position-menu': absolute },
        { 'is-disable-click': isDisabled },
      ]"
    >
      <div class="header__menu--logo">
        <div class="img">
          <big-arxia class="logo cursor-pointer" @click="backTop" />
        </div>
      </div>
      <div class="header__menu--item">
        <div class="menu__item">
          <el-tabs
            v-model="activeTab"
            type="border-card"
            @tab-click="handleTab"
          >
            <el-tab-pane
              v-for="item in arrayType"
              :key="item.id"
              :name="item.id"
            >
              <template #label>
                <div class="header-tab">
                  <IconBeauSalon v-if="isSalon(item.id)" />
                  <IconMenu v-if="isRestaurant(item.id)" />
                  <IconMedicalCare v-if="isMedialCare(item.id)" />
                  <IconClassRoom v-if="isClassRoom(item.id)" />
                  <IconConsultation v-if="isConsultation(item.id)" />
                  <IconEvent v-if="isEvent(item.id)" />
                  {{ item.name }}
                </div>
              </template>
              <template #default>
                <div v-if="isSalon(item.id)">
                  <SearchHeaderHome
                    :type="SALON"
                    :prop-data-search="
                      propDataSearch?.type === SALON
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
                <div v-if="isRestaurant(item.id)">
                  <SearchHeaderHome
                    :type="RESTAURANT"
                    :prop-data-search="
                      propDataSearch?.type === RESTAURANT
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
                <div v-if="isMedialCare(item.id)">
                  <SearchHeaderHome
                    :type="MEDIAL_CARE"
                    :prop-data-search="
                      propDataSearch?.type === MEDIAL_CARE
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
                <div v-if="isClassRoom(item.id)">
                  <SearchHeaderHome
                    :type="CLASSROOM"
                    :prop-data-search="
                      propDataSearch?.type === CLASSROOM
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
                <div v-if="isConsultation(item.id)">
                  <SearchHeaderHome
                    :type="CONSULTATION"
                    :prop-data-search="
                      propDataSearch?.type === CONSULTATION
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
                <div v-if="isEvent(item.id)">
                  <SearchHeaderHome
                    :type="EVENT"
                    :prop-data-search="
                      propDataSearch?.type === EVENT
                        ? propDataSearch.formData
                        : null
                    "
                  />
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane :name="-1">
              <template #label>
                <div class="header-tab"></div>
              </template>
              <template #default>
                <SearchHeaderHome
                  :type="-1"
                  :disabled-button-search="false"
                  :is-portal="true"
                  @fill-condition-search="fillDataSearch"
                />
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch, computed, onBeforeUnmount, nextTick } from "vue";
import { useCookie, useNuxtApp } from "nuxt/app";

import { ArrowDown } from "@element-plus/icons-vue";
import typeStoreCategory, {
  CLASSROOM,
  CONSULTATION,
  dataTypeStore,
  EVENT,
  MEDIAL_CARE,
  RESTAURANT,
  SALON,
} from "~/../../src/shared/constants/category";
import SearchHeaderHome from "~/../../src/front/components/pages/home/SearchHeaderHome.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { useRoute, useRouter } from "#imports";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import resetStore from "~/../../src/front/composables/resetStore";
import {
  isClassRoom,
  isConsultation,
  isEvent,
  isMedialCare,
  isRestaurant,
  isSalon,
} from "~/../../src/shared/constants/typeStore";
import BigArxia from "~/../../src/shared/components/icon/BigArxia.vue";
import { useStoreSearch } from "../store/store";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import { BOOKING_SOURCE_LINE } from "~/../../src/shared/constants/booking";
import { TYPE_SOCIAL } from "~/../../src/shared/constants/typeLogin";

const storeSearch = useStoreSearch();
const meStore = useMeStore();
const arrayType = dataTypeStore;
const _refMenu = ref(null);
const _refHeader = ref(null);
const { $bus } = useNuxtApp();

const { t } = i18n.global;

const router = useRouter();
const route = useRoute();

const avatarUrl = computed(() => meStore.getAvatar);

const menu = useCookie(persistKeys.MENU);
const activeTab = ref(+menu.value);
const _refInfo = ref();
const heightTabHeader = ref(false);
const _refNotice = ref();
const absolute = ref(false);
const categorySelected = ref(inject("categorySelectedGlobal", ""));
const isDisabled = ref(false);
const propDataSearch = ref(null);

const logout = async () => {
  try {
    await authRequest.logout();
  } catch (e) {
  } finally {
    const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
    cookieToken.value = null;
    resetStore();
    router.push({ name: "login" });
  }
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

const backTop = () => {
  activeTab.value = -1;
  menu.value = "";
  useCookie(persistKeys.MENU).value = null;

  nextTick(async () => {
    storeSearch.setHeaderSearch();
    await router.push({ name: "index" });
  });
};

watch(categorySelected, (val) => {
  activeTab.value = +val;
});

$bus.$on("changeCookie", (value) => {
  menu.value = value;
  activeTab.value = +value;
});

const getHeightMenu = () => {
  return (
    Number(_refMenu.value.clientHeight) + Number(_refHeader.value.clientHeight)
  );
};

const handleTab = (pane) => {
  useCookie(persistKeys.MENU).value = pane.paneName;

  nextTick(() => {
    storeSearch.setHeaderSearch();
    switch (pane.paneName) {
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
      default:
        router.push({ name: "top-restaurant" });
        break;
    }
  });
};

const setActiveTabRouter = (name) => {
  switch (name) {
    case "top-restaurant":
      useCookie(persistKeys.MENU).value = String(RESTAURANT);
      activeTab.value = RESTAURANT;
      break;
    case "top-salon":
      useCookie(persistKeys.MENU).value = String(SALON);
      activeTab.value = SALON;
      break;
    case "top-medical-care":
      useCookie(persistKeys.MENU).value = String(MEDIAL_CARE);
      activeTab.value = MEDIAL_CARE;
      break;
    case "top-school":
      useCookie(persistKeys.MENU).value = String(CLASSROOM);
      activeTab.value = CLASSROOM;
      break;
    case "top-event":
      useCookie(persistKeys.MENU).value = String(EVENT);
      activeTab.value = EVENT;
      break;
    case "top-consultation":
      useCookie(persistKeys.MENU).value = String(CONSULTATION);
      activeTab.value = CONSULTATION;
      break;
    case "index":
      activeTab.value = -1;
      heightTabHeader.value = true;
      break;
    default:
      activeTab.value = +useCookie(persistKeys.MENU).value || -1;
      break;
  }
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}

const fillDataSearch = (data) => {
  propDataSearch.value = data;
};

watch(
  route,
  (newValue) => {
    const value = newValue.name as string;
    heightTabHeader.value = value === "index";
    //TODO: absolute header postal, restaurant, salon
    absolute.value =
      value.includes("top-restaurant") ||
      value.includes("top-salon") ||
      value === "index";
    setActiveTabRouter(value);
  },
  {
    immediate: true,
  }
);

defineExpose({
  _refNotice,
  _refMenu,
  getHeightMenu,
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

.header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2030;
  width: 100%;

  .is-disable-click {
    pointer-events: none;
  }

  .profile-customer {
    display: flex;
    align-items: center;

    .img-avatar {
      margin-right: 10px;

      svg {
        height: 24px;
        width: 24px;
      }
    }
  }

  .box-text__login {
    display: flex;

    svg {
      margin-left: 10px;
    }
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: $background-header-top;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: $color-header-top;
    padding: 0 64px;

    .txt-right {
      .user-info,
      a {
        gap: 12px;
        color: $color-header-top;
        font-weight: 400;
        font-size: 12px;
        text-decoration: none;
      }

      .el-avatar--square {
        border-radius: 0;
      }

      &.user-logged {
        gap: 24px;

        .user-name {
          gap: 14px;

          .avatar-customer {
            margin-right: 10px;
          }

          .user-info {
            font-size: 14px;
            gap: 8px;

            :deep(svg) {
              path {
                fill: $color-header-top;
                fill-opacity: 0.6;
              }
            }

            .el-avatar--circle {
              border-radius: unset;
            }
          }
        }
      }
    }
  }

  .header__menu {
    position: relative;
    width: 100%;
    display: flex;
    height: 112px;

    &.position-menu {
      position: absolute;
    }

    .header__menu--logo {
      min-width: 266px;
      flex: 0 0 25%;
      background-color: $background-logo;

      .img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        border-right: 1px solid $gray-800;

        &:before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          opacity: 0.5;
        }
      }

      .logo {
        //padding: 26px 0;
      }
    }

    .header__menu--item {
      max-width: calc(100% - 266px);
      width: calc(100% - 25%);

      &.height-tab {
        height: 40px;
      }

      .menu__item {
        height: 100%;

        .header-tab {
          color: $color-header-tab;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: variables.$fontFamily;
          font-size: 16px;

          svg {
            vertical-align: middle;
          }
        }
      }
    }

    :deep(.el-tabs) {
      border: none;
      box-shadow: none;
      height: 100%;
      $heightTab: 40px;
      --el-tabs-header-height: 40px;

      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: $heightTab;
        font-size: 20px;
      }

      #tab--1 {
        display: none;
      }

      .el-tabs__header {
        background: $background-header-tab;
        border-bottom: none;
        height: $heightTab;

        .el-tabs__item.is-active {
          background: $background-tab;
          color: $color-tab-item;

          .header-tab {
            color: $color-tab-item;

            svg {
              path {
                fill: #b4985c;
              }
            }
          }
        }

        .el-tabs__item {
          border-right: none;
          border-left: none;
          position: relative;
          width: 228px;
          text-align: center;

          &:not(.is-disabled):hover {
            color: $color-tab-item;
          }

          &.is-active:after {
            content: "";
            width: 100%;
            height: 2px;
            background-color: $color-tab-item;
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }

      .el-tabs__content {
        background: $background-tab;
        height: calc(100% - $heightTab);
        padding: 0;
      }
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .header {
    .header__menu {
      height: 112px;

      :deep(.el-tabs) {
        .el-tabs__header {
          .el-tabs__item {
            width: 165px;
          }
        }
      }
    }

    :deep(.area--search__header) {
      padding: 16px;

      .el-input {
        --el-input-height: 36px;
      }

      .btn-search.el-button {
        height: 36px;
        width: 148px;
      }

      .el-select {
        width: 148px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .header {
    .header__menu {
      .header__menu--logo {
        min-width: 140px;
        flex: 0 0 140px;

        svg {
          width: 80%;
          height: 100%;
        }
      }

      .header__menu--item {
        max-width: calc(100% - 140px);
        flex: 1;
      }
    }

    :deep(.area--search__header) {
      padding: 16px;

      .el-input {
        --el-input-height: 36px;

        &.input-custom {
          width: 125px;
        }
      }

      .btn-search.el-button {
        height: 36px;
        width: 125px;
      }

      .el-select {
        width: 125px;
      }

      .el-date-editor {
        &.el-input {
          --el-date-editor-width: 125px;
        }
      }
    }
  }
}
</style>
