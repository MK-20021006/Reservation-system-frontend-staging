<template>
  <div
    class="time-frame time-frame__restaurant"
    :start-time="props.data.start_time"
    :end-time="props.data.end_time"
    :class="[
      {
        'time-frame-tabelog':
          props.data.reservation?.crawl_site === SITE_TYPE_TABLELOG,
      },
      {
        'time-frame-gurunavi':
          props.data.reservation?.crawl_site === SITE_TYPE_GURUNABI,
      },
      {
        'time-frame-pepper-gourmet':
          props.data.reservation?.crawl_site === SITE_TYPE_HOTPEPPER,
      },
      {
        'time-frame-google':
          props.data.reservation?.crawl_site === SITE_TYPE_GOOGLE,
      },
    ]"
    @click="handleClick"
    @mouseover="() => (isShowToolTip = true)"
    @mouseleave="() => (isShowToolTip = false)"
  >
    <div class="user-name">
      {{ props.data.reservation?.order_name }}
    </div>
    <div class="seat-number">
      {{
        `${t("number_of_people")}：${
          Number(props.data.reservation.detail.number_adult) +
          Number(props.data.reservation.detail.number_children)
        }${t("name_2")}`
      }}
    </div>
    <div
      v-if="
        !props.data.reservation?.crawl_site ||
        props.data.reservation?.crawl_site === SITE_TYPE_SYSTEM
      "
      class="course"
    >
      {{
        `${t("store.course_name")}：${
          props.data.reservation?.detail?.course?.name
        }`
      }}
    </div>
    <!-- START Tooltip -->
    <div v-show="isShowToolTip" class="tooltip">
      <div class="user-name">
        {{ props.data.reservation?.order_name }}
      </div>
      <div class="seat-number">
        {{
          `${t("number_of_people")}：${
            Number(props.data.reservation.detail.number_adult) +
            Number(props.data.reservation.detail.number_children)
          }${t("name_2")}`
        }}
      </div>
      <div
        v-if="
          !props.data.reservation?.crawl_site ||
          props.data.reservation?.crawl_site === SITE_TYPE_SYSTEM
        "
        class="course"
      >
        {{
          `${t("store.course_name")}：${
            props.data.reservation?.detail?.course?.name
          }`
        }}
      </div>
    </div>
    <!-- END Tooltip -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ReservationRestaurant } from "../../../models/reservation";
import { useI18n } from "vue-i18n";
import { useRouter } from "nuxt/app";
import {
  SITE_TYPE_HOTPEPPER,
  SITE_TYPE_TABLELOG,
  SITE_TYPE_SYSTEM,
  SITE_TYPE_GURUNABI,
  SITE_TYPE_GOOGLE,
} from "~/../../src/shared/constants/siteCrawl";

const { t } = useI18n();
const router = useRouter();

type PropsType = {
  data: ReservationRestaurant;
};

const props = defineProps<PropsType>();
const isShowToolTip = ref<boolean>(false);

const handleClick = () => {
  router.push({
    name: "reservation-detail-id",
    params: { id: props.data.reservation_id },
  });
};
</script>

<style lang="scss" scoped>
@use "./day.scss";
</style>
