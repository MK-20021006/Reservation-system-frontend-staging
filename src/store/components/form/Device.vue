<template>
  <div v-loading="loadingDetail">
    <div class="form">
      <el-form
        ref="_formRef"
        label-width="160px"
        label-position="left"
        :model="formData"
        :rules="deviceRules"
        :inline-message="true"
        require-asterisk-position="right"
      >
        <el-form-item :label="$t('device_name')" required prop="name">
          <input-text
            v-model="formData.name"
            :placeholder="$t('device_name')"
          />
        </el-form-item>
        <el-form-item :label="$t('description')">
          <el-input
            v-model="formData.description"
            v-input-trim
            :placeholder="$t('placeholder.enter_explain')"
            type="textarea"
            rows="4"
            :maxlength="MAX_LENGTH_TEXTAREA"
          />
        </el-form-item>
        <el-form-item :label="$t('store.device.quantity')">
          <div class="d-flex align-items-center">
            <el-checkbox
              v-model="formData.status_quantity"
              :label="t('unlimited')"
              size="large"
              :true-label="true"
              :false-label="false"
            />
            <input-price
              v-model="formData.quantity"
              class="input-number ml-20"
              :disabled="isDisableQuantity || formData.status_quantity"
              placeholder=""
              @change="checkValueNotZero"
            />
            <span>{{ $t("individual_table") }}</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('status')">
          <el-radio-group v-model="formData.status" class="ml-4">
            <el-radio :label="true" size="large">{{ $t("enable") }}</el-radio>
            <el-radio :label="false" size="large">{{ $t("disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="
            typeStore !== SALON
              ? $t('store.device.correspondence_course')
              : $t('store.device.correspondence_coupon')
          "
        >
          <div>
            <div>
              <el-checkbox
                v-model="formData.status_course"
                :label="t('all')"
                size="large"
                :true-label="true"
                :false-label="false"
                :disabled="!formData.status"
                @change="checkAllCourse()"
              />
            </div>
            <div v-if="!formData.status_course">
              <div
                v-for="(itemCourse, index) in groupCourse"
                :key="index"
                class="course-item"
              >
                <el-select
                  v-model="groupCourse[index].id"
                  :placeholder="
                    formData.status
                      ? typeStore !== SALON
                        ? $t('store.device.correspondence_course')
                        : $t('store.device.correspondence_coupon')
                      : ' '
                  "
                  :loading="isLoadingCourse"
                  filterable
                  :disabled="!formData.status"
                  @change="handleIdCourseDevice"
                >
                  <el-option
                    v-for="item in optionCourse"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="arrIdCourse.some((value) => value === item.id)"
                  />
                </el-select>
                <div
                  v-if="formData.status"
                  class="button-delete-course"
                  @click="deleteCourse(index)"
                >
                  <IconDeleteTime />
                  <span class="ml-10">{{ $t("button.delete") }}</span>
                </div>
              </div>
              <div
                v-if="
                  groupCourse.length &&
                  lengthCourse > 0 &&
                  lengthCourse > groupCourse.length &&
                  formData.status
                "
                class="button-add-course"
                @click="addCourse"
              >
                <IconAddTime />
                <span class="ml-10">{{
                  typeStore !== SALON
                    ? $t("button.add_course")
                    : $t("button.add_coupon")
                }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('store.device.correspondence_menu')">
          <div>
            <div>
              <el-checkbox
                v-model="formData.status_menu"
                :label="t('all')"
                size="large"
                :true-label="true"
                :false-label="false"
                :disabled="!formData.status"
                @change="checkAllMenu()"
              />
            </div>
            <div v-if="!formData.status_menu">
              <div
                v-for="(itemMenu, index) in groupMenu"
                :key="index"
                class="course-item"
              >
                <el-select
                  v-model="groupMenu[index].id"
                  :placeholder="
                    formData.status
                      ? $t('store.device.correspondence_menu')
                      : ' '
                  "
                  :loading="isLoadingMenu"
                  filterable
                  :disabled="!formData.status"
                  @change="handleIdMenuDevice"
                >
                  <el-option
                    v-for="item in optionMenu"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="arrIdMenu.some((value) => value === item.id)"
                  />
                </el-select>
                <div
                  v-if="formData.status"
                  class="button-delete-menu"
                  @click="deleteMenu(index)"
                >
                  <IconDeleteTime />
                  <span class="ml-10">{{ $t("button.delete") }}</span>
                </div>
              </div>
              <div
                v-if="
                  groupMenu.length &&
                  lengthMenu > 0 &&
                  lengthMenu > groupMenu.length &&
                  formData.status
                "
                class="button-add-menu"
                @click="addMenu"
              >
                <IconAddTime />
                <span class="ml-10">{{ $t("button.add_menu_staff") }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          prop="number_booking_device"
          :label="$t('store.device.simultaneous_receptions')"
        >
          <div class="d-flex align-items-center">
            <input-price
              v-model="formData.number_booking_device"
              class="input-number"
              placeholder=""
              @change="checkValueBookingNotZero"
            />
            <span>{{ $t("subject_unit") }}</span>
          </div>
        </el-form-item>
        <div v-if="id" class="date-device">
          <ClientOnly>
            <el-form-item :label="$t('created_at')">
              <el-date-picker
                v-model="formData.created_at"
                type="datetime"
                format="YYYY年MM月DD日 HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                :disabled="true"
                :clearable="false"
              />
            </el-form-item>
          </ClientOnly>
          <ClientOnly>
            <el-form-item :label="$t('updated_at')">
              <el-date-picker
                v-model="formData.updated_at"
                type="datetime"
                format="YYYY年MM月DD日 HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                :disabled="true"
                :clearable="false"
              />
            </el-form-item>
          </ClientOnly>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { MAX_LENGTH_TEXTAREA } from "~/../../src/shared/utils/validate";
import deviceRules from "~/../../src/store/validates/devices";
import CourseRequest from "~/../../src/shared/requests/CourseRequest";
import MenuRequest from "~/../../src/shared/requests/MenuRequest";
import { Course, Menu } from "~/../../src/store/models";
import { FormInstance } from "element-plus";
import DeviceRequest from "~/../../src/shared/requests/DeviceRequest";
import { useReservation } from "~/../../src/store/store/useReservation";
import { STATUS_TYPE } from "~/../../src/shared/constants/status";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { formatValuePrice } from "~/../../src/shared/utils";
import { messageError } from "~/../../src/shared/utils/notification";
import {
  createSuccess,
  deleteError,
  deleteSuccess,
  updateSuccess,
  createError,
  updateError,
} from "~/../../src/shared/utils/notification";
import { Device } from "~/../../src/store/models/device";
import { Appearance } from "~/../../src/store/constants";
import priceDisplay from "~/../../src/shared/utils/price";
import { useRouter } from "#imports";
import { SALON } from "~/../../src/shared/constants/category";
import { useMeStore } from "~/../../src/shared/stores/me";

const router = useRouter();
const reservationStore = useReservation();
const { t } = i18n.global;
const isLoadingCourse = ref(false);
const isLoadingMenu = ref(false);
const isDisableQuantity = ref(false);
const _formRef = ref();
const groupCourse = ref([[]]);
const groupMenu = ref([[]]);
const arrIdCourse = ref([]);
const arrIdMenu = ref([]);
const formData = reactive({
  name: "",
  description: "",
  status_quantity: true,
  quantity: null,
  status: true,
  status_course: true,
  status_menu: true,
  number_booking_device: null,
  created_at: "",
  updated_at: "",
});

interface Prop {
  id?: number;
}

const optionCourse = ref([]);
const optionMenu = ref([]);
const isLoadingAction = ref(false);
const isChangeMenu = ref(false);
const isSubmitForm = ref(false);
const isChangeCourse = ref(false);
const lengthCourse = ref(0);
const lengthMenu = ref(0);
const loadingDetail = ref(false);
const props = defineProps<Prop>();
const { id } = toRefs(props);
const typeStore = useMeStore().getTypeStore;

const deleteCourse = (index: number) => {
  groupCourse.value.splice(index, 1);
  if (groupCourse.value.length === 0) {
    formData.status_course = true;
  }
  handleIdCourseDevice();
};

const checkValueNotZero = (value: string) => {
  if (parseInt(value) === 0) {
    formData.quantity = 1;
  }
};

const checkValueBookingNotZero = (value: string) => {
  if (parseInt(value) === 0) {
    formData.number_booking_device = 1;
  }
};

const addCourse = () => {
  groupCourse.value.push([]);
};

const deleteMenu = (index: number) => {
  groupMenu.value.splice(index, 1);
  if (groupMenu.value.length === 0) {
    formData.status_menu = true;
  }
  handleIdMenuDevice();
};

const addMenu = () => {
  groupMenu.value.push([]);
};

watch(
  () => formData.status_quantity,
  () => {
    if (formData.status_quantity) {
      formData.quantity = null;
      isDisableQuantity.value = true;
    } else {
      isDisableQuantity.value = false;
    }
  }
);

watch(
  () => formData.quantity,
  () => {
    if (!formData.quantity) {
      formData.status_quantity = true;
      isDisableQuantity.value = true;
    }
  }
);

watch(
  () => arrIdCourse.value.length,
  () => {
    if (!isSubmitForm.value) {
      formData.status_course = !arrIdCourse.value.length;
    }
  }
);

watch(
  () => arrIdMenu.value.length,
  () => {
    if (!isSubmitForm.value) {
      formData.status_menu = !arrIdMenu.value.length;
    }
  }
);

const checkAllCourse = () => {
  if (formData.status_course) {
    groupCourse.value = [[]];
  } else if (groupCourse.value.length === 0) {
    groupCourse.value.push([]);
  }
  arrIdCourse.value = [];
};

const checkAllMenu = () => {
  if (formData.status_menu) {
    groupMenu.value = [[]];
  } else if (groupMenu.value.length === 0) {
    groupMenu.value.push([]);
  }
  arrIdMenu.value = [];
};

const handleIdCourseDevice = () => {
  arrIdCourse.value = [];
  isChangeCourse.value = true;
  groupCourse.value.map((item) => {
    if (item["id"]) {
      arrIdCourse.value.push(item["id"]);
    }
  });
};

const handleIdMenuDevice = () => {
  arrIdMenu.value = [];
  isChangeMenu.value = true;
  groupMenu.value.map((item) => {
    if (item["id"]) {
      arrIdMenu.value.push(item["id"]);
    }
  });
};

const handlePushAllIdCourse = () => {
  arrIdCourse.value = [];
  optionCourse.value.map((item) => {
    if (item["id"]) {
      arrIdCourse.value.push(item["id"]);
    }
  });
};

const handlePushAllIdMenu = () => {
  arrIdMenu.value = [];
  optionMenu.value.map((item) => {
    if (item["id"]) {
      arrIdMenu.value.push(item["id"]);
    }
  });
};

const resetCourseMenu = () => {
  arrIdCourse.value = [];
  arrIdMenu.value = [];
};

const createDevice = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        isSubmitForm.value = true;
        if (formData.status_course) {
          handlePushAllIdCourse();
        }
        if (formData.status_menu) {
          handlePushAllIdMenu();
        }
        const params = {
          status: formData.status,
          name: formData.name,
          description: formData.description,
          quantity:
            formData.quantity !== null
              ? +formatValuePrice(formData.quantity)
              : null,
          max_accept: +formatValuePrice(formData.number_booking_device),
          courses: arrIdCourse.value,
          menus: arrIdMenu.value,
        };

        await DeviceRequest.post(params);
        createSuccess();
        reservationStore.setAppearanceDevice(Appearance.list);
        await router.push({ name: "store-device" });
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          resetCourseMenu();
          createError();
        }
      } finally {
        isSubmitForm.value = false;
        isLoadingAction.value = false;
      }
    }
  });
};

const detailDevice = async (id: number) => {
  try {
    loadingDetail.value = true;
    const dataDevice = (await DeviceRequest.show<Device>(id))?.data;
    formData.name = dataDevice.name;
    formData.description = dataDevice.description;

    if (dataDevice.quantity) {
      formData.status_quantity = false;
      isDisableQuantity.value = false;
      formData.quantity = priceDisplay(dataDevice.quantity);
    } else {
      formData.status_quantity = true;
      isDisableQuantity.value = true;
    }

    formData.status = dataDevice.status === STATUS_TYPE.ENABLE;
    formData.number_booking_device = dataDevice.max_accept
      ? priceDisplay(dataDevice.max_accept)
      : 0;

    if (!dataDevice.all_course) {
      formData.status_course = false;
      groupCourse.value =
        dataDevice.courses?.length > 0 ? dataDevice.courses : [[]];
      handleIdCourseDevice();
    } else {
      formData.status_course = dataDevice.all_course;
    }

    if (!dataDevice.all_menu) {
      formData.status_menu = false;
      groupMenu.value = dataDevice.menus?.length > 0 ? dataDevice.menus : [[]];
      handleIdMenuDevice();
    } else {
      formData.status_menu = dataDevice.all_menu;
    }

    formData.created_at = dataDevice.created_at;
    formData.updated_at = dataDevice.updated_at;
  } catch (e) {
  } finally {
    loadingDetail.value = false;
  }
};

const editDevice = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        const params = {
          status: formData.status,
          name: formData.name,
          description: formData.description,
          quantity:
            formData.quantity !== null
              ? +formatValuePrice(formData.quantity)
              : null,
          max_accept: +formatValuePrice(formData.number_booking_device),
          courses: formData.status_course ? "all" : arrIdCourse.value,
          menus: formData.status_menu ? "all" : arrIdMenu.value,
        };
        await DeviceRequest.put(id.value, params);
        updateSuccess();
        reservationStore.setAppearanceDevice(Appearance.list);
        await router.push({ name: "store-device" });
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          updateError();
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const deleteDevice = async (id: number) => {
  try {
    await DeviceRequest.delete(id);
    deleteSuccess();
    reservationStore.setAppearanceDevice(Appearance.list);
    await router.push({ name: "store-device" });
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      messageError(t("cannot_be_deleted"));
    } else {
      deleteError();
    }
  }
};

const getListCourse = async () => {
  try {
    isLoadingCourse.value = true;
    if (id.value) {
      loadingDetail.value = true;
    }
    optionCourse.value = (await CourseRequest.getAllData<Course[]>()).data;
    lengthCourse.value = optionCourse.value.length;
  } catch (e) {
  } finally {
    isLoadingCourse.value = false;
  }
};
const getListMenu = async () => {
  try {
    isLoadingMenu.value = true;
    if (id.value) {
      loadingDetail.value = true;
    }
    optionMenu.value = (await MenuRequest.getAllData<Menu[]>()).data;
    lengthMenu.value = optionMenu.value.length;
  } catch (e) {
  } finally {
    isLoadingMenu.value = false;
  }
};

onMounted(async () => {
  await getListCourse();
  await getListMenu();
  if (id.value) {
    await detailDevice(id.value);
  }
});

defineExpose({
  editDevice,
  createDevice,
  deleteDevice,
  _formRef,
  isLoadingAction,
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

.form {
  max-width: 780px;
  width: 100%;
  padding-bottom: 10px;

  .course-item {
    margin-bottom: 15px;
    display: flex;
  }

  .button-delete-course,
  .button-delete-menu {
    cursor: pointer;
    margin-left: 18px;
    display: flex;
    align-items: center;
    width: 90px;
    color: $red-100;
  }

  .button-add-course,
  .button-add-menu {
    width: 110px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: $blue-text-add;
  }

  :deep(.el-form-item__label) {
    width: 140px !important;
  }

  :deep(.el-form-item__content) {
    display: block;
  }

  .el-input {
    height: 40px;
  }

  :deep(.el-select) {
    width: 100%;

    .el-input {
      height: 40px;
    }
  }

  :deep(.number-man) {
    .group-number {
      gap: 30px;
    }

    .el-form-item__error {
      display: block;
      width: 100%;
    }

    .input-number {
      width: 160px;
      margin-right: 16px;
    }
  }

  :deep(.input-number) {
    width: 160px;
    margin-right: 16px;
  }

  :deep(.date-device .el-form-item__content .el-input) {
    width: 100%;
    margin-bottom: 6px;

    .el-input__wrapper {
      height: 40px;
    }
  }
}
</style>
