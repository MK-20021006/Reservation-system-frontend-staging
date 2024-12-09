<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :before-close="handleClose"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="title"
        @close="handleClose"
      >
        <el-scrollbar max-height="400px">
          <div v-loading="loadingModal" class="show-time">
            <div class="header">
              <div class="time">{{ $t("time_zone") }}</div>
              <div class="fee">{{ $t("booking.fee") }}</div>
              <div class="people">{{ $t("number_of_people_left") }}</div>
              <div class="action">{{ $t("reserve_2") }}</div>
            </div>
            <div v-for="item in data" :key="item" class="content">
              <div class="time">
                <span class="title"> {{ formatTime(item.item.start) }} ~</span>
                {{ formatTime(item.item.end) }}
              </div>
              <div class="fee">
                <template v-if="item.event?.fee_type === TYPE_FEE.SEX">
                  <div class="detail">
                    <span class="title">{{ $t("male") }}:</span>
                    {{ priceDisplay(item.event?.price) || 0 }}{{ $t("yen") }}
                  </div>
                  <div class="detail">
                    <span class="title"> {{ $t("female") }}:</span>
                    {{ priceDisplay(item.event?.price_children) || 0
                    }}{{ $t("yen") }}
                  </div>
                </template>
                <template v-else>
                  <div class="detail">
                    <span class="title">{{ $t("adult") }}:</span>
                    {{ priceDisplay(item.event?.price) || 0 }}{{ $t("yen") }}
                  </div>
                  <div class="detail">
                    <span class="title">{{ $t("child") }}:</span>
                    {{ priceDisplay(item.event?.price_children) || 0
                    }}{{ $t("yen") }}
                  </div>
                </template>
              </div>
              <div class="people flex-end">
                {{ priceDisplay(item.total_available) }}
              </div>
              <div
                v-if="
                  item.total_available > 0 &&
                  checkTimeBooking(item.item.date, item.item.start)
                "
                class="action flex-center action-pc"
              >
                <ButtonRed
                  :name="$t('process_to_reservation')"
                  @click="
                    handleBooking(item.event?.id, item.item.date, item.item.id)
                  "
                />
              </div>
              <div
                v-if="
                  item.total_available > 0 &&
                  checkTimeBooking(item.item.date, item.item.start)
                "
                class="action flex-center action-mobile"
              >
                <ButtonRed
                  :name="$t('process_to_reservation_text')"
                  @click="
                    handleBooking(item.event?.id, item.item.date, item.item.id)
                  "
                />
              </div>
            </div>
          </div>
        </el-scrollbar>
        <template #footer>
          <button-white :name="$t('button.cancel')" @click="handleClose" />
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, toRefs } from "vue";
import bookingGuestRequest from "~/../../src/shared/requests/front/booking";
import { ref } from "vue";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import { formatTime } from "~/../../src/shared/utils/format";
import priceDisplay from "~/../../src/shared/utils/price";
import { TYPE_FEE } from "~/../../src/shared/constants/event";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import moment from "moment";
import { getDayByDate } from "~/../../src/shared/utils";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";

interface Prop {
  dialogVisible: boolean;
  dateMonth?: string;
  width?: string;
  showClose?: boolean;
  dataTime: string;
  eventId: number;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  dateMonth: "",
  nameCancel: "",
  nameConfirm: "",
  width: "90%",
  showClose: true,
  dataTime: "",
});
const loadingModal = ref(true);
const { dialogVisible, dateMonth, width, dataTime, eventId } = toRefs(props);
const emits = defineEmits(["handleClose", "handleBooking"]);
const handleClose = () => {
  emits("handleClose");
};

const title = computed(() => {
  return (
    moment(dataTime.value).format("MM月DD (") +
    getDayByDate(dataTime.value) +
    ")"
  );
});

const checkTimeBooking = (date: string, start_time: string) => {
  const time = moment(date).format("YYYY-MM-DD") + " " + start_time;
  return moment(time, "YYYY-MM-DD HH:mm").isAfter(
    moment().format("YYYY-MM-DD HH:mm")
  );
};

const data = ref<any[]>([]);
const getTimeEvent = async () => {
  try {
    loadingModal.value = true;
    data.value = (
      await bookingGuestRequest.getTimeEvent<any[]>({
        event_id: eventId.value,
        date: dataTime.value,
      })
    ).data;
  } catch (_e) {
  } finally {
    loadingModal.value = false;
  }
};

const handleBooking = (
  event_id: number,
  date: string,
  event_time_id: number
) => {
  emits("handleBooking", event_id, date, event_time_id);
};

onMounted(async () => {
  await getTimeEvent();
});
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/event/modal";
</style>
