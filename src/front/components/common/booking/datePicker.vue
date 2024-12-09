<template>
  <div v-loading="loading" class="calendar">
    <client-only>
      <el-date-picker
        v-model="modelValue"
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
  </div>
</template>

<script lang="ts" setup>
import moment, { Moment } from "moment";
import { toRefs } from "vue";
import { EventDateInterface } from "~/../../src/front/models";

interface Prop {
  dateEvent: EventDateInterface[];
  loading?: boolean;
  modelValue?: string;
}

const emits = defineEmits([
  "handleChangeDate",
  "handleChangeMonth",
  "update:modelValue",
]);

const props = withDefaults(defineProps<Prop>(), {
  dateEvent: () => [],
  loading: false,
  modelValue: "",
});
const { dateEvent, modelValue, loading } = toRefs(props);

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
        moment(dateFormat).isSame(
          moment(item.date, '"YYYY-MM-DD').format("YYYY-MM-DD")
        )
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

const isHoliday = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return (
    dateEvent.value.find(
      (item: any) =>
        !item.status && item.day_off && moment(dateFormat).isSame(item.date)
    ) && moment(dateFormat).isSameOrAfter(moment().format("YYYY-MM-DD"))
  );
};

const changeMonth = async (date: Moment) => {
  emits("handleChangeMonth", moment(date).format("YYYY-MM"));
};

const changeDate = ({ dayjs }: any) => {
  emits("handleChangeDate", dayjs.format("YYYY-MM-DD"));
};

const isCurrent = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return moment(dateFormat).isSame(moment().format("YYYY-MM-DD"));
};

const isBooking = ({ dayjs }: any) => {
  const dateFormat = dayjs.format("YYYY-MM-DD");
  return modelValue.value ? moment(dateFormat).isSame(modelValue.value) : false;
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/event/date";
</style>
