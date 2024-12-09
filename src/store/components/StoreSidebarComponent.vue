<template>
  <div class="navigation">
    <div class="logo-sidebar" :class="{ collapse: isCollapse }">
      <white-arxia class="big-arxia" />
    </div>
    <div class="item-menu">
      <el-scrollbar always>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          background-color="#0353A4"
          text-color="#ffffff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
        >
          <template v-for="(item, index) in storeRouters" :key="index">
            <div>
              <template v-if="!item.hidden && isShowChild(item.children)">
                <!--Have no sub-menu-->
                <el-menu-item
                  v-if="
                    isShowParent(item) &&
                    isShowRecruitment(item) &&
                    isShowSetting(item) &&
                    isShowZoom(item) &&
                    isSettingGoogle(item)
                  "
                  :index="item.name"
                  :route="{ name: item.name }"
                >
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                  <template #title>
                    <div class="menu-title">
                      <span class="menu-title__item">{{ item.title }}</span>
                      <el-badge
                        v-if="
                          meStore.totalWaiting && item.name === 'reservation'
                        "
                        :value="meStore.totalWaiting"
                        :max="99"
                        class="item"
                      >
                      </el-badge>
                      <el-badge
                        v-if="
                          meStore.totalJobFailed && item.name === 'job-data'
                        "
                        :value="meStore.totalJobFailed"
                        :max="99"
                        class="item"
                      >
                      </el-badge>
                    </div>
                  </template>
                </el-menu-item>
              </template>
              <!--Have sub-menu-->
              <el-sub-menu v-else-if="!item.hidden" :index="item.name">
                <template #title>
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                  <span v-if="!isCollapse">{{ item.title }}</span>
                </template>
                <el-menu-item
                  v-for="(child, key) in getItemSidebar(item.children)"
                  :key="key"
                  :index="child.name"
                  :route="{ name: child.name }"
                >
                  {{ child.title }}
                </el-menu-item>
              </el-sub-menu>
            </div>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { BreadcrumbStore } from "~/../../src/store/store/breadcrumb";
import { storeRouters } from "~/../../src/store/router";
import { useMeStore } from "~/../../src/shared/stores/me";
import WhiteArxia from "~/../../src/shared/components/icon/WhiteArxia.vue";
import { HAVE_JOB_OFFER } from "~/../../src/shared/constants";

interface Prop {
  isCollapse?: boolean;
}

withDefaults(defineProps<Prop>(), {
  isCollapse: false,
});

const breadcrumbStore = BreadcrumbStore();
const meStore = useMeStore();

const isShowChild = (children = []) => {
  const showingChildren = children.filter((item: any) => !item.hidden);
  return showingChildren.length === 0;
};

const isShowRecruitment = (item: any) => {
  return (
    !item.haveRecruitment ||
    (item.haveRecruitment && meStore.getRecruitment === HAVE_JOB_OFFER)
  );
};

const activeMenu = computed(() => {
  const menu = breadcrumbStore?.breadcrumb?.filter((item) => !item.hidden);
  return menu?.length && menu[menu.length - 1]?.name;
});

const getItemSidebar = (children: any) => {
  return children.filter(
    (item: any) =>
      item.typeStore === undefined ||
      (item.typeStore && item.typeStore.includes(meStore.typeStore))
  );
};

const isShowParent = (item: any) => {
  return (
    item.typeStore === undefined ||
    (item.typeStore && item.typeStore.includes(meStore.typeStore))
  );
};

const isSettingZoom = computed(() => {
  return meStore.isSettingZoom;
});

const isSettingLine = computed(() => {
  return meStore.isSettingLine;
});

const isSettingExternalSite = computed(() => {
  return meStore.isSettingExternalSite;
});

const isShowSetting = (item: any) => {
  return (
    !item.settingSite ||
    (item.settingSite && (isSettingLine.value || isSettingExternalSite.value))
  );
};

const statusStoreDone = computed(() => {
  return meStore.settingDoneStore;
});

const isSettingGoogle = (item: any) => {
  return !item.settingGoogle || (item.settingGoogle && statusStoreDone.value);
};

const isShowZoom = (item: any) => {
  return !item.settingZoom || (item.settingZoom && isSettingZoom.value);
};
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

$bg-item: #0466c8;
$bg-sidebar: #0353a4;
$bg-sub-menu: #023e7d;
$color-item-hover: #ffffff;
$color-hover-icon: #ffffff;
$color-item: #ffffff;

.navigation {
  position: fixed;
  height: 100%;
  background-color: $bg-sidebar;
  overflow: hidden;
  z-index: 2030;

  .menu-title {
    position: relative;

    .el-badge {
      position: absolute;
      left: 175px;
      bottom: 15px;
    }
  }

  &.active {
    width: $widthCollapse;
  }

  .logo-sidebar {
    height: 64px;
    padding: 12px 18px;
    margin-bottom: 16px;

    &.collapse {
      padding: 12px 8px;
    }
    .big-arxia {
      width: 176px;
      height: 60px;
    }
  }

  .item-menu {
    height: calc(100% - 64px - 16px);
  }

  :deep(.el-menu) {
    --el-menu-border-color: $bg-sidebar;
    --el-menu-base-level-padding: 18px;
    width: 270px;

    .el-menu-item {
      --el-menu-item-height: 48px;
    }

    &.el-menu--collapse {
      --el-menu-icon-width: 20px;
      --el-menu-base-level-padding: 20px;
      width: 60px;
    }

    .el-menu-item.is-active {
      background: $bg-item;
      color: $white-color;
    }

    .el-sub-menu {
      .el-menu {
        background: $bg-sub-menu;
      }

      .el-menu-item {
        --el-menu-sub-item-height: 48px;
      }
    }

    .el-sub-menu .el-menu--inline {
      .el-menu-item {
        --el-menu-base-level-padding: 30px;
        --el-menu-level-padding: 20px;
      }
    }
  }
}
</style>
