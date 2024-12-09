<template>
  <!-- START MAP -->
  <div class="map">
    <!-- START Title map -->
    <div class="title-map">
      {{ $t("title_map") }}
    </div>
    <!-- END Title imagmap -->
    <!-- START Image map -->
    <img
      id="store__map"
      class="map-image noselect"
      src="../../../../assets/images/japan-map.png"
      usemap="#store__map"
    />
    <!-- END Image map -->
    <!-- START Map handle click -->
    <map name="store__map">
      <area
        shape="poly"
        coords="88,289,2,288,1,163,147,163,148,227"
        data-fancybox=""
        data-src="#map-okinawa"
        alt="沖縄県"
        title="沖縄県"
        @click="() => handleSelectArea(listIsland[8].id, true)"
      />
      <area
        shape="poly"
        coords="218,641,208,578,177,543,130,526,113,473,87,469,24,460,22,639"
        data-fancybox=""
        data-src="#map-kyushu"
        alt="九州地方"
        title="九州地方"
        @click="() => handleSelectArea(listIsland[8].id, false, true)"
      />
      <area
        shape="poly"
        coords="267,576,301,543,244,487,216,487,199,446,171,449,111,476,129,525"
        data-fancybox=""
        data-src="#map-shikoku"
        alt="四国地方"
        title="四国地方"
        @click="() => handleSelectArea(listIsland[7].id)"
      />
      <area
        shape="poly"
        coords="170,453,121,475,23,459,17,358,87,358,160,391"
        data-fancybox=""
        data-src="#map-chugoku"
        alt="中国地方"
        title="中国地方"
        @click="() => handleSelectArea(listIsland[6].id)"
      />
      <area
        shape="poly"
        coords="219,261,227,350,232,369,231,411,242,486,213,484,197,445,171,449,164,392,131,377,128,263"
        data-fancybox=""
        data-src="#map-kinki"
        alt="近畿地方"
        title="近畿地方"
        @click="() => handleSelectArea(listIsland[5].id)"
      />
      <area
        shape="poly"
        coords="292,406,309,387,374,475,354,538,303,543,244,489,231,409,262,411,277,394"
        data-fancybox=""
        data-src="#map-tokai"
        alt="中部東海地方"
        title="中部東海地方"
        @click="() => handleSelectArea(listIsland[4].id)"
      />
      <area
        shape="poly"
        coords="311,388,336,349,378,362,524,362,534,452,530,485,525,503,508,501,487,501,443,501,370,461,335,428"
        data-fancybox=""
        data-src="#map-kanto"
        alt="関東地方"
        title="関東地方"
        @click="() => handleSelectArea(listIsland[2].id)"
      />
      <area
        shape="poly"
        coords="223,317,219,243,233,231,272,235,323,224,333,256,332,351,290,410,278,391,259,409,225,409,233,368"
        data-fancybox=""
        data-src="#map-hokuriku"
        alt="北陸甲信越"
        title="北陸甲信越"
        @click="() => handleSelectArea(listIsland[3].id)"
      />
      <area
        shape="poly"
        coords="332,221,350,197,378,180,455,191,488,223,532,241,537,316,519,334,409,347,382,363,335,348,336,332"
        data-fancybox=""
        data-src="#map-tohoku"
        alt="東北地方"
        title="東北地方"
        @click="() => handleSelectArea(listIsland[1].id)"
      />
      <area
        shape="poly"
        coords="346,17,410,4,443,11,456,35,473,44,533,60,538,136,468,194,381,172,346,194,294,176,291,45"
        data-fancybox=""
        data-src="#map-hokkaido"
        alt="北海道"
        title="北海道"
        @click="() => handleSelectArea(listIsland[0].id)"
      />
    </map>
    <!-- END Map handle click -->
    <!-- START Search GPS -->
    <div class="search-gps">
      <el-button class="btn-search" @click="handleClickSearchGPS">
        <IconSearchCurrentPosition />
        <span class="text">
          {{ $t("search_from_current_location") }}
        </span>
      </el-button>
    </div>
    <!-- END Search GPS -->
  </div>
  <!-- END MAP -->
  <!-- START MODAL SEARCH -->
  <ModalSearchPortal :dialog-visible="dialogVisible">
    <template #body>
      <div v-show="props.showTypeStore" class="body-option">
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
      <el-scrollbar
        v-loading="loadingBlock2"
        style="min-height: 100px"
        max-height="455px"
      >
        <!--      BLOCK 2-->
        <div
          :class="{ 'hidden-label': listConscious.length }"
          class="city-option"
        >
          <el-radio-group
            v-model="formMap.district_id"
            size="large"
            @change="handleChangeBlock2"
          >
            <template v-if="!formMap.district_id">
              <el-radio-button
                v-for="(item, index) in listDistrict"
                :key="index"
                :label="item.id"
                >{{ item.name }}</el-radio-button
              >
            </template>
          </el-radio-group>
        </div>
        <!--              BLOCK 3 -->
        <div
          v-loading="loadingBlock3"
          :class="{
            'hidden-label': !(
              listConscious.length &&
              !formMap.conscious_id &&
              listConscious[0]?.is_village
            ),
          }"
          class="city-option"
        >
          <el-radio-group
            v-model="formMap.conscious_id"
            size="large"
            @change="handleChangeBlock3"
          >
            <template
              v-if="
                listConscious.length &&
                !formMap.conscious_id &&
                listConscious[0]?.is_village
              "
            >
              <el-radio-button
                v-for="(item, index) in listConscious"
                :key="index"
                :label="item.id"
                >{{ item.name }}</el-radio-button
              >
            </template>
          </el-radio-group>
        </div>
        <div
          v-if="
            listConscious.length &&
            formMap.district_id &&
            !listConscious[0]?.is_village
          "
          v-loading="loadingBlock3"
          class="district-option"
        >
          <ul :class="{ active: formMap.conscious_id === ' ' }">
            <li
              @click="
                () => {
                  formMap.conscious_id = ' ';
                }
              "
            >
              {{
                findObj(listDistrict, "id", formMap.district_id).name +
                $t("all")
              }}
            </li>
          </ul>
          <ul
            v-for="(item, index) in listConscious"
            :key="index"
            :class="{ active: formMap.conscious_id === item.id }"
          >
            <li
              @click="
                () => {
                  formMap.conscious_id = item.id;
                }
              "
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <!--      BLOCK 4  -->

        <div
          v-if="listConscious[0]?.is_village && formMap.conscious_id"
          v-loading="loadingBlock4"
          class="district-option"
        >
          <ul :class="{ active: formMap.village_id === ' ' }">
            <li
              @click="
                () => {
                  formMap.village_id = ' ';
                }
              "
            >
              {{
                findObj(listConscious, "id", formMap.conscious_id).name +
                $t("all")
              }}
            </li>
          </ul>
          <ul
            v-for="(item, index) in listVillages"
            :key="index"
            :class="{ active: formMap.village_id === item.id }"
          >
            <li
              @click="
                () => {
                  formMap.village_id = item.id;
                }
              "
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <ButtonDefault
          v-if="formMap.district_id"
          :name="$t('button.back')"
          width="110px"
          :disabled="isLoading"
          @click="handleBack"
        />
        <ButtonDefault
          :name="$t('close')"
          width="110px"
          :disabled="isLoading"
          @click="handleClose"
        />
        <ButtonYellow
          class="btn-confirm"
          :name="$t('button.search')"
          width="110px"
          :loading="isLoading"
          @click="handleConfirm"
        />
      </div>
    </template>
  </ModalSearchPortal>
  <!-- END MODAL SEARCH -->
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  defineAsyncComponent,
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
} from "vue";
import { useRouter, useRoute } from "nuxt/app";
import { useCookie } from "#app";
import { useNuxtApp } from "#imports";

import { i18n } from "~/../../src/shared/plugins/i18n";

import { ImageResize } from "../../../../helpers/imageMapResize";
import { useStoreSearch } from "~/../../src/front/store/store";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

import {
  getPositionSuccess,
  getPositionFailure,
} from "../../../../composables/map";

import { dataTypeStore, SALON } from "~/../../src/shared/constants/category";
import { Permission } from "~/../../src/shared/constants/browser";

import ButtonDefault from "~/../../src/shared/components/button/ButtonDefault.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import { ElMessage } from "element-plus";
import { useMeStore } from "~/../../src/shared/stores/me";
import MapRequest from "~/../../src/shared/requests/MapRequest";
import { findObj } from "~/../../src/shared/utils";

const ModalSearchPortal = defineAsyncComponent(
  () => import("~/../../src/front/components/modal/ModalSearchPortal.vue")
);

const storeSearch = useStoreSearch();
const router = useRouter();
const route = useRoute();

type Props = {
  showTypeStore: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  showTypeStore: true,
});

const isLoading = ref<boolean>(false);
const loadingBlock2 = ref(false);
const loadingBlock3 = ref(false);
const loadingBlock4 = ref(false);
const listDistrict = ref<string[]>([]);
const listConscious = ref([]);
const listVillages = ref([]);
const { $bus } = useNuxtApp();
const { t } = i18n.global;

const dialogVisible = ref<boolean>(false);

const categorySelected = computed(() => {
  return useCookie(persistKeys.MENU).value;
});
const typeStore = ref<number>(Number(categorySelected.value));
const listIsland = ref<string[]>([]);
const permission = ref<PermissionStatus>();
const meStore = useMeStore();

const formMap = ref({
  island_id: null,
  district_id: null,
  conscious_id: null,
  village_id: null,
});

listIsland.value = (await MapRequest.getIslands()).data;

const handleChangeBlock1 = async (
  id: number,
  isOkinawa: boolean,
  isKyushu: boolean
) => {
  try {
    loadingBlock2.value = true;
    if (isOkinawa) {
      listDistrict.value = (await MapRequest.getDistricts(id)).data.splice(
        8,
        1
      );
    } else if (isKyushu) {
      listDistrict.value = (await MapRequest.getDistricts(id)).data.splice(
        0,
        8
      );
    } else {
      listDistrict.value = (await MapRequest.getDistricts(id)).data;
    }
  } catch (e) {
  } finally {
    loadingBlock2.value = false;
  }
};

const handleChangeBlock2 = async (id: number) => {
  try {
    loadingBlock3.value = true;
    formMap.value.conscious_id = null;
    formMap.value.village_id = null;
    listConscious.value = (await MapRequest.getConsciouses(id)).data;
  } catch (e) {
  } finally {
    loadingBlock3.value = false;
  }
};

const handleChangeBlock3 = async (id: number) => {
  try {
    loadingBlock4.value = true;
    formMap.value.village_id = null;
    listVillages.value = (await MapRequest.getVillages(id)).data;
  } catch (e) {
  } finally {
    loadingBlock4.value = false;
  }
};

/**
 * Handle select area in map
 *
 * @param {string} keyword keyword search
 *
 * @return void
 */
const handleSelectArea = async (
  islandId: number,
  isOkinawa?: boolean,
  isKyushu?: boolean
) => {
  handleTypeStore();
  formMap.value.island_id = islandId;
  await handleChangeBlock1(islandId, isOkinawa, isKyushu);
  dialogVisible.value = true;
};

/**
 * Handle click confirm of modal
 */
const handleConfirm = async () => {
  isLoading.value = true;
  useCookie(persistKeys.MENU).value = String(typeStore.value);

  await nextTick(async () => {
    storeSearch.headerSearch.is_map = true;
    storeSearch.headerSearch.district_id = formMap.value.district_id;
    storeSearch.headerSearch.conscious_id = formMap.value.conscious_id;
    storeSearch.headerSearch.island_id = formMap.value.island_id;
    storeSearch.headerSearch.village_id = formMap.value.village_id;
    meStore.setGeolocationPosition({
      latitude: null,
      longitude: null,
    });
    $bus.$emit("searchStore");
    storeSearch.cacheSearch();
    dialogVisible.value = false;

    isLoading.value = false;
    dialogVisible.value = false;

    await router.push({ name: "store" });
  });
};

/**
 * Handle click close of modal
 *
 * @return void
 */
const handleClose = () => {
  formMap.value.district_id = null;
  formMap.value.conscious_id = null;
  formMap.value.island_id = null;
  listVillages.value = [];
  listConscious.value = [];
  listDistrict.value = [];
  dialogVisible.value = false;
};

const handleBack = () => {
  if (formMap.value.conscious_id && listVillages.value.length) {
    //Go back while in Block 4
    listVillages.value = [];
    formMap.value.conscious_id = null;
  } else if (formMap.value.district_id) {
    //Go back while in Block 3
    listConscious.value = [];
    formMap.value.district_id = null;
    formMap.value.conscious_id = null;
  }
};
/**
 * Handle typeStore in modal
 */
const handleTypeStore = () => {
  typeStore.value = Number(categorySelected.value);

  if (!typeStore.value) {
    typeStore.value = SALON;
  }
};

/**
 * Handle search GPS in map
 */
const handleClickSearchGPS = async () => {
  // TODO: Detect for safari || https://www.appsloveworld.com/coding/ios/105/navigator-permissions-query-alternative-for-ios-safari
  if (navigator.geolocation) {
    if (!navigator.userAgent.includes("Mac OS")) {
      permission.value = await navigator.permissions.query({
        name: "geolocation",
      });

      navigator.geolocation.getCurrentPosition(
        getPositionSuccess,
        getPositionFailure
      );
      storeSearch.headerSearch.is_map = true;
      handlePermissionGeoLocation(permission.value);
      permission.value.onchange = () => {
        if (permission.value) {
          handlePermissionGeoLocation(permission.value);
        }
      };
    } else {
      // Handle get GPS on IOS
      handleGPSMacOS();
    }
  } else {
    ElMessage.error(t("errors.geolocation_is_not_supported_by_this_browser"));
    throw new Error("Geolocation is not supported by this browser.");
  }
};
const handleGPSMacOS = () => {
  navigator.geolocation.getCurrentPosition(
    //GET GPS SUCCESS
    (position) => {
      meStore.setGeolocationPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (route.name === "index") {
        useCookie(persistKeys.MENU).value = null;
      }
      nextTick(async () => {
        //Clear data search by map
        storeSearch.headerSearch.is_map = true;
        storeSearch.headerSearch.district_id = null;
        storeSearch.headerSearch.conscious_id = null;
        storeSearch.headerSearch.island_id = null;
        storeSearch.headerSearch.village_id = null;
        $bus.$emit("searchStore");
        await nextTick(async () => {
          if (!useCookie(persistKeys.MENU).value) {
            return;
          }
          await router.push({ name: "store" });
        });
      });
    },
    //GET GPS FAILED
    () => {
      ElMessage.error(t("errors.can_not_get_coordinate"));
      throw new Error("Geolocation permission state is denied");
    }
  );
};
const handlePermissionGeoLocation = async (permission: PermissionStatus) => {
  if (permission.state === Permission.DENIED) {
    ElMessage.error(t("errors.can_not_get_coordinate"));
    throw new Error("Geolocation permission state is denied");
  } else if (permission.state === Permission.PROMPT) {
    throw new Error("Geolocation permission state is prompt");
  } else if (permission.state === Permission.GRANTED) {
    navigator.geolocation.getCurrentPosition(
      getPositionSuccess,
      getPositionFailure
    );
    /*
      COMPLETE: When router in portal site, popup select type store alway display, even though user hover to small image
    */
    if (route.name === "index") {
      useCookie(persistKeys.MENU).value = null;
    }
    nextTick(async () => {
      //Clear data search by map
      storeSearch.headerSearch.is_map = true;
      storeSearch.headerSearch.district_id = null;
      storeSearch.headerSearch.conscious_id = null;
      storeSearch.headerSearch.island_id = null;
      storeSearch.headerSearch.village_id = null;
      $bus.$emit("searchStore");
      nextTick(async () => {
        if (!useCookie(persistKeys.MENU).value) {
          return;
        }
        await router.push({ name: "store" });
      });
    });
  }
};

onMounted(() => {
  new ImageResize({
    width: 540,
    height: 675,
    element: "#store__map",
  });
});

onBeforeUnmount(async () => {
  if (permission.value) {
    permission.value.onchange = () => null;
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";

.map {
  position: relative;

  .title-map {
    top: 0px;
    left: 0px;
    font-weight: 700;
    font-size: 24px;
  }

  .map-image {
    width: 100%;
  }

  area {
    &:hover {
      cursor: pointer;
    }
  }

  .search-gps {
    position: absolute;
    top: 48px;
    left: 0px;
    .el-button {
      width: 200px;
      height: 48px;
      border-radius: 12px;
      padding: 10px;
      background-image: linear-gradient(to bottom right, #15d5ff, #0578ff);
      .text {
        color: white;
        padding: 10px;
      }
    }
  }
}

.modal-dialog {
  :deep(.el-overlay) {
    .el-overlay-dialog {
      padding: 16px;

      .el-dialog {
        width: 650px;

        .body-option {
          padding: 0px 20px 20px 20px;

          .el-radio-group {
            display: flex;
            justify-content: space-around;
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

        .city-option {
          padding: 0px 20px 20px 20px;

          .el-radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            .el-radio-button {
              .el-radio-button__inner {
                border-left: var(--el-border);
                border-radius: var(--el-border-radius-base);
              }
              .el-radio-button__original-radio:checked
                + .el-radio-button__inner {
                border-left: none;
              }
            }
          }
        }

        .district-option {
          color: $black-80;
          margin-left: 20px;
          margin-right: 20px;
          font-weight: 700;

          ul {
            cursor: pointer;
            border-bottom: 1px solid #c1cbdb;
            &:hover {
              background-color: antiquewhite;
            }
            li {
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 40px;
            }
          }

          ul:not(:first-child) {
            li {
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
}

.active {
  background-color: antiquewhite;
}

.hidden-label {
  display: none;
}

@include res("md-and-down", $breakpoints-spec) {
  .map {
    .title-map {
      font-size: 22px;
    }
    .search-gps {
      top: 44px;
      .el-button {
        width: 110px;
        height: 36px;

        .text {
          display: block;
          width: 76px;
          word-wrap: break-word;
          white-space: break-spaces;
          font-size: 10px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .map {
    .search-gps {
      .el-button {
        width: 160px;
        height: 36px;

        .text {
          display: initial;
          width: initial;
          word-wrap: inherit;
          white-space: inherit;
          font-size: 12px;
        }
      }
    }
  }

  .modal-dialog {
    :deep(.el-overlay) {
      .el-overlay-dialog {
        .el-dialog {
          .body-option {
            .el-radio-group {
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
  :deep(.el-button) {
    width: 64px;
  }
}
</style>
