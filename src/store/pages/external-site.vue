<template>
  <div class="external-site-container">
    <Head>
      <Title
        >{{ $t("site_name_title")
        }}{{ $t("store.external_site_linkage_setting") }}</Title
      >
    </Head>
    <div v-loading="loadingList" class="external-content">
      <el-collapse v-model="activeNames" @change="handleChange">
        <!-- Googleカレンダー連携 -->
        <!--        <el-collapse-item name="6">-->
        <!--          <template #title>-->
        <!--            <div class="title-item">-->
        <!--              <div class="left">-->
        <!--                <icon-google />-->
        <!--                <span class="pl-10">{{-->
        <!--                  $t("store.google_calendar_linkage")-->
        <!--                }}</span>-->
        <!--              </div>-->
        <!--              <div class="right">-->
        <!--                <template v-if="connectExternalSite.connectGoogle">-->
        <!--                  <div class="status-color linked"></div>-->
        <!--                  <div class="status status-linked">-->
        <!--                    {{ $t("store.cooperating") }}-->
        <!--                  </div>-->
        <!--                  <button-common-->
        <!--                    :name="'store.disconnect'"-->
        <!--                    :height="'32px'"-->
        <!--                    :background-color="'#C03522'"-->
        <!--                    color="white"-->
        <!--                    @click="showModalDelete(BOOKING_SOURCE_GOOGLE, '6')"-->
        <!--                  />-->
        <!--                </template>-->
        <!--                <template v-else>-->
        <!--                  <div class="status-color not-linked"></div>-->
        <!--                  <div class="status">{{ $t("store.not_linked") }}</div>-->
        <!--                </template>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--          <connect-google-->
        <!--            :data="dataGoogle"-->
        <!--            :connect-google="connect_line"-->
        <!--            @update-google="getGoogle"-->
        <!--          />-->
        <!--        </el-collapse-item>-->
        <!-- LINE -->
        <el-collapse-item v-if="meStore.isSettingLine" name="1">
          <template #title>
            <div class="title-item">
              <div class="left">
                <icon-line />
                <span class="pl-10">{{ $t("store.LINE_linkage") }}</span>
              </div>
              <div class="right">
                <template v-if="connect_line">
                  <div class="status-color linked"></div>
                  <div class="status status-linked">
                    {{ $t("store.cooperating") }}
                  </div>
                  <button-common
                    color="white"
                    :name="'store.disconnect'"
                    :height="'32px'"
                    :background-color="'#C03522'"
                    @click="showModalDelete(BOOKING_SOURCE_LINE, '1')"
                  />
                </template>
                <template v-else>
                  <div class="status-color not-linked"></div>
                  <div class="status not-link-title">
                    {{ $t("store.not_linked") }}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <connect-line
            :data="dataLine"
            :connect-line="connect_line"
            @update-line="getLine"
          />
        </el-collapse-item>

        <!-- 食べログ連携 -->
        <el-collapse-item
          v-if="
            meStore.getTypeStore === RESTAURANT && meStore.isSettingExternalSite
          "
          name="2"
        >
          <template #title>
            <div class="title-item">
              <div class="left">
                <icon-tabelog />
                <span class="pl-10">{{ $t("store.tabelog_linkage") }}</span>
              </div>
              <div class="right">
                <template v-if="connectExternalSite.connectTabelog">
                  <div class="status-color linked"></div>
                  <div class="status status-linked">
                    {{ $t("store.cooperating") }}
                  </div>
                  <button-common
                    :name="'store.disconnect'"
                    :height="'32px'"
                    :background-color="'#C03522'"
                    color="white"
                    @click="showModalDelete(BOOKING_SOURCE_EATING, '2')"
                  />
                </template>
                <template v-else>
                  <div class="status-color not-linked"></div>
                  <div class="status not-link-title">
                    {{ $t("store.not_linked") }}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <connect-tabelog :data="dataTabelog" @update-tabelog="getTabelog" />
        </el-collapse-item>

        <!--Hotpepper Beauty -->
        <el-collapse-item
          v-if="meStore.getTypeStore === SALON && meStore.isSettingExternalSite"
          name="3"
        >
          <template #title>
            <div class="title-item">
              <div class="left">
                <img src="../assets/image/hotpepper.png" alt="" />
                <span class="pl-10">{{ $t("store.hot_pepper_beauty") }}</span>
              </div>
              <div class="right">
                <template v-if="connectExternalSite.connectHotPepperBeauty">
                  <div class="status-color linked"></div>
                  <div class="status status-linked">
                    {{ $t("store.cooperating") }}
                  </div>
                  <button-common
                    :name="'store.disconnect'"
                    :height="'32px'"
                    :background-color="'#C03522'"
                    color="white"
                    @click="
                      showModalDelete(BOOKING_SOURCE_HOTPEPPER_BEAUTY, '3')
                    "
                  />
                </template>
                <template v-else>
                  <div class="status-color not-linked"></div>
                  <div class="status not-link-title">
                    {{ $t("store.not_linked") }}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <connect-hot-pepper-beauty
            :data="dataHotPepperBeauty"
            @update-hopper-beauty="getHotPepperBeauty"
          />
        </el-collapse-item>

        <!--Hotpepper グルメ-->
        <el-collapse-item
          v-if="
            meStore.getTypeStore === RESTAURANT && meStore.isSettingExternalSite
          "
          name="4"
        >
          <template #title>
            <div class="title-item">
              <div class="left">
                <img src="../assets/image/hotpepper_gurume.png" />
                <span class="pl-10">{{ $t("store.hot_pepper_gourmet") }}</span>
              </div>
              <div class="right">
                <template v-if="connectExternalSite.connectHotPepper">
                  <div class="status-color linked"></div>
                  <div class="status status-linked">
                    {{ $t("store.cooperating") }}
                  </div>
                  <button-common
                    :name="'store.disconnect'"
                    :height="'32px'"
                    :background-color="'#C03522'"
                    color="white"
                    @click="showModalDelete(BOOKING_SOURCE_HOTPEPPER, '4')"
                  />
                </template>
                <template v-else>
                  <div class="status-color not-linked"></div>
                  <div class="status not-link-title">
                    {{ $t("store.not_linked") }}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <connect-hot-pepper-gurume
            :data="dataHotPepper"
            @update-hot-pepper="getHotPepper"
          />
        </el-collapse-item>

        <!-- ぐるなび -->
        <el-collapse-item
          v-if="
            meStore.getTypeStore === RESTAURANT && meStore.isSettingExternalSite
          "
          name="5"
        >
          <template #title>
            <div class="title-item">
              <div class="left">
                <icon-gurunavi />
                <span class="pl-10">{{ $t("store.gurunavi") }}</span>
              </div>
              <div class="right">
                <template v-if="connectExternalSite.connectGurunavi">
                  <div class="status-color linked"></div>
                  <div class="status status-linked">
                    {{ $t("store.cooperating") }}
                  </div>
                  <button-common
                    :name="'store.disconnect'"
                    :height="'32px'"
                    :background-color="'#C03522'"
                    color="white"
                    @click="showModalDelete(BOOKING_SOURCE_GURUNAVI, '5')"
                  />
                </template>
                <template v-else>
                  <div class="status-color not-linked"></div>
                  <div class="status not-link-title">
                    {{ $t("store.not_linked") }}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <connect-gurunavi
            :data="dataGurunani"
            @update-gurunavi="getGruvani"
          />
        </el-collapse-item>
      </el-collapse>
      <ModalConfirm
        :loading="loading"
        :dialog-visible="dialogVisible"
        :title="$t('title_delete_line')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        @handle-close="handleClose"
        @handle-confirm="disconnectExternal"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ConnectLine from "~/../../src/store/components/external-site/ConnectLine.vue";
import ConnectGoogle from "~/../../src/store/components/external-site/ConnectGoogle.vue";
import { ref, onBeforeMount } from "vue";
import IconLine from "~/../../src/store/components/Icon/IconLine.vue";
import ConnectTabelog from "~/../../src/store/components/external-site/ConnectTabelog.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ConnectHotPepperBeauty from "~/../../src/store/components/external-site/ConnectHotPepperBeauty.vue";
import ConnectGurunavi from "~/../../src/store/components/external-site/ConnectGurunavi.vue";
import ConnectHotPepperGurume from "~/../../src/store/components/external-site/ConnectHotPepperGurume.vue";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import ModalConfirm from "../components/modal/Confirm.vue";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import {
  BOOKING_SOURCE_GOOGLE,
  BOOKING_SOURCE_EATING,
  BOOKING_SOURCE_GURUNAVI,
  BOOKING_SOURCE_HOTPEPPER,
  BOOKING_SOURCE_LINE,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_HOTPEPPER_BEAUTY,
} from "~/../../src/shared/constants/booking";
import { useMeStore } from "~/../../src/shared/stores/me";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";
import useSettingSite from "~/../../src/store/composables/useSettingSite";
import { STATUS_CONNECT } from "~/../../src/shared/constants/status";

useSettingSite();
const activeNames = ref(["1"]);
const dialogVisible = ref(false);
const typeExternal = ref<number>(0);
const typeOpen = ref("");
const meStore = useMeStore();
const dataLine = ref(null);
const dataHotPepper = ref(null);
const dataHotPepperBeauty = ref(null);
const dataGoogle = ref(null);
const dataGurunani = ref(null);
const dataTabelog = ref(null);

const connect_line = ref(false);

const connectExternalSite = ref({
  connectHotPepperBeauty: false,
  connectHotPepper: false,
  connectGoogle: false,
  connectTabelog: false,
  connectGurunavi: false,
});
const loading = ref(false);
const loadingList = ref(false);

const handleChange = (val: string[]) => {
  if (typeOpen.value) {
    activeNames.value = [...activeNames.value, typeOpen.value];
    typeOpen.value = "";
  }
};

const showModalDelete = (type: number, name: string) => {
  dialogVisible.value = true;
  typeExternal.value = type;
  if (activeNames.value.includes(name)) {
    typeOpen.value = name;
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  typeExternal.value = 0;
};

const disconnectExternal = async () => {
  try {
    loading.value = true;
    if (typeExternal.value === BOOKING_SOURCE_LINE) {
      await storeSettingRequest.deleteLineSetting();
      dataLine.value = null;
      connect_line.value = false;
    } else if (typeExternal.value === BOOKING_SOURCE_HOTPEPPER) {
      await storeSettingRequest.deleteHotPepperSetting();
      dataHotPepper.value = null;
      connectExternalSite.value.connectHotPepper = false;
    } else if (typeExternal.value === BOOKING_SOURCE_HOTPEPPER_BEAUTY) {
      await storeSettingRequest.deleteHotPepperBeautySetting();
      dataHotPepperBeauty.value = null;
      connectExternalSite.value.connectHotPepperBeauty = false;
    } else if (typeExternal.value === BOOKING_SOURCE_GURUNAVI) {
      await storeSettingRequest.deleteGurunaviSetting();
      dataGurunani.value = null;
      connectExternalSite.value.connectGurunavi = false;
    } else if (typeExternal.value === BOOKING_SOURCE_EATING) {
      await storeSettingRequest.deleteTabelogSetting();
      dataTabelog.value = null;
      connectExternalSite.value.connectTabelog = false;
    }
    // else if (typeExternal.value === BOOKING_SOURCE_GOOGLE) {
    //   await storeSettingRequest.deleteGoogleSetting();
    //   dataGoogle.value = null;
    //   connectExternalSite.connectGoogle = false;
    // }
    deleteSuccess();
  } catch (error) {
    deleteError();
  } finally {
    dialogVisible.value = false;
    loading.value = false;
    typeExternal.value = 0;
  }
};

const getLine = async (key?: boolean) => {
  try {
    loadingList.value = true;
    const response = await storeSettingRequest.getLineSetting(key);
    dataLine.value = response?.data;
    connect_line.value = !!response?.data;
  } catch (error) {
  } finally {
    loadingList.value = false;
  }
};

const getHotPepper = async () => {
  try {
    const response = await storeSettingRequest.getHotPepperSetting();
    dataHotPepper.value = response?.data;

    if (response?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
      connectExternalSite.value.connectHotPepper = true;
    } else {
      connectExternalSite.value.connectHotPepper = false;
    }
  } catch (_) {
  } finally {
  }
};

const getHotPepperBeauty = async () => {
  try {
    const response = await storeSettingRequest.getHotPepperBeautySetting();
    if (response?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
      dataHotPepperBeauty.value = response?.data;
      connectExternalSite.value.connectHotPepperBeauty = true;
    } else {
      connectExternalSite.value.connectHotPepperBeauty = false;
    }
  } catch (_) {
  } finally {
  }
};

const getGoogle = async () => {
  try {
    const response = await storeSettingRequest.getGoogleSetting();
    dataGoogle.value = response?.data;
    connectExternalSite.value.connectGoogle = !!response?.data;
  } catch (_) {
  } finally {
  }
};

const getGruvani = async () => {
  try {
    const response = await storeSettingRequest.getGurunaviSetting();
    dataGurunani.value = response?.data;

    if (response?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
      connectExternalSite.value.connectGurunavi = true;
    } else {
      connectExternalSite.value.connectGurunavi = false;
    }
  } catch (_) {
  } finally {
  }
};

const getTabelog = async () => {
  try {
    const response = await storeSettingRequest.getTabelogSetting();
    dataTabelog.value = response?.data;

    if (response?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
      connectExternalSite.value.connectTabelog = true;
    } else {
      connectExternalSite.value.connectTabelog = false;
    }
  } catch (_) {
  } finally {
  }
};

onBeforeMount(() => {
  if (meStore.isSettingLine) {
    getLine();
  }
  // getGoogle();
  if (meStore.getTypeStore === SALON && meStore.isSettingExternalSite) {
    getHotPepperBeauty();
  } else if (
    meStore.getTypeStore === RESTAURANT &&
    meStore.isSettingExternalSite
  ) {
    getHotPepper();
    getTabelog();
    getGruvani();
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.external-site-container {
  padding-bottom: 40px;

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item {
      margin-bottom: 20px;
      box-shadow: 0px 2px 4px $black-5;
      border-radius: 4px;

      .el-collapse-item__header {
        padding: 20px 12px;
      }

      &.google-calendar {
        .el-collapse-item__content {
          display: none;
        }

        .el-collapse-item__arrow {
          display: none;
        }
      }
    }
  }

  :deep(.data-form) {
    width: 38%;
    min-width: 560px;

    .connected-status,
    .option-connect {
      align-items: center;
      margin-bottom: 20px;

      .label-text {
        padding-top: 0;
      }
    }
  }

  :deep(.confirmation-status) {
    display: flex;
    align-items: center;

    .status {
      padding-left: 8px;
    }
  }

  .title-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 97%;

    .left {
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .right {
      display: flex;
      align-items: center;

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

      .status-linked {
        padding-right: 24px;
      }

      .status {
        padding-left: 8px;

        &.not-link-title {
          padding-right: 0;
        }
      }
    }
  }
}

:deep(.text-note) {
  margin-top: -10px;
  margin-bottom: 15px;
  margin-left: 160px;
  color: $red-color-icon;
  white-space: nowrap;
}

:deep(.text-red) {
  color: $red-color-icon;
}

:deep(.mail-forward) {
  font-size: 14px;
  color: $black-80;
  margin-bottom: 30px;

  .text-highlight {
    font-weight: 700;
  }

  .option-connect {
    white-space: nowrap;
    margin-bottom: 0 !important;
  }

  .text-note-check-mail {
    width: 690px;
    margin-bottom: 24px;
  }
}
</style>
