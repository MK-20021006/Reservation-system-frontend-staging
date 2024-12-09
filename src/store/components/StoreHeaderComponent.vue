<template>
  <div class="store-header">
    <div class="left">
      <div
        class="toggle cursor-pointer d-flex justify-content-center align-items-center"
        @click="toggleSidebar"
      >
        <el-tooltip
          v-if="!isCollapse"
          :content="$t('close_dashboard')"
          placement="top-start"
        >
          <IconToggle />
        </el-tooltip>
        <el-tooltip
          v-else
          :content="$t('open_dashboard')"
          placement="top-start"
        >
          <unexpand-sidebar />
        </el-tooltip>
      </div>
      <div class="breadcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
          <template
            v-for="(item, key) in breadcrumbStore.breadcrumb"
            :key="key"
          >
            <el-breadcrumb-item
              v-if="item.name && item?.name !== route.name"
              :to="{
                name: item?.name === 'store' ? 'store-basic' : item?.name,
              }"
            >
              {{ item?.title }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else>{{ item?.title }}</el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right">
      <div
        v-if="
          !isLoading &&
          meStore.getUserId &&
          ((!authStore.stepActive.has_course_public &&
            [SALON, RESTAURANT, CONSULTATION, CLASSROOM, MEDIAL_CARE].includes(
              meStore.typeStore
            )) ||
            !authStore.stepActive.is_setting_payment ||
            (!authStore.stepActive.has_event_public &&
              meStore.typeStore === EVENT))
        "
        class="group-step d-flex align-items-center"
      >
        <div class="step-item pass-step">
          <div class="step-number">
            <div class="check"></div>
          </div>
          <div class="step-label">
            {{ $t("store.enter_basic_information") }}
          </div>
        </div>
        <el-divider />
        <div
          v-if="
            [SALON, RESTAURANT, CONSULTATION, CLASSROOM, MEDIAL_CARE].includes(
              meStore.typeStore
            )
          "
          class="step-item"
          :class="[
            {
              'cursor-pointer': !authStore.stepActive.has_course_public,
            },
            getClassStepCourse,
          ]"
          @click="switchStep('course')"
        >
          <div class="step-number">
            <div v-if="getClassStepCourse === 'pass-step'" class="check"></div>
            <span v-else>2</span>
          </div>
          <div class="step-label">{{ $t("store.course_setting") }}</div>
        </div>
        <div
          v-else
          class="step-item"
          :class="[
            {
              'cursor-pointer': !authStore.stepActive.has_event_public,
            },

            getClassStepEvent,
          ]"
          @click="switchStep('event')"
        >
          <div class="step-number">
            <div v-if="getClassStepEvent === 'pass-step'" class="check"></div>
            <span v-else>2</span>
          </div>
          <div class="step-label">{{ $t("store.event_management") }}</div>
        </div>
        <el-divider />
        <div
          class="step-item"
          :class="[
            {
              'cursor-pointer': !authStore.stepActive.is_setting_payment,
            },
            getClassStepPayment,
          ]"
          @click="switchStep('payment')"
        >
          <div class="step-number">
            <div v-if="getClassStepPayment === 'pass-step'" class="check"></div>
            <span v-else>3</span>
          </div>
          <div class="step-label">{{ $t("store.payment_setting") }}</div>
        </div>
      </div>
      <div class="noti cursor-pointer">
        <ClientOnly>
          <CommonDropdownNotification />
        </ClientOnly>
      </div>
      <el-divider direction="vertical" />
      <div ref="_refInfo" class="info d-flex align-items-center cursor-pointer">
        <div v-if="meStore.getAvatar">
          <el-avatar
            :size="24"
            shape="square"
            class="avatar-customer"
            :src="avatarUrl"
            @error="() => true"
          >
            <img src="/assets/image/no-avatar.png" alt="" />
          </el-avatar>
        </div>
        <div v-else>
          <IconUserInfo />
        </div>
        <ClientOnly>
          <div
            class="user-name text-long-elise"
            @click="$router.push({ name: 'index' })"
          >
            {{ meStore.getFullNameStore }}
          </div>
          <el-icon>
            <ArrowDown />
          </el-icon>
          <el-popover
            :teleported="false"
            :virtual-ref="_refInfo"
            :width="50"
            popper-class="custom-dropdown-info"
          >
            <ul class="list-item">
              <li @click="$router.push({ name: 'change-password' })">
                {{ $t("title_screen.change_password") }}
              </li>
              <li @click="logout">{{ $t("logout") }}</li>
            </ul>
          </el-popover>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import { BreadcrumbStore } from "~/../../src/store/store/breadcrumb";
import { storeRouters } from "~/../../src/store/router";
import { useMeStore } from "~/../../src/shared/stores/me";
import resetStore from "~/../../src/store/composables/resetStore";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { useAuthStore } from "~/../../src/store/store/store";
import { StoreStepActive } from "~/../../src/store/models";
import { useNuxtApp } from "nuxt/app";
import UnexpandSidebar from "~/../../src/shared/components/icon/UnexpandSidebar.vue";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import {
  SALON,
  RESTAURANT,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
  EVENT,
} from "~/../../src/shared/constants/category";

const meStore = useMeStore();
const route = useRoute();
const breadcrumbStore = BreadcrumbStore();
const router = useRouter();
const emits = defineEmits(["toggleSidebar"]);
const isCollapse = ref(false);
const authStore = useAuthStore();
const currentStep = ref("");
const isLoading = ref(true);
const { $bus } = useNuxtApp();

const avatarUrl = computed(() => meStore.getAvatar);
const _refInfo = ref();

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

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
  emits("toggleSidebar", isCollapse.value);
  let toggle = document.querySelector(".toggle");
  let navigator = document.querySelector(".navigation");
  let main = document.querySelector(".main-container");

  toggle.classList.toggle("active");
  navigator.classList.toggle("active");
  main.classList.toggle("active");
  setTimeout(() => {
    $bus.$emit("resizeHeader");
  }, 200);
};

const getAncestors = (target, routers, ancestors = []) => {
  if (!routers) return undefined;
  for (let router of routers) {
    if (router.name === target) {
      return ancestors.concat(router);
    }
    const routersFilter = router?.children?.filter((item) => {
      //find in the list of routers that belong to that typeStore and then find the title of that menu
      return (
        item.typeStore === undefined ||
        item.typeStore.includes(meStore.typeStore)
      );
    });
    const found = getAncestors(target, routersFilter, ancestors.concat(router));
    if (found) {
      return found;
    }
  }
};

const getBreadcrumb = () => {
  breadcrumbStore.setBreadcrumb(getAncestors(route.name, storeRouters));
};

const switchStep = (step: string) => {
  if (step === "course" && !authStore.stepActive.has_course_public) {
    currentStep.value = step;
    router.push({ name: "store-course" });
  } else if (step === "event" && !authStore.stepActive.has_course_public) {
    currentStep.value = step;
    router.push({ name: "store-event" });
  } else if (step === "payment" && !authStore.stepActive.is_setting_payment) {
    currentStep.value = step;
    router.push({ name: "payment-setting" });
  }
};

const getClassStepCourse = computed(() => {
  if (authStore.stepActive.has_course_public) {
    return "pass-step";
  } else if (authStore.stepActive.is_setting_payment) {
    return "current-step";
  }
  return currentStep.value === "course" ? "current-step" : "";
});

const getClassStepEvent = computed(() => {
  if (authStore.stepActive.has_event_public) {
    return "pass-step";
  } else if (authStore.stepActive.is_setting_payment) {
    return "current-step";
  }
  return currentStep.value === "event" ? "current-step" : "";
});

const getClassStepPayment = computed(() => {
  if (authStore.stepActive.is_setting_payment) {
    return "pass-step";
  } else if (authStore.stepActive.has_course_public) {
    return "current-step";
  }
  return currentStep.value === "payment" ? "current-step" : "";
});

watch(route, () => {
  getBreadcrumb();
});

onBeforeMount(async () => {
  if (meStore.getStoreId) {
    const data = (
      await StoreRequest.getStepStore<StoreStepActive>(meStore.getStoreId, true)
    )?.data;
    authStore.setStepStore(data);
    if (
      [SALON, RESTAURANT, CONSULTATION, CLASSROOM, MEDIAL_CARE].includes(
        meStore.typeStore
      )
    ) {
      !data.has_course_public
        ? (currentStep.value = "course")
        : (currentStep.value = "payment");
    } else {
      !data.has_event_public
        ? (currentStep.value = "event")
        : (currentStep.value = "payment");
    }
    isLoading.value = false;
  }
});

onMounted(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

$bg-header: #ffffff;

.check {
  display: inline-block;
  transform: rotate(45deg);
  height: 12px;
  width: 8px;
  border-bottom: 1px solid $blue;
  border-right: 1px solid $blue;
}

.store-header {
  width: 100%;
  background: $bg-header;
  height: $height-header;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-name {
    max-width: 250px;
  }

  .toggle {
    position: relative;
    display: inline-flex;
    width: 37px;
    height: 100%;
  }

  .breadcrumb {
    display: inline-block;
  }

  .right {
    display: inline-flex;
    float: right;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 20px;

    .group-step {
      margin-right: 29px;
      gap: 16px;

      .step-item {
        display: flex;
        gap: 16px;

        .step-number {
          width: 24px;
          height: 24px;
          border: 1px solid $black-40;
          border-radius: 100%;
          text-align: center;
        }

        .step-label {
          color: $black-40;
        }

        &.current-step {
          .step-number {
            background-color: $blue;
            border-color: $blue;
            color: $white-color;
          }

          .step-label {
            color: $blue;
          }
        }

        &.pass-step {
          .step-number {
            border-color: $blue;
          }
        }
      }

      .el-divider {
        width: 60px;
        border: 2px solid $gray-300;
      }
    }

    .info {
      gap: 8px;

      :deep(.el-popper.custom-dropdown-info) {
        padding: 7px 0;
      }

      .el-popper.custom-dropdown-info ul li {
        cursor: pointer;
        padding: 7px 20px;
      }

      .el-popper.custom-dropdown-info ul li:hover {
        background-color: $background-li-menu;
        color: $color-menu-item;
      }
    }
  }

  .el-divider--vertical {
    margin: 0 19px;
  }

  :deep(.el-breadcrumb__inner) {
    color: $black-60;

    &.is-link {
      color: $black-80;
      font-weight: 400;
    }
  }

  :deep(svg) {
    &:focus {
      outline: none !important;
    }
  }
}
</style>
