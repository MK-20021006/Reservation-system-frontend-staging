<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      :rules="menuRules"
      :model="formMenu"
      class="form-menu"
      require-asterisk-position="right"
    >
      <el-form-item :label="$t('store.menu_title')" prop="name">
        <input-text
          v-model="formMenu.name"
          :error="errorData.name?.[0]"
          :placeholder="$t('store.menu_title')"
          :maxlength="MAX_LENGTH_MENU_NAME"
        />
      </el-form-item>
      <el-form-item
        :label="$t('category')"
        :error="errorData.product_category_id?.[0]"
        prop="product_category_id"
      >
        <client-only>
          <el-select v-model="formMenu.product_category_id" :teleported="false">
            <el-option
              v-for="item in dataCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </client-only>
      </el-form-item>
      <el-form-item :label="$t('description')" prop="description">
        <input-text
          v-model="formMenu.description"
          type="textarea"
          :placeholder="$t('placeholder.enter_explain')"
          :maxlength="MAX_LENGTH_MENU_DESCRIPTION"
        />
      </el-form-item>
      <el-form-item :label="$t('unit_price')" prop="price">
        <div class="custom-price">
          <el-checkbox
            v-if="
              checkTypeStore(
                dataCheckRestaurant,
                store?.model_has_type?.type_id
              )
            "
            v-model="formMenu.price_status"
            class="check-price"
            :label="$t('market_price')"
            size="large"
            :true-label="1"
            :false-label="0"
          />
          <InputPrice
            v-model="formMenu.price"
            :max-price="MAX_PRICE"
            :disabled="formMenu.price_status"
          />
          <span>({{ $t("tax_include") }})</span>
        </div>
      </el-form-item>
      <el-form-item
        v-if="checkTypeStore(dataCheckSalon, store?.model_has_type?.type_id)"
        :label="$t('store.stay_time')"
      >
        <div class="stay-time">
          <ClientOnly>
            <el-select
              v-model="formMenu.hour"
              placeholder=" "
              :teleported="false"
              @change="handleChangeHour($event, 'hour')"
            >
              <el-option
                v-for="(timeValue, key) in dataHour"
                :key="key"
                :label="timeValue"
                :value="timeValue"
              />
            </el-select>
          </ClientOnly>
          <span class="text text-hour">{{ $t("hour") }}</span>
          <ClientOnly>
            <el-select
              v-model="formMenu.minute"
              placeholder=" "
              :teleported="false"
            >
              <el-option
                v-for="(timeValue, key) in dataMinute"
                :key="key"
                :label="timeValue"
                :value="timeValue"
                :disabled="disableMinute(timeValue, 'hour')"
              />
            </el-select>
          </ClientOnly>
          <span class="text">{{ $t("minute") }}</span>
        </div>
      </el-form-item>
      <el-form-item
        v-if="GROUP_TYPE_STORE.SAME.includes(storeUser.getTypeStore)"
        :label="$t('reservation_deadline_setting')"
      >
        <div class="deadline-booking">
          <el-checkbox
            v-model="formMenu.has_time_per"
            :false-label="HAS_CHECK_TIME_PER.FALSE"
            :true-label="HAS_CHECK_TIME_PER.TRUE"
            :label="$t('enable')"
            @change="handleChangeTimePer"
          />
          <!--          <span class="max-24h">{{ $t("max_24h") }}</span>-->
        </div>
        <div
          v-if="formMenu.has_time_per === HAS_CHECK_TIME_PER.TRUE"
          class="time-setting-booking"
        >
          <ClientOnly>
            <el-select
              v-model="formMenu.day_reservation"
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
              v-model="formMenu.hour_reservation"
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
              v-model="formMenu.minute_reservation"
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
      <el-form-item :label="$t('image')">
        <input-file
          v-loading="loadingImage"
          :data="formMenu.image"
          :limit="limitImage"
          @handleRemoveImage="handleRemove"
          @handleChangeImage="handleImageChange"
        />
        <ImageTextDescription />
      </el-form-item>
      <el-form-item
        v-if="GROUP_TYPE_STORE.SAME.includes(store?.model_has_type?.type_id)"
        :label="$t('reservation_type')"
        prop="booking_type"
      >
        <el-radio-group v-model="formMenu.booking_type" class="ml-4">
          <el-radio
            v-for="item in reservationTypeOptions"
            :key="item.value"
            :label="item.value"
            size="large"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
        <p>
          {{ $t("note_add_menu_and_course") }}
        </p>
      </el-form-item>
      <el-form-item :label="$t('status')">
        <el-checkbox
          v-model="formMenu.status"
          :label="$t('display')"
          size="large"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>

      <!--Cancel checkbox-->
      <el-form-item
        v-if="
          storeUser?.info?.store?.is_setting_cancel &&
          GROUP_TYPE_STORE.SAME.includes(storeUser.getTypeStore)
        "
        prop="is_setting_cancel"
        :label="$t('local_payment_authorization')"
        :error="getError('is_setting_cancel')"
      >
        <el-checkbox
          v-model="formMenu.is_setting_cancel"
          class="w-100"
          :label="$t('permission')"
          :false-label="STATUS_IS_SETTING_CANCEL.FALSE"
          :true-label="STATUS_IS_SETTING_CANCEL.TRUE"
        />
      </el-form-item>
      <!--END Cancel checkbox-->

      <el-form-item v-if="id" :label="$t('created_at')">
        <el-input
          class="input-date-update"
          :suffix-icon="IconDate"
          disabled
          :model-value="formatDate(formMenu.created_at, 'YYYY年MM月DD日 HH:mm')"
        />
      </el-form-item>
      <el-form-item v-if="id" :label="$t('updated_at')">
        <el-input
          class="input-date-update"
          :suffix-icon="IconDate"
          disabled
          :model-value="formatDate(formMenu.updated_at, 'YYYY年MM月DD日 HH:mm')"
        />
      </el-form-item>
      <el-form-item
        v-if="GROUP_TYPE_STORE.SAME.includes(storeUser.getTypeStore)"
        label=" "
      >
        <div>
          {{ $t("store.explain_menu_staff") }}
        </div>
      </el-form-item>
      <el-form-item
        v-if="GROUP_TYPE_STORE.SAME.includes(storeUser.getTypeStore)"
        :label="$t('applicable_staff')"
        class="applicable_staff"
        :error="getError('staff')"
        prop="applicable_staff"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formMenu.apply_all_staff"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll"
          />
        </div>
        <div v-if="!formMenu.apply_all_staff" class="list-staff">
          <div
            v-for="(item, index) in formMenu.staff_ids"
            :key="index"
            class="select-staff"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="$t('placeholder.applicable_staff')"
              >
                <el-option
                  v-for="staff in dataStaff"
                  :key="staff.id"
                  :value="staff.id"
                  :label="staff.name"
                  :disabled="disabledStaff(staff.id, item.id)"
                />
              </el-select>
            </client-only>
            <div class="delete-staff" @click="deleteItem(index)">
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formMenu.staff_ids.length < dataStaff.length"
            class="add-staff"
            @click="addItem"
          >
            <IconAddTime />
            <span>{{ $t("applicable_staff") }}</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <ConfirmPlan
      :dialog-visible="isShowModalPlanConfirm"
      @handle-close="handleCloseModalPlan"
      @handle-confirm="handleConfirmModalPlan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount } from "vue";
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import formMenuRules from "../../validates/menu";
import {
  MAX_LENGTH_MENU_DESCRIPTION,
  MAX_LENGTH_MENU_NAME,
  MAX_PRICE,
  MAX_HOUR,
  MAX_MINUTE,
  MAX_DAY,
} from "../../../shared/utils/validate";
import { STORE_PAGINATION } from "../../../shared/constants/pagination";
import MenuRequest from "../../../shared/requests/MenuRequest";
import categoryRequest from "../../../shared/requests/CategoryRequest";
import fileRequest from "../../../shared/requests/FileRequest";
import MODEL_TYPE from "../../../shared/constants/modelType";
import InputText from "../../../shared/components/input/InputText";
import InputFile from "../../../shared/components/input/File";
import InputPrice from "../../../shared/components/input/Price.vue";
import { Menu, Category } from "../../models";
import { formatValuePrice } from "~/../../src/shared/utils/price";
import {
  updateSuccess,
  updateError,
  createError,
  createSuccess,
  uploadImageError,
  messageError,
} from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";
import { useMeStore } from "~/../../src/shared/stores/me";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText";
import {
  getTimeByForm,
  getHourTime,
  getHourAllDay,
  getMinuteAllDay,
  getTimeByHour,
  getDayHourTime,
  getTimeByDay,
  getArrayDaySetting,
} from "~/../../src/shared/utils/date";
import priceDisplay from "~/../../src/shared/utils/price";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import {
  reservationTypeOptions,
  STATUS_IS_SETTING_CANCEL,
  HAS_CHECK_TIME_PER,
  TIME_DEFAULT_SETTING,
  DAY_DEFAULT_SETTING,
} from "~/../../src/shared/constants/reservation";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import { StaffInterface } from "~/../../src/shared/models";
import StaffRequest from "~/../../src/shared/requests/StaffRequest";
import { ACTIVE } from "~/../../src/shared/constants";
import storeRequest from "~/../../src/shared/requests/StoreRequest";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  id?: number;
}

const props = defineProps<Prop>();
const { id } = toRefs(props);
const emits = defineEmits(["changeLoadingData"]);
const loadingImage = ref(false);
const router = useRouter();
const formRef = ref(null);
const dataCategory = ref<Category[]>([]);
const errorData = ref({});

const { formMenu, menuRules } = formMenuRules();

const image_ids = ref([]);
const dataCheckRestaurant = ref([RESTAURANT]);
const dataCheckSalon = ref(GROUP_TYPE_STORE.SAME);
const storeUser = useMeStore();
const limitImage = ref(storeUser.getMaxImageByPlan);
const store = storeUser.info?.store;
const dataHour = ref([]);
const dataMinute = ref([]);
dataHour.value = getHourAllDay();
dataMinute.value = getMinuteAllDay;
const loading = ref(false);
const isShowModalPlanConfirm = ref(false);
const dataStaff = ref<StaffInterface[]>([]);
const lengthImageUpdate = ref<number>(0);
const arrayDaySetting = getArrayDaySetting();

const disabledStaff = (id: number, itemId: number) => {
  return formMenu.staff_ids.some(
    (staffItem: StaffInterface) =>
      staffItem.id === id && itemId !== staffItem.id
  );
};

const getError = (field: string) => {
  return errorData.value?.[field]?.[0];
};

const handleClickAll = (value: boolean) => {
  formMenu.staff_ids = [{}];
};

const deleteItem = (index: number) => {
  formMenu.staff_ids.splice(index, 1);
};

const addItem = () => {
  formMenu.staff_ids.push([]);
};

const getDataStaff = async () => {
  dataStaff.value = (
    await StaffRequest.list<StaffInterface[]>({ all: true })
  )?.data;
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const handleRemove = async (file, fileList) => {
  formMenu.image = fileList;
  if (file.id) {
    const index = image_ids.value.indexOf(file.id);
    image_ids.value.splice(index, 1);
    if (!id.value) {
      // try {
      //   await fileRequest.delete(file.id);
      // } catch (error) {
      //   removeImageError();
      // }
    }
  }
};

const handleImageChange = async (file, fileList) => {
  formMenu.image = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  body.append("model_type", MODEL_TYPE.MENU);
  if (lengthImageUpdate.value <= image_ids.value.length) {
    formMenu.image.pop();
    isShowModalPlanConfirm.value = true;
    return;
  }
  try {
    loadingImage.value = true;
    const data = await fileRequest.post(body);
    image_ids.value.push(data.data.id);
    const index = fileList.findIndex((item) => item.uid === file.uid);
    fileList[index].id = data.data.id;
  } catch (error) {
    formMenu.image.pop();
    uploadImageError();
  } finally {
    loadingImage.value = false;
  }
};

const getMaxImage = async () => {
  const sizeImage = (await storeRequest.getMaxImage<any>(+store.id)).data;
  lengthImageUpdate.value = sizeImage.master;
};

const getALlCategory = async () => {
  const data = await categoryRequest.list<Category[]>({ all: true }, true);
  dataCategory.value = data.data;
};

const createMenu = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        const stay_time = getTimeByForm(formMenu);
        const time_pre =
          formMenu.has_time_per === HAS_CHECK_TIME_PER.TRUE
            ? getTimeByDay(
                formMenu.day_reservation,
                formMenu.hour_reservation,
                formMenu.minute_reservation
              )
            : null;
        const body = {
          name: formMenu.name,
          is_setting_cancel: formMenu.is_setting_cancel,
          price: getPrice(),
          product_category_id: formMenu.product_category_id,
          description: formMenu.description,
          store_id: formMenu.store_id,
          image_ids: image_ids.value,
          status: formMenu.status,
          booking_type: formMenu.booking_type,
          price_status: formMenu.price_status,
          time: stay_time === 0 ? null : stay_time, // SALON
          staff_ids: getStaff(),
          time_pre: time_pre,
          has_time_per: formMenu.has_time_per,
        };
        await MenuRequest.post(body);
        createSuccess();
        await router.push("/store/menu");
      } catch (error: any) {
        errorData.value = {};
        if (error.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = error?.data?.errors;
          createError();
        } else if (error.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          createError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

//TODO id
const detailMenu = async () => {
  try {
    loading.value = true;
    const data = (await MenuRequest.show(id.value)).data as Menu;
    formMenu.created_at = data.created_at;
    formMenu.updated_at = data.updated_at;
    formMenu.status = data.status;
    formMenu.product_category_id = data.product_category_id;
    formMenu.description = data.description;
    formMenu.name = data.name;
    formMenu.store_id = data.store_id;
    formMenu.price = priceDisplay(data.price);
    formMenu.price_status = data.price_status;
    formMenu.booking_type = data.booking_type;
    const { imageGet, dataImage } = changeDataImage(data.model_has_file);
    formMenu.image = imageGet;
    image_ids.value = dataImage;
    const { hour, minute } = getHourTime(data.time);
    const dataReservation = getDayHourTime(data.time_pre);
    formMenu.hour = hour;
    formMenu.minute = minute;
    formMenu.day_reservation = dataReservation.day;
    formMenu.hour_reservation = dataReservation.hour;
    formMenu.minute_reservation = dataReservation.minute;
    formMenu.apply_all_staff = checkAllStaff(data.staffs);
    formMenu.staff_ids = !formMenu.apply_all_staff
      ? data.staffs?.map((item: StaffInterface) => {
          return {
            id: item.staff_id,
          };
        }) || []
      : [];
    lengthImageUpdate.value += data.model_has_file.length;
    formMenu.is_setting_cancel = data.is_setting_cancel;
    formMenu.has_time_per = !data.has_time_per
      ? HAS_CHECK_TIME_PER.FALSE
      : data.has_time_per;
  } catch (_) {
    await router.push({ name: "store-menu" });
  } finally {
    loading.value = false;
  }
};

const checkAllStaff = (value: StaffInterface[] = []) => {
  if (dataStaff.value && dataStaff.value.length === value.length) {
    dataStaff.value.forEach((item: StaffInterface) => {
      if (
        !value.includes((itemStaff: any) => {
          return itemStaff.staff_id === item.id;
        })
      ) {
        return false;
      }
    });
    return true;
  }
  return false;
};

const changeDataImage = (image = []) => {
  const imageGet = [];
  const dataImage = [];
  if (image.length !== 0) {
    for (const obj of image) {
      if (obj.file) {
        imageGet.push(obj.file);
        dataImage.push(obj.file.id);
      }
    }
  }
  return { imageGet, dataImage };
};

const editMenu = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        const stay_time = getTimeByForm(formMenu);
        const time_pre =
          formMenu.has_time_per === HAS_CHECK_TIME_PER.TRUE
            ? getTimeByDay(
                formMenu.day_reservation,
                formMenu.hour_reservation,
                formMenu.minute_reservation
              )
            : null;
        const body = {
          name: formMenu.name,
          is_setting_cancel: formMenu.is_setting_cancel,
          time: stay_time === 0 ? null : stay_time, // SALON
          price: getPrice(),
          product_category_id: formMenu.product_category_id,
          description: formMenu.description,
          store_id: formMenu.store_id,
          image_ids: image_ids.value,
          booking_type: formMenu.booking_type,
          price_status: formMenu.price_status,
          status: formMenu.status,
          staff_ids: getStaff(),
          time_pre: time_pre,
          has_time_per: formMenu.has_time_per,
        };
        await MenuRequest.put(id.value, body);
        updateSuccess();
        router.push("/store/menu");
      } catch (error: any) {
        errorData.value = {};
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-menu" });
        } else if (error.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = error?.data?.errors;
          updateError();
        } else if (error.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          updateError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

const handleChangeTimePer = (value: number) => {
  if (
    value === HAS_CHECK_TIME_PER.TRUE &&
    !formMenu.day_reservation &&
    !formMenu.hour_reservation &&
    !formMenu.minute_reservation
  ) {
    formMenu.day_reservation = DAY_DEFAULT_SETTING;
  }
};

const getPrice = () => {
  return formMenu.price_status === ACTIVE
    ? null
    : formMenu.price
    ? formatValuePrice(formMenu.price)
    : formMenu.price;
};

const getStaff = () => {
  const array: number[] = [];
  if (formMenu.apply_all_staff) {
    dataStaff.value.forEach((item: StaffInterface) => {
      if (item.id) {
        array.push(item.id);
      }
    });
  } else {
    formMenu.staff_ids.map((item: StaffInterface) => {
      if (item.id) {
        array.push(item.id);
      }
    });
  }
  return array;
};

const handleChangeHour = (value: any, attr: any) => {
  if (value === MAX_HOUR && attr === "hour" && formMenu.minute) {
    formMenu.minute = 0;
  } else if (
    value === MAX_HOUR &&
    attr === "hour_reservation" &&
    formMenu.minute_reservation
  ) {
    formMenu.minute_reservation = 0;
  }
};

const disableMinute = (value: any, attr: any) => {
  return value > 0 && formMenu[attr] === MAX_HOUR;
};

defineExpose({
  editMenu,
  createMenu,
  formRef,
});

onBeforeMount(async () => {
  loading.value = true;
  await getMaxImage();
  if (GROUP_TYPE_STORE.SAME.includes(storeUser.getStoreType)) {
    await getDataStaff();
  }
  await getALlCategory();
  if (id?.value) {
    await detailMenu();
  }
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-menu) {
  width: 780px;
  padding-bottom: 30px;

  .el-form-item {
    .el-form-item__label {
      width: 200px;
      justify-content: flex-start;
    }

    .el-form-item__content {
      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .stay-time {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .el-select {
          width: calc(100% / 2 - 54px);

          .el-input {
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

      .el-input,
      .el-textarea {
        width: 100%;
      }

      .date-picker {
        width: 100%;

        .el-input {
          width: 100%;
        }
      }

      .image-description {
        width: 100%;
        margin-top: 10px;
        line-height: 20px;

        .text-link {
          color: $blue-50;
          cursor: pointer;
          text-decoration: underline;
        }
      }

      .el-textarea {
        min-height: 80px;

        .el-textarea__inner {
          min-height: 80px !important;
        }
      }

      .custom-price {
        display: flex;
        align-items: center;

        .check-price {
          margin-right: 12px;
        }

        .el-input {
          width: 229px;
          margin-right: 16px;
        }
      }
    }
  }

  .applicable_staff {
    align-items: flex-start;

    :deep(.el-form-item__content) {
      .quantity-customer {
        width: 100%;
      }

      display: block;
    }

    .check-all {
      margin-bottom: 5px;
    }

    .list-staff {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .select-staff {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 18px;
        cursor: pointer;
        margin-top: 12px;
        color: $red-100;
        align-items: center;

        .el-select {
          width: calc(100% - 75px);
        }

        .delete-staff {
          display: flex;
          cursor: pointer;
          gap: 10px;
          margin-top: 5px;
          align-items: center;
        }
      }

      .add-staff {
        cursor: pointer;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 6px;
        color: $menuBg;
      }
    }
  }
}
</style>
