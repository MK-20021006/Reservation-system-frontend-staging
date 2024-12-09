<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.details_revenue") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.details_revenue") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div v-loading="loading" class="revenue-details-container">
        <el-form
          ref="formRef"
          v-loading="loading"
          class="form-body"
          :model="form"
          label-width="160px"
        >
          <div class="form-left">
            <el-form-item :label="$t('reservation_number')">
              <div
                class="text-link text-underline cursor-pointer"
                @click="redirectReservation"
              >
                {{ form.reservation_code }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('full_name_kanji_new')">
              <input-text v-model="form.name" :disabled="true"></input-text>
            </el-form-item>
            <el-form-item :label="$t('full_name_furigana')">
              <input-text
                v-model="form.order_name_kana"
                :disabled="true"
              ></input-text>
            </el-form-item>
            <el-form-item
              class="format-dropdown-input"
              :label="$t('date_of_visit')"
            >
              <input-date
                v-model="form.order_time"
                :is-disable="true"
                format="YYYY年MM月DD日 HH:mm:ss"
                value-format="YYYY年MM月DD日 HH:mm:ss"
                type="datetime"
              ></input-date>
            </el-form-item>
            <el-form-item
              v-if="typeStore !== EVENT"
              :label="
                typeStore !== SALON ? $t('course_name') : $t('course_tab_menu')
              "
            >
              <span v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)">
                {{
                  getCourseMenuBooking(
                    form.booking_detail?.course?.name,
                    form.booking_detail?.menus
                  )
                }}
              </span>
              <input-text
                v-if="typeStore === RESTAURANT"
                v-model="form.course_name"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item v-else :label="$t('event')">
              <input-text v-model="form.event_name" :disabled="true" />
            </el-form-item>
            <div></div>
            <el-form-item
              v-if="!GROUP_TYPE_STORE.SAME.includes(typeStore)"
              :label="$t('coupon_code')"
            >
              <input-text v-model="form.coupon_code" disabled></input-text>
            </el-form-item>
            <div v-if="!GROUP_TYPE_STORE.SAME.includes(typeStore)"></div>
            <div class="settlement-amount">
              <el-form-item
                class="amount_label"
                :label="$t('settlement_amount')"
              >
                <div class="border-icon"></div>
                <div v-if="typeStore === RESTAURANT" class="w-100">
                  <div class="d-flex justify-content-between margin-custom">
                    <div class="text__item">
                      {{ $t("adult") }}{{ form?.number_adult
                      }}{{ $t("last_name_kanji") }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.price_adult * form?.number_adult)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form?.number_children"
                    class="d-flex justify-content-between margin-custom"
                  >
                    <div class="text__item">
                      {{ $t("child") }}{{ form?.number_children || 0
                      }}{{ $t("last_name_kanji") }}
                    </div>
                    <div class="text__price">
                      {{
                        priceDisplay(
                          form.price_children * form?.number_children
                        )
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form?.coupon_name"
                    class="d-flex justify-content-between margin-custom"
                  >
                    <div class="text__item coupon">
                      {{ form.coupon_name }}
                    </div>
                    <div class="text__price coupon">
                      -{{ priceDisplay(form.amount_discount || 0)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form.incurred_amount"
                    class="d-flex justify-content-between"
                  >
                    <div class="text__item">
                      {{ $t("booking.incurred_amount") }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.incurred_amount || 0)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div class="border-icon"></div>
                  <div class="d-flex justify-content-between">
                    <div class="text_price-total">
                      {{ $t("total") }}
                    </div>
                    <div class="price-total">
                      {{ form.amount > 0 ? priceDisplay(form.amount) : 0
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                </div>
                <div v-if="typeStore === EVENT" class="w-100">
                  <div
                    v-if="form.number_adult"
                    class="d-flex justify-content-between margin-custom"
                  >
                    <div
                      v-if="form.fee_type === TYPE_FEE.AGE"
                      class="text__item"
                    >
                      {{ $t("one_adult", { number: form.number_adult }) }}
                    </div>
                    <div
                      v-if="form.fee_type === TYPE_FEE.SEX"
                      class="text__item"
                    >
                      {{ $t("one_male", { number: form.number_adult }) }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.price_adult * form?.number_adult)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form?.number_children"
                    class="d-flex justify-content-between margin-custom"
                  >
                    <div
                      v-if="form.fee_type === TYPE_FEE.AGE"
                      class="text__item"
                    >
                      {{ $t("one_child", { number: form.number_children }) }}
                    </div>
                    <div
                      v-if="form.fee_type === TYPE_FEE.SEX"
                      class="text__item"
                    >
                      {{ $t("one_female", { number: form.number_children }) }}
                    </div>
                    <div class="text__price">
                      {{
                        priceDisplay(
                          form.price_children * form?.number_children
                        )
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form?.coupon_name"
                    class="d-flex justify-content-between margin-custom"
                  >
                    <div class="text__item coupon">
                      {{ form.coupon_name }}
                    </div>
                    <div class="text__price coupon">
                      -{{ priceDisplay(form.amount_discount || 0)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form.incurred_amount"
                    class="d-flex justify-content-between"
                  >
                    <div class="text__item">
                      {{ $t("booking.incurred_amount") }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.incurred_amount || 0)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div class="border-icon"></div>
                  <div class="d-flex justify-content-between">
                    <div class="text_price-total">
                      {{ $t("total") }}
                    </div>
                    <div class="price-total">
                      {{ form.amount > 0 ? priceDisplay(form.amount) : 0
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)"
                  class="w-100"
                >
                  <div
                    v-if="form.booking_detail?.course"
                    class="d-flex justify-content-between"
                  >
                    <div class="text__item">
                      {{ form.booking_detail?.course?.name }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.booking_detail?.course?.price)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-for="menu in form.booking_detail?.menus"
                    :key="menu.name"
                    class="d-flex justify-content-between"
                  >
                    <div class="text__item">{{ menu?.name }}</div>
                    <div class="text__price">
                      {{ priceDisplay(menu?.price) }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div
                    v-if="form.booking_detail?.staff?.request_staff"
                    class="d-flex justify-content-between"
                  >
                    <div class="text__item">
                      {{ form.booking_detail?.staff?.name }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.booking_detail?.staff?.fee)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="text__item">
                      {{ $t("booking.incurred_amount") }}
                    </div>
                    <div class="text__price">
                      {{ priceDisplay(form.incurred_amount || 0)
                      }}{{ $t("yen") }}
                    </div>
                  </div>
                  <div class="border-icon mt-10"></div>
                  <div class="d-flex justify-content-between">
                    <div class="text_price-total">
                      {{ $t("total") }}
                    </div>
                    <div class="price-total">
                      {{ priceDisplay(form.amount) }}{{ $t("yen") }}
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div></div>
            <div class="input__comment">
              <el-form-item :label="$t('memo')">
                <el-input
                  v-model="form.memo"
                  :maxlength="MAX_LENGTH_TEXTAREA"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('transition_number')">
              <input-text v-model="form.id" :disabled="true"></input-text>
            </el-form-item>
            <el-form-item
              class="format-dropdown-input"
              :label="$t('payment_date')"
            >
              <input-date
                v-model="form.paid_at"
                :is-disable="true"
                width="100%"
                type="datetime"
                format="YYYY年MM月DD日 HH:mm:ss"
                value-format="YYYY年MM月DD日 HH:mm:ss"
              ></input-date>
            </el-form-item>
            <el-form-item :label="$t('payment_type')">
              <el-input
                v-model="form.payment_type"
                disabled
                :prefix-icon="IconDropDown"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              class="format-dropdown-input align-items-start"
              :label="$t('sales_date')"
            >
              <ClientOnly>
                <input-date
                  v-model="form.created_at"
                  :is-disable="true"
                  format="YYYY年MM月DD日 HH:mm:ss"
                  value-format="YYYY年MM月DD日 HH:mm:ss"
                ></input-date>
              </ClientOnly>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDefault
            class="btn-delete"
            :name="$t('button.back')"
            @click="back"
          />
          <ButtonCreateOrUpdate :loading="loadingSubmit" @click="savePayment" />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { i18n } from "../../../../shared/plugins/i18n";
import { reactive, ref, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { useRouter, useRoute } from "#imports";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import ButtonDefault from "../../../../shared/components/button/ButtonDefault.vue";
import InputText from "../../../../shared/components/input/InputText.vue";
import InputDate from "../../../../shared/components/input/Date.vue";
import priceDisplay from "../../../../shared/utils/price";
import IconDropDown from "../../../components/Icon/Dropdown";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import {
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import { MAX_LENGTH_TEXTAREA } from "../../../../shared/utils/validate";
import { findObj } from "~/../../src/shared/utils";
import { PaymentMethod } from "~/../../src/shared/constants";
import { useMeStore } from "~/../../src/shared/stores/me";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import {
  RESTAURANT,
  EVENT,
  SALON,
} from "~/../../src/shared/constants/category";
import { TYPE_FEE } from "~/../../src/shared/constants/event";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

const router = useRouter();
const route = useRoute();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const data = ref();
const loading = ref(false);
const loadingSubmit = ref(false);
const typeStore = useMeStore().getTypeStore;

const form = reactive({
  id: null,
  name: "",
  order_name_kana: "",
  reservation_code: "",
  course_name: "",
  amount: "",
  memo: "",
  reservation_id: "",
  number_adult: "",
  number_children: "",
  price_adult: "",
  price_children: "",
  created_at: "",
  paid_at: "",
  order_time: "",
  updated_at: "",
  payment_type: "",
  sales_date: "",
  discount_percent: "",
  discount_money: "",
  coupon_name: "",
  booking_detail: {},
  coupon_code: "",
  incurred_amount: "",
  amount_discount: "",
  event_name: "",
  fee_type: "",
});

const detailInvoice = async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      data.value = (await InvoiceRequest.show(+route.params.id)).data;
      form.id = data.value?.id;
      form.reservation_code = data.value?.reservation?.reservation_code;
      form.name = data.value?.reservation?.name;
      form.order_name_kana = data.value?.reservation?.order_name_kana;
      form.created_at = data.value?.created_at;
      form.order_time = data.value?.reservation?.order_time;
      form.paid_at = data.value?.paid_at;
      form.course_name = data.value?.reservation?.course?.course_name;
      form.event_name = data.value?.reservation?.event?.name;
      form.payment_type = findObj(
        PaymentMethod,
        "value",
        data.value?.payment_type
      )?.label;
      form.booking_detail = data.value?.reservation.booking_detail;
      form.amount = data.value?.amount;
      form.memo = data.value?.reservation?.memo;
      form.reservation_id = data.value?.reservation?.reservation_id;
      form.price_children = data.value?.reservation?.price_children;
      form.price_adult = data.value?.reservation?.price_adult;
      form.number_adult = data.value?.reservation?.number_adult;
      form.number_children = data.value?.reservation?.number_children;
      form.coupon_name = data.value?.reservation?.coupon_name;
      form.discount_percent = data.value?.reservation?.discount_percent;
      form.discount_money = data.value?.reservation?.discount_money;
      form.coupon_code = data.value?.reservation?.coupon_code;
      form.incurred_amount = data.value?.reservation?.incurred_amount;
      form.amount_discount = data.value?.reservation?.amount_discount;
      form.fee_type = data.value?.reservation?.event?.fee_type;
    } catch (_) {
      await router.push({ name: "invoices" });
    } finally {
      loading.value = false;
    }
  }
};

const back = () => {
  router.push({ name: "invoices" });
};

const savePayment = async () => {
  loadingSubmit.value = true;
  try {
    await InvoiceRequest.put(form.id, form);
    updateSuccess();
    back();
  } catch (e) {
    updateError();
  } finally {
    loadingSubmit.value = true;
  }
};

const redirectReservation = () => {
  router.push(`/reservation/detail/${form.reservation_id}`);
};

onMounted(async () => {
  await detailInvoice();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

.revenue-details-container {
  background-color: $white-color;
  width: 100%;
  padding-bottom: 24px;

  .form-body {
    margin: 0 auto;
    display: flex;
    gap: 64px;
    width: 100%;

    .form-left,
    .form-right {
      width: 50%;
    }

    .settlement-amount {
      .text__price,
      .price-total {
        font-weight: 500;
        font-size: 16px;
        line-height: 26px;
      }

      .coupon {
        color: $red-100;
      }

      .text_price-total {
        font-size: 16px;
        line-height: 165%;
      }

      .margin-custom {
        margin-bottom: 20px;
      }
    }

    .input__comment {
      .el-form-item__label {
        font-weight: 500;
      }

      :deep(.el-textarea__inner) {
        height: 80px;
      }
    }
  }
}

:deep(.group-button) {
  .btn-delete {
    background-color: $white-color;

    &:hover {
      border-color: $gray-100 !important;
      background-color: $gray-100;
      color: $black-80;
    }
  }
}

:deep(.input__price) {
  flex-basis: 40%;
  margin-right: 16px;
}

:deep(.amount_label) {
  .el-form-item__label {
    font-weight: 500;
  }
  display: block;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
  align-items: center;
}

:deep(.border-icon) {
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px solid $gray-300;
}

:deep(.el-form-item__label) {
  align-items: center;
  justify-content: flex-start;
  line-height: 160%;
}

:deep(.el-select) {
  width: 100%;
  .el-input {
    height: 40px;
  }
}

:deep(.el-input) {
  height: 40px;
  width: 100% !important;
}

:deep(.el-input__wrapper) {
  flex-direction: row-reverse;
  padding-right: 0;
}

:deep(.align-items-start) {
  align-items: flex-start;
}

:deep(.el-form-item__content) {
  line-height: 40px;
}
</style>
