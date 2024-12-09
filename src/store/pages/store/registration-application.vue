<template>
  <div>
    <Head>
      <Title>
        {{ $t("site_name_title")
        }}{{ $t("title_screen.store_registration_application") }}
      </Title>
    </Head>
    <CreateStore :title="$t('title_screen.store_registration_application')">
      <template #store-content>
        <div class="store-registration">
          <div class="description text-center">
            {{ $t("store.please_fill_data") }}
          </div>
          <el-form
            ref="_formRef"
            label-width="200px"
            label-position="left"
            :model="formData"
            class="form-data"
            :inline-message="true"
            :require-asterisk-position="'right'"
            :rules="rules"
          >
            <el-form-item
              :label="$t('store.customer_industry')"
              prop="type_store_id"
              class="store-type"
              required
              :error="getError('type_store_id')"
            >
              <el-radio-group v-model="formData.type_store_id">
                <el-radio
                  v-for="item in filterDataTypeStore"
                  :key="item.id"
                  :label="item.id"
                  size="large"
                  >{{ item.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('corporate_name')"
              class="full-name-form-item w-100"
              required
            >
              <div class="flex-1">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <div-block :label="$t('first_name_kanji')">
                      <template #form-item>
                        <el-form-item
                          class="input"
                          prop="first_company_name"
                          :error="getError('first_company_name')"
                        >
                          <input-text
                            v-model="formData.first_company_name"
                            v-input-trim
                            :placeholder="$t('placeholder.first_name')"
                            width="100%"
                            :maxlength="MAX_LENGTH_FIRST_NAME"
                          />
                        </el-form-item>
                      </template>
                    </div-block>
                  </el-col>
                  <el-col :span="12">
                    <div-block :label="$t('last_name_kanji')">
                      <template #form-item>
                        <el-form-item
                          class="input"
                          prop="last_company_name"
                          :error="getError('last_company_name')"
                        >
                          <input-text
                            v-model="formData.last_company_name"
                            :placeholder="$t('placeholder.last_name')"
                            width="100%"
                            :maxlength="MAX_LENGTH_LAST_NAME"
                          />
                        </el-form-item>
                      </template>
                    </div-block>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <div-block :label="$t('sur_name')" class="last-item">
                      <template #form-item>
                        <el-form-item
                          class="input"
                          prop="first_company_name_kana"
                          :error="getError('first_company_name_kana')"
                        >
                          <input-text
                            v-model="formData.first_company_name_kana"
                            :placeholder="$t('placeholder.first_name_kana')"
                            width="100%"
                            :maxlength="MAX_LENGTH_FIRST_NAME"
                            @input="
                              formatInputKatakana(
                                $event,
                                'first_company_name_kana',
                                _formRef
                              )
                            "
                          />
                        </el-form-item>
                      </template>
                    </div-block>
                  </el-col>
                  <el-col :span="12">
                    <div-block :label="'may_name'" class="last-item">
                      <template #form-item>
                        <el-form-item
                          class="input"
                          prop="last_company_name_kana"
                          :error="getError('last_company_name_kana')"
                        >
                          <input-text
                            v-model="formData.last_company_name_kana"
                            :placeholder="$t('placeholder.last_name_kana')"
                            width="100%"
                            :maxlength="MAX_LENGTH_LAST_NAME"
                            @input="
                              formatInputKatakana(
                                $event,
                                'last_company_name_kana',
                                _formRef
                              )
                            "
                          />
                        </el-form-item>
                      </template>
                    </div-block>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              class="input"
              prop="name"
              :label="$t('store_name')"
              required
              :error="getError('name')"
            >
              <input-text
                v-model="formData.name"
                :placeholder="$t('placeholder.store_name')"
                width="100%"
                :maxlength="MAX_LENGTH_STORE_NAME"
              />
            </el-form-item>
            <el-form-item
              class="input"
              prop="phone_number"
              :label="$t('phone_number')"
              required
              :error="getError('phone_number')"
            >
              <input-phone v-model="formData.phone_number" />
            </el-form-item>
            <el-form-item
              class="input"
              prop="email"
              :label="$t('email_address')"
              required
              :error="getError('email')"
            >
              <input-text
                v-model="formData.email"
                :placeholder="$t('placeholder.email')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                width="100%"
              />
            </el-form-item>
            <el-form-item
              class="input"
              prop="email_confirm"
              :label="$t('email_address_confirm')"
              required
            >
              <input-text
                v-model="formData.email_confirm"
                :placeholder="$t('placeholder.email')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                width="100%"
              />
            </el-form-item>
            <el-form-item
              class="input"
              prop="postal_code"
              :label="$t('postal_code')"
              :error="getError('postal_code')"
            >
              <InputCode
                v-model="formData.postal_code"
                class="postal-code"
              ></InputCode>
              <button-common
                :icon="Search"
                background-color="#0071BC"
                class="btn-search-address"
                name="search_address"
                color="white"
                width="128px"
                :loading="loadingSearch"
                :disabled="!formData.postal_code"
                @click="handleSearchAddress"
              />
            </el-form-item>
            <el-form-item class="address" :label="$t('address')">
              <el-form-item
                :error="getError('address')"
                class="flex-1 mb-0"
                prop="address"
              >
                <input-text
                  v-model="formData.address"
                  :placeholder="$t('placeholder.first_address')"
                  width="100%"
                />
              </el-form-item>
              <el-form-item
                :error="getError('address_detail')"
                class="flex-1 mb-0"
                prop="address_detail"
              >
                <input-text
                  v-model="formData.address_detail"
                  :placeholder="$t('placeholder.second_address')"
                  width="100%"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item
              class="input"
              prop="inquiry"
              :label="$t('store.content_of_request')"
              :error="getError('inquiry')"
            >
              <el-input
                v-model="formData.inquiry"
                v-input-trim
                :rows="3"
                type="textarea"
                :maxlength="MAX_LENGTH_TEXTAREA"
                :placeholder="$t('placeholder.remarks')"
              />
            </el-form-item>
            <div class="terms-of-use">
              <el-checkbox v-model="formData.isAgree" class="agree">
                <div class="d-flex align-items-center">
                  <el-link
                    type="primary"
                    :href="`${config.urlCustomer}privacy`"
                    target="_blank"
                    >{{ $t("store.terms_of_use") }}
                  </el-link>
                </div>
              </el-checkbox>
            </div>
          </el-form>
        </div>
      </template>
      <template #group-button>
        <main-button-store
          :name="$t('button.application')"
          width="96px"
          color="white"
          :loading="isLoadingAction"
          :disabled="!formData.isAgree"
          @click="register(_formRef)"
        />
      </template>
    </CreateStore>
  </div>
</template>

<script lang="ts" setup>
import CreateStore from "~/../../src/store/components/common/CreateStore.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import Search from "~/../../src/store/components/Icon/Search.vue";
import DivBlock from "~/../../src/front/components/common/DivBlock.vue";

import { computed, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { i18n } from "~/../../src/shared/plugins/i18n";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { ruleRegistrationStore } from "~/../../src/store/validates/registrationStore";
import { customTrimValue, searchAddressHelper } from "~/../../src/shared/utils";
import { useRuntimeConfig } from "#app";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_STORE_NAME,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import GuestRequest from "~/../../src/shared/requests/GuestRequest";
import { arrayOpenTime } from "~/../../src/shared/constants";
import { formatInputKatakana } from "~/../../src/shared/utils";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import MainButtonStore from "~/../../src/shared/components/button/MainButtonStore.vue";

definePageMeta({ layout: "guest" });

const config = useRuntimeConfig();
const { t } = i18n.global;

const _formRef = ref();
const loadingSearch = ref(false);
const isLoadingAction = ref(false);
const errorsForm = ref({});

const { formData, rules } = ruleRegistrationStore();

const filterDataTypeStore = computed(() => {
  //TODO: phase 1
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const handleSearchAddress = async () => {
  try {
    loadingSearch.value = true;
    const { address, address_detail } = await searchAddressHelper(
      formData.postal_code
    );
    formData.address = address;
    formData.address_detail = address_detail;
    _formRef.value.clearValidate(["address", "address_detail"]);
  } finally {
    loadingSearch.value = false;
  }
};

const register = async (form: FormInstance | undefined) => {
  errorsForm.value = {};
  if (!form || !formData.isAgree) return;
  await form.validate(async (valid) => {
    if (valid) {
      isLoadingAction.value = true;
      try {
        await GuestRequest.post({
          ...customTrimValue(formData),
          opening_times: arrayOpenTime,
        });
        _formRef.value.resetFields();
        ElMessage({
          message: t("success.register_success"),
          type: "success",
          grouping: true,
        });
      } catch (e) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/variables" as *;

.store-registration {
  width: 90%;
  max-width: 850px;
  margin: 0 auto;
  padding-bottom: 32px;

  :deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
  }

  :deep(.div-block) {
    .label-text {
      padding-bottom: 0;
    }
  }

  .description {
    color: $black-60;
    margin: 0 auto;
    width: 77%;
    line-height: 22px;
    padding-bottom: 22px;
    white-space: pre-line;
  }

  .terms-of-use {
    text-align: center;
  }

  .full-name {
    width: 100%;
    display: flex;
    gap: 12px;

    .left,
    .right {
      width: 50%;
    }

    .last-item {
      margin-top: 12px;
    }
  }

  :deep(.postal-code) {
    width: calc(100% - 128px - 12px);
    margin-right: 12px;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;

    &.full-name-form-item {
      margin-bottom: 0;

      & > .el-form-item__label {
        height: 22px;
        line-height: 22px;
      }
    }
  }

  :deep(.address) {
    .el-form-item__content {
      gap: 12px;
      flex-wrap: nowrap;
      align-items: flex-start;
    }

    & .el-form-item__content:first-child {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
  }

  .store-type {
    :deep(.el-form-item__label) {
      height: 22px;
      line-height: 22px;
    }

    :deep(.el-form-item__content) {
      flex-direction: column;
      align-items: flex-start;

      .el-radio.el-radio--large {
        height: 22px;
        line-height: 22px;

        .el-radio__label {
          height: 22px;
          line-height: 22px;
        }
      }
    }
  }
}

:deep(.create-store-container) {
  .group-button {
    justify-content: center;
  }
}
</style>
