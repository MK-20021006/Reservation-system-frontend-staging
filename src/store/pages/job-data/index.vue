<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("title_screen.jod_data_store") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="menu-header">
            <div>{{ $t("title_screen.jod_data_store") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            :model="formSearch"
            label-position="left"
            inline
            class="custom-form"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('status')">
              <ClientOnly>
                <el-select
                  v-model="formSearch.status"
                  placeholder=" "
                  :default-first-option="true"
                >
                  <el-option :label="$t('all')" value="" />
                  <el-option
                    v-for="item in statusJobOption"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </ClientOnly>
            </el-form-item>
            <ButtonSearch
              :name="$t('button_search')"
              width="128px"
              @click="handleSearch"
            />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <el-table
          v-loading="loading"
          class="table-content"
          :data="tableData"
          border
          max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
          cell-class-name="text-row-2"
          :default-sort="defaultSort"
          :empty-text="noData"
          @sort-change="headerSort"
        >
          <el-table-column width="100px" :label="$t('order')" type="index" />
          <el-table-column
            min-width="180px"
            :label="$t('crawler_site')"
            prop="crawl_site"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>{{ getNameCrawler(scope.row.crawl_site) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" :label="$t('confirmation')">
            <template #default="scope">
              <div v-if="scope.row.status === STATUS_JOB_FAILED">
                <span v-if="scope.row.is_seen === STATUS.NOT_SEEN">
                  <el-checkbox
                    :model-value="scope.row.is_seen"
                    :false-label="0"
                    :true-label="1"
                    @change="isConfirmJobFailed(scope.row.id, STATUS.IS_SEEN)"
                    >{{ $t("unconfirmed") }}</el-checkbox
                  >
                </span>
                <span v-else>
                  <el-checkbox
                    :model-value="scope.row.is_seen"
                    :false-label="0"
                    :true-label="1"
                    @change="isConfirmJobFailed(scope.row.id, STATUS.NOT_SEEN)"
                    >{{ $t("confirmed") }}</el-checkbox
                  >
                </span>
              </div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('processing_list')"
            prop="type"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{
                  findObj(typeBookingNameCrawl, "value", scope.row.type)?.label
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('booking_id')"
            prop="type"
          >
            <template #default="scope">
              <span
                class="text-link text-underline cursor-pointer form-item-time height-40 flex"
                @click="backPageReservation(numberBooking(scope.row.source))"
              >
                {{ numberBooking(scope.row.source) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('created_at')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.created_at, "YYYY年MM月DD日 HH:mm") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('updated_at')"
            prop="updated_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="left"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.updated_at, "YYYY年MM月DD日 HH:mm") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('status')"
            prop="status"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{
                  $t(findObj(statusJobOption, "value", scope.row.status).label)
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <CommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.defaultRecord"
            :total="pagination.total"
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { formatDate } from "~~/../../src/shared/utils/format";
import { ref, onBeforeMount, reactive, computed } from "vue";
import { STORE_PAGINATION } from "~/../../src/shared/constants/pagination";
import ButtonSearch from "~/../../src/shared/components/button/Search";
import { SORT_ORDER } from "~~/../../src/shared/constants";
import { STATUS } from "~/../../src/shared/constants/seen";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { getTypeSort } from "~/../../src/shared/utils";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  statusJobOption,
  typeBookingNameCrawl,
} from "~/../../src/shared/constants";
import { findObj } from "~/../../src/shared/utils";
import JobRequest from "~/../../src/shared/requests/JobRequest";
import { JobInterface } from "~/../../src/store/models/job";
import { getNameCrawler } from "~/../../src/shared/utils/crawl";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { STATUS_JOB_FAILED } from "~/../../src/shared/constants";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useRouter } from "nuxt/app";

useHasTypeStore([RESTAURANT, SALON]);
const { t } = i18n.global;
const loading = ref(false);
const isDisabledSeenJob = ref(true);
const tableData = ref<JobInterface[]>([]);
const noData = ref(t("no_data"));
const formSearch = reactive({
  status: "",
});

const router = useRouter();
const meStore = useMeStore();
const pagination = reactive({
  currentPage: 1,
  total: 0,
  defaultRecord: STORE_PAGINATION.PER_PAGE,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const backPageReservation = (id: number) => {
  if (id) {
    router.push({ name: "reservation-detail-id", params: { id: id } });
  }
};

const isJSON = (str: string) => {
  try {
    return !!str && JSON.parse(str);
  } catch (e) {
    return false;
  }
};

const numberBooking = (value: string) => {
  if (value && isJSON(value) && JSON.parse(value)?.bookingId) {
    return JSON.parse(value).bookingId;
  }
  return "";
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  getListJob();
};

const handleSizeChange = (val: number) => {
  pagination.defaultRecord = val;
  pagination.currentPage = 1;
  getListJob();
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  loading.value = true;
  await getListJob();
  loading.value = false;
};

const handleSearch = async () => {
  loading.value = true;
  pagination.currentPage = 1;
  await getListJob();
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
  loading.value = false;
};

const getListJob = async () => {
  loading.value = true;
  const params = {
    ...formSearch,
    ...sortTable,
    limit: pagination.defaultRecord,
    page: pagination.currentPage,
  };
  const data = (await JobRequest.list<JobInterface[]>(params)).data;
  tableData.value = data.data;
  pagination.total = data.pagination.total;
  pagination.currentPage = data.pagination.current_page;
  loading.value = false;
};
const isConfirmJobFailed = async (id: number, value: number) => {
  if (isDisabledSeenJob.value) {
    isDisabledSeenJob.value = false;
    const indexIdJob = tableData.value.findIndex((item) => item.id === id);
    if (indexIdJob !== -1) {
      try {
        const params = {
          jobs: [
            {
              id: id,
              is_seen: value,
            },
          ],
        };
        await JobRequest.post(params);
        tableData.value[indexIdJob].is_seen = value;
        await meStore.updateTotalJodFailed();
      } catch (error) {}
    }
    isDisabledSeenJob.value = true;
  }
};

onBeforeMount(() => {
  getListJob();
});
</script>
