<template>
  <el-form ref="formRef" :model="formRegister" class="form-body" :rules="rules">
    <div class="form-item form-name">
      <div>
        <div class="label-item label-required">{{ $t("name") }}</div>
      </div>
      <div>
        <div class="d-flex group-name responsive">
          <div class="item-name name-left item-responsive">
            <div class="label-name">
              {{ $t("first_name_kanji") }}
            </div>
            <el-form-item
              class="input"
              prop="first_name"
              :error="getError('first_name')"
            >
              <input-text
                v-model="formRegister.first_name"
                :placeholder="$t('placeholder.first_name')"
                :maxlength="MAX_LENGTH_FIRST_NAME"
              ></input-text>
            </el-form-item>
          </div>
          <div class="item-name">
            <div class="label-name">
              {{ $t("last_name_kanji") }}
            </div>
            <el-form-item
              class="input"
              prop="last_name"
              :error="getError('last_name')"
            >
              <input-text
                v-model="formRegister.last_name"
                :placeholder="$t('placeholder.last_name')"
                :maxlength="MAX_LENGTH_LAST_NAME"
              ></input-text>
            </el-form-item>
          </div>
        </div>
        <div class="text-note__red">
          {{ $t("please_enter_in_hiragana") }}
        </div>
        <div class="d-flex responsive">
          <div class="item-name name-left">
            <div class="label-name">
              {{ $t("first_name_hiragana") }}
            </div>
            <el-form-item
              class="input"
              prop="first_name_kana"
              :error="getError('first_name_hiragana')"
            >
              <input-text
                v-model="formRegister.first_name_kana"
                :placeholder="$t('placeholder.first_name_hiragana')"
                :maxlength="MAX_LENGTH_FIRST_NAME"
              ></input-text>
            </el-form-item>
          </div>
          <div class="item-name">
            <div class="label-name">
              {{ $t("last_name_hiragana") }}
            </div>
            <el-form-item
              class="input"
              prop="last_name_kana"
              :error="getError('last_name_hiragana')"
            >
              <input-text
                v-model="formRegister.last_name_kana"
                :placeholder="$t('placeholder.last_name_hiragana')"
                :maxlength="MAX_LENGTH_LAST_NAME"
              ></input-text>
            </el-form-item>
          </div>
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("email_address") }}</div>
      <div class="item">
        <el-form-item class="input" prop="email" :error="getError('email')">
          <input-text
            v-model="formRegister.email"
            :placeholder="$t('placeholder.email')"
          ></input-text>
        </el-form-item>
      </div>
    </div>
    <div class="form-item note-password">
      <div class="d-flex justify-content-end">
        {{ $t("validate.format.password") }}
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("password") }}</div>
      <div class="item">
        <el-form-item
          class="input"
          prop="password"
          :error="getError('password')"
        >
          <InputPassword
            v-model="formRegister.password"
            :placeholder="$t('placeholder.password')"
          ></InputPassword>
        </el-form-item>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("re_password") }}</div>
      <div class="item">
        <el-form-item class="input" prop="password_confirmation">
          <InputPassword
            v-model="formRegister.password_confirmation"
            :placeholder="$t('placeholder.password')"
          ></InputPassword>
        </el-form-item>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("phone_number") }}</div>
      <div class="item">
        <el-form-item
          class="input phone-number"
          prop="phone_number"
          :error="getError('phone_number')"
        >
          <InputPhone
            v-model="formRegister.phone_number"
            :placeholder="$t('placeholder.phone')"
          ></InputPhone>
        </el-form-item>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item">{{ $t("zip_code") }}</div>
      <div class="group-search">
        <div class="item-custom item-margin item-postal_code">
          <el-form-item class="input-custom" prop="postal_code">
            <InputCode v-model="formRegister.postal_code"></InputCode>
          </el-form-item>
        </div>
        <div class="item-re_password">
          <el-button
            class="btn_search_custom"
            :icon="IconSearch"
            :loading="loadingSearch"
            :disabled="!formRegister.postal_code"
            @click="searchAddress"
            >{{ $t("search_address") }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item">{{ $t("address") }}</div>
      <div class="group-address">
        <div class="item item-address">
          <el-form-item class="input">
            <input-text
              v-model="formRegister.address"
              :placeholder="$t('placeholder.first_address')"
            ></input-text>
          </el-form-item>
        </div>
        <div class="item item-address item-address-responsive">
          <el-form-item class="input">
            <input-text
              v-model="formRegister.address_detail"
              :placeholder="$t('placeholder.second_address')"
            ></input-text>
          </el-form-item>
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("birthday") }}</div>
      <div class="item">
        <el-form-item
          prop="birth_day"
          class="input"
          :error="getError('birth_day')"
        >
          <client-only>
            <el-date-picker
              v-model="formRegister.birth_day"
              :disabled-date="disabledDate"
              :placeholder="$t('placeholder.birthday')"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              :clearable="false"
            ></el-date-picker>
          </client-only>
        </el-form-item>
      </div>
    </div>
    <div class="form-item">
      <div class="label-item label-required">{{ $t("gender") }}</div>
      <div class="item">
        <el-radio-group v-model="formRegister.gender">
          <el-radio v-for="gender in genderOptions" :label="gender.value">{{
            $t(gender.label)
          }}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </el-form>

  <div class="btn-group__handle text-center">
    <button-gray
      :name="$t('cancel')"
      class="text-style"
      width="160px"
      @click="goToLogin"
    ></button-gray>
    <button-yellow
      :name="$t('register')"
      :loading="loadingSubmit"
      class="text-style"
      width="112px"
      @click="handleClick(formRef)"
    ></button-yellow>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconSearch from "../Icon/IconSearch.vue";
import registerMemberRules from "../../../front/validate/registerMember";
import type { FormInstance } from "element-plus";
import { registerMember } from "../../../shared/api/all/authApi";
import { i18n } from "../../../shared/plugins/i18n";
import { useRoute, useRouter } from "nuxt/app";
import InputText from "../../../shared/components/input/InputText.vue";
import InputPassword from "../../../shared/components/input/InputPassword.vue";
import InputPhone from "../../../shared/components/input/Phone.vue";

import ButtonGray from "../../../shared/components/button/ButtonGray.vue";
import ButtonYellow from "../../../shared/components/button/ButtonYellow.vue";
import InputCode from "../../../shared/components/input/Code.vue";
import { genderOptions } from "~/../../src/shared/constants/user";
import { searchAddressHelper } from "~/../../src/shared/utils";
import {
  messageError,
  addressNotFound,
} from "~/../../src/shared/utils/notification";
import moment from "moment/moment";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from "~/../../src/shared/utils/validate";
import { formatInputKatakana } from "~/../../src/shared/utils";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import { onMounted } from "#imports";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import scrollToTop from "~/../../src/shared/utils/scroll";

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const emits = defineEmits(["handleCurrentStep"]);
const step = ref(1);
const { formRegister, rules } = registerMemberRules();
const loadingSearch = ref(false);
const loadingSubmit = ref(false);
const errorsForm = ref({});
const router = useRouter();
const route = useRoute();

if (route.query.from === persistKeys.SNS_INFO) {
  const value = localStorage.getItem(persistKeys.SNS_INFO);
  if (value) {
    const data = JSON.parse(value);
    formRegister.first_name = data.name;
    formRegister.email = data.email;
    formRegister.sns_type = data.type;
    formRegister.sns_id = data.id;
  }
}

const disabledDate = (time: Date) => {
  return moment(time) > moment().subtract(1, "days");
};

const searchAddress = async () => {
  try {
    loadingSearch.value = true;
    const { address, address_detail } = await searchAddressHelper(
      formRegister.postal_code
    );
    formRegister.address = address;
    formRegister.address_detail = address_detail;
  } finally {
    loadingSearch.value = false;
  }
};

const goToLogin = () => {
  localStorage.removeItem("step");
  router.push({ path: "/login" });
};

onMounted(() => {
  localStorage.removeItem("id");
  localStorage.removeItem("step");
});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const handleClick = async (formRef: FormInstance | undefined) => {
  window.onoffline = () => {
    return;
  };
  errorsForm.value = {};
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      loadingSubmit.value = true;
      try {
        const data: any = await registerMember(formRegister);
        localStorage.setItem("id", data.data.id);
        // clear cache sns info + remove querystring '?from=sns_info'
        if (route.query.from === persistKeys.SNS_INFO) {
          const value = localStorage.getItem(persistKeys.SNS_INFO);
          if (value) {
            localStorage.removeItem(persistKeys.SNS_INFO);
          }
          history.replaceState(null, null, "?");
        }
        emits("handleCurrentStep", step.value);
      } catch (error: any) {
        if (error.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = error.response._data.errors;
          scrollToTop();
        }
      } finally {
        loadingSubmit.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
@use "../../../shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../src/front/assets/scss/variables" as *;

.form-body {
  max-width: 910px;
  width: 100%;
  margin: 0 auto;

  .note-password {
    display: flex;
    justify-content: right;
    color: $red-color-icon;
  }

  .text-note__red {
    padding-bottom: 10px;
  }

  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .no-title {
      width: 102px;
    }

    .name-left {
      margin-right: 12px;
    }

    .item {
      width: calc(100% - 210px);
      height: 100%;
      display: flex;
      align-items: center;
    }

    .item-margin {
      margin-right: 12px;
    }

    .label-item {
      width: 200px;
      height: 22px;
    }

    .label-required::after {
      content: "*";
      color: var(--el-color-danger);
      margin-left: 4px;
    }

    .item-name {
      width: 331px;
      align-items: center;
    }

    .item-responsive {
      margin-bottom: 15px;
    }

    .item-address {
      width: 331px;
      align-items: center;
      margin-right: 12px;
    }
  }

  .form-name {
    align-items: self-start;
  }

  :deep(.input-custom) {
    width: 330px;
  }

  :deep(.input-re_password) {
    margin-left: 12px;
  }

  :deep(.input) {
    width: 100%;
  }

  :deep(.label-name) {
    width: 30px;
  }

  :deep(.label-re_password) {
    width: 116px;
  }

  :deep(.el-date-editor--date) {
    width: 100%;
  }

  :deep(.el-button) > span {
    color: $white-color;
    font-weight: 700;
  }
}

:deep(.btn_search_custom) {
  width: 118px;
  line-height: 24px;
  font-weight: 700;
  background-color: $yellow-color;
  color: $white-color;
  border: 0;
  height: 40px;
  border-radius: 3px;

  &:hover {
    color: white;
    background-color: $yellow-color;
  }
}

.btn-group__handle {
  display: flex;
  justify-content: center;

  .text-style {
    font-size: 14px;
  }
}

:deep(.phone-number) {
  .el-input__wrapper {
    width: 0;
  }
}

:deep(.group-search) {
  display: flex;
}

:deep(.group-address) {
  display: flex;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-button__inner) {
  padding: 0;
}

:deep(.el-radio__inner) {
  padding: 8px;
}

:deep(.el-radio__input) {
  .el-radio__inner::after {
    background-color: #0052d9;
    height: 9px;
    width: 9px;
  }
}

:deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: 12px;
}

:deep(.el-input) {
  height: 40px;
  width: 100%;
}

@include res("md-and-down", $breakpoints-spec) {
  .btn__search {
    margin-top: 12px;
    margin-bottom: 12px;
    width: 120px !important;
    height: 40px;
  }

  :deep(.form-item) {
    display: block !important;
    height: auto !important;
    width: 80vw;
    .item-name {
      margin-bottom: 24px;
    }

    .item-custom {
      width: 170%;
      margin-bottom: 24px;
      margin-right: 11px !important;

      .input-custom {
        width: 100%;
      }
    }

    .item-re_password {
      display: block;
      width: 100%;
      margin-left: 0 !important;
    }

    .input-re_password {
      margin-left: 0;
    }
  }

  .label-item {
    margin-bottom: 8px;
  }

  .form-name {
    margin-bottom: 0 !important;
  }

  .responsive {
    margin-top: 8px;
    flex-basis: 50%;
  }

  :deep(.group-search) {
    display: flex;
  }
  :deep(.btn_search_custom) {
    width: 110px;
  }

  :deep(.item-postal_code) {
    margin-bottom: 12px !important;
  }

  :deep(.item-name) {
    width: 100% !important;
  }

  :deep(.item-address) {
    margin-bottom: 12px !important;
  }

  :deep(.item) {
    width: 100% !important;
  }

  :deep(.item-address-responsive) {
    margin-right: 0 !important;
  }
  :deep(.el-input) {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    height: 40px;
  }
}
</style>
