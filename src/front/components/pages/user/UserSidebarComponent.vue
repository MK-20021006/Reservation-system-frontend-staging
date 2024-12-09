<template>
  <div class="navigation">
    <div class="logo-sidebar d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center user-info">
        <el-avatar
          shape="square"
          :size="40"
          class="avatar-customer"
          :src="avatarUrl"
          @error="() => true"
        >
          <img src="/assets/images/no-avatar.png" alt="" />
        </el-avatar>
        <div class="text-fullname">{{ meStore.info?.fullname }}</div>
      </div>
      <div
        v-if="isShowSidebarUser"
        class="toggle-icon cursor-pointer hidden-sm-and-up"
        @click="closeSidebarMobileUser"
      >
        <CollapseSidebarUser />
      </div>
    </div>
    <div class="item-menu">
      <ul>
        <li
          v-for="(item, index) in listItemMenu"
          :key="index"
          :class="{
            active: activeSidebar(item.name),
          }"
        >
          <NuxtLink :to="{ name: item.name }" @click="closeSidebarMobileUser">
            <span class="icon">
              <component :is="item.icon" />
            </span>
            <span class="title text-truncate">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "#imports";
import IconUserProfile from "~/../../src/front/components/Icon/UserProfile.vue";
import IconReservationList from "~/../../src/front/components/Icon/ReservationList.vue";
import IconNotificationList from "~/../../src/front/components/Icon/NotificationList.vue";
import IconPayment from "~/../../src/front/components/Icon/IconPayment.vue";
import IconLock from "~/../../src/front/components/Icon/Lock.vue";
import IconReview from "~/../../src/front/components/Icon/Review.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import CollapseSidebarUser from "~/../../src/front/components/Icon/CollapseSidebarUser.vue";
import { inject, ref, computed } from "vue";

const meStore = useMeStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const isShowSidebarUser = ref(inject("user_layout", false));

const avatarUrl = computed(() => meStore.getAvatar);

const listItemMenu = [
  {
    name: "profile",
    icon: IconUserProfile,
    title: t("title_screen.profile"),
  },
  {
    name: "change-password",
    icon: IconLock,
    title: t("title_screen.change_password"),
  },
  {
    name: "reservation",
    icon: IconReservationList,
    title: t("front.reservation_list"),
  },
  {
    name: "notices",
    icon: IconNotificationList,
    title: t("front.notification_list"),
  },
  {
    name: "invoices",
    icon: IconPayment,
    title: t("title_screen.payment_list"),
  },
  {
    name: "review",
    icon: IconReview,
    title: t("list_review"),
  },
];

if (meStore?.info?.is_login_social) {
  const index = listItemMenu.findIndex(
    (item) => item.name === "change-password"
  );
  if (index !== -1) {
    listItemMenu.splice(index, 1);
  }
}

const activeSidebar = (currentRouterName: string) => {
  const currentRouter = router.options.routes.find(
    (item) => item.name === route.name
  );
  return (
    currentRouter &&
    currentRouter?.meta?.activeSidebar?.parentName === currentRouterName
  );
};

const closeSidebarMobileUser = () => {
  document.body.classList.remove("overflow-hidden");
  isShowSidebarUser.value = false;
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;

$bg-item: #efefef;
$bg-sidebar: $white-color;
$color-item-hover: $black-80;
$color-hover-icon: $black-80;
$color-item: $black-80;
$height-logo-sidebar: 72px;
$margin-bottom-header-sidebar: 16px;

.navigation {
  flex: 0 0 $sideBarWidth;
  background-color: $bg-sidebar;
  box-shadow: 0px 2px 3px 0px #0000001a;

  .logo-sidebar {
    min-height: $height-logo-sidebar;
    gap: 8px;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: $margin-bottom-header-sidebar;
    padding: 0 16px;

    .user-info {
      gap: 8px;
      .el-avatar--square {
        border-radius: 0;
      }
    }
    .text-fullname {
      word-wrap: break-word;
      width: 150px;
    }

    span {
      color: $black-80;
      font-size: 16px;
      font-weight: 500;
    }

    :deep(.avatar-customer) svg {
      height: 40px;
      width: 40px;
      border-radius: 100%;
    }

    .toggle-icon {
      :deep(svg) {
        path {
          fill: #000000cc;
        }
      }
    }
  }

  .item-menu {
    height: calc(100% - $height-logo-sidebar - $margin-bottom-header-sidebar);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      width: 100%;
      position: relative;
      cursor: pointer;

      a {
        display: flex;
        align-items: center;
        position: relative;
        text-decoration: none;
        color: $color-item;
        padding: 0 13px;

        .icon {
          display: block;
          position: relative;
          min-width: 40px;
          height: $height-item;
          line-height: $height-item;
          text-align: center;

          svg {
            vertical-align: middle;
          }
        }

        h2 {
          font-size: 24px;
        }

        .title {
          position: relative;
          height: $height-item;
          line-height: $height-item;
          white-space: nowrap;
        }
      }

      &:hover,
      &.active {
        a {
          color: $yellow-color;
        }

        .icon {
          :deep(svg) {
            path {
              fill: $yellow-color;
            }
          }
        }
      }
    }
  }
}
</style>
