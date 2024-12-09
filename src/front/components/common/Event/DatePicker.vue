<template>
  <div v-loading="loading" class="calendar">
    <client-only>
      <el-date-picker
        v-model="activeDate"
        value-format="YYYYMMDD"
        type="date"
        :teleported="false"
        :disabled-date="disableDate"
        class="input-date-event"
        popper-class="custom-popper-date-event"
        @panel-change="changeMonth"
      >
        <template #default="cell">
          <div
            v-if="isNotFull(cell)"
            class="cell"
            :class="{
              'current-booking': isBooking(cell),
              current: isCurrent(cell),
            }"
            @click="changeDate(cell)"
          >
            <div class="text">{{ cell.text }}</div>
            <div class="icon">
              <IconEllipse />
            </div>
          </div>
          <div
            v-else
            class="cell next-cell"
            :class="{
              current: isCurrent(cell),
              'current-booking': isBooking(cell),
            }"
          >
            <div class="text">{{ cell.text }}</div>
            <div v-if="isFull(cell)" class="icon"><IconClose /></div>
            <div v-if="isHoliday(cell)" class="icon"><IconLine /></div>
          </div>
        </template>
      </el-date-picker>
    </client-only>
    <common-event-modal
      v-if="dialogModal && dayBooking && eventId"
      :data-time="dayBooking"
      :event-id="eventId"
      :dialog-visible="dialogModal"
      @handle-booking="handleBooking"
      @handle-close="handleClose"
    />
  </div>
</template>

<script lang="ts" setup>
import moment, { Moment } from "moment";
import { onMounted, ref, toRefs } from "vue";
import bookingGuestRequest from "~/../../src/shared/requests/front/booking";

interface Prop {
  eventId: number;
  dateMonth?: string;
}

const emits = defineEmits(["handleBooking"]);

const props = withDefaults(defineProps<Prop>(), {
  eventId: 0,
  dateMonth: moment().format("YYYY-MM-DD"),
});
const { eventId, dateMonth } = toRefs(props);
const dialogModal = ref(false);
const activeDate = ref(dateMonth.value || moment().format("YYYY-MM-DD"));
const dateEvent = ref<any[]>([]);
const dayBooking = ref();
const loading = ref(true);

const handleBooking = (
  event_id: number,
  date_booking: string,
  event_time_id: number
) => {
  emits("handleBooking", [event_id, date_booking, event_time_id]);
};

const isFull = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return (
    dateEvent.value.find(
      (item: any) =>
        !item.status && !item.day_off && moment(dateFormat).isSame(item.date)
    ) && moment(dateFormat).isSameOrAfter(moment().format("YYYY-MM-DD"))
  );
};

const isNotFull = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return (
    dateEvent.value.find(
      (item: any) =>
        item.status &&
        !item.day_off &&
        moment(dateFormat).isSame(moment(item.date).format("YYYY-MM-DD"))
    ) && moment(dateFormat).isSameOrAfter(moment().format("YYYY-MM-DD"))
  );
};

const disableDate = (date: Moment) => {
  return (
    moment(date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD")) ||
    isFull({ dayjs: moment(date) }) ||
    !dateEvent.value.find(
      (item: any) =>
        item.status &&
        moment(date).isSame(moment(item.date).format("YYYY-MM-DD"))
    )
  );
};

const changeMonth = async (date: Moment) => {
  activeDate.value = moment(date).format("YYYY-MM-DD");
  await getListDateEvent();
};

const changeDate = ({ dayjs }: any) => {
  dayBooking.value = dayjs.format("YYYY-MM-DD");
  dialogModal.value = true;
};

const isHoliday = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return (
    dateEvent.value.find(
      (item: any) =>
        !item.status && item.day_off && moment(dateFormat).isSame(item.date)
    ) && moment(dateFormat).isSameOrAfter(moment().format("YYYY-MM-DD"))
  );
};

const handleClose = () => {
  dayBooking.value = "";
  dialogModal.value = false;
};

const getListDateEvent = async () => {
  try {
    loading.value = true;
    dateEvent.value = (
      await bookingGuestRequest.getDateEvent<any[]>({
        event_id: eventId.value,
        date: moment(activeDate.value).format("YYYY-MM"),
      })
    ).data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const isCurrent = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return moment(dateFormat).isSame(moment().format("YYYY-MM-DD"));
};

const isBooking = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return dayBooking.value ? moment(dateFormat).isSame(dayBooking.value) : false;
};

onMounted(async () => {
  await getListDateEvent();
});
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/event/date";
</style>
