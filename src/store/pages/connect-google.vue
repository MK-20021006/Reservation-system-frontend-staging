<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("store.google_linkage_settings") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("store.google_linkage_settings") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div class="connect-google-container">
        <div class="connect-google-content">
          <div class="title-item">
            <div class="left">
              <icon-google-map />
              <span class="pl-10">{{ $t("store.google_linkage") }}</span>
            </div>
            <div class="right">
              <template v-if="isStatusConnect">
                <div class="status-color linked"></div>
                <div v-if="statusSettingGoogle" class="status">
                  {{ $t("store.cooperating") }}
                </div>
                <div v-else class="status">{{ $t("in_application") }}</div>
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
                  :loading="loading"
                  :name="'button.connect'"
                  :height="'32px'"
                  :background-color="'#0071BC'"
                  @click="connectGoogle"
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
          @handle-confirm="disconnectGoogle"
        />
      </div>
      <div class="text-description">
        <div>
          {{ $t("store_google_map") }}
        </div>
        <div
          class="text-link text-underline cursor-pointer"
          @click="openSiteGoogle"
        >
          {{ URL_GOOGLE_SETTING }}
        </div>
        <div>
          {{ $t("update_store_entered") }}
        </div>
        <div>
          {{ $t("update_store_entered_google") }}
        </div>
        <div v-if="isShowMessage" class="store-setting">
          <template v-if="errorStoreInformation">
            <div>{{ $t("setting_store_submit_google") }}</div>
            <div class="text-link text-underline cursor-pointer">
              <a href="/store/basic" target="_blank">{{ urlLink }}</a>
            </div>
            <ul>
              <li v-if="!meStore?.info?.store?.postal_code">
                {{ $t("postal_code") }}
              </li>
              <li
                v-if="
                  !meStore?.info?.store?.address ||
                  !meStore?.info?.store?.address_detail
                "
              >
                {{ $t("address") }}
              </li>
              <li
                v-if="
                  !meStore?.info?.store?.latitude ||
                  !meStore?.info?.store?.longitude
                "
              >
                {{ $t("store_location") }}
              </li>
              <li v-if="!meStore?.info?.store?.island_id">
                {{ $t("block") + 1 }}
              </li>
              <li v-if="!meStore?.info?.store?.home_page">
                {{ $t("home_page") }}
              </li>
            </ul>
          </template>
          <template v-if="!meStore?.info?.store?.has_seat_public">
            <div>
              {{ $t("is_not_seat_public") }}
            </div>
            <div class="text-link text-underline cursor-pointer">
              <a href="/store/seat" target="_blank">{{ urlLinkSeat }}</a>
            </div>
          </template>
          <template
            v-if="
              meStore?.info?.store?.id_course_public_not_stay_time?.length > 0
            "
          >
            <div>
              {{ $t("course_public_not_stay_time") }}
            </div>
            <div class="text-link text-underline cursor-pointer course-link">
              <div
                v-for="item in meStore.info.store
                  .id_course_public_not_stay_time"
                :key="item"
              >
                <a :href="`/store/course/edit/${item}`" target="_blank">{{
                  item
                }}</a>
              </div>
            </div>
          </template>
        </div>
        <div v-if="isStatusConnect && !statusSettingGoogle" class="text-red">
          {{ $t("approve_google") }}
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import {
  deleteError,
  deleteSuccess,
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { useMeStore } from "~~/../../src/shared/stores/me";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  SALON,
  CLASSROOM,
  CONSULTATION,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import {
  STATUS_SETTING_GOOGLE,
  URL_GOOGLE_SETTING,
} from "~/../../src/shared/constants";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { StoreInterface } from "~/../../src/store/models";
import { useRouter } from "nuxt/app";

useHasTypeStore([RESTAURANT]);

const meStore = useMeStore();

const loading = ref(false);
const dialogVisible = ref(false);
const isShowMessage = ref(false);
const router = useRouter();

const isStatusConnect = ref<boolean>(meStore.isSettingGoogle);
const urlLink = ref();
const urlLinkSeat = ref();

const statusSettingGoogle = computed(() => {
  return (
    meStore?.info?.store?.status_setting_google === STATUS_SETTING_GOOGLE.TRUE
  );
});
const showModalDelete = () => {
  dialogVisible.value = true;
};

const errorStoreInformation = computed(() => {
  return (
    !meStore?.info?.store?.postal_code ||
    !meStore?.info?.store?.address ||
    !meStore?.info?.store?.address_detail ||
    !meStore?.info?.store?.latitude ||
    !meStore?.info?.store?.longitude ||
    !meStore?.info?.store?.island_id ||
    !meStore?.info?.store?.home_page
  );
});

const handleClose = () => {
  dialogVisible.value = false;
};

const connectGoogle = async () => {
  try {
    loading.value = true;
    const data = await StoreRequest.updateSettingGoogle<StoreInterface>();
    meStore.updateIsSettingGoogle(data.data?.is_setting_google);
    meStore.updateStatusSettingGoogle(data.data?.status_setting_google);
    isStatusConnect.value = true;
    isShowMessage.value = false;
    messageSuccess("success.connect_google");
  } catch (error: any) {
    if (error.response.status === STATUS_CODE.BAD_REQUEST) {
      await meStore.fetchUpdate();
      isShowMessage.value = true;
      messageError(error.response?._data.message);
    } else {
      messageError("errors.connect_external");
    }
  } finally {
    dialogVisible.value = false;
    loading.value = false;
  }
};

const disconnectGoogle = async () => {
  try {
    loading.value = true;
    const data = await StoreRequest.updateSettingGoogle<StoreInterface>();
    isStatusConnect.value = false;
    meStore.updateIsSettingGoogle(data.data?.is_setting_google);
    meStore.updateStatusSettingGoogle(data.data?.status_setting_google);
    deleteSuccess();
  } catch (e: any) {
    deleteError();
  } finally {
    dialogVisible.value = false;
    loading.value = false;
  }
};

const openSiteGoogle = () => {
  window.open(URL_GOOGLE_SETTING, "_blank");
};

onMounted(() => {
  urlLink.value = `${window.location.host}/store/basic`;
  urlLinkSeat.value = `${window.location.host}/store/seat`;
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.content) {
  padding: 0;
}

.connect-google-container {
  .connect-google-content {
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

        svg {
          width: 24px;
          height: 24px;
        }
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

.text-description {
  padding: 20px;
  font-size: 14px;
  line-height: 25px;
  white-space: pre-line;

  .store-setting {
    font-weight: bold;

    ul {
      padding-left: 40px;
      list-style: square;
    }
  }

  .text-link {
    width: fit-content;
  }

  .text-red {
    color: $red-color-icon;
  }

  .course-link {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
