<template>
  <div id="event">
    <div v-if="!idEvent" class="list-event">
      <div v-for="event in dataEvent" :key="event.id" class="data-event">
        <Event
          :detail-event="event"
          @handle-detail="handleDetailEvent"
          @handle-click="handleShowBookingEvent"
          @handle-click-coupon-event="handleClickCouponEvent"
        />
        <common-event-date-picker
          v-if="idBooking && idBooking === event.id"
          class="date-picker-calendar"
          :event-id="idBooking"
          @handle-booking="handleBookingEvent"
        />
      </div>
    </div>
    <EventDetail
      v-else-if="detailEvent"
      :detail-event="detailEvent"
      @handle-booking="handleBookingEvent"
      @handle-click-coupon-event="handleClickCouponEvent"
    />
  </div>
</template>

<script lang="ts" setup>
import Event from "~/../../src/front/components/store/Event.vue";
import EventDetail from "~/../../src/front/components/store/EventDetail.vue";
import EventRequest from "~/../../src/shared/requests/front/EventRequest";
import { onMounted, ref, toRefs, watch } from "vue";
import { useDeviceStore } from "~/../../src/front/store/device";

interface Prop {
  dataEvent: Event[];
  idEvent: number | null;
}

const idBooking = ref();

const props = withDefaults(defineProps<Prop>(), {
  dataEvent: () => [],
  idEvent: null,
});

const loading = ref(false);
const { dataEvent, idEvent } = toRefs(props);
const detailEvent = ref<Event>();
const deviceTable = useDeviceStore();

const emits = defineEmits([
  "handleDetailEvent",
  "handleBooking",
  "handleClickCouponEvent",
]);

const handleBookingEvent = ([event_id, date, start_time, end_time]: [
  number,
  string,
  string,
  string
]) => {
  emits("handleBooking", [event_id, date, start_time, end_time]);
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

const handleDetailEvent = (id: number) => {
  idBooking.value = id;
  emits("handleDetailEvent", id);
};

const handleShowBookingEvent = (id: number) => {
  idBooking.value = id;
};

const scrollTab = () => {
  const el = document.getElementById("event");
  if (el && el.offsetTop) {
    window.scrollTo({
      top: el.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }
};

const detailEventMenu = async (id: number) => {
  try {
    loading.value = true;
    detailEvent.value = (await EventRequest.show<Event>(id)).data;
  } catch (_) {
  } finally {
    loading.value = false;
  }
};

watch(idEvent, async (value) => {
  if (value) {
    await detailEventMenu(value);
  }
});

onMounted(async () => {
  if (idEvent.value) {
    await detailEventMenu(idEvent.value);
  }
  setTimeout(() => {
    scrollTab();
  }, 800);
});

defineExpose({
  scrollTab,
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.list-event {
  margin: 10px 0;

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
}

@include res("xs-only", $breakpoints-spec) {
  .list-event {
    padding: 0 16px;
  }
}
</style>
