<template>
  <div v-loading="loading" class="detail-store-list">
    <Head>
      <Title>
        {{ dataStore ? $t("site_name_title") : $t("site_name")
        }}{{
          dataStore
            ? $t(getNameBookMark(dataStore?.model_has_type?.type_id)) + "｜"
            : ""
        }}{{ dataStore?.name }}
      </Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum
            v-if="device === 'desktop'"
            :data-title="dataTitle"
            class-name="detail-store"
          />
          <StoreBreadCrumMb
            v-if="device === 'mobile'"
            class-name="detail-store"
            :title-close="dataStore?.name"
            @handle-close="backStore"
          >
            <template #icon>
              <IconLeft />
            </template>
            <template #show-icon>
              <div></div>
            </template>
          </StoreBreadCrumMb>
        </span>
      </Teleport>
    </ClientOnly>
    <div :class="['detail-store', { 'is-preview': isPagePreview }]">
      <div class="detail-store__header">
        <div class="detail-store__title">
          <div
            v-if="
              device === DevicesEnum.MOBILE_DEVICE &&
              tabMenu === menuRestaurant.TOP
            "
            class="detail-store-top-mobile"
          >
            <StoreTopHeaderMb
              :id="idStore"
              :data="dataStore?.model_has_file"
              :name="dataStore?.name"
              :transportation="dataStore?.transportation"
            />
          </div>
          <div class="store-content">
            <StoreContentComponent :id="storeCode" :data="dataStore" />
            <div v-if="dataStore?.news" class="detail-store__action">
              <div class="notice-user">{{ $t("notice_user") }}</div>
              <div>
                {{ dataStore?.news }}
              </div>
            </div>
            <div
              v-if="
                device === DevicesEnum.MOBILE_DEVICE &&
                tabMenu === menuRestaurant.TOP
              "
              class="name-mb"
            >
              <div class="top-header__title">
                {{ dataStore?.introduction ? dataStore?.introduction : "" }}
              </div>
              <div class="top-header__food">
                <div>
                  {{ dataStore?.description ? dataStore?.description : "" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-store__phone">
          <StorePhoneComponent
            :phone="dataStore?.phone_number"
            :is-disabled="isPagePreview"
            @handle-click="showModalDatePicker"
          />
          <div v-if="dataStore?.line_setting?.qr_code_url" class="qr-code">
            <div class="qr-code__label d-flex">
              <icon-line />
              <span class="text-line">{{ $t("label_qr_code") }}</span>
            </div>
            <el-image :src="dataStore?.line_setting?.qr_code_url"> </el-image>
          </div>
        </div>
      </div>
      <div class="detail-store__menu" :class="{ 'show-preview': isHomePage }">
        <StoreMenu
          v-if="dataStore"
          :id="idStore"
          ref="_refMenu"
          v-model="menuActive"
          :is-disabled="isPagePreview"
          :job-offer="dataStore?.contract?.plan?.job_offer"
          class="menu-item"
          :data-menu-category="dataStore?.menu_categories || []"
          :type-store="dataStore?.model_has_type?.type_id"
          :ref-body="_refBody"
          @handle-change-tab="handleChangeTab"
        />
      </div>
      <div ref="_refBody" class="detail-store__body">
        <div class="detail-store__content">
          <!-- START Mobile A5 A6 A7 A8 -->
          <A5Mobile
            :position="[
              positionData.A5,
              positionData.A6,
              positionData.A7,
              positionData.A8,
            ]"
            :store-id="idStore"
          />
          <!-- END Mobile A5 A6 A7 A8 -->
          <TopComponent
            v-if="checkActive(menuRestaurant.TOP) && dataStore"
            :data="dataStore"
            :is-disabled="isPagePreview"
            :id-store="idStore"
            :ref-body="_refBody"
            @show-data-course="showDataCourse"
            @show-data-image="showDataImage"
            @handle-click="showModalDate"
            @show-detail="showDetailCourse"
            @show-more-staff="showMoreStaff"
            @handle-click-menu-course="handleMenuShow"
            @handle-click-staff="changeHistoryQuery"
            @show-more-review="showMoreReview"
            @handle-click-event="handleBookingEvent"
            @handle-detail-event="handleDetailEvent"
            @handle-click-coupon-event="handleClickCouponEvent"
            @show-more-event="showMoreEvent"
            @handle-click-coupon-course="handleClickCouponCourse"
          />
          <SeatComponent
            v-else-if="checkActive(menuRestaurant.SEAT) && dataStore"
            :data="dataSeat"
          />
          <CourseComponent
            v-else-if="checkActive(menuRestaurant.COURSE_MENU) && dataStore"
            :id="idStore"
            ref="_refCourse"
            :id-course="idCourseDetail"
            :menu="dataStore?.menu_categories"
            :tab="menuActive"
            :type-store="dataStore?.model_has_type?.type_id"
            @show-data-image="showDataImage"
            @handle-click="showModalDate"
            @show-detail="showDetailCourse"
            @handle-click-menu="handleMenu"
            @handle-click-menu-course="handleMenuShow"
            @handle-click-coupon-course="handleClickCouponCourse"
          />
          <PhotoComponent
            v-else-if="
              checkActive(menuRestaurant.PHOTO) &&
              dataStore &&
              [RESTAURANT].includes(dataStore?.model_has_type?.type_id)
            "
            :id="idStore"
            :tab-menu="menuActive"
            :ref-body="_refBody"
            :menu="dataStore?.menu_categories"
            :type-store="dataStore?.model_has_type?.type_id"
          />
          <PhotoSalonComponent
            v-else-if="
              checkActive(menuRestaurant.PHOTO) &&
              dataStore &&
              ![RESTAURANT, EVENT].includes(dataStore?.model_has_type?.type_id)
            "
            :id="idStore"
            :tab-menu="menuActive"
            :ref-body="_refBody"
            :type-store="dataStore?.model_has_type?.type_id"
          />
          <PhotoEventComponent
            v-else-if="
              checkActive(menuRestaurant.PHOTO) &&
              dataStore &&
              [EVENT].includes(dataStore?.model_has_type?.type_id)
            "
            :id="idStore"
            :tab-menu="menuActive"
            :ref-body="_refBody"
            :type-store="dataStore?.model_has_type?.type_id"
          />
          <RateComponent
            v-else-if="checkActive(menuRestaurant.RATE) && dataStore"
            :id-store="dataStore?.id"
            @update-rate="handleUpdateRate"
          />
          <ProfileComponent
            v-else-if="checkActive(menuRestaurant.INFORMATION) && dataStore"
            :data="dataStore"
            @handle-click="showModalDatePicker"
          />
          <StoreTabStaffComponent
            v-else-if="checkActive(menuRestaurant.STAFF) && dataStore"
            :staff="dataStore?.staffs"
            :store-type="dataStore?.model_has_type?.type_id"
            @handle-click="changeHistoryQuery"
          />
          <StoreTabRecruitmentComponent
            v-else-if="checkActive(menuRestaurant.RECRUITMENT) && dataStore"
            :id-store="dataStore?.id"
            @handle-click="changeHistoryQuery"
          />
          <EventComponent
            v-else-if="dataStore && checkActive(menuRestaurant.EVENT)"
            ref="_refEvent"
            :id-event="eventId"
            :data-event="dataStore?.events"
            @handle-click-coupon-event="handleClickCouponEvent"
            @handle-booking="handleBookingEvent"
            @handle-detail-event="handleDetailEvent"
          />
          <div class="external-ads-area-bottom">
            <A3 :position="[positionData.A9]" :store-id="idStore" />
            <A3 :position="[positionData.A10]" :store-id="idStore" />
          </div>
        </div>
        <div class="detail-store__booking">
          <StoreDatePickerSelect
            v-if="dataStore"
            :type-store="dataStore?.model_has_type?.type_id"
            :open-time="dataStore?.opening_times"
            :closing-time="closingTime"
            :is-disabled="isPagePreview"
            :id-store="dataStore?.id"
            :submit-form="false"
            @handle-click="submitChangeMenu"
          />
          <!-- START Ads A5 A6 A7 A8 -->
          <div class="external-ads-area-right">
            <A5 :position="[positionData.A5]" :store-id="idStore" />
            <A5 :position="[positionData.A6]" :store-id="idStore" />
            <A5 :position="[positionData.A7]" :store-id="idStore" />
            <A5 :position="[positionData.A8]" :store-id="idStore" />
          </div>
          <!-- END Ads A5 A6 A7 A8 -->
        </div>
      </div>
      <div class="detail-store__footer">
        <StorePhoneComponent
          :phone="dataStore?.phone_number"
          :line-qr-code="dataStore?.line_url"
          @handle-click="showModalDatePicker"
        />
      </div>
    </div>
    <modal-confirm
      v-if="dialogVisible && dataStore"
      :dialog-visible="dialogVisible"
      width="344px"
      @handle-close="handleClose"
    >
      <template #body>
        <StoreDatePickerSelect
          :staff-id="staffId"
          :course-id="idCourse"
          :is-disabled="isPagePreview"
          :course-open-time="courseOpenTime"
          :id-store="dataStore?.id"
          :menu-id="menuId"
          :type-store="dataStore?.model_has_type?.type_id"
          :open-time="dataStore?.opening_times"
          :closing-time="closingTime"
          @handle-click="submitFormPicker"
        />
      </template>
    </modal-confirm>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter, useCookie } from "nuxt/app";
import { useNuxtApp } from "nuxt/app";

import { i18n } from "~/../../src/shared/plugins/i18n";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { getNameBookMark } from "~/../../src/front/minxins/titleMixin";

import TopComponent from "../../components/store/tab/TopComponent.vue";
import SeatComponent from "../../components/store/tab/SeatComponent.vue";
import CourseComponent from "../../components/store/tab/CourseComponent.vue";
import PhotoComponent from "../../components/store/tab/PhotoComponent.vue";
import PhotoSalonComponent from "../../components/store/tab/PhotoSalonComponent.vue";
import PhotoEventComponent from "../../components/store/tab/PhotoEventComponent.vue";
import RateComponent from "../../components/store/tab/RateComponent.vue";
import ProfileComponent from "../../components/store/tab/ProfileComponent.vue";
import IconLine from "~/../../src/shared/components/icon/Line.vue";
import A3 from "../../components/common/Ads/A3.vue";
import A5 from "../../components/common/Ads/A5.vue";
import A5Mobile from "../../components/common/Ads/A5Mobile.vue";

import { useDeviceStore } from "../../store/device";
import EventComponent from "../../components/store/tab/EventComponent.vue";
import { buildQuery } from "~/../../src/shared/utils/format";
import { getQuery } from "~/../../src/shared/utils/format";
import scrollToTop from "~/../../src/shared/utils/scroll";

import storeGuestV2Request from "~/../../src/shared/requests/front/storeV2";
import storeGuestRequest from "~/../../src/shared/requests/front/store";

import { DetailStore } from "~/../../src/front/models";

import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { DevicesEnum } from "~/../../src/shared/constants";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import {
  SALON,
  RESTAURANT,
  EVENT,
  MEDIAL_CARE,
  CLASSROOM,
  CONSULTATION,
} from "~/../../src/shared/constants/category";
import { HAVE_JOB_OFFER } from "~/../../src/shared/constants";
import { positionData } from "../../../shared/constants/adsense";
import moment from "moment";
import { fetchExternalAds } from "../../composables/externalAds";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

const deviceTable = useDeviceStore();
const router = useRouter();
const route = useRoute();
const device = computed(() => {
  return deviceTable.device;
});
const loading = ref(true);
const { $bus } = useNuxtApp();
const _refCourse = ref(null);

const { t } = i18n.global;
const dataTitle = reactive([
  { name: t("title_screen.store_list"), path: "/store" },
  { name: "", path: "" },
]);

const valueActive = route.query.menu
  ? String(route.query.menu)
  : menuRestaurant.TOP;
const tab = ref(route.query.tab ? String(route.query.tab) : menuRestaurant.TOP);
const menuActive = ref(valueActive);
const tabMenu = ref(tab);
const dialogVisible = ref(false);
const idStore = ref();
const storeCode = ref(route.params.id);
const idCourse = ref(route.query.course ? +route.query.course : null);
const idCourseDetail = ref(route.query.course ? +route.query.course : null);
const dataStore = ref<DetailStore>();
const closingTime = ref([]);
const menuShow = ref(false);
const menuId = ref();
const staffId = ref();
const _refBody = ref();
const _refMenu = ref();
const _refEvent = ref();
const dataPreview = ref<DetailStore>({});
const isPagePreview = ref(false);
const courseOpenTime = ref([]);
const eventId = ref<number | null>(
  route.query.event ? +route.query.event : null
);
const couponCode = ref<number | null>();
const typeStore = computed(() => {
  return dataStore.value?.model_has_type?.type_id;
});
const isHomePage = ref(route.query.is_homepage);
const storeBooking = useCookie(persistKeys.STORE_LINE, {
  secure: true,
  sameSite: "none",
});

const handleClose = () => {
  staffId.value = null;
  idCourse.value = null;
  menuId.value = null;
  staffId.value = null;
  dialogVisible.value = false;
};

const detailStore = async () => {
  try {
    loading.value = true;
    dataStore.value = (
      await storeGuestV2Request.getDetailStore(storeCode.value, {
        is_preview: !!route.query?.is_preview,
      })
    ).data as DetailStore;

    dataTitle[1].name = dataStore.value.name;
    closingTime.value = dataStore.value.closing_times;
    if (
      Number(useCookie(persistKeys.MENU).value) !==
      dataStore.value?.model_has_type?.type_id
    ) {
      useCookie(persistKeys.MENU, {
        secure: true,
        sameSite: "none",
      }).value = String(dataStore.value?.model_has_type?.type_id);
      $bus.$emit("changeCookie", dataStore.value?.model_has_type?.type_id);
    }

    idStore.value = dataStore.value.id;

    if (route.query?.is_preview) {
      isPagePreview.value = true;
      try {
        const resultData =
          await storeGuestV2Request.getDataPreview<DetailStore>(idStore.value);
        dataPreview.value = resultData.data?.data;

        dataStore.value.comment_opening_time =
          dataPreview.value.comment_opening_time;
        dataStore.value.description = dataPreview.value.description;
        dataStore.value.name = dataPreview.value.name;
        dataTitle[1].name = dataPreview.value.name;
        dataStore.value.news = dataPreview.value.news;
        dataStore.value.introduction = dataPreview.value.introduction;
        dataStore.value.model_has_file = [];
        dataPreview.value.images.map((item) => {
          dataStore.value.model_has_file.push({
            file: {
              id: item.id,
              url: item.url,
            },
          });
        });
        dataStore.value.model_has_tag = [];
        dataPreview.value.tag.map((item) => {
          dataStore.value.model_has_tag.push({
            tag_store: {
              name: item,
            },
          });
        });
        dataStore.value.closing_times = [];
        dataPreview.value.closing_times.map((item) => {
          dataStore.value.closing_times.push(item);
        });
        dataStore.value.phone_number = dataPreview.value.phone_number;
        dataStore.value.transportation = dataPreview.value.transportation;

        for (let i = 0; i < dataPreview.value.opening_times.length; i++) {
          dataStore.value.opening_times[i].start = moment(
            dataPreview.value.opening_times[i].start,
            "HH:mm"
          ).format("HH:mm:ss");

          dataStore.value.opening_times[i].end = moment(
            dataPreview.value.opening_times[i].end,
            "HH:mm"
          ).format("HH:mm:ss");
        }
      } catch (e) {}
    }
  } catch (e) {
    if (e.response.status === STATUS_CODE.NOT_FOUND) {
      await router.push("/404");
    }
    throw new Error();
  } finally {
    loading.value = false;
  }
};

const handleUpdateRate = async () => {
  const response = (await storeGuestRequest.show(idStore.value))
    .data as DetailStore;
  if (dataStore.value) {
    dataStore.value.reviews = response.reviews;
  }
};

const showDataCourse = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  if (
    GROUP_TYPE_STORE.SAME.includes(dataStore?.value.model_has_type?.type_id)
  ) {
    tab.value = menuRestaurant.COURSE_MENU;
    menuActive.value = menuRestaurant.COURSE_MENU;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  } else {
    tab.value = menuRestaurant.COURSE_MENU;
    menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  }
  await _refMenu.value.scrollCourse();
};

const showDataImage = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  if (
    GROUP_TYPE_STORE.SAME.includes(dataStore?.value.model_has_type?.type_id)
  ) {
    tab.value = menuRestaurant.PHOTO;
    menuActive.value = menuRestaurant.PHOTO;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  } else if (
    GROUP_TYPE_STORE.RESTAURANT.includes(
      dataStore?.value.model_has_type?.type_id
    )
  ) {
    tab.value = menuRestaurant.PHOTO;
    menuActive.value = menuRestaurant.PHOTO_TAB_ALL;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  } else {
    tab.value = menuRestaurant.PHOTO;
    menuActive.value = menuRestaurant.PHOTO;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  }
  await _refMenu.value.scrollImage();
};

const showMoreStaff = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  await _refMenu.value.scrollStaff();
  tab.value = menuRestaurant.STAFF;
  menuActive.value = menuRestaurant.STAFF;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, null, `${query}`);
};

const showMoreReview = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  await _refMenu.value.scrollReview();
  tab.value = menuRestaurant.RATE;
  menuActive.value = menuRestaurant.RATE;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const showMoreEvent = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  await _refMenu.value.scrollEvent();
  tab.value = menuRestaurant.EVENT;
  menuActive.value = menuRestaurant.EVENT;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const backStore = () => {
  router.push({ name: "store" });
};

const updateAccess = async () => {
  await storeGuestRequest.accessData(idStore.value);
};

const handleChangeTab = async (tab: string[], value: string) => {
  route.query.course = "";
  idCourseDetail.value = null;
  eventId.value = null;
  tabMenu.value = tab[0];
  menuActive.value = value;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};
const checkActive = (value: string) => {
  return tabMenu.value === value;
};

const submitChangeMenu = () => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    changeHistoryQueryRestaurant();
  } else if (
    GROUP_TYPE_STORE.SAME.includes(dataStore.value?.model_has_type?.type_id)
  ) {
    changeHistoryQuery();
  } else {
    changeHistoryQueryEvent();
  }
};

const submitFormPicker = (activeDate: string, people: number, time: string) => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    const query = getQuery({
      date_booking: activeDate,
      people: people ? people : null,
      time_booking: time ? time : null,
      store_id: idStore.value,
      course_id: idCourse.value || null,
      type_store: dataStore.value?.model_has_type?.type_id,
      coupon_code: couponCode.value,
    });
    dialogVisible.value = false;
    router.push({
      name: "reservation-booking",
      query: query,
    });
    menuShow.value = false;
    staffId.value = null;
    menuId.value = null;
    idCourse.value = null;
  } else {
    changeHistoryQuery();
  }
};
// TODO top
const handleClickCouponCourse = (couponId: number, courseId: number) => {
  couponCode.value = couponId;
  idCourse.value = courseId;
  menuShow.value = false;
  staffId.value = null;
  menuId.value = null;
  dialogVisible.value = true;
};

const handleMenu = (idMenu: number) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      menu_id: idMenu,
      type_store: dataStore.value?.model_has_type?.type_id,
    },
  });
};

const handleMenuShow = (id: number) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      menu_type: true,
      course_id: id,
      type_store: dataStore.value?.model_has_type?.type_id,
    },
  });
};

const showModalDate = (id: number) => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    menuShow.value = false;
    staffId.value = null;
    menuId.value = null;
    idCourse.value = id;
    couponCode.value = null;
    dialogVisible.value = true;
  } else {
    router.push({
      name: "reservation-booking",
      query: {
        store_id: idStore.value,
        course_id: id,
        type_store: dataStore.value?.model_has_type?.type_id,
      },
    });
  }
};

const showModalDatePicker = async () => {
  if (
    GROUP_TYPE_STORE.SAME.includes(dataStore.value?.model_has_type?.type_id)
  ) {
    changeHistoryQuery();
    await _refMenu.value.scrollCourse();
  } else if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    idCourse.value = null;
    menuShow.value = false;
    staffId.value = null;
    idCourse.value = null;
    // dialogVisible.value = true;
    changeHistoryQueryRestaurant();
    await _refMenu.value.scrollCourse();
  } else {
    eventId.value = null;
    changeHistoryQueryEvent();
  }
};

const changeHistoryQuery = () => {
  if (tabMenu.value === menuRestaurant.COURSE_MENU && _refCourse.value) {
    _refCourse.value.scrollTab();
  }
  tabMenu.value = menuRestaurant.COURSE_MENU;
  menuActive.value = menuRestaurant.COURSE_MENU;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
  _refMenu.value.scrollCourse();
};

const changeHistoryQueryRestaurant = () => {
  if (tabMenu.value === menuRestaurant.COURSE_MENU && _refCourse.value) {
    _refCourse.value.scrollTab();
  }
  tabMenu.value = menuRestaurant.COURSE_MENU;
  menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
  _refMenu.value.scrollCourse();
};

const changeHistoryQueryEvent = () => {
  tabMenu.value = menuRestaurant.EVENT;
  menuActive.value = menuRestaurant.EVENT;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
  _refEvent.value?.scrollTab();
  _refMenu.value.scrollEvent();
};

const showDetailCourse = (id: number) => {
  setTimeout(async () => {
    await window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 300);
  idCourse.value = id;
  idCourseDetail.value = id;
  tab.value = menuRestaurant.COURSE_MENU;
  couponCode.value = null;
  route.query.course = String(id);
  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    menuActive.value = menuRestaurant.COURSE_MENU;
  } else {
    menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
  }

  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    course: id,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

// TODO seat
const dataSeat = computed(() => {
  const array: any[] = [];
  if (dataStore.value && dataStore.value.seats) {
    dataStore.value.seats.map((item) => {
      if (item.model_has_type) {
        let index = array.findIndex(
          (type) => type.type_id === item.model_has_type?.type_id
        );
        if (index === -1) {
          array.push({
            type_id: item.model_has_type.type_id,
            name: item.model_has_type.type?.name,
            file: [],
          });
          index = array.length - 1;
        }
        if (item.model_has_file.length > 0) {
          item.model_has_file.map((file) => {
            if (file.file) {
              array[index].file.push({
                name: item.name,
                url: file.file.url,
                description: item.description,
              });
            }
          });
        } else {
          array[index].file.push({
            name: item.name,
            url: null,
            description: item.description,
          });
        }
      }
    });
  }
  return array.sort((item, itemNew) => {
    return item.type_id - itemNew.type_id;
  });
});

const checkShowMenu = () => {
  if (
    tabMenu.value === menuRestaurant.RECRUITMENT &&
    dataStore.value?.contract?.plan?.job_offer !== HAVE_JOB_OFFER
  ) {
    tabMenu.value = menuRestaurant.TOP;
    menuActive.value = menuRestaurant.TOP;
    const obj = {
      tab: tabMenu.value,
      menu: menuActive.value,
      is_homepage: isHomePage.value,
    };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, "", `${query}`);
  }
};

// EVENT
const handleDetailEvent = (id: number) => {
  eventId.value = id;
  tabMenu.value = menuRestaurant.EVENT;
  menuActive.value = menuRestaurant.EVENT;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    event: eventId.value,
    is_homepage: isHomePage.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const handleBookingEvent = ([event_id, date, time_id]: [
  number,
  string,
  number
]) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      event_id: event_id,
      type_store: dataStore.value?.model_has_type?.type_id,
      date_booking: date,
      time_event: time_id,
    },
  });
};

const handleClickCouponEvent = ([event_id, date, time_id, couponCode]: [
  number,
  string,
  number,
  string
]) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      event_id: event_id,
      type_store: dataStore.value?.model_has_type?.type_id,
      date_booking: date,
      time_event: time_id,
      coupon_code: couponCode,
    },
  });
};

// onBeforeMount(async () => {
//   await fetchExternalAds({ forceFetch: true }, idStore.value);
// });

onMounted(async () => {
  if (isHomePage.value) {
    storeBooking.value = storeCode.value;
  } else {
    storeBooking.value = null;
  }
  try {
    scrollToTop();
    await detailStore();
    checkShowMenu();
    await fetchExternalAds({ forceFetch: true }, idStore.value);
    if (!route.query?.is_preview) {
      await updateAccess();
    }
  } catch (e) {}
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.detail-store-list {
  width: 100%;
  margin-bottom: 64px;
  min-height: 100px;

  .detail-store {
    max-width: 100%;
    padding: 0 15%;
    margin: 24px auto auto;

    .detail-store__header {
      display: flex;
      margin-bottom: 16px;

      .detail-store__title {
        width: calc(100% - 344px);
        padding-right: 30px;
        border-right: 1px solid $black-5;

        .detail-store-top-mobile {
          display: none;
        }

        .store-content {
          .name-mb {
            display: none;

            .top-header__title {
              color: $yellow-medium-color;
              margin: 16px 0;
              white-space: pre-line;
            }

            .top-header__food {
              margin-bottom: 16px;
              white-space: pre-line;
            }
          }

          .detail-store__action {
            display: flex;
            margin-top: 10px;
            align-items: center;

            .notice-user {
              width: 105px;
              min-width: 105px;
              margin-right: 8px;
              padding: 5px 12px;
              background-color: $orange;
              border-radius: 6px;
              text-align: center;
              color: white;
              font-size: 18px;
            }
          }
        }
      }

      .detail-store__phone {
        width: 344px;
        padding-left: 30px;

        .qr-code {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;

          :deep(.el-image) {
            width: 45%;
          }

          img {
            max-width: 330px;
          }

          &__label {
            font-weight: bold;
            margin-bottom: 15px;

            .text-line {
              display: flex;
              background-color: white;
              height: 40px;
              width: 110px;
              line-height: 40px;
              padding: 0 12px;
            }

            svg {
              margin-right: 10px;
            }
          }
        }
      }
    }

    .detail-store__menu {
      margin-bottom: 16px;
      position: sticky !important;
      position: -webkit-sticky;
      top: 192px;
      z-index: 2025;
    }

    .show-preview {
      top: 0;
    }

    .detail-store__body {
      display: flex;

      .detail-store__content {
        width: calc(100% - 344px);
        padding-right: 30px;
        border-right: 1px solid $black-5;

        .external-ads-area-bottom {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 16px;
          &:has(div) {
            margin-top: 64px;
            min-height: 100px;
          }
        }
      }

      .detail-store__booking {
        width: 344px;
        padding-left: 30px;
        .custom-date-picker {
          margin-bottom: 16px;
        }

        .external-ads-area-right {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 16px;
        }
      }
    }

    .detail-store__footer {
      display: none;
    }
  }
}

.is-preview {
  pointer-events: none;
}

@include res("md-and-down", $breakpoints-spec) {
  .detail-store-list {
    .detail-store {
      .detail-store__menu {
        top: 112px;
      }
      .show-preview {
        top: 0;
      }

      .detail-store__body {
        .detail-store__content {
          &:deep(.external-ads) {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}

@include res("md-only", $breakpoints-spec) {
  .detail-store-list {
    .detail-store {
      padding: 0 9%;

      .detail-store__header {
        .detail-store__title {
          width: calc(100% - 300px);
        }

        .detail-store__phone {
          width: 300px;

          .qr-code__label {
            .text-line {
              width: 88px;
              font-size: 12px;
            }
          }
        }
      }

      .detail-store__body {
        .detail-store__content {
          width: calc(100% - 300px);
        }

        .detail-store__booking {
          width: 300px;
        }
      }
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .detail-store-list {
    .detail-store {
      padding: 0 9%;

      .detail-store__header {
        .detail-store__title {
          width: calc(100% - 250px);
        }

        .detail-store__phone {
          width: 250px;

          .qr-code {
            display: block;

            .text-line {
              width: 98px;
              display: block;
            }
          }
        }
      }

      .detail-store__body {
        .detail-store__content {
          width: calc(100% - 250px);
        }

        .detail-store__booking {
          width: 250px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .detail-store-list {
    margin-bottom: 0;

    .detail-store {
      background: #ffffff;
      padding: 0;
      margin-top: 0;

      .detail-store__header {
        .detail-store__title {
          width: 100%;
          padding: 0;
          border: unset;

          .detail-store-top-mobile {
            display: unset;
          }

          .store-content {
            padding: 0 16px;

            .detail-store__action {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }

            .name-mb {
              display: unset;
            }

            .content-header {
              :deep(.list-store__name) {
                display: none;
              }
            }
          }
        }

        .detail-store__phone {
          display: none;
        }
      }

      .detail-store__menu {
        top: 126px !important;
      }
      .show-preview {
        top: 0 !important;
      }

      .detail-store__body {
        .detail-store__content {
          width: 100%;
          padding: 0;

          .external-ads-area-bottom {
            justify-content: center;
            &:has(div) {
              margin-top: 32px;
              min-height: 100px;
            }
          }
        }

        .detail-store__booking {
          display: none;
        }
      }

      .detail-store__footer {
        display: block;
      }
    }
  }
}
</style>
