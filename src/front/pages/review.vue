<template>
  <div class="user-review-container">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("list_review") }}</Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div
      class="header-content d-flex justify-content-between align-items-center"
    >
      <div class="rate-header__total">
        <span class=""
          ><span class="page">{{ from }}～{{ to }}</span> </span
        >{{ $t("view") }} ／ {{ $t("all_rate") }}
        <span class="total">{{ pagination.total }}</span>
        {{ $t("subject_coupon") }}
      </div>
      <div class="form">
        <el-form @submit.enter.prevent>
          <el-form-item
            class="search-rate"
            :label="$t('evaluation_score_search')"
          >
            <el-select v-model="form.star" @change="handleSearchRate">
              <el-option :value="null" :label="$t('all')"></el-option>
              <el-option
                v-for="item in dataRate"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-loading="loading" class="list-comment">
      <store-comment
        v-if="data.length > 0"
        :is-show-store="true"
        :data="data"
      />
      <div v-else class="text no-data">{{ noData }}</div>
    </div>
    <div v-if="pagination.total > 0" class="group-button">
      <lazy-common-pagination
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :default-record="pagination.numberRecordPerPage"
        class="custom-page"
        :paper-count="3"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import CommentRequest from "~/../../src/shared/requests/CommentRequest";
import { ReviewInterface } from "~/../../src/front/models/review";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { SORT_ORDER } from "~/../../src/shared/constants";
import {
  dataRate,
  textNoData,
  textNoResult,
} from "~/../../src/shared/constants/rate";
import { DataTableStore } from "~/../../src/front/store/dataTable";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants";

definePageMeta({
  activeSidebar: {
    parentName: "review",
  },
  middleware: ["auth"],
});

const noData = ref(textNoData);
const { t } = i18n.global;
const dataTitle = reactive([{ name: t("list_review"), path: "" }]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: CUSTOMER_PAGINATION.PER_PAGE,
});
const dataStore = DataTableStore();
const data = ref<ReviewInterface[]>([]);
const from = ref(0);
const to = ref(0);
const form = reactive({
  star: null,
});
const sortTable = reactive({
  order_by: "created_at",
  direct: SORT_ORDER.DESC,
});
const handleSearchRate = () => {
  dataStore.reviewList.currentPage = 1;
  pagination.currentPage = 1;
  dataStore.reviewList.search = { star: form.star };
  getListRate();
  if (data.value.length === 0) {
    noData.value = textNoResult;
  }
};
const handleSizeChange = (val: number) => {
  dataStore.reviewList.pageSize = val;
  pagination.numberRecordPerPage = val;
  dataStore.reviewList.currentPage = 1;
  pagination.currentPage = 1;
  getListRate();
};
const handleCurrentChange = (val: number) => {
  dataStore.reviewList.currentPage = val;
  pagination.currentPage = val;
  getListRate();
};

const getListRate = async () => {
  loading.value = true;
  const response = (
    await CommentRequest.listMeReview<ReviewInterface[]>({
      limit: pagination.numberRecordPerPage,
      page: pagination.currentPage,
      star: form.star,
      ...sortTable,
    })
  ).data;
  data.value = response.data;
  pagination.total = response.pagination.total;
  from.value =
    pagination.total > 0
      ? pagination.currentPage * pagination.numberRecordPerPage -
        pagination.numberRecordPerPage +
        1
      : 0;
  to.value =
    pagination.numberRecordPerPage * pagination.currentPage > pagination.total
      ? pagination.total
      : pagination.numberRecordPerPage * pagination.currentPage;
  loading.value = false;
};

onMounted(() => {
  if (dataStore.reviewList?.search) {
    form.star = dataStore.reviewList.search?.star;
    pagination.currentPage = dataStore.reviewList.currentPage;
    pagination.numberRecordPerPage = dataStore.reviewList.pageSize;
  }
  getListRate();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.user-review-container {
  width: 100%;
  padding: 32px;

  .no-data {
    border-top: 1px solid $black-10;
    padding: 20px 0;
  }

  .header-content {
    flex-wrap: wrap;

    .rate-header__total {
      .page,
      .total {
        font-weight: bold;
        font-size: 18px;
      }
    }

    .form {
      .el-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }

  .list-comment {
    margin-top: 20px;

    .text {
      text-align: center;
    }
  }

  .group-button {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e4e4e4;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .user-review-container {
    padding: 32px 24px;

    .header-content {
      .rate-header__total {
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
