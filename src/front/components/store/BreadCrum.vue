<template>
  <div
    class="breadcrumb"
    :class="[{ 'user-screen': isUser }, { 'is-disable-click': isDisabled }]"
  >
    <div
      class="title-breadcrumb flex-1 d-flex justify-content-between align-items-center"
    >
      <div class="d-flex align-items-center">
        <div class="icon-home" @click="router.push('/')">
          <icon-home />
        </div>
        <ClientOnly>
          <el-breadcrumb :separator-icon="IconRight" :class="className">
            <el-breadcrumb-item :to="{ path: '/' }">
              {{ $t("site_name") }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in dataTitle"
              :key="index"
              :to="{ path: item.path }"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </ClientOnly>
      </div>
      <!--Show icon open sidebar user-->
      <div
        v-if="userStore.getUserId && !isHidden"
        class="icon-filter d-flex cursor-pointer hidden-sm-and-up"
        @click="openSidebarUserMobile"
      >
        <icon-filter />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, inject, ref } from "vue";
import IconRight from "../Icon/Right";
import { useRoute, useRouter } from "#imports";
import { useMeStore } from "~/../../src/shared/stores/me";

const router = useRouter();
const userStore = useMeStore();
const isDisabled = ref(false);
const route = useRoute();
const props = defineProps({
  dataTitle: {
    type: Array,
    required: false,
    default() {
      return [];
    },
  },
  isUser: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: "",
  },
});

const isShowSidebarUser = ref(inject("user_layout", false));

const openSidebarUserMobile = () => {
  isShowSidebarUser.value = true;
  document.body.classList.add("overflow-hidden");
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../assets/scss/variables" as *;

$color-border: #e7e7e7;
$bg-breadcrumb: #ffffff;
$color-breadcrumb-text: #606266;
$color-breadcrumb-link: #909399;

.is-disable-click {
  pointer-events: none;
}

.breadcrumb {
  display: flex;
  width: 100%;
  padding: 8.5px 12.5%;
  background: $bg-breadcrumb;
  justify-content: space-between;

  .title-breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .icon-home {
      margin-right: 14px;
    }

    .detail-store {
      .el-breadcrumb__item {
        &:last-child {
          width: 400px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;

          :deep(.is-link) {
            font-weight: 400;
            color: $color-breadcrumb-text;
          }
        }
      }
    }

    .el-breadcrumb {
      .el-breadcrumb__item {
        color: $color-breadcrumb-text;

        .breadcrumb__inner {
          color: $color-breadcrumb-text;
          font-weight: 600;
        }

        :deep(.is-link) {
          font-weight: 400;
          color: $color-breadcrumb-link;
        }
      }
    }
  }

  .icon-filter {
    &:hover {
      :deep(svg) {
        path {
          fill: #b4985c;
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .breadcrumb {
    padding: 8.5px 5%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .breadcrumb {
    padding: 16px;
    border-bottom: 1px solid #e7e7e7;
    align-items: center;
    height: 40px;

    &.user-screen {
      :deep(.el-breadcrumb) {
        .el-breadcrumb__item:first-child {
          .el-breadcrumb__inner {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            width: 0;
          }

          &:before {
            content: "...";
          }
        }
      }
    }
  }
}
</style>
