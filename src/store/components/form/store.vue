<template>
  <div id="main-form" v-loading="!storeDetail && !isMounted" class="main-form">
    <div v-if="storeDetail">
      <el-form
        ref="_formRef"
        :model="formData"
        label-position="left"
        label-width="180px"
        :inline-message="true"
        require-asterisk-position="right"
        :rules="ruleStore"
      >
        <div class="form-data">
          <div class="left">
            <el-form-item
              v-if="!!storeDetail"
              :label="$t('id_store')"
              class="align-items-center"
            >
              <InputText v-model="storeDetail.id" :disabled="!!storeDetail" />
            </el-form-item>
            <!-- START Store code -->
            <el-form-item
              v-if="!!storeDetail"
              :label="$t('store_code')"
              class="align-items-center"
            >
              <InputText v-model="storeDetail.code" disabled />
            </el-form-item>
            <!-- END Store code -->
            <!-- START Agent code -->
            <el-form-item
              prop="agent_code"
              :error="getError('agent_code')"
              :label="$t('agent_code')"
              class="align-items-center"
            >
              <InputText
                v-model="formData.agent_code"
                :maxlength="MAX_LENGTH_AGENT_CODE"
                :placeholder="$t('placeholder.agent_code')"
              />
            </el-form-item>
            <!-- END Agent code -->
            <!-- START Store name -->
            <el-form-item
              :label="$t('store_name')"
              required
              prop="name"
              :error="getError('name')"
              class="align-items-center"
            >
              <InputText
                v-model="formData.name"
                :placeholder="$t('placeholder.store_name')"
                :maxlength="MAX_LENGTH_STORE_NAME"
              />
            </el-form-item>
            <!-- END Store name -->
            <el-form-item
              :label="$t('industry')"
              required
              prop="type_store_id"
              :error="getError('type_store_id')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  v-model="formData.type_store_id"
                  class="w-100"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="typeStore in filterDataTypeStore"
                    :key="typeStore.id"
                    :label="typeStore.name"
                    :value="typeStore.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!--START Name company-->
            <el-form-item :label="$t('corporate_name')" required>
              <div class="company">
                <el-row :gutter="12" class="mb-12">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('first_name_kanji')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('first_company_name')"
                      prop="first_company_name"
                    >
                      <InputText
                        v-model="formData.first_company_name"
                        :maxlength="MAX_LENGTH_FIRST_NAME"
                        :placeholder="$t('placeholder.first_name')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('last_name_kanji')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('last_company_name')"
                      prop="last_company_name"
                    >
                      <InputText
                        v-model="formData.last_company_name"
                        :maxlength="MAX_LENGTH_LAST_NAME"
                        :placeholder="$t('placeholder.last_name')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('sur_name')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('first_company_name_kana')"
                      prop="first_company_name_kana"
                    >
                      <InputText
                        v-model="formData.first_company_name_kana"
                        :maxlength="MAX_LENGTH_FIRST_NAME"
                        :placeholder="$t('placeholder.first_name_kana')"
                        @input="
                          formatInputKatakana(
                            $event,
                            'first_company_name_kana',
                            _formRef
                          )
                        "
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('may_name')"
                      label-width="100%"
                      class="flex-column un-required"
                      :error="getError('last_company_name_kana')"
                      prop="last_company_name_kana"
                    >
                      <InputText
                        v-model="formData.last_company_name_kana"
                        :maxlength="MAX_LENGTH_LAST_NAME"
                        :placeholder="$t('placeholder.last_name_kana')"
                        @input="
                          formatInputKatakana(
                            $event,
                            'last_company_name_kana',
                            _formRef
                          )
                        "
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <!--END Name company-->
            <el-form-item
              :label="$t('email_address')"
              required
              :error="getError('email')"
              prop="email"
              class="align-items-center"
            >
              <InputText
                v-model="formData.email"
                :maxlength="MAX_LENGTH_EMAIL"
                :disabled="!!storeDetail"
                :placeholder="$t('placeholder.email')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
              />
            </el-form-item>
            <el-form-item
              required
              label-width="auto"
              class="email-notice"
              :error="getError('email_for_notification_reception')"
              prop="email_for_notification_reception"
            >
              <div class="required-field label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("email_address") }}</p>
                  <p>({{ $t("receive_notice") }})</p>
                </div>
              </div>
              <div class="input-email">
                <InputText
                  v-model="formData.email_for_notification_reception"
                  :maxlength="MAX_LENGTH_EMAIL"
                  :placeholder="
                    $t('placeholder.email_for_notification_reception')
                  "
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                />
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('phone_number')"
              required
              :error="getError('phone_number')"
              prop="phone_number"
              class="align-items-center"
            >
              <InputPhone v-model="formData.phone_number" />
            </el-form-item>
            <el-form-item
              :label="$t('postal_code')"
              prop="postal_code"
              :error="getError('postal_code')"
              class="align-items-center"
            >
              <div class="d-flex w-100 post-code">
                <InputCode v-model="formData.postal_code"></InputCode>
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
            <!-- START Coordinates -->
            <el-form-item
              :label="$t('store_location')"
              class="align-items-start"
            >
              <div class="w-100 coordinates">
                <el-row :gutter="12">
                  <!-- START Latitude -->
                  <el-col :span="12">
                    <el-form-item :error="getError('latitude')">
                      <InputCoordinate
                        v-model="formData.latitude"
                        :placeholder="$t('latitude')"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- END Latitude -->
                  <!-- START Longitude -->
                  <el-col :span="12">
                    <el-form-item :error="getError('longitude')">
                      <InputCoordinate
                        v-model="formData.longitude"
                        :placeholder="$t('longitude')"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- END Longitude -->
                </el-row>
              </div>
              <a
                class="text-guide"
                target="_blank"
                :href="useAssetsFile('How_to_get_coordinate_on_google_map.pdf')"
                >{{ $t("guide_link") }}</a
              >
            </el-form-item>
            <!-- END Coordinates -->
            <!-- GOOGLE MAP-->
            <el-form-item label-width="auto" class="email-notice input-map">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("google_map_link") }}</p>
                </div>
              </div>
              <el-form-item
                class="w-100 form-item-map"
                :error="getError('link_google_map')"
                prop="link_google_map"
              >
                <div class="d-flex input post-code align-items-center flex-1">
                  <InputText
                    v-model="formData.link_google_map"
                    :placeholder="$t('placeholder.google_map_link')"
                  ></InputText>
                  <a
                    class="text-guide"
                    target="_blank"
                    href="https://jp.ar-xia.com/google-map-link/"
                    >{{ $t("guide_link") }}</a
                  >
                </div>
              </el-form-item>
            </el-form-item>
            <!--END GOOGLE MAP-->
            <!--MAP-->
            <el-form-item label-width="auto" class="email-notice input-map">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p>{{ $t("google_map") }}</p>
                </div>
              </div>
              <el-form-item
                class="w-100 form-item-map"
                :error="getError('iframe_google_map')"
                prop="iframe_google_map"
              >
                <div class="d-flex input post-code align-items-center flex-1">
                  <InputText
                    v-model="formData.iframe_google_map"
                    :placeholder="$t('placeholder.google_map')"
                    :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                  ></InputText>
                  <a
                    class="text-guide"
                    target="_blank"
                    href="https://jp.ar-xia.com/google-map-iframe/"
                    >{{ $t("guide_link") }}</a
                  >
                </div>
              </el-form-item>
            </el-form-item>
            <!--END MAP-->
            <div class="pt-20 pb-10 text-note">
              {{ $t("search_block") }}
            </div>
            <!--START BLOCK ADDRESS- -->
            <el-form-item :label="$t('block') + 1" class="align-items-center">
              <el-select
                v-model="formData.island_id"
                :placeholder="$t('block') + 1"
                class="w-100"
                @change="handleChangeBlock1"
              >
                <el-option
                  v-for="item in islandList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('block') + 2" class="align-items-center">
              <el-select
                v-model="formData.district_id"
                v-loading="loadingBlock2"
                class="w-100"
                :disabled="!formData.island_id"
                :placeholder="$t('block') + 2"
                @change="handleChangeBlock2(formData.district_id)"
              >
                <el-option
                  v-for="item in districtList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('block') + 3" class="align-items-center">
              <el-select
                v-model="formData.conscious_id"
                v-loading="loadingBlock3"
                class="w-100"
                :disabled="!formData.district_id"
                :placeholder="$t('block') + 3"
                @change="handleChangeBlock3(formData.conscious_id)"
              >
                <el-option
                  v-for="item in consciousList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('block') + 4"
              class="align-items-center pb-20"
            >
              <el-select
                v-model="formData.village_id"
                v-loading="loadingBlock4"
                class="w-100"
                :disabled="!formData.conscious_id"
                :placeholder="$t('block') + 4"
              >
                <el-option
                  v-for="item in villageList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>

            <!--END BLOCK ADDRESS- -->
            <!-- START Image -->
            <el-form-item
              :label="$t('image')"
              class="image"
              :error="getError('image')"
            >
              <InputFile
                v-loading="loadingAvatar"
                :data="imagesUpload"
                :limit="limitImage"
                :placeholder="$t('store.placeholder_category_description')"
                @handle-remove-image="handleRemoveImage"
                @handle-change-image="handleImageChange"
              />
              <ImageTextDescription :type-image="maxImagePlanType.STORE" />
            </el-form-item>
            <!-- END Image -->

            <!-- START Area -->
            <el-form-item :label="$t('area')" class="align-items-center">
              <el-input
                v-model="formData.area"
                v-input-trim
                :placeholder="$t('area')"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <!-- END Area -->
            <el-form-item :label="$t('transport')" class="align-items-center">
              <el-input
                v-model="formData.transportation"
                v-input-trim
                :placeholder="$t('placeholder.transport')"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('genre')"
              class="align-items-center"
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
            <el-form-item
              :label="$t('introduction2')"
              class="align-items-center"
            >
              <el-input
                v-model="formData.introduction"
                v-input-trim
                :placeholder="$t('placeholder.enter_introduction')"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('explanatory_text')">
              <el-input
                v-model="formData.description"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="$t('placeholder.enter_description')"
                :maxlength="MAX_LENGTH_DESCRIPTION"
              />
            </el-form-item>
            <el-form-item :label="$t('news')" class="align-items-center">
              <el-input
                v-model="formData.news"
                v-input-trim
                :placeholder="
                  $t('placeholder.within_character', {
                    max: MAX_LENGTH_DEFAULT,
                  })
                "
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('notes')">
              <el-input
                v-model="formData.note"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="
                  $t('placeholder.within_character', {
                    max: MAX_LENGTH_DEFAULT_TEXTAREA,
                  })
                "
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
              />
            </el-form-item>
            <el-form-item :label="$t('payment.method')">
              <InputText
                v-model="formData.method_of_payment"
                :placeholder="$t('placeholder.payment_of_method')"
                :maxlength="MAX_LENGTH_DEFAULT"
              />
            </el-form-item>
            <el-form-item
              :label="$t('operating_officer')"
              class="law-store-item"
            >
              <div class="w-100">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item>
                      <InputText
                        v-model="formData.operating_officer_first_name"
                        :placeholder="$t('placeholder.first_name')"
                        :maxlength="MAX_LENGTH_FIRST_NAME"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <InputText
                        v-model="formData.operating_officer_last_name"
                        :placeholder="$t('placeholder.last_name')"
                        :maxlength="MAX_LENGTH_LAST_NAME"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <!--            <el-form-item-->
            <!--              :label="$t('operational_manager')"-->
            <!--              class="law-store-item"-->
            <!--            >-->
            <!--              <div class="w-100">-->
            <!--                <el-row :gutter="12">-->
            <!--                  <el-col :span="12">-->
            <!--                    <el-form-item prop="operational_manager_first_name">-->
            <!--                      <InputText-->
            <!--                        v-model="formData.operational_manager_first_name"-->
            <!--                        :placeholder="$t('placeholder.first_name_kana')"-->
            <!--                        :maxlength="MAX_LENGTH_FIRST_NAME"-->
            <!--                      />-->
            <!--                    </el-form-item>-->
            <!--                  </el-col>-->
            <!--                  <el-col :span="12">-->
            <!--                    <el-form-item prop="operational_manager_last_name">-->
            <!--                      <InputText-->
            <!--                        v-model="formData.operational_manager_last_name"-->
            <!--                        :placeholder="$t('placeholder.last_name_kana')"-->
            <!--                        :maxlength="MAX_LENGTH_LAST_NAME"-->
            <!--                      />-->
            <!--                    </el-form-item>-->
            <!--                  </el-col>-->
            <!--                </el-row>-->
            <!--              </div>-->
            <!--            </el-form-item>-->
            <el-form-item :label="$t('price_range')" class="law-store-item">
              <el-input
                v-model="formData.price_range"
                v-input-trim
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('placeholder.price_range')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('delivery_time')" class="law-store-item">
              <el-input
                v-model="formData.delivery_time"
                v-input-trim
                type="textarea"
                :rows="5"
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                :placeholder="$t('placeholder.time_you_reserved')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('timing_and_method')"
              class="law-store-item"
            >
              <el-input
                v-model="formData.timing_and_method"
                v-input-trim
                type="textarea"
                :rows="5"
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                :placeholder="$t('placeholder.credit_card_local_payment')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('necessary_expenses')"
              class="law-store-item"
            >
              <el-input
                v-model="formData.necessary_expenses"
                v-input-trim
                type="textarea"
                :rows="5"
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                :placeholder="$t('placeholder.necessary_fee')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('handling_returned')">
              <el-input
                v-model="formData.handling_returned"
                v-input-trim
                type="textarea"
                :rows="5"
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                :placeholder="$t('placeholder.to_the_characteristics')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('handling_defective')">
              <el-input
                v-model="formData.handling_defective"
                v-input-trim
                type="textarea"
                :rows="5"
                :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                :placeholder="$t('placeholder.contact_the_store')"
                clearable
              />
            </el-form-item>
            <el-form-item
              class="align-items-center"
              :label="$t('specified_commercial')"
            >
              <button-export
                :loading="loadingExport"
                @click="handleExportCSV"
              />
            </el-form-item>
          </div>
          <div class="right">
            <!--Home Page-->
            <el-form-item
              :label="$t('home_page')"
              prop="home_page"
              :error="getError('home_page')"
              class="align-items-center"
            >
              <el-input
                v-model="formData.home_page"
                v-input-trim
                :placeholder="$t('placeholder.home_page')"
                class="domain"
                :maxlength="MAX_LENGTH_DEFAULT"
                clearable
              />
            </el-form-item>
            <!--END Home Page-->
            <!--WORKING DAY-->
            <el-form-item :label="$t('front.business_hour')">
              <!--Time Working-->
              <el-form-item
                :error="getError('opening_times')"
                prop="opening_times"
              >
                <div
                  v-for="item in WORKING_DAYS"
                  :key="item.value"
                  class="business-hours"
                >
                  <div class="day">
                    <div class="label">{{ item.label }}</div>
                    <el-checkbox
                      v-model="arrayCheckDayOff[item.value]"
                      :label="$t('holiday_check')"
                      :true-label="1"
                      :false-label="0"
                      @change="changeWorkingDay($event, item.value)"
                    />
                  </div>
                  <div
                    v-if="
                      !checkListTimeHoliday.includes(item.value) &&
                      !arrayCheckDayOff[item.value]
                    "
                    class="hours d-flex flex-column"
                  >
                    <div
                      v-for="(time, index) in getOpenTimeOfDay(item.value)"
                      :key="index"
                    >
                      <div class="d-flex align-items-center">
                        <div class="flex-2">
                          <TimeRanger
                            v-model:start-time="time.start"
                            v-model:end-time="time.end"
                          />
                          <p class="error-validate">
                            {{
                              getError(
                                `opening_times.${findIndexWorkingTime(
                                  item.value,
                                  index
                                )}.start`
                              )
                            }}
                          </p>
                          <p class="error-validate">
                            {{
                              getError(
                                `opening_times.${findIndexWorkingTime(
                                  item.value,
                                  index
                                )}.end`
                              )
                            }}
                          </p>
                        </div>
                        <div
                          class="delete-time cursor-pointer d-flex justify-content-center align-items-center flex-1"
                          @click="deleteWorkingTime(item.value, index)"
                        >
                          <div
                            v-if="getOpenTimeOfDay(item.value).length > 1"
                            class="d-flex justify-content-center align-items-center"
                          >
                            <IconDeleteTime />
                            <span>{{ $t("button.delete") }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="add-time cursor-pointer d-flex align-items-center"
                      @click="addWorkingTime(item.value)"
                    >
                      <IconAddTime />
                      <span>{{ $t("button.addition") }}</span>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <!--Holiday-->
              <el-form-item class="w-100">
                <div class="business-hours">
                  <div class="day holiday">
                    <div class="label">{{ $t("holiday") }}</div>
                    <el-checkbox
                      v-model="isHoliday"
                      :label="$t('holiday_check')"
                    />
                  </div>
                  <div class="multi-holiday d-flex flex-column">
                    <div class="custom-multi-date d-flex align-items-center">
                      <div class="w-100 flex-1">
                        <ClientOnly>
                          <MultiDate v-model="multiSelectDate" />
                        </ClientOnly>
                        <p
                          v-if="getError('closing_times')"
                          class="error-validate"
                        >
                          {{ getError("closing_times") }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <!--Open Store Note-->
              <div class="business-hours memo">
                <div class="day">
                  <div class="label">{{ $t("memo") }}</div>
                </div>
                <div class="multi-holiday d-flex flex-column">
                  <div class="custom-multi-date d-flex align-items-center">
                    <el-input
                      v-model="formData.comment_opening_time"
                      v-input-trim
                      type="textarea"
                      :rows="5"
                      :placeholder="$t('placeholder.memo_new')"
                      :maxlength="MAX_LENGTH_TEXTAREA"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
            <!--Cancel Note-->
            <el-form-item :label="$t('cancellation')">
              <el-input
                v-model="formData.cancellation"
                v-input-trim
                type="textarea"
                :rows="5"
                :placeholder="$t('placeholder.cancellation')"
                :maxlength="MAX_LENGTH_DEFAULT"
              />
            </el-form-item>
            <!--END Cancel Note-->
            <el-form-item label-width="auto" class="cancel-protected">
              <div class="label d-flex align-items-center">
                <div class="d-flex flex-column w-100">
                  <p class="h-32px">{{ $t("cancel_protected") }}</p>
                </div>
              </div>
              <div class="refund">
                <div class="refund-item d-flex">
                  <!--Cancel checkbox-->
                  <el-form-item
                    prop="is_setting_cancel"
                    :error="getError('is_setting_cancel')"
                  >
                    <el-checkbox
                      v-model="formData.is_setting_cancel"
                      class="w-100"
                      :label="$t('setting_cancel_protected')"
                    />
                  </el-form-item>
                  <!--END Cancel checkbox-->
                </div>
                <template v-if="formData.is_setting_cancel">
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("7_to_2_days_before") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item
                      class="flex-1"
                      prop="setting_store_cancel.seven_day_to_two_day_ago_percent"
                      :error="
                        getError(
                          'setting_store_cancel.seven_day_to_two_day_ago_percent'
                        )
                      "
                    >
                      <InputNumberText
                        v-model="
                          setting_store_cancel.seven_day_to_two_day_ago_percent
                        "
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="
                          handleFocusOut('seven_day_to_two_day_ago_percent')
                        "
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("one_day_ago") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item
                      class="flex-1"
                      prop="setting_store_cancel.one_day_ago_percent"
                      :error="
                        getError('setting_store_cancel.one_day_ago_percent')
                      "
                    >
                      <InputNumberText
                        v-model="setting_store_cancel.one_day_ago_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('one_day_ago_percent')"
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("that_day") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <!--ITEM-->
                    <el-form-item class="flex-1">
                      <InputNumberText
                        v-model="setting_store_cancel.that_day_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('that_day_percent')"
                      />
                    </el-form-item>
                  </div>
                  <div class="refund-item d-flex">
                    <p class="label-item">{{ $t("no_contact_cancel") }}</p>
                    <span>{{ $t("reservation_amount") }}</span>
                    <el-form-item class="flex-1">
                      <InputNumberText
                        v-model="setting_store_cancel.no_contact_percent"
                        :precision="PRECISION"
                        :max="100"
                        :accept-null="true"
                        @focusout="handleFocusOut('no_contact_percent')"
                      />
                    </el-form-item>
                  </div>
                </template>
              </div>
            </el-form-item>
            <!--END Cancel Protected-->
            <!--Portal site-->
            <el-form-item
              :label="$t('portal_site')"
              :error="getError('portal_site')"
              prop="portal_site"
            >
              <el-radio-group v-model="formData.portal_site">
                <el-radio :label="1">{{ $t("display") }}</el-radio>
                <el-radio :label="0">{{ $t("no_displayed") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--END Portal site-->
            <!--Status display-->
            <el-form-item
              :label="$t('status_display')"
              :error="getError('status_display')"
              prop="status_display"
            >
              <el-radio-group v-model="formData.status_display">
                <el-radio :label="1">{{ $t("display") }}</el-radio>
                <el-radio :label="0">{{ $t("no_displayed") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--END status display-->
            <!-- GOOGLE-->
            <el-form-item
              v-if="
                storeDetail &&
                storeDetail.status === STATUS_STORE.STORE_STATUS_SETTING_DONE &&
                formData.type_store_id === RESTAURANT
              "
              :label="$t('google_status')"
              class="align-items-center"
            >
              <ClientOnly>
                <el-select
                  v-model="formData.status_setting_google"
                  class="w-100"
                  disabled
                >
                  <el-option
                    v-for="status in arrayStatusGoogle"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="
                storeDetail &&
                storeDetail.status === STATUS_STORE.STORE_STATUS_SETTING_DONE &&
                formData.type_store_id === RESTAURANT
              "
              :label="$t('google_store_status')"
              class="align-items-center"
            >
              <InputText
                :value="
                  getLabelStatusGoogle(
                    storeDetail?.status_setting_google,
                    storeDetail?.is_setting_google
                  )
                "
                disabled=""
              />
            </el-form-item>
            <!--When update-->
            <el-form-item :label="$t('status')" class="align-items-center">
              <ClientOnly>
                <el-select v-model="formData.status" class="w-100" disabled>
                  <el-option
                    v-for="status in StatusStoreOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item :label="$t('created')" class="align-items-center">
              <el-input
                :model-value="
                  formatDate(storeDetail?.created_at, 'YYYY年MM月DD日 HH:mm')
                "
                disabled
                :suffix-icon="IconDate"
              />
            </el-form-item>
            <el-form-item :label="$t('updated')" class="align-items-center">
              <el-input
                :model-value="
                  formatDate(storeDetail?.updated_at, 'YYYY年MM月DD日 HH:mm')
                "
                disabled
                :suffix-icon="IconDate"
              />
            </el-form-item>
            <!--END WORKING DAY-->
          </div>
        </div>
      </el-form>
    </div>
    <ConfirmPlan
      :dialog-visible="isShowModalPlanConfirm"
      @handle-close="handleCloseModalPlan"
      @handle-confirm="handleConfirmModalPlan"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import Search from "~/../../src/store/components/Icon/Search.vue";
import InputFile from "~/../../src/shared/components/input/File.vue";
import SelectTag from "~/../../src/shared/components/input/SelectTag.vue";
import TimeRanger from "~/../../src/shared/components/input/TimeRanger.vue";
import MultiDate from "~/../../src/shared/components/input/MultiDate.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import InputCoordinate from "~/../../src/shared/components/input/InputCoordinate.vue";

import { WORKING_DAYS } from "~/../../src/shared/constants/reservation";
import {
  arrayOpenTime,
  DEFAULT_TIME,
  HYPERTEXT,
  STATUS_STORE,
  StatusStoreOptions,
  arrayStatusGoogle,
  getLabelStatusGoogle,
} from "~/../../src/shared/constants";
import {
  MAX_LENGTH_DEFAULT,
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_DESCRIPTION,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_STORE_NAME,
  MAX_LENGTH_TEXTAREA,
  MAX_LENGTH_AGENT_CODE,
} from "~/../../src/shared/utils/validate";
import IconDate from "~/../../src/admin/components/Icon/IconDate.vue";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { FormInstance, UploadProps } from "element-plus";
import { ImageUpload } from "~/../../src/shared/models";
import MODEL_TYPE from "~/../../src/shared/constants/modelType";
import { StoreInterface, TagInterface } from "~/../../src/store/models";
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { ruleStore } from "~/../../src/store/validates/ruleStore";
import {
  useChangeImage,
  useRemoveImage,
  useSearchAddress,
  useSetDataCancelProtected,
  useSetDataInformationStore,
} from "~/../../src/store/mixins/storeMixin";
import TagRequest from "~/../../src/shared/requests/TagRequest";
import {
  customTrimValue,
  formatDate,
  formatInputKatakana,
} from "~/../../src/shared/utils";
import { useMeStore } from "~/../../src/shared/stores/me";
import {
  updateSuccess,
  updateError,
  messageError,
} from "~/../../src/shared/utils/notification";
import { exportFile } from "~/../../src/shared/utils";
import { dataTypeStore } from "~/../../src/shared/constants/category";
import { useRouter } from "#imports";
import useAssetsFile from "~/../../src/store/composables/useAssetsFile";
import ImageTextDescription from "~/../../src/shared/components/ImageTextDescription.vue";
import { LIMIT_CATEGORY_STORE } from "~/../../src/shared/constants/typeStore";
import { maxImagePlanType } from "~/../../src/shared/constants";
import ConfirmPlan from "~/../../src/shared/components/modal/ConfirmPlan.vue";
import { format24HoursTo23Hours59Min } from "~/../../src/shared/utils";
import { useRuntimeConfig } from "#app";
import MapRequest from "~/../../src/shared/requests/MapRequest";
import { RESTAURANT } from "~/../../src/shared/constants/category";

const meStore = useMeStore();
const PRECISION = ref(2);
const MAX_PRICE = ref(1_000_000);
const router = useRouter();

const storeDetail = ref<StoreInterface | null>(null);
const tags = ref<TagInterface[]>([]);
const checkListTimeHoliday = ref([]);
const isHoliday = ref(false);
const isSubmitPreview = ref(false);
const multiSelectDate = ref<string[]>([]);
const loadingSearch = ref(false);
const loadingExport = ref(false);
const loadingAvatar = ref(false);
const imagesUpload = ref<ImageUpload[]>([]);
const limitImage = ref(meStore.getMaxImageByPlanStoreTop);
const errorsForm = ref({});
const _formRef = ref();
const isLoadingAction = ref(false);
const isShowModalPlanConfirm = ref(false);
const loadingBlock2 = ref(false);
const loadingBlock3 = ref(false);
const loadingBlock4 = ref(false);
const islandList = ref([]);
const districtList = ref([]);
const consciousList = ref([]);
const villageList = ref([]);
const isMounted = ref(false);

const formData = reactive({
  type_store_id: null,
  agent_code: "",
  name: "",
  first_company_name: "",
  last_company_name: "",
  first_company_name_kana: "",
  last_company_name_kana: "",
  introduction: "",
  description: "",
  cancellation: "",
  email: "",
  email_for_notification_reception: "",
  phone_number: "",
  postal_code: "",
  link_google_map: "",
  iframe_google_map: "",
  latitude: "",
  longitude: "",
  area: "",
  address: "",
  address_detail: "",
  tag: [],
  note: "",
  news: "",
  home_page: "",
  comment_opening_time: "",
  transportation: "",
  image_id: [],
  images: [],
  opening_times: JSON.parse(JSON.stringify(arrayOpenTime)),
  closing_times: [],
  setting_store_cancel: {
    seven_day_to_two_day_ago_percent: 0,
    one_day_ago_percent: 0,
    that_day_percent: 0,
    no_contact_percent: 0,
  },
  is_setting_cancel: false,
  status_display: 1,
  portal_site: 1,
  status: STATUS_STORE.STORE_STATUS_SETTING,
  created_at: "",
  updated_at: "",
  operating_officer_first_name: "",
  operating_officer_last_name: "",
  operational_manager_first_name: "",
  operational_manager_last_name: "",
  price_range: "",
  delivery_time: "",
  timing_and_method: "",
  necessary_expenses: "",
  handling_returned: "",
  handling_defective: "",
  island_id: null,
  district_id: null,
  conscious_id: null,
  village_id: null,
  method_of_payment: null,
  status_setting_google: null,
});

const getBlock1 = async () => {
  islandList.value = (await MapRequest.getIslands()).data;
};

const handleChangeBlock1 = async (id: number, onMouted: boolean) => {
  try {
    if (!onMouted) {
      formData.conscious_id = null;
      formData.district_id = null;
      formData.village_id = null;
    }

    loadingBlock2.value = true;
    districtList.value = (await MapRequest.getDistricts(id)).data;
  } catch (e) {
  } finally {
    loadingBlock2.value = false;
  }
};

const handleChangeBlock2 = async (id: number, onMounted: boolean) => {
  try {
    loadingBlock3.value = true;
    if (!onMounted) {
      formData.conscious_id = null;
      formData.village_id = null;
    }
    consciousList.value = (await MapRequest.getConsciouses(id)).data;
  } catch (e) {
  } finally {
    loadingBlock3.value = false;
  }
};

const handleChangeBlock3 = async (id: number, onMounted: boolean) => {
  try {
    loadingBlock4.value = true;
    if (!onMounted) {
      formData.village_id = null;
    }
    villageList.value = (await MapRequest.getVillages(id)).data;
  } catch (e) {
  } finally {
    loadingBlock4.value = false;
  }
};

const setting_store_cancel = reactive({
  seven_day_to_two_day_ago_percent: 0,
  one_day_ago_percent: 0,
  that_day_percent: 0,
  no_contact_percent: 0,
});

const optionRefund = reactive({
  seven_day_to_two_day_ago: false,
  one_day_ago: false,
  that_day: false,
  no_contact: false,
});

//Default active
const arrayCheckDayOff = ref([1, 1, 1, 1, 1, 1, 1]);

const handleExportCSV = async () => {
  try {
    loadingExport.value = true;
    const res: any = await StoreRequest.exportLaw();
    if (res) {
      exportFile(res, "S006_特定商取引法の表示");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    loadingExport.value = false;
  }
};

const handleCloseModalPlan = () => {
  isShowModalPlanConfirm.value = false;
};

const handleConfirmModalPlan = () => {
  router.push({ name: "plan" });
  isShowModalPlanConfirm.value = false;
};

const getOpenTimeOfDay = (day: number) => {
  return formData.opening_times.filter((item) => item.day_of_week === day);
};

const addWorkingTime = (day) => {
  formData.opening_times.push({
    day_of_week: day,
    start: DEFAULT_TIME.START_TIME,
    end: DEFAULT_TIME.END_TIME,
  });
};

const resetSettingCancel = () => {
  setting_store_cancel.seven_day_to_two_day_ago_percent = null;
  setting_store_cancel.one_day_ago_percent = null;
  setting_store_cancel.that_day_percent = null;
  setting_store_cancel.no_contact_percent = null;
  optionRefund.seven_day_to_two_day_ago = false;
  optionRefund.one_day_ago = false;
  optionRefund.no_contact = false;
  optionRefund.that_day = false;
};

const findIndexWorkingTime = (day, index) => {
  const time = getOpenTimeOfDay(day)[index];
  return formData.opening_times.findIndex((item) => item === time);
};

const deleteWorkingTime = (day, index) => {
  const indexTime = findIndexWorkingTime(day, index);
  indexTime > -1 && formData.opening_times.splice(indexTime, 1);
};

const changeWorkingDay = (value, day) => {
  if (value) {
    checkListTimeHoliday.value.push(day);
    formData.opening_times = formData.opening_times.filter(
      (item) => item.day_of_week !== day
    );
  } else {
    const index = checkListTimeHoliday.value.findIndex((item) => item === day);
    index > -1 && checkListTimeHoliday.value.splice(index, 1);
    formData.opening_times.push({
      day_of_week: day,
      start: DEFAULT_TIME.START_TIME,
      end: DEFAULT_TIME.END_TIME,
    });
  }
};

const getError = (field: string) => {
  return errorsForm.value[field]?.[0];
};

const handleRemoveImage: UploadProps["onRemove"] = async (
  file: ImageUpload,
  fileList
) => {
  await useRemoveImage(file, fileList, formData, imagesUpload);
};

const handleImageChange: UploadProps["onChange"] = async (file, fileList) => {
  await useChangeImage(file, fileList, imagesUpload, loadingAvatar);
};

const handleSearchAddress = () => {
  useSearchAddress(formData, loadingSearch);
};

const filterDataTypeStore = computed(() => {
  //TODO: phase 1
  return dataTypeStore.filter((item) => LIMIT_CATEGORY_STORE.includes(item.id));
});

const UpdateStore = async (form: FormInstance | undefined) => {
  errorsForm.value = {};
  formData.closing_times = isHoliday.value
    ? multiSelectDate.value.map((item) => ({
        day_off: item,
      }))
    : [];
  formData.image_id = imagesUpload.value.map((item) => item.id);

  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        if (!formData.is_setting_cancel) {
          resetSettingCancel();
        }
        useSetDataCancelProtected(formData, setting_store_cancel);

        const params = {
          agent_code: formData.agent_code,
          address: formData.address,
          address_detail: formData.address_detail,
          cancellation: formData.cancellation,
          closing_times: formData.closing_times,
          comment_opening_time: formData.comment_opening_time,
          created_at: formData.created_at,
          description: formData.description,
          email: formData.email,
          email_for_notification_reception:
            formData.email_for_notification_reception,
          first_company_name: formData.first_company_name,
          first_company_name_kana: formData.first_company_name_kana,
          home_page: formData.home_page,
          link_google_map: formData.link_google_map,
          iframe_google_map: formData.iframe_google_map,
          latitude: formData.latitude,
          longitude: formData.longitude,
          image_id: formData.image_id,
          introduction: formData.introduction,
          is_setting_cancel: formData.is_setting_cancel,
          last_company_name: formData.last_company_name,
          last_company_name_kana: formData.last_company_name_kana,
          name: formData.name,
          news: formData.news,
          note: formData.note,
          opening_times: format24HoursTo23Hours59Min(
            JSON.parse(JSON.stringify(formData.opening_times)),
            "start",
            "end"
          ),
          phone_number: formData.phone_number,
          portal_site: formData.portal_site,
          postal_code: formData.postal_code,
          area: formData.area,
          setting_store_cancel: formData.setting_store_cancel,
          status: formData.status,
          status_display: formData.status_display,
          tag: formData.tag,
          transportation: formData.transportation,
          type_store_id: formData.type_store_id,
          updated_at: formData.updated_at,
          operating_officer_first_name: formData.operating_officer_first_name,
          operating_officer_last_name: formData.operating_officer_last_name,
          operational_manager_first_name:
            formData.operational_manager_first_name,
          operational_manager_last_name: formData.operational_manager_last_name,
          price_range: formData.price_range,
          delivery_time: formData.delivery_time,
          timing_and_method: formData.timing_and_method,
          necessary_expenses: formData.necessary_expenses,
          handling_returned: formData.handling_returned,
          handling_defective: formData.handling_defective,
          island_id: formData.island_id,
          district_id: formData.district_id,
          conscious_id: formData.conscious_id,
          village_id: formData.village_id,
          method_of_payment: formData.method_of_payment,
          status_setting_google: formData.status_setting_google,
        };

        storeDetail.value = (
          await StoreRequest.put<StoreInterface>(storeDetail.value.id, {
            ...customTrimValue(params),
            store_manager_id: storeDetail.value.store_manager_id,
          })
        )?.data;
        meStore.info.store = storeDetail.value;
        meStore.setAvatar({
          url: storeDetail.value?.model_has_file?.[0]?.file?.url || "",
          id: storeDetail.value?.model_has_file?.[0]?.file.id || -1,
          fileType:
            storeDetail.value?.model_has_file?.[0]?.file.url.split(".").pop() ||
            "",
        });
        // re-make data tags
        await getListTags();
        //Update type after change type store
        meStore.typeStore = formData.type_store_id;
        formData.closing_times = storeDetail.value.closing_times.map(
          (item) => ({
            day_off: item.day_off,
          })
        );
        isHoliday.value = !!formData.closing_times.length;
        multiSelectDate.value = formData.closing_times.map(
          (item: any) => item.day_off
        );
        updateSuccess();
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorsForm.value = e.data.errors;
          updateError();
        } else if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
          isShowModalPlanConfirm.value = true;
        } else {
          updateError();
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const previewStore = async (form: FormInstance | undefined) => {
  if (!form) return;
  formData.closing_times = isHoliday.value
    ? multiSelectDate.value.map((item) => ({
        day_off: item,
      }))
    : [];
  formData.images = imagesUpload.value.map((item) => item);

  await form.validate(async (valid) => {
    if (valid) {
      try {
        isSubmitPreview.value = true;
        if (!formData.is_setting_cancel) {
          resetSettingCancel();
        }
        useSetDataCancelProtected(formData, setting_store_cancel);

        const params = {
          closing_times: formData.closing_times,
          comment_opening_time: formData.comment_opening_time,
          description: formData.description,
          images: formData.images,
          introduction: formData.introduction,
          news: formData.news,
          name: formData.name,
          opening_times: format24HoursTo23Hours59Min(
            JSON.parse(JSON.stringify(formData.opening_times)),
            "start",
            "end"
          ),
          phone_number: formData.phone_number,
          tag: formData.tag,
          transportation: formData.transportation,
        };

        const dataPreview = {
          data: params,
        };

        //post data preview
        await StoreRequest.postDataPreview(dataPreview);

        //next preview
        const storeCode = meStore?.info?.store?.code;
        const config = useRuntimeConfig();
        window.open(
          `${config.urlCustomer}store/${storeCode}?is_preview=true`,
          "_blank"
        );
      } catch (e) {
      } finally {
        isSubmitPreview.value = false;
      }
    }
  });
};

const handleFocusOut = (field: string) => {
  if (!setting_store_cancel[field]) {
    setting_store_cancel[field] = "0";
  }
};

defineExpose({
  UpdateStore,
  previewStore,
  isLoadingAction,
  isSubmitPreview,
  loadingAvatar,
  _formRef,
});

const getListTags = async () => {
  tags.value = (
    await TagRequest.getAllTagByStore<TagInterface[]>(meStore.getTypeStore)
  )?.data;
};

onBeforeMount(async () => {
  if (meStore.info?.store?.id) {
    try {
      await getListTags();
      storeDetail.value = (
        await StoreRequest.show<StoreInterface>(meStore.info?.store?.id)
      )?.data;
    } catch (_) {
      await router.push({ name: "index" });
    }
  }

  useSetDataInformationStore(
    storeDetail,
    formData,
    imagesUpload,
    isHoliday,
    multiSelectDate,
    arrayCheckDayOff,
    setting_store_cancel,
    optionRefund
  );
  if (formData?.island_id) {
    handleChangeBlock1(formData.island_id, true);
  }

  if (formData?.district_id) {
    handleChangeBlock2(formData.district_id, true);
  }

  if (formData?.conscious_id) {
    handleChangeBlock3(formData.conscious_id, true);
  }
  await getBlock1();
  isMounted.value = true;
});
</script>

<style lang="scss" scoped>
@import "~/../../src/admin/assets/scss/variables.scss";

:deep(.el-input) {
  min-height: 40px;
}

:deep(.el-form-item__error--inline) {
  margin-left: 0;
}

.main-form {
  height: 100%;

  .form-data {
    display: flex;
    gap: 90px;

    :deep(.el-form-item__label) {
      line-height: 20px;
    }
  }

  .el-form {
    .right,
    .left {
      flex: 1;
    }

    .left {
      .company {
        width: 100%;

        .mb-12 {
          margin-bottom: 12px;
        }
      }

      .email-notice {
        .required-field {
          width: 100px;
          margin-right: 80px;
        }

        p {
          display: inline-block;
          width: 100px;
          margin-right: 80px;
          line-height: 20px;
        }

        .input-email {
          width: calc(100% - 180px);
        }

        :deep(.el-form-item__error--inline) {
          margin-left: 180px;
        }

        .el-input {
          flex: 1;
        }
      }

      .post-code {
        gap: 12px;
      }

      .text-guide {
        width: 98px;
      }

      :deep(.block-address) {
        .el-select {
          width: calc(100% - 160px);
        }
      }

      :deep(.input-map) {
        & > .el-form-item__content {
          flex-wrap: nowrap;
        }

        .form-item-map {
          & > .el-form-item__content {
            flex-direction: column;
            align-items: flex-start;

            .input {
              width: 100%;
            }

            .el-form-item__error.el-form-item__error--inline {
              margin: 0;
            }
          }
        }
      }

      :deep(.image) {
        align-items: flex-start;

        .image-description {
          margin-top: 10px;
        }

        .el-form-item__label {
          height: auto;
          align-items: center;
        }

        .el-form-item__content {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      :deep(.el-select) {
        .el-popper {
          &.is-pure {
            width: 100%;
          }
        }
      }
    }

    .right {
      :deep(.domain) {
        .el-input-group__prepend {
          color: $black-90;
          background: $gray-80;
        }
      }

      .business-hours {
        width: 100%;
        display: flex;
        gap: 20px;

        .day {
          display: flex;
          align-items: center;
          gap: 21px;
          height: 40px;

          &.holiday {
            width: 113px;
            justify-content: space-between;
          }
        }

        .hours {
          flex: 1;
          gap: 4px;

          .add-time {
            gap: 8px;
            color: $menuBg;
            font-weight: 500;
            height: 40px;
            max-width: 53px;
            width: 100%;
          }

          .delete-time {
            color: $red-100;
            font-weight: 500;
            max-width: 80px;
            width: 100%;

            & > div {
              gap: 10px;
            }
          }
        }

        .multi-holiday {
          flex: 1;
        }

        .custom-multi-date {
          width: 100%;
          min-height: 40px;

          .delete-time {
            max-width: 80px;
            width: 100%;
          }
        }

        &.memo {
          margin-top: 10px;
          gap: 35px;
        }
      }

      .cancel-protected {
        .label {
          align-self: flex-start;
          margin-right: 54px;
          line-height: 20px;
        }

        .refund {
          width: calc(100% - 180px);
          display: flex;
          flex-direction: column;
          gap: 20px;

          .refund-item {
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;

            .label-item {
              margin: 0;
              width: 112px;
            }

            .money {
              width: 78px;
            }

            .percent {
              width: 120px;
            }

            :deep(.custom-input-price) {
              flex: 1;
              min-width: 120px;
            }

            :deep(.custom-input-number) {
              flex: 1;
              min-width: 120px;
            }

            .el-radio-group {
              gap: 20px;
            }

            .el-radio {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
