import CourseRequest from "~/../../src/shared/requests/front/course";
import { Course, Store, EventInterface } from "~/../../src/front/models";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import moment from "moment";
import { customTrimValue } from "~/../../src/shared/utils";
import { useRoute, useRouter } from "#imports";
import {
  messageError,
  noReserveBooking,
} from "~/../../src/shared/utils/notification";
import CategoryRequest from "~/../../src/shared/requests/CategoryRequest";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { RESERVATION_TYPE } from "~/../../src/shared/constants/reservation";
import { i18n } from "~/../../src/shared/plugins/i18n";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { useMeStore } from "~/../../src/shared/stores/me";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";
import EventRequest from "~/../../src/shared/requests/front/EventRequest";
import {
  REMIND_EMAIL,
  REMIND_LINE,
} from "~/../../src/shared/constants/booking";
import { useCookie } from "#app";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import {
  BOOKING_SOURCE,
  STATUS_TYPE,
} from "~/../../src/shared/constants/reservation";
import { TYPE_SOCIAL } from "~/../../src/shared/constants/typeLogin";
import bookingRequest from "~/../../src/shared/requests/BookingRequest";

const { t } = i18n.global;

export const getDataBooking = async (
  formData: any,
  formDataProp: any,
  paramStore: any,
  store: any,
  storeProp: any,
  paramCourse: any,
  arrCourses: any,
  courses: any,
  arrSeats: any,
  chooseCourse: any,
  courseFilterDateTimeSelect: any,
  categoriesSeat: any,
  minTime: any,
  timeRanger: any,
  timeout: any,
  _formRef: any,
  categoryList: any,
  staffList: any,
  isBackScreen: any,
  arrIdMenuProp: any,
  staffListProp: any,
  categoryListProp: any,
  paramEvent: any,
  chooseEvent: any,
  arrEvent: any,
  eventListProp: any,
  arrayDateEvent: any,
  arrTimeEvent: any,
  eventTimeProp: any,
  eventDateProp: any,
  paramEventTimeId: number,
  eventProp: any,
  arrayDateEventBooking: any,
  couponList: any,
  couponListProp: any,
  coupon: any,
  couponSelected: any
) => {
  const route = useRoute();
  const router = useRouter();
  const meStore = useMeStore();
  if (isBackScreen.value) {
    if (storeProp.value?.model_has_type?.type_id === RESTAURANT) {
      //SET data when back screen
      courses.value = arrCourses.value;
      store.value = storeProp.value;
      categoriesSeat.value = arrSeats.value;
      couponList.value = couponListProp.value;
      couponSelected.value = coupon.value;
    } else if (
      GROUP_TYPE_STORE.SAME.includes(storeProp.value?.model_has_type?.type_id)
    ) {
      //SET data when back screen
      courses.value = arrCourses.value;
      store.value = storeProp.value;
      staffList.value = staffListProp.value;
      categoryList.value = categoryListProp.value;
    } else {
      arrEvent.value = eventListProp.value;
      arrayDateEvent.value = eventDateProp.value;
      arrTimeEvent.value = eventTimeProp.value;
      store.value = storeProp.value;
      chooseEvent.value = eventProp.value;
      arrayDateEventBooking.value = eventDateProp.value;
      couponList.value = couponListProp.value;
      couponSelected.value = coupon.value;
    }
  } else {
    const provider = useCookie(persistKeys.TYPE_LOGIN);
    const source = useCookie(persistKeys.BOOKING_SOURCE);
    if (
      Number(source.value) === BOOKING_SOURCE.LINE &&
      provider.value === TYPE_SOCIAL.LINE
    ) {
      formData.remind = REMIND_LINE;
    } else {
      formData.remind = REMIND_EMAIL;
    }
    if (paramCourse) {
      try {
        chooseCourse.value = (
          await CourseRequest.show<Course>(paramCourse, true)
        )?.data;

        store.value = (
          await StoreRequest.show<Store>(chooseCourse.value.store_id)
        )?.data;

        courses.value = (
          await CourseRequest.getAllCourseByStore<Course[]>(
            store.value.id,
            true
          )
        )?.data;

        // formData.course_id = paramCourse;
      } catch (e: any) {
        if (e?.response?.status === STATUS_CODE.AUTHENTICATION) {
          await router.push({ name: "login" });
        } else {
          await router.push("/404");
        }
      }
    } else if (paramEvent) {
      try {
        chooseEvent.value = (
          await EventRequest.show<EventInterface>(paramEvent)
        )?.data;

        store.value = (
          await StoreRequest.show<Store>(chooseEvent.value.store_id)
        )?.data;
        arrEvent.value = (
          await EventRequest.getAllEvent<EventInterface[]>({
            all: true,
            store_id: chooseEvent.value.store_id,
            published: STATUS_TYPE.PUBLIC,
          })
        ).data;
        formData.event_id = paramEvent;
        formData.time_event_id = paramEventTimeId;
      } catch (e: any) {
        if (e?.response?.status === STATUS_CODE.AUTHENTICATION) {
          await router.push({ name: "login" });
        } else {
          // await router.push("/404");
        }
      }
    } else if (paramStore) {
      try {
        store.value = (await StoreRequest.show<Store>(paramStore))?.data;
        if (
          GROUP_TYPE_STORE.SAME.includes(store.value.model_has_type?.type_id) ||
          GROUP_TYPE_STORE.RESTAURANT.includes(
            store.value.model_has_type?.type_id
          )
        ) {
          courses.value = (
            await CourseRequest.getAllCourseByStore<Course[]>(paramStore, true)
          )?.data;
        } else {
          arrEvent.value = (
            await EventRequest.getAllEvent<EventInterface[]>({
              all: true,
              store_id: store.value.id,
              published: STATUS_TYPE.PUBLIC,
            })
          ).data;
        }
      } catch (e: any) {
        if (e?.response?.status === STATUS_CODE.AUTHENTICATION) {
          await router.push({ name: "login" });
        } else {
          await router.push("/404");
        }
      }
    }
  }

  if (store.value?.id && !isBackScreen.value) {
    const dataName = (
      await bookingRequest.getNameLastBooking<{
        order_first_name: string;
        order_last_name: string;
        order_first_name_kana: string;
        order_last_name_kana: string;
        order_email: string;
        order_phone_number: string;
      }>(store.value.id)
    ).data;
    formData.order_first_name =
      dataName?.order_first_name || meStore?.info?.first_name;
    formData.order_last_name =
      dataName?.order_last_name || meStore?.info?.last_name;
    formData.order_first_name_kana =
      dataName?.order_first_name_kana || meStore?.info?.first_name_kana;
    formData.order_last_name_kana =
      dataName?.order_last_name_kana || meStore?.info?.last_name_kana;
    formData.order_email = dataName?.order_email || meStore?.info?.email;
    formData.order_phone_number =
      dataName?.order_phone_number || meStore?.info?.phone_number;
  }

  if (
    store.value.id &&
    !isBackScreen.value &&
    GROUP_TYPE_STORE.SAME.includes(store.value?.model_has_type?.type_id)
  ) {
    categoryList.value = (
      await CategoryRequest.getAllCategoryByStore(store.value.id, true)
    )?.data;
  }

  if (
    route.query?.date_booking &&
    moment(route.query?.date_booking, "YYYYMMDD").isValid()
  ) {
    if (
      GROUP_TYPE_STORE.SAME.includes(store.value?.model_has_type?.type_id) ||
      GROUP_TYPE_STORE.RESTAURANT.includes(store.value?.model_has_type?.type_id)
    ) {
      const currentDay = moment(
        moment(route.query?.date_booking, "YYYYMMDD")
      ).weekday();
      if (
        moment(route.query?.date_booking, "YYYYMMDD").format("YYYYMMDD") >=
          moment().format("YYYYMMDD") &&
        store.value?.opening_times.some(
          (item) => item.day_of_week === currentDay
        )
      ) {
        formData.dateSelect = moment(
          route.query?.date_booking,
          "YYYYMMDD"
        ).format("YYYY-MM-DD");
      } else {
        formData.dateSelect = "";
      }
    } else {
      formData.dateSelect = moment(
        route.query?.date_booking,
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      formData.orderTime = moment(route.query?.date_booking, "YYYYMMDD").format(
        "YYYY-MM-DD"
      );
    }
  }

  // check default menu
  if (
    route.query?.menu_id &&
    categoryList.value.length &&
    GROUP_TYPE_STORE.SAME.includes(store.value?.model_has_type?.type_id)
  ) {
    const check = categoryList.value.some((category: any) =>
      category.menus.some((menu: any) => menu.id === +route.query?.menu_id)
    );
    if (check && !isBackScreen.value) {
      arrIdMenuProp.value = [+route.query?.menu_id];
    }
  }
};

export const setDataWhenBackScreen = (
  formDataProp: any,
  formData: any,
  categorySeatProp: any,
  chooseCourse: any,
  courses: any,
  chooseStaff: any,
  staffList: any,
  arrIdMenuProp: any,
  typeStore: any,
  arrTimeEvent: any,
  chooseEvent: any
) => {
  if (formDataProp.value) {
    formData.order_time = formDataProp.value.order_time;
    formData.order_first_name = formDataProp.value.order_first_name;
    formData.order_last_name = formDataProp.value.order_last_name;
    formData.order_email = formDataProp.value.order_email;
    formData.order_phone_number = formDataProp.value.order_phone_number;
    formData.order_memo = formDataProp.value.order_memo;
    formData.cancel_policy = formDataProp.value.cancel_policy;
    formData.payment_type = formDataProp.value.payment_type;
    formData.coupon_code = formDataProp.value.coupon_code;
    formData.note = formDataProp.value.note;
    formData.remind = formDataProp.value.remind;
    formData.order_first_name_kana = formDataProp.value.order_first_name_kana;
    formData.order_last_name_kana = formDataProp.value.order_last_name_kana;
    if (formData.order_time) {
      const timeArr = formData.order_time?.split(" ");
      formData.dateSelect = timeArr[0];
      formData.timeSelect = timeArr[1];
    }
    if (typeStore.value === RESTAURANT) {
      formData.number_adult = formDataProp.value.number_adult;
      formData.number_children = formDataProp.value.number_children;
      formData.course_id = formDataProp.value.course_id;
      formData.seat_type_id = categorySeatProp.value || null;
      chooseCourse.value = courses.value.find(
        (item: any) => item.id === formData.course_id
      );
    } else if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
      formData.course_id = formDataProp.value.course_id;
      formData.staff_id = formDataProp.value.staff_id || null;
      chooseCourse.value = courses.value.find(
        (item: any) => item.id === formData.course_id
      );
      chooseStaff.value = staffList.value.find(
        (item: any) => item.id === formData.staff_id
      );
      arrIdMenuProp.value = formDataProp.value.arrMenuSelected.map(
        (item: any) => item.id
      );
    } else {
      formData.event_id = formDataProp.value.event_id;
      formData.time_event_id = formDataProp.value.time_event_id;
      formData.number_adult = formDataProp.value.number_adult;
      formData.number_children = formDataProp.value.number_children;
      chooseEvent.value = arrTimeEvent.value.find(
        (item: any) =>
          item.event.id === formData.event_id &&
          item.item.id === formData.time_event_id
      );
    }
  }
};

export const customerBookingRestaurant = async (
  isInvalidTime,
  formData,
  form,
  categoriesSeat,
  store,
  courses,
  chooseCourse,
  userId,
  total,
  bookingSource,
  emits,
  typeStore,
  messInvalidCoupon,
  couponSelected,
  disabledButton?: boolean,
  couponList?: any
) => {
  isInvalidTime.value = !(formData.dateSelect && formData.timeSelect);
  formData.order_time = `${formData.dateSelect} ${formData.timeSelect}`.trim();
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid && !isInvalidTime.value) {
      if (disabledButton) {
        return true;
      }
      let isSelect = true;
      if (!formData.seat_type_id) {
        isSelect = false;
        formData.seat_type_id = categoriesSeat.value?.[0]?.id;
      }
      const data = {
        form: {
          ...customTrimValue(formData),
          store_id: store.value.id,
          booking_user_id: userId,
          status: chooseCourse.value.payment_type,
          source: bookingSource,
          price_adult: chooseCourse.value?.price || 0,
          price_children: chooseCourse.value?.price_children || 0,
          typeStore: typeStore,
        },
        course: chooseCourse.value,
        store: store.value,
        coupon: couponSelected.value,
        amount: total.value,
        arrCourses: courses.value,
        arrSeats: categoriesSeat.value,
        isSelectSeat: isSelect,
        couponList: couponList.value,
      };

      emits("confirmBooking", data);
    }
  });
};

export const customerBookingSalon = async (
  isInvalidTime,
  formData,
  form,
  store,
  courses,
  chooseCourse,
  chooseStaff,
  categoryList,
  staffList,
  arrMenuIdSelected,
  userId,
  total,
  bookingSource,
  emits,
  typeStore,
  disabledButton?: boolean
) => {
  isInvalidTime.value = !(formData.dateSelect && formData.timeSelect);
  formData.order_time = `${formData.dateSelect} ${formData.timeSelect}`.trim();
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid && !isInvalidTime.value && !disabledButton) {
      const arrMenuItemSelected = [];
      categoryList.value.forEach((category) => {
        category.menus.forEach((menu) => {
          arrMenuIdSelected.value.includes(menu.id) &&
            arrMenuItemSelected.push(menu);
        });
      });
      if (staffList.value.length === 0) {
        return true;
      }
      if (!formData.course_id && !arrMenuItemSelected.length) {
        if (typeStore !== SALON) {
          messageError(t("choose_course_menu"));
          return false;
        } else {
          messageError(t("choose_coupon_menu"));
          return false;
        }
      }

      const isSelect = true;
      const data = {
        form: {
          ...customTrimValue(formData),
          store_id: store.value.id,
          booking_user_id: userId,
          status: RESERVATION_TYPE.INSTANT,
          source: bookingSource,
          arrMenuSelected: arrMenuItemSelected,
          typeStore: typeStore,
        },
        chooseStaff: chooseStaff.value,
        course: chooseCourse.value,
        store: store.value,
        amount: total.value,
        arrCourses: courses.value,
        arrStaff: staffList.value,
        arrCategory: categoryList.value,
        isSelectSeat: isSelect,
      };

      emits("confirmBooking", data);
    }
  });
};

export const customerBookingEvent = async (
  formData: any,
  formRef: any,
  store: any,
  emits: any,
  bookingSource: any,
  userId: any,
  choseEvent: any,
  total: any,
  eventList: any,
  typeStore: number,
  couponSelected: any,
  arrTimeEvent: any,
  arrDateEvent: any,
  arrayEvent: any,
  couponList: any
) => {
  if (!formRef) return;
  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      if (eventList.value.length === 0 || !choseEvent.value) {
        return true;
      }

      const data = {
        form: {
          ...customTrimValue(formData),
          store_id: store.value.id,
          booking_user_id: userId,
          status: choseEvent.reservation_type,
          source: bookingSource,
          price_adult: choseEvent.value?.event?.price || 0,
          price_children: choseEvent.value?.event?.price_children || 0,
          typeStore: typeStore,
          order_time:
            choseEvent.value?.item?.date + " " + choseEvent.value?.item?.start,
        },
        choseEvent: choseEvent.value,
        store: store.value,
        amount: total.value,
        coupon: couponSelected.value,
        arrTimeEvent: arrTimeEvent.value,
        arrDateEvent: arrDateEvent.value,
        arrayEvent: arrayEvent.value,
        couponList: couponList.value,
      };
      emits("confirmBooking", data);
    }
  });
};
