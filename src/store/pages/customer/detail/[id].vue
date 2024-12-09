<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.detail_customer") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.detail_customer") }}</template>
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
            <el-form-item :label="$t('image')">
              <div v-if="!imagesUpload">
                <AvatarDefault />
              </div>
              <div v-else>
                <el-image
                  class="image-avatar"
                  :src="imagesUpload"
                  fit="contain"
                />
              </div>
            </el-form-item>
            <el-form-item :label="$t('full_name_kanji')" required>
              <div class="d-flex">
                <el-form-item prop="first_name" class="firstname-kanji">
                  <input-text
                    v-model="formData.first_name"
                    class="name-kanji"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    :placeholder="$t('placeholder.first_name')"
                    :disabled="!(route.query.type === CUSTOMER)"
                  />
                </el-form-item>
                <el-form-item prop="last_name" class="lastname-kanji">
                  <input-text
                    v-model="formData.last_name"
                    class="name-kanji"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    :placeholder="$t('placeholder.last_name')"
                    :disabled="!(route.query.type === CUSTOMER)"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <div v-if="route.query.type === CUSTOMER" class="text-note__red">
              {{ $t("please_enter_in_hiragana") }}
            </div>

            <el-form-item :label="$t('name_katakana')" required>
              <div class="d-flex">
                <el-form-item prop="first_name_kana" class="firstname-kana">
                  <input-text
                    v-model="formData.first_name_kana"
                    class="name-kanji"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    :placeholder="$t('placeholder.first_name_hiragana')"
                    :disabled="!(route.query.type === CUSTOMER)"
                  />
                </el-form-item>
                <el-form-item prop="last_name_kana" class="lastname-kana">
                  <input-text
                    v-model="formData.last_name_kana"
                    class="name-kanji"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    :placeholder="$t('placeholder.last_name_hiragana')"
                    :disabled="!(route.query.type === CUSTOMER)"
                  />
                </el-form-item>
              </div>
            </el-form-item>

            <el-form-item
              prop="email"
              :label="$t('email_address')"
              :required="route.query.type === CUSTOMER"
            >
              <input-text
                v-model="formData.email"
                :disabled="route.query.type !== CUSTOMER"
              ></input-text>
            </el-form-item>
            <el-form-item
              :label="$t('gender')"
              prop="gender"
              :required="route.query.type === USER"
            >
              <client-only>
                <el-select
                  v-model="formData.gender"
                  placeholder=""
                  :disabled="!(route.query.type === CUSTOMER)"
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
            <el-form-item
              :label="$t('birthday')"
              prop="birth_day"
              :required="route.query.type === USER"
            >
              <InputDate
                v-model="formData.birth_day"
                clearable
                :is-disable="!(route.query.type === CUSTOMER)"
                :disabled-date="disabledDate"
              ></InputDate>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              :disabled="!(route.query.type === CUSTOMER)"
              prop="phone_number"
              required
            >
              <InputPhone
                v-model="formData.phone_number"
                :disabled="!(route.query.type === CUSTOMER)"
              >
              </InputPhone>
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
                  :disabled="!(route.query.type === CUSTOMER)"
                  class="mr-10"
                ></InputCode>
                <button-common
                  :icon="Search"
                  background-color="#0071BC"
                  name="search_address"
                  color="white"
                  width="128px"
                  :loading="loadingSearch"
                  :disabled="
                    !formData.postal_code || !(route.query.type === CUSTOMER)
                  "
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
                        :disabled="!(route.query.type === CUSTOMER)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :error="getError('address_detail')">
                      <InputText
                        v-model="formData.address_detail"
                        :placeholder="$t('placeholder.second_address')"
                        :disabled="!(route.query.type === CUSTOMER)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === USER"
              :label="$t('admin.login_type')"
            >
              <component :is="checkIconLogin(formData.login_type)"></component>
              <span
                class="login_type"
                :class="{ 'system-type': formData.login_type === TYPE.SYSTEM }"
              >
                {{
                  $t(
                    findObj(typeLoginOptions, "value", formData.login_type)
                      ?.label
                  )
                }}</span
              >
            </el-form-item>
          </div>
          <div class="form">
            <el-form-item
              v-if="route.query.type === USER"
              :label="$t('status')"
              required
            >
              <client-only>
                <el-select
                  v-model="formData.status"
                  :disabled="!(route.query.type === CUSTOMER)"
                >
                  <el-option
                    v-for="item in statusUserOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === CUSTOMER"
              :label="$t('status')"
            >
              <InputText v-model="isUserImport" :disabled="true"></InputText>
            </el-form-item>
            <el-form-item :label="$t('created_at')">
              <InputDate
                v-model="formData.created_at"
                format="YYYY年MM月DD日 HH:mm:ss"
                value-format="YYYY-MM-DD hh:mm:ss"
                :is-disable="true"
              ></InputDate>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === CUSTOMER"
              prop="total_visited"
              :label="$t('admin.messages.access_log')"
              :error="getError('total_visited')"
            >
              <input-number
                v-model="formData.total_visited"
                :disabled="true"
                placeholder=""
              ></input-number>
            </el-form-item>
            <el-form-item
              v-if="route.query.type === CUSTOMER"
              :error="errorData?.last_visited"
              prop="time_end_visited"
              :label="$t('store.last_visit')"
            >
              <client-only>
                <el-date-picker
                  v-model="formData.last_visited"
                  :disabled="true"
                  placeholder=""
                  format="YYYY年MM月DD日 HH:mm:ss"
                  value-format="YYYY-MM-DD hh:mm:ss"
                  :teleported="false"
                ></el-date-picker>
              </client-only>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            v-if="route.query.type === CUSTOMER"
            :loading="isLoadingSave"
            @click="updateCustomer(formRef)"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import InputDate from "../../../../shared/components/input/Date.vue";
import InputPhone from "../../../../shared/components/input/Phone.vue";
import InputText from "../../../../shared/components/input/InputText.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { statusUserOptions } from "~/../../src/shared/constants/user";
import { useRoute } from "nuxt/app";
import { DetailCustomer } from "~/../../src/store/models/detailCustomer";
import CustomerRequest from "~/../../src/shared/requests/CustomerRequest";
import CustomerEditRequest from "~/../../src/shared/requests/CustomerEditRequest";
import { findObj } from "~/../../src/shared/utils/array";
import { typeLoginOptions, TYPE } from "~/../../src/shared/constants/typeLogin";
import { genderOptions } from "~/../../src/shared/constants/user";
import { ImageUpload } from "~/../../src/admin/models";
import { USER, CUSTOMER } from "~/../../src/shared/constants/user";
import { GENDER } from "~/../../src/shared/constants/user";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate";
import { useRouter } from "#imports";
import { useSearchAddress } from "~/../../src/store/mixins/storeMixin";
import AvatarDefault from "~/../../src/shared/components/AvatarDefault.vue";
import { checkIconLogin } from "~/../../src/shared/composables/loginType";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import customerRules from "~/../../src/store/validates/customer";
import {
  updateSuccess,
  updateError,
} from "~/../../src/shared/utils/notification";
import moment from "moment";
import InputNumber from "~/../../src/shared/components/input/InputNumber.vue";
import {
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_FIRST_NAME,
} from "~/../../src/shared/utils/validate";

const loadingSearch = ref(false);
const router = useRouter();
const loadingDetail = ref(false);
const imagesUpload = ref<ImageUpload[]>([]);
const route = useRoute();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const id = ref(null);
const errorsForm = ref({});
const errorData = ref({});
const isUserImport = ref("");
const isLoadingSave = ref(false);
id.value = Number(route.params.id);

const formData = reactive({
  id: 0,
  first_name: "",
  last_name: "",
  first_name_kana: "",
  last_name_kana: "",
  email: "",
  gender: 0,
  birth_day: "",
  avatar_id: 0,
  phone_number: "",
  status: 0,
  created_at: "",
  login_type: 0,
  address: "",
  address_detail: "",
  postal_code: "",
  total_visited: null,
  last_visited: null,
});

const detailCustomer = (dataObj) => {
  formData.id = dataObj.id;
  formData.first_name = dataObj.first_name;
  formData.last_name = dataObj.last_name;
  formData.first_name_kana = dataObj.first_name_kana;
  formData.last_name_kana = dataObj.last_name_kana;
  formData.gender = dataObj.gender;
  formData.email = dataObj.email;
  formData.created_at = dataObj.created_at;
  formData.birth_day = dataObj.birth_day;
  formData.phone_number = dataObj.phone_number;
  formData.status = dataObj.status;
  formData.postal_code = dataObj.postal_code;
  formData.address = dataObj.address;
  formData.address_detail = dataObj.address_detail;
  formData.login_type = dataObj.login_type;
  formData.total_visited = dataObj.total_visited;
  formData.last_visited = dataObj.last_visited;
  isUserImport.value = dataObj.type_import_name;
  imagesUpload.value = dataObj.avatar?.url;
};

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const disabledDate = (time: Date): boolean => {
  return moment(time) > moment();
};
const handleSearchAddress = () => {
  useSearchAddress(formData, loadingSearch);
};

const setMe = async () => {
  loadingDetail.value = true;
  try {
    if (route.query.type === USER) {
      const { data } = await CustomerRequest.showDetailUser(parseInt(id.value));
      const dataObj = data as DetailCustomer;
      detailCustomer(dataObj);
    } else if (route.query.type === CUSTOMER) {
      const { data } = await CustomerRequest.showDetailCustomer(
        parseInt(id.value)
      );
      const dataObj = data as DetailCustomer;
      detailCustomer(dataObj);
    } else {
      router.push({ name: "customer" });
    }
  } catch (e) {
    router.push({ name: "customer" });
  } finally {
    loadingDetail.value = false;
  }
};

const updateCustomer = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingSave.value = true;
        errorData.value = {};

        const params = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          birth_day: formData.birth_day,
          phone_number: formData.phone_number,
          first_name_kana: formData.first_name_kana,
          last_name_kana: formData.last_name_kana,
          gender: formData.gender,
          postal_code: formData.postal_code,
          status: formData.status,
          address: formData.address,
          address_detail: formData.address_detail,
          last_visited: formData.last_visited,
          total_visited: formData.total_visited,
        };

        await CustomerEditRequest.editCustomer(id.value, params);
        updateSuccess();
      } catch (error) {
        errorData.value = error?.data?.errors;
        updateError();
      } finally {
        isLoadingSave.value = false;
      }
    }
  });
};

onMounted(async () => {
  await setMe();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

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
          color: $blue-light;
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
}

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

:deep(.btn-add) {
  background-color: #00a99d;
  border-color: #00a99d;
}
</style>
