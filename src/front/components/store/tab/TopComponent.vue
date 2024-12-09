<template>
  <div v-loading="loading" class="top">
    <div class="top-header">
      <StoreSliderImageDetail v-if="data" :data="data.model_has_file" />
      <div class="top-header__title">
        {{ data?.introduction }}
      </div>
      <div class="top-header__food">
        <div>{{ data?.description }}</div>
      </div>
    </div>
    <div
      v-if="!GROUP_TYPE_STORE.EVENT.includes(data?.model_has_type?.type_id)"
      class="top-course"
    >
      <div v-if="total > 0" class="top-course__title">
        <StoreTitle
          :title="
            data?.model_has_type?.type_id !== SALON
              ? $t('course')
              : $t('coupon')
          "
        />
      </div>
      <StoreCourse
        :data="course"
        :type-store="data?.model_has_type?.type_id"
        :is-disabled="isDisabled"
        @handle-click="handleClick"
        @handle-detail="detailCourse"
        @handle-click-menu-course="handleClickMenuCourse"
        @handle-click-coupon-course="handleClickCouponCourse"
      />
      <div v-if="total > course.length" class="top-course-many">
        <ButtonCommon
          :name="
            data?.model_has_type?.type_id !== SALON
              ? $t('show_more_course')
              : $t('show_more_coupon')
          "
          background-color="#ffffff"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="143px"
          :disabled="loading || isDisabled"
          @click="showMoreCourse"
        />
        <div class="next" @click="showMorePhoto"><IconNext /></div>
      </div>
    </div>

    <div
      v-if="GROUP_TYPE_STORE.SAME.includes(data?.model_has_type?.type_id)"
      class="top-staff"
    >
      <div class="top-staff__title">
        <StoreTitle v-if="dataStaff.length > 0" :title="$t('staff')" />
      </div>
      <StoreStaffTop
        :staff="dataStaff"
        @handle-click-staff="handleClickStaff"
      />
      <div v-if="data?.staffs?.length > 5" class="top-staff-many">
        <ButtonCommon
          :name="$t('show_more_staff')"
          background-color="#ffffff"
          :disabled="isDisabled"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="143px"
          @click="showMoreStaff"
        />
        <div class="next" @click="showMoreStaff"><IconNext /></div>
      </div>
    </div>

    <div
      v-if="GROUP_TYPE_STORE.EVENT.includes(data?.model_has_type?.type_id)"
      class="top-event"
    >
      <div class="top-event__title">
        <StoreTitle v-if="dataEvent.length > 0" :title="$t('event')" />
      </div>
      <div class="list-event">
        <div
          v-for="detailEvent in dataEvent"
          :key="detailEvent.id"
          class="data-event"
        >
          <StoreEvent
            ref="_refEvent"
            :disabled="isDisabled"
            :detail-event="detailEvent"
            @handle-detail="handleDetailEvent"
            @handle-click="handleClickEvent"
            @handle-click-coupon-event="handleClickCouponEvent"
          />
          <common-event-date-picker
            v-if="idBooking && idBooking === detailEvent.id"
            class="event-calendar"
            :event-id="idBooking"
            @handle-booking="handleBookingEvent"
          />
        </div>
      </div>
      <div v-if="data?.events?.length > 4" class="top-event-many">
        <ButtonCommon
          :name="$t('show_more_event')"
          :disabled="isDisabled"
          background-color="#ffffff"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="143px"
          @click="showMoreEvent"
        />
        <div class="next" @click="showMoreEvent"><IconNext /></div>
      </div>
    </div>

    <div class="footer-course">
      <div class="">
        <StoreTitle
          v-if="totalPhoto > 0"
          :title="
            GROUP_TYPE_STORE.SAME.includes(data?.model_has_type?.type_id)
              ? $t('photo_gallery')
              : $t('photo')
          "
        />
      </div>
      <StoreImage :disabled="isDisabled" :data="photo" />
      <div v-if="totalPhoto > photo.length" class="top-course-many">
        <ButtonCommon
          :name="$t('show_more_photo')"
          background-color="#ffffff"
          :disabled="isDisabled"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="143px"
          @click="showMorePhoto"
        />
        <div class="next" @click="showMorePhoto"><IconNext /></div>
      </div>
    </div>

    <div class="store-review">
      <div class="top-review__title">
        <StoreTitle v-if="dataReview.length > 0" :title="$t('rate')" />
      </div>
      <div class="list-review-top">
        <store-comment :data="dataReview" />
      </div>
      <div v-if="totalReview > dataReview.length" class="top-review-many">
        <ButtonCommon
          :name="
            $t('show_more_review') +
            '(' +
            totalReview +
            $t('subject_unit') +
            ')'
          "
          background-color="#ffffff"
          :disabled="isDisabled"
          border-radius="6px"
          border="1px solid #E6E6E6"
          width="169px"
          @click="showMoreReview"
        />
        <div class="next" @click="showMoreReview"><IconNext /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonCommon from "../../../../shared/components/button/ButtonCommon.vue";
import {
  defineProps,
  toRefs,
  onMounted,
  ref,
  computed,
  onBeforeMount,
} from "vue";
import courseRequest from "~/../../src/shared/requests/front/course";
import storeGuestRequest from "~/../../src/shared/requests/front/store";
import { Course } from "~/../../src/front/models";
import { Photo } from "~/../../src/front/models";
import { DetailStore } from "~/../../src/front/models";
import { STATUS_TYPE } from "~/../../src/shared/constants/reservation";
import { SALON } from "~/../../src/shared/constants/category";
import CommentRequest from "~/../../src/shared/requests/CommentRequest";
import { ReviewInterface } from "~/../../src/front/models/review";
import { TYPE_PARAMS } from "~/../../src/shared/constants/booking";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  data: DetailStore;
  idStore: number | string;
  isDisabled: boolean;
}

const props = defineProps<Prop>();
const { data, idStore } = toRefs(props);
const photo = ref([]);
const totalPhoto = ref(0);
const course = ref([]);
const total = ref(0);
const page = ref(1);
const loading = ref(false);
const dataReview = ref<ReviewInterface[]>([]);
const totalReview = ref(0);
const idBooking = ref<number>(0);
const _refEvent = ref();
const emits = defineEmits([
  "handleClick",
  "showDetail",
  "showDataCourse",
  "showDataImage",
  "showMoreStaff",
  "showMoreReview",
  "handleClickMenuCourse",
  "handleClickStaff",
  "showMoreEvent",
  "handleClickEvent",
  "handleDetailEvent",
  "handleClickCouponCourse",
  "handleClickCouponEvent",
]);
const typeStore = computed(() => {
  return data.value?.model_has_type?.type_id;
});
const showMoreCourse = async () => {
  emits("showDataCourse");
};

const handleClickMenuCourse = (idCourse: number) => {
  emits("handleClickMenuCourse", idCourse);
};

const dataStaff = computed(() => {
  if (data.value && data.value.staffs?.length > 0) {
    return data.value.staffs.filter((item, index) => index < 5);
  }
  return [];
});

const dataEvent = computed(() => {
  if (data.value && data.value.events?.length > 0) {
    return data.value.events.filter((item, index) => index < 4);
  }
  return [];
});

const showMorePhoto = async () => {
  emits("showDataImage");
};

const showMoreReview = async () => {
  emits("showMoreReview");
};

const showMoreStaff = async () => {
  emits("showMoreStaff");
};

const handleClick = (id: number) => {
  emits("handleClick", id);
};

const detailCourse = (id: number) => {
  emits("showDetail", id);
};

const showMoreEvent = () => {
  emits("showMoreEvent");
};

const getListCourse = async (key?: boolean) => {
  const response = (
    await courseRequest.list<Course[]>(
      {
        store_id: idStore.value,
        limit: 4,
        page: page.value,
        status: STATUS_TYPE.PUBLIC,
        type: TYPE_PARAMS.BOOKING,
      },
      key
    )
  ).data;
  course.value = [...course.value, ...response.data];
  total.value = response.total;
};

const getListPhoto = async (key?: boolean) => {
  const response = (
    await storeGuestRequest.getImageStore<Photo[]>(
      idStore.value,
      {
        model: "all",
        limit: 12,
        page: page.value,
        order_by: "created_at",
        direct: "DESC",
      },
      key
    )
  ).data;
  photo.value = [...photo.value, ...response.data];
  totalPhoto.value = response.pagination.total;
};

const getListComment = async () => {
  const response = (
    await CommentRequest.listReview<ReviewInterface[]>({
      store_id: idStore.value,
      limit: 4,
      page: 1,
      order_by: "created_at",
      direct: "desc",
    })
  ).data;
  dataReview.value = response.data;
  totalReview.value = response.pagination?.total;
};

// SALON
const handleClickStaff = (idStaff: number) => {
  emits("handleClickStaff", idStaff);
};

// EVENT

const handleDetailEvent = (id: number) => {
  emits("handleDetailEvent", id);
};

const handleClickEvent = (id: number) => {
  idBooking.value = id;
};

const handleClickCouponCourse = (id: number, course_id: number) => {
  emits("handleClickCouponCourse", id, course_id);
};

const handleClickCouponEvent = ([
  eventId,
  dateBooking,
  eventTimeId,
  couponCode,
]: [number, string, number, string]) => {
  emits("handleClickCouponEvent", [
    eventId,
    dateBooking,
    eventTimeId,
    couponCode,
  ]);
};

const handleBookingEvent = ([event_id, date, start_time, end_time]: [
  number,
  string,
  string,
  string
]) => {
  emits("handleClickEvent", [event_id, date, start_time, end_time]);
};

onMounted(async () => {
  loading.value = true;
  await getListComment();
  if (!GROUP_TYPE_STORE.EVENT.includes(typeStore.value)) {
    await getListCourse();
  }
  await getListPhoto();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@mixin top-many {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@mixin next-mobile {
  display: flex;
  width: 30%;
  justify-content: flex-end;
  cursor: pointer;

  svg {
    cursor: pointer;
  }
}

@mixin top-menu-mobile {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
  margin-top: 8px;
}

@mixin el-button {
  .el-button {
    font-size: 12px;
    font-weight: 400;
  }
}

.top {
  .top-header {
    margin-bottom: 24px;

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

  .top-course {
    .top-course__title {
      margin-bottom: 24px;
    }

    .top-course-many {
      @include top-many;

      @include el-button;

      .next {
        display: none;
      }
    }
  }

  .top-staff {
    .top-staff__title {
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .top-staff-many {
      @include top-many;
      @include el-button;

      .next {
        display: none;
      }
    }
  }

  .footer-course {
    margin-top: 24px;

    .top-course-many {
      display: flex;
      justify-content: center;
      margin: 16px 0;
      @include el-button;

      .next {
        display: none;
      }
    }
  }

  .store-review {
    margin-top: 24px;

    .list-review-top {
      margin-top: 15px;
    }

    .top-review-many {
      display: flex;
      justify-content: center;
      margin: 16px 0;
      @include el-button;

      .next {
        display: none;
      }
    }
  }

  .top-event {
    .top-event__title {
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .list-event {
      .data-event {
        border-bottom: 1px solid #e4e4e4;
        padding: 24px 0;

        &:first-child {
          padding-top: 0;
        }

        .date-picker-calendar {
          margin-top: 16px;
        }
      }

      .event-calendar {
        margin-top: 34px;
      }
    }

    .top-event-many {
      @include top-many;
      @include el-button;

      .next {
        display: none;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .top {
    .top-header {
      display: none;
    }

    .top-course {
      .top-course-many {
        @include top-menu-mobile;

        .next {
          @include next-mobile;
        }
      }
    }

    .top-staff {
      .top-staff__title {
        margin-top: 10px;
        margin-bottom: 24px;
      }

      .top-staff-many {
        @include top-menu-mobile;

        .next {
          @include next-mobile;
        }
      }
    }

    .footer-course {
      margin-top: 10px;

      .top-course-many {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 16px;
        margin: 8px 0;

        .next {
          display: flex;
          width: 30%;
          justify-content: flex-end;

          svg {
            cursor: pointer;
          }
        }
      }
    }

    .store-review {
      .list-review-top {
        padding: 0 16px;
        margin-top: 15px;
      }

      .top-review-many {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 16px;
        margin: 8px 0;

        .next {
          display: flex;
          width: 30%;
          justify-content: flex-end;

          svg {
            cursor: pointer;
          }
        }
      }
    }

    .top-event {
      .list-event {
        padding: 0 16px;
      }
    }
  }
}
</style>
