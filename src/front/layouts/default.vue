<template>
  <div id="main-customer-layout">
    <LazyUserHeaderComponent />
    <div
      id="breadcrumb"
      ref="_refBreadCrumb"
      :class="{ 'hide-bread-crumb': isHomePage }"
    >
      <!--Sidebar Mobile-->
      <div
        v-if="checkRoute()"
        v-show="isShowSidebarUser"
        class="sidebar-user hidden-sm-and-up"
      >
        <UserSidebarComponent />
      </div>
    </div>
    <el-container
      id="container-layout-default"
      :class="{
        'show-sidebar-user': checkRoute(),
        'show-user-guest': !checkRoute(),
      }"
      direction="horizontal"
    >
      <UserSidebarComponent v-if="checkRoute()" class="hidden-xs-only" />
      <div :class="{ 'main-container-user': checkRoute() }">
        <slot />
      </div>
    </el-container>
    <LazyFooterComponent v-if="!isHomePage" />
    <ButtonBackTop />
    <ButtonBackTopMobile />
  </div>
</template>

<script lang="ts" setup>
import UserSidebarComponent from "~/../../src/front/components/pages/user/UserSidebarComponent.vue";
import { useDeviceStore } from "../store/device";
import { onMounted, watch, ref, defineAsyncComponent, provide } from "vue";
import { useRoute } from "#imports";
import { persistKeys } from "./../../shared/constants/persist-key";
import { useCookie } from "#app";

const ButtonBackTop = defineAsyncComponent(
  () => import("~/../../src/shared/components/button/BackTop.vue")
);
const ButtonBackTopMobile = defineAsyncComponent(
  () => import("~/../../src/shared/components/button/BackTopMobile.vue")
);
const deviceTable = useDeviceStore();
const _refBreadCrumb = ref(null);
const heightMenu = deviceTable.heightMenu;
const isShowSidebarUser = ref(false);
provide("user_layout", isShowSidebarUser);
let top = heightMenu + "px";
const route = useRoute();
const isHomePage = ref(route.query.is_homepage);
const redirect = useCookie(persistKeys.REDIRECT);
const dataRoute = ref<string[]>([
  "profile",
  "notices",
  "invoices",
  "invoices-detail-id",
  "reservation",
  "reservation-detail-id",
  "reservation-booking",
  "reservation-cancel-booking-id",
  "review",
  "change-password",
]);

const checkRoute = () => {
  const name = String(route.name);
  return dataRoute.value.includes(name);
};

watch(
  () => deviceTable.heightMenu,
  (value) => {
    setTimeout(() => {
      if (_refBreadCrumb.value) {
        _refBreadCrumb.value.style.top = value + "px";
      } else {
        top = value + "px";
      }
    }, 300);
  },
  { deep: true }
);

watch(route, (value) => {
  if (value.path !== "/login") {
    redirect.value = value.fullPath;
  }
  setTimeout(() => {
    if (_refBreadCrumb.value) {
      _refBreadCrumb.value.style.top = deviceTable.heightMenu + "px";
    } else {
      top = deviceTable.heightMenu + "px";
    }
  }, 300);
});

onMounted(() => {
  setTimeout(() => {
    _refBreadCrumb.value.style.top = top;
  }, 300);
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

#breadcrumb {
  position: sticky;
  z-index: 2001;
  background: white;
  width: 100%;
  left: 0;
  top: v-bind(top);
}

:deep(.top-container) {
  width: 100%;

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  hr {
    color: $gray-500;
  }

  .section-content {
    padding: 80px 16% 80px;
  }
}

:deep(.hide-header) {
  display: none;
}

:deep(.hide-footer) {
  display: none;
}
:deep(.hide-bread-crumb) {
  display: none;
}

// user
:deep(.sidebar-user) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2050;
  height: calc(100vh - 72px);
  background-color: #ffffff;

  .navigation {
    box-shadow: none;
  }
}

.show-sidebar-user {
  justify-content: unset;
  gap: 24px;
  padding: 24px 12.5%;

  .main-container-user {
    background-color: #ffffff;
    box-shadow: 0 2px 3px 0 #0000000d;
    width: 100%;
  }
}

#main-customer-layout {
  :deep(.el-container) {
    justify-content: center;
  }

  :deep(.show-user-guest) {
    display: unset;
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  :deep(.top-container) {
    .section-content {
      padding: 100px 12.5% 60px;
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .el-container {
    gap: 16px;
    padding: 24px 5%;
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  :deep(.section-five) {
    .store {
      .btn-load__more {
        margin: 16px;
      }
    }
  }

  :deep(.top-container) {
    .section-content {
      padding: 60px 5% 40px;
    }
  }
}
@include res("xs-only", $breakpoints-spec) {
  :deep(.top-container) {
    .section-content {
      padding: 40px 24px 40px;
    }
  }
  //user
  .el-container {
    padding: 0;
  }
}
</style>
