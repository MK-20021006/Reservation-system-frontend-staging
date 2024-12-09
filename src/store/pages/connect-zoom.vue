<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("store.zoom_linkage_settings") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("store.zoom_linkage_settings") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div class="connect-zoom-container">
        <div class="connect-zoom-content">
          <div class="title-item">
            <div class="left">
              <icon-camera />
              <span class="pl-10">{{ $t("store.zoom_cooperation") }}</span>
            </div>
            <div class="right">
              <div
                class="text-link text-underline cursor-pointer"
                @click="redirectLinkZoom"
              >
                {{ $t("store.zoom_official_site") }}
              </div>
              <template v-if="isStatusConnect">
                <div class="status-color linked"></div>
                <div class="status">{{ $t("store.cooperating") }}</div>
                <button-common
                  color="white"
                  :name="'store.disconnect'"
                  :height="'32px'"
                  :background-color="'#C03522'"
                  @click="showModalDelete"
                ></button-common>
              </template>
              <template v-else>
                <div class="status-color not-linked"></div>
                <div class="status">{{ $t("store.not_linked") }}</div>
                <button-common
                  color="white"
                  :name="'button.connect'"
                  :height="'32px'"
                  :background-color="'#0071BC'"
                  @click="connectZoom"
                ></button-common>
              </template>
            </div>
          </div>
        </div>
        <ModalConfirm
          :loading="loading"
          :dialog-visible="dialogVisible"
          :title="$t('title_delete_line')"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          @handle-close="handleClose"
          @handle-confirm="disconnectZoom"
        />
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconCamera from "~/../../src/store/components/Icon/IconCamera.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import { useMeStore } from "~~/../../src/shared/stores/me";
import { useRoute, useRuntimeConfig } from "nuxt/app";
import { onMounted } from "#imports";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { EVENT } from "~/../../src/shared/constants/category";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import useSettingZoom from "~/../../src/store/composables/useSettingZoom";

useSettingZoom();
useHasTypeStore([EVENT]);

const isStatusConnect = ref(false);
const loading = ref(false);
const dialogVisible = ref(false);
const meStore = useMeStore();
const config = useRuntimeConfig();
const route = useRoute();

const showModalDelete = () => {
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const connectZoom = () => {
  window.location.href = `${config.apiUrl}/stores/zoom-redirect?store_id=${meStore.getStoreId}`;
};

const disconnectZoom = async () => {
  try {
    loading.value = true;
    const data = await StoreRequest.removeConnectZoom();
    deleteSuccess();
    isStatusConnect.value = false;
  } catch (error) {
    deleteError();
  } finally {
    dialogVisible.value = false;
    loading.value = false;
  }
};

const checkStatusConnectZoom = async () => {
  const data = (await StoreRequest.checkStatusConnectZoom()).data;
  if (data) {
    isStatusConnect.value = true;
  }
};

onMounted(() => {
  checkStatusConnectZoom();
});

const redirectLinkZoom = () => {
  window.open("https://explore.zoom.us/ja/products/meetings/", "_blank");
};
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.content) {
  padding: 0;
}

.connect-zoom-container {
  .connect-zoom-content {
    border-bottom: 1px solid $gray-400;
    padding: 8px 20px;

    .title-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;
        font-size: 16px;
      }

      .right {
        display: flex;
        align-items: center;

        .text-link {
          margin-right: 24px;
        }

        .status-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.linked {
            background-color: $green-100;
          }

          &.not-linked {
            background-color: $black-40;
          }
        }

        .status {
          padding-left: 8px;
          padding-right: 24px;
        }
      }
    }
  }
}
</style>
