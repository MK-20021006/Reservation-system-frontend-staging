<template>
  <div v-loading="!isMounted">
    <div class="form">
      <el-form
        ref="_formRef"
        label-width="160px"
        label-position="left"
        :model="formData"
        :inline-message="true"
        :rules="seatRules"
        require-asterisk-position="right"
      >
        <el-form-item v-if="seat" :label="$t('crawler_site')">
          <input-text
            :model-value="getNameCrawler(seat.crawl_site)"
            :disabled="true"
            class="input-name"
          />
        </el-form-item>
        <el-form-item
          v-if="seat && !checkNotSiteCrawl()"
          :label="$t('crawler_id')"
        >
          <input-text
            :model-value="seat.crawl_id"
            :disabled="true"
            class="input-name"
          />
        </el-form-item>
        <el-form-item
          :label="$t('seat_name')"
          required
          prop="name"
          :error="errorsForm['name']?.[0]"
        >
          <el-input
            v-model="formData.name"
            v-input-trim
            :placeholder="$t('seat_name')"
            :maxlength="MAX_LENGTH_FIRST_NAME"
            clearable
            :disabled="seat && formData.crawl_site !== SITE_TYPE_SYSTEM"
          />
        </el-form-item>
        <el-form-item
          :label="$t('category')"
          prop="type_seat_id"
          :error="errorsForm['type_seat_id']?.[0]"
        >
          <ClientOnly>
            <el-select
              v-model="formData.type_seat_id"
              :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
            >
              <el-option
                v-for="item in seatCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </ClientOnly>
        </el-form-item>
        <el-form-item
          :label="$t('description')"
          prop="description"
          :error="errorsForm['description']?.[0]"
        >
          <el-input
            v-model="formData.description"
            v-input-trim
            :placeholder="
              formData.crawl_site !== SITE_TYPE_SYSTEM && seat
                ? ''
                : $t('placeholder.enter_explain')
            "
            type="textarea"
            rows="3"
            :maxlength="MAX_LENGTH_TEXTAREA"
            :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
          />
        </el-form-item>
        <el-form-item
          :label="$t('store.number_reverse')"
          class="number-man"
          required
        >
          <div
            class="w-100 d-flex align-items-start justify-content-between group-number"
          >
            <el-form-item
              prop="min_capacity"
              :error="errorsForm['min_capacity']?.[0]"
              class="flex-1"
            >
              <InputNumberText
                v-model="formData.min_capacity"
                class="input-number"
                placeholder=""
                :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
              />
              <span>{{ $t("man") }}</span>
            </el-form-item>
            <div>～</div>
            <el-form-item
              prop="capacity"
              :error="errorsForm['capacity']?.[0]"
              class="flex-1"
            >
              <InputNumberText
                v-model="formData.capacity"
                class="input-number"
                placeholder=""
                :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
              />
              <span>{{ $t("man") }}</span>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('store.number_table')"
          prop="quantity"
          :error="errorsForm['quantity']?.[0]"
          class="table"
        >
          <el-form-item>
            <InputNumberText
              v-model="formData.quantity"
              class="input-number"
              placeholder=""
              :min="1"
              :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
            />
            <span>{{ $t("store.table") }}</span>
          </el-form-item>
        </el-form-item>
        <el-form-item
          v-if="formData.crawl_site === SITE_TYPE_SYSTEM || !seat"
          :label="$t('image')"
        >
          <div class="group-image">
            <InputFile
              v-loading="loadingAvatar"
              :data="imagesUpload"
              :limit="limitImage"
              :placeholder="$t('store.placeholder_category_description')"
              @handle-remove-image="handleRemove"
              @handle-change-image="handleImageChange"
            />
            <ImageTextDescription />
          </div>
        </el-form-item>
        <el-form-item :label="$t('status')">
          <el-checkbox
            v-model="formData.status"
            :label="$t('display')"
            size="large"
            :true-label="1"
            :false-label="0"
            :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM && seat"
          />
        </el-form-item>
        <el-form-item v-if="seat" :label="$t('seat_status_booking')">
          <div class="text-link" @click="redirectToCalendar">
            {{ urlSeatToCalendar }}
          </div>
        </el-form-item>
        <el-form-item v-if="seat" :label="$t('created_at')">
          <el-input
            :suffix-icon="IconDate"
            disabled
            :model-value="formatDate(seat.created_at, 'YYYY年MM月DD日 HH:mm')"
          />
        </el-form-item>
        <el-form-item v-if="seat" :label="$t('updated_at')">
          <el-input
            :suffix-icon="IconDate"
            disabled
            :model-value="formatDate(seat.updated_at, 'YYYY年MM月DD日 HH:mm')"
          />
        </el-form-item>
        <!--------------------------------------        TABELOG        ------------------------------------------------------------->
        <el-form-item
          v-if="formData.crawl_site === SITE_TYPE_SYSTEM && seat"
          :label="getNameCrawler(SITE_TYPE_TABLELOG)"
          ><div v-if="checkTabelog" class="d-flex align-items-center w-100">
            <SeatExternal
              v-if="seatCrawlTypeTabelog.length"
              v-model="formData.seat_tabelog_id"
              class="gurunavi"
              :type-seat="formData.type_seat_tabelog"
              :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM"
              :list-type="seatCrawlTypeTabelog"
              :type-site="SITE_TYPE_TABLELOG"
              :is-submit="isSubmit"
              @validate="handleValidate"
            ></SeatExternal>
            <div
              v-if="
                formData.crawl_site === SITE_TYPE_SYSTEM &&
                seatCrawlTypeTabelog.length
              "
              class="delete-seat"
              @click="handleDelete(null, SITE_TYPE_TABLELOG)"
            >
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="
              formData.crawl_site === SITE_TYPE_SYSTEM &&
              !seatCrawlTypeTabelog.length
            "
          >
            {{ $t("no_data") }}
          </div>
          <div
            v-if="!checkTabelog && formData.crawl_site === SITE_TYPE_SYSTEM"
            class="add-seat"
            @click="handleAdd(SITE_TYPE_TABLELOG)"
          >
            <IconAddTime />
            <span>{{ $t("button.addition") }}</span>
          </div>
        </el-form-item>
        <!-------------------------------------------------ARXIA------------------------------------------------------------------------->
        <el-form-item
          v-if="
            formData.crawl_site
              ? formData.crawl_site !== SITE_TYPE_SYSTEM
              : false
          "
          :label="getNameCrawler(SITE_TYPE_SYSTEM)"
        >
          <SeatExternal
            v-if="formData.seat_arixa_name_id"
            v-model="formData.seat_arixa_name_id"
            :seat-id="formData.seat_id"
            :class="{ gurunavi: formData.crawl_site !== SITE_TYPE_SYSTEM }"
            :type-seat="formData.type_seat_axia"
            :disabled="true"
            :list-type="seatCrawlType"
            :type-site="SITE_TYPE_SYSTEM"
          ></SeatExternal>
          <div v-else>{{ $t("no_data") }}</div>
        </el-form-item>
        <!-------------------------------------------------GURUNAVI---------------------------------------------------------->
        <el-form-item
          v-if="formData.crawl_site === SITE_TYPE_SYSTEM && seat"
          :label="getNameCrawler(SITE_TYPE_GURUNABI)"
          ><div v-if="checkGurunavi" class="d-flex align-items-center w-100">
            <SeatExternal
              v-if="seatCrawlTypeGurunavi.length"
              v-model="formData.seat_grunavi_id"
              class="gurunavi"
              :type-seat="formData.type_seat_gurunavi"
              :disabled="formData.crawl_site !== SITE_TYPE_SYSTEM"
              :list-type="seatCrawlTypeGurunavi"
              :type-site="SITE_TYPE_GURUNABI"
              :is-submit="isSubmit"
              @validate="handleValidate"
            ></SeatExternal>
            <div
              v-if="
                formData.crawl_site === SITE_TYPE_SYSTEM &&
                seatCrawlTypeGurunavi.length
              "
              class="delete-seat"
              @click="handleDelete(null, SITE_TYPE_GURUNABI)"
            >
              <IconDeleteTime />
              <span>{{ $t("button.delete") }}</span>
            </div>
          </div>
          <div
            v-if="
              formData.crawl_site === SITE_TYPE_SYSTEM &&
              !seatCrawlTypeGurunavi.length
            "
          >
            {{ $t("no_data") }}
          </div>
          <div
            v-if="!checkGurunavi && formData.crawl_site === SITE_TYPE_SYSTEM"
            class="add-seat"
            @click="handleAdd(SITE_TYPE_GURUNABI)"
          >
            <IconAddTime />
            <span>{{ $t("button.addition") }}</span>
          </div>
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
      <ModalImageConfirm
        :dialog-visible="dialogVisible"
        @handle-close="dialogVisible = false"
      />
      <ConfirmPlan
        :dialog-visible="isShowModalPlanConfirm"
        @handle-close="handleCloseModalPlan"
        @handle-confirm="handleConfirmModalPlan"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import ModalImageConfirm from "../../../shared/components/modal/ImageConfirm.vue";

import { useRoute, useRouter } from "nuxt/app";
import { onMounted, reactive, ref } from "vue";
import type { UploadProps } from "element-plus";
import { FormInstance } from "element-plus";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import seatRules from "~/../../src/store/validates/seat";
import { ListAllResponse, Seat, Type } from "~/../../src/store/models";
import { DataFile, ImageUpload } from "~/../../src/shared/models/file";
import { ACTIVE } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import FileRequest from "~~/../../src/shared/requests/FileRequest";
import SeatRequest from "~~/../../src/shared/requests/SeatRequest";
import TypeRequest from "~~/../../src/shared/requests/TypeRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { changeDataImage, customTrimValue } from "~/../../src/shared/utils";
import {
  createSuccess,
  deleteError,
  deleteSuccess,
  messageError,
  updateError,
  updateSuccess,
  uploadImageError,
} from "~/../../src/shared/utils/notification";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import storeRequest from "~/../../src/shared/requests/StoreRequest";
import InputText from "../../../shared/components/input/InputText";
import { useMeStore } from "~/../../src/shared/stores/me";
import { isNotCrawler, getNameCrawler } from "~/../../src/shared/utils/crawl";
import {
  SITE_TYPE_TABLELOG,
  SITE_TYPE_SYSTEM,
  SITE_TYPE_GURUNABI,
} from "~/../../src/shared/constants/siteCrawl";

const { t } = i18n.global;
const route = useRoute();
const router = useRouter();

const seat = ref<Seat | null>(null);
const seatCategories = ref<Type[]>([]);
const seatCrawlTypeTabelog = ref<Type[]>([]);
const seatCrawlTypeGurunavi = ref<Type[]>([]);
const dialogVisible = ref(false);
const isShowModalPlanConfirm = ref(false);
const urlSeatToCalendar = `${window.location.host}/reservation?view_seat=true`;

const showDialog = () => {
  dialogVisible.value = true;
};

const checkTabelog = ref(true);
const checkGurunavi = ref(true);
const _formRef = ref();
const errorsForm = ref({});
const isLoadingAction = ref(false);
const isShowModalConfirm = ref(false);
const loadingAvatar = ref(false);
const isMounted = ref(false);
const lengthImageUpdate = ref<number>(0);
const store = useMeStore();
const storeId = store.getStoreId;
const validateSeat = ref(true);
const isSubmit = ref(false);

const limitImage = ref(useMeStore().getMaxImageByPlan);
const formData = reactive({
  name: "",
  description: "",
  type_seat_id: null,
  min_capacity: null,
  capacity: null,
  quantity: null,
  status: ACTIVE,
  image_id: [],
  seat_tabelog_id: null,
  type_seat_tabelog: null,
  seat_grunavi_id: null,
  type_seat_gurunavi: null,
  seat_id: null,
  type_seat: null,
  crawl_site: null,
});

const imagesUpload = ref<ImageUpload[]>([]);

const handleDelete = (index: number, type_site: number) => {
  switch (type_site) {
    case SITE_TYPE_TABLELOG:
      isSubmit.value = false;
      checkTabelog.value = false;
      formData.seat_tabelog_id = null;
      validateSeat.value = true;
      break;
    case SITE_TYPE_GURUNABI:
      isSubmit.value = false;
      checkGurunavi.value = false;
      formData.seat_grunavi_id = null;
      validateSeat.value = true;
      break;
  }
};

const handleAdd = (type_site: number) => {
  switch (type_site) {
    case SITE_TYPE_TABLELOG:
      formData.type_seat_tabelog = null;
      checkTabelog.value = true;
      break;
    case SITE_TYPE_GURUNABI:
      formData.type_seat_gurunavi = null;
      checkGurunavi.value = true;
      break;
  }
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const handleRemove: UploadProps["onRemove"] = async (file: ImageUpload) => {
  if (file?.id) {
    const index = formData.image_id.findIndex((item) => item === file.id);
    if (index > -1) {
      formData.image_id.splice(index, 1);
    }
  } else {
    const index = imagesUpload.value.findIndex((item) => item.uid === file.uid);
    if (index > -1) {
      imagesUpload.value.splice(index, 1);
    }
  }
};

const redirectToCalendar = () => {
  router.push(`/reservation?view_seat=true`);
};

const getMaxImage = async () => {
  const sizeImage = (await storeRequest.getMaxImage<any>(+store.getStoreId))
    .data;
  lengthImageUpdate.value = sizeImage.master;
};

const handleImageChange: UploadProps["onChange"] = async (
  file,
  fileList: ImageUpload[]
) => {
  imagesUpload.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  body.append("model_type", MODEL_TYPE.SEAT);
  if (imagesUpload.value.length - 1 >= lengthImageUpdate.value) {
    isShowModalPlanConfirm.value = true;
    imagesUpload.value.pop();
    return;
  }
  try {
    loadingAvatar.value = true;
    const response = (await FileRequest.post(body)) as ListAllResponse;
    const dataFile = response.data as DataFile;
    const index = fileList.findIndex((item) => item.uid === file.uid);
    fileList[index].id = dataFile.id;
    fileList[index].url = dataFile.url;
  } catch (error) {
    imagesUpload.value.pop();
    uploadImageError();
  } finally {
    loadingAvatar.value = false;
  }
};

const handleValidate = (validate) => {
  validateSeat.value = validate;
};

const createOrUpdateSeat = async (
  form: FormInstance | undefined,
  isUpdate = false
) => {
  if (!form) return;
  await form.validate(async (valid) => {
    errorsForm.value = {};
    isSubmit.value = true;
    if (valid && validateSeat.value) {
      try {
        isLoadingAction.value = true;
        if (!isUpdate) {
          formData.image_id = imagesUpload.value.map((item) => item.id);
          await SeatRequest.post({
            ...customTrimValue(formData),
          });
          createSuccess();
        } else {
          formData.image_id = imagesUpload.value.map((item) => item.id);
          await SeatRequest.put(+route.params?.id, formData);
          updateSuccess();
        }
        isSubmit.value = false;
        await router.push({ name: "store-seat" });
      } catch (e: any) {
        if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response?._data?.message);
        } else if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
        } else if (e.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-seat" });
        } else if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          updateError();
          await router.push({ name: "store-seat" });
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

const handleClose = () => {
  isShowModalConfirm.value = false;
};

const handleConfirm = async () => {
  try {
    isLoadingAction.value = true;
    await SeatRequest.delete(+route.params?.id);
    deleteSuccess();
    await router.push({ name: "store-seat" });
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-seat" });
    } else if (error?.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error?.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    isLoadingAction.value = false;
    isShowModalConfirm.value = false;
  }
};
const checkNotSiteCrawl = () => {
  return isNotCrawler(seat.value);
};

defineExpose({
  createOrUpdateSeat,
  _formRef,
  isLoadingAction,
  deleteRecord,
  loadingAvatar,
  checkNotSiteCrawl,
});
const getAllTypeSeat = async () => {
  seatCategories.value = (
    await TypeRequest.getAllType(MODEL_TYPE.SEAT, null, true, storeId)
  ).data;

  if (!formData.crawl_site || formData.crawl_site === SITE_TYPE_SYSTEM) {
    seatCategories.value = seatCategories.value.filter(
      (item) => item.crawl_site === SITE_TYPE_SYSTEM
    );
  }
};
seatCrawlTypeTabelog.value = (
  await SeatRequest.getTypeSeatCrawlBySite(SITE_TYPE_TABLELOG)
)?.data;

seatCrawlTypeGurunavi.value = (
  await SeatRequest.getTypeSeatCrawlBySite(SITE_TYPE_GURUNABI)
)?.data;

onMounted(async () => {
  await getMaxImage();
  try {
    if (+route.params?.id) {
      seat.value = (
        await SeatRequest.show<Seat>(+route.params?.id as number)
      )?.data;

      if (seat.value) {
        formData.crawl_site = seat.value.crawl_site;

        formData.name = seat.value.name;
        formData.type_seat_id = seat.value.model_has_type?.type_id;
        formData.status = seat.value.status;
        formData.description = seat.value.description;
        formData.min_capacity = seat.value.min_capacity;
        formData.capacity = seat.value.capacity;
        formData.quantity = seat.value.quantity;
        const { imageGet, dataImage } = changeDataImage(
          seat.value.model_has_file
        );
        imagesUpload.value = imageGet;
        formData.image_id = dataImage;
        lengthImageUpdate.value += seat.value.model_has_file.length;
        formData.seat_tabelog_id = seat.value.seat_tabelog_id;
        formData.type_seat_tabelog =
          seat.value.map_seat_tabelog?.model_has_type?.type_id;
        formData.seat_grunavi_id = seat.value.seat_grunavi_id;
        formData.type_seat_gurunavi =
          seat.value.map_seat_gurunavi?.model_has_type?.type_id;
        formData.type_seat_axia =
          seat.value.map_seat_axia?.model_has_type?.type?.name;
        formData.seat_arixa_name_id = seat.value.map_seat_axia?.id
          ? `${seat.value.map_seat_axia?.id} - ${seat.value.map_seat_axia?.name}`
          : null;
        formData.seat_id = seat.value.map_seat_axia?.id;
      }
    }
    await getAllTypeSeat();
  } catch (e) {
    await router.push({ name: "store-seat" });
  } finally {
    isMounted.value = true;
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

.form {
  max-width: 780px;
  width: 100%;
  padding-bottom: 10px;

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
      width: 214px;
      margin-right: 16px;
    }
  }

  :deep(.input-number) {
    width: 229px;
    margin-right: 16px;
  }

  .group-image {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  :deep(.table) {
    & > .el-form-item__content {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .external-site {
    .external-site-item {
      .external-item-details {
        display: flex;
        width: 100%;
      }
    }
  }
}

:deep(.gurunavi) {
  align-items: center;
  width: 100%;

  .form-item {
    width: 111%;
  }
}

:deep(.add-seat) {
  width: 95px;
  cursor: pointer;
  display: flex;
  margin-top: 5px;
  align-items: center;
  color: $blue-color;
  gap: 5px;
}

:deep(.delete-seat) {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: $red-100;
  gap: 5px;
  white-space: nowrap;
}

:deep(.el-checkbox__label) {
  color: $black-80 !important;
}
</style>
