<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("register_customer") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("register_customer") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div v-loading="loadingDetail" class="container-user-detail">
        <el-form
          ref="formRef"
          :model="formData"
          class="form-body"
          label-width="160px"
          label-position="left"
          :rules="customerRules"
          require-asterisk-position="right"
        >
          <div class="form">
            <el-form-item :label="$t('full_name_kanji')" required>
              <div class="d-flex">
                <el-form-item prop="first_name" class="firstname-kanji">
                  <input-text
                    v-model="formData.first_name"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.first_name')"
                  />
                </el-form-item>
                <el-form-item prop="last_name" class="lastname-kanji">
                  <input-text
                    v-model="formData.last_name"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.last_name')"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <div class="text-note__red">
              {{ $t("please_enter_in_hiragana") }}
            </div>

            <el-form-item :label="$t('name_katakana')" required>
              <div class="d-flex">
                <el-form-item prop="first_name_kana" class="firstname-kana">
                  <input-text
                    v-model="formData.first_name_kana"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.first_name_hiragana')"
                  />
                </el-form-item>
                <el-form-item prop="last_name_kana" class="lastname-kana">
                  <input-text
                    v-model="formData.last_name_kana"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    class="name-kanji"
                    :placeholder="$t('placeholder.last_name_hiragana')"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <el-form-item prop="email" :label="$t('email_address')">
              <input-text
                v-model="formData.email"
                :maxlength="MAX_LENGTH_EMAIL"
              ></input-text>
            </el-form-item>
            <el-form-item :label="$t('gender')">
              <client-only>
                <el-select
                  v-model="formData.gender"
                  :placeholder="$t('gender')"
                >
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  >
                  </el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('birthday')">
              <InputDate
                v-model="formData.birth_day"
                :disabled-date="disabledDate"
              ></InputDate>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              prop="phone_number"
              required
            >
              <InputPhone v-model="formData.phone_number"> </InputPhone>
            </el-form-item>
            <el-form-item
              :label="$t('postal_code')"
              :error="getError('postal_code')"
              prop="postal_code"
              class="align-items-center"
            >
              <div class="d-flex w-100 post-code">
                <InputCode
                  v-model="formData.postal_code"
                  class="mr-10"
                ></InputCode>
                <button-common
                  :icon="Search"
                  background-color="#0071BC"
                  name="search_address"
                  color="white"
                  width="128px"
                  :loading="loadingSearch"
                  @click="handleSearchAddress"
                />
              </div>
            </el-form-item>
            <el-form-item :label="$t('address')" class="align-items-center">
              <div class="w-100">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item :error="getError('address')">
                      <InputText
                        v-model="formData.address"
                        :placeholder="$t('placeholder.first_address')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :error="getError('address_detail')">
                      <InputText
                        v-model="formData.address_detail"
                        :placeholder="$t('placeholder.second_address')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              prop="total_visited"
              :label="$t('admin.messages.access_log')"
              :error="getError('total_visited')"
            >
              <input-number
                v-model="formData.total_visited"
                :placeholder="$t('admin.messages.access_log')"
              ></input-number>
            </el-form-item>
            <el-form-item
              :error="errorData?.time_end_visited"
              prop="time_end_visited"
              :label="$t('store.last_visit')"
            >
              <client-only>
                <el-date-picker
                  v-model="formData.time_end_visited"
                  type="datetime"
                  :placeholder="$t('store.last_visit')"
                  format="YYYY年MM月DD日 HH:mm:ss"
                  value-format="YYYY-MM-DD hh:mm:ss"
                  :disabled-date="disabledDateTime"
                  :teleported="false"
                  @change="changeDateTime"
                ></el-date-picker>
              </client-only>
            </el-form-item>
          </div>
        </el-form>
        <ConfirmPlan
          :dialog-visible="isShowModalPlanConfirm"
          @handle-close="handleCloseModalPlan"
          @handle-confirm="handleConfirmModalPlan"
        />
      </div>
    </template>

    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :loading="isLoadingSave"
            @click="createCustomer(formRef)"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { useRoute } from "nuxt/app";
import { genderOptions } from "~/../../src/shared/constants/user";
import { GENDER } from "~/../../src/shared/constants/user";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate";
import { useRouter } from "#imports";
import { useSearchAddress } from "~/../../src/store/mixins/storeMixin";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import customerRules from "~/../../src/store/validates/customer";
import {
  createSuccess,
  createError,
  messageError,
} from "~/../../src/shared/utils/notification";
import moment from "moment";
import CustomerRequest from "~/../../src/shared/requests/CustomerRequest";
import Search from "~/../../src/store/components/Icon/Search.vue";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import InputNumber from "~/../../src/shared/components/input/InputNumber.vue";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_EMAIL,
} from "~/../../src/shared/utils/validate";

const loadingSearch = ref(false);
const router = useRouter();
const loadingDetail = ref(false);
const route = useRoute();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const id = ref(null);
const errorsForm = ref({});
const errorData = ref({});
const isLoadingSave = ref(false);
const isShowModalPlanConfirm = ref(false);
const backupDate = ref(null);
const checkValidateDate = ref(true);
const formData = reactive({
  first_name: "",
  last_name: "",
  first_name_kana: "",
  last_name_kana: "",
  email: "",
  gender: null,
  birth_day: "",
  phone_number: "",
  address: "",
  address_detail: "",
  postal_code: "",
  total_visited: "",
  time_end_visited: "",
});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const disabledDate = (time: Date): boolean => {
  return moment(time) > moment();
};

const disabledDateTime = (time: Date): boolean => {
  return moment(time) >= moment();
};

const changeDateTime = (time) => {
  if (!time) {
    checkValidateDate.value = true;
  }

  if (new Date(time).getTime() > new Date(moment()).getTime()) {
    formData.time_end_visited = backupDate.value || null;
    errorData.value = {
      time_end_visited: t("invalid_date_choose"),
    };
    checkValidateDate.value = false;
  } else {
    checkValidateDate.value = true;
    errorData.value = {};
    backupDate.value = time;
  }
};
const handleSearchAddress = () => {
  useSearchAddress(formData, loadingSearch);
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const createCustomer = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid && checkValidateDate.value) {
      try {
        isLoadingSave.value = true;
        errorData.value = {};
        await CustomerRequest.createCustomer(formData);
        createSuccess();
        await router.push({ name: "customer" });
      } catch (error) {
        if (error?.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else if (error?.response.status === STATUS_CODE.BAD_REQUEST) {
          messageError(error?.data.message);
        } else {
          errorData.value = error?.data?.errors;
          createError();
        }
      } finally {
        isLoadingSave.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.container-user-detail {
  padding-bottom: 24px;

  .form-body {
    display: flex;
    justify-content: space-between;

    .text-note__red {
      font-size: 14px;
      margin-bottom: 10px;
      margin-left: 160px;
    }

    .name-kanji,
    .name-kana {
      width: 278px;
    }

    .lastname-kanji,
    .lastname-kana {
      margin-left: 10px;
    }

    .image-avatar {
      height: 160px;
      width: 160px;
    }

    .form {
      flex-basis: 45%;

      .login_type {
        padding-left: 16px;

        &.system-type {
          padding-left: 0;
        }
      }

      .link-history {
        font-size: 14px;
        margin-left: calc(100% - 210px);

        a {
          text-decoration: underline;
        }
      }
    }
  }
}

.group-button {
  justify-content: flex-end !important;
}

:deep(.el-form-item) {
  align-items: center;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.input-date) {
  width: 100%;

  .el-input__wrapper {
    flex-direction: row-reverse;
  }
}

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

:deep(.btn-add) {
  background-color: #00a99d;
  border-color: #00a99d;
}

:deep(.el-picker-panel__footer) {
  button:first-child {
    display: none;
  }
}
</style>
