<template>
  <div v-loading="isMounted" class="container-setting-recruitment">
    <el-form
      ref="_refForm"
      class="form-body"
      label-width="160px"
      label-position="left"
      :model="formRecruitment"
      :rules="formRecruitmentRules"
      require-asterisk-position="right"
    >
      <div class="left">
        <el-form-item prop="status" :label="$t('display')">
          <el-checkbox
            v-model="formRecruitment.enable"
            :true-label="STATUS_RECRUITMENT.ENABLE"
            :false-label="STATUS_RECRUITMENT.INVALID"
          ></el-checkbox>
        </el-form-item>
        <el-form-item prop="job_title" :label="$t('occupation')">
          <input-text
            v-model="formRecruitment.job_title"
            :placeholder="$t('placeholder.part_time')"
          />
        </el-form-item>
        <el-form-item
          :class="{ 'label-required': formRecruitment.enable }"
          :label="$t('display_period')"
          prop="display_period"
        >
          <div class="group-date">
            <el-form-item
              :error="errorsForm ? errorsForm['start_date'] : null"
              class="flex-1"
              prop="start_date"
            >
              <client-only>
                <el-date-picker
                  v-model="formRecruitment.start_date"
                  :disabled-date="disabledDateStart"
                  :placeholder="$t('placeholder.start_time_send')"
                  :editable="false"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  @change="handleChangeDate"
                ></el-date-picker>
              </client-only>
            </el-form-item>
            <el-form-item
              :error="errorsForm ? errorsForm['end_date'] : null"
              class="flex-1"
              prop="end_date"
            >
              <client-only>
                <el-date-picker
                  v-model="formRecruitment.end_date"
                  :disabled-date="disabledDateEnd"
                  :placeholder="$t('placeholder.end_time_send')"
                  :editable="false"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  @change="handleChangeDate"
                ></el-date-picker>
              </client-only>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          prop="recruitment_detail"
          :label="$t('recruitment_details')"
        >
          <el-input
            v-model="formRecruitment.recruitment_detail"
            :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
            :placeholder="$t('placeholder.job_information')"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item prop="job_overview" :label="$t('main_work_content')">
          <el-input
            v-model="formRecruitment.job_overview"
            :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
            :placeholder="$t('placeholder.main_work_content')"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item prop="workflow" :label="$t('business_flow')">
          <input-text
            v-model="formRecruitment.workflow"
            :placeholder="$t('placeholder.business_flow')"
          />
        </el-form-item>
        <el-form-item prop="workplace" :label="$t('work_location')">
          <input-text
            v-model="formRecruitment.workplace"
            :placeholder="$t('placeholder.work_location')"
          />
        </el-form-item>
        <el-form-item prop="working_time" :label="$t('working_hours')">
          <input-text
            v-model="formRecruitment.working_time"
            class="w-100"
            :placeholder="$t('placeholder.working_hour')"
          />
        </el-form-item>
        <el-form-item prop="salary" :label="$t('salary')">
          <input-text
            v-model="formRecruitment.salary"
            :placeholder="$t('placeholder.salary')"
          />
        </el-form-item>
        <el-form-item prop="training" :label="$t('training_system')">
          <el-input
            v-model="formRecruitment.training"
            :placeholder="$t('placeholder.training_system')"
            type="textarea"
            :rows="4"
            :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
          />
        </el-form-item>
        <el-form-item prop="contact" :label="$t('contact_information')">
          <input-text
            v-model="formRecruitment.contact"
            :placeholder="$t('placeholder.contact_information')"
          />
        </el-form-item>
        <el-form-item prop="manager" :label="$t('manager')">
          <input-text
            v-model="formRecruitment.manager"
            :placeholder="$t('placeholder.manager')"
          />
        </el-form-item>
        <el-form-item prop="email" :label="$t('email_address')">
          <input-text
            v-model="formRecruitment.email"
            :placeholder="$t('placeholder.email_recruitment')"
          ></input-text>
        </el-form-item>
      </div>
      <div class="right">
        <div class="group-overview">
          {{ $t("recruitment_overview") }}
        </div>
        <div class="line"></div>
        <el-form-item prop="recruitment_title" :label="$t('title_keyword')">
          <input-text v-model="formRecruitment.recruitment_title" />
        </el-form-item>
        <el-form-item prop="images" :label="$t('image')">
          <input-file
            v-loading="loadingImageStoreReview"
            :limit="limitSlider"
            :data="store_images"
            background_size="280px"
            :inline-message="true"
            @handleRemoveImage="handleRemoveStoreReview"
            @handleChangeImage="handleImageChangeStoreReview"
          />
        </el-form-item>
        <el-form-item prop="recruitment_overview" :label="$t('overview')">
          <el-input
            v-model="formRecruitment.recruitment_overview"
            :maxlength="MAX_LENGTH_SUMMARY"
            :placeholder="$t('placeholder.summary')"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <!--        Staff review-->
        <div class="staff-reviews">{{ $t("staff_reviews") }}</div>
        <div class="line" />
        <div
          v-for="(item, index) in formRecruitment.staff_reviews"
          class="group-review"
        >
          <div class="group-detail">
            <div class="detail-review">
              <el-form-item
                :error="errorsFormStaff[index]?.title_keyword"
                class="label-required"
                :label="$t('title_keyword')"
              >
                <input-text
                  v-model="item.title_keyword"
                  @blur="handleChange(index, 'title_keyword')"
                />
              </el-form-item>
              <el-form-item
                :error="errorsFormStaff[index]?.image"
                :label="$t('image')"
                class="label-required"
              >
                <input-file
                  v-loading="loadingImage[index]"
                  :data="item.image_ids"
                  :limit="limit"
                  background_size="280px"
                  :inline-message="true"
                  @handleRemoveImage="handleRemove($event, [$event], index)"
                  @handleChangeImage="
                    handleImageChange($event, [$event], index)
                  "
                />
              </el-form-item>
              <el-form-item
                class="label-required"
                :label="$t('overview')"
                :error="errorsFormStaff[index]?.overview"
              >
                <el-input
                  v-model="item.overview"
                  :maxlength="MAX_LENGTH_SUMMARY"
                  :placeholder="$t('placeholder.summary')"
                  type="textarea"
                  :rows="4"
                  @blur="handleChange(index, 'overview')"
                />
              </el-form-item>
            </div>
          </div>
          <div
            v-if="formRecruitment.staff_reviews !== MIN_LENGTH_REVIEW_STAFF"
            class="delete-course"
            @click="deleteStaffReview(index)"
          >
            <IconDeleteTime />
            <span>{{ $t("button.delete") }}</span>
          </div>
        </div>

        <div
          v-if="
            formRecruitment.staff_reviews.length !== MAX_LENGTH_REVIEW_STAFF
          "
          class="add-course"
          @click="addStaffReview"
        >
          <IconAddTime />
          <span>{{ $t("button.addition") }}</span>
        </div>
      </div>
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
  </div>
</template>

<script lang="ts" setup>
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import recruitmentRules from "~/../../src/store/validates/recruitmentSetting";
import RecruitmentRequest from "~/../../src/shared/requests/RecruitmentRequest";
import { onBeforeMount, ref, useRoute, useRouter } from "#imports";
import moment from "moment";
import { FormInstance, UploadProps } from "element-plus";
import { customTrimValue } from "~/../../src/shared/utils";
import {
  createError,
  createSuccess,
  deleteError,
  deleteSuccess,
  messageError,
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { DataFile } from "~/../../src/shared/models";
import { STATUS_RECRUITMENT } from "~/../../src/shared/constants/recruitment";
import FileRequest from "~/../../src/shared/requests/FileRequest";
import { ImageUpload } from "~/../../src/shared/models";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import {
  MAX_LENGTH_SUMMARY,
  MAX_LENGTH_REVIEW_STAFF,
  MIN_LENGTH_REVIEW_STAFF,
  MAX_LENGTH_DEFAULT_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { uploadImageError } from "~/../../src/shared/utils/notification";

const { t } = i18n.global;

interface Prop {
  update: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  update: false,
});

const limit = ref(1);
const limitSlider = ref(5);
const isMounted = ref(false);
const store_images = ref([]);
const loadingImageStoreReview = ref(false);
const loadingImage = ref([false]);
const _refForm = ref();
const { formRecruitment, formRecruitmentRules } = recruitmentRules();
const isLoadingAction = ref(false);
const isShowModalConfirm = ref(false);
const route = useRoute();
const router = useRouter();
const formSubmit = ref();
const errorsFormStaff = ref([
  {
    image: "",
    title_keyword: "",
    overview: "",
  },
]);
const errorsForm = ref([]);
const arrayDeleteStaffReview = ref([]);

const deleteStaffReview = (index: any) => {
  if (formRecruitment.staff_reviews[index].id) {
    arrayDeleteStaffReview.value.push({
      ...formRecruitment.staff_reviews[index],
      title: formRecruitment.staff_reviews[index].title_keyword,
      content: formRecruitment.staff_reviews[index].overview,
      deleted: true,
    });
  }
  errorsFormStaff.value.splice(index, 1);
  loadingImage.value.splice(index, 1);
  formRecruitment.staff_reviews.splice(index, 1);
};

const addStaffReview = () => {
  if (formRecruitment.staff_reviews.length === MAX_LENGTH_REVIEW_STAFF) {
    return;
  }
  formRecruitment.staff_reviews.push({});
  loadingImage.value.push(false);

  errorsFormStaff.value[formRecruitment.staff_reviews.length - 1] = {
    image: "",
    title_keyword: "",
    overview: "",
  };
};

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const deleteRecord = async () => {
  isShowModalConfirm.value = true;
};

const handleChange = (index: number, field: string) => {
  if (
    !formRecruitment.staff_reviews[index][field] ||
    !formRecruitment.staff_reviews[index][field].trim().length
  ) {
    errorsFormStaff.value[index][field] = t("validate.required.field", {
      field: t(field),
    });
  } else {
    errorsFormStaff.value[index][field] = null;
  }
};

const handleRemove = async (file, fileList, index) => {
  formRecruitment.staff_reviews.image_ids = [];
  if (file.id) {
    formRecruitment.staff_reviews[index].image = null;
  }
};

const handleImageChange = async (file, fileList, index) => {
  formRecruitment.staff_reviews[index].image_ids = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value[index] = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formRecruitment.staff_reviews[index].image = data.id;
    formRecruitment.staff_reviews[index].image_ids = [
      {
        url: data.url,
        id: data.id,
      },
    ];
    errorsFormStaff.value[index]["image"] = null;
  } catch (e) {
    if (e?.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    formRecruitment.staff_reviews.image_ids = [];
  } finally {
    loadingImage.value[index] = false;
  }
};

const handleRemoveStoreReview: UploadProps["onRemove"] = async (
  file: ImageUpload,
  fileList
) => {
  if (file?.id) {
    const index = formRecruitment.images.findIndex((item) => item === file.id);
    if (index > -1) {
      formRecruitment.images.splice(index, 1);
    }
  } else {
    const index = store_images.value.findIndex((item) => item.uid === file.uid);
    if (index > -1) {
      store_images.value.splice(index, 1);
    }
  }
};

const handleImageChangeStoreReview: UploadProps["onChange"] = async (
  file,
  fileList
) => {
  store_images.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImageStoreReview.value = true;
    const response = await FileRequest.post(body);
    const dataFile = response.data as DataFile;
    const index = fileList.findIndex((item) => item.uid === file.uid);
    fileList[index].id = dataFile.id;
    fileList[index].url = dataFile.url;
    formRecruitment.images = store_images.value.map((item) => item.id);
    _refForm.value.clearValidate(["images"]);
  } catch (error) {
    store_images.value.pop();
    uploadImageError();
  } finally {
    loadingImageStoreReview.value = false;
  }
};

const handleConfirm = async () => {
  try {
    isLoadingAction.value = true;
    await RecruitmentRequest.delete(+route.params?.id);
    deleteSuccess();
  } catch (e) {
    if (e.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "recruitment-information-setting" });
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
    await router.push({ name: "recruitment-information-setting" });
  }
};

const disabledDateStart = (time: Date) => {
  if (formRecruitment.end_date) {
    return (
      moment(time) < moment().subtract(1, "day") ||
      moment(time) > moment(formRecruitment.end_date)
    );
  } else {
    return moment(time) < moment().subtract(1, "day");
  }
};

const disabledDateEnd = (time: Date) => {
  if (formRecruitment.start_date) {
    return (
      formRecruitment.start_date &&
      moment(time).isSameOrBefore(
        moment(formRecruitment.start_date).subtract(1, "day")
      )
    );
  } else {
    return moment(time) < moment().subtract(1, "day");
  }
};

const validateListStaff = () => {
  let check = true;
  formRecruitment.staff_reviews.forEach((item, index) => {
    if (!item.overview || !item.title_keyword || !item.image) {
      if (!item.overview) {
        handleChange(index, "overview");
      }
      if (!item.title_keyword) {
        handleChange(index, "title_keyword");
      }
      if (!item.image) {
        handleChange(index, "image");
      }
      check = false;
    }
  });
  return check;
};
const handleChangeDate = () => {
  if (
    formRecruitment.start_date &&
    formRecruitment.end_date &&
    (errorsForm.value.start_date || errorsForm.value.end_date)
  ) {
    errorsForm.value.start_date = null;
    errorsForm.value.end_date = null;
  }
};

const handleAfterSubmit = () => {
  formSubmit.value = JSON.parse(JSON.stringify(formRecruitment));

  formSubmit.value.staff_reviews.forEach((staffItem: any) => {
    staffItem.id = staffItem.id || null;
    staffItem.image = staffItem.image;
    staffItem.title = staffItem.title_keyword;
    staffItem.content = staffItem.overview;
    staffItem.deleted = false;

    delete staffItem.title_keyword;
    delete staffItem.overview;
  });

  arrayDeleteStaffReview.value.forEach((item) => {
    delete item.title_keyword;
    delete item.overview;
    delete item.image_ids;
    formSubmit.value.staff_reviews.push(item);
  });

  //Validate start_date and end_date by enable
  if (formSubmit.value.enable) {
    if (!formSubmit.value.start_date || !formSubmit.value.end_date) {
      if (!formSubmit.value.start_date) {
        errorsForm.value.start_date = t("validate.required.field", {
          field: t("display_period"),
        });
      }

      if (!formSubmit.value.end_date) {
        errorsForm.value.end_date = t("validate.required.field", {
          field: t("display_period"),
        });
      }
      return false;
    } else {
      errorsForm.value.start_date = null;
      errorsForm.value.end_date = null;
    }
  }
  if (!validateListStaff()) return false;

  return true;
};

const createOrUpdateRecruitment = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  if (!form) return;
  await form.validate(async (valid) => {
    const checkValidate = handleAfterSubmit();

    if (valid && checkValidate) {
      try {
        isLoadingAction.value = true;
        if (isUpdate) {
          await RecruitmentRequest.put(+route.params.id as number, {
            ...customTrimValue(formSubmit.value),
          });
          updateSuccess();
        } else {
          await RecruitmentRequest.post({
            ...formSubmit.value,
          });
          createSuccess();
        }
        await router.push({ name: "recruitment-information-setting" });
      } catch (e) {
        if (e.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          if (isUpdate) {
            updateError();
          } else createError();
        }
        if (e.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({
            name: "recruitment-information-setting",
          });
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

defineExpose({
  createOrUpdateRecruitment,
  _refForm,
  isLoadingAction,
  deleteRecord,
});

const getDataResponse = async () => {
  try {
    if (route.params?.id) {
      isMounted.value = true;

      const dataResponse = (
        await RecruitmentRequest.show(+route.params?.id as number)
      )?.data;

      for (const obj of dataResponse.images) {
        if (obj) {
          formRecruitment.images.push(obj.id);
        }
      }
      store_images.value = dataResponse.images ? dataResponse.images : [];
      formRecruitment.enable = dataResponse.enable;
      formRecruitment.job_title = dataResponse.job_title;
      formRecruitment.start_date = dataResponse.start_date;
      formRecruitment.end_date = dataResponse.end_date;
      formRecruitment.recruitment_detail = dataResponse.recruitment_detail;
      formRecruitment.email = dataResponse.email;
      formRecruitment.job_overview = dataResponse.job_overview;
      formRecruitment.workflow = dataResponse.workflow;
      formRecruitment.workplace = dataResponse.workplace;
      formRecruitment.working_time = dataResponse.working_time;
      formRecruitment.salary = dataResponse.salary;
      formRecruitment.manager = dataResponse.manager;
      formRecruitment.training = dataResponse.training;
      formRecruitment.contact = dataResponse.contact;
      formRecruitment.recruitment_title = dataResponse.recruitment_title;
      formRecruitment.recruitment_overview = dataResponse.recruitment_overview;
      if (dataResponse.staff_reviews.length) {
        dataResponse.staff_reviews.forEach((item, index) => {
          if (index) {
            errorsFormStaff.value.push({
              image: "",
              title_keyword: "",
              overview: "",
            });
            loadingImage.value.push(false);
            formRecruitment.staff_reviews.push({});
          }
          formRecruitment.staff_reviews[index].image = item?.image.id || null;
          formRecruitment.staff_reviews[index].title_keyword = item.title;
          formRecruitment.staff_reviews[index].overview = item.content;
          formRecruitment.staff_reviews[index].id = item.id;
          if (formRecruitment.staff_reviews[index]) {
            formRecruitment.staff_reviews[index].image_ids = [
              {
                url: item?.image?.url,
                id: item?.image?.id,
              },
            ];
          }
        });
      } else {
        formRecruitment.staff_reviews = [];
      }
    }
  } catch (_) {
    await router.push({ name: "recruitment-information-setting" });
  } finally {
    isMounted.value = false;
  }
};

onBeforeMount(async () => {
  await getDataResponse();
});
</script>

<style lang="scss" scoped>
@import "~/../../src/store/assets/scss/variables.scss";

.container-setting-recruitment {
  .form-body {
    display: flex;
    gap: 96px;

    .left {
      flex-basis: 45%;

      .group-date {
        width: 100%;
        display: flex;
        gap: 12px;
      }
    }

    .right {
      flex-basis: 45%;

      .line {
        margin-top: 10px;
        border-bottom: 1px solid $gray-400;
        margin-bottom: 20px;
      }

      .group-overview,
      .staff-reviews {
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

        .delete-course {
          display: flex;
          cursor: pointer;
          gap: 10px;

          span {
            margin-top: -3px;
            color: $red-100;
          }
        }
      }

      .add-course {
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
  }
}

:deep(.el-date-editor) {
  width: 100%;
  height: 40px;
}
</style>
