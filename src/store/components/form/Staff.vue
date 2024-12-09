<template>
  <div v-loading="loading" class="container-staff">
    <div class="change-avatar">
      <input-file
        v-loading="loadingImage"
        :is-avatar="true"
        :limit="limit"
        :data="image_ids"
        background_size="280px"
        :inline-message="true"
        @handleRemoveImage="handleRemove"
        @handleChangeImage="handleImageChange"
      />
    </div>
    <el-form
      ref="_formRef"
      class="right"
      label-position="left"
      require-asterisk-position="right"
      label-width="160px"
      :model="formData"
      :rules="staffRules"
    >
      <el-form-item :label="$t('full_name')" prop="name">
        <input-text
          v-model="formData.name"
          :maxlength="MAX_LENGTH_NAME"
          :placeholder="$t('full_name')"
        ></input-text>
      </el-form-item>
      <el-form-item :label="$t('store.position')" prop="positions">
        <SelectTag
          v-model="formData.positions"
          placeholder=" "
          prop-key="id"
          :options="tags"
          value="name"
          label="name"
          :limit="1"
          :max-length-tag="50"
        />
      </el-form-item>
      <el-form-item :label="$t('store.work_years')">
        <input-number-text
          v-model="formData.year_works"
          :max="MAX_WORK_YEAR"
          class="w-100"
        ></input-number-text>
      </el-form-item>
      <el-form-item class="fee" prop="fee" :label="$t('store.nomination_fee')">
        <input-price v-model="formData.fee" :max-price="MAX_FEE"></input-price>
        <div>{{ $t("yen") }}({{ $t("tax_include") }})</div>
      </el-form-item>
      <el-form-item class="input-area" :label="$t('store.selfPR')">
        <input-text
          v-model="formData.info"
          type="textarea"
          :maxlength="MAX_LENGTH_DESCRIPTION"
          :rows="3"
          :placeholder="$t('placeholder.selfPR')"
        />
      </el-form-item>
      <el-form-item :label="$t('status')">
        <el-checkbox
          v-model="formData.status"
          :label="$t('display')"
          :true-label="1"
          :false-label="0"
        ></el-checkbox>
      </el-form-item>
      <!--WORKING DAY-->
      <el-form-item
        v-if="formData.status"
        class="item-custom"
        :label="$t('working_hours')"
      >
        <!--Time Working-->
        <el-form-item
          class="el-form-item-custom"
          :error="getError('opening_times')"
          prop="opening_times"
        >
          <div
            v-for="item in WORKING_DAYS"
            :key="item.value"
            class="business-hours"
          >
            <div class="day">
              <div class="label">{{ item.label }}</div>
              <el-checkbox
                v-model="arrayCheckDayOff[item.value]"
                :label="$t('holiday_check')"
                :true-label="1"
                :false-label="0"
                @change="changeWorkingDay($event, item.value)"
              />
            </div>
            <div
              v-if="
                !checkListTimeHoliday.includes(item.value) &&
                !arrayCheckDayOff[item.value]
              "
              class="hours d-flex flex-column"
            >
              <div
                v-for="(time, index) in getOpenTimeOfDay(item.value)"
                :key="index"
              >
                <div class="d-flex align-items-center">
                  <div class="flex-2">
                    <TimeRanger
                      v-model:start-time="time.start"
                      v-model:end-time="time.end"
                    />
                    <p class="error-validate">
                      {{
                        getError(
                          `opening_times.${findIndexWorkingTime(
                            item.value,
                            index
                          )}.start`
                        )
                      }}
                    </p>
                    <p class="error-validate">
                      {{
                        getError(
                          `opening_times.${findIndexWorkingTime(
                            item.value,
                            index
                          )}.end`
                        )
                      }}
                    </p>
                  </div>
                  <div
                    class="delete-time cursor-pointer d-flex justify-content-center align-items-center flex-1"
                    @click="deleteWorkingTime(item.value, index)"
                  >
                    <div
                      v-if="getOpenTimeOfDay(item.value).length > 1"
                      class="d-flex justify-content-center align-items-center"
                    >
                      <IconDeleteTime />
                      <span>{{ $t("button.delete") }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="add-time cursor-pointer d-flex align-items-center"
                @click="addWorkingTime(item.value)"
              >
                <IconAddTime />
                <span>{{ $t("button.addition") }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <!--Holiday-->
        <el-form-item class="item-custom w-100">
          <div class="business-hours">
            <div class="day holiday">
              <div class="label">{{ $t("holiday") }}</div>
              <el-checkbox
                v-model="isHoliday"
                :label="$t('holiday_check')"
                @change="handleChangeHoliday"
              />
            </div>
            <div v-if="isHoliday" class="multi-holiday d-flex flex-column">
              <div class="custom-multi-date d-flex align-items-center">
                <div class="w-100 flex-2">
                  <ClientOnly>
                    <MultiDate v-model="multiSelectDate" />
                  </ClientOnly>
                  <p v-if="getError('closing_times')" class="error-validate">
                    {{ getError("closing_times") }}
                  </p>
                </div>
                <div class="delete-time cursor-pointer flex-1" />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form-item>
      <div class="group-overview">
        {{ storeType === SALON ? $t("staff_image_review") : $t("image") }}
      </div>
      <div class="line"></div>
      <div
        v-for="(item, index) in formData.staff_comments"
        :key="index"
        class="group-review"
      >
        <div class="group-detail">
          <div class="detail-review">
            <el-form-item
              class="label-required"
              :label="$t('image')"
              :error="errorsFormStaff[index]?.image"
            >
              <input-file
                v-loading="loadingImageStaff[index]"
                :data="item.image_ids"
                :limit="limit"
                background_size="280px"
                :inline-message="true"
                @handle-remove-image="
                  handleRemoveImageStaff($event, [$event], index)
                "
                @handle-change-image="
                  handleChangeImageStaff($event, [$event], index)
                "
              />
            </el-form-item>
            <el-form-item :label="$t('overview')">
              <el-input
                v-model="item.overview"
                :maxlength="MAX_LENGTH_CONTENT_REVIEW"
                :placeholder="$t('placeholder.summary')"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </div>
        </div>
        <div
          v-if="formData.staff_comments.length"
          class="delete-comment"
          @click="deleteStaffComment(index)"
        >
          <IconDeleteTime />
          <span>{{ $t("button.delete") }}</span>
        </div>
      </div>
      <div
        v-if="formData.staff_comments.length !== MAX_IMAGE_REVIEW_STAFF"
        class="add-comment"
        @click="addStaffComment"
      >
        <IconAddTime />
        <span>{{ $t("button.addition") }}</span>
      </div>
      <el-form-item
        prop="applicable_course"
        :label="
          storeType !== SALON
            ? $t('applicable_course')
            : $t('applicable_coupon')
        "
        class="applicable_course"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formData.apply_all_course"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll('course_ids')"
          ></el-checkbox>
        </div>
        <div v-if="!formData.apply_all_course" class="list-courses">
          <div
            v-for="(item, index) in formData.course_ids"
            :key="index"
            class="select-courses"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="
                  storeType !== SALON
                    ? $t('placeholder.applicable_course')
                    : $t('placeholder.applicable_coupon')
                "
              >
                <el-option
                  v-for="course_name_item in courseName"
                  :key="course_name_item.id"
                  :value="course_name_item.id"
                  :label="course_name_item.name"
                  :disabled="
                    formData.course_ids.some(
                      (course) =>
                        course.id === course_name_item.id &&
                        item.id !== course.id
                    )
                  "
                />
              </el-select>
            </client-only>
            <div class="delete-course" @click="deleteItem(index, 'course_ids')">
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formData.course_ids.length !== courseName.length"
            class="add-course"
            @click="addItem('course_ids')"
          >
            <IconAddTime />
            <span>{{
              storeType !== SALON
                ? $t("button.add_course")
                : $t("button.add_coupon")
            }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        prop="applicable_menu"
        :label="$t('applicable_menu')"
        class="applicable_course"
      >
        <div class="check-all">
          <el-checkbox
            v-model="formData.apply_all_menu"
            :label="$t('all')"
            :true-label="true"
            :false-label="false"
            @click="handleClickAll('menu_ids')"
          ></el-checkbox>
        </div>
        <div v-if="!formData.apply_all_menu" class="list-courses">
          <div
            v-for="(item, index) in formData.menu_ids"
            class="select-courses"
          >
            <client-only>
              <el-select
                v-model="item.id"
                :placeholder="$t('placeholder.applicable_menu')"
              >
                <el-option
                  v-for="menu_name_item in menuName"
                  :key="menu_name_item.id"
                  :value="menu_name_item.id"
                  :label="menu_name_item.name"
                  :disabled="
                    formData.menu_ids.some(
                      (menu) =>
                        menu.id === menu_name_item.id && item.id !== menu.id
                    )
                  "
                />
              </el-select>
            </client-only>
            <div class="delete-course" @click="deleteItem(index, 'menu_ids')">
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="formData.menu_ids.length !== menuName.length"
            class="add-course"
            @click="addItem('menu_ids')"
          >
            <IconAddTime />
            <span>{{ $t("button.add_menu_staff") }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="update" :label="$t('created_at')">
        <InputDate
          v-model="created_at"
          class="input-date"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY年MM月DD日 HH:mm"
          :is-disable="true"
        ></InputDate>
      </el-form-item>
      <el-form-item v-if="update" :label="$t('updated_at')">
        <InputDate
          v-model="updated_at"
          class="input-date"
          format="YYYY年MM月DD日 HH:mm"
          value-format="YYYY年MM月DD日 HH:mm"
          :is-disable="true"
        ></InputDate>
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
import InputText from "~/../../src/shared/components/input/InputText.vue";
import SelectTag from "~/../../src/shared/components/input/SelectTag.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import { FormInstance, UploadProps } from "element-plus";
import { DataFile } from "~/../../src/shared/models";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { computed, onMounted, reactive, ref } from "vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { WORKING_DAYS } from "~/../../src/shared/constants/reservation";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import MultiDate from "~/../../src/shared/components/input/MultiDate.vue";
import { TagInterface } from "~/../../src/store/models/tag";
import StaffRequest from "~/../../src/shared/requests/StaffRequest";
import TagRequest from "~/../../src/shared/requests/TagRequest";
import { staffRules } from "../../validates/staff";
import {
  MAX_FEE,
  MAX_WORK_YEAR,
  MAX_LENGTH_DESCRIPTION,
} from "~/../../src/shared/utils/validate";
import { useRoute, useRouter } from "#imports";
import { StaffInterface } from "~/../../src/shared/models/staff";
import moment from "moment/moment";
import { i18n } from "~/../../src/shared/plugins/i18n";
import priceDisplay, { formatValuePrice } from "~/../../src/shared/utils/price";
import {
  messageError,
  createSuccess,
  createError,
  deleteSuccess,
  updateError,
  updateSuccess,
  deleteError,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import {
  MAX_IMAGE_REVIEW_STAFF,
  MAX_LENGTH_CONTENT_REVIEW,
  MAX_LENGTH_NAME,
} from "../../../shared/utils/validate";
import { customTrimValue } from "~/../../src/shared/utils";
import { DEFAULT_TIME } from "~/../../src/shared/constants";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import CourseRequest from "~/../../src/shared/requests/CourseRequest";
import MenuRequest from "~/../../src/shared/requests/MenuRequest";
import { findObj } from "~/../../src/shared/utils/array";
import {
  format24HoursTo23Hours59Min,
  format23Hours59MinHoursTo24Hours,
} from "~/../../src/shared/utils";
import { useMeStore } from "~/../../src/shared/stores/me";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import { ImageUpload } from "~/../../src/shared/models";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  update: boolean;
}

interface Course {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  name: string;
}

const props = withDefaults(defineProps<Prop>(), {
  update: false,
});

const { t } = i18n.global;
const route = useRoute();
const router = useRouter();
const tags = ref<TagInterface[]>([]);
const _formRef = ref();
const limit = ref(1);
const image_ids = ref([]);
const loadingImage = ref(false);
const checkListTimeHoliday = ref([]);
const multiSelectDate = ref<string[]>([]);
const isHoliday = ref(false);
const isLoadingAction = ref(false);
const isShowModalConfirm = ref(false);
const staffDetail = ref<StaffInterface | null>(null);
const arrayCheckDayOff = ref([0, 0, 0, 0, 0, 0, 0]);
const created_at = ref();
const updated_at = ref();
const loading = ref(false);
const isShowModalPlanConfirm = ref(false);
const courseName = ref([]);
const menuName = ref([]);
const allCourse = ref([]);
const allMenu = ref([]);
const loadingImageStaff = ref([false]);
const staffImages = ref([]);
const arrayDeleteStaffComment = ref([]);
const meStore = useMeStore();
const storeType = meStore.getStoreType;

const formData = reactive({
  year_works: "",
  fee: null,
  name: "",
  info: "",
  status: 1,
  positions: null,
  image_id: null,
  opening_times: [
    {
      day_of_week: 0,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 1,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 2,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 3,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 4,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 5,
      start: "08:00",
      end: "17:00",
    },
    {
      day_of_week: 6,
      start: "08:00",
      end: "17:00",
    },
  ],
  closing_times: [{}],
  apply_all_course: true,
  apply_all_menu: true,
  course_ids: [],
  menu_ids: [],
  staff_comments: [
    {
      image_ids: [],
      image: null,
      overview: "",
    },
  ],
});

const errorsFormStaff = ref([
  {
    image: "",
    overview: "",
  },
]);

const getDataCourse = async () => {
  const response = (await CourseRequest.list({ all: true }))?.data;
  response.forEach((item: Course) => {
    courseName.value.push({ name: item.name, id: item.id });
    allCourse.value.push(item.id);
  });
};

const getDataMenu = async () => {
  const response = (await MenuRequest.list({ all: true }))?.data;
  response.forEach((item: Menu) => {
    menuName.value.push({ name: item.name, id: item.id });
    allMenu.value.push(item.id);
  });
};

const checkAllItem = async () => {
  if (menuName.value) {
    if (menuName.value.length === staffDetail.value.menus.length) {
      let count = 0;
      menuName.value.forEach((item) => {
        staffDetail.value.courses.forEach((itemUse) => {
          if (item.id === itemUse.id) {
            count++;
            formData.apply_all_menu = false;
            return;
          }
        });
      });
      if (count === staffDetail.value.menus.length) {
        formData.apply_all_menu = true;
      }
    } else {
      formData.apply_all_menu = false;
    }
  }
  if (courseName.value) {
    if (courseName.value.length === staffDetail.value.courses.length) {
      let count = 0;
      courseName.value.forEach((item) => {
        staffDetail.value.courses.forEach((itemUse) => {
          if (item.id === itemUse.id) {
            count++;
            formData.apply_all_course = false;
            return;
          }
        });
      });
      if (count === staffDetail.value.courses.length) {
        formData.apply_all_course = true;
      }
    } else {
      formData.apply_all_course = false;
    }
  }
};

const getAllTag = async () => {
  tags.value = (await TagRequest.getAllType<TagInterface[]>("staff")).data;
};

const detailStaff = async () => {
  try {
    if (route.params?.id) {
      loading.value = true;
      staffDetail.value = (await StaffRequest.show(+route.params?.id as number))
        ?.data as StaffInterface;
    }
    if (staffDetail.value) {
      await checkAllItem();
      formData.course_ids = staffDetail.value.courses.map((item) => ({
        id: item.model_id,
      }));
      formData.menu_ids = staffDetail.value.menus.map((item) => ({
        id: item.model_id,
      }));

      formData.year_works = staffDetail.value.year_works;
      formData.fee = priceDisplay(staffDetail.value.fee);
      formData.info = staffDetail.value.info;
      if (staffDetail.value.model_has_tag[0]) {
        formData.positions = [staffDetail.value?.model_has_tag[0]?.tag.name];
      } else formData.positions = "";
      formData.name = staffDetail.value.name;
      formData.image_id = staffDetail.value?.image?.file?.id || null;
      updated_at.value = staffDetail.value.updated_at;
      created_at.value = staffDetail.value.created_at;
      formData.status = staffDetail.value.status;
      if (staffDetail.value.image) {
        image_ids.value = [
          {
            url: staffDetail.value?.image?.file?.url,
            id: staffDetail.value?.image?.file?.id,
          },
        ];
      }
      // STAFF COMMENT
      if (staffDetail.value.staff_comments.length) {
        staffDetail.value.staff_comments?.forEach(
          (item: any, index: number) => {
            if (index) {
              loadingImageStaff.value.push(false);
              formData.staff_comments.push({});
            }
            formData.staff_comments[index].image = item?.files[0]?.id || null;
            formData.staff_comments[index].overview = item.content;
            formData.staff_comments[index].id = item.id;
            if (formData.staff_comments[index]) {
              formData.staff_comments[index].image_ids = [
                {
                  url: item?.files[0]?.url,
                  id: item?.files[0]?.id,
                },
              ];
            }
          }
        );
      } else {
        formData.staff_comments = [
          {
            image_ids: [],
            image: null,
            overview: "",
          },
        ];
      }

      //Opening time
      const arrTimeOpen = format23Hours59MinHoursTo24Hours(
        staffDetail.value.staff_opening_times,
        "end"
      );

      formData.opening_times = arrTimeOpen.map((item) => ({
        day_of_week: item.day_of_week,
        start: moment(item.start, "HHmmss").format("HH:mm"),
        end: item.end,
      }));
      //Closing time
      formData.closing_times = staffDetail.value.staff_closing_times.map(
        (item) => ({
          day_off: item.day_off,
        })
      );
      isHoliday.value = !!formData.closing_times.length;
      multiSelectDate.value = formData.closing_times.map(
        (item) => item.day_off
      );
      arrayCheckDayOff.value.forEach((item, index) => {
        const itemFind = formData.opening_times.find(
          (item) => item.day_of_week === index
        );
        if (itemFind) {
          arrayCheckDayOff.value[itemFind.day_of_week] = 0;
        } else {
          arrayCheckDayOff.value[index] = 1;
        }
      });
    }
  } catch (e) {
    await router.push({ name: "store-staff" });
  } finally {
    loading.value = false;
  }
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleClickAll = (fieldName: string) => {
  formData[fieldName] = [{}];
};

const addItem = (fieldName: string) => {
  formData[fieldName].push([]);
};

const deleteItem = (index: number, fieldName: string) => {
  formData[fieldName].splice(index, 1);
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const addWorkingTime = (day: number) => {
  formData.opening_times.push({
    day_of_week: day,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  });
};

const formSubmit = ref();

const handleFormBeforeSubmit = () => {
  const courseList: any[] = [];
  const menuList: any[] = [];
  formData.course_ids.forEach((item) => {
    if (item.id) {
      courseList.push(item.id);
    }
  });
  formData.menu_ids.forEach((item) => {
    if (item.id) {
      menuList.push(item.id);
    }
  });

  const dataComments = [...formData.staff_comments];
  const dataSubmitComment = dataComments.filter((item) => {
    return item.image;
  });

  const dataInfoStaff = {
    apply_all_course: formData.apply_all_course,
    apply_all_menu: formData.apply_all_menu,
    closing_times: formData.closing_times,
    course_ids: formData.course_ids,
    fee: formData.fee,
    image_id: formData.image_id,
    info: formData.info,
    menu_ids: formData.menu_ids,
    name: formData.name,
    opening_times: format24HoursTo23Hours59Min(
      JSON.parse(JSON.stringify(formData.opening_times)),
      "start",
      "end"
    ),
    positions: formData.positions,
    status: formData.status,
    year_works: formData.year_works,
    staff_comments: dataSubmitComment,
  };

  formSubmit.value = JSON.parse(JSON.stringify(dataInfoStaff));

  formSubmit.value.staff_comments.forEach((staffItem: any) => {
    staffItem.id = staffItem.id || null;
    staffItem.image = staffItem.image;
    staffItem.content = staffItem.overview;
    staffItem.deleted = false;
    delete staffItem.overview;
  });

  arrayDeleteStaffComment.value.forEach((item) => {
    delete item.overview;
    delete item.image_ids;
    formSubmit.value.staff_comments.push(item);
  });

  if (formData.apply_all_course) {
    formSubmit.value.course_ids = allCourse.value;
  } else {
    formSubmit.value.course_ids = courseList.length ? courseList : null;
  }

  if (formData.apply_all_menu) {
    formSubmit.value.menu_ids = allMenu.value;
  } else {
    formSubmit.value.menu_ids = menuList.length ? menuList : null;
  }

  delete formSubmit.value.apply_all_course;
  delete formSubmit.value.apply_all_menu;
};
const createOrUpdateStaff = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  formData.closing_times = multiSelectDate.value.map((item) => ({
    day_off: item,
  }));
  if (!form) return;
  handleFormBeforeSubmit();
  const checkValidate = validateListStaff();
  await form.validate(async (valid) => {
    if (valid && checkValidate) {
      try {
        const price = +formatValuePrice(formData.fee);
        isLoadingAction.value = true;
        if (isUpdate) {
          await StaffRequest.put(+route.params.id as number, {
            ...customTrimValue(formSubmit.value),
            fee: price,
          });
          updateSuccess();
        } else {
          await StaffRequest.post({ ...formSubmit.value, fee: price });
          createSuccess();
        }
        await router.push({ name: "store-staff" });
      } catch (e: any) {
        if (e.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          if (e.data?.status === STATUS_CODE.BAD_REQUEST) {
            isShowModalPlanConfirm.value = true;
          }
          if (e.data?.errors) {
            errorsForm.value = e.data.errors;
            if (isUpdate) {
              updateError();
            } else createError();
          }
        } else if (e.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-staff" });
        } else if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response._data.message);
        } else if (e.response?.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const deleteRecord = async () => {
  isShowModalConfirm.value = true;
};

const handleConfirm = async () => {
  try {
    isLoadingAction.value = true;
    await StaffRequest.delete(+route.params?.id);
    deleteSuccess();
    await router.push({ name: "store-staff" });
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-staff" });
    } else if (e?.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e?.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
  }
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

//Default active
const getOpenTimeOfDay = (day: number) => {
  return formData.opening_times.filter((item) => item.day_of_week === day);
};

const handleChangeHoliday = (value: string) => {
  if (!value) {
    multiSelectDate.value = [];
  }
};

const findIndexWorkingTime = (day, index) => {
  const time = getOpenTimeOfDay(day)[index];
  return formData.opening_times.findIndex((item) => item === time);
};

const deleteWorkingTime = (day, index) => {
  const indexTime = findIndexWorkingTime(day, index);
  indexTime > -1 && formData.opening_times.splice(indexTime, 1);
};

const changeWorkingDay = (value, day) => {
  if (value) {
    checkListTimeHoliday.value.push(day);
    formData.opening_times = formData.opening_times.filter(
      (item) => item.day_of_week !== day
    );
  } else {
    const index = checkListTimeHoliday.value.findIndex((item) => item === day);
    index > -1 && checkListTimeHoliday.value.splice(index, 1);
    formData.opening_times.push({
      day_of_week: day,
      start: DEFAULT_TIME.START_TIME,
      end: DEFAULT_TIME.END_TIME,
    });
  }
};

const errorsForm = ref({});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const handleRemove = async (file: any, fileList: any) => {
  image_ids.value = fileList;
  if (file.id) {
    formData.image_id = null;
  }
};
const handleImageChange = async (file: any, fileList: any) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.image_id = data.id;
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    image_ids.value = [];
  } finally {
    loadingImage.value = false;
  }
};

const handleRemoveImageStaff = async (file: any, fileList: any, index: any) => {
  formData.staff_comments.image_ids = [];
  if (file.id) {
    formData.staff_comments[index].image = null;
  }
};

const handleChangeImageStaff = async (file: any, fileList: any, index: any) => {
  formData.staff_comments[index].image_ids = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImageStaff.value[index] = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.staff_comments[index].image = data.id;
    formData.staff_comments[index].image_ids = [
      {
        url: data.url,
        id: data.id,
      },
    ];
    errorsFormStaff.value[index]["image"] = null;
  } catch (e: any) {
    if (e?.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    formData.staff_comments.image_ids = [];
  } finally {
    loadingImageStaff.value[index] = false;
  }
};

const deleteStaffComment = (index: any) => {
  if (formData.staff_comments[index]?.id) {
    arrayDeleteStaffComment.value.push({
      ...formData.staff_comments[index],
      content: formData.staff_comments[index].overview,
      deleted: true,
    });
  }
  errorsFormStaff.value.splice(index, 1);
  loadingImageStaff.value.splice(index, 1);
  formData.staff_comments.splice(index, 1);
};

const addStaffComment = () => {
  if (formData.staff_comments.length === MAX_IMAGE_REVIEW_STAFF) {
    return;
  }
  formData.staff_comments.push({});
  loadingImageStaff.value.push(false);
  errorsFormStaff.value[formData.staff_comments.length - 1] = {
    image: "",
  };
};

const validateListStaff = () => {
  let check = true;
  formData.staff_comments.forEach((item: any, index: number) => {
    if (!item.image && item.overview) {
      handleChange(index, "image");
      check = false;
    }
  });
  return check;
};

const disabledEdit = computed(() => {
  const data = loadingImageStaff.value.filter((item) => {
    return item;
  });
  return data.length > 0;
});

const handleChange = (index: number, field: string) => {
  if (
    !formData.staff_comments[index][field] ||
    !formData.staff_comments[index][field].trim().length
  ) {
    errorsFormStaff.value[index][field] = t("validate.required.field", {
      field: t(field),
    });
  } else {
    errorsFormStaff.value[index][field] = null;
  }
};

defineExpose({
  createOrUpdateStaff,
  deleteRecord,
  isLoadingAction,
  loadingImageStaff,
  loadingImage,
  _formRef,
  disabledEdit,
});

onMounted(async () => {
  loading.value = true;
  await getAllTag();
  await getDataCourse();
  await getDataMenu();
  await detailStaff();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "~/../../src/store/assets/scss/variables.scss";

.el-form-item {
  align-items: center;
  margin-bottom: 20px;
}

.container-staff {
  padding: 32px 205px;
  display: flex;
  min-width: 1300px;

  .right {
    flex: 3;
    min-width: 500px;

    .item-custom {
      align-items: flex-start;
    }

    .el-form-item-custom {
      margin-bottom: 0;
    }

    .input-area {
      align-items: flex-start;
      height: 80px;
      margin-bottom: 14px;
    }

    .business-hours {
      width: 100%;
      display: flex;
      gap: 20px;

      .day {
        display: flex;
        align-items: center;
        gap: 21px;
        height: 48px;

        &.holiday {
          width: 113px;
          justify-content: space-between;
        }
      }

      .hours {
        flex: 1;
        gap: 4px;

        .add-time {
          gap: 8px;
          color: $menuBg;
          font-weight: 500;
          height: 40px;
          max-width: 53px;
          width: 100%;
        }

        .delete-time {
          color: $red-100;
          font-weight: 500;
          max-width: 80px;
          width: 100%;

          & > div {
            gap: 10px;
          }
        }
      }

      .multi-holiday {
        flex: 1;
      }

      .custom-multi-date {
        width: 100%;
        min-height: 40px;

        .delete-time {
          max-width: 80px;
          width: 100%;
        }
      }

      &.memo {
        margin-top: 10px;
        gap: 35px;
      }
    }

    .fee {
      display: flex;

      :deep(.el-input) {
        height: 40px;
        width: 33%;
        margin-right: 16px;
      }
    }

    .applicable_course {
      align-items: flex-start;

      :deep(.el-form-item__content) {
        .quantity-customer {
          width: 100%;
        }

        display: block;
      }

      .check-all {
        margin-bottom: 10px;
      }

      .list-courses {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .select-courses {
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

          .delete-course {
            display: flex;
            cursor: pointer;
            gap: 10px;
            margin-top: 5px;

            span {
              margin-top: -8px;
            }
          }
        }

        .add-course {
          cursor: pointer;
          margin-top: 12px;
          display: flex;
          gap: 10px;
          color: $menuBg;

          span {
            margin-top: -7px;
          }
        }
      }
    }

    .line {
      margin-top: 10px;
      border-bottom: 1px solid $gray-400;
      margin-bottom: 20px;
    }

    .group-overview {
      font-weight: 500;
      line-height: 22px;
    }

    .group-review {
      display: flex;
      gap: 18px;
      align-items: center;
      margin-bottom: 12px;

      .group-detail {
        flex: 1;

        .detail-review {
          padding: 24px;
          background-color: #fafafa;
          flex-basis: calc(100% - 72px);
        }
      }

      .delete-comment {
        display: flex;
        cursor: pointer;
        gap: 10px;

        span {
          margin-top: -3px;
          color: $red-100;
        }
      }
    }

    .add-comment {
      align-items: center;
      cursor: pointer;
      margin-top: 14px;
      margin-left: 24px;
      display: flex;
      gap: 10px;
      color: $menuBg;
      margin-bottom: 22px;

      span {
        margin-bottom: -1px;
      }
    }
  }

  .change-avatar {
    flex: 2;
    height: 280px;
    margin-right: 100px;
  }
}

:deep(.el-select) {
  .el-popper {
    &.is-pure {
      width: 100%;
    }
  }
}

.change-avatar {
  :deep(.el-upload-list__item) {
    width: 280px;
    height: 280px;
  }

  :deep(.custom-upload .avatar-default) {
    width: 280px;
    height: 280px;
  }

  :deep(.custom-upload
      .avatar-default
      .el-upload--picture-card, .custom-upload),
  :deep(.custom-upload),
  :deep(.el-textarea__inner) .el-textarea__inner {
    width: 280px;
    height: 280px;
  }
}

:deep(.el-textarea__inner),
:deep(.el-textarea) {
  height: 80px;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
  height: 40px;
}

:deep(.el-select) {
  .el-input {
    height: 40px;
  }
}
</style>
