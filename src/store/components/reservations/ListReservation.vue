<template>
  <ListScreenComponent class="booking-list">
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("reservations") }}</Title>
      </Head>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            inline
            class="form-search"
            @keyup.enter="handleSearch"
          >
            <el-form-item v-if="typeStore === EVENT" :label="$t('event')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.id_event"
                  filterable
                  :placeholder="$t('all')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in eventOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)"
              :label="$t('device_name')"
            >
              <ClientOnly>
                <el-select
                  v-model="formSearch.id_device"
                  filterable
                  :placeholder="$t('all')"
                  :loading="isLoadingDevice"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in deviceOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- START Search for user name or reservation code -->
            <el-form-item :label="$t('keyword_search')">
              <InputText
                v-model="formSearch.key_search"
                :placeholder="$t('name_reservation_code')"
                :width="'194px'"
              />
            </el-form-item>
            <!-- END Search for user name or reservation code -->
            <!-- START reservation status -->
            <el-form-item :label="$t('store.reservation_status')">
              <ClientOnly>
                <el-select v-model="formSearch.status">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in reservationStatusOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END reservation status -->
            <!-- START Payment status -->
            <el-form-item :label="$t('payment_status')">
              <ClientOnly>
                <el-select v-model="formSearch.status_payment">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in paymentStatusBookingOptions"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="[RESTAURANT, SALON].includes(typeStore)"
              :label="$t('site_name') + $t('situation')"
            >
              <ClientOnly>
                <el-select v-model="formSearch.status_arxia">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in statusJobBookingCrawl"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="typeStore === RESTAURANT"
              :label="$t('eating_log') + $t('situation')"
            >
              <ClientOnly>
                <el-select v-model="formSearch.status_tabelog">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in statusJobBookingCrawl"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="typeStore === SALON"
              :label="$t('store.hot_pepper_beauty') + $t('situation')"
            >
              <ClientOnly>
                <el-select v-model="formSearch.status_hotpepper_beauty">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in statusJobBookingCrawl"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="typeStore === RESTAURANT"
              :label="$t('hot_pepper_gourmet') + $t('situation')"
            >
              <ClientOnly>
                <el-select v-model="formSearch.status_hotpepper">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in statusJobBookingCrawl"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <el-form-item
              v-if="typeStore === RESTAURANT"
              :label="$t('store.gurunavi') + $t('situation')"
            >
              <ClientOnly>
                <el-select v-model="formSearch.status_grunavi">
                  <el-option :value="null" :label="$t('all')" />
                  <el-option
                    v-for="item in statusJobBookingCrawl"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <!-- END Payment status -->
            <ButtonSearch
              :loading="isLoadingSearch"
              :name="$t('button_search')"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <!-- START custom table -->
      <div class="custom-table">
        <el-table
          v-loading="isLoadingTable"
          class="table-content"
          :data="bookingList"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 40px - 10px - 20px - 34px - 16px - 58px - 72px)"
          cell-class-name="text-row-2"
          :empty-text="noData"
          :default-sort="defaultSort"
          :row-class-name="tableRowClassName"
          @sort-change="headerSort"
        >
          <!-- START reservation code -->
          <el-table-column
            min-width="120px"
            :label="$t('reservation_number')"
            prop="reservation_code"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column width="120px" :label="$t('crawler_site')">
            <template #default="scope">
              <span>{{ getNameCrawler(scope.row.crawl_site) }}</span>
            </template>
          </el-table-column>
          <!-- END reservation code -->
          <!-- START order name -->
          <el-table-column
            min-width="150px"
            :label="$t('customer_name2')"
            prop="order_name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row?.order_name }} </span>
              <span v-if="scope.row?.order_name_kana">
                ({{ scope.row?.order_name_kana }})</span
              >
            </template>
          </el-table-column>
          <!-- END order_name -->
          <!-- START situation -->
          <el-table-column width="190px" :label="$t('situation')" prop="status">
            <template #default="scope">
              {{ getSituation(scope.row) }}
            </template>
          </el-table-column>
          <!-- END situation -->
          <!-- START date of visit -->
          <el-table-column
            width="200px"
            :label="$t('date_of_visit')"
            prop="order_time"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span
                v-if="
                  !GROUP_TYPE_STORE.EVENT.includes(
                    scope.row.store?.model_has_type?.type_id
                  )
                "
              >
                {{
                  formatDate(
                    scope.row?.order_time || "",
                    "YYYY年MM月DD日 HH:mm"
                  )
                }}
              </span>
              <span v-else>
                {{
                  formatDate(scope.row?.event_time?.date) +
                  " " +
                  getLabelTime(
                    scope.row?.event_time?.start,
                    scope.row?.event_time?.end
                  )
                }}
              </span>
            </template>
          </el-table-column>
          <!-- END date of visit -->
          <!-- START Course/Menu name -->
          <el-table-column
            v-if="!GROUP_TYPE_STORE.EVENT.includes(typeStore)"
            min-width="320px"
            :label="
              typeStore !== SALON ? $t('course_name') : $t('course_tab_menu')
            "
          >
            <template #default="scope">
              <span class="ellipsis">
                {{
                  getArrMenuBooking(
                    scope.row.detail?.course?.name,
                    scope.row.detail?.menu_details
                  )
                }}
              </span>
            </template>
          </el-table-column>
          <!-- END Course/Menu name -->
          <!-- START event name -->
          <el-table-column v-else min-width="320px" :label="$t('event')">
            <template #default="scope">
              <span class="ellipsis">
                {{ scope.row.detail?.event?.name }}
              </span>
            </template>
          </el-table-column>
          <!-- END event name -->
          <!-- START Device name -->
          <el-table-column
            v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)"
            min-width="320px"
            :label="$t('device_name')"
          >
            <template #default="scope">
              <span class="ellipsis">
                {{ getDevice(scope.row.booking_devices) }}
              </span>
            </template>
          </el-table-column>
          <!-- END Device name -->
          <!-- START total people -->
          <el-table-column
            min-width="90px"
            :label="$t('number_of_people')"
            prop="total_people"
            align="right"
            header-align="left"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ priceDisplay(scope.row?.total_people) || 0
                }}{{ $t("last_name_kanji") }}</span
              >
            </template>
          </el-table-column>
          <!-- END total people -->

          <!-- START money -->
          <el-table-column
            min-width="120px"
            :label="$t('amount_money')"
            prop="amount"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            header-align="left"
            align="right"
          >
            <template #default="scope">
              <span>
                {{ scope.row.amount > 0 ? priceDisplay(scope.row.amount) : 0
                }}{{ $t("yen") }}</span
              >
            </template>
          </el-table-column>
          <!-- END money -->
          <!-- START payment_type -->
          <el-table-column
            width="180px"
            :label="$t('payment_type')"
            prop="payment_type"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{ getTypePayment(scope.row?.payment_type) }}
            </template>
          </el-table-column>
          <!-- END payment_type -->
          <!-- START status payment -->
          <el-table-column
            width="120px"
            :label="$t('payment.status')"
            prop="status_payment"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              {{ getStatusPayment(scope.row.status_payment) }}
            </template>
          </el-table-column>
          <!-- END status payment -->
          <!-- START order time -->
          <el-table-column
            width="200px"
            :label="$t('reservation_date_Time')"
            prop="order_time"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{
                  formatDate(scope.row?.created_at, "YYYY年MM月DD日 HH:mm")
                }}</span
              >
            </template>
          </el-table-column>
          <!-- END order time -->
          <!-- START user booking -->
          <el-table-column width="90px" :label="$t('author')">
            <template #default="scope">
              {{ getUserBooking(scope.row) }}
            </template>
          </el-table-column>
          <!-- END user booking -->
          <!--  START STATUS ARXIA-->
          <el-table-column
            v-if="[RESTAURANT, SALON].includes(typeStore)"
            width="200px"
            :label="$t('site_name') + $t('situation')"
          >
            <template #default="scope">
              <span>
                {{
                  findObj(
                    statusJobBookingCrawl,
                    "value",
                    scope.row.status_arxia
                  )?.label
                }}
              </span>
            </template>
          </el-table-column>
          <!--  END STATUS ARXIA-->
          <!--  START STATUS TABELOG-->
          <el-table-column
            v-if="typeStore === RESTAURANT"
            width="200px"
            :label="$t('eating_log') + $t('situation')"
          >
            <template #default="scope">
              <span v-if="!crawlGoogle(scope.row)">
                {{
                  findObj(
                    statusJobBookingCrawl,
                    "value",
                    scope.row.status_tabelog
                  )?.label
                }}
              </span>
            </template>
          </el-table-column>
          <!--  END STATUS TABELOG-->
          <!--  START STATUS HOT PAPER-->
          <el-table-column
            v-if="typeStore === RESTAURANT"
            width="200px"
            :label="$t('hot_pepper_gourmet') + $t('situation')"
          >
            <template #default="scope">
              <span v-if="!crawlGoogle(scope.row)">
                {{
                  findObj(
                    statusJobBookingCrawl,
                    "value",
                    scope.row.status_hotpepper
                  )?.label
                }}
              </span>
            </template>
          </el-table-column>
          <!--  END STATUS HOT PAPER-->
          <!--  START STATUS HOT PAPER BEATY-->
          <el-table-column
            v-if="typeStore === SALON"
            width="200px"
            :label="$t('store.hot_pepper_beauty') + $t('situation')"
          >
            <template #default="scope">
              <span v-if="!crawlGoogle(scope.row)">
                {{
                  findObj(
                    statusJobBookingCrawl,
                    "value",
                    scope.row.status_hotpepper_beauty
                  )?.label
                }}
              </span>
            </template>
          </el-table-column>
          <!--  END STATUS HOT PAPER BEATY-->
          <!--  START STATUS GRUNAVI-->
          <el-table-column
            v-if="typeStore === RESTAURANT"
            width="200px"
            :label="$t('store.gurunavi') + $t('situation')"
          >
            <template #default="scope">
              <span v-if="!crawlGoogle(scope.row)">
                {{
                  findObj(
                    statusJobBookingCrawl,
                    "value",
                    scope.row.status_grunavi
                  )?.label
                }}
              </span>
            </template>
          </el-table-column>
          <!--  END STATUS GRUNAVI-->
          <!-- START action -->
          <el-table-column
            width="120px"
            fixed="right"
            :label="$t('edit')"
            class-name="custom-action"
          >
            <template #default="scope">
              <div class="group-action">
                <template
                  v-if="isNotCrawler(scope.row) || crawlGoogle(scope.row)"
                >
                  <icon-edit
                    @click="
                      $router.push({
                        name: 'reservation-detail-id',
                        params: { id: scope.row.id },
                      })
                    "
                  />
                  <icon-sync
                    v-if="
                      isSettingExternalSite &&
                      isCrawlType &&
                      statusConnectExternal
                    "
                    :class="{ 'rotage-btn': dataCrawl.includes(scope.row.id) }"
                    class="icon-sync"
                    @click="syncData(scope.row.id)"
                  />
                </template>
                <template v-else>
                  <icon-view
                    @click="
                      $router.push({
                        name: 'reservation-detail-id',
                        params: { id: scope.row.id },
                      })
                    "
                  />
                  <icon-sync
                    v-if="
                      isSettingExternalSite &&
                      isCrawlType &&
                      statusConnectExternal
                    "
                    :class="{ 'rotage-btn': dataCrawl.includes(scope.row.id) }"
                    class="icon-sync"
                    @click="syncData(scope.row.id)"
                  />
                </template>
              </div>
            </template>
          </el-table-column>
          <!-- END action -->
        </el-table>
      </div>
      <!-- END custom table -->
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  PaymentMethod,
  paymentStatusBookingOptions,
  SORT_ORDER,
  STORE_PAGINATION,
} from "~/../../src/shared/constants";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { useReservation } from "../../store/useReservation";
import { BookingDetail } from "~/../../src/store/models/reservation";
import { formatDate } from "~/../../src/shared/utils/format";
import {
  getSituation,
  exportFile,
  getTypeSort,
  getLabelTime,
} from "~/../../src/shared/utils";
import { Appearance } from "~/../../src/store/constants";
import {
  DATA_USER_BOOKING_FILTER,
  reservationStatusOptions,
  RESERVATION_STATUS,
} from "~/../../src/shared/constants/reservation";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import priceDisplay from "~/../../src/shared/utils/price";
import getCourseMenuBooking from "~/../../src/shared/utils/getCourseMenu";
import InputText from "../../../shared/components/input/InputText.vue";
import ButtonSearch from "../../../shared/components/button/Search.vue";
import {
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import {
  isNotCrawler,
  getNameCrawler,
  crawlGoogle,
} from "~/../../src/shared/utils/crawl";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";
import { EVENT } from "~/../../src/shared/constants/category";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useRoute } from "#imports";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { Device } from "~/../../src/store/models/device";
import DeviceRequest from "~/../../src/shared/requests/DeviceRequest";
import getDevice from "~/../../src/shared/utils/getDevice";
import {
  statusJobBookingCrawl,
  BOOKING_STATUS_CRAWL,
  BOOKING_STATUS_CRAWL_MANUAL,
} from "~/../../src/shared/constants";
import { findObj } from "~/../../src/shared/utils";
import moment from "moment";
import useSettingExternalSite from "~/../../src/store/composables/useSettingExternalSite";
import { TYPE_STORE_HAS_CRAWL } from "~/../../src/shared/constants/typeStore";
import { SITE_TYPE_HOTPEPPER_BEAUTY } from "~/../../src/shared/constants/siteCrawl";

const reservationStore = useReservation();
const { t } = i18n.global;
const isLoadingTable = ref(false);
const noData = ref(t("no_data"));
const dataTableStore = DataTableStore();
const start = ref("");
const end = ref("");
const crawlSite = ref("");
const isLoadingExport = ref(false);
const isLoadingSearch = ref<boolean>(false);
const bookingList = ref<BookingDetail[]>([]);
const eventOptions = ref(reservationStore.getListEvent);
const deviceOptions = ref<Device[]>([]);
const isLoadingEvent = ref(false);
const isLoadingDevice = ref(false);
const route = useRoute();
const statusCrawlBooking = ref(BOOKING_STATUS_CRAWL_MANUAL.BOOKING_NO_CRAWL);
const status = ref(false);
const typeStore = computed(() => {
  return Number(useMeStore().typeStore);
});

const statusConnectExternal = computed(() => {
  return status.value;
});

const isSettingExternalSite = computed(() => {
  return Number(useMeStore().isSettingExternalSite);
});

const getStatusConnect = async () => {
  status.value = await useSettingExternalSite(
    isSettingExternalSite.value,
    typeStore.value
  );
};

const dataCrawl = ref<number[]>([]);
const formSearch = ref({
  id_event: null,
  id_device: null,
  key_search: null,
  status_payment: null,
  status: null,
  status_arxia: null,
  status_grunavi: null,
  status_tabelog: null,
  status_hotpepper: null,
  status_hotpepper_beauty: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: STORE_PAGINATION.PER_PAGE,
});

const isCrawlType = computed(() => {
  return [RESTAURANT].includes(typeStore.value);
});

const sortTable = reactive({
  order_by: "id",
  direct: SORT_ORDER.DESC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const handleSearch = async () => {
  try {
    isLoadingSearch.value = true;
    pagination.currentPage = 1;
    await getListBooking(true);
    addConditionSearchBooking();
    if (!bookingList.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
  }
};

if (route.query?.event_id) {
  formSearch.value.id_event = route.query?.event_id;
}

const getListBooking = async (isSearch?: boolean) => {
  if (reservationStore.appearance === Appearance.list) {
    try {
      isLoadingTable.value = true;
      const paramEvent =
        typeStore.value === EVENT
          ? {
              event_id: isSearch
                ? formSearch.value.id_event
                : route.query?.event_id,
              start_time: isSearch ? "" : route.query?.start_time,
              end_time: isSearch ? "" : route.query?.end_time,
            }
          : {};
      const paramDevice = GROUP_TYPE_STORE.SAME.includes(typeStore.value)
        ? {
            device_id: isSearch
              ? formSearch.value.id_device
              : route.query?.device_id,
          }
        : {};
      const bookingResponse = (
        await BookingRequest.list<BookingDetail[]>({
          ...formSearch.value,
          ...sortTable,
          ...paramEvent,
          ...paramDevice,
          start_date: start.value,
          end_date: end.value,
          crawl_site: crawlSite.value,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        })
      )?.data;
      bookingList.value = bookingResponse?.data;
      pagination.total = bookingResponse?.total;
      pagination.currentPage = bookingResponse?.current_page;
      pagination.numberRecordPerPage = bookingResponse?.per_page;
    } finally {
      isLoadingTable.value = false;
    }
  }
};

const syncData = async (id: number) => {
  let index;
  try {
    index = dataCrawl.value.push(id) - 1;
    await BookingRequest.synchronizedCrawl(id);
    messageSuccess("success.crawl_booking_queue");
  } catch (e: any) {
    if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
    }
  } finally {
    if (index === 0 || !index) {
      dataCrawl.value.splice(index, 1);
    }
  }
};

const addConditionSearchBooking = () => {
  dataTableStore.bookingList = {
    search: formSearch.value,
    currentPage: pagination.currentPage,
    pageSize: pagination.numberRecordPerPage,
    sort: sortTable,
  };
};

const getUserBooking = (booking: BookingDetail) => {
  return DATA_USER_BOOKING_FILTER[booking.type_user_create];
};

const getTypePayment = (type: number) => {
  return PaymentMethod.find((item) => item.value === type)?.label || "";
};

const getStatusPayment = (status: number) => {
  return (
    paymentStatusBookingOptions.find((item) => item.value === status)?.label ||
    ""
  );
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  try {
    isLoadingTable.value = true;
    pagination.currentPage = 1;
    await getListBooking(true);
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleExport = async () => {
  try {
    isLoadingExport.value = true;
    const paramEvent =
      typeStore.value === EVENT
        ? {
            event_id: formSearch.value.id_event,
          }
        : {};
    const paramDevice = GROUP_TYPE_STORE.SAME.includes(typeStore.value)
      ? {
          device_id: formSearch.value.id_device,
        }
      : {};
    const res: any = await BookingRequest.export({
      ...formSearch.value,
      ...paramEvent,
      ...paramDevice,
      start_date: start.value,
      end_date: end.value,
      crawl_site: reservationStore.getCrawlSite,
      ...sortTable,
    });
    if (res) {
      exportFile(res, "S010_予約一覧画面");
    }
  } catch (e) {
    messageError("errors.cannot_export");
  } finally {
    isLoadingExport.value = false;
  }
};

const handleCrawlBookingManual = async (
  start_date: string,
  end_date: string
) => {
  if (!start_date && !end_date) {
    start_date = moment().format("YYYY-MM-DD");
    end_date = moment().add("6", "days").format("YYYY-MM-DD");
  } else if (start_date && !end_date) {
    end_date = moment(start_date).add("6", "days").format("YYYY-MM-DD");
  } else if (!start_date && end_date) {
    start_date = moment(end_date).subtract("6", "days").format("YYYY-MM-DD");
  }
  try {
    await BookingRequest.synchronizedCrawlBooking({
      start_date: start_date,
      end_date: end_date,
    });
    getStatusCrawlBooking();

    messageSuccess("success.crawl_booking_queue");
  } catch (e) {}
};

const getStatusCrawlBooking = async () => {
  try {
    const response = await BookingRequest.getStatusCrawlBooking();
    statusCrawlBooking.value =
      response.data?.status || BOOKING_STATUS_CRAWL_MANUAL.BOOKING_NO_CRAWL;
  } catch (e) {}
};

const tableRowClassName = (row: any, rowIndex: number) => {
  if (row.row.elder_quantity_device) {
    return "booking-max";
  }
  if (
    moment(row.row.order_time, "YYYY-MM-DD HH:mm:ss").isBefore(
      moment().format("YYYY-MM-DD HH:mm:ss")
    ) &&
    row.row.crawl_site === SITE_TYPE_HOTPEPPER_BEAUTY &&
    ![RESERVATION_STATUS.CANCEL, RESERVATION_STATUS.VISITED].includes(
      row.row.status
    )
  ) {
    return "highlight-text";
  }
  return "";
};

const handleSizeChange = async (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  try {
    isLoadingTable.value = true;
    await getListBooking(true);
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getListBooking(true);
    addConditionSearchBooking();
  } finally {
    isLoadingTable.value = false;
  }
};

defineExpose({
  isLoadingTable,
  isLoadingExport,
  handleExport,
  isSettingExternalSite,
  handleCrawlBookingManual,
  isCrawlType,
  statusCrawlBooking,
  statusConnectExternal,
});

watch(
  [() => reservationStore.getActiveTime, () => reservationStore.getViewMode],
  async (value) => {
    [start.value, end.value] = reservationStore.getDateRanger();
    pagination.currentPage = 1;
    await getListBooking(true);
    if (!bookingList.value.length) {
      noData.value = t("no_result");
    }
  }
);

watch(
  () => reservationStore.getCrawlSite,
  async (value: any) => {
    crawlSite.value = value;
    pagination.currentPage = 1;
    await getListBooking(true);
  }
);

watch(
  () => reservationStore.appearance,
  async (value) => {
    if (value === Appearance.list) {
      await getListBooking(true);
    }
  }
);

const getArrMenuBooking = (courseName: string, arrCategory: []) => {
  const arrMenu = [];
  arrCategory?.forEach((category) => {
    arrMenu.push(category.menu);
  });
  return getCourseMenuBooking(courseName, arrMenu);
};

onMounted(async () => {
  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    try {
      isLoadingDevice.value = true;
      isLoadingTable.value = true;
      deviceOptions.value = (await DeviceRequest.getAllData<Device[]>({})).data;
      if (route.query?.device_id) {
        formSearch.value.id_device = route.query?.device_id;
      }
    } catch (e) {
    } finally {
      isLoadingTable.value = false;
      isLoadingDevice.value = false;
    }
  }

  if (dataTableStore.bookingList?.search) {
    formSearch.value = dataTableStore.bookingList.search;
    pagination.currentPage = dataTableStore.bookingList.currentPage;
    pagination.numberRecordPerPage = dataTableStore.bookingList.pageSize;
  }
  if (dataTableStore.bookingList?.sort) {
    sortTable.order_by = dataTableStore.bookingList.sort.order_by;
    sortTable.direct = dataTableStore.bookingList.sort.direct;
  }
  [start.value, end.value] = reservationStore.getDateRanger();
  crawlSite.value = reservationStore.getCrawlSite;

  await getListBooking(false);
  if (
    isSettingExternalSite.value &&
    TYPE_STORE_HAS_CRAWL.includes(typeStore.value)
  ) {
    getStatusCrawlBooking();
    getStatusConnect();
  }
});
</script>

<style lang="scss" scoped>
.booking-list.screen-layout:deep {
  height: calc(100% - 34px - 16px);

  .el-scrollbar.scroll-content {
    height: calc(100% - 36px - 16px);

    .content {
      :deep(.form-search) {
        &.el-form--inline .el-form-item {
          margin-right: 96px;
        }

        .el-input {
          width: 222px;
          margin-right: 0;
        }

        .el-select {
          .el-input {
            width: 134px;
          }
        }
      }
    }
  }
}

:deep(.rotage-btn) {
  transform: rotate(-360deg);
  transition: 1s;
}

:deep(.icon-sync) {
  cursor: pointer;
}

:deep(.group-button) {
  align-items: center;
}

:deep(.booking-max) {
  td {
    .cell {
      color: #d70035;
    }
  }
}

:deep(.highlight-text) {
  td {
    background: #f7f174;
  }
}
</style>
