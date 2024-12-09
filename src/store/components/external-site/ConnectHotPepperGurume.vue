<template>
  <div v-loading="loadingChange" class="connect-hotpepper-gurume">
    <connect-template-crawl
      :disabled-connect="formData.status && data"
      :disabled-save="!formData.status || (formData.status && data)"
      :is-loading-connect="loading"
      :is-loading-save="loadingSubmit"
      :is-hidden-button-save="formData.status === STATUS_CONNECT.SUCCESSFUL"
      :is-hidden-button-connect="!formData.setting_mail_forward"
      @connect-data="checkConnection(formRef)"
      @save-data="postHotPepper(formRef)"
    >
      <template #connect-type>
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="hotPepperRules"
        >
          <div-inline :label="'name_store'" :is-required="true">
            <template #form-item>
              <el-form-item
                prop="identity_from_mail"
                :error="errorMsg['identity_from_mail']"
              >
                <input-text
                  v-model="formData.identity_from_mail"
                  width="400px"
                  :disabled="formData.status === STATUS_CONNECT.SUCCESSFUL"
                  :placeholder="
                    $t('placeholder.enter_store_name_of_the_external_site')
                  "
                />
              </el-form-item>
            </template>
          </div-inline>
          <div class="text-note">
            {{ $t("store.text_note_enter_store_name") }}
          </div>
          <div-inline :label="'store.user_id'" :is-required="true">
            <template #form-item>
              <el-form-item prop="account">
                <input-text
                  v-model="formData.account"
                  width="400px"
                  :placeholder="$t('store.user_id')"
                  :disabled="formData.status === STATUS_CONNECT.SUCCESSFUL"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'password'" :is-required="true">
            <template #form-item>
              <el-form-item prop="password">
                <InputPassword
                  v-model="formData.password"
                  width="400px"
                  :maxlength="MAX_LENGTH_PASSWORD_HOTPEPER_GURUME"
                  :placeholder="$t('password')"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                  :disabled="formData.status === STATUS_CONNECT.SUCCESSFUL"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div
                v-if="formData.status === STATUS_CONNECT.SUCCESSFUL"
                class="confirmation-status"
              >
                <IconCheck />
                <div class="status">
                  {{ $t("store.correct_information") }}
                </div>
              </div>
              <div v-else-if="formData.status === STATUS_CONNECT.WAITING">
                <div class="status">
                  {{ $t("store.running_connection") }}
                  <span class="text-red">
                    {{ $t("check_status_in_list_job") }}</span
                  >
                </div>
              </div>
              <div v-else class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>

          <template v-if="formData.status === STATUS_CONNECT.SUCCESSFUL">
            <div-inline
              :label="'forwarding_settings'"
              :class-name="'option-connect'"
            >
              <template #form-item>
                <el-radio-group
                  v-model="formData.setting_mail_forward"
                  @change="handleChangeMailStatus"
                >
                  <el-radio :label="STATUS_TYPE.ENABLE">{{
                    $t("completion")
                  }}</el-radio>
                  <el-radio :label="STATUS_TYPE.DISABLE">{{
                    $t("incomplete")
                  }}</el-radio>
                </el-radio-group>
              </template>
            </div-inline>
            <div class="mail-forward">
              <div class="option-connect">
                <span>{{ $t("please_set_exclusive_email_1") }}</span>
                <span class="text-highlight">{{ emailForward }}</span>
                <span> {{ $t("please_set_exclusive_email_2") }}</span>
              </div>
              <div class="text-note-check-mail">
                <span>{{ $t("text_note_check_mail_1") }}</span>
                <span class="text-highlight">{{
                  $t("text_note_check_mail_hot_pepper_gurume")
                }}</span>
                <span>{{ $t("text_note_check_mail_2") }}</span>
              </div>
              <div-inline
                :label="'store.hot_pepper_gourmet'"
                :class-name="'option-connect'"
              >
                <template #form-item>
                  <a
                    class="text-link link"
                    :href="URL_HOT_PEPPER"
                    target="_blank"
                  >
                    {{ URL_HOT_PEPPER }}
                  </a>
                </template>
              </div-inline>
            </div>
          </template>
        </el-form>
      </template>
    </connect-template-crawl>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";
import { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPassword from "~/../../src/shared/components/input/InputPasswordCache.vue";
import { STATUS_TYPE } from "~/../../src/shared/constants";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import {
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import hotPepperRules from "~/../../src/store/validates/hotPepper.ts";
import { MAX_LENGTH_PASSWORD_HOTPEPER_GURUME } from "~/../../src/shared/utils/validate";
import ConnectTemplateCrawl from "~/../../src/store/components/external-site/ConnectTemplateCrawl.vue";
import bookingRequest from "~/../../src/shared/requests/BookingRequest";
import { STATUS_CONNECT } from "~/../../src/shared/constants/status";
import { useRuntimeConfig } from "nuxt/app";
import { EMAIL_FORWARD_EXTERNAL } from "~/../../src/shared/constants";
import { URL_HOT_PEPPER } from "~/../../src/shared/constants";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

interface HotPepper {
  account: string;
  password: string;
  url_seat: string;
  setting_mail_forward: number;
}

interface Prop {
  data: HotPepper;
}

const props = defineProps<Prop>();
const { data } = toRefs(props);
const formRef = ref<FormInstance>();
const urlSeat = `${window.location.href.split("/external-site")[0]}/store/seat`;
const formData = reactive({
  identity_from_mail: data.value?.identity_from_mail,
  account: data.value?.account || "",
  password: data.value?.password || "",
  status: data.value?.status || STATUS_CONNECT.FAILED,
  url_seat: urlSeat,
  setting_mail_forward: data.value?.setting_mail_forward || 0,
});
const config = useRuntimeConfig();
const emailForward = config.public.emailForward || EMAIL_FORWARD_EXTERNAL;
const emits = defineEmits(["updateHotPepper"]);
const loading = ref(false);
const loadingSubmit = ref(false);
const loadingChange = ref(false);
const errorMsg = ref({});

const handleChangeMailStatus = async () => {
  try {
    loadingChange.value = true;
    await storeSettingRequest.settingMailForwardHotPepper({
      setting_mail_forward: !!formData.setting_mail_forward,
    });
  } catch (e) {
    if (formData.setting_mail_forward) {
      formData.setting_mail_forward = 1;
    } else {
      formData.setting_mail_forward = 0;
    }
  } finally {
    loadingChange.value = false;
  }
};

const checkConnection = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await bookingRequest.synchronizedDataHotPepper();
        messageSuccess("success.setting_crawling_success");
      } catch (error) {
        messageError("errors.connect_external");
      } finally {
        loading.value = false;
      }
    }
  });
};

const postHotPepper = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      errorMsg.value = {};
      try {
        loadingSubmit.value = true;
        await storeSettingRequest.saveHotPepperSetting(formData);
        emits("updateHotPepper");
        messageSuccess("success.connect_hot_pepper");
      } catch (error) {
        if (error?.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorMsg.value = { identity_from_mail: error.response._data.message };
        } else {
          messageError("errors.connect_external");
        }
      } finally {
        loadingSubmit.value = false;
      }
    }
  });
};

watch(data, (value) => {
  if (value) {
    formData.account = value.account;
    formData.password = value.password;
    formData.identity_from_mail = value.identity_from_mail;
    formData.setting_mail_forward = value.setting_mail_forward || 0;
    formData.status = value.status;
  } else {
    formData.account = "";
    formData.password = "";
    formData.identity_from_mail = "";
    formData.setting_mail_forward = null;
    formData.status = STATUS_CONNECT.FAILED;
  }
});
</script>
