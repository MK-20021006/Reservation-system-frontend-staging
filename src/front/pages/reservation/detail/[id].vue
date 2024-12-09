<template>
  <div class="booking-detail-container">
    <Head>
      <Title
        >{{ $t("site_name_title")
        }}{{ $t("title_screen.booking_details") }}</Title
      >
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="title">{{ $t("title_screen.booking_details") }}</div>
    <div v-loading="!bookingDetail" class="content-detail">
      <el-form v-if="bookingDetail" ref="formRef" class="data-form">
        <!-- 予約情報 -->
        <div class="content-item">
          <div class="item-title">
            {{ $t("front.booking.reservation_information") }}
          </div>
          <div class="item">
            <!--STATUS-->
            <div-block :label="'status'">
              <template #form-item>
                <ClientOnly>
                  <el-select :model-value="bookingDetail?.status" disabled>
                    <el-option
                      v-for="item in reservationStatusOptions"
                      :key="item.value"
                      :label="`${$t(item.label)}${
                        isCancelBooking
                          ? `（${
                              DATA_CANCEL_FILTER[
                                bookingDetail?.cancel?.type_user_cancel
                              ]
                            }）`
                          : ''
                      }`"
                      :value="item.value"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END STATUS-->
            <!--ORDER TIME DIFFERENT EVENT-->
            <div-block
              v-if="
                !GROUP_TYPE_STORE.EVENT.includes(
                  bookingDetail?.store?.model_has_type?.type_id
                )
              "
              :label="'date_of_visit'"
            >
              <template #form-item>
                <ClientOnly>
                  <el-date-picker
                    ref="_refDatePicker"
                    :model-value="bookingDetail?.order_time"
                    type="date"
                    placeholder=" "
                    :editable="false"
                    class="flex-2 order-time"
                    format="YYYY年MM月DD日 HH:mm:ss"
                    :clearable="false"
                    disabled
                  />
                </ClientOnly>
              </template>
            </div-block>
            <!--END ORDER TIME-->
            <!--ORDER TIME EVENT-->
            <div-block v-else :label="'date_of_visit'">
              <template #form-item>
                <ClientOnly>
                  <el-date-picker
                    ref="_refDatePicker"
                    type="date"
                    :editable="false"
                    class="flex-2 order-time"
                    format="YYYY年MM月DD日 HH:mm:ss"
                    :placeholder="
                      formatDate(bookingDetail?.event_time?.date) +
                      ' ' +
                      getLabelTime(
                        bookingDetail?.event_time?.start,
                        bookingDetail?.event_time?.end
                      )
                    "
                    :clearable="false"
                    disabled
                  />
                </ClientOnly>
              </template>
            </div-block>
            <!--END ORDER TIME-->
            <!--STORE NAME-->
            <div-block :label="'store_name'">
              <template #form-item>
                <NuxtLink
                  :to="{
                    name: 'store-id',
                    params: { id: bookingDetail.store.code },
                  }"
                  target="_blank"
                  >{{ bookingDetail?.store?.name }}
                </NuxtLink>
              </template>
            </div-block>
            <!--END STORE NAME-->
            <!--STORE ADDRESS-->
            <div-block :label="'store_address'" class="store-address">
              <template #form-item>
                <el-form-item prop="store_address">
                  <el-input
                    :model-value="
                      `${bookingDetail?.store?.address || ''} ${
                        bookingDetail?.store?.address_detail || ''
                      }`.trim()
                    "
                    :rows="3"
                    type="textarea"
                    :placeholder="$t('store_address')"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <!--END STORE ADDRESS-->
            <!--NUMBER PEOPLE-->
            <div-block
              v-if="PEOPLE_STORE_BOOKING.includes(typeStore)"
              :label="'number_reservation'"
            >
              <template #form-item>
                <el-row class="member-row">
                  <el-col :span="12" class="member">
                    <div class="member-label">
                      {{ $t("adult") }}
                    </div>
                    <el-form-item prop="adult_number">
                      <InputNumber
                        :model-value="bookingDetail?.detail.number_adult"
                        :max="ADULT_MAX"
                        :placeholder="$t('one_people')"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="bookingDetail?.detail.number_children"
                    :span="12"
                    class="member"
                  >
                    <div class="member-label">
                      {{ $t("child") }}
                    </div>
                    <el-form-item prop="adult_number">
                      <InputNumber
                        :model-value="
                          bookingDetail?.detail.number_children || 0
                        "
                        :max="CHILD_MAX"
                        :placeholder="$t('one_people')"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-block>
            <div-block
              v-if="typeStore === RESTAURANT && bookingDetail?.coupon_code"
              label="coupon_code"
            >
              <template #form-item>
                <el-form-item prop="coupon_code" class="coupon-code">
                  <el-input
                    :model-value="bookingDetail?.coupon_code"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <!--END NUMBER PEOPLE-->
            <!--COURSE NAME-->
            <div-block
              v-if="
                COURSE_STORE_BOOKING.includes(typeStore) &&
                bookingDetail?.detail?.course
              "
              :label="typeStore !== SALON ? 'course' : 'coupon'"
            >
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.detail?.course_id"
                    placeholder=" "
                    disabled
                  >
                    <el-option
                      :key="bookingDetail?.detail?.course_id"
                      :label="bookingDetail?.detail?.course.name"
                      :value="bookingDetail?.detail?.course_id"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END COURSE NAME-->
            <!--EVENT NAME-->
            <div-block
              v-if="
                GROUP_TYPE_STORE.EVENT.includes(typeStore) &&
                bookingDetail?.detail?.event
              "
              :label="'event'"
            >
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.detail?.event?.id"
                    placeholder=" "
                    disabled
                  >
                    <el-option
                      :key="bookingDetail?.detail?.event?.id"
                      :label="bookingDetail?.detail?.event?.name"
                      :value="bookingDetail?.detail?.event?.id"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END EVENT NAME-->
            <!--SEAT: RESTAURANT-->
            <div-block
              v-if="SEAT_STORE_BOOKING.includes(typeStore)"
              :label="'seat_selection'"
            >
              <template #form-item>
                <div class="d-flex">
                  <div class="seat">{{ $t("seat") }}</div>
                  <ClientOnly>
                    <el-select
                      :model-value="bookingDetail?.detail?.seat_type_id"
                      disabled
                    >
                      <el-option
                        :label="bookingDetail?.detail?.category_seat?.name"
                        :value="bookingDetail?.detail?.category_seat?.id"
                      />
                    </el-select>
                  </ClientOnly>
                </div>
              </template>
            </div-block>
            <!--END SEAT-->
            <!--STAFF NAME: SALON-->
            <div-block
              v-if="STAFF_STORE_BOOKING.includes(typeStore)"
              :label="'staff_nomination'"
            >
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.detail?.staff_id"
                    placeholder=" "
                    disabled
                  >
                    <el-option
                      :label="bookingDetail?.detail?.staff?.name"
                      :value="bookingDetail?.detail?.staff_id"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END STAFF NAME-->
            <!--RESERVATION TYPE-->
            <div-block :label="'reservation_type'">
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.type_course"
                    disabled
                    placeholder=" "
                  >
                    <el-option
                      v-for="item in reservationTypeOptions"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END RESERVATION TYPE-->
            <!--RESERVATION TYPE-->
            <div-block :label="'remind'">
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.remind || REMIND_EMAIL"
                    disabled
                    placeholder=" "
                  >
                    <el-option
                      v-for="item in dataRemind"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <!--END RESERVATION TYPE-->
            <!--MENU SELECTION: SALON-->
            <div-block
              v-if="
                MENU_STORE_BOOKING.includes(typeStore) && arrIdMenuActive.length
              "
              :label="'additional_menu_selection'"
            >
              <template #form-item>
                <MenuBooking
                  :category-list="arrCategorySelected"
                  :arr-id-menu-prop="arrIdMenuActive"
                  :disabled="true"
                />
              </template>
            </div-block>
            <!--END MENU SELECTION-->
          </div>
        </div>

        <!-- 決済情報 -->
        <div class="content-item">
          <div class="item-title">
            {{ $t("front.booking.payment_information") }}
          </div>
          <div class="item">
            <settlement-amount
              v-if="SEAT_STORE_BOOKING.includes(typeStore)"
              :child-price="priceChildren"
              :adult-price="priceAdult"
              :total="total"
              :adult="bookingDetail.detail?.number_adult"
              :children="bookingDetail.detail?.number_children"
              :is-show-children="bookingDetail.detail?.number_children"
              :coupon-name="bookingDetail?.coupon_name"
              :coupon-price="couponPrice"
              :incurred-amount="bookingDetail.incurred_amount"
            />
            <settlement-menu
              v-if="MENU_STORE_BOOKING.includes(typeStore)"
              class="settlement-amount-content"
              :menu-list="arrMenuSelected"
              :course="{
                ...bookingDetail.detail.course,
                price: bookingDetail.detail.course_price,
              }"
              :staff="{
                ...bookingDetail.detail.staff,
                fee: bookingDetail.detail.staff_fee,
              }"
              :request-staff="bookingDetail.detail?.request_staff"
              :incurred-amount="bookingDetail.incurred_amount"
            />
            <SettlementEvent
              v-if="GROUP_TYPE_STORE.EVENT.includes(typeStore)"
              class="settlement-amount-content"
              :adult="bookingDetail.detail?.number_adult"
              :children="bookingDetail.detail?.number_children"
              :adult-price="priceAdult"
              :child-price="priceChildren"
              :total="total"
              :event-name="bookingDetail.detail?.event?.name"
              :coupon-name="bookingDetail?.coupon_name"
              :coupon-price="couponPrice"
              :fee-type="bookingDetail.detail?.event?.fee_type"
              :incurred-amount="bookingDetail.incurred_amount"
            />
            <div-block :label="'payment.status'" class="payment-status">
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.status_payment"
                    disabled
                  >
                    <el-option
                      v-for="item in paymentStatusBookingOptions"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <div-block :label="'payment_method'" class="payment-method">
              <template #form-item>
                <ClientOnly>
                  <el-select
                    :model-value="bookingDetail?.payment_type"
                    disabled
                  >
                    <el-option
                      v-for="item in PaymentMethod"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </ClientOnly>
              </template>
            </div-block>
            <div-block :label="'payment_number'">
              <template #form-item>
                <NuxtLink
                  :to="{
                    name: 'invoices-detail-id',
                    params: { id: bookingDetail.invoice?.id },
                  }"
                  >{{ bookingDetail.invoice?.id }}
                </NuxtLink>
              </template>
            </div-block>
          </div>
        </div>

        <!-- その他の情報の入力 -->
        <div class="content-item">
          <div class="item-title">
            {{ $t("other_information") }}
          </div>
          <div class="item">
            <div-block :label="'full_name_kanji_new'">
              <template #form-item>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item prop="name">
                      <el-input
                        :model-value="bookingDetail?.order_first_name"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <InputPhone
                        :model-value="bookingDetail?.order_last_name"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-block>
            <div-block :label="'full_name_furigana'">
              <template #form-item>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item prop="name">
                      <el-input
                        :model-value="bookingDetail?.order_first_name_kana"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-input
                        :model-value="bookingDetail?.order_last_name_kana"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-block>
            <div-block :label="'phone_number'">
              <template #form-item>
                <el-form-item prop="phone_number">
                  <InputPhone
                    :model-value="bookingDetail?.order_phone_number"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <div-block :label="'email_address'">
              <template #form-item>
                <el-form-item prop="email">
                  <el-input
                    :model-value="bookingDetail?.order_email"
                    :placeholder="$t('email_address')"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <div-block v-if="bookingDetail?.order_memo" :label="'memo'">
              <template #form-item>
                <el-form-item prop="memo">
                  <el-input
                    :model-value="bookingDetail?.order_memo"
                    type="textarea"
                    rows="3"
                    :placeholder="$t('placeholder.memo')"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <div-block :label="'created_at'">
              <template #form-item>
                <client-only>
                  <el-form-item prop="created_at">
                    <el-date-picker
                      :model-value="bookingDetail?.created_at"
                      :editable="false"
                      class="input-date"
                      format="YYYY年MM月DD日 HH:mm:ss"
                      disabled
                    />
                  </el-form-item>
                </client-only>
              </template>
            </div-block>
          </div>
        </div>
        <div v-if="isCancelBooking" class="content-item">
          <div class="item-title">
            {{ $t("store.cancel_reservation") }}
          </div>
          <div class="item">
            <div-block :label="'front.cause'">
              <template #form-item>
                <el-form-item>
                  <el-input
                    :model-value="bookingDetail?.cancel?.reason"
                    :placeholder="$t('')"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
            <div-block :label="'memo_cancel'">
              <template #form-item>
                <el-form-item>
                  <el-input
                    :model-value="bookingDetail?.cancel?.memo"
                    type="textarea"
                    rows="3"
                    disabled
                  />
                </el-form-item>
              </template>
            </div-block>
          </div>
        </div>
      </el-form>
      <div class="group-button d-flex justify-content-center flex-wrap">
        <ButtonGray
          :name="$t('button.back')"
          width="108px"
          color="#000000CC"
          font-weight="500"
          @click="$router.push({ name: 'reservation' })"
        />
        <ButtonExport :loading="loadingPDF" @click="downloadPdf" />
        <ButtonGray
          v-if="!isBookingVisited && !isCancelBooking"
          :name="$t('store.cancel_reservation')"
          width="178px"
          background="#C4C4C4"
          color="#000000CC"
          font-weight="500"
          @click="
            $router.push({
              name: 'reservation-cancel-booking-id',
              params: { id: bookingDetail?.id },
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import {
  ADULT_MAX,
  CHILD_MAX,
  RESERVATION_STATUS,
  reservationStatusOptions,
  reservationTypeOptions,
  DATA_CANCEL_FILTER,
} from "~/../../src/shared/constants/reservation";
import {
  PEOPLE_STORE_BOOKING,
  COURSE_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  STAFF_STORE_BOOKING,
  MENU_STORE_BOOKING,
  GROUP_TYPE_STORE,
} from "~/../../src/shared/constants/typeStore";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import {
  paymentStatusBookingOptions,
  PaymentMethod,
} from "~/../../src/shared/constants";
import DivBlock from "~/../../src/front/components/common/DivBlock.vue";
import SettlementAmount from "~/../../src/front/components/common/SettlementAmount.vue";
import InputNumber from "~/../../src/shared/components/input/InputNumber.vue";
import { BookingDetail } from "~/../../src/front/models/reservation";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { useRoute, useRouter } from "#imports";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import scrollToTop from "~/../../src/shared/utils/scroll";
import MenuBooking from "~/../../src/front/components/pages/booking/MenuBooking.vue";
import SettlementMenu from "~/../../src/front/components/pages/booking/SettlementMenu.vue";
import { wrapArrayMenu } from "~/../../src/shared/utils";
import { SALON } from "~/../../src/shared/constants/category";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import { roundPrice } from "~/../../src/shared/utils";
import { dataRemind, REMIND_EMAIL } from "~/../../src/shared/constants/booking";
import SettlementEvent from "~/../../src/front/components/pages/booking/SettlementEvent.vue";
import {
  getLabelTime,
  formatDate,
  createDownloadPDF,
} from "~/../../src/shared/utils";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { messageSuccess } from "~/../../src/shared/utils/notification";

definePageMeta({
  activeSidebar: {
    parentName: "reservation",
  },
  middleware: ["auth"],
});

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const route = useRoute();
const router = useRouter();

const bookingDetail = ref<BookingDetail>(null);
const isLoading = ref(true);
const dataTitle = reactive([{ name: t("reservations"), path: "" }]);
const arrCategorySelected = ref([]);
const arrMenuSelected = ref<any>([]);
const arrIdMenuActive = ref([]);
const loadingPDF = ref(false);

const priceAdult = computed(() => {
  return (
    (bookingDetail.value?.detail?.price_adult || 0) *
    (bookingDetail.value?.detail?.number_adult || 0)
  );
});

const priceChildren = computed(() => {
  return (
    (bookingDetail.value?.detail?.price_children || 0) *
    (bookingDetail.value?.detail?.number_children || 0)
  );
});

const total = computed(() => {
  return priceAdult.value + priceChildren.value;
});

const isCancelBooking = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.CANCEL
);

const isBookingVisited = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.VISITED
);

const typeStore = computed(
  () => bookingDetail.value.store?.model_has_type?.type_id
);

const couponPrice = computed(() => {
  if (bookingDetail.value) {
    return bookingDetail.value.amount_discount;
  }
  return 0;
});

onBeforeMount(async () => {
  try {
    if (route.params?.id) {
      bookingDetail.value = (
        await BookingRequest.show<BookingDetail>(+route.params?.id as number)
      )?.data;

      // SALON
      if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
        arrCategorySelected.value = wrapArrayMenu(
          bookingDetail.value.detail?.menu_details || []
        );

        bookingDetail.value.detail?.menu_details?.forEach((item) => {
          arrIdMenuActive.value.push(item.menu_id);
          arrMenuSelected.value.push({
            ...item.menu,
            price: item.menu_price,
          });
        });
      }

      isLoading.value = false;
    }
  } catch (e) {
    isLoading.value = false;
    await router.push({ name: "reservation" });
  } finally {
    scrollToTop();
  }
});

const redirectInvoice = () => {
  router.push(`/invoices/detail/${bookingDetail.value?.invoice?.id}`);
};

const downloadPdf = async () => {
  try {
    loadingPDF.value = true;
    const res = await BookingRequest.downloadPdf(bookingDetail.value.id);
    if (res) {
      createDownloadPDF("U015_予約詳細", res);
    }
    messageSuccess("success.export");
  } catch (e: any) {
  } finally {
    loadingPDF.value = false;
  }
};
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.booking-detail-container {
  width: 100%;
  padding: 32px;

  .title {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }

  .content-detail {
    padding: 32px 0;
    width: 100%;

    .content-item {
      .item-title {
        background-color: $black-10;
        padding: 8px 24px;
      }

      :deep(.order-time) {
        width: 100%;
        margin-bottom: 24px;
        height: 40px;
      }

      .item {
        width: 90%;
        margin: 32px auto;
        max-width: 562px;

        :deep(.div-block) {
          .el-input__wrapper {
            height: 40px;
          }

          .el-input-number__decrease,
          .el-input-number__increase {
            height: 20px;
          }

          .member-row {
            .member {
              display: flex;
            }
          }

          .member-label,
          .seat {
            min-width: 65px;
            padding-top: 10px;
          }

          .input-date {
            width: 100%;
          }

          &.payment-status,
          &.store-address {
            padding-top: 24px;
          }

          .coupon-code {
            margin-bottom: 10px;
          }
        }

        .el-form-item,
        .el-select {
          margin-bottom: 24px;
          width: 100%;
        }
      }
    }

    .group-button {
      gap: 16px;
      .el-button {
        margin: 0;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .booking-detail-container {
    padding: 24px 0;

    .content-detail {
      padding: 24px 0;

      .content-item {
        .item {
          width: 87%;
          margin: 24px auto;

          :deep(.div-block) {
            .el-input-number {
              width: 95px;
            }

            .member-label,
            .seat {
              min-width: 40px;
            }
          }
        }
      }
    }
  }
}
</style>
