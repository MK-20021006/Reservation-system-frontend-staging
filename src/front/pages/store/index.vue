<template>
  <div class="list">
    <Head>
      <Title>
        {{ $t("site_name_title") }}{{ $t(getNameBookMark(menu)) }}｜
        {{ $t("front.list_store") }}
      </Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span :key="1">
          <StoreBreadCrum
            v-if="device === DevicesEnum.DESKTOP_DEVICE"
            :data-title="dataTitle"
          />
          <StoreBreadCrumMb
            v-if="device === DevicesEnum.MOBILE_DEVICE && valueMobile === 1"
            :title-close="$t('close')"
            :title="$t('front.list_store')"
            :is-icon="true"
            @handle-click-filter="handleClickFilter"
            @handle-close="handleBack"
          >
            <template #icon>
              <IconLeft />
            </template>
          </StoreBreadCrumMb>
          <StoreBreadCrumMb
            v-if="device === DevicesEnum.MOBILE_DEVICE && valueMobile === 2"
            :title-close="$t('close')"
            :title="$t('front.store_genre')"
            :is-icon="false"
            :is-search="true"
            @handle-close="handleCloseSearch"
          >
            <template #icon>
              <IconLeft />
            </template>
            <template #show-icon>
              <div></div>
            </template>
            <template #filter-value>
              <StoreSelectSearch
                :is-show="false"
                :form-search="form"
                @handle-click="handleSubmit"
              />
            </template>
          </StoreBreadCrumMb>
        </span>
      </Teleport>
    </ClientOnly>
    <!-- START Ads A2 -->
    <A2 :position="[positionData.A2]" />
    <!-- END Ads A2 -->
    <div id="store" v-loading="loadingSearch">
      <!-- START List Store -->
      <div class="list-store">
        <div v-for="item in data" :key="item.id" class="store-info">
          <div class="list-store__wrap">
            <div class="list-store__body">
              <div class="header-mobile">
                <div class="list-store-name">
                  <div class="list-store-name_wrap">
                    <Router-link
                      class="list-store-name__wrap-text_mobile"
                      :to="'store/' + item.code"
                    >
                      {{ item.name }}
                    </Router-link>
                  </div>
                  <div class="list-store-name_area">
                    {{ item.transportation }}
                  </div>
                </div>
              </div>
              <div v-if="!isCompleted" class="list-store__photo">
                <StoreSliderImage :id="item.code" :data="item.image" />
              </div>
              <div class="list-store__content">
                <StoreContentComponent :data="item" />
                <ButtonRed
                  :name="$t('button.add_store')"
                  class="custom-btn"
                  @click="handleBooking(item)"
                />
              </div>
            </div>
          </div>
          <div class="list-date">
            <StoreCalendarComponent
              v-if="
                GROUP_TYPE_STORE.SAME.includes(item?.model_has_type?.type_id) ||
                GROUP_TYPE_STORE.RESTAURANT.includes(
                  item?.model_has_type?.type_id
                )
              "
              :data="item.date"
              @handle-click="handleBookingContent($event, item)"
            />
          </div>
        </div>
        <div v-if="total !== 0 && total > pageSize" class="list-pagination">
          <InputPagination
            v-model="page"
            :total="total"
            :page-size="pageSize"
            :pager-count="pagerCount"
            @current-change="handleCurrentChange"
          />
        </div>
        <div v-if="total === 0" class="no-result-search">{{ noData }}</div>
        <!-- START Ads A3 and A4 -->
        <div class="external-ads-area">
          <A3 :position="[positionData.A3]" />
          <A3 :position="[positionData.A4]" />
        </div>
        <!-- END Ads A3 and A4 -->
      </div>
      <!-- END List Store -->
      <!-- START Store search -->
      <div class="store-search">
        <client-only>
          <StoreSelectSearch :form-search="form" @handle-click="handleSubmit" />
        </client-only>
      </div>
      <!-- END Store search -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  onBeforeMount,
  nextTick,
} from "vue";
import { useCookie, useRoute, useRouter, useNuxtApp } from "nuxt/app";
import moment from "moment";

import { useDeviceStore } from "../../store/device";
import { i18n } from "~/../../src/shared/plugins/i18n";

import { persistKeys } from "~/../../src/shared/constants/persist-key";
import typeStoreCategory, {
  RESTAURANT,
  SALON,
  MEDIAL_CARE,
  CLASSROOM,
  CONSULTATION,
  EVENT,
} from "~/../../src/shared/constants/category";

import storeGuestRequest from "~/../../src/shared/requests/front/store";
import holidayRequest from "~/../../src/shared/requests/front/holiday";

import { Holiday, Store } from "../../models";
import { FilterStore } from "~/../../src/front/models";

import { STATUS_PLACE } from "~/../../src/shared/constants";
import { DevicesEnum } from "~/../../src/shared/constants";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { positionData } from "../../../shared/constants/adsense";

import { formatValuePrice, getDayByDate } from "~/../../src/shared/utils";
import { getCurrentTimeBooking } from "~/../../src/shared/utils/date";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { useMeStore } from "../../../shared/stores/me";
import { getQuery } from "~/../../src/shared/utils/format";

import IconLeft from "../../components/Icon/Left.vue";
import ButtonRed from "../../../shared/components/button/ButtonRed.vue";
import A2 from "../../components/common/Ads/A2.vue";
import A3 from "../../components/common/Ads/A3.vue";

import { useStoreSearch } from "~/../../src/front/store/store";
import { getNameBookMark } from "~/../../src/front/minxins/titleMixin";
import { fetchExternalAds } from "../../composables/externalAds";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

const meStore = useMeStore();
const storeSearch = useStoreSearch();

const { $bus } = useNuxtApp();
const menu = useCookie(persistKeys.MENU, {
  secure: true,
  sameSite: "none",
});
if (!menu.value) {
  menu.value = String(typeStoreCategory.SALON);
}
const deviceTable = useDeviceStore();
const device = computed(() => {
  return deviceTable.device;
});
const { t } = i18n.global;
const page = ref(1);
const valueMobile = ref(1);
let pageSize = ref(20);
let total = ref(0);
let pagerCount = ref(6);
const dataTitle = reactive([{ name: t("front.list_store"), path: "" }]);
const route = useRoute();
const router = useRouter();
const idStore = ref(null);
const loadingSearch = ref(false);
const dialogVisible = ref(false);
const noData = ref("");
const dateDisabled = ref([]);
const openTime = ref([]);
const closingTime = ref([]);
const typeStore = ref();
const holiday = ref<Holiday[]>([]);
const from = moment().format("YYYY-MM-DD");
const to = moment().add(14, "day").format("YYYY-MM-DD");
const data = ref<Store[]>([]);
const dateTime = ref("");

const handleClose = () => {
  dialogVisible.value = false;
  idStore.value = null;
  dateTime.value = "";
};

const form = reactive({
  keyword_search_list_store_screen:
    storeSearch.keyword_search_list_store_screen ||
    storeSearch.headerSearch.keyword_name ||
    "",
  time_list:
    storeSearch.time_list ||
    storeSearch.headerSearch.keyword_time ||
    getCurrentTimeBooking(),
  min_price: storeSearch.min_price || null,
  max_price: storeSearch.max_price || null,
  date_list:
    storeSearch.date_list ||
    storeSearch.headerSearch.keyword_date ||
    moment().format("YYYY-MM-DD"),
});
switch (Number(menu.value)) {
  case RESTAURANT:
    if (storeSearch.restaurant.keyword_date) {
      form.date_list = storeSearch.restaurant.keyword_date;
    }
    if (storeSearch.restaurant.keyword_time) {
      form.time_list = storeSearch.restaurant.keyword_time;
    }
    if (storeSearch.restaurant.keyword_name) {
      form.keyword_search_list_store_screen =
        storeSearch.restaurant.keyword_name;
    }
    break;
  case SALON:
    if (storeSearch.salon.keyword_date) {
      form.date_list = storeSearch.salon.keyword_date;
    }
    if (storeSearch.salon.keyword_time) {
      form.time_list = storeSearch.salon.keyword_time;
    }
    if (storeSearch.salon.keyword_name) {
      form.keyword_search_list_store_screen = storeSearch.salon.keyword_name;
    }
    break;
  case MEDIAL_CARE:
    if (storeSearch.medical_care.keyword_date) {
      form.date_list = storeSearch.medical_care.keyword_date;
    }
    if (storeSearch.medical_care.keyword_time) {
      form.time_list = storeSearch.medical_care.keyword_time;
    }
    if (storeSearch.medical_care.keyword_name) {
      form.keyword_search_list_store_screen =
        storeSearch.medical_care.keyword_name;
    }
    break;
  case CLASSROOM:
    if (storeSearch.classroom.keyword_date) {
      form.date_list = storeSearch.classroom.keyword_date;
    }
    if (storeSearch.classroom.keyword_time) {
      form.time_list = storeSearch.classroom.keyword_time;
    }
    if (storeSearch.classroom.keyword_name) {
      form.keyword_search_list_store_screen =
        storeSearch.classroom.keyword_name;
    }
    break;
  case CONSULTATION:
    if (storeSearch.consultation.keyword_date) {
      form.date_list = storeSearch.consultation.keyword_date;
    }
    if (storeSearch.consultation.keyword_time) {
      form.time_list = storeSearch.consultation.keyword_time;
    }
    if (storeSearch.consultation.keyword_name) {
      form.keyword_search_list_store_screen =
        storeSearch.consultation.keyword_name;
    }
    break;
  case EVENT:
    if (storeSearch.event.keyword_date) {
      form.date_list = storeSearch.event.keyword_date;
    }
    if (storeSearch.event.keyword_time) {
      form.time_list = storeSearch.event.keyword_time;
    }
    if (storeSearch.event.keyword_name) {
      form.keyword_search_list_store_screen = storeSearch.event.keyword_name;
    }
    break;
}

const getHoliday = async () => {
  const dataHoliday = await holidayRequest.list<Holiday[]>({
    from: from,
    to: to,
  });
  holiday.value = dataHoliday.data;
};

const getData = (data: Store[] = []) => {
  return data.map((item: Store) => {
    return {
      ...item,
      date: getDate(
        item.opening_times,
        item.closing_times,
        item.available_booking_14_days,
        item
      ),
      image: item.model_has_file,
      transportation: item.transportation,
      conscious_id: item.conscious_id,
      district_id: item.district_id,
      island_id: item.island_id,
      village_id: item.village_id,
      type_store: item.model_has_type.type_id,
    };
  });
};

const getDate = (
  openTime = [],
  closeTime = [],
  availableBooking = [],
  store: Store
) => {
  const date = getArrayDate();
  date.map((item: any) => {
    if (store.staffs?.length === 0 && store.seats?.length === 0) {
      item.status = STATUS_PLACE.NOT_PLACE_EMPTY;
      return item;
    }
    const indexHoliday = holiday.value.findIndex(
      (day) => moment(day.date.date).format("YYYY-MM-DD") === item.date
    );
    if (indexHoliday !== -1) {
      item.holiday = true;
    }

    const indexDay = closeTime.findIndex(
      (close: any) => close.day_off === item.date
    );
    if (indexDay !== -1) {
      item.status = STATUS_PLACE.NOT_RECEIVE_BOOKING;
      return item;
    }
    const index = openTime.findIndex(
      (open: any) => Number(open.day_of_week) === Number(item.day_of_week)
    );
    if (index !== -1) {
      item.status = STATUS_PLACE.PLACE_EMPTY;
    } else {
      item.status === STATUS_PLACE.NOT_RECEIVE_BOOKING;
      return item;
    }

    if (
      availableBooking[item.date] &&
      (availableBooking[item.date] === STATUS_PLACE.NOT_PLACE_EMPTY ||
        availableBooking[item.date] === STATUS_PLACE.NOT_RECEIVE_BOOKING)
    ) {
      item.status = STATUS_PLACE.NOT_PLACE_EMPTY;
    }
    return item;
  });
  return date;
};

const getArrayDate = () => {
  let current = moment();
  const allDates = [];
  const FORMAT = "YYYY-MM-DD";
  for (let count = 0; count < 14; count++) {
    allDates.push({
      date: current.format(FORMAT),
      week: getDayByDate(current.format(FORMAT)),
      status: STATUS_PLACE.NOT_RECEIVE_BOOKING,
      day_of_week: current.format("e"),
      holiday: false,
    });
    current.add(1, "day");
  }
  return allDates;
};

const handleBooking = (item: any) => {
  if (GROUP_TYPE_STORE.SAME.includes(item.type_store)) {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.COURSE_MENU,
        menu: menuRestaurant.COURSE_MENU,
      },
      params: { id: item.code },
    });
  } else if (item.type_store === RESTAURANT) {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.COURSE_MENU,
        menu: menuRestaurant.COURSE_MENU_TAB_COURSE,
      },
      params: { id: item.code },
    });
  } else {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.EVENT,
        menu: menuRestaurant.EVENT,
      },
      params: { id: item.code },
    });
  }
};

const handleBookingContent = (e: any, item: any) => {
  if (GROUP_TYPE_STORE.SAME.includes(item.type_store)) {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.COURSE_MENU,
        menu: menuRestaurant.COURSE_MENU,
      },
      params: { id: item.code },
    });
  } else if (item.type_store === RESTAURANT) {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.COURSE_MENU,
        menu: menuRestaurant.COURSE_MENU_TAB_COURSE,
      },
      params: { id: item.code },
    });
  } else {
    router.push({
      name: "store-id",
      query: {
        tab: menuRestaurant.EVENT,
        menu: menuRestaurant.EVENT,
      },
      params: { id: item.code },
    });
  }
};

const isCompleted = ref(true);

const getListStore = async (key?: boolean) => {
  loadingSearch.value = true;
  if (key) {
    await getHoliday();
  }
  const param = getParams();
  const params = getQuery(param);

  const response = (await storeGuestRequest.getList<Store[]>(params)).data;

  data.value = getData(response.data);
  total.value = response.pagination.total;
  page.value = response.pagination.current_page;
  loadingSearch.value = false;
  isCompleted.value = false;
  if (!data.value.length) {
    noData.value = t("no_result_search");
  }
  scrollToTop();
};

const getDateTime = (date: any, time: any, key: boolean) => {
  if (!date) {
    return "";
  }
  if (key && !time) {
    time = "00:00";
  }
  if (!key && !time) {
    time = "23:45";
  }
  return `${date} ${time}`;
};

/**
 * Get param for payload of request get list store
 *
 * @param bool isQuery flag use to get only a few parameters
 *
 * @return void
 */
const getParams = (isQuery = false) => {
  if (isQuery) {
    return {
      max_time: form.time_list,
      min_price: formatValuePrice(form.min_price),
      max_price: formatValuePrice(form.max_price),
      date_booking: form.date_list,
      keyword_name_tag: form.keyword_search_list_store_screen,
    };
  } else {
    const obj = {
      min_price: formatValuePrice(form.min_price),
      max_price: formatValuePrice(form.max_price),
      time_list: form.time_list === "24:00" ? "23:59" : form.time_list,
      date_list: form.date_list,
      type_store_id: useCookie(persistKeys.MENU).value,
      limit: pageSize.value,
      page: page.value,
      keyword_search_header: null,
      transportation: null,
      district_id: null,
      conscious_id: null,
      island_id: null,
      village_id: null,
      date_header: null,
      time_header: null,
      is_map: null,
      keyword_search_list_store_screen: form.keyword_search_list_store_screen,
      latitude: meStore.getGeolocationPosition.latitude,
      longitude: meStore.getGeolocationPosition.longitude,
    };
    switch (Number(useCookie(persistKeys.MENU).value)) {
      case SALON:
        handleChangeData(obj, storeSearch.salon);
        break;
      case RESTAURANT:
        handleChangeData(obj, storeSearch.restaurant);
        break;
      case MEDIAL_CARE:
        handleChangeData(obj, storeSearch.medical_care);
        break;
      case CLASSROOM:
        handleChangeData(obj, storeSearch.classroom);
        break;
      case CONSULTATION:
        handleChangeData(obj, storeSearch.consultation);
        break;
      case EVENT:
        handleChangeData(obj, storeSearch.event);
        break;
    }
    return obj;
  }
};

const handleChangeData = (obj: any, data: FilterStore) => {
  obj.is_map = data.is_map;
  if (obj.is_map) {
    obj.keyword_search_header = null;
    obj.keyword_search_list_store_screen = null;
    obj.transportation = null;
  } else {
    obj.transportation = data.transportation;
    obj.keyword_search_header = data.keyword_name;
  }
  obj.district_id = data.district_id;
  obj.conscious_id = data.conscious_id;
  obj.island_id = data.island_id;
  obj.village_id = data.village_id;
  obj.date_header = data.keyword_date;
  obj.time_header = data.keyword_time === "24:00" ? "23:59" : data.keyword_time;
};

const handleSubmit = () => {
  storeSearch.headerSearch.district_id = null;
  storeSearch.headerSearch.conscious_id = null;
  storeSearch.headerSearch.island_id = null;
  storeSearch.headerSearch.village_id = null;
  storeSearch.headerSearch.is_map = null;
  meStore.setGeolocationPosition({
    latitude: null,
    longitude: null,
  });
  $bus.$emit("searchStore", {
    keyword_name: form.keyword_search_list_store_screen,
    keyword_date: form.date_list,
    keyword_time: form.time_list,
  });
  nextTick(() => {
    handleSearch();
  });
};

const handleSearch = async () => {
  isCompleted.value = true;
  page.value = 1;
  valueMobile.value = 1;
  await getListStore();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  getListStore();
};

const handleClickFilter = () => {
  valueMobile.value = 2;
};

const handleBack = async () => {
  await router.push("/");
};

const handleCloseSearch = () => {
  valueMobile.value = 1;
};

const submitBooking = (activeDate: string, people: number, time: string) => {
  const query = getQuery({
    date_booking: activeDate,
    people: people,
    time_booking: time,
    store_id: idStore.value,
    type_store: typeStore.value,
  });

  router.push({
    name: "reservation-booking",
    query: query,
  });
};

$bus.$on("store", (val: any) => {
  if (val.keyword_date) {
    form.date_list = val.keyword_date;
  }
  if (val.keyword_time) {
    form.time_list = val.keyword_time;
  }
  form.keyword_search_list_store_screen = val.keyword_name;
  handleSearch();
});

onBeforeMount(async () => {
  await fetchExternalAds({ forceFetch: true });
});

onMounted(async () => {
  await getListStore(true);
});

onBeforeUnmount(() => {
  $bus.$off("store");
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../assets/scss/variables" as *;

.list {
  width: 100%;

  #store {
    width: 100%;
    padding: 0 15%;
    display: flex;
    flex-wrap: wrap;
    margin: 30px auto auto;

    .list-store {
      width: 68%;
      margin-right: 5%;

      .store-info {
        margin-top: 24px;
        margin-bottom: 32px;

        &:first-child {
          margin-top: 0;
        }

        .list-store__wrap {
          .list-store__body {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 16px;

            .header-mobile {
              display: none;
            }

            .list-store__photo {
              width: 220px;
              margin-right: 24px;
            }

            .list-store__content {
              width: calc(100% - 244px);
            }
          }
        }
      }

      .list-pagination {
        :deep(.el-pagination) {
          padding: 0 0 64px;
        }
      }
    }

    .store-search {
      margin-bottom: 20px;
      width: 27%;
    }

    .custom-btn {
      margin-top: 16px;
    }

    .no-result-search {
      min-height: 40vh;
    }

    .external-ads-area {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      &:has(div) {
        margin-bottom: 64px;
      }
    }
  }
}

@include res("md-only", $breakpoints-spec) {
  .list {
    #store {
      padding: 0 9%;

      .list-store {
        width: 63%;
      }

      .store-search {
        width: 32%;
      }
    }
  }
}

@media screen and (max-width: 992px) and (min-width: 850px) {
  .list {
    #store {
      padding: 0 8%;

      .list-store {
        width: 63%;
      }

      .store-search {
        width: 32%;
      }
    }
  }
}

@media screen and (max-width: 850px) and (min-width: 768px) {
  .list {
    #store {
      padding: 0 8%;

      .list-store {
        width: 60%;

        .store-info {
          .list-store__wrap {
            .list-store__body {
              .header-mobile {
                display: unset;
                width: 100%;

                .list-store-name {
                  border-bottom: 1px solid $grey-small-color;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                  width: 100%;

                  :deep(.list-store-name_wrap) {
                    font-weight: 500;
                    font-size: 16px;
                    margin-bottom: 8px;

                    .list-store-name__wrap-text_mobile {
                      color: #8a6d3b;
                      text-decoration: none;
                    }
                  }

                  .list-store-name__area {
                    font-weight: 400;
                    margin-bottom: 8px;
                  }
                }
              }

              .list-store__photo {
                width: 100%;
                margin-right: 0;
              }

              .list-store__content {
                width: 100%;
                margin-top: 8px;

                :deep(.list-store__name) {
                  display: none;
                }
              }
            }
          }
        }

        .list-date {
          padding: 0;
        }
      }

      .list-pagination {
        display: flex;
        justify-content: center;
      }

      .store-search {
        width: 35%;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .list {
    position: relative;
    #store {
      padding: 0;

      .list-store {
        width: 100%;
        margin-right: 0;

        .store-info {
          .list-store__wrap {
            .list-store__body {
              .header-mobile {
                display: unset;
                padding: 0 16px;
                width: 100%;

                .list-store-name {
                  border-bottom: 1px solid $grey-small-color;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                  width: 100%;

                  :deep(.list-store-name_wrap) {
                    font-weight: 500;
                    font-size: 16px;
                    margin-bottom: 8px;

                    .list-store-name__wrap-text_mobile {
                      color: #8a6d3b;
                      text-decoration: none;
                    }
                  }

                  .list-store-name__area {
                    font-weight: 400;
                    margin-bottom: 8px;
                  }
                }
              }

              .list-store__photo {
                width: 100%;
                margin-right: 0;
              }

              .list-store__content {
                width: 100%;
                margin-top: 8px;
                padding: 0 16px;

                :deep(.list-store__name) {
                  display: none;
                }
              }
            }
          }
        }

        .list-date {
          padding: 0 16px;
        }
      }
      .store-search {
        display: none;
      }

      .list-pagination {
        display: flex;
        justify-content: center;
      }

      .external-ads-area {
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
