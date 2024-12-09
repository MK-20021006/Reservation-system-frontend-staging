<template>
  <HeaderPcComponent
    ref="_refPC"
    class="hidden-md-and-down"
    :class="{ 'hide-header': isHomePage }"
  />
  <HeaderMobileComponent
    ref="_refMB"
    class="hidden-lg-and-up"
    :class="{ 'hide-header': isHomePage }"
    :count-notice="_refPC?._refNotice?.countNoticeListNews"
  />
  <ModalSearchPortal :dialog-visible="dialogVisible">
    <template #body>
      <div class="body-option" :class="{ 'is-disable-click': isDisabled }">
        <el-radio-group v-model="typeStore">
          <el-radio
            v-for="item in dataTypeStore"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer" :class="{ 'is-disable-click': isDisabled }">
        <ButtonDefault :name="$t('close')" width="110px" @click="handleClose" />
        <ButtonYellow
          class="btn-confirm"
          :name="$t('button.search')"
          width="110px"
          @click="handleConfirm"
        />
      </span>
    </template>
  </ModalSearchPortal>
</template>

<script lang="ts" setup>
import { useDeviceStore } from "../store/device";
import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  nextTick,
} from "vue";
import { useCookie, useRoute } from "#imports";
import { useRouter } from "nuxt/app";
import moment from "moment";
import { useNuxtApp } from "#imports";

import HeaderPcComponent from "~/../../src/front/components/HeaderPcComponent.vue";
import HeaderMobileComponent from "~/../../src/front/components/HeaderMobileComponent.vue";
import { BreakPointDevice, DevicesEnum } from "~/../../src/shared/constants";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import ButtonDefault from "~/../../src/shared/components/button/ButtonDefault.vue";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import {
  dataTypeStore,
  RESTAURANT,
  SALON,
} from "~/../../src/shared/constants/category";

import { useStoreSearch } from "../store/store";
import { FilterStore } from "../models";
import { getCurrentTimeBooking } from "../../shared/utils";

const ModalSearchPortal = defineAsyncComponent(
  () => import("~/../../src/front/components/modal/ModalSearchPortal.vue")
);
const _refPC = ref(null);
const _refMB = ref(null);
const deviceTable = useDeviceStore();
const isMobile = () => {
  const { body } = document;
  const rect = body.getBoundingClientRect();
  deviceTable.breakPoint = rect.width;
  deviceTable.device = DevicesEnum.DESKTOP_DEVICE;
  deviceTable.device =
    rect.width < BreakPointDevice.MD && DevicesEnum.IPAD_MINI;
  const isMobile = rect.width < BreakPointDevice.SM;
  deviceTable.device =
    isMobile && DevicesEnum.MOBILE_DEVICE
      ? DevicesEnum.MOBILE_DEVICE
      : DevicesEnum.DESKTOP_DEVICE;
};

const setHeightMenu = () => {
  if (_refPC.value && _refPC.value.$el.clientHeight) {
    deviceTable.heightMenu = _refPC.value.getHeightMenu();
  } else if (_refMB.value && _refMB.value.$el.clientHeight) {
    deviceTable.heightMenu = _refMB.value.$el.clientHeight;
  }
};

const { $bus } = useNuxtApp();
const router = useRouter();

const storeSearch = useStoreSearch();
const route = useRoute();
const isDisabled = ref(false);
const dialogVisible = ref<boolean>(false);
const typeStore = ref<number>(Number(useCookie(persistKeys.MENU).value));
const isHomePage = ref(route.query.is_homepage);

const handleClose = () => {
  typeStore.value = SALON;
  dialogVisible.value = false;
};

/**
 * Handle click confirm of modal
 */
const handleConfirm = () => {
  useCookie(persistKeys.MENU).value = String(typeStore.value);

  nextTick(() => {
    $bus.$emit("searchStore");
    storeSearch.cacheSearch();
    dialogVisible.value = false;
    router.push({ name: "store" });
  });
};

onBeforeMount(() => {
  if (isNaN(typeStore.value) || typeStore.value == 0) {
    typeStore.value = SALON;
  }

  isMobile();
  window.addEventListener("resize", () => {
    isMobile();
    setHeightMenu();
  });
});

const setStoreSearchHeader = () => {
  storeSearch.headerSearch.keyword_date = moment().format("YYYY-MM-DD");
  storeSearch.headerSearch.keyword_time = getCurrentTimeBooking();
  storeSearch.salon.keyword_date = moment().format("YYYY-MM-DD");
  storeSearch.salon.keyword_time = getCurrentTimeBooking();
  storeSearch.restaurant.keyword_date = moment().format("YYYY-MM-DD");
  storeSearch.restaurant.keyword_time = getCurrentTimeBooking();
};

onMounted(() => {
  setHeightMenu();
  setStoreSearchHeader();
});

/**
 * Set state of store search
 *
 * @param object val
 */
$bus.$on("searchStore", (val?: any) => {
  if (!useCookie(persistKeys.MENU).value) {
    dialogVisible.value = true;
    return;
  }

  if (val) {
    if (val.transportation) {
      storeSearch.headerSearch.transportation = val.transportation;
    }

    if (val.keyword_name) {
      storeSearch.headerSearch.keyword_name = val.keyword_name;
    } else {
      storeSearch.headerSearch.keyword_name = "";
    }

    if (val.keyword_date) {
      storeSearch.headerSearch.keyword_date = val.keyword_date;
    }

    if (val.keyword_time) {
      storeSearch.headerSearch.keyword_time = val.keyword_time;
    }
  }

  storeSearch.cacheSearch();
});

if (route.query?.is_preview) {
  isDisabled.value = true;
}

onBeforeUnmount(() => {
  $bus.$off("searchStore");

  window.removeEventListener("resize", () => {
    isMobile();
    setHeightMenu();
  });
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";
.modal-dialog {
  :deep(.el-overlay) {
    .el-overlay-dialog {
      padding: 16px;

      .body-option {
        padding: 0 20px;

        .el-radio-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .el-radio__input {
            .el-radio__inner {
              width: 18px;
              height: 18px;

              &:after {
                background-color: #0052d9;
                height: 9px;
                width: 9px;
              }
            }
          }
        }
      }
    }
  }
}

.is-disable-click {
  pointer-events: none;
}

.hide-header {
  display: none;
}

@include res("xs-only", $breakpoints-spec) {
  .modal-dialog {
    :deep(.el-overlay) {
      .el-overlay-dialog {
        .el-dialog {
          width: 100%;

          .body-option {
            .el-radio-group {
              justify-content: flex-start;
            }
          }
        }
      }
    }
  }
}
</style>
