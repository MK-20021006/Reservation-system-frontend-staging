<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.review_customer") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.review_customer") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            inline
            class="form-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('status')">
              <client-only>
                <el-select v-model="formSearch.status" :placeholder="$t('all')">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in statusReviewOption"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('commenter')">
              <InputText
                v-model="formSearch.customer_name"
                :placeholder="$t('placeholder.enter_author')"
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item :label="$t('comment')">
              <InputText
                v-model="formSearch.review_content"
                :placeholder="$t('placeholder.enter_comment')"
                :width="'194px'"
              />
            </el-form-item>
            <ButtonSearch :loading="isLoadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
      <div class="custom-table">
        <client-only>
          <el-table
            v-loading="isLoadingTable"
            class="table-content"
            :data="tableData"
            border
            row-class-name="table-row"
            header-row-class-name="table-header"
            max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
            cell-class-name="text-row-2"
            :empty-text="noData"
            @sort-change="headerSort"
          >
            <el-table-column
              width="100px"
              :label="$t('order')"
              type="index"
              :index="columnIndex"
            />
            <el-table-column
              :label="$t('status')"
              class="column-point"
              width="130px"
              prop="status"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{ getStatusReview(scope.row.status) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('nick_name')"
              class="column-point"
              min-width="160px"
              prop="nickname"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.nickname }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('gender')"
              class="column-point"
              min-width="120px"
              prop="gender"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{
                    findObj(genderOptions, "value", scope.row.gender)
                      ? $t(
                          findObj(genderOptions, "value", scope.row.gender)
                            .label
                        )
                      : ""
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('era')"
              class="column-point"
              min-width="120px"
              prop="age"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{
                    findObj(ageOptions, "value", scope.row.age)
                      ? $t(findObj(ageOptions, "value", scope.row.age).label)
                      : ""
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('title_keyword')"
              class="column-point"
              min-width="120px"
              prop="title"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('comment')"
              class="column-point"
              min-width="266px"
              prop="content"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span> {{ scope.row.content }} </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('reply')"
              class="column-point"
              width="266px"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.reply?.content }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('posted_date')"
              class="column-point"
              width="200px"
              prop="created_at"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span>{{
                  formatDate(scope.row.created_at, "YYYY年MM月DD日 HH:mm")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('contributor')"
              class="column-point"
              width="150px"
              prop="reviewer_name"
              :sortable="true"
              :sort-orders="['ascending', 'descending']"
            >
              <template #default="scope">
                <span class="ellipsis">
                  {{ scope.row.customer?.fullname }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="$t('action')"
              width="110px"
              align="center"
            >
              <template #default="scope">
                <IconReplyIsSeen
                  v-if="
                    scope.row.status === IS_REPLY_REVIEW ||
                    scope.row.status === STATUS.IS_SEEN
                  "
                  class="btn-reply"
                  @click="viewReviewStoreReply(scope.row)"
                />
                <IconReply
                  v-else
                  class="btn-reply"
                  @click="viewReviewStoreReply(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <client-only>
        <ModalViewData
          v-if="rowDataReview"
          :dialog-visible="dialogVisibleView"
          :data-review="rowDataReview"
          @handle-close-view="handleCloseView"
          @get-data-review="getDataReviewStore"
        />
      </client-only>
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <CommonPagination
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
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
import { onMounted, reactive, ref } from "vue";
import ReviewRequest from "~/../../src/shared/requests/ReviewRequest";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import InputText from "../../../shared/components/input/InputText.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { STORE_PAGINATION } from "~/../../src/shared/constants";
import { SORT_ORDER } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { Review } from "~/../../src/store/models/review";
import { statusReviewOption } from "~/../../src/shared/constants";
import { STATUS } from "~/../../src/shared/constants/seen";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { IS_REPLY_REVIEW } from "~/../../src/shared/constants/status";
import { customIndex } from "~/../../src/shared/utils";
import { genderOptions, ageOptions } from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils";

const { t } = i18n.global;
const tableData = ref([]);
const isLoadingTable = ref(true);
const isLoadingSearch = ref(false);
const idDelete = ref(null);
const rowDataReview = ref({});
const dialogVisibleView = ref(false);
const noData = ref(t("no_data"));
const formSearch = reactive({
  status: null,
  customer_name: null,
  review_content: null,
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: STORE_PAGINATION.PER_PAGE,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const handleCloseView = () => {
  idDelete.value = null;
  dialogVisibleView.value = false;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getDataReviewStore();
    if (!tableData.value.length) {
      noData.value = t("no_result");
    }
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const getStatusReview = (status: number) => {
  if (status === STATUS.NOT_SEEN) {
    return t("not_seen");
  }
  if (status === STATUS.IS_SEEN) {
    return t("no_reply");
  }
  if (status === IS_REPLY_REVIEW) {
    return t("reply_review");
  }
};

const viewReviewStoreReply = (data: object) => {
  rowDataReview.value = data;
  seenReview(data);
  dialogVisibleView.value = true;
};

const seenReview = async (reviewItem: object) => {
  const indexIdReview = tableData.value.findIndex(
    (item) => item.id === reviewItem.id
  );
  const isSeen = tableData.value[indexIdReview]?.status;
  if (indexIdReview !== -1 && isSeen === STATUS.NOT_SEEN) {
    const data = await ReviewRequest.readReview(reviewItem.id);
    if (data.status_code === STATUS_CODE.SUCCESS) {
      tableData.value[indexIdReview].status = STATUS.IS_SEEN;
    }
  }
};

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.DESC,
});

const handleCurrentChange = async (val: number) => {
  pagination.currentPage = val;
  try {
    isLoadingTable.value = true;
    await getDataReviewStore();
  } finally {
    isLoadingTable.value = false;
  }
};

const handleSizeChange = (val) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getDataReviewStore();
};

const headerSort = async ({ prop, order }: { prop: string; order: string }) => {
  sortTable.order_by = prop;
  if (order === "ascending") {
    sortTable.direct = SORT_ORDER.ASC;
  } else {
    sortTable.direct = SORT_ORDER.DESC;
  }
  pagination.currentPage = 1;
  isLoadingTable.value = true;
  await getDataReviewStore();
  isLoadingTable.value = false;
};

const getDataReviewStore = async () => {
  try {
    isLoadingTable.value = true;
    const reviewStoreResponse = await ReviewRequest.list<Review[]>({
      ...formSearch,
      ...sortTable,
      page: pagination.currentPage,
      limit: pagination.numberRecordPerPage,
    });

    tableData.value = reviewStoreResponse.data
      ? reviewStoreResponse.data.data
      : [];
    pagination.total = reviewStoreResponse.data.pagination?.total;
    pagination.currentPage = reviewStoreResponse.data.pagination?.current_page;
    pagination.numberRecordPerPage =
      reviewStoreResponse.data.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  await getDataReviewStore();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.select-industry .el-form-item__content) {
  width: 160px;

  input {
    height: 40px;
  }
}

:deep(.search) .el-input {
  width: 222px;
}

:deep(.box__input-date) .el-input {
  width: 170px;
}

.icon-button {
  margin-right: 15px;
  margin-left: 5px;
  cursor: pointer;
}

.btn-reply {
  margin-right: 16px;
}

.btn-reply,
.btn-seen {
  cursor: pointer;
}
</style>
