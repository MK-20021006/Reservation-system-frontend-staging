<template>
  <div class="user-profile-container">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("title_screen.profile") }}</Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="title">{{ $t("title_screen.profile") }}</div>
    <div v-loading="loading" class="profile-content">
      <div class="change-avatar">
        <div class="full-name-kanji font-weight-500">
          {{ fullName }} {{ fullName ? $t("san") : "" }}
        </div>
        <div class="image-avt">
          <input-file
            v-loading="loadingImage"
            :is-avatar="true"
            :limit="limit"
            :data="image_ids"
            @handle-remove-image="handleRemove"
            @handle-change-image="handleImageChange"
          />
        </div>
      </div>
      <div class="personal-information">
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="profileRules"
          :inline-message="true"
        >
          <div-inline :label="'full_name_kanji'" :is-required="true">
            <template #form-item>
              <div class="w-100">
                <div class="full-name kanji-name">
                  <div-block :label="$t('first_name_kanji')">
                    <template #form-item>
                      <el-form-item prop="first_name">
                        <InputText
                          v-model="formData.first_name"
                          :maxlength="MAX_LENGTH_FIRST_NAME"
                          :width="'100%'"
                          :placeholder="$t('placeholder.first_name')"
                        />
                      </el-form-item>
                    </template>
                  </div-block>
                  <div-block :label="$t('last_name_kanji')">
                    <template #form-item>
                      <el-form-item prop="last_name">
                        <InputText
                          v-model="formData.last_name"
                          :maxlength="MAX_LENGTH_LAST_NAME"
                          :width="'100%'"
                          :placeholder="$t('placeholder.last_name')"
                        />
                      </el-form-item>
                    </template>
                  </div-block>
                </div>
                <div class="text-note__red">
                  {{ $t("please_enter_in_hiragana") }}
                </div>
                <div class="full-name kana-name">
                  <div-block :label="$t('first_name_hiragana')">
                    <template #form-item>
                      <el-form-item prop="first_name_kana">
                        <InputText
                          v-model="formData.first_name_kana"
                          :maxlength="MAX_LENGTH_FIRST_NAME"
                          :width="'100%'"
                          :placeholder="$t('placeholder.first_name_hiragana')"
                        />
                      </el-form-item>
                    </template>
                  </div-block>
                  <div-block :label="$t('last_name_hiragana')">
                    <template #form-item>
                      <el-form-item prop="last_name_kana">
                        <InputText
                          v-model="formData.last_name_kana"
                          :maxlength="MAX_LENGTH_LAST_NAME"
                          :width="'100%'"
                          :placeholder="$t('placeholder.last_name_hiragana')"
                        />
                      </el-form-item>
                    </template>
                  </div-block>
                </div>
              </div>
            </template>
          </div-inline>

          <div-inline :label="'gender'" :is-required="true">
            <template #form-item>
              <ClientOnly>
                <el-form-item prop="gender">
                  <el-select v-model="formData.gender" class="select-gender">
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </ClientOnly>
            </template>
          </div-inline>

          <div-inline :label="'email_address'" :is-required="true">
            <template #form-item>
              <el-form-item prop="email" :error="errorData.email?.[0]">
                <input-text
                  v-model="formData.email"
                  width="100%"
                  :disabled="isExistsEmail"
                />
              </el-form-item>
            </template>
          </div-inline>

          <div-inline :label="'phone_number'" :is-required="true">
            <template #form-item>
              <el-form-item prop="phone_number">
                <InputPhone v-model="formData.phone_number" />
              </el-form-item>
            </template>
          </div-inline>

          <div-inline :label="'postal_code'" class="postal-code">
            <template #form-item>
              <el-form-item
                class="input-postal-code"
                prop="postal_code"
                :error="errorData.postal_code?.[0]"
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
          <div-inline :label="'address1'">
            <template #form-item>
              <el-form-item>
                <InputText
                  v-model="formData.address"
                  :width="'100%'"
                  :placeholder="$t('placeholder.first_address')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'address2'">
            <template #form-item>
              <el-form-item>
                <InputText
                  v-model="formData.address_detail"
                  :width="'100%'"
                  :placeholder="$t('placeholder.second_address')"
                />
              </el-form-item>
            </template>
          </div-inline>
          <div-inline :label="'birthday'" :is-required="true">
            <template #form-item>
              <client-only>
                <el-form-item class="form-item" prop="birth_day">
                  <el-date-picker
                    v-model="formData.birth_day"
                    :disabled-date="disabledDate"
                    type="date"
                    :placeholder="$t('placeholder.birthday')"
                    format="YYYY年MM月DD日"
                    value-format="YYYY-MM-DD"
                    clearable
                  />
                </el-form-item>
              </client-only>
            </template>
          </div-inline>
        </el-form>
      </div>
    </div>
    <div class="group-button">
      <button-blue
        :name="$t('button.save')"
        :loading="loadingSave"
        :disabled="upLoadImage"
        width="109px"
        @click="submitForm(formRef)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from "~/../../src/shared/utils/validate";
import profileRules from "~/../../src/front/validate/profile";
import { genderOptions } from "~/../../src/shared/constants/user";
import { i18n } from "../../shared/plugins/i18n";
import IconSearchButton from "../components/Icon/SearchButton.vue";
import { getMe } from "../../shared/api/all/authApi";
import EditProfile from "../../shared/requests/EditProfile";
import InputText from "../../shared/components/input/InputText.vue";
import InputPhone from "../../shared/components/input/Phone.vue";
import InputCode from "../../shared/components/input/Code.vue";
import InputDate from "../../shared/components/input/Date.vue";
import ButtonBlue from "../../shared/components/button/ButtonBlue.vue";
import fileRequest from "~/../../src/shared/requests/FileRequest";
import InputFile from "~/../../src/shared/components/input/File.vue";
import { Profile } from "~/../../src/shared/types/profile";
import { DataFile } from "~/../../src/shared/models";
import getFullName from "~/../../src/shared/utils/getFullName";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import DivBlock from "~/../../src/shared/components/DivBlock.vue";
import { searchAddressHelper } from "~/../../src/shared/utils";
import { messageSuccess } from "~/../../src/shared/utils/notification";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { formatInputKatakana } from "~/../../src/shared/utils";
import moment from "moment";
import { ROLES } from "~/../../src/shared/constants/roles";

const meStore = useMeStore();

definePageMeta({
  activeSidebar: {
    parentName: "profile",
  },
  middleware: ["auth"],
});

const upLoadImage = ref(false);
const file = ref();
const limit = ref(1);
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const errorData = ref({});
const loading = ref(false);
const loadingSave = ref(false);
const isExistsEmail = ref(false);
const loadingSearch = ref(false);
const fullName = ref("");
const formData = reactive({
  first_name: "",
  last_name: "",
  first_name_kana: "",
  last_name_kana: "",
  gender: "",
  email: "",
  phone_number: "",
  postal_code: "",
  address: "",
  address_detail: "",
  birth_day: "",
  avatar_id: null,
  role_type: ROLES.CUSTOMER,
});

const image_ids = ref([]);
const loadingImage = ref(false);
const dataTitle = reactive([{ name: t("title_screen.profile"), path: "" }]);

const handleRemove = async (file: any, fileList: any) => {
  image_ids.value = fileList;
  formData.avatar_id = null;
};

const disabledDate = (time: Date) => {
  return moment(time) >= moment().subtract(0, "days");
};

const handleImageChange = async (file: any, fileList: any) => {
  image_ids.value = fileList;
  const body = new FormData();
  body.append("file", file.raw);
  try {
    loadingImage.value = true;
    upLoadImage.value = true;
    const data = (await fileRequest.post(body)).data as DataFile;
    formData.avatar_id = data.id;
  } catch (e) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      ElMessage.error(e.data.errors?.file?.[0]);
    }
    image_ids.value = [];
  } finally {
    upLoadImage.value = false;
    loadingImage.value = false;
  }
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

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loadingSave.value = true;
        errorData.value = {};
        await EditProfile.editProfile(formData);
        messageSuccess("success.update_success");
        await setMe(true);
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

const setMe = async (key?: boolean) => {
  try {
    loading.value = true;
    const data = await getMe();
    if (key) {
      await meStore.setData(data.data);
    }
    const profile = data.data as Profile;
    formData.first_name = profile.first_name;
    formData.last_name = profile.last_name;
    formData.first_name_kana = profile.first_name_kana;
    formData.last_name_kana = profile.last_name_kana;
    formData.email = profile.email;
    isExistsEmail.value = !!profile.email;
    formData.phone_number = profile.phone_number;
    formData.postal_code = profile.postal_code;
    formData.address = profile.address;
    formData.address_detail = profile.address_detail;
    formData.birth_day = profile.birth_day;
    formData.gender = profile.gender;
    fullName.value = getFullName(profile.first_name, profile.last_name);
    formData.avatar_id = profile.avatar?.id;
    image_ids.value = profile.avatar ? [profile.avatar] : [];
  } catch (e) {
    return;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  scrollToTop();
  setMe();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.custom-upload) .el-upload {
  width: 160px;
  height: 160px;
}

:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
}

.text-note__red {
  margin-bottom: 10px;
}

.user-profile-container {
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

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
    justify-content: space-between;
    gap: 64px;
    width: 93%;

    :deep(.input-date) {
      width: 100%;
      height: 40px;
    }

    :deep(.el-select) {
      width: 100%;

      .el-input {
        height: 40px;
      }
    }

    :deep(.div-inline) {
      margin-bottom: 0;

      .div-block {
        width: 50%;
      }
    }

    .personal-information {
      width: calc(100% - 160px);

      :deep(.el-date-editor.el-input) {
        height: 40px;
      }

      .el-form-item {
        margin-bottom: 24px;
        width: calc(100% - 160px);
      }

      .full-name {
        display: flex;
        justify-content: space-between;
        gap: 12px;

        .el-form-item {
          margin-bottom: 12px;
          width: 100%;
        }

        &.kana-name {
          .el-form-item {
            margin-bottom: 24px;
          }
        }
      }
    }

    :deep(.el-upload-list__item) {
      width: 160px;
      height: 160px;
    }

    .change-avatar .full-name-kanji {
      font-size: 16px;
      font-weight: 500;
      width: 160px;
      margin-bottom: 10px;
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

    .button-search {
      margin: -12px 0 24px 0;
    }

    .profile-content {
      padding: 24px 0 8px 0;
      flex-direction: column;
      gap: 24px 24px;
      width: 100%;

      .change-avatar {
        width: 220px;
        min-width: 160px;
      }

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

        .full-name {
          gap: 16px;
        }
      }

      .personal-information {
        width: 100%;

        .el-form-item {
          width: 100%;
        }
      }
    }
  }
}
</style>
