<template>
  <div class="user-profile-container">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("store_introduction") }}</Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" :is-hidden="true" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="header-register">
      <div class="header-register__title">{{ $t("store_introduction") }}</div>
      <div class="header-register__text">{{ $t("site_name") }}</div>
    </div>
    <div class="description text-center">
      {{ $t("store.please_fill_data") }}
    </div>
    <div v-loading="loading" class="profile-content">
      <div class="personal-information">
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="introductionRules"
        >
          <div-inline :label="'industry'" :is-required="true">
            <template #form-item>
              <el-form-item>
                <el-radio-group
                  v-model="formData.type_store_id"
                  @change="getListTags(true)"
                >
                  <el-radio
                    v-for="item in filterDataTypeStore"
                    :key="item.id"
                    :label="item.id"
                    size="large"
                    >{{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </div-inline>

          <div-inline :label="'name_store'" :is-required="true">
            <template #form-item>
              <el-form-item prop="name" :error="getError('name')">
                <InputText
                  v-model="formData.name"
                  :maxlength="MAX_LENGTH_FIRST_NAME"
                  :width="'100%'"
                  :placeholder="$t('placeholder.store_name_customer_register')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'store_name_furigana'">
            <template #form-item>
              <el-form-item
                prop="name_furigana"
                :error="getError('name_furigana')"
              >
                <InputText
                  v-model="formData.name_furigana"
                  :maxlength="MAX_LENGTH_FIRST_NAME"
                  :width="'100%'"
                  :placeholder="
                    $t('placeholder.store_name_customer_register_furigana')
                  "
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'owner_name'">
            <template #form-item>
              <el-form-item prop="owner_name" :error="getError('owner_name')">
                <InputText
                  v-model="formData.owner_name"
                  :maxlength="MAX_LENGTH_FIRST_NAME"
                  :width="'100%'"
                  :placeholder="$t('owner_name')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="$t('genre')" :is-required="true">
            <template #form-item>
              <el-form-item
                class="align-items-center"
                prop="tag"
                :error="getError('tag')"
              >
                <ClientOnly>
                  <SelectTag
                    v-model="formData.tag"
                    prop-key="id"
                    :options="tags"
                    value="name"
                    label="name"
                    :placeholder="$t('placeholder.enter_genre')"
                  />
                </ClientOnly>
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'front.business_hour'">
            <template #form-item>
              <el-form-item>
                <TimeRanger
                  v-model:start-time="formData.start_time"
                  v-model:end-time="formData.end_time"
                  @update:startTime="updateStartTime"
                  @update:endTime="updateEndTime"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="$t('regular_holiday')">
            <template #form-item>
              <el-form-item
                class="align-items-center"
                :error="getError('day_off')"
              >
                <ClientOnly>
                  <el-checkbox-group v-model="formData.day_off">
                    <span v-for="day in DATA_DAY" class="mr-40">
                      <el-checkbox
                        v-if="day.id !== 7"
                        :key="day.id"
                        :label="day.id"
                      >
                        {{ day.name }}
                      </el-checkbox>
                    </span>
                  </el-checkbox-group>
                </ClientOnly>
              </el-form-item>
            </template>
          </div-inline>
          <div-inline
            :label="'phone_number'"
            :is-required="true"
            :error="getError('phone_number')"
          >
            <template #form-item>
              <el-form-item prop="phone_number">
                <InputPhone v-model="formData.phone_number" />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'email_address'">
            <template #form-item>
              <el-form-item prop="email" :error="getError('email')">
                <input-text
                  v-model="formData.email"
                  width="100%"
                  :placeholder="$t('placeholder.email')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="$t('home_page')">
            <template #form-item>
              <!--Home Page-->
              <el-form-item
                prop="home_page"
                class="align-items-center"
                :error="getError('home_page')"
              >
                <input-text
                  v-model="formData.home_page"
                  :placeholder="$t('placeholder.home_page')"
                >
                </input-text>
              </el-form-item>
              <!--END Home Page-->
            </template>
          </div-inline>
          <div-inline :label="'postal_code'" class="postal-code">
            <template #form-item>
              <el-form-item
                class="input-postal-code"
                prop="postal_code"
                :error="getError('postal-code')"
              >
                <InputCode v-model="formData.postal_code" />
              </el-form-item>
              <button-yellow
                class="button-search"
                :name="$t('search_address')"
                :width="'116px'"
                :font-weight="'700'"
                :loading="loadingSearch"
                :icon="IconSearchButton"
                :disable="!formData.postal_code || !formData.postal_code.trim()"
                @click="searchAddress"
              />
            </template>
          </div-inline>
          <div-inline :label="'address'" :is-required="true">
            <template #form-item>
              <el-form-item
                class="group-address"
                prop="address"
                :error="getError('address')"
              >
                <InputText
                  v-model="formData.address"
                  class="address"
                  :width="'100%'"
                  :placeholder="$t('placeholder.first_address')"
                />
              </el-form-item>
              <el-form-item
                class="group-address detail-address"
                prop="address_detail"
                :error="getError('address_detail')"
              >
                <InputText
                  v-model="formData.address_detail"
                  :width="'100%'"
                  :placeholder="$t('placeholder.second_address')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'impressions'">
            <template #form-item>
              <el-form-item>
                <input-text
                  v-model="formData.inquiry"
                  type="textarea"
                  rows="3"
                  width="100%"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div class="terms-of-use mt-30">
            <el-checkbox v-model="formData.isAgree" class="agree">
              <div class="d-flex align-items-center">
                <el-link
                  type="primary"
                  target="_blank"
                  :href="`${config.urlCustomer}privacy`"
                  >{{ $t("store.terms_of_use") }}
                </el-link>
              </div>
            </el-checkbox>
          </div>
        </el-form>
      </div>
    </div>
    <div class="group-button">
      <button-common
        :name="$t('referral_application')"
        :color="'white'"
        :background-color="'#b4985c'"
        :disabled="!formData.isAgree"
        :loading="loadingSave"
        width="109px"
        @click="submitForm(formRef)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import introductionRules from "~/../../src/front/validate/introduction";
import { i18n } from "../../shared/plugins/i18n";
import IconSearchButton from "../components/Icon/SearchButton.vue";
import InputText from "../../shared/components/input/InputText.vue";
import InputPhone from "../../shared/components/input/Phone.vue";
import InputCode from "../../shared/components/input/Code.vue";
import ButtonCommon from "../../shared/components/button/ButtonCommon.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import { searchAddressHelper } from "~/../../src/shared/utils";
import {
  messageSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { MAX_LENGTH_FIRST_NAME } from "~/../../src/shared/utils/validate";
import { TagInterface } from "~/../../src/store/models";
import TagRequest from "~/../../src/shared/requests/TagRequest";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import SelectTag from "~/../../src/shared/components/input/SelectTag.vue";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import { DATA_DAY } from "~/../../src/shared/constants/reservation";
import { DEFAULT_TIME } from "~/../../src/shared/constants";
import typeStoreCategory from "~/../../src/shared/constants/category";
import { MAX_DAY_OFF } from "~/../../src/shared/constants";
import { useRuntimeConfig } from "#app";

definePageMeta({
  middleware: ["auth"],
});

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const tags = ref<TagInterface[]>([]);
const errorData = ref({});
const loading = ref(false);
const loadingSave = ref(false);
const loadingSearch = ref(false);
const config = useRuntimeConfig();

const formData = reactive({
  type_store_id: typeStoreCategory.SALON,
  name: "",
  name_furigana: "",
  tag: [],
  day_off: [],
  home_page: "",
  start_time: DEFAULT_TIME.START_TIME,
  end_time: DEFAULT_TIME.END_TIME,
  owner_name: "",
  email: "",
  phone_number: "",
  postal_code: "",
  address: "",
  address_detail: "",
  inquiry: "",
  isAgree: false,
});

const dataTitle = reactive([{ name: t("store_introduction"), path: "" }]);
const filterDataTypeStore = computed(() => {
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const updateStartTime = (timeStart: string) => {
  formData.start_time = timeStart;
};

const updateEndTime = (timeEnd: string) => {
  formData.end_time = timeEnd;
};

const getError = (field: string) => {
  return errorData.value[field]?.[0];
};

const searchAddress = async () => {
  try {
    loadingSearch.value = true;
    const { address, address_detail } = await searchAddressHelper(
      formData.postal_code
    );
    formData.address = address;
    formData.address_detail = address_detail;
  } finally {
    loadingSearch.value = false;
  }
};

const resetForm = () => {
  for (let key in formData) {
    if (formData.hasOwnProperty(key)) {
      formData[key] = "";
    }
  }

  formData.day_off = [];
  formData.type_store_id = typeStoreCategory.SALON;
  formData.isAgree = false;
  formData.start_time = DEFAULT_TIME.START_TIME;
  formData.end_time = DEFAULT_TIME.END_TIME;
  getListTags(true);
};

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.day_off.length === MAX_DAY_OFF) {
          messageError("errors.click_day_off_full");
          return;
        }

        loadingSave.value = true;
        errorData.value = {};
        const params = {
          type_store_id: formData.type_store_id,
          name: formData.name,
          first_company_name_kana: formData.name_furigana,
          first_company_name: formData.owner_name,
          tag: formData.tag,
          opening_times: [
            {
              day_of_week: 0,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 1,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 2,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 3,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 4,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 5,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
            {
              day_of_week: 6,
              start: formData.start_time,
              end: formData.end_time === "24:00" ? "23:59" : formData.end_time,
            },
          ],
          home_page: formData.home_page,
          inquiry: formData.inquiry,
          email: formData.email,
          phone_number: formData.phone_number,
          postal_code: formData.postal_code,
          address: formData.address,
          address_detail: formData.address_detail,
        };
        params.opening_times = params.opening_times.filter(
          (time) => !formData.day_off.includes(time.day_of_week)
        );
        await StoreRequest.customerRegisterStore(params);
        resetForm();
        messageSuccess("success.customer_register_store_success");
      } catch (e) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = e.data.errors;
        }
      } finally {
        loadingSave.value = false;
      }
    }
  });
};

const getListTags = async (isChangeTypeStore = false) => {
  if (isChangeTypeStore) {
    formData.tag = [];
  }
  tags.value = (
    await TagRequest.getAllTagByStore<TagInterface[]>(formData.type_store_id)
  )?.data;
};

onMounted(async () => {
  await getListTags();
  scrollToTop();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.div-inline .label-text) {
  min-width: 200px;
}

.header-register {
  padding: 15px;
  text-align: center;
  line-height: 24px;

  &__title {
    font-size: 20px;
    font-weight: 700;
  }

  &__text {
    color: $black-40;
    font-size: 14px;
  }
}

.detail-address {
  margin-left: 10px;
}

:deep(.title) {
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  width: 100%;
  background-color: $gray-100;
  padding: 10px;
  margin-top: 20px;
}

:deep(.description) {
  color: $black-60;
  margin: 0 auto;
  line-height: 22px;
  white-space: pre-line;
}

.terms-of-use {
  margin-bottom: 30px;
  text-align: center;
}

:deep(.el-radio__input) {
  .el-radio__inner {
    &:after {
      background-color: #b4985c;
    }
  }
}

:deep(.el-radio.is-checked .el-radio__input .el-radio__inner) {
  border: 1px solid #b4985c !important;
}

:deep(.input-postal-code) {
  width: calc(100% - 327px) !important;
}

.user-profile-container {
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;

  .title {
    font-weight: 500;
    font-size: 20px;
  }

  .button-search {
    margin-left: 10px;

    &:hover {
      color: white;
      background-color: $yellow-color;
    }
  }

  .profile-content {
    padding: 32px 0 0;
    display: flex;
    justify-content: center;
    gap: 64px;
    width: 65%;

    :deep(.input-date) {
      width: 100%;
      height: 40px;
    }

    :deep(.el-select) {
      width: 100%;
    }

    :deep(.div-inline) {
      margin-bottom: 0;

      .div-block {
        width: 50%;
      }
    }

    .personal-information {
      width: calc(100% - 200px);

      :deep(.el-date-editor.el-input) {
        height: 40px;
      }

      .el-form-item {
        margin-bottom: 24px;
        width: calc(100% - 200px);
      }

      .group-address {
        :deep(.el-form-item__content) {
          justify-content: space-between;
        }
      }
    }

    :deep(.address-detail) {
      margin-left: 10px;
    }

    .group-button {
      text-align: center;
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .user-profile-container {
    .profile-content {
      gap: 32px 24px;
      width: 100%;
    }

    :deep(.address-detail) {
      margin-left: 10px;
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .user-profile-container {
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;

    .detail-address {
      margin-left: 0;
    }

    .button-search {
      margin: -12px 0 24px 0;
    }

    .profile-content {
      padding: 24px 0 8px 0;
      flex-direction: column;
      gap: 24px 24px;
      width: 100%;

      :deep(.div-inline) {
        margin-bottom: 0;
        flex-direction: column;

        .label-text {
          padding-bottom: 8px;
          padding-top: 0;
        }

        .label-class {
          display: none;
        }
      }

      .personal-information {
        width: 100%;

        .el-form-item {
          width: 100% !important;
        }
      }
    }

    .group-address {
      :deep(.el-form-item__content) {
        justify-content: space-between;
      }

      :deep(.address-detail) {
        margin-left: 0;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .terms-of-use a {
    font-size: 12px;
  }
}
</style>
