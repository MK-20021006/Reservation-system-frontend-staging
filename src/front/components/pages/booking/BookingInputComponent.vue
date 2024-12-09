<template>
  <div v-loading="isMounting" class="booking">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("front.reservation_input") }}</Title
      >
    </Head>
    <div class="booking__name">{{ store?.name }}</div>
    <el-form
      v-if="meStore.info"
      ref="_formRef"
      class="booking__form"
      :model="formData"
      :rules="rules"
      :inline-message="true"
      :hide-required-asterisk="true"
    >
      <!--TIME SELECT RESTAURANT-->
      <el-row v-if="GROUP_TYPE_STORE.RESTAURANT.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label required-field">
            {{ $t("reservation_date_Time") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <div id="form-item-time">
            <el-form-item prop="order_time">
              <ClientOnly>
                <div class="d-flex w-100 group-order-time">
                  <el-date-picker
                    ref="_refDatePicker"
                    v-model="formData.dateSelect"
                    type="date"
                    placeholder="YYYY年MM月DD日"
                    :editable="false"
                    class="flex-2"
                    value-format="YYYY-MM-DD"
                    format="YYYY年MM月DD日"
                    :disabled-date="disabledDate"
                    :clearable="false"
                    @change="handleChangeDate"
                  />
                  <el-select
                    v-model="formData.timeSelect"
                    class="flex-1"
                    placeholder="08:00"
                    @change="handleChangeTimeSelect"
                  >
                    <el-option
                      v-for="(time, key) in timeRanger"
                      :key="key"
                      :label="time"
                      :value="time"
                      :disabled="time < minTime"
                    />
                  </el-select>
                </div>
              </ClientOnly>
              <p v-if="isInvalidTime" class="error-validate">
                {{
                  $t("validate.required.field", {
                    field: $t("reservation_date_Time"),
                  })
                }}
              </p>
              <p
                v-if="getErrorValidate('order_time') && isErrorOrderTime"
                class="error-validate"
              >
                {{ getErrorValidate("order_time") }}
              </p>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!--END TIME SELECT RESTAURANT-->
      <!--TIME SELECT EVENT  -->
      <el-row v-if="GROUP_TYPE_STORE.EVENT.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label required-field">
            {{ $t("reservation_date_Time") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <div id="form-item-time">
            <el-form-item prop="order_time">
              <ClientOnly>
                <div
                  class="d-flex w-100 group-order-time group-order-time-event"
                >
                  <el-date-picker
                    ref="_refDatePicker"
                    v-model="formData.dateSelect"
                    type="date"
                    placeholder="YYYY年MM月DD日"
                    :editable="false"
                    class="flex-2"
                    value-format="YYYY-MM-DD"
                    format="YYYY年MM月DD日"
                    :clearable="false"
                    :disabled="true"
                  />
                  <el-select
                    v-model="formData.time_event_id"
                    class="flex-2"
                    :disabled="true"
                    placeholder=" "
                  >
                    <el-option
                      v-for="(item, key) in arrTimeEvent"
                      :key="key"
                      :label="getLabelTime(item.item.start, item.item.end)"
                      :value="item.item.id"
                    />
                  </el-select>
                </div>
              </ClientOnly>
              <p v-if="isInvalidTime" class="error-validate">
                {{
                  $t("validate.required.field", {
                    field: $t("reservation_date_Time"),
                  })
                }}
              </p>
              <p
                v-if="getErrorValidate('order_time') && isErrorOrderTime"
                class="error-validate"
              >
                {{ getErrorValidate("order_time") }}
              </p>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!--END TIME SELECT EVENT-->
      <!--NUMBER RESERVE : restaurant-->
      <el-row v-if="PEOPLE_STORE_BOOKING.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label required-field">{{ $t("number_reservation") }}</div>
        </el-col>
        <el-col :span="16" :xs="24" class="sub-row">
          <el-row :gutter="16" class="group-input-number">
            <el-col :xs="12" :sm="24" :md="12" :lg="12" class="mb-10">
              <el-row class="amount">
                <el-form-item
                  class="number-adult"
                  prop="number_adult"
                  :label="$t('adult')"
                  :error="getErrorValidate('number_adult')"
                >
                  <InputNumber
                    v-model="formData.number_adult"
                    :max="MAX_PEOPLE"
                    :placeholder="$t('one_people')"
                    :readonly="isLoading"
                    @input="handleInputNumberAdult"
                    @focusout="handleFocusOutNumberAdult"
                  />
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              v-if="
                chooseCourse === null ||
                (chooseCourse &&
                  chooseCourse?.accepted_children === ACCEPTED_CHILDREN.HAVE)
              "
              :xs="12"
              :sm="24"
              :md="12"
              :lg="12"
              class="mb-10"
            >
              <el-row class="amount">
                <el-form-item
                  :label="$t('child')"
                  prop="number_children"
                  :error="getErrorValidate('number_children')"
                >
                  <InputNumber
                    v-model="formData.number_children"
                    :max="MAX_PEOPLE"
                    :placeholder="$t('one_people')"
                    :readonly="isLoading"
                  />
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--END NUMBER RESERVE-->
      <!--COURSE: type store = restaurant|salon-->
      <el-row v-if="COURSE_STORE_BOOKING.includes(typeStore)" class="-mt-10">
        <el-col :span="8" :xs="24">
          <div
            class="label"
            :class="{ 'required-field': typeStore === RESTAURANT }"
          >
            {{ typeStore !== SALON ? $t("course") : $t("coupon") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item
              prop="course_id"
              :error="getErrorValidate('course_id')"
            >
              <el-select
                v-model="formData.course_id"
                class="w-100"
                placeholder=""
                :teleported="false"
                :clearable="VALIDATE_COURSE_BOOKING.includes(typeStore)"
                @change="handleChangeCourse"
              >
                <el-option
                  v-for="item in courseFilterDateTimeSelect"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <p
                v-if="
                  errorCourseOrMenu &&
                  !getErrorValidate('course_id') &&
                  VALIDATE_COURSE_BOOKING.includes(typeStore)
                "
                class="error-validate"
              >
                {{ errorCourseOrMenu }}
              </p>
            </el-form-item>
          </ClientOnly>
        </el-col>
      </el-row>
      <el-row v-if="COURSE_STORE_BOOKING.includes(typeStore)" class="-mt-10">
        <el-col :span="8" :xs="24">
          <div class="label"></div>
        </el-col>
        <el-col class="list-courses" :span="16" :xs="24">
          <DetailCourseBooking
            v-model="formData.course_id"
            :type-store="typeStore"
            :data="courseFilterDateTimeSelect"
            @handle-change-course="handleChangeCourse"
          ></DetailCourseBooking>
        </el-col>
      </el-row>

      <!--END COURSE-->
      <!--SELECT EVENT-->
      <el-row v-if="GROUP_TYPE_STORE.EVENT.includes(typeStore)" class="-mt-10">
        <el-col :span="8" :xs="24">
          <div class="label required-field">
            {{ $t("event") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item
              class="mb-15"
              prop="event_id"
              :error="getErrorValidate('event_id')"
            >
              <el-select
                v-model="formData.event_id"
                class="w-100"
                placeholder=""
                :teleported="false"
                :clearable="false"
                @change="handleChangeEvent"
              >
                <el-option
                  v-for="item in arrEvent"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <p
                v-if="
                  errorCourseOrMenu &&
                  !getErrorValidate('course_id') &&
                  VALIDATE_COURSE_BOOKING.includes(typeStore)
                "
                class="error-validate"
              >
                {{ errorCourseOrMenu }}
              </p>
            </el-form-item>
          </ClientOnly>
          <el-col class="list-events">
            <DetailEventBooking
              v-model="formData.event_id"
              :type-store="typeStore"
              :data="arrEvent"
              @handle-change-event="handleChangeEvent"
            />
          </el-col>
          <div v-if="formData.event_id" class="calendar-event">
            <common-booking-date-picker
              v-model="formData.dateSelect"
              class="booking-event-date"
              :date-event="arrayDateEventBooking"
              :loading="loadingDateEvent"
              @handle-change-month="handleChangeMonth"
              @handle-change-date="handleChangeDateEvent"
            />
            <common-booking-modal
              v-if="dialogModal && dateSubmit"
              :data-time="dateSubmit"
              :data="arrTimeEventBooking"
              :dialog-visible="dialogModal"
              :loading="loadingTimeEvent"
              @handle-booking="handleSubmitDateEvent"
              @handle-close="handleClose"
            />
          </div>
        </el-col>
      </el-row>
      <!--END SELECT EVENT-->
      <!--NUMBER RESERVE : EVENT-->
      <el-row
        v-if="
          GROUP_TYPE_STORE.EVENT.includes(typeStore) &&
          formData.event_id &&
          formData.time_event_id &&
          chooseEvent
        "
      >
        <el-col :span="8" :xs="24">
          <div class="label required-field">{{ $t("number_reservation") }}</div>
        </el-col>
        <el-col :span="16" :xs="24" class="sub-row">
          <el-row :gutter="16" class="group-input-number">
            <el-col :xs="12" :sm="24" :md="12" :lg="12" class="mb-10">
              <el-row class="amount">
                <el-form-item
                  class="number-adult-event"
                  prop="number_adult_event"
                  :label="getLabelTypeFee(chooseEvent?.event?.fee_type, true)"
                  :error="getErrorValidate('number_adult_event')"
                >
                  <InputNumber
                    v-model="formData.number_adult"
                    :max="MAX_PEOPLE"
                    :min="0"
                    :placeholder="$t('one_people')"
                    :readonly="isLoading"
                    @input="handleInputNumberAdultEvent"
                  />
                </el-form-item>
              </el-row>
            </el-col>
            <el-col :xs="12" :sm="24" :md="12" :lg="12" class="mb-10">
              <el-row class="amount">
                <el-form-item
                  :label="getLabelTypeFee(chooseEvent?.event?.fee_type)"
                  prop="number_adult_event"
                  :error="getErrorValidate('number_children')"
                >
                  <InputNumber
                    v-model="formData.number_children"
                    :max="MAX_PEOPLE"
                    :placeholder="$t('one_people')"
                    :readonly="isLoading"
                    @input="handleInputNumberChildrentEvent"
                  />
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--END NUMBER RESERVE-->
      <!--COUPON: type store = restaurant|event-->
      <el-row v-if="COUPON_STORE_BOOKING.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label">
            {{ $t("coupon") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item
              prop="coupon_code"
              :error="getErrorValidate('coupon_name')"
            >
              <el-select
                v-model="formData.coupon_code"
                v-loading="isLoadingCheckCoupon && !isLoading"
                class="w-100"
                :placeholder="$t('coupon')"
                :teleported="false"
                :clearable="true"
                :readonly="isLoadingCheckCoupon"
                @change="handleChangeCoupon"
              >
                <el-option
                  v-for="item in couponList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </ClientOnly>
        </el-col>
      </el-row>
      <!--END COUPON-->
      <!--TYPE SEAT: type store=restaurant-->
      <el-row v-if="SEAT_STORE_BOOKING.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label">{{ $t("seat_selection") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item
              class="mb-10"
              prop="seat_type_id"
              :error="getErrorValidate('seat_type_id') || errorSeat"
            >
              <el-select
                v-model="formData.seat_type_id"
                v-loading="isLoading"
                class="w-100"
                :no-data-text="noData"
                :clearable="true"
                :placeholder="$t('placeholder.not_specified')"
                :teleported="false"
              >
                <el-option
                  v-for="item in categoriesSeat"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </ClientOnly>
        </el-col>
      </el-row>
      <!--END TYPE SEAT-->
      <!--MENU: type store=salon-->
      <el-row
        v-if="MENU_STORE_BOOKING.includes(typeStore) && filterCategory.length"
      >
        <el-col :md="8" :sm="24" :xs="24">
          <div class="label menu-label">{{ $t("menu_selection") }}</div>
        </el-col>
        <el-col :md="16" :sm="24" :xs="24">
          <MenuBooking
            v-if="
              !isMounting &&
              (route.query?.menu_type ||
                route.query?.menu_id ||
                isShowMenu ||
                (categoryListProp?.length &&
                  formDataProp?.arrMenuSelected?.length > 0))
            "
            :category-list="categoryList"
            :arr-id-menu-prop="arrIdMenuActive"
            :is-loading="isLoading"
            @change-menu="handleChangeMenu"
          />

          <div v-else>
            <ButtonCommon
              class="button-add-menu"
              :name="$t('button.add_menu')"
              background-color="#FEA497"
              border-radius="3px"
              color="#FFFFFF"
              width="224px"
              @click="handleShowMenu"
            />
          </div>
        </el-col>
      </el-row>
      <!--END MENU-->
      <!--TIME SELECT SALON-->
      <el-row v-if="TIME_STORE_BOOKING.includes(typeStore)">
        <el-col :span="8" :xs="24">
          <div class="label required-field">
            {{ $t("reservation_date_Time") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24">
          <div id="form-item-time">
            <el-form-item prop="order_time">
              <ClientOnly>
                <div class="d-flex w-100 group-order-time">
                  <el-date-picker
                    ref="_refDatePicker"
                    v-model="formData.dateSelect"
                    type="date"
                    placeholder="YYYY年MM月DD日"
                    :editable="false"
                    class="flex-2"
                    value-format="YYYY-MM-DD"
                    format="YYYY年MM月DD日"
                    :disabled-date="disabledDate"
                    disabled
                    :clearable="false"
                    @change="handleChangeDate"
                  />
                  <el-select
                    v-model="formData.timeSelect"
                    disabled
                    class="flex-1"
                    placeholder="08:00"
                    @change="handleChangeTimeSelect"
                  >
                    <el-option
                      v-for="(time, key) in timeRanger"
                      :key="key"
                      :label="time"
                      :value="time"
                      :disabled="time < minTime"
                    />
                  </el-select>
                </div>
              </ClientOnly>
              <p v-if="isInvalidTime" class="error-validate">
                {{
                  $t("validate.required.field", {
                    field: $t("reservation_date_Time"),
                  })
                }}
              </p>
              <p
                v-if="getErrorValidate('order_time') && isErrorOrderTime"
                class="error-validate"
              >
                {{ getErrorValidate("order_time") }}
              </p>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!--END TIME SELECT-->
      <!--LIST STAFF: type store=salon-->
      <el-row v-if="STAFF_STORE_BOOKING.includes(typeStore)">
        <el-col :md="8" :sm="24" :xs="24">
          <div class="label menu-label">{{ $t("staff_nomination") }}</div>
        </el-col>
        <el-col :md="16" :sm="24" :xs="24" class="sub-row">
          <el-row>
            <ClientOnly>
              <el-form-item
                class="w-100"
                prop="seat_type_id"
                :error="getErrorValidate('staff_id') || errorStaff"
              >
                <el-select
                  v-model="formData.staff_id"
                  v-loading="isLoading"
                  class="w-100"
                  :clearable="false"
                  :placeholder="$t('placeholder.staff_nomination')"
                  :teleported="false"
                  :default-first-option="true"
                  @change="handleStaff"
                >
                  <el-option :value="null" :label="$t('all_staff')" />
                  <el-option
                    v-for="item in staffList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </ClientOnly>
          </el-row>
          <el-row>
            <el-col :span="24" :xs="24">
              <CalendarStaff
                v-if="formData.course_id || arrIdMenuActive?.length > 0"
                :store-id="paramStore"
                :course-id="formData.course_id"
                :staff-id="formData.staff_id"
                :menu-id="arrIdMenuActive"
                :data-staff="staffList"
                :date="formData.dateSelect"
                :loading="isLoading"
                :time-selected="formData.timeSelect"
                @handle-click-calendar="handleClickCalendar"
                @handle-change-staff="handleChangeStaff"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--END LIST STAFF-->
      <!--NAME-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label required-field">
            {{ $t("other_information") }}
          </div>
        </el-col>
        <el-col :span="16" :xs="24" class="sub-row">
          <el-row align="middle">
            <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
              <div class="sub-label">
                {{ $t("full_name_kanji_new") }}
              </div>
            </el-col>
            <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
              <el-form-item>
                <div class="d-flex order_name flex-1 align-items-start">
                  <el-form-item
                    class="flex-1"
                    prop="order_first_name"
                    :error="getErrorValidate('order_first_name')"
                  >
                    <el-input
                      v-model="formData.order_first_name"
                      :maxlength="MAX_LENGTH_FIRST_NAME"
                      :clearable="true"
                      :placeholder="$t('placeholder.first_name')"
                    />
                  </el-form-item>
                  <el-form-item
                    class="flex-1"
                    :error="getErrorValidate('order_last_name')"
                    prop="order_last_name"
                  >
                    <el-input
                      v-model="formData.order_last_name"
                      :clearable="true"
                      :maxlength="MAX_LENGTH_LAST_NAME"
                      :placeholder="$t('placeholder.last_name')"
                    />
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row align="middle">
            <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6"> </el-col>
            <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
              <div>
                {{ $t("please_enter_in_hiragana") }}
              </div>
            </el-col>
          </el-row>
          <el-row align="middle">
            <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
              <div class="sub-label">
                {{ $t("full_name_furigana") }}
              </div>
            </el-col>
            <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
              <el-form-item>
                <div class="d-flex order_name flex-1 align-items-start">
                  <el-form-item
                    class="flex-1"
                    prop="order_first_name_kana"
                    :error="getErrorValidate('order_first_name_kana')"
                  >
                    <el-input
                      v-model="formData.order_first_name_kana"
                      :maxlength="MAX_LENGTH_FIRST_NAME"
                      :clearable="true"
                      :placeholder="$t('placeholder.first_name_hiragana')"
                    />
                  </el-form-item>
                  <el-form-item
                    class="flex-1"
                    :error="getErrorValidate('order_last_name_kana')"
                    prop="order_last_name_kana"
                  >
                    <el-input
                      v-model="formData.order_last_name_kana"
                      :clearable="true"
                      :maxlength="MAX_LENGTH_LAST_NAME"
                      :placeholder="$t('placeholder.last_name_hiragana')"
                    />
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-email" align="middle">
            <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
              <div class="sub-label">
                {{ $t("email_address") }}
              </div>
            </el-col>
            <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
              <el-form-item
                :error="getErrorValidate('order_email')"
                prop="order_email"
              >
                <el-input
                  v-model="formData.order_email"
                  :maxlength="MAX_LENGTH_EMAIL"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="note-sms">{{ $t("select_sms_as_a_reminder") }}</div>
          <el-row align="middle">
            <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6">
              <div class="sub-label">
                {{ $t("phone_number") }}
              </div>
            </el-col>
            <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
              <el-form-item
                :error="getErrorValidate('order_phone_number')"
                prop="order_phone_number"
              >
                <InputPhone
                  v-model="formData.order_phone_number"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--END NAME-->
      <!--MEMO-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label">{{ $t("memo") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <el-form-item
            prop="order_memo"
            :error="getErrorValidate('order_memo')"
          >
            <el-input
              v-model="formData.order_memo"
              v-input-trim
              type="textarea"
              :rows="3"
              :maxlength="MAX_LENGTH_TEXTAREA"
              :placeholder="$t('placeholder.memo_input')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--END MEMO-->
      <!--REMIND-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label required-field">{{ $t("remind") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item prop="remind" :error="getErrorValidate('remind')">
              <el-select
                v-model="formData.remind"
                class="w-100"
                placeholder=""
                :teleported="false"
              >
                <el-option
                  v-for="item in dataRemindUser"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </ClientOnly>
        </el-col>
      </el-row>
      <!--END REMIND-->
      <!--PAYMENT TYPE-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label required-field">{{ $t("payment_method") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <ClientOnly>
            <el-form-item
              prop="payment_type"
              :error="getErrorValidate('payment_type')"
            >
              <el-select
                v-model="formData.payment_type"
                class="w-100"
                placeholder=""
                :teleported="false"
              >
                <el-option
                  v-for="item in paymentMethodFilter"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </ClientOnly>
        </el-col>
      </el-row>
      <!--END PAYMENT TYPE-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label">{{ $t("cancel_policy") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <p class="text-pre-wrap">{{ store?.cancellation || "ー" }}</p>
        </el-col>
      </el-row>
      <!--NOTE-->
      <el-row>
        <el-col :span="8" :xs="24">
          <div class="label">{{ $t("notes") }}</div>
        </el-col>
        <el-col :span="16" :xs="24">
          <p class="text-pre-wrap">{{ store?.note || "ー" }}</p>
        </el-col>
      </el-row>
      <!--END NOTE-->
      <!--CONFIRM TEXT-->
      <div>{{ $t("front.confirm_reserve") }}</div>
    </el-form>
    <ButtonBlue
      width="136px"
      :name="$t('reserve')"
      :disabled="isLoadingCheckCoupon"
      @on-click="handleBooking(_formRef)"
    />
  </div>
</template>

<script lang="ts" setup>
import CalendarStaff from "~/../../src/front/components/pages/booking/CalendarStaff.vue";
import InputNumber from "../../../../shared/components/input/InputNumber.vue";
import InputPhone from "../../../../shared/components/input/Phone.vue";
import ButtonBlue from "../../../../shared/components/button/ButtonBlue.vue";
import MenuBooking from "~/../../src/front/components/pages/booking/MenuBooking.vue";
import {
  MAX_LENGTH_COUPON_CODE,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import {
  computed,
  nextTick,
  onBeforeMount,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import {
  MAX_PEOPLE,
  PAYMENT_TYPE,
  PaymentMethod,
} from "~/../../src/shared/constants";
import { validateBooking } from "~/../../src/front/validate/booking";
import { FormInstance } from "element-plus";
import {
  CategorySeat,
  Course,
  DetailStore,
  FormReservation,
  MenuCategory,
  EventInterface,
  EventTimeInterface,
  EventDateInterface,
} from "~/../../src/front/models";
import { useRoute, useRouter } from "#imports";
import { useMeStore } from "~/../../src/shared/stores/me";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import moment from "moment/moment";
import {
  getCurrentTimeBooking,
  getTimeArray,
  getLabelTime,
} from "~/../../src/shared/utils";
import {
  ACCEPTED_CHILDREN,
  BOOKING_SOURCE,
  STATUS_IS_SETTING_CANCEL,
} from "~/../../src/shared/constants/reservation";
import scrollToTop from "~/../../src/shared/utils/scroll";
import {
  customerBookingRestaurant,
  customerBookingSalon,
  getDataBooking,
  setDataWhenBackScreen,
  customerBookingEvent,
} from "~/../../src/front/minxins/bookingMixin";
import {
  COUPON_STORE_BOOKING,
  COURSE_STORE_BOOKING,
  MENU_STORE_BOOKING,
  PEOPLE_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  STAFF_STORE_BOOKING,
  TIME_STORE_BOOKING,
  VALIDATE_COURSE_BOOKING,
  GROUP_TYPE_STORE,
} from "~/../../src/shared/constants/typeStore";
import { CouponInterface, StaffInterface } from "~/../../src/shared/models";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { messageWarning } from "~/../../src/shared/utils/notification";
import {
  dataRemind,
  REMIND_EMAIL,
  REMIND_LINE,
  REMIND_PHONE,
} from "~/../../src/shared/constants/booking";
import { SocialNetworkType } from "~/../../src/shared/constants/auth";
import { TYPE_PARAMS } from "~/../../src/shared/constants/booking";
import bookingGuestRequest from "~/../../src/shared/requests/front/booking";
import { TYPE_FEE, getLabelTypeFee } from "~/../../src/shared/constants/event";
import DetailCourseBooking from "~/../../src/front/components/pages/booking/DetailCourseBooking.vue";
import DetailEventBooking from "~/../../src/front/components/pages/booking/DetailEventBooking.vue";
import CouponRequest from "~/../../src/shared/requests/CouponRequest";

interface Prop {
  formDataProp: FormReservation | null;
  errorsFormProp?: any;
  arrCourses?: Course[];
  arrSeats?: CategorySeat[];
  storeProp?: DetailStore | null;
  course?: Course | null;
  categorySeatProp?: number | null;
  isBackScreen: boolean;
  staffListProp?: StaffInterface[];
  categoryListProp?: MenuCategory[];
  eventListProp?: EventInterface[];
  eventDateProp?: EventDateInterface[];
  eventTimeProp?: EventTimeInterface[];
  eventProp?: EventTimeInterface[];
  couponListProp?: CouponInterface[];
  coupon?: CouponInterface;
}

const route = useRoute();
const router = useRouter();
const meStore = useMeStore();
const errorSeat = ref("");
const errorCoupon = ref("");
const disabledButton = ref(false);

const props = withDefaults(defineProps<Prop>(), {
  staffListProp: () => [],
  categoryListProp: () => [],
  arrSeats: () => [],
  errorsFormProp: null,
  arrCourses: () => [],
  storeProp: null,
  course: null,
  categorySeatProp: null,
  eventListProp: () => [],
  eventTimeProp: () => [],
  eventDateProp: () => [],
  eventProp: () => [],
  couponListProp: () => [],
  coupon: null,
});
const emits = defineEmits(["confirmBooking"]);
const { t } = i18n.global;

const {
  formDataProp,
  storeProp,
  arrCourses,
  arrSeats,
  categorySeatProp,
  errorsFormProp,
  isBackScreen,
  staffListProp,
  categoryListProp,
  eventListProp,
  eventTimeProp,
  eventDateProp,
  eventProp,
  couponListProp,
  coupon,
} = toRefs(props);
const { rules, formData } = validateBooking();
const _refDatePicker = ref();
const timeout = ref();
const courses = ref<Course[]>([]);
const categoriesSeat = ref<CategorySeat[]>([]);
const store = ref<DetailStore>(null);
const categoryList = ref<MenuCategory[]>([]);
const staffList = ref<StaffInterface[]>([]);
const isLoading = ref(false);
const noData = ref(t("no_data"));
const chooseCourse = ref<Course>(null);
const chooseStaff = ref<StaffInterface>(null);
const isInvalidTime = ref(false);
const isMounting = ref(true);
const _formRef = ref<FormInstance>();
const minTime = ref("");
const timeRanger = ref([]);
const courseFilterDateTimeSelect = ref<Course[]>([]);
const isErrorOrderTime = ref(false);
const arrIdMenuActive = ref<number[]>([]);
const isShowMenu = ref(false);
const formCheckCoupon = reactive({
  coupon_code: "",
  course_id: 0,
  dateSelect: "",
  timeSelect: "",
  time_event_id: "",
  event_id: "",
});
const messInvalidCoupon = ref("");
const couponSelected = ref<CouponInterface | null>(null);
const couponList = ref<CouponInterface[]>([]);
const isLoadingCheckCoupon = ref(false);
const errorStaff = ref("");
const errorCourseOrMenu = ref();
const chooseEvent = ref<EventInterface>();
const arrEvent = ref<EventInterface[]>();
const paramEvent = +route.query?.event_id;
const paramTimeId = +route.query?.time_event;
const arrTimeEvent = ref<EventTimeInterface[]>();
const arrayDateEvent = ref<EventDateInterface[]>([]);
const dialogModal = ref(false);
const loadingDateEvent = ref(false);
const loadingTimeEvent = ref(false);
const monthDay = moment().format("YYYY-MM");
const arrTimeEventBooking = ref<EventTimeInterface[]>();
const arrayDateEventBooking = ref<EventDateInterface[]>([]);
const dateSubmit = ref("");

/**
 * store_id: U010
 * course_id: U011 -> U13,
 */
const paramStore = +route.query?.store_id;
const paramCourse = +route.query?.course_id;
const paramTypeStore = +route.query?.type_store;
formData.number_adult = +route.query?.people || null;
formData.timeSelect = (route.query?.time_booking as string) || "";
const bookingSource = useCookie(persistKeys.BOOKING_SOURCE);
if (!bookingSource.value) {
  bookingSource.value =
    (route.query?.source as string) || `${BOOKING_SOURCE.WEB}`;
}

const getData = async () => {
  await getDataBooking(
    formData,
    formDataProp,
    paramStore,
    store,
    storeProp,
    paramCourse,
    arrCourses,
    courses,
    arrSeats,
    chooseCourse,
    courseFilterDateTimeSelect,
    categoriesSeat,
    minTime,
    timeRanger,
    timeout,
    _formRef,
    categoryList,
    staffList,
    isBackScreen,
    arrIdMenuActive,
    staffListProp,
    categoryListProp,
    paramEvent,
    chooseEvent,
    arrEvent,
    eventListProp,
    arrayDateEvent,
    arrTimeEvent,
    eventTimeProp,
    eventDateProp,
    paramTimeId,
    eventProp,
    arrayDateEventBooking,
    couponList,
    couponListProp,
    coupon,
    couponSelected
  );
};

/**
 * @param time
 * check time of course, time of store
 */
const disabledDate = (time: Date) => {
  const weekDayNumber = moment(time).weekday();
  const isValidDate =
    moment(time).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD") ||
    !store.value?.opening_times.some(
      (item) => item.day_of_week === weekDayNumber
    ) ||
    store.value?.closing_times?.some(
      (item) => item.day_off === moment(time).format("YYYY-MM-DD")
    ) ||
    moment(time).isAfter(moment().add(2, "months").endOf("month"));

  if (
    !isValidDate &&
    !formData.dateSelect &&
    !GROUP_TYPE_STORE.SAME.includes(typeStore.value)
  ) {
    formData.dateSelect = moment(time).format("YYYY-MM-DD");
  }
  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value) && !formData.dateSelect) {
    formData.dateSelect = moment().format("YYYY-MM-DD");
  }
  return isValidDate;
};

const getErrorValidate = (field: string) => {
  return errorsFormProp.value && errorsFormProp.value[field]?.[0];
};

// COMPUTED
const dataRemindUser = computed(() => {
  return dataRemind.filter((item) => {
    if (
      item.id === REMIND_EMAIL ||
      item.id === REMIND_PHONE ||
      (meStore?.info?.social_type === SocialNetworkType.LINE &&
        item.id === REMIND_LINE)
    ) {
      return item;
    }
  });
});

const paymentMethodFilter = computed(() => {
  if (!store.value?.is_setting_cancel) {
    return PaymentMethod;
  }
  if (GROUP_TYPE_STORE.RESTAURANT.includes(typeStore.value)) {
    if (
      chooseCourse.value?.is_setting_cancel ===
        STATUS_IS_SETTING_CANCEL.FALSE ||
      !chooseCourse.value
    ) {
      return PaymentMethod.filter((item) =>
        [PAYMENT_TYPE.CARD, PAYMENT_TYPE.CONTACTLESS].includes(item.value)
      );
    }
  } else if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    let checkIsCancel = false;
    if (arrIdMenuActive.value.length > 0) {
      categoryList.value?.filter((category: MenuCategory) => {
        category.menus.forEach((menu: any) => {
          if (
            arrIdMenuActive.value.includes(menu.id as number) &&
            menu.is_setting_cancel === STATUS_IS_SETTING_CANCEL.FALSE
          ) {
            checkIsCancel = true;
          }
        });
      });
    }
    if (
      chooseCourse.value?.is_setting_cancel ===
        STATUS_IS_SETTING_CANCEL.FALSE ||
      checkIsCancel ||
      (!chooseCourse.value && arrIdMenuActive.value.length <= 0)
    ) {
      return PaymentMethod.filter((item) =>
        [PAYMENT_TYPE.CARD, PAYMENT_TYPE.CONTACTLESS].includes(item.value)
      );
    }
  } else if (GROUP_TYPE_STORE.EVENT.includes(typeStore.value)) {
    if (
      (chooseEvent.value?.event &&
        chooseEvent.value?.event?.is_setting_cancel ===
          STATUS_IS_SETTING_CANCEL.FALSE) ||
      !chooseEvent.value
    ) {
      return PaymentMethod.filter((item) =>
        [PAYMENT_TYPE.CARD, PAYMENT_TYPE.CONTACTLESS].includes(item.value)
      );
    }
  }
  return PaymentMethod;
});

const priceAdult = computed(() => {
  if (GROUP_TYPE_STORE.RESTAURANT.includes(typeStore.value)) {
    return (chooseCourse.value?.price || 0) * (formData.number_adult || 0);
  } else {
    return (chooseEvent.value?.price || 0) * (formData.number_adult || 0);
  }
});

const priceChildren = computed(() => {
  if (GROUP_TYPE_STORE.RESTAURANT.includes(typeStore.value)) {
    return (
      (chooseCourse.value?.price_children || 0) *
      (formData.number_children || 0)
    );
  } else {
    return (
      (chooseEvent.value?.price_children || 0) * (formData.number_children || 0)
    );
  }
});

const changePaymentType = () => {
  if (!formData.payment_type) {
    _formRef.value?.clearValidate(["payment_type"]);
  } else {
    formData.payment_type = null;
  }
};

const total = computed(() => {
  return priceAdult.value + priceChildren.value;
});

const typeStore = computed(() => {
  return store.value?.model_has_type?.type_id;
});

const filterCategory = computed(() =>
  categoryList.value.filter((item) => item.menus.length)
);

// WATCH DATA SALON RESTAURANT
watch(
  () => [formData.dateSelect, formData.timeSelect],
  ([dateSelect, timeSelect]) => {
    //Clear validate after reset data order_time
    timeout.value = setTimeout(() => {
      _formRef.value?.clearValidate(["course_id"]);
      _formRef.value?.clearValidate(["order_time"]);
      if (!GROUP_TYPE_STORE.EVENT.includes(typeStore.value)) {
        isInvalidTime.value = false;
      }
    }, 50);
    courseFilterDateTimeSelect.value = filterCourse(dateSelect, timeSelect);
  }
);

// GET SEAT
watch(
  () => [
    formData.course_id,
    formData.number_adult,
    formData.dateSelect,
    formData.timeSelect,
  ],
  async ([value1, value2, value3, value4]) => {
    if (isMounting.value) return;
    //Clear validate
    if (value3 && value4) {
      timeout.value = setTimeout(() => {
        _formRef.value?.clearValidate(["order_time"]);
      }, 50);
    }
    if (
      SEAT_STORE_BOOKING.includes(typeStore.value) &&
      value1 &&
      value2 &&
      value3 &&
      value4
    ) {
      formData.order_time = `${value3} ${value4}`;
      isLoading.value = true;
      try {
        formData.seat_type_id = null;
        categoriesSeat.value = [];
        categoriesSeat.value =
          (
            await BookingRequest.getCategoryBooking<CategorySeat[]>({
              store_id: store.value.id,
              course_id: value1,
              number_adult: value2,
              order_time: formData.order_time,
              type: TYPE_PARAMS.BOOKING,
            })
          )?.data || [];
        disabledButton.value = false;
        errorSeat.value = "";
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.BAD_REQUEST) {
          errorSeat.value = e.response?._data?.message;
          disabledButton.value = true;
        }
      } finally {
        isLoading.value = false;
      }
    }
  }
);

// FUNCTION
// RESTAURANT
const handleInputNumberAdult = (value: number) => {
  if (value > 0) {
    setTimeout(() => {
      _formRef.value?.clearValidate("number_adult");
    }, 50);
  }
};

const filterCourse = (dateSelect: string, timeSelect: string) => {
  if (typeStore.value === RESTAURANT) {
    const weekDayNumber = moment(dateSelect).weekday();
    return courses.value.filter(
      (item: any) =>
        item.day_works?.includes(weekDayNumber) &&
        moment(timeSelect, "HH:mm").isBetween(
          moment(item.start_time, "HH:mm:ss"),
          moment(item.end_time, "HH:mm:ss"),
          "seconds",
          "[]"
        )
    );
  }
  return courses.value;
};

const handleFocusOutCoupon = async () => {
  if (!GROUP_TYPE_STORE.RESTAURANT.includes(typeStore.value)) {
    return true;
  }
  if (!formData.coupon_code) {
    errorCoupon.value = "";
    couponSelected.value = null;
  }
  if (
    formData.coupon_code &&
    formData.course_id &&
    formData.dateSelect &&
    formData.timeSelect
  ) {
    couponSelected.value = null;
    formCheckCoupon.coupon_code = formData.coupon_code;
    formCheckCoupon.course_id = formData.course_id || 0;
    formCheckCoupon.dateSelect = formData.dateSelect;
    formCheckCoupon.timeSelect = formData.order_time;
    try {
      isLoadingCheckCoupon.value = true;
      const res = await BookingRequest.checkCouponCourse<any>({
        coupon_code: formData.coupon_code,
        course_id: formData.course_id,
        store_id: store.value?.id,
        order_time: `${formData.dateSelect} ${formData.order_time}`,
      });
      couponSelected.value = res?.data.coupon;
      errorCoupon.value = "";
    } catch (e: any) {
      if (e.response.status === STATUS_CODE.BAD_REQUEST) {
        errorCoupon.value = e.response?._data?.message;
        messageWarning((errorCoupon.value = e.response?._data?.message));
      }
    } finally {
      isLoadingCheckCoupon.value = false;
    }
  }
};

const handleFocusOutNumberAdult = () => {
  if (!formData.number_adult) {
    formData.number_adult = 1;
  }
};

// RESTAURANT AND SALON

const getBookingSource = (): number => {
  switch (+bookingSource.value) {
    case BOOKING_SOURCE.LINE:
      return BOOKING_SOURCE.LINE;
    default:
      return BOOKING_SOURCE.WEB;
  }
};

const handleBooking = async (form: FormInstance | undefined) => {
  if (typeStore.value === RESTAURANT) {
    await customerBookingRestaurant(
      isInvalidTime,
      {
        ...formData,
        coupon_code: errorCoupon.value ? null : formData.coupon_code,
      },
      form,
      categoriesSeat,
      store,
      courses,
      chooseCourse,
      meStore.getUserId,
      total,
      getBookingSource(),
      emits,
      typeStore.value,
      messInvalidCoupon.value,
      couponSelected,
      disabledButton.value,
      couponList
    );
  } else if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    await customerBookingSalon(
      isInvalidTime,
      formData,
      form,
      store,
      courses,
      chooseCourse,
      chooseStaff,
      categoryList,
      staffList,
      arrIdMenuActive,
      meStore.getUserId,
      total,
      getBookingSource(),
      emits,
      typeStore.value,
      errorCourseOrMenu.value
    );
  } else {
    if (!chooseEvent.value) {
      isInvalidTime.value = true;
      return;
    }
    customerBookingEvent(
      formData,
      form,
      store,
      emits,
      getBookingSource(),
      meStore.getUserId,
      chooseEvent,
      total,
      arrEvent,
      typeStore.value,
      couponSelected,
      arrTimeEvent,
      arrayDateEvent,
      arrEvent,
      couponList
    );
  }
};

const handleChangeCourse = async (value: number) => {
  changePaymentType();
  chooseCourse.value = courses.value.find(
    (item) => item.id === formData.course_id
  );

  if (!chooseCourse.value) {
    chooseCourse.value = null;
  }

  if (chooseCourse.value?.accepted_children === ACCEPTED_CHILDREN.NONE) {
    formData.number_children = null;
  }

  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    formData.dateSelect = moment().format("YYYY-MM-DD");
    getTimeDateSelected(formData.dateSelect);
    formData.timeSelect = getCurrentTimeBooking();
    if (!chooseCourse.value && arrIdMenuActive.value.length <= 0) {
      if (typeStore.value !== SALON) {
        errorCourseOrMenu.value = t("course_or_menu");
      } else {
        errorCourseOrMenu.value = t("coupon_or_menu");
      }
    } else {
      errorCourseOrMenu.value = "";
    }
  } else {
    resetCoupon();
    await getListCoupon();
  }
  await getStaffBooking();
};

const handleChangeDate = async () => {
  if (typeStore.value === RESTAURANT) {
    minTime.value = "";
    isInvalidTime.value = false;
    formData.timeSelect = "";
    timeRanger.value = [];
    formData.course_id = null;
    chooseCourse.value = null;
    errorSeat.value = "";
    resetCoupon();
    isErrorOrderTime.value = false;

    if (!formData.dateSelect) {
      formData.dateSelect = "";
    } else if (
      moment(formData.dateSelect).format("YYYY/MM/DD") ===
      moment().format("YYYY/MM/DD")
    ) {
      minTime.value = getCurrentTimeBooking();
    }
    // get array time
    getTimeDateSelected(formData.dateSelect);
  }
};

const getTimeDateSelected = (date: string) => {
  const dayOfWeekSelected = moment(date).weekday();

  store.value.opening_times.forEach((item) => {
    if (item.day_of_week === dayOfWeekSelected) {
      timeRanger.value = timeRanger.value
        .concat(getTimeArray(item.start, item.end, 15, "minutes"))
        .sort();
    }
  });
};

const handleChangeTimeSelect = async () => {
  if (typeStore.value === RESTAURANT) {
    if (formData.timeSelect) {
      formData.course_id = null;
      chooseCourse.value = null;
      isErrorOrderTime.value = false;
      isInvalidTime.value = false;
      errorSeat.value = "";
    }
  }
};

//SALON
const handleChangeMenu = async (value: any) => {
  changePaymentType();
  formData.dateSelect = moment().format("YYYY-MM-DD");
  getTimeDateSelected(formData.dateSelect);
  formData.timeSelect = getCurrentTimeBooking();
  arrIdMenuActive.value = JSON.parse(JSON.stringify(value));
  if (!chooseCourse.value && value.length <= 0) {
    errorCourseOrMenu.value = t("course_or_menu");
  } else {
    errorCourseOrMenu.value = "";
  }
  await getStaffBooking();
};

const handleShowMenu = () => {
  isShowMenu.value = true;
};
const getStaffBooking = async (resetStaffId = false, backScreen = false) => {
  if (
    backScreen ||
    isMounting.value ||
    !GROUP_TYPE_STORE.SAME.includes(typeStore.value)
  )
    return false;
  isLoading.value = true;
  // change time, course, menu -> reset staff_id
  if (!resetStaffId) {
    formData.staff_id = null;
    chooseStaff.value = null;
  }
  const obj = {
    all: true,
    store_id: store.value.id,
    course_id: chooseCourse.value?.id || null,
    // order_time: `${formData.dateSelect} ${formData.timeSelect}`.trim(),
    order_time: null,
  };
  const paramObj = new URLSearchParams(obj).toString();
  const paramMenu = arrIdMenuActive.value
    .map((item) => `menu_ids[]=${item}`)
    .join("&");
  const paramsUrl = `${paramObj}&${paramMenu}`;
  _formRef.value?.clearValidate(["course_id"]);
  _formRef.value?.clearValidate(["order_time"]);
  if (chooseCourse.value || arrIdMenuActive.value?.length > 0) {
    try {
      staffList.value = [];
      staffList.value = (
        await BookingRequest.getStaffBooking<StaffInterface[]>(paramsUrl)
      )?.data;
      errorStaff.value = "";
    } catch (error: any) {
      staffList.value = [];
      errorStaff.value = error?.response?._data.message;
    } finally {
      isLoading.value = false;
    }
  } else {
    staffList.value = [];
    isLoading.value = false;
  }
  isErrorOrderTime.value = false;
};

const handleStaff = () => {
  chooseStaff.value = staffList.value.find(
    (item) => item.id === formData.staff_id
  );
};

const handleChangeStaff = (idStaff: number) => {
  formData.staff_id = idStaff;
  chooseStaff.value = staffList.value.find(
    (item) => item.id === formData.staff_id
  );
};

const handleClickCalendar = (date: string, time: string) => {
  formData.dateSelect = date;
  formData.timeSelect = time;
  isErrorOrderTime.value = false;
};

const getTimeStart = () => {
  if (!formDataProp.value) {
    if (!GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
      if (formData.dateSelect === moment().format("YYYY-MM-DD")) {
        minTime.value = getCurrentTimeBooking();
        if (!timeRanger.value.includes(formData.timeSelect)) {
          if (timeRanger.value.includes(getCurrentTimeBooking())) {
            formData.timeSelect = getCurrentTimeBooking();
          } else {
            formData.timeSelect = "";
          }
        }
      } else if (
        !formData.timeSelect ||
        (formData.timeSelect && !timeRanger.value.includes(formData.timeSelect))
      ) {
        formData.timeSelect = timeRanger.value?.[0] ?? "";
      }
    } else {
      minTime.value = getCurrentTimeBooking();
      formData.timeSelect = getCurrentTimeBooking();
    }
  }
};

// EVENT

const handleInputNumberAdultEvent = (value: number) => {
  if (value > 0) {
    setTimeout(() => {
      _formRef.value?.clearValidate("number_adult_event");
    }, 50);
  }
};

const handleInputNumberChildrentEvent = (value: number) => {
  if (value > 0) {
    setTimeout(() => {
      _formRef.value?.clearValidate("number_adult_event");
    }, 50);
  }
};

const handleChangeEvent = async (event_id: number) => {
  changePaymentType();
  formData.dateSelect = "";
  formData.time_event_id = "";
  chooseEvent.value = null;
  dateSubmit.value = "";
  formData.order_time = "";
  formData.time_event_id = null;
  resetCoupon();
  if (event_id) {
    await getListDateEvent(monthDay);
  }
};

const handleChangeMonth = async (date: string) => {
  await getListDateEvent(date);
};

const handleChangeDateEvent = async (date: string) => {
  dateSubmit.value = date;
  dialogModal.value = true;
  await getTimeEvent(date);
};

const handleClose = () => {
  dateSubmit.value = "";
  dialogModal.value = false;
};

const getListDateEvent = async (date: string, key?: boolean) => {
  try {
    loadingDateEvent.value = true;
    arrayDateEventBooking.value = (
      await bookingGuestRequest.getDateEvent<any[]>({
        event_id: formData.event_id,
        date: moment(date).format("YYYY-MM"),
      })
    ).data;
    if (key) {
      arrayDateEvent.value = arrayDateEventBooking.value;
    }
  } catch (error) {
  } finally {
    loadingDateEvent.value = false;
  }
};

const getTimeEvent = async (date: string, key?: boolean) => {
  try {
    loadingTimeEvent.value = true;
    arrTimeEventBooking.value = (
      await bookingGuestRequest.getTimeEvent<any[]>({
        event_id: formData.event_id,
        date: date,
      })
    ).data;
    if (key) {
      arrTimeEvent.value = arrTimeEventBooking.value;
    }
  } catch (_e) {
  } finally {
    loadingTimeEvent.value = false;
  }
};

const handleSubmitDateEvent = async (date: string, time_id: number) => {
  isInvalidTime.value = false;
  isErrorOrderTime.value = false;
  arrTimeEvent.value = arrTimeEventBooking.value;
  arrayDateEvent.value = arrayDateEventBooking.value;
  formData.time_event_id = time_id;
  chooseEvent.value = arrTimeEvent.value?.find(
    (item) => item.item.id === time_id
  );
  formData.dateSelect = date;
  isInvalidTime.value = false;
  resetCoupon();
  await getListCoupon();
  dialogModal.value = false;
};

const getArrayTimeDateEvent = async () => {
  if (GROUP_TYPE_STORE.EVENT.includes(typeStore.value) && !isBackScreen.value) {
    if (formData.event_id && !formData.time_event_id) {
      await router.push({ name: "index" });
    }
    if (formData.dateSelect && formData.event_id) {
      getListDateEvent(moment(formData.dateSelect).format("YYYY-MM"), true);
      await getTimeEvent(formData.dateSelect, true);
    } else if (formData.dateSelect && formData.event_id) {
      await getListDateEvent(monthDay, true);
    }
    if (formData.event_id && formData.time_event_id) {
      chooseEvent.value = arrTimeEvent.value?.find(
        (item: any) =>
          item.event.id === formData.event_id &&
          item.item.id === formData.time_event_id
      );
    }
  }
};

const resetCoupon = () => {
  formData.coupon_code = "";
  couponList.value = [];
  couponSelected.value = null;
};

const handleFocusOutCouponEvent = async () => {
  if (!GROUP_TYPE_STORE.EVENT.includes(typeStore.value)) {
    return true;
  }
  if (!formData.coupon_code) {
    errorCoupon.value = "";
    couponSelected.value = null;
  }
  if (
    formData.coupon_code &&
    formData.event_id &&
    formData.dateSelect &&
    formData.time_event_id
  ) {
    couponSelected.value = null;
    formCheckCoupon.coupon_code = formData.coupon_code;
    formCheckCoupon.event_id = formData.event_id || 0;
    formCheckCoupon.dateSelect = formData.dateSelect;
    formCheckCoupon.time_event_id = formData.time_event_id;
    try {
      isLoadingCheckCoupon.value = true;
      const res = await BookingRequest.checkCouponCourse<any>({
        coupon_code: formData.coupon_code,
        event_id: formData.event_id,
        store_id: store.value?.id,
        order_time: `${formData.dateSelect} ${chooseEvent.value?.item.start}`,
      });
      couponSelected.value = res?.data.coupon;
      errorCoupon.value = "";
    } catch (e: any) {
      if (e.response.status === STATUS_CODE.BAD_REQUEST) {
        errorCoupon.value = e.response?._data?.message;
        messageWarning((errorCoupon.value = e.response?._data?.message));
      }
    } finally {
      isLoadingCheckCoupon.value = false;
    }
  }
};

const handleChangeCoupon = async (id: number) => {
  if (GROUP_TYPE_STORE.RESTAURANT.includes(typeStore.value)) {
    await handleFocusOutCoupon();
  } else {
    await handleFocusOutCouponEvent();
  }
  if (!couponSelected.value) {
    formData.coupon_code = "";
  }
};

const getListCoupon = async () => {
  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    return;
  }
  const params = {
    event_id: formData.event_id,
    store_id: store.value?.id,
    course_id: formData.course_id,
    order_date: formData.dateSelect,
  };
  if (typeStore.value === RESTAURANT) {
    delete params.event_id;
  } else {
    delete params.course_id;
  }
  try {
    isLoadingCheckCoupon.value = true;
    couponList.value = (
      await CouponRequest.getCouponBooking<CouponInterface[]>(params)
    ).data;
  } catch (err: any) {
  } finally {
    isLoadingCheckCoupon.value = false;
  }
};

const handleBeforeMount = async () => {
  scrollToTop();
  if (!meStore.info) return;
  await getData();
  await getArrayTimeDateEvent();
  // have not store or course -> redirect index
  if (!store.value && !chooseCourse.value) {
    await router.push({ name: "index" });
  }

  getTimeDateSelected(formData.dateSelect);
  setDataWhenBackScreen(
    formDataProp,
    formData,
    categorySeatProp,
    chooseCourse,
    courses,
    chooseStaff,
    staffList,
    arrIdMenuActive,
    typeStore,
    arrTimeEvent,
    chooseEvent
  );

  if (errorsFormProp.value && errorsFormProp.value["order_time"]?.[0]) {
    isErrorOrderTime.value = true;
  }

  await nextTick(async () => {
    //after set value date
    timeRanger.value = [];
    // get array time
    getTimeDateSelected(formData.dateSelect);
    //Set default timeSelect -> nextTick after have dateSelect
    getTimeStart();
    // Default course
    courseFilterDateTimeSelect.value = filterCourse(
      formData.dateSelect,
      formData.timeSelect
    );
    if (
      courseFilterDateTimeSelect.value.length &&
      route.query?.course_id &&
      COURSE_STORE_BOOKING.includes(typeStore.value) &&
      !isBackScreen.value
    ) {
      if (
        courseFilterDateTimeSelect.value.some(
          (item) => item.id === +route.query?.course_id
        )
      ) {
        formData.course_id = +route.query?.course_id;
      }
    }
    // Default staff
    isMounting.value = false;
    await getStaffBooking(true, isBackScreen.value);
    if (
      route.query?.staff_id &&
      STAFF_STORE_BOOKING.includes(typeStore.value) &&
      !isBackScreen.value
    ) {
      const staff = staffList.value.find(
        (item) => item.id === +route.query?.staff_id
      );
      if (staff) {
        formData.staff_id = +route.query?.staff_id;
        chooseStaff.value = staff;
      }
    }
    if (
      !isBackScreen.value &&
      formData.dateSelect &&
      store.value?.id &&
      route.query?.coupon_code
    ) {
      formData.coupon_code = route.query?.coupon_code;
      await handleChangeCoupon(+route.query.coupon_code);
      await getListCoupon();
    } else if (!isBackScreen.value && formData.dateSelect && store.value?.id) {
      await getListCoupon();
    }
  });
};

onBeforeMount(async () => {
  await handleBeforeMount();
});

onUnmounted(() => {
  clearTimeout(timeout.value);
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.fz-12 {
  font-size: 12px;
}

.-mt-10 {
  margin-top: -10px;
}

.booking {
  #form-item-time {
    position: relative;
  }

  .group-order-time {
    gap: 12px;
  }

  .booking__name {
    font-weight: 500;
  }

  :deep(.popup-datepicker) {
    z-index: 3000;
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }

  .el-input {
    height: 40px;
  }

  :deep(.el-select) {
    .el-input {
      height: 40px;
    }
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .calendar-event {
    margin-top: 15px;

    .booking-event-date {
      :deep(.el-date-picker) {
        max-width: 100% !important;
      }
    }
  }

  &__name {
    font-weight: 500;
    margin-bottom: 28px;
  }

  &__form {
    .w-100 {
      width: 100%;
    }

    .amount {
      padding-top: 2px;

      :deep(.el-form-item__content) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    :deep(.el-date-editor.el-input) {
      height: 40px;
    }

    & > .el-row {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .sub-row {
      .note-sms {
        padding-bottom: 8px;
      }

      & > .el-row {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .reserve {
          margin-right: 32px;
        }

        .order_name {
          gap: 12px;
        }
      }

      .group-input-number {
        .amount {
          width: 145px;
        }
      }
    }
  }

  :deep(.el-input-number) {
    width: 125px;
  }
}

:deep(.list-courses) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.102) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.102) !important;

  .el-scrollbar {
    margin-top: 12px;
    margin-bottom: 8px;
  }
}

:deep(.list-events) {
  padding-bottom: 10px;
  padding-top: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.102) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.102) !important;
}

.el-button {
  margin: 32px auto 0;
  display: inherit;

  &.button-add-menu {
    margin: 0;
    float: right;
    &:after {
      content: "";
      clear: both;
      display: table;
    }
  }
}

.el-button.is-disabled:hover,
.el-button.is-disabled:focus {
  background-color: #0052d9;
  color: #ffffff;
}

@media only screen and (min-width: 1200px) and (max-width: 1330px) {
  .row-email {
    & > .el-col {
      max-width: 100%;
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .booking {
    &__name {
      margin-bottom: 12px;
    }
    .menu-label {
      margin-bottom: 12px;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .booking {
    &__name {
      margin-bottom: 24px;
    }

    &__form {
      & > .el-row {
        .label {
          margin-bottom: 16px;
        }

        .sub-label {
          margin-bottom: 4px;
        }

        .sub-label {
          margin-bottom: 8px;
        }
      }
    }
  }
}

@include res("xs-phone", $custom-breakpoints-spec) {
  .booking {
    .el-input-number {
      width: 88px;
    }

    .booking__form {
      .sub-row {
        .group-input-number {
          flex-direction: row;
        }
      }
    }
  }
}
</style>
