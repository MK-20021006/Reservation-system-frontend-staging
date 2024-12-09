<template>
  <div class="content-booking">
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div
      v-if="
        component === BookingInputComponent ||
        component === BookingConfirmComponent
      "
      class="title text-center"
    >
      {{ $t("front.reservation_input") }}
    </div>
    <div v-if="component === PaymentInformation" class="title text-center">
      {{ $t("title_screen.payment_information") }}
    </div>
    <div v-if="component === Success" class="title text-center">
      <template v-if="bookingDraft?.type_course === RESERVATION_TYPE.INSTANT">
        {{ $t("payment.done") }}
      </template>
      <template v-else>
        {{ $t("payment.done_wait") }}
      </template>
    </div>
    <component
      :is="component"
      ref="_refComponent"
      :booking-id="bookingId"
      :form-data="formData"
      :form-data-prop="formData"
      :store="store"
      :course="course"
      :staff="staff"
      :coupon="coupon"
      :errors-form-prop="errorsForm"
      :error-card="errorCard"
      :arr-courses="arrCourses"
      :arr-seats="arrSeats"
      :store-prop="store"
      :category-seat-prop="categorySeat"
      :data-complete="dataComplete"
      :is-loading-delete-booking="isLoadingDeleteBooking"
      :booking-draft="bookingDraft"
      :is-back-screen="isBackScreen"
      :staff-list-prop="arrStaff"
      :category-list-prop="arrCategory"
      :event-list-prop="arrayEvent"
      :event-time-prop="arrayTimeEvent"
      :event-date-prop="arrayDateEvent"
      :event-prop="event"
      :coupon-list-prop="couponList"
      @previous-screen="handlePreviousScreen"
      @previous-screen-confirm="handlePreviousScreenConfirm"
      @confirm-booking="handleConfirmBooking"
      @confirm-payment="handleConfirmPayment"
      @payment="handlePayment"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, reactive, ref, shallowRef } from "vue";
import BookingRequest from "~~/../../src/shared/requests/BookingRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { BookingDetail } from "~/../../src/front/models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { messageError } from "~/../../src/shared/utils/notification";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { CouponInterface } from "~/../../src/shared/models";
import { RESERVATION_TYPE } from "~/../../src/shared/constants/reservation";
import { ERROR_CODE, PAYMENT_TYPE } from "~/../../src/shared/constants";
import { BOOKING_MIN_PRICE_CONTACTLESS } from "~/../../src/shared/constants/booking";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";

definePageMeta({
  activeSidebar: {
    parentName: "reservation",
  },
  middleware: ["auth"],
});

const BookingInputComponent = defineAsyncComponent(
  () =>
    import(
      "~/../../src/front/components/pages/booking/BookingInputComponent.vue"
    )
);
const BookingConfirmComponent = defineAsyncComponent(
  () =>
    import(
      "~/../../src/front/components/pages/booking/BookingConfirmComponent.vue"
    )
);

const PaymentInformation = defineAsyncComponent(
  () =>
    import("~/../../src/front/components/pages/booking/PaymentInformation.vue")
);

const Success = defineAsyncComponent(
  () => import("~/../../src/front/components/pages/booking/Success.vue")
);

const { t } = i18n.global;
const _refComponent = ref();
const component = shallowRef(BookingInputComponent);
const formData = ref(null);
const course = ref(null);
const store = ref(null);
const staff = ref(null);
const arrCourses = ref(null);
const arrSeats = ref(null);
const arrStaff = ref(null);
const arrCategory = ref(null);
const staffSelected = ref(null);
const categorySeat = ref(null);
const bookingId = ref(null);
const dataComplete = ref(null);
const errorsForm = ref(null);
const errorCard = ref(null);
const dataTitle = reactive([{ name: t("reservations"), path: "" }]);
const isLoadingDeleteBooking = ref(false);
const bookingDraft = ref<BookingDetail>(null);
const isBackScreen = ref(false);
const coupon = ref<CouponInterface | null>(null);
const menuArr = ref([]);
const arrayEvent = ref([]);
const arrayDateEvent = ref([]);
const arrayTimeEvent = ref([]);
const event = ref(null);
const couponList = ref([]);

const handleConfirmBooking = async (data: any) => {
  formData.value = data.form;
  if (formData.value.typeStore === RESTAURANT) {
    course.value = data.course;
    store.value = data.store;
    coupon.value = data.coupon;
    arrCourses.value = data.arrCourses;
    arrSeats.value = data.arrSeats;
    couponList.value = data.couponList;
    categorySeat.value = data.isSelectSeat ? data.form.seat_type_id : null;
    if (bookingDraft.value) {
      formData.value.price_adult = bookingDraft.value.detail.course.price;
      formData.value.price_children =
        bookingDraft.value.detail.course.price_children;
    }
  } else if (GROUP_TYPE_STORE.SAME.includes(formData.value?.typeStore)) {
    course.value = data.course;
    store.value = data.store;
    staff.value = data.chooseStaff;
    arrCourses.value = data.arrCourses;
    arrStaff.value = data.arrStaff;
    arrCategory.value = data.arrCategory;
    staffSelected.value = data.isSelectSeat ? data.form.staff_id : null;
    menuArr.value = data.form.arrMenuSelected;
    if (bookingDraft.value) {
      // TODO: price change -> set value again
    }
  } else {
    arrayEvent.value = data.arrayEvent;
    arrayDateEvent.value = data.arrDateEvent;
    arrayTimeEvent.value = data.arrTimeEvent;
    couponList.value = data.couponList;
    store.value = data.store;
    event.value = data.choseEvent;
    coupon.value = data.coupon;
  }

  component.value = BookingConfirmComponent;
};

const handlePreviousScreen = async () => {
  isBackScreen.value = true;
  component.value = BookingInputComponent;
};

const handlePreviousScreenConfirm = async () => {
  //After back booking confirm -> delete booking
  if (formData.value && formData.value.bookingId) {
    try {
      isLoadingDeleteBooking.value = true;
      // Update value
      (await BookingRequest.getDataDraft(+bookingId.value as number)).data;
      await BookingRequest.delete(formData.value.bookingId);
      if (bookingDraft.value.detail.course) {
        formData.value.price_adult = bookingDraft.value.detail.course.price;
        formData.value.price_children =
          bookingDraft.value.detail.course.price_children;
      }
      if (bookingDraft.value.detail.event) {
        formData.value.price_adult = bookingDraft.value.detail.event.price;
        formData.value.price_children =
          bookingDraft.value.detail.course.price_children;
      }
      // if (coupon.value) {
      //   coupon.value.discount_money = bookingDraft.value.discount_money;
      //   coupon.value.discount_percent = bookingDraft.value.discount_percent;
      //   coupon.value.coupon_code = bookingDraft.value.coupon_code;
      // }
    } catch (e: any) {
      if (e.response?.status === STATUS_CODE.NOT_FOUND) {
        if (bookingDraft.value.detail.course) {
          formData.value.price_adult = bookingDraft.value.detail.course.price;
          formData.value.price_children =
            bookingDraft.value.detail.course.price_children;
        }
        if (bookingDraft.value.detail.event) {
          formData.value.price_adult = bookingDraft.value.detail.event.price;
          formData.value.price_children =
            bookingDraft.value.detail.course.price_children;
        }
        // if (coupon.value) {
        //   coupon.value.discount_money = bookingDraft.value.discount_money;
        //   coupon.value.discount_percent = bookingDraft.value.discount_percent;
        //   coupon.value.coupon_code = bookingDraft.value.coupon_code;
        // }
      }
    } finally {
      isLoadingDeleteBooking.value = false;
    }
  }
  component.value = BookingConfirmComponent;
};

const createBooking = async (data: any) => {
  const provider = useCookie(persistKeys.TYPE_LOGIN, {
    secure: true,
    sameSite: "none",
  });
  try {
    errorsForm.value = null;
    _refComponent.value.isLoading = true;
    const res = await BookingRequest.post<BookingDetail>({
      ...data,
      provider: provider.value,
    });
    bookingDraft.value = res.data;
    formData.value.bookingId = res.data?.id;
    bookingId.value = res.data?.id;
  } catch (e) {
    throw e;
  } finally {
    _refComponent.value.isLoading = false;
  }
};

const handleConfirmPayment = async (data: any) => {
  try {
    formData.value = data;
    await createBooking(data);
    if (!data?.amount) {
      if (data.payment_type === PAYMENT_TYPE.CONTACTLESS) {
        dataComplete.value = {
          store_name: store.value?.name,
          course_name: course.value?.name || "",
          staff_name: staff.value?.name || "",
          menu: menuArr.value || [],
          amount: BOOKING_MIN_PRICE_CONTACTLESS,
          event_name: event.value?.event?.name || "",
        };
        component.value = PaymentInformation;
      } else {
        dataComplete.value = {
          store_name: store.value?.name,
          course_name: course.value?.name || "",
          staff_name: staff.value?.name || "",
          menu: menuArr.value || [],
          amount:
            data?.amount <= data.coupon_price
              ? 0
              : data?.amount - data.coupon_price,
          event_name: event.value?.event?.name || "",
        };
        component.value = Success;
      }
      errorCard.value = null;
      return false;
    } else {
      component.value = PaymentInformation;
      errorCard.value = null;
    }
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorsForm.value = e.response?._data?.errors;
      isBackScreen.value = true;
      component.value = BookingInputComponent;
    }

    if (
      e.response.status === STATUS_CODE.BAD_REQUEST ||
      e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE
    ) {
      messageError(e.response?._data?.message);
    }
  }
};

const handlePayment = async (data: any) => {
  try {
    await createBooking(data);
    dataComplete.value = {
      store_name: store.value?.name,
      course_name: course.value?.name || "",
      staff_name: staff.value?.name || "",
      menu: menuArr.value || [],
      amount: bookingDraft.value.amount,
      event_name: event.value?.event?.name || "",
    };
    component.value = Success;
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorsForm.value = e.response?._data?.errors;
      isBackScreen.value = true;
      component.value = BookingInputComponent;
    }

    if (
      e.response.status === STATUS_CODE.BAD_REQUEST ||
      e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE
    ) {
      messageError(e.response?._data?.message);
    }
  }
};

//Completed booking with univapay
const handleSuccess = () => {
  dataComplete.value = {
    store_name: store.value?.name,
    course_name: course.value?.name || "",
    staff_name: staff.value?.name || "",
    event_name: event.value?.event?.name || "",
    menu: menuArr.value || [],
    amount: bookingDraft.value.amount,
  };
  component.value = Success;
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.content-booking {
  flex: 1;
  width: 100%;
  padding: 32px 10.5%;

  .title {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 32px;
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .content-booking {
    padding: 32px 5%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .content-booking {
    padding: 24px 24px 32px;

    .title {
      margin-bottom: 24px;
    }
  }
}
</style>
