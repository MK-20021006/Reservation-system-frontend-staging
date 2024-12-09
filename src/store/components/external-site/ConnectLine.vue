<template>
  <div class="connect-line">
    <connect-template
      :disabled-connect="formData.status && data"
      :disabled-save="!formData.status"
      :is-loading-connect="loading"
      :is-loading-save="loadingSubmit"
      @connect-data="checkConnection(formRef)"
      @save-data="postLine(formRef)"
    >
      <template #connect-type>
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="lineRules"
        >
          <div class="channel-id d-flex">
            <el-form-item
              v-if="!data"
              :label="$t('store.chanel_id')"
              prop="channel_id"
            >
              <input-text
                v-model="formData.channel_id"
                width="400px"
                :disabled="formData.status && data"
              />
            </el-form-item>
            <div v-if="!data" class="show-text-link">
              {{ $t("store.line_click") }}
              <span class="link" @click="openLink('https://manager.line.biz/')">
                {{ $t("store.official_account_manager") }}
              </span>
              {{ $t("store.or") }}
              <span
                class="link"
                @click="openLink('https://developers.line.biz/console/')"
              >
                {{ $t("store.line_developer_console") }}
              </span>
              {{ $t("store.in_can_be_confirmed") }}
            </div>
          </div>

          <el-form-item :label="$t('store.channel_secret')" prop="secret">
            <input-text
              v-model="formData.secret"
              width="400px"
              :disabled="formData.status && data"
            />
          </el-form-item>
          <el-form-item :label="$t('store.access_token')" prop="access_token">
            <input-text
              v-model="formData.access_token"
              width="400px"
              :disabled="formData.status && data"
            />
          </el-form-item>
          <el-form-item
            :label="$t('qr_code_line')"
            class="d-flex align-items-center"
          >
            <input-file
              v-loading="loadingImage"
              :accept-type="IMAGE_TYPE_LINE"
              :err-type="'errors.type_file_line'"
              :width="'160px'"
              :height="'160px'"
              :limit="limit"
              :data="imageId"
              @handle-remove-image="handleRemove"
              @handle-change-image="handleImageChange"
            />
          </el-form-item>
          <el-form-item
            :label="$t('rich_menu')"
            class="d-flex align-items-center"
          >
            <input-file
              v-loading="loadingImageRickMenu"
              :accept-type="IMAGE_TYPE_LINE"
              :err-type="'errors.type_file_line'"
              :width="'160px'"
              :height="'160px'"
              :limit="limit"
              :data="imageIdRickMenu"
              @handle-remove-image="handleRemoveLine"
              @handle-change-image="handleImageChangeLine"
            />
          </el-form-item>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div v-if="formData.status" class="confirmation-status">
                <IconCheck />
                <div class="status">{{ $t("store.correct_information") }}</div>
              </div>
              <div v-if="!formData.status" class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>
          <div-inline
            :label="'line_linkage_method'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div>
                <a
                  class="text-guide"
                  target="_blank"
                  href="https://jp.ar-xia.com/line-integration/ "
                  >{{ $t("coordination_procedure") }}</a
                >
              </div>
            </template>
          </div-inline>
        </el-form>
      </template>
    </connect-template>
  </div>
</template>

<script lang="ts" setup>
import ConnectTemplate from "./ConnectTemplate";
import { reactive, ref, toRefs, watch } from "vue";
import { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import lineRules from "~/../../src/store/validates/line";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { DataFile } from "~/../../src/shared/models";
import { IMAGE_TYPE_LINE } from "~/../../src/shared/utils/validate";
import {
  messageError,
  messageSuccess,
  createSuccess,
  createError,
  uploadImageError,
} from "~/../../src/shared/utils/notification";

const openLink = (link: string) => {
  window.open(link, "_blank");
};
const hideUploadQrCode = ref(false);
const hideUploadRickMenu = ref(false);
const loadingImage = ref(false);
const loadingImageRickMenu = ref(false);
const limit = ref(1);
const imageId = ref([]);
const imageIdRickMenu = ref([]);
interface Line {
  channel_id: string;
  secret: string;
  access_token: string;
  qr_code_url: string;
  link_richmenu: string;
}
interface Prop {
  data: Line;
  connectLine: "";
}
const emits = defineEmits(["updateLine"]);
const props = defineProps<Prop>();
const { data, connectLine } = toRefs(props);

const formRef = ref<FormInstance>();
const formData = reactive({
  secret: data.value?.secret || "",
  access_token: data.value?.access_token || "",
  channel_id: "",
  status: !!data.value,
  qr_code_url: "",
  link_richmenu: "",
});

const handleRemove = async (file, fileList) => {
  imageId.value = fileList;
  if (file.url) {
    formData.qr_code_url = "";
  }
};

const handleRemoveLine = async (file, fileList) => {
  imageIdRickMenu.value = fileList;
  if (file.url) {
    formData.link_richmenu = "";
  }
};

const handleImageChange = async (file, fileList) => {
  imageId.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.qr_code_url = data.url;
  } catch (error) {
    if (error.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    imageId.value = [];
  } finally {
    loadingImage.value = false;
  }
};

const handleImageChangeLine = async (file, fileList) => {
  imageIdRickMenu.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImageRickMenu.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.link_richmenu = data.url;
  } catch (error) {
    if (error.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      uploadImageError();
    }
    imageIdRickMenu.value = [];
  } finally {
    loadingImageRickMenu.value = false;
  }
};

const loading = ref(false);
const loadingSubmit = ref(false);
const disableImage = ref(false);
const disableImageRickMenu = ref(false);
const checkConnection = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await storeSettingRequest.checkLineAvailable(formData);
        formData.status = true;
        messageSuccess("success.connect_line");
      } catch (error) {
        formData.status = false;
        messageError("errors.connect_external");
      } finally {
        loading.value = false;
      }
    } else {
      formData.status = false;
    }
  });
};

const postLine = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.status) {
          loadingSubmit.value = true;
          await storeSettingRequest.saveLineSetting(formData);
          emits("updateLine");
          createSuccess();
          disableImage.value = true;
          disableImageRickMenu.value = true;
        } else {
          messageError("errors.setting_line");
        }
      } catch (error) {
        formData.status = false;
        createError();
      } finally {
        loadingSubmit.value = false;
      }
    } else {
      formData.status = false;
    }
  });
};

watch(data, (value) => {
  if (value) {
    formData.secret = value.secret;
    formData.access_token = value.access_token;
    formData.channel_id = value.channel_id;
    formData.qr_code_url = value.qr_code_url;
    formData.link_richmenu = value.link_richmenu;

    imageId.value = value.qr_code_url
      ? [
          {
            url: value.qr_code_url,
          },
        ]
      : [];

    imageIdRickMenu.value = value.link_richmenu
      ? [
          {
            url: value.link_richmenu,
          },
        ]
      : [];

    if (connectLine.value && !value.qr_code_url) {
      hideUploadQrCode.value = true;
    }

    if (connectLine.value && value.qr_code_url) {
      disableImage.value = true;
    }

    if (connectLine.value && !value.link_richmenu) {
      hideUploadRickMenu.value = true;
    }

    if (connectLine.value && value.link_richmenu) {
      disableImageRickMenu.value = true;
    }
  } else {
    formData.secret = "";
    formData.channel_id = "";
    formData.access_token = "";
    formData.qr_code_url = "";
    formData.link_richmenu = "";
    imageId.value = [];
    imageIdRickMenu.value = [];
    hideUploadQrCode.value = false;
    hideUploadRickMenu.value = false;
    disableImage.value = false;
    disableImageRickMenu.value = false;
  }
  formData.status = !!value;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.data-form) {
  width: 100% !important;
}

:deep(.el-form-item) {
  .el-form-item__label {
    width: 160px;
    min-width: 160px;
    justify-content: flex-start;
    padding: unset;
  }
}

.channel-id {
  gap: 20px;

  .show-text-link {
    .link {
      cursor: pointer;
      text-decoration: underline;
      color: $green-50;
    }
  }
}
</style>
