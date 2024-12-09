<template>
  <div v-loading="loading" class="container-event">
    <el-form
      ref="_refForm"
      :model="formEvent"
      :rules="formRuleEvent"
      class="left"
      label-width="160px"
      label-position="left"
    >
      <el-form-item :label="$t('event')" prop="name" :error="getError('name')">
        <input-text
          v-model="formEvent.name"
          :maxlength="MAX_LENGTH_EVENT_NAME"
        ></input-text>
      </el-form-item>
      <el-form-item
        class="company"
        :label="$t('company')"
        :error="getError('description')"
      >
        <input-text
          v-model="formEvent.description"
          :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
          type="textarea"
          :rows="3"
        ></input-text>
      </el-form-item>
      <el-form-item :label="$t('image')" class="image">
        <InputFile
          v-loading="loadingImage"
          :data="image_ids"
          :limit="limitImage"
          :placeholder="$t('store.placeholder_category_description')"
          @handle-remove-image="handleRemoveImage"
          @handle-change-image="handleImageChange"
        />
        <ImageTextDescription />
      </el-form-item>
      <el-form-item
        prop="number_seats"
        :label="$t('reservable_number')"
        :error="getError('number_seats')"
      >
        <input-number-text
          v-model="formEvent.number_seats"
          :min="MIN_SEAT_EVENT"
          :max="MAX_SEAT_EVENT"
        ></input-number-text>
        <div class="text-">({{ $t("front.placeholder_budget_to") }})</div>
      </el-form-item>
      <el-form-item
        prop="price"
        :label="$t('booking.fee')"
        :error="getError('price')"
        class="group-fee"
      >
        <el-radio-group
          v-model="formEvent.fee_type"
          class="ml-4"
          @change="changeTypeFee"
        >
          <el-radio
            v-for="type in typeFeeData"
            :key="type.value"
            :label="type.value"
          >
            {{ type.label }}
          </el-radio>
        </el-radio-group>
        <div v-if="formEvent.fee_type === TYPE_FEE.SEX" class="group-item-fee">
          <div class="item-fee">
            <el-form-item
              class="label-fee label-required"
              :label="$t('male')"
              prop="price_male"
            >
              <input-price
                v-model="formEvent.price_male"
                :max-price="MAX_FEE_EVENT"
              />
              <el-space size="10px"
                ><div>{{ $t("yen") }}</div>
                <div>({{ $t("tax_include") }})</div>
              </el-space>
            </el-form-item>
          </div>
          <div class="item-fee">
            <el-form-item
              class="label-fee label-required"
              :label="$t('female')"
              prop="price_female"
            >
              <input-price
                v-model="formEvent.price_female"
                :max-price="MAX_FEE_EVENT"
              />
              <el-space size="10px"
                ><div>{{ $t("yen") }}</div>
                <div>({{ $t("tax_include") }})</div>
              </el-space>
            </el-form-item>
          </div>
        </div>
        <div v-if="formEvent.fee_type === TYPE_FEE.AGE" class="group-item-fee">
          <div class="item-fee">
            <el-form-item
              class="label-fee label-required"
              :label="$t('adult')"
              prop="price_adult"
            >
              <input-price
                v-model="formEvent.price_adult"
                :max-price="MAX_FEE_EVENT"
              />
              <el-space size="10px"
                ><div>{{ $t("yen") }}</div>
                <div>({{ $t("tax_include") }})</div>
              </el-space>
            </el-form-item>
          </div>
          <div class="item-fee">
            <el-form-item
              class="label-fee label-required"
              :label="$t('child')"
              prop="price_child"
            >
              <input-price
                v-model="formEvent.price_child"
                :max-price="MAX_FEE_EVENT"
              />
              <el-space size="10px"
                ><div>{{ $t("yen") }}</div>
                <div>({{ $t("tax_include") }})</div>
              </el-space>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        class="group-select_date label-required"
        :label="$t('valid_period')"
        :error="getError('opening_times')"
      >
        <div
          v-for="(selectDateItem, index) in selectDate"
          :key="index"
          class="group-select_date-item"
        >
          <DateRange
            v-model="selectDate[index]"
            :index="index"
            :is-show-details="isShowDetail[index]"
            :disabled-date="disabledDate"
            :list-delete-date="listDeleteDate[index]"
            :list-date-disable="listDateDisable"
            :list-date-choose="listDateChoose[index]"
            :check-valid-date="checkValidDate"
            @show-modal="showModalSelectTime"
            @handle-close-date="handleCloseDate"
            @click="round = index"
          />
          <div
            v-if="selectDate.length !== 1"
            class="delete-date"
            @click="deleteDate(index)"
          >
            <IconDeleteTime />
            <span>{{ $t("button.delete") }}</span>
          </div>
          <SelectTime
            v-if="isShowModalSelectTime[index]"
            :dialog-visible="isShowModalSelectTime[index]"
            :date="selectDate[index]"
            :index="index"
            :list-date-choose="listDateChoose[index]"
            :is-change-date="isChangeDate"
            :data-select-time="dataSelectTime[index]"
            :error-time="errorTime"
            :is-loading-check-date="isLoadingCheckDate"
            @handle-close="handleCloseSelectTime"
            @handle-submit="handleSubmitSelectTime"
          >
          </SelectTime>
        </div>
        <div class="add-date" @click="addDate">
          <IconAddTime /> <span>{{ $t("button.addition") }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('place')">
        <input-text v-model="formEvent.place"></input-text>
      </el-form-item>
      <el-form-item
        prop="online_link"
        :label="$t('online_link')"
        :error="getError('online_link')"
      >
        <input-text
          v-model="formEvent.online_link"
          class="input-link"
        ></input-text>
        <ButtonLightBlue
          v-if="storeData.isSettingZoom"
          :loading="loadingZoom"
          :name="$t('zoom_meeting_automatic_issue')"
          class="zoom-button"
          @click="generateLinkHandle"
        ></ButtonLightBlue>
      </el-form-item>
      <el-form-item prop="reservation_type" :label="$t('reservation_type')">
        <el-radio-group
          v-for="item in reservationTypeOptions"
          :key="item.value"
          v-model="formEvent.reservation_type"
        >
          <el-radio :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('posting_status')">
        <el-checkbox
          v-model="formEvent.published"
          :label="$t('publish')"
          :true-label="STATUS_TYPE.PUBLIC"
          :false-label="STATUS_TYPE.PRIVATE"
        ></el-checkbox>
      </el-form-item>
      <!--Cancel checkbox-->
      <el-form-item
        v-if="storeData?.info?.store?.is_setting_cancel"
        prop="is_setting_cancel"
        :label="$t('local_payment_authorization')"
        :error="getError('is_setting_cancel')"
      >
        <el-checkbox
          v-model="formEvent.is_setting_cancel"
          class="w-100"
          :label="$t('permission')"
          :false-label="STATUS_IS_SETTING_CANCEL.FALSE"
          :true-label="STATUS_IS_SETTING_CANCEL.TRUE"
        />
      </el-form-item>
      <!--END Cancel checkbox-->
      <el-form-item :label="$t('reservation_deadline_setting')">
        <div class="deadline-booking">
          <el-checkbox
            v-model="formEvent.has_time_per"
            :false-label="HAS_CHECK_TIME_PER.FALSE"
            :true-label="HAS_CHECK_TIME_PER.TRUE"
            :label="$t('enable')"
            @change="handleChangeTimePer"
          />
          <!--          <span class="max-24h">{{ $t("max_24h") }}</span>-->
        </div>
        <div
          v-if="formEvent.has_time_per === HAS_CHECK_TIME_PER.TRUE"
          class="time-setting-booking"
        >
          <ClientOnly>
            <el-select
              v-model="formEvent.day_reservation"
              placeholder=" "
              :teleported="false"
            >
              <el-option
                v-for="(day, key) in arrayDaySetting"
                :key="key"
                :label="day.label"
                :value="day.value"
              />
            </el-select>
          </ClientOnly>
          <span class="text text-day">{{ $t("day_before") }}</span>
          <ClientOnly>
            <el-select
              v-model="formEvent.hour_reservation"
              placeholder=" "
              :teleported="false"
            >
              <template v-for="(timeValue, key) in dataHour" :key="key">
                <el-option
                  v-if="timeValue !== MAX_HOUR"
                  :label="timeValue"
                  :value="timeValue"
                />
              </template>
            </el-select>
          </ClientOnly>
          <span class="text text-hour">{{ $t("hour") }}</span>
          <ClientOnly>
            <el-select
              v-model="formEvent.minute_reservation"
              placeholder=" "
              :teleported="false"
            >
              <el-option
                v-for="(timeValue, key) in dataMinute"
                :key="key"
                :label="timeValue"
                :value="timeValue"
              />
            </el-select>
          </ClientOnly>
          <span class="text">{{ $t("minute") }}</span>
          <span>{{ $t("upto") }}</span>
        </div>
      </el-form-item>
      <el-form-item v-if="props.update" :label="$t('created_at')">
        <input-date
          v-model="formEvent.created_at"
          :is-disable="true"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        ></input-date>
      </el-form-item>
      <el-form-item v-if="props.update" :label="$t('updated_at')">
        <input-date
          v-model="formEvent.updated_at"
          :is-disable="true"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        ></input-date>
      </el-form-item>
    </el-form>
    <ModalConfirm
      :dialog-visible="isShowModalConfirm"
      :title="$t('title_delete')"
      :name-cancel="$t('button.cancel')"
      :name-confirm="$t('button.confirm')"
      :loading="isLoadingAction"
      @handle-close="handleClose"
      @handle-confirm="handleConfirm"
    />
    <ConfirmPlan
      :dialog-visible="isShowModalPlanConfirm"
      @handle-close="handleCloseModalPlan"
      @handle-confirm="handleConfirmModalPlan"
    />
  </div>
</template>
<script lang="ts" setup>
import InputFile from "~/../../src/shared/components/input/File.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import {
  reservationTypeOptions,
  STATUS_TYPE,
  STATUS_IS_SETTING_CANCEL,
  HAS_CHECK_TIME_PER,
  TIME_DEFAULT_SETTING,
  DAY_DEFAULT_SETTING,
} from "~/../../src/shared/constants/reservation";
import {
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_EVENT_NAME,
  MIN_SEAT_EVENT,
  MAX_SEAT_EVENT,
  MAX_FEE_EVENT,
  MAX_HOUR,
  MAX_DAY,
} from "~/../../src/shared/utils/validate";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { DataFile } from "~/../../src/shared/models";

import eventRules from "~/../../src/store/validates/event";
import moment from "moment/moment";
import {
  createError,
  createSuccess,
  deleteError,
  deleteSuccess,
  messageError,
  updateError,
  updateSuccess,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import { useRouter } from "nuxt/app";
import { FormInstance } from "element-plus";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import { useRoute } from "#imports";
import { customTrimValue, formatValuePrice } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { DEFAULT_LENGTH_MEETING } from "~/../../src/shared/utils/validate";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { StoreStepActive } from "~/../../src/store/models";
import { useAuthStore } from "~/../../src/store/store/store";
import storeRequest from "~/../../src/shared/requests/StoreRequest";
import DateRange from "~/../../src/shared/components/input/DateRange.vue";
import SelectTime from "~/../../src/shared/components/modal/SelectTime.vue";
import { TYPE_FEE, typeFeeData } from "~/../../src/shared/constants/event";
import { formatDate } from "../../../shared/utils/format";
import { getDaysArray } from "~/../../src/shared/utils";
import {
  getHourAllDay,
  getMinuteAllDay,
  getArrayDaySetting,
  getTimeByDay,
  getDayHourTime,
} from "~/../../src/shared/utils";

interface Prop {
  update: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  update: false,
});
const _refForm = ref();
const { formEvent, formRuleEvent } = eventRules();
const image_ids = ref([]);
const limitImage = ref(useMeStore().getMaxImageByPlan);
const isLoadingAction = ref(false);
const loadingImage = ref(false);
const responseEvent = ref();
const loading = ref(false);
const loadingZoom = ref(false);
const isShowModalSelectTime = ref([false]);
const isShowModalConfirm = ref(false);
const router = useRouter();
const route = useRoute();
const formSubmit = ref();
const errorsForm = ref({});
const isShowModalPlanConfirm = ref(false);
const lengthImageUpdate = ref(0);
const authStore = useAuthStore();
const storeData = useMeStore();
const isChangeDate = ref(true);
const isShowDetail = ref([false]);
const dataSelectTime = ref([]);
const listDeleteDate = ref([]);
const selectDate = ref([["", ""]]);
const errorTime = ref("");
const isLoadingCheckDate = ref(false);
const listDateChoose = ref([]);
const round = ref(0);
const dataHour = ref<number[]>([]);
const dataMinute = ref<number[]>([]);
const arrayDaySetting = getArrayDaySetting();
dataHour.value = getHourAllDay();
dataMinute.value = getMinuteAllDay;

const changeTypeFee = () => {
  if (formEvent.fee_type === TYPE_FEE.SEX) {
    _refForm.value.clearValidate(["price_children", "price_adult"]);
  } else {
    _refForm.value.clearValidate(["price_male", "price_female"]);
  }
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const addDate = () => {
  isShowDetail.value.push(false);
  selectDate.value.push(["", ""]);
  dataSelectTime.value.push([]);
  listDateChoose.value.push([]);
  listDeleteDate.value.push([]);
  isShowModalSelectTime.value.push(false);
};

const deleteDate = (index: number) => {
  listDateDisable.value = listDateDisable.value.length
    ? listDateDisable.value.filter(
        (item) =>
          !listDateChoose.value[index]?.includes(item) &&
          !listDeleteDate.value[index]?.includes(item)
      )
    : [];
  selectDate.value.splice(index, 1);
  isShowDetail.value.splice(index, 1);
  listDateChoose.value.splice(index, 1);
  dataSelectTime.value.splice(index, 1);
  listDeleteDate.value.splice(index, 1);

  isShowModalSelectTime.value.slice(index, 1);
};

const checkValidDate = ref(true);
const checkValidDateChoose = (
  start_time: string,
  end_time: string,
  index: number
) => {
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();
  checkValidDate.value = true;
  selectDate.value.forEach((item, indexItem) => {
    if (index !== indexItem) {
      if (
        start < new Date(item?.[0]).getTime() &&
        end > new Date(item?.[0]).getTime()
      ) {
        checkValidDate.value = false;
        return;
      } else if (
        start > new Date(item?.[0]).getTime() &&
        start < new Date(item?.[1]).getTime() &&
        end > new Date(item?.[1]).getTime()
      ) {
        checkValidDate.value = false;
        return;
      }
    }
  });
  return checkValidDate.value;
};
const previousData = ref([]);
const previousDateDisable = ref([]);
const previousDateDate = ref([]);
const showModalSelectTime = ([
  isChange,
  index,
  startEndDate,
  previousDataChild,
]) => {
  delete errorsForm.value.opening_times;
  previousData.value = previousDataChild;
  previousDateDisable.value = listDateDisable.value;
  previousDateDate.value = dataSelectTime.value[index];
  isChangeDate.value = isChange;
  if (isChange) {
    checkValidDateChoose(startEndDate[0], startEndDate[1], index);

    if (checkValidDate.value) {
      if (listDateChoose.value[index]) {
        listDateDisable.value = listDateDisable.value.filter(
          (item) => !listDateChoose.value[index].includes(item)
        );
      }
      listDeleteDate.value[index] = [];
      isShowModalSelectTime.value[index] = true;
    }
  } else {
    isShowModalSelectTime.value[index] = true;
  }
};

const handleCloseDate = (index: number) => {
  listDateDisable.value = listDateDisable.value?.filter(
    (item) =>
      !listDateChoose.value[index].includes(item) &&
      !listDeleteDate.value[index].includes(item)
  );
  listDeleteDate.value[index] = [];
  dataSelectTime.value[index] = [];

  isShowDetail.value[index] = false;
};

watch(selectDate, (newVal) => {
  formEvent.start_date = newVal[0];
  formEvent.end_date = newVal[1];
});

watch(round, () => {
  previousData.value = [];
  previousDateDisable.value = [];
  previousDateDate.value = [];
});

const listDateDisable = ref([]);
const handleSubmitSelectTime = async ([
  startEndNew,
  listDateDelete,
  listDate,
  index,
  data,
]) => {
  listDeleteDate.value[index] =
    listDeleteDate.value[index].concat(listDateDelete);
  listDateDisable.value = listDateDisable.value
    .concat(
      getDaysArray(startEndNew[0], startEndNew[1]).map((item) => {
        return formatDate(item, "YYYY-MM-DD");
      })
    )
    .filter((item) => !listDeleteDate.value[index].includes(item));
  listDate = listDate?.map((item) => formatDate(item, "YYYY-MM-DD"));
  if (
    previousData.value &&
    (startEndNew[0] !== previousData.value?.[0] ||
      startEndNew[1] !== previousData.value?.[1])
  ) {
    if (listDateChoose.value[index]?.some((item) => listDate.includes(item))) {
      listDateDisable.value = listDateDisable.value.length
        ? listDateDisable.value.filter(
            (item) => !listDeleteDate.value[index]?.includes(item)
          )
        : [];
    } else {
      listDateChoose.value[index] = listDateChoose.value?.[index]?.map((item) =>
        formatDate(item, "YYYY-MM-DD")
      );
      listDateDisable.value = listDateDisable.value.length
        ? listDateDisable.value.filter(
            (item) =>
              !listDateChoose.value[index]?.includes(item) &&
              !listDeleteDate.value[index]?.includes(item)
          )
        : [];
    }
  } else if (
    startEndNew[0] === previousData.value?.[0] &&
    startEndNew[1] === previousData.value?.[1]
  ) {
    listDateChoose.value[index] = listDateChoose.value?.[index]?.map((item) =>
      formatDate(item, "YYYY-MM-DD")
    );
    listDateDisable.value = listDateDisable.value?.filter(
      (item) => !listDeleteDate.value[index].includes(item)
    );
  }

  isLoadingCheckDate.value = true;
  let opening_times = [];
  data.forEach((item) => {
    item.time.forEach((time) => {
      opening_times.push({
        date: item.date,
        start: time.start === "24:00" ? "23:59" : time.start,
        end: time.end === "24:00" ? "23:59" : time.end,
      });
    });
  });
  try {
    await EventRequest.dateAvailable({ opening_times: opening_times });
    dataSelectTime.value[index] = data;
    isShowModalSelectTime.value[index] = false;
    isShowDetail.value[index] = true;
    isChangeDate.value = false;
    errorTime.value = "";
    listDateChoose.value[index] = listDate;
    selectDate.value[index] = startEndNew;
    formEvent.start_date = startEndNew[0];
    formEvent.end_date = startEndNew[1];
  } catch (e) {
    errorTime.value = e.data.errors.opening_times[0];
  } finally {
    isLoadingCheckDate.value = false;
  }
};

const handleCloseSelectTime = ([index, backUpDataDate]) => {
  errorTime.value = "";
  listDateDisable.value = previousDateDisable.value;
  selectDate.value[index] = previousData.value;
  if (!backUpDataDate.length) {
    selectDate.value[index] = [];
  }
  dataSelectTime.value[index] = backUpDataDate;
  isChangeDate.value = false;

  isShowModalSelectTime.value[index] = false;
};

const disabledDate = (time: Date) => {
  if (listDateDisable.value.length) {
    return (
      moment(time) <= moment().subtract(1, "day") ||
      listDateDisable.value.includes(formatDate(time, "YYYY-MM-DD"))
    );
  } else {
    return moment(time) <= moment().subtract(1, "day");
  }
};

const getMaxImage = async () => {
  const sizeImage = (await storeRequest.getMaxImage<any>(+storeData.getStoreId))
    .data;
  lengthImageUpdate.value = sizeImage.master;
};
const handleRemoveImage = async (file, fileList) => {
  const index = formEvent.image_ids.indexOf(file.id);
  formEvent.image_ids.splice(index, 1);
};

const handleImageChange = async (file, fileList) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  if (image_ids.value.length - 1 >= lengthImageUpdate.value) {
    image_ids.value.pop();
    isShowModalPlanConfirm.value = true;
    return;
  }
  try {
    loadingImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formEvent.image_ids.push(data.id);
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    image_ids.value.pop();
  } finally {
    loadingImage.value = false;
  }
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const deleteRecord = async () => {
  isShowModalConfirm.value = true;
};

const handleConfirm = async () => {
  try {
    isLoadingAction.value = true;
    await EventRequest.delete(+route.params?.id);
    deleteSuccess();
    await router.push({ name: "store-event" });
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-event" });
    } else if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
  }
};

const generateLinkHandle = async () => {
  try {
    loadingZoom.value = true;
    const linkZoom = (
      await StoreRequest.generateZoomUrls({
        topic: formEvent.name,
        duration: DEFAULT_LENGTH_MEETING,
      })
    )?.data;
    formEvent.online_link = linkZoom;
  } catch (e: any) {
    messageError(e.response?._data.message);
  } finally {
    loadingZoom.value = false;
  }
};

const handleAfterSubmit = () => {
  const time_pre =
    formEvent.has_time_per === HAS_CHECK_TIME_PER.TRUE
      ? getTimeByDay(
          formEvent.day_reservation,
          formEvent.hour_reservation,
          formEvent.minute_reservation
        )
      : null;
  formSubmit.value = JSON.parse(JSON.stringify(formEvent));
  formSubmit.value.opening_times = [];
  formSubmit.value.time_pre = time_pre;
  formSubmit.value.has_time_per = formEvent.has_time_per;
  formSubmit.value.price = +formatValuePrice(formEvent.price);
  formSubmit.value.price_children = +formatValuePrice(formEvent.price_children);
  if (formSubmit.value.fee_type === TYPE_FEE.SEX) {
    formSubmit.value.price = +formatValuePrice(formSubmit.value.price_male);
    formSubmit.value.price_children = +formatValuePrice(
      formSubmit.value.price_female
    );
  } else {
    formSubmit.value.price = +formatValuePrice(formSubmit.value.price_adult);
    formSubmit.value.price_children = +formatValuePrice(
      formSubmit.value.price_child
    );
  }
  delete formSubmit.value.price_adult;
  delete formSubmit.value.price_child;
  delete formSubmit.value.price_male;
  delete formSubmit.value.price_female;

  if (dataSelectTime.value.length) {
    let minTimeSeconds = moment(
      "2023-01-01 " + dataSelectTime.value[0][0]?.time[0].start,
      "YYYY-MM-DD HH:mm"
    )
      .toDate()
      .getTime();
    let maxTimeSeconds = moment(
      "2023-01-01 " + dataSelectTime.value[0][0]?.time[0].end,
      "YYYY-MM-DD HH:mm"
    )
      .toDate()
      .getTime();
    formSubmit.value.start_date = dataSelectTime.value[0][0]?.date;
    formSubmit.value.end_date = dataSelectTime.value[0][0]?.date;
    formSubmit.value.opening_time = dataSelectTime.value[0][0]?.time[0].start;
    formSubmit.value.closing_time = dataSelectTime.value[0][0]?.time[0].end;

    dataSelectTime.value.forEach((data, index) => {
      data.forEach((item) => {
        if (
          moment(formSubmit.value.start_date, "YYYY-MM-DD").toDate().getTime() >
          moment(item.date, "YYYY-MM-DD").toDate().getTime()
        ) {
          formSubmit.value.start_date = item.date;
        }

        if (
          moment(formSubmit.value.end_date, "YYYY-MM-DD").toDate().getTime() <
          moment(item.date, "YYYY-MM-DD").toDate().getTime()
        ) {
          formSubmit.value.end_date = item.date;
        }

        item.time.forEach((time) => {
          const startSeconds = moment(
            "2023-01-01 " + time.start,
            "YYYY-MM-DD HH:mm"
          )
            .toDate()
            .getTime();

          const endSeconds = moment(
            "2023-01-01 " + time.end,
            "YYYY-MM-DD HH:mm"
          )
            .toDate()
            .getTime();

          if (minTimeSeconds > startSeconds) {
            minTimeSeconds = startSeconds;
            formSubmit.value.opening_time = time.start;
          }

          if (maxTimeSeconds < endSeconds) {
            maxTimeSeconds = endSeconds;
            formSubmit.value.closing_time = time.end;
          }

          formSubmit.value.opening_times.push({
            date: formatDate(item.date, "YYYY-MM-DD"),
            start: time.start === "24:00" ? "23:59" : time.start,
            end: time.end === "24:00" ? "23:59" : time.end,
            order: index + 1,
          });
        });
      });
    });
    formSubmit.value.closing_time =
      formSubmit.value.closing_time === "24:00"
        ? "23:59"
        : formSubmit.value.closing_time;
  }
};
const createOrUpdateEvent = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  if (!form) return;
  errorsForm.value = {};

  await form.validate(async (valid) => {
    if (valid) {
      try {
        handleAfterSubmit();
        isLoadingAction.value = true;
        if (isUpdate) {
          await EventRequest.put(
            +route.params.id as number,
            customTrimValue(formSubmit.value)
          );
          updateSuccess();
        } else {
          await EventRequest.post(formSubmit.value);
          createSuccess();
        }
        await getStepSetting();
        await router.push({ name: "store-event" });
      } catch (e: any) {
        if (e.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
          if (isUpdate) {
            updateError();
          } else {
            createError();
          }
        } else if (e.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-event" });
        } else if (e.response?.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response?._data?.message);
        } else {
          if (isUpdate) {
            updateError();
          } else {
            createError();
          }
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const getStepSetting = async () => {
  const data = (
    await StoreRequest.getStepStore<StoreStepActive>(+storeData.getStoreId)
  )?.data;
  authStore.setStepStore(data);
  storeData.updateStatusStore(data.status);
};

const handleChangeTimePer = (value: number) => {
  if (
    value === HAS_CHECK_TIME_PER.TRUE &&
    !formEvent.day_reservation &&
    !formEvent.hour_reservation &&
    !formEvent.minute_reservation
  ) {
    formEvent.day_reservation = DAY_DEFAULT_SETTING;
  }
};

const getDataResponse = async () => {
  if (route.params?.id) {
    try {
      loading.value = true;
      responseEvent.value = (
        await EventRequest.show(+route.params?.id as number)
      )?.data;
      if (responseEvent.value) {
        formEvent.fee_type = responseEvent.value.fee_type;
        if (formEvent.fee_type === TYPE_FEE.SEX) {
          formEvent.price_male = priceDisplay(responseEvent.value.price);
          formEvent.price_female = priceDisplay(
            responseEvent.value.price_children
          );
        } else {
          formEvent.price_adult = priceDisplay(responseEvent.value.price);
          formEvent.price_child = priceDisplay(
            responseEvent.value.price_children
          );
        }

        formEvent.name = responseEvent.value.name;
        formEvent.description = responseEvent.value.description;
        formEvent.number_seats = responseEvent.value.number_seats;
        formEvent.start_date = responseEvent.value.start_date;
        formEvent.end_date = responseEvent.value.end_date;
        formEvent.is_setting_cancel = responseEvent.value.is_setting_cancel;
        const timeResevation = getDayHourTime(responseEvent.value.time_pre);
        formEvent.minute_reservation = timeResevation.minute;
        formEvent.hour_reservation = timeResevation.hour;
        formEvent.day_reservation = timeResevation.day;
        formEvent.has_time_per = !responseEvent.value.has_time_per
          ? HAS_CHECK_TIME_PER.FALSE
          : responseEvent.value.has_time_per;
        let indexDataSelectTimeItem = 0;
        let listDateChooseItem = [];
        let dataSelectTimeItem = [];
        let start_date = "";
        let end_date = "";
        let check = 0;
        for (
          let i = 0;
          i <= responseEvent.value.opening_times.length - 1;
          i++
        ) {
          if (
            !listDateChoose.value.includes(
              responseEvent.value.opening_times[i].date
            )
          ) {
            listDeleteDate.value.push([]);
            listDateDisable.value.push(
              responseEvent.value.opening_times[i].date
            );
          }
          const startNew =
            responseEvent.value.opening_times[i].start === "23:59:00"
              ? "24:00"
              : responseEvent.value.opening_times[i].start.slice(0, 5);
          const endNew =
            responseEvent.value.opening_times[i].end === "23:59:00"
              ? "24:00"
              : responseEvent.value.opening_times[i].end.slice(0, 5);
          if (i) {
            if (
              responseEvent.value.opening_times[i].order ===
              responseEvent.value.opening_times[i - 1].order
            ) {
              if (i === responseEvent.value.opening_times.length - 1) {
                dataSelectTime.value.push(dataSelectTimeItem);
                listDateChoose.value.push(listDateChooseItem);
                end_date = responseEvent.value.opening_times[i].date;
                selectDate.value.push([start_date, end_date]);
              }
              if (
                responseEvent.value.opening_times[i].date ===
                responseEvent.value.opening_times[i - 1].date
              ) {
                dataSelectTimeItem[indexDataSelectTimeItem].time.push({
                  start: startNew,
                  end: endNew,
                });
              } else {
                indexDataSelectTimeItem++;
                listDateChooseItem.push(
                  responseEvent.value.opening_times[i].date
                );
                dataSelectTimeItem.push({
                  date: responseEvent.value.opening_times[i].date,
                  time: [
                    {
                      start: startNew,
                      end: endNew,
                    },
                  ],
                });
              }
            } else {
              indexDataSelectTimeItem = 0;
              listDateChoose.value.push(listDateChooseItem);
              dataSelectTime.value.push(dataSelectTimeItem);
              end_date = responseEvent.value.opening_times[i - 1].date;
              selectDate.value.push([start_date, end_date]);
              start_date = responseEvent.value.opening_times[i].date;
              dataSelectTimeItem = [];
              listDateChooseItem = [];
              listDateChooseItem.push(
                responseEvent.value.opening_times[i].date
              );
              dataSelectTimeItem.push({
                date: responseEvent.value.opening_times[i].date,
                time: [
                  {
                    start: startNew,
                    end: endNew,
                  },
                ],
              });
            }
          } else {
            listDateChooseItem.push(responseEvent.value.opening_times[i].date);
            start_date = responseEvent.value.opening_times[i].date;
            dataSelectTimeItem.push({
              date: responseEvent.value.opening_times[i].date,
              time: [
                {
                  start: startNew,
                  end: endNew,
                },
              ],
            });
          }
        }
        selectDate.value.splice(0, 1);
        formEvent.opening_times = dataSelectTime.value;
        isShowDetail.value[0] = true;
        for (let i = 1; i <= selectDate.value.length - 1; i++) {
          isShowDetail.value.push(true);
        }
        formEvent.closing_time =
          responseEvent.value.closing_time === "23:59"
            ? "24:00"
            : responseEvent.value.closing_time;
        formEvent.reservation_type = responseEvent.value.reservation_type;
        formEvent.place = responseEvent.value.place;
        formEvent.online_link = responseEvent.value.online_link;
        formEvent.published = responseEvent.value.published;
        formEvent.updated_at = responseEvent.value.updated_at;
        formEvent.created_at = responseEvent.value.created_at;
        if (responseEvent.value.images.length) {
          responseEvent.value.images.forEach((item: any) => {
            formEvent.image_ids.push(item.id);
            image_ids.value.push({
              url: item.url,
              id: item.id,
            });
          });
        }
        lengthImageUpdate.value += image_ids.value.length;
      }
    } catch (e) {
      await router.push({ name: "store-event" });
    } finally {
      loading.value = false;
    }
  }
};

const handleChangeHour = (value: any, attr: any) => {
  if (value === MAX_HOUR && attr === "hour" && formEvent.minute) {
    formEvent.minute = 0;
  } else if (
    value === MAX_HOUR &&
    attr === "hour_reservation" &&
    formEvent.minute_reservation
  ) {
    formEvent.minute_reservation = 0;
  }
};

const disableMinute = (value: any, attr: any) => {
  return value > 0 && formEvent[attr] === MAX_HOUR;
};

onMounted(async () => {
  loading.value = true;
  await getMaxImage();
  await getDataResponse();
  loading.value = false;
});

defineExpose({
  createOrUpdateEvent,
  deleteRecord,
  _refForm,
  isLoadingAction,
});
</script>

<style lang="scss" scoped>
@use "../src/store/assets/scss/variables" as *;

.container-event {
  display: flex;

  :deep(.el-form-item__content) {
    .stay-time {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .el-select {
        width: calc(100% / 2 - 54px);

        .el-input {
          height: 40px;
          width: 100%;
        }
      }

      .text {
        margin-left: 8px;
        width: 20px;
      }

      .text-hour {
        margin-right: 32px;
        width: 40px;
      }
    }
  }

  .left {
    width: 780px;

    .company {
      height: 80px;

      :deep(.el-form-item__content) {
        display: block;
      }
    }

    .custom-upload {
      margin-bottom: 16px;
    }

    .custom-input-number,
    .custom-input-price {
      width: 230px;
      margin-right: 16px;
    }

    .group-date {
      :deep(.el-form-item__content) {
        gap: 20px;
      }
    }

    .group-select_date {
      width: 100%;

      :deep(.el-form-item__content) {
        flex-direction: column;
        align-items: flex-start;

        .group-select_date-item {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-bottom: 10px;

          .select-tag {
            width: 100%;
          }

          .delete-date {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: $red-100;
            gap: 5px;
            white-space: nowrap;
          }
        }
      }

      .add-date {
        width: 95px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: $menuBg;
        gap: 5px;
      }
    }

    .group-fee {
      width: 100%;

      :deep(.el-form-item__content) {
        display: flex;
        gap: 10px;

        .group-item-fee {
          background-color: $gray-80;
          width: 100%;
          height: 132px;

          .item-fee {
            display: flex;
            align-items: center;
            padding: 12px 24px;

            .el-form-item__content {
              min-width: 330px;
            }

            .label-fee {
              width: 110px;
            }
          }
        }
      }
    }

    :deep(.input-link) {
      width: calc(100% - 172px);
      padding-right: 12px;
    }
  }
}

:deep(.el-date-editor) {
  width: 100%;
  height: 40px;
}

:deep(.el-radio) {
  margin-right: 40px;
}

:deep(.zoom-button) {
  width: 172px;
}
</style>
