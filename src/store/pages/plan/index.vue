<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
        >{{ $t("site_name_title")
          }}{{ $t("title_screen.plan_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.plan_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div
        v-loading="isLoading || isLoadingPendingInvoice"
        class="container-plan-information"
      >
        <div class="time">
          <div class="time-item">
            <div class="label-input_date">{{ $t("new_contact_date") }}</div>
            <input-date v-model="formData.start_date" :is-disable="true" />
          </div>
          <div class="time-item">
            <div class="label-input_date">
              {{ $t("contract_end_date") }}
            </div>
            <client-only>
              <el-date-picker
                v-model="formData.terminate_date"
                type="date"
                :disabled="true"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
              />
            </client-only>
          </div>
        </div>
        <div v-if="isFreeContract" class="time-plan-free">
          ※{{ formatDate(timeEndFree) }}{{ $t("to")
          }}{{ formData.name ? $t(formData.name) : "-" }}
          {{ $t("use_plan_free") }}
        </div>
        <div class="plans-body">
          <div class="plans-body__item d-flex align-items-center">
            <div class="label-title">
              {{ $t("current_plan") }}
            </div>
            <div class="space-item"></div>
            <div class="name-plans">
              {{ formData.name ? $t(formData.name) : "-" }}
            </div>
            <div class="space-item"></div>
            <div>
              {{ $t("booking.plan_fee") }}
            </div>
            <div class="space-item"></div>
            <div class="price-plans">
              <span>{{
                  formData.price ? priceDisplay(formData.price) + $t("yen") : "-"
                }}</span>
            </div>
            <div class="space-item"></div>
            <div class="option-pick d-flex align-items-center">
              <div>{{ $t("auto_updating") }}</div>
              <div class="space-item"></div>
              <el-radio-group
                v-model="formData.auto_renew"
                :disabled="formData.plan_id === PLAN_NAME.FREE"
              >
                <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                <el-radio :label="AUTO_RENEW.FALSE">{{
                    $t("do_not")
                  }}</el-radio>
              </el-radio-group>

              <el-divider class="space-vertical" direction="vertical" />
              <el-radio-group
                v-model="formData.duration"
                :disabled="formData.plan_id === PLAN_NAME.FREE"
                @change="changePaymentMethodPlan"
              >
                <el-radio :label="NUMBER_MONTH">{{
                    $t("admin.plans.monthly_payment")
                  }}</el-radio>
                <el-radio :label="NUMBER_YEAR">{{
                    $t("admin.plans.year_time_payment")
                  }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div
            v-if="isShowDateChangePlan || (planTimeFree && isShowTextNote)"
            class="plans-body__item date-new-plans"
          >
            <div class="text-date">
              ※{{ $t("new_payment_method") }}
              {{ formData.date_new_start_payment }}
              {{ $t("apply_form") }}
            </div>
          </div>
          <div class="time">
            <div class="time-item">
              <div class="label-input_date">{{ $t("new_contact_date") }}</div>
              <input-date
                v-model="formDataPlanNew.start_date"
                :is-disable="true"
              />
            </div>
            <div class="time-item">
              <div class="label-input_date">
                {{ $t("contract_end_date") }}
              </div>
              <client-only>
                <el-date-picker
                  v-model="formDataPlanNew.terminate_date"
                  type="date"
                  :disabled="true"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                />
              </client-only>
            </div>
          </div>
          <div class="plans-body__item d-flex align-items-center">
            <div class="label-title">
              {{ $t("new_plan") }}
            </div>
            <div class="space-item"></div>
            <div class="name-plans">
              {{ formDataPlanNew.name ? $t(formDataPlanNew.name) : "-" }}
            </div>
            <div class="space-item"></div>
            <div>
              {{ $t("booking.plan_fee") }}
            </div>
            <div class="space-item"></div>
            <div class="price-plans">
              {{
                formDataPlanNew.price
                  ? priceDisplay(formDataPlanNew.price) + $t("yen")
                  : "-"
              }}
            </div>
            <div class="space-item"></div>
            <div class="option-pick d-flex align-items-center">
              <div>{{ $t("auto_updating") }}</div>
              <div class="space-item"></div>
              <el-radio-group
                v-model="formDataPlanNew.auto_renew"
                :disabled="disableCheckboxPlanNew"
              >
                <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                <el-radio :label="AUTO_RENEW.FALSE">{{
                    $t("do_not")
                  }}</el-radio>
              </el-radio-group>

              <el-divider class="space-vertical" direction="vertical" />
              <el-radio-group
                v-model="formDataPlanNew.duration"
                :disabled="disableCheckboxPlanNew"
                @change="changePaymentMethodPlanNew"
              >
                <el-radio :label="NUMBER_MONTH">{{
                    $t("admin.plans.monthly_payment")
                  }}</el-radio>
                <el-radio :label="NUMBER_YEAR">{{
                    $t("admin.plans.year_time_payment")
                  }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div
            v-if="isUpgradePlanError"
            class="plans-body__item date-new-plans upgrade-error"
          >
            <div class="text-date">
              {{ $t("new_payment_method") }}
              {{ formDataPlanNew.end_date }}
              {{ $t("apply_form") }}
            </div>
          </div>
          <div class="plans-body__item list-plans">
            <div class="label-title">{{ $t("new_plan") }}</div>
            <div class="space-item"></div>
            <el-select
              v-model="formDataPlanNew.id"
              class="select-plans m-2"
              clearable
              @change="clickNewPlan"
            >
              <el-option
                v-for="item in listPlan"
                :key="item.id"
                :label="$t('plans_' + item.name)"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="space-height"></div>
          <div class="plans-body__item d-flex align-items-center">
            <div class="label-title">
              {{ $t("admin.plans.additional_options") }}
            </div>
            <div class="space-item"></div>
            <div class="text-description">
              {{ $t("want_remove_option") }}
            </div>
          </div>
          <div class="plans-body__item">
            <div
              v-if="meStore.typeStore === EVENT"
              class="d-flex justify-content-between"
            >
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.zoom.requested"
                  class="checkbox-plans"
                >
                  {{ $t("zoom_monthly") }} {{ priceDisplay(formData.zoom.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="space-item"></div>
                <el-radio-group
                  v-model="formData.zoom.apply_moment"
                  :disabled="checkDisabledApplyMoment('zoom')"
                  @change="applyMomentChangeDate('zoom')"
                >
                  <el-radio :label="APPLY_MOMENT.NOW">{{
                      $t("immediate")
                    }}</el-radio>
                  <el-radio :label="APPLY_MOMENT.NEXT_MONTH">{{
                      $t("next_month")
                    }}</el-radio>
                </el-radio-group>
                <el-divider class="space-vertical" direction="vertical" />
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group v-model="formData.zoom.auto_renew">
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.zoom.requested ||
                  formData.zoom.apply_moment === APPLY_MOMENT.NOW
                    ? formData.zoom.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.zoom.auto_renew === AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.zoom.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div class="plans-body__item">
            <div class="d-flex justify-content-between">
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.line.requested"
                  class="checkbox-plans"
                >{{ $t("line_monthly") }}
                  {{ priceDisplay(formData.line.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="space-item"></div>
                <el-radio-group
                  v-model="formData.line.apply_moment"
                  :disabled="checkDisabledApplyMoment('line')"
                  @change="applyMomentChangeDate('line')"
                >
                  <el-radio :label="APPLY_MOMENT.NOW">{{
                      $t("immediate")
                    }}</el-radio>
                  <el-radio :label="APPLY_MOMENT.NEXT_MONTH">{{
                      $t("next_month")
                    }}</el-radio>
                </el-radio-group>
                <el-divider class="space-vertical" direction="vertical" />
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group v-model="formData.line.auto_renew">
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.line.requested ||
                  formData.line.apply_moment === APPLY_MOMENT.NOW
                    ? formData.line.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.line.auto_renew === AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.line.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div
            v-if="[RESTAURANT, SALON].includes(meStore.typeStore)"
            class="plans-body__item"
          >
            <div class="d-flex justify-content-between">
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.external_site.requested"
                  class="checkbox-plans"
                >{{ $t("external_site_linkage") }}
                  {{ priceDisplay(formData.external_site.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="space-item"></div>
                <el-radio-group
                  v-model="formData.external_site.apply_moment"
                  :disabled="checkDisabledApplyMoment('external_site')"
                  @change="applyMomentChangeDate('external_site')"
                >
                  <el-radio :label="APPLY_MOMENT.NOW">{{
                      $t("immediate")
                    }}</el-radio>
                  <el-radio :label="APPLY_MOMENT.NEXT_MONTH">{{
                      $t("next_month")
                    }}</el-radio>
                </el-radio-group>
                <el-divider class="space-vertical" direction="vertical" />
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group v-model="formData.external_site.auto_renew">
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.external_site.requested ||
                  formData.external_site.apply_moment === APPLY_MOMENT.NOW
                    ? formData.external_site.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.external_site.auto_renew ===
                AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.external_site.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div class="space-height"></div>
          <div class="plans-body__item d-flex align-items-center">
            <div class="label-title">{{ $t("support_options") }}</div>
            <div class="space-item"></div>
            <div class="text-description">{{ $t("text_note_option") }}</div>
          </div>
          <div class="plans-body__item">
            <div class="d-flex justify-content-between">
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.initial_support.requested"
                  class="checkbox-plans option-support"
                >{{ $t("setup_support_month") }}
                  {{ priceDisplay(formData.initial_support.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group v-model="formData.initial_support.auto_renew">
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.initial_support.requested &&
                  formCheckValidateOption.initial_support.auto_renew
                    ? formData.initial_support.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.initial_support.auto_renew ===
                AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.initial_support.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div class="plans-body__item">
            <div class="d-flex justify-content-between">
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.customer_attraction.requested"
                  class="checkbox-plans option-support"
                >{{ $t("collection_package_month") }}
                  {{ priceDisplay(formData.customer_attraction.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group
                    v-model="formData.customer_attraction.auto_renew"
                  >
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.customer_attraction.requested &&
                  formCheckValidateOption.customer_attraction.auto_renew
                    ? formData.customer_attraction.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.customer_attraction.auto_renew ===
                AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.customer_attraction.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div class="plans-body__item">
            <div class="d-flex justify-content-between">
              <div class="option-checkbox">
                <el-checkbox
                  v-model="formData.submission_agency.requested"
                  class="checkbox-plans option-support"
                >{{ $t("agency_month_fee") }}
                  {{ priceDisplay(formData.submission_agency.price)
                  }}{{ $t("yen") }}</el-checkbox
                >
                <div class="auto-renew">
                  <div>{{ $t("auto_updating") }}</div>
                  <div class="space-item"></div>
                  <el-radio-group
                    v-model="formData.submission_agency.auto_renew"
                  >
                    <el-radio :label="AUTO_RENEW.TRUE">{{ $t("do") }}</el-radio>
                    <el-radio :label="AUTO_RENEW.FALSE">{{
                        $t("do_not")
                      }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="date-option">
                {{ $t("start_date_plan") }}:
                {{
                  formCheckValidateOption.submission_agency.requested &&
                  formCheckValidateOption.submission_agency.auto_renew
                    ? formData.submission_agency.start_date
                    : dateNextMonthPlan()
                }}
              </div>
            </div>
            <div
              v-if="
                formCheckValidateOption.submission_agency.auto_renew ===
                AUTO_RENEW.FALSE
              "
            >
              {{
                $t("this_option_is") +
                formData.submission_agency.terminate_date +
                $t("you_can_use_up_to")
              }}
            </div>
          </div>
          <div class="space-height"></div>
          <div class="plans-body__item d-flex align-items-center">
            <div class="label-title">{{ $t("sms_target_transmission") }}</div>
            <div class="space-item"></div>
            <div class="text-description">{{ $t("no_connect") }}</div>
            <div class="space-item"></div>
          </div>
          <div class="plans-body__item d-flex align-items-center">
            {{ $t("the_remaining_amount") }}:
            {{ priceDisplay(remainingSms) }} (SMS) / {{ $t("amount_used") }}:
            {{ priceDisplay(totalSms) }} (SMS)
          </div>
          <button-common
            class="mt-25"
            :name="$t('button.buy_sms')"
            color="white"
            background-color="#0071BC"
            @click="showModalBuySms"
          ></button-common>
        </div>
        <ModalConfirm
          v-if="isNotSettingPayment"
          :dialog-visible="isNotSettingPayment"
          width="35%"
          :is-warning-payment="isNotSettingPayment"
          :title="messagePaymentError"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          @handle-close="handleCloseToPayment"
          @handle-confirm="redirectToPayment"
        />
        <ModalConfirm
          v-if="isPendingStatusUnivapay"
          :dialog-visible="isPendingStatusUnivapay"
          width="35%"
          :is-hidden-button-confirm="true"
          :name-cancel="$t('button.cancel')"
          :title="$t('wait_a_little')"
          @handle-close="handleCloseUnivapay"
        />
        <ModalConfirm
          v-if="dialogVisibleMaintenance"
          :dialog-visible="dialogVisibleMaintenance"
          width="35%"
          :is-time-maintenance="dialogVisibleMaintenance"
          :is-hidden-button-confirm="true"
          :name-cancel="$t('button.cancel')"
          @handle-close="handleCloseMaintenance"
        />
        <ModalBuySms
          v-if="modalBuySms"
          :dialog-visible="modalBuySms"
          :data-sms="dataSms"
          :package-used="packageUsed"
          @handle-close="handleClose"
          @handle-buy-sms="handleBuySms"
        />
        <modal-confirm-buy-sms
          v-if="isShowModalConfirmSms"
          :dialog-visible="isShowModalConfirmSms"
          :title="$t('title_confirm_buy_sms')"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          :loading="isLoadingBuySms"
          @handle-close-confirm-sms="handleCloseConfirmSms"
          @handle-confirm-sms="handleConfirmSms"
        />
        <modal-cancel-plan
          v-if="isShowCancelPlan"
          :is-show-cancel-plan="isShowCancelPlan"
          :loading="isLoadingCancel"
          :title="$t('title_confirm_cancel_plans')"
          @handle-close-cancel-plan="handleCloseCancelPlan"
          @handle-cancel-plan="handleCancelPlan"
        />
        <ModalConfirm
          v-if="dialogVisibleReset"
          :dialog-visible="dialogVisibleReset"
          :title="$t('title_confirm_reset_data')"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          @handle-close="handleCloseResetData"
          @handle-confirm="resetData"
        />
        <ModalConfirm
          v-if="dialogVisibleSave"
          :dialog-visible="dialogVisibleSave"
          :title="$t('title_confirm_save_data')"
          :loading="isLoadingSave"
          :content="
            meStore.info?.store?.widthdraw_at ? $t('renewing_cancel') : ''
          "
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          @handle-close="handleCloseSaveData"
          @handle-confirm="savePlan"
        />
        <ModalConfirm
          v-if="dialogVisibleRestoreCancelPlan"
          :dialog-visible="dialogVisibleRestoreCancelPlan"
          :title="$t('cancel_the_cancellation_request')"
          :loading="isLoadingRestoreCancelPlan"
          :name-cancel="$t('button.cancel')"
          :name-confirm="$t('button.confirm')"
          @handle-close="handleCloseRestoreCancelPlan"
          @handle-confirm="restoreCancelPlan"
        />
      </div>
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <div>
            <button-common
              v-if="meStore.info?.store?.widthdraw_at"
              :name="$t('button.restore_cancel_plan')"
              color="white"
              width="130px"
              background-color="#15AB47"
              :disabled="isLoadingPendingInvoice"
              @click="confirmRestoreCancelPlan"
            ></button-common>
            <button-gray
              :name="$t('button.cancellation_plan')"
              :disabled="isLoadingPendingInvoice"
              @click="confirmCancelPlan"
            ></button-gray>
          </div>
          <div>
            <button-white
              :name="$t('button.clear')"
              :disabled="isLoadingPendingInvoice"
              @click="confirmResetData"
            />
            <button-common
              :name="$t('button.change_plan')"
              color="white"
              background-color="#0071BC"
              :disabled="isUpgradePlanError || isLoadingPendingInvoice"
              @click="confirmSaveData"
            ></button-common>
          </div>
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import InputDate from "../../../shared/components/input/Date.vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonGray from "../../../shared/components/button/ButtonGray.vue";
import priceDisplay from "~/../../src/shared/utils/price";
import {
  AUTO_RENEW,
  APPLY_MOMENT,
  REQUESTED,
  TIME_FREE,
  TIME_FEE,
} from "~/../../src/shared/constants/plan";
import {
  EVENT,
  RESTAURANT,
  SALON,
} from "~/../../src/shared/constants/category";
import {
  NUMBER_MONTH,
  NUMBER_YEAR,
  DATE_END_CONTRACT_PLAN,
  DATE_FIRST_MONTH_NEW,
  CHARGE_TOO_QUICK,
  CHARGE_PENDING,
  STORE_IS_NOT_PUBLIC,
} from "~/../../src/shared/constants/plan";
import PlanRequest from "~/../../src/shared/requests/PlanRequest";
import ContractRequest from "~/../../src/shared/requests/ContractRequest";
import InvoiceRequest from "~/../../src/shared/requests/InvoiceRequest";
import { Plan } from "~/../../src/shared/types/plan";
import {
  messageSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { PlanContract } from "~/../../src/shared/types/plan";
import { formatDate } from "~/../../src/shared/utils/format";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import moment from "moment";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import resetStore from "~/../../src/store/composables/resetStore";
import { PLAN_NAME } from "~/../../src/shared/constants";
import { useRouter, useCookie } from "#imports";
import { useMeStore } from "~~/../../src/shared/stores/me";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { i18n } from "~/../../src/shared/plugins/i18n";

const originDataPlan = ref({});
const meStore = useMeStore();
const formData = reactive({
  date_new_start_payment: moment()
    .add(1, "M")
    .startOf("month")
    .format("YYYY年MM月DD日"),
  plan_id: 0,
  duration: NUMBER_MONTH,
  start_date: "",
  terminate_date: "",
  name: "",
  price: 0,
  auto_renew: AUTO_RENEW.FALSE,
  pay: NUMBER_MONTH,
  zoom: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
  line: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
  external_site: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
  initial_support: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
  customer_attraction: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
  submission_agency: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    start_date: moment().format("YYYY年MM月DD日"),
    terminate_date: moment().format("YYYY年MM月DD日"),
    price: 0,
  },
});

const formDataPlanNew = reactive({
  id: "",
  start_date: moment().format("YYYY年MM月DD日"),
  terminate_date: "",
  name: "",
  price: 0,
  auto_renew: "",
  duration: "",
  end_date: "",
});

const formCheckValidateOption = reactive({
  zoom: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
    start_date: moment().format("YYYY-MM-DD"),
  },
  line: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
    start_date: moment().format("YYYY-MM-DD"),
  },
  external_site: {
    requested: REQUESTED.FALSE,
    apply_moment: APPLY_MOMENT.NOW,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
    start_date: moment().format("YYYY-MM-DD"),
  },
  initial_support: {
    requested: REQUESTED.FALSE,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
  },
  customer_attraction: {
    requested: REQUESTED.FALSE,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
  },
  submission_agency: {
    requested: REQUESTED.FALSE,
    auto_renew: AUTO_RENEW.TRUE,
    end_date: moment().format("YYYY年MM月DD日"),
  },
});
const router = useRouter();
const methodPayment = ref(0);
const isFreeContract = ref(false);
const isShowTextNote = ref(true);
const isNotSettingPayment = ref(false);
const isPendingStatusUnivapay = ref(false);
const dialogVisibleReset = ref(false);
const dialogVisibleSave = ref(false);
const dialogVisibleMaintenance = ref(false);
const dialogVisibleRestoreCancelPlan = ref(false);
const isShowModalConfirmSms = ref(false);
const isLoadingBuySms = ref(false);
const isLoadingSave = ref(false);
const isLoadingRestoreCancelPlan = ref(false);
const isLoading = ref(false);
const isLoadingPendingInvoice = ref(false);
const modalBuySms = ref(false);
const listPlan = ref({});
const listAllPlan = ref({});
const isShowCancelPlan = ref(false);
const isChangePlan = ref(false);
const isShowDateChangePlan = ref(false);
const isUpgradePlanError = ref(false);
const currentPlanData = ref({});
const planDataNew = ref({});
const currentPlanId = ref(0);
const totalSms = ref(0);
const remainingSms = ref(0);
const dataSms = ref({});
const isLoadingCancel = ref(false);
const disableCheckboxPlanNew = ref(true);
const planData = ref<Plan>();
const todayDate = moment().format("YYYY-MM-DD");
const planTimeFree = ref(false);
const timeEndFree = ref();
const packageUsed = ref({});
const messagePaymentError = ref("");
const { t } = i18n.global;
const dataBuySms = reactive({
  pack: 0,
  auto_renew: AUTO_RENEW.FALSE,
});

const handleClose = () => {
  dataBuySms.pack = 0;
  dataBuySms.auto_renew = AUTO_RENEW.FALSE;
  modalBuySms.value = false;
};

const handleCloseCancelPlan = () => {
  isShowCancelPlan.value = false;
};

const confirmCancelPlan = () => {
  isShowCancelPlan.value = true;
};

const confirmResetData = () => {
  dialogVisibleReset.value = true;
};

const handleCloseResetData = () => {
  dialogVisibleReset.value = false;
};

const confirmSaveData = () => {
  dialogVisibleSave.value = true;
};

const handleCloseSaveData = () => {
  dialogVisibleSave.value = false;
};

const checkDisabledApplyMoment = (optionKey: string) => {
  if (formCheckValidateOption[optionKey].requested) {
    if (formCheckValidateOption[optionKey].apply_moment === APPLY_MOMENT.NOW) {
      return true;
    } else if (
      formCheckValidateOption[optionKey].apply_moment ===
      APPLY_MOMENT.NEXT_MONTH &&
      moment(formCheckValidateOption[optionKey].start_date).isSameOrBefore(
        todayDate
      )
    ) {
      return true;
    }
  } else {
    return false;
  }
};

const handleCloseRestoreCancelPlan = () => {
  dialogVisibleRestoreCancelPlan.value = false;
};

const confirmRestoreCancelPlan = () => {
  dialogVisibleRestoreCancelPlan.value = true;
};

const restoreCancelPlan = async () => {
  try {
    isLoadingRestoreCancelPlan.value = true;
    await ContractRequest.restoreCancelContract();
    messageSuccess("success.restore_cancel_plan_success");
    dialogVisibleRestoreCancelPlan.value = false;
    const data = await meStore.fetchUpdate();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.SYSTEM_MAINTENANCE) {
      dialogVisibleRestoreCancelPlan.value = false;
      dialogVisibleMaintenance.value = true;
    }
  } finally {
    isLoadingRestoreCancelPlan.value = false;
  }
};

const dateNextMonthPlan = () => {
  if (moment(todayDate).date() >= DATE_FIRST_MONTH_NEW) {
    return moment(todayDate)
      .add(1, "M")
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  } else {
    return moment(todayDate)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  }
};

const savePlan = async () => {
  try {
    isLoadingSave.value = true;
    const params = {
      plan_id: formDataPlanNew.id ? formDataPlanNew.id : formData.plan_id,
      duration: !!formDataPlanNew.duration
        ? formDataPlanNew.duration
        : formData.duration,
      auto_renew:
        formDataPlanNew.auto_renew !== ""
          ? formDataPlanNew.auto_renew
          : formData.auto_renew,
      line: {
        requested: !!formData.line.requested,
        apply_moment: formData.line.apply_moment,
        auto_renew: formData.line.auto_renew,
      },
      zoom: {
        requested: !!formData.zoom.requested,
        apply_moment: formData.zoom.apply_moment,
        auto_renew: formData.zoom.auto_renew,
      },
      external_site: {
        requested: !!formData.external_site.requested,
        apply_moment: formData.external_site.apply_moment,
        auto_renew: formData.external_site.auto_renew,
      },
      initial_support: {
        requested: !!formData.initial_support.requested,
        apply_moment: APPLY_MOMENT.NEXT_MONTH,
        auto_renew: formData.initial_support.auto_renew,
      },
      customer_attraction: {
        requested: !!formData.customer_attraction.requested,
        apply_moment: APPLY_MOMENT.NEXT_MONTH,
        auto_renew: formData.customer_attraction.auto_renew,
      },
      submission_agency: {
        requested: !!formData.submission_agency.requested,
        apply_moment: APPLY_MOMENT.NEXT_MONTH,
        auto_renew: formData.submission_agency.auto_renew,
      },
    };
    const data = await ContractRequest.postContract(params);
    if (data?.code === CHARGE_PENDING) {
      hasPendingInvoice(true);
    }
    dialogVisibleSave.value = false;
    messageSuccess("success.save_plan_success");
    resetPlanNew();
    isChangePlan.value = false;
    isShowDateChangePlan.value = false;
    getListPlans();
    getContractData();
    await meStore.fetchUpdate();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.SYSTEM_MAINTENANCE) {
      dialogVisibleSave.value = false;
      dialogVisibleMaintenance.value = true;
    } else if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      dialogVisibleSave.value = false;
      if (e.response?._data?.message === STORE_IS_NOT_PUBLIC) {
        messageError(t("store_is_not_public"));
      } else if (e.response?._data?.message === CHARGE_TOO_QUICK) {
        messageError(t("payment_failed"));
        await nextTick(() => {
          location.reload();
        });
      } else {
        isNotSettingPayment.value = true;
      }
    } else {
      dialogVisibleSave.value = false;
      isNotSettingPayment.value = true;
      if (e.response?._data?.message === CHARGE_TOO_QUICK) {
        messagePaymentError.value = t("payment_failed");
        await nextTick(() => {
          location.reload();
        });
      }
    }
  } finally {
    isLoadingSave.value = false;
  }
};

const hasPendingInvoice = async (isSubmitForm = true) => {
  try {
    isLoadingPendingInvoice.value = true;
    while (true) {
      const statusInvoice = await InvoiceRequest.hasPendingInvoice();
      if (!statusInvoice.data?.has_pending_invoice && isSubmitForm) {
        isPendingStatusUnivapay.value = false;
        location.reload();
        break;
      } else if (!statusInvoice.data?.has_pending_invoice && !isSubmitForm) {
        isPendingStatusUnivapay.value = false;
        break;
      } else {
        isPendingStatusUnivapay.value = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  } catch (e) {
    return e;
  } finally {
    isLoadingPendingInvoice.value = false;
  }
};

const logoutPage = async (optionCancel: boolean) => {
  messageSuccess("success.cancel_plan_success");
  if (optionCancel) {
    await logout();
  }
};

const handleCancelPlan = async (optionCancel: boolean) => {
  try {
    isLoadingCancel.value = true;
    const data = await ContractRequest.cancelContract({
      widthdraw_now: optionCancel,
    });

    isShowCancelPlan.value = false;
    if (data?.code === CHARGE_PENDING) {
      await hasPendingInvoice(false);
    } else {
      await logoutPage(optionCancel);
    }

    await meStore.fetchUpdate();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.SYSTEM_MAINTENANCE) {
      isShowCancelPlan.value = false;
      dialogVisibleMaintenance.value = true;
    } else if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
      messageError(e.response?._data?.message);
    } else if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      isShowCancelPlan.value = false;
      if (e.response?._data?.message === STORE_IS_NOT_PUBLIC) {
        messageError(t("store_is_not_public"));
      } else if (e.response?._data?.message === CHARGE_TOO_QUICK) {
        messageError(t("payment_failed"));
      } else {
        isNotSettingPayment.value = true;
      }
    } else {
      isShowCancelPlan.value = false;
      isNotSettingPayment.value = true;
      if (e.response?._data?.message === CHARGE_TOO_QUICK) {
        messagePaymentError.value = t("payment_failed");
      }
    }
  } finally {
    isLoadingCancel.value = false;
  }
};

const logout = async () => {
  try {
    await authRequest.logout();
  } catch (e) {
  } finally {
    const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
    cookieToken.value = null;
    resetStore();
    await router.push({ name: "login" });
  }
};

const handleCloseToPayment = () => {
  isNotSettingPayment.value = false;
};

const handleCloseMaintenance = () => {
  dialogVisibleMaintenance.value = false;
};

const handleCloseUnivapay = () => {
  isPendingStatusUnivapay.value = false;
};

const redirectToPayment = () => {
  isNotSettingPayment.value = false;
  if (messagePaymentError.value) {
    return;
  } else {
    router.push({ name: "payment-setting" });
  }
};

const handleBuySms = (data: any) => {
  modalBuySms.value = false;
  dataBuySms.pack = data.pack;
  dataBuySms.auto_renew = data.auto_renew;
  isShowModalConfirmSms.value = true;
};

const showModalBuySms = () => {
  modalBuySms.value = true;
};

const handleCloseConfirmSms = () => {
  modalBuySms.value = true;
  isShowModalConfirmSms.value = false;
};
const handleConfirmSms = async () => {
  try {
    isLoadingBuySms.value = true;
    const params = {
      pack: dataBuySms.pack,
      auto_renew: dataBuySms.auto_renew,
    };
    const data = await ContractRequest.buySMSContract(params);
    isShowModalConfirmSms.value = false;
    messageSuccess("success.buy_sms_success");
    if (data?.code === CHARGE_PENDING) {
      await hasPendingInvoice(true);
    }
    await getDataSMS();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.SYSTEM_MAINTENANCE) {
      isShowModalConfirmSms.value = false;
      dialogVisibleMaintenance.value = true;
    } else if (
      e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE ||
      e.response.status === STATUS_CODE.BAD_REQUEST
    ) {
      isShowModalConfirmSms.value = false;
      isNotSettingPayment.value = true;
    }
  } finally {
    isLoadingBuySms.value = false;
  }
};

const changePaymentMethodPlan = (value: number) => {
  if (value === NUMBER_YEAR && !planTimeFree.value) {
    if (methodPayment.value === NUMBER_YEAR) {
      isShowDateChangePlan.value = false;
      formData.price =
        planData.value.contract?.terms?.monthly_cost_annual * NUMBER_YEAR;
    } else {
      showDatePaymentMonthToYear();
      isShowDateChangePlan.value = true;
      formData.price = currentPlanData.value.monthly_cost_annual * NUMBER_YEAR;
    }
  } else if (value === NUMBER_MONTH && !planTimeFree.value) {
    if (methodPayment.value === NUMBER_MONTH) {
      isShowDateChangePlan.value = false;
      formData.price = planData.value.contract?.terms?.monthly_cost;
    } else {
      showDatePaymentYearToMonth();
      isShowDateChangePlan.value = true;
      formData.price = currentPlanData.value.monthly_cost;
    }
  } else if (value === NUMBER_YEAR && planTimeFree.value) {
    if (methodPayment.value === NUMBER_YEAR) {
      isShowDateChangePlan.value = false;
      formData.price =
        planData.value.contract?.terms?.monthly_cost_annual * NUMBER_YEAR;
    } else {
      showDatePaymentMonthToYear();
      isShowDateChangePlan.value = true;
      formData.price = currentPlanData.value.monthly_cost_annual * NUMBER_YEAR;
    }
  } else if (value === NUMBER_MONTH && planTimeFree.value) {
    if (methodPayment.value === NUMBER_MONTH) {
      isShowDateChangePlan.value = false;
      formData.price = planData.value.contract?.terms?.monthly_cost;
    } else {
      showDatePaymentYearToMonth();
      isShowDateChangePlan.value = true;
      formData.price = currentPlanData.value.monthly_cost;
    }
  }
};
const changePaymentMethodPlanNew = (value: number) => {
  if (value === NUMBER_YEAR) {
    formDataPlanNew.price = planDataNew.value.monthly_cost_annual * NUMBER_YEAR;
    showDateTerminalPlanNew(true);
  } else {
    showDateTerminalPlanNew(false);
    formDataPlanNew.price = planDataNew.value.monthly_cost;
  }
};

const showDatePaymentMonthToYear = (isChange = true) => {
  if (planTimeFree.value && isChange) {
    return;
  } else if (moment(todayDate).date() >= DATE_FIRST_MONTH_NEW) {
    const dateAddMonth = moment(todayDate).add(1, "M");
    formData.date_new_start_payment = moment(dateAddMonth)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  } else {
    formData.date_new_start_payment = moment(todayDate)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  }
};

const showDatePaymentYearToMonth = (isChange = true) => {
  if (planTimeFree.value && isChange) {
    return;
  } else if (moment(formData.start_date).date() >= DATE_FIRST_MONTH_NEW) {
    const date = moment(formData.start_date).add(1, "Y");
    formData.date_new_start_payment = moment(date)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  } else {
    const date = moment(formData.start_date).add(1, "Y").subtract(1, "months");
    formData.date_new_start_payment = moment(date)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  }
};

const showDatePaymentMonthPlanNew = () => {
  if (moment(todayDate).date() >= DATE_FIRST_MONTH_NEW) {
    const date = moment(formData.start_date).add(1, "Y");
    formDataPlanNew.end_date = moment(date)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  } else {
    const date = moment(formData.start_date).add(1, "Y").subtract(1, "months");
    formDataPlanNew.end_date = moment(date)
      .set({ date: DATE_FIRST_MONTH_NEW })
      .format("YYYY年MM月DD日");
  }
};

const showDateTerminalPlanNew = (optionYear = false) => {
  if (moment(todayDate).date() >= DATE_FIRST_MONTH_NEW) {
    const date = optionYear
      ? moment(todayDate).add(1, "Y")
      : moment(todayDate).add(planDataNew.value.duration, "M");
    formDataPlanNew.terminate_date = moment(date)
      .set({ date: DATE_END_CONTRACT_PLAN })
      .format("YYYY年MM月DD日");
  } else {
    const date = optionYear
      ? moment(todayDate).add(1, "Y").subtract(1, "months")
      : moment(todayDate).add(planDataNew.value.duration - 1, "M");
    formDataPlanNew.terminate_date = moment(date)
      .set({ date: DATE_END_CONTRACT_PLAN })
      .format("YYYY年MM月DD日");
  }
};

const findDataPlanId = (idPlan: number) => {
  return listAllPlan.value.find((item: any) => item.id === idPlan);
};

const clickNewPlan = async (idPlan: number) => {
  if (idPlan) {
    disableCheckboxPlanNew.value = false;
    planDataNew.value = findDataPlanId(idPlan);
    formDataPlanNew.name = "plans_" + planDataNew.value.name;
    formDataPlanNew.price = planDataNew.value?.monthly_cost;
    formDataPlanNew.duration = NUMBER_MONTH;
    formDataPlanNew.auto_renew = AUTO_RENEW.TRUE;
    currentPlanId.value = idPlan;
    isChangePlan.value = true;
    await getListPlans();
  }
};

const setDataPlan = (data: any) => {
  if (data.contract?.type === TIME_FREE) {
    planTimeFree.value = true;
    isFreeContract.value = true;
  } else if (data.contract?.type === TIME_FEE) {
    isFreeContract.value = false;
    if (data.contract?.child) {
      planTimeFree.value = !!data.contract?.child;
      isShowTextNote.value =
        data.contract?.child?.duration !== data.contract?.duration;
    } else {
      planTimeFree.value = false;
    }
  }
  methodPayment.value = data.contract?.duration;
  timeEndFree.value = data.contract?.terminate_date;
  dataSms.value = data.contract?.plan?.sms_packs;
  formData.plan_id = data.contract?.plan?.id;

  // Check start end date width time free + type (current) + type (parent)
  if (data.contract?.type === TIME_FREE) {
    formData.start_date = data.contract?.start_date;
    formData.terminate_date = data.contract?.child?.terminate_date;
  } else if (
    data.contract?.type === TIME_FEE &&
    data.contract?.parent?.type === TIME_FREE
  ) {
    formData.start_date = data.contract?.parent?.start_date;
    formData.terminate_date = data.contract?.terminate_date;
  } else if (
    data.contract?.type === TIME_FEE &&
    data.contract?.parent?.type === TIME_FEE
  ) {
    formData.start_date = data.contract?.start_date;
    formData.terminate_date = data.contract?.terminate_date;
  } else {
    formData.start_date = data.contract?.start_date;
    formData.terminate_date = data.contract?.terminate_date;
  }

  formData.name = "plans_" + data.contract?.plan?.name;

  if (planTimeFree.value) {
    formData.auto_renew = data.contract?.child?.auto_renew;
    formData.duration = data.contract?.child?.duration;
    if (formData.duration === NUMBER_MONTH && !isFreeContract.value) {
      showDatePaymentYearToMonth(false);
    } else if (formData.duration === NUMBER_YEAR && !isFreeContract.value) {
      showDatePaymentMonthToYear(false);
    }
    formData.pay =
      data.contract?.child?.duration === NUMBER_YEAR
        ? NUMBER_YEAR
        : NUMBER_MONTH;
    formData.price =
      data.contract?.child?.duration === NUMBER_YEAR
        ? data.contract?.child?.terms?.monthly_cost_annual * NUMBER_YEAR
        : data.contract?.child?.terms?.monthly_cost;
  } else {
    formData.auto_renew = data.contract?.auto_renew;
    formData.duration = data.contract?.duration;
    formData.pay =
      data.contract?.duration === NUMBER_YEAR ? NUMBER_YEAR : NUMBER_MONTH;
    formData.price =
      data.contract?.duration === NUMBER_YEAR
        ? data.contract?.terms?.monthly_cost_annual * NUMBER_YEAR
        : data.contract?.terms?.monthly_cost;
  }

  if (data.line) {
    formData.line.requested = REQUESTED.TRUE;
    formCheckValidateOption.line.requested = REQUESTED.TRUE;
    formData.line.auto_renew =
      data.line?.auto_renew === 1 ? AUTO_RENEW.TRUE : AUTO_RENEW.FALSE;
    formData.line.apply_moment =
      data.line?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formCheckValidateOption.line.auto_renew = formData.line.auto_renew;
    formCheckValidateOption.line.apply_moment = formData.line.apply_moment;
    formData.line.price = data.contract?.plan?.line_fee;
    formData.line.start_date = formatDate(
      data.line?.start_date,
      "YYYY年MM月DD日"
    );
    formCheckValidateOption.line.start_date = moment(
      data.line?.start_date
    ).format("YYYY-MM-DD");
    formData.line.terminate_date = formatDate(
      data.line?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.line.price = currentPlanData.value.line_fee;
  }

  if (data.zoom) {
    formData.zoom.requested = REQUESTED.TRUE;
    formCheckValidateOption.zoom.requested = REQUESTED.TRUE;
    formData.zoom.auto_renew =
      data.zoom?.auto_renew === 1 ? AUTO_RENEW.TRUE : AUTO_RENEW.FALSE;
    formCheckValidateOption.zoom.auto_renew = formData.zoom.auto_renew;
    formData.zoom.apply_moment =
      data.zoom?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formCheckValidateOption.zoom.apply_moment = formData.zoom.apply_moment;
    formData.zoom.price = data.contract?.plan?.zoom_fee;
    formData.zoom.start_date = formatDate(
      data.zoom?.start_date,
      "YYYY年MM月DD日"
    );
    formCheckValidateOption.zoom.start_date = moment(
      data.zoom?.start_date
    ).format("YYYY-MM-DD");
    formData.zoom.terminate_date = formatDate(
      data.zoom?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.zoom.price = currentPlanData.value.zoom_fee;
  }

  if (data.external_site) {
    formData.external_site.requested = REQUESTED.TRUE;
    formCheckValidateOption.external_site.requested = REQUESTED.TRUE;
    formData.external_site.auto_renew =
      data.external_site?.auto_renew === 1 ? AUTO_RENEW.TRUE : AUTO_RENEW.FALSE;
    formCheckValidateOption.external_site.auto_renew =
      formData.external_site.auto_renew;
    formData.external_site.apply_moment =
      data.external_site?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formCheckValidateOption.external_site.apply_moment =
      formData.external_site.apply_moment;
    formData.external_site.price =
      data.contract?.plan?.external_site_monthly_fee;
    formCheckValidateOption.external_site.start_date = moment(
      data.external_site?.start_date
    ).format("YYYY-MM-DD");
    formData.external_site.start_date = formatDate(
      data.external_site?.start_date,
      "YYYY年MM月DD日"
    );
    formData.external_site.terminate_date = formatDate(
      data.external_site?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.external_site.price =
      currentPlanData.value.external_site_monthly_fee;
  }

  if (data.initial_support) {
    formData.initial_support.requested = REQUESTED.TRUE;
    formCheckValidateOption.initial_support.requested = REQUESTED.TRUE;
    formData.initial_support.auto_renew =
      data.initial_support?.auto_renew === 1
        ? AUTO_RENEW.TRUE
        : AUTO_RENEW.FALSE;
    formCheckValidateOption.initial_support.auto_renew =
      formData.initial_support.auto_renew;
    formData.initial_support.apply_moment =
      data.initial_support?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formData.initial_support.price =
      data.contract?.plan?.initial_support_monthly_fee;
    formData.initial_support.start_date = formatDate(
      data.initial_support?.start_date,
      "YYYY年MM月DD日"
    );
    formData.initial_support.terminate_date = formatDate(
      data.initial_support?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.initial_support.price =
      currentPlanData.value.initial_support_monthly_fee;
  }

  if (data.customer_attraction) {
    formData.customer_attraction.requested = REQUESTED.TRUE;
    formCheckValidateOption.customer_attraction.requested = REQUESTED.TRUE;
    formData.customer_attraction.auto_renew =
      data.customer_attraction?.auto_renew === 1
        ? AUTO_RENEW.TRUE
        : AUTO_RENEW.FALSE;
    formCheckValidateOption.customer_attraction.auto_renew =
      formData.customer_attraction.auto_renew;
    formData.customer_attraction.apply_moment =
      data.customer_attraction?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formData.customer_attraction.price =
      data.contract?.plan?.customer_attraction_fee;
    formData.customer_attraction.start_date = formatDate(
      data.customer_attraction?.start_date,
      "YYYY年MM月DD日"
    );
    formData.customer_attraction.terminate_date = formatDate(
      data.customer_attraction?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.customer_attraction.price =
      currentPlanData.value.customer_attraction_fee;
  }

  if (data.submission_agency) {
    formData.submission_agency.requested = REQUESTED.TRUE;
    formCheckValidateOption.submission_agency.requested = REQUESTED.TRUE;
    formData.submission_agency.auto_renew =
      data.submission_agency?.auto_renew === 1
        ? AUTO_RENEW.TRUE
        : AUTO_RENEW.FALSE;
    formCheckValidateOption.submission_agency.auto_renew =
      formData.submission_agency.auto_renew;
    formData.submission_agency.apply_moment =
      data.submission_agency?.is_applyed === true
        ? APPLY_MOMENT.NOW
        : APPLY_MOMENT.NEXT_MONTH;
    formData.submission_agency.price =
      data.contract?.plan?.submission_agency_monthly_fee;
    formData.submission_agency.start_date = formatDate(
      data.submission_agency?.start_date,
      "YYYY年MM月DD日"
    );
    formData.submission_agency.terminate_date = formatDate(
      data.submission_agency?.terminate_date,
      "YYYY年MM月DD日"
    );
  } else {
    formData.submission_agency.price =
      currentPlanData.value.submission_agency_monthly_fee;
  }

  originDataPlan.value = JSON.parse(JSON.stringify(formData));
};

const getContractData = async () => {
  try {
    isLoading.value = true;
    const contractResponse = (await ContractRequest.getContract())
      .data as PlanContract;
    planData.value = contractResponse;
    currentPlanId.value = contractResponse.contract?.plan?.id;
    await getListPlans();
    setDataPlan(contractResponse);
  } catch (e) {
    return e;
  } finally {
    isLoading.value = false;
  }
};

const resetData = async (resetAll = true) => {
  const copy = JSON.parse(JSON.stringify(originDataPlan.value));
  if (resetAll) {
    Object.assign(formData, copy);
    isShowDateChangePlan.value = false;
  }
  resetPlanNew();
  dialogVisibleReset.value = false;
};

const getListPlans = async () => {
  if (!isChangePlan.value) {
    const planResponse = (await PlanRequest.list<Plan[]>()).data;
    listAllPlan.value = planResponse.data;
    listPlan.value = planResponse.data.filter(
      (item: any) => item.id > currentPlanId.value
    );

    const findCurrentPlan = planResponse.data.find(
      (item: any) => item.id === currentPlanId.value
    );
    if (findCurrentPlan) {
      currentPlanData.value = findCurrentPlan;
    }
  } else {
    const findCurrentPlan = listPlan.value.find(
      (item: any) => item.id === currentPlanId.value
    );
    if (findCurrentPlan) {
      currentPlanData.value = findCurrentPlan;
    }
    formData.line.price = currentPlanData.value.line_fee;
    formData.zoom.price = currentPlanData.value.zoom_fee;
    formData.external_site.price =
      currentPlanData.value.external_site_monthly_fee;
    formData.initial_support.price =
      currentPlanData.value.initial_support_monthly_fee;
    formData.submission_agency.price =
      currentPlanData.value.submission_agency_monthly_fee;
    formData.customer_attraction.price =
      currentPlanData.value.customer_attraction_fee;
  }
};

const applyMomentChangeDate = (optionKey: string) => {
  const date = moment(formData[optionKey].start_date, "YYYY年MM月DD日").format(
    "YYYY-MM-DD"
  );
  if (formData[optionKey].apply_moment === APPLY_MOMENT.NOW) {
    formData[optionKey].start_date = moment().format("YYYY年MM月DD日");
  } else {
    if (moment(todayDate).date() >= DATE_END_CONTRACT_PLAN) {
      const dateAddMonth = moment(date).add(1, "M");
      formData[optionKey].start_date = moment(dateAddMonth)
        .set({ date: DATE_FIRST_MONTH_NEW })
        .format("YYYY年MM月DD日");
    } else {
      formData[optionKey].start_date = moment(date)
        .set({ date: DATE_FIRST_MONTH_NEW })
        .format("YYYY年MM月DD日");
    }
  }
};

const resetPlanNew = () => {
  disableCheckboxPlanNew.value = true;
  formDataPlanNew.name = "";
  formDataPlanNew.price = 0;
  formDataPlanNew.auto_renew = "";
  formDataPlanNew.duration = "";
  formDataPlanNew.id = "";
  formDataPlanNew.end_date = "";
  formDataPlanNew.terminate_date = "";
  formData.line.price = originDataPlan.value.line.price;
  formData.zoom.price = originDataPlan.value.zoom.price;
  formData.external_site.price = originDataPlan.value.external_site.price;
  formData.initial_support.price = originDataPlan.value.initial_support.price;
  formData.submission_agency.price =
    originDataPlan.value.submission_agency.price;
  formData.customer_attraction.price =
    originDataPlan.value.customer_attraction.price;
};

watch(
  () => formDataPlanNew.id,
  (value) => {
    if (!value) {
      resetData(false);
    } else {
      if (formDataPlanNew.duration === NUMBER_YEAR) {
        showDateTerminalPlanNew(true);
      } else if (formDataPlanNew.duration === NUMBER_MONTH) {
        showDateTerminalPlanNew(false);
      }
    }
  }
);

watch(
  () => formDataPlanNew.duration,
  () => {
    if (isFreeContract.value) {
      isUpgradePlanError.value = false;
    } else if (
      formDataPlanNew.duration === NUMBER_MONTH &&
      methodPayment.value === NUMBER_YEAR
    ) {
      showDatePaymentMonthPlanNew();
      isUpgradePlanError.value = true;
    } else {
      isUpgradePlanError.value = false;
    }
  }
);

const getDataSMS = async () => {
  try {
    const smsResponse = await ContractRequest.getSMSContract();
    totalSms.value = parseInt(smsResponse.data.total);
    packageUsed.value = smsResponse.data.sms_pack;
    remainingSms.value =
      parseInt(smsResponse.data.total) - parseInt(smsResponse.data.sent);
  } catch (e) {}
};

onMounted(() => {
  getContractData();
  hasPendingInvoice(false);
  getDataSMS();
});

onMounted(() => {
  const Element = document.querySelector("#main-store-layout .main-container");
  if (Element) {
    Element.classList.add("screen-plans");
  }
});

onBeforeUnmount(() => {
  const Element = document.querySelector("#main-store-layout .main-container");
  if (Element) {
    Element.classList.remove("screen-plans");
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.container-plan-information {
  padding-bottom: 24px;

  :deep(.el-checkbox__input.is-disabled + span.el-checkbox__label),
  :deep(.el-radio__input.is-disabled + span.el-radio__label) {
    color: $black-80;
  }

  .time-plan-free {
    margin-bottom: 15px;
  }

  .space-vertical {
    margin: 0 25px;
  }

  .space-item {
    margin: 0 25px;
  }

  .space-height {
    height: 20px;
  }

  .time {
    width: 725px;
    display: flex;
    gap: 80px;

    .time-item {
      display: flex;
      height: 40px;
      align-items: center;
      margin-bottom: 20px;

      :deep(.el-input) {
        height: 40px;
        width: 253px !important;
      }

      .label-input_date {
        width: 104px;
      }
    }
  }

  .plans-body {
    .list-plans,
    .option-checkbox,
    .auto-renew {
      display: flex;
      align-items: center;
    }

    .select-plans {
      :deep(.el-input) {
        height: 40px;
      }
    }

    &__item {
      margin-bottom: 15px;

      .checkbox-plans {
        width: 250px;
      }

      .option-support {
        width: 300px;
      }
    }

    .date-new-plans {
      margin-top: -10px;
      margin-bottom: 10px;

      .text-date {
        margin-left: 715px;
      }
    }

    .upgrade-error {
      color: red;
    }

    .name-plans,
    .price-plans {
      width: 180px;
      font-weight: bold;
      color: $blue-200;
    }
  }
}
</style>
