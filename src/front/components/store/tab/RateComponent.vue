<template>
  <div v-loading="loading" class="rate">
    <div class="rate-header">
      <div class="rate-header__total">
        <span class="from-rate">{{ from }}～{{ to }} </span>{{ $t("view") }} ／
        {{ $t("all_rate") }}
        <span class="total-rate">{{ pagination.total }}</span>
        {{ $t("subject_coupon") }}
      </div>
      <div class="form">
        <el-form @submit.enter.prevent>
          <el-form-item
            class="search-rate"
            :label="$t('evaluation_score_search')"
          >
            <el-select v-model="dataSearch.star" @change="handleSearchRate">
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
    <div class="rate-review">
      <div>
        <div class="rate-review__subject">{{ $t("review_subject") }}</div>
        <div>{{ $t("shop_staff") }}</div>
      </div>
      <div v-if="isAddReview" class="button-green">
        <ButtonGreenMedium
          font-size="12px"
          :name="$t('button.submit_review')"
          @click="openModalAddReview"
        />
      </div>
    </div>
    <div class="list-comment">
      <store-comment v-if="data.length > 0" :data="data" />
      <div v-else class="text">{{ noData }}</div>
    </div>
    <div v-if="pagination.total > 0" class="rate-footer">
      <common-pagination
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :default-record="pagination.numberRecordPerPage"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      />
    </div>
    <modal-comment
      v-if="dialogVisible"
      :title="$t('input_word_of_mouth')"
      :dialog-visible="dialogVisible"
      :loading="loadingAddReview"
      @handle-close="handleClose"
      @handle-submit="addReview"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonGreenMedium from "~/../../src/shared/components/button/GreenMedium.vue";
import { onMounted, reactive, ref, toRefs } from "vue";
import CommentRequest from "~/../../src/shared/requests/CommentRequest";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants";
import { useMeStore } from "~/../../src/shared/stores/me";
import { ReviewInterface } from "~/../../src/front/models/review";
import { SORT_ORDER } from "~/../../src/shared/constants";
import {
  dataRate,
  textNoData,
  textNoResult,
} from "~/../../src/shared/constants/rate";
import { messageError } from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

interface Prop {
  idStore: number;
}

const props = defineProps<Prop>();
const { idStore } = toRefs(props);
const meStore = useMeStore();
const loading = ref(false);
const dataSearch = reactive({
  star: null,
});
const loadingAddReview = ref(false);

const emits = defineEmits(["updateRate"]);

const sortTable = reactive({
  order_by: "created_at",
  direct: SORT_ORDER.DESC,
});
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: CUSTOMER_PAGINATION.PER_PAGE,
});

const data = ref<ReviewInterface[]>([]);
const dialogVisible = ref(false);
const to = ref(0);
const from = ref(0);
const isAddReview = ref(false);
const noData = ref(textNoData);

const handleSizeChange = (val: number) => {
  pagination.numberRecordPerPage = val;
  pagination.currentPage = 1;
  getListComment();
};
const handleSearchRate = () => {
  getListComment();
  if (data.value.length === 0) {
    noData.value = textNoResult;
  }
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  getListComment();
};

const checkComment = async () => {
  try {
    const response = (await CommentRequest.checkReview(idStore.value)).data;
    if (response) {
      isAddReview.value = true;
    } else {
      isAddReview.value = false;
    }
  } catch (error: any) {
    isAddReview.value = false;
  }
};

const getListComment = async () => {
  loading.value = true;
  const response = (
    await CommentRequest.listReview<ReviewInterface[]>({
      store_id: idStore.value,
      star: dataSearch.star,
      limit: pagination.numberRecordPerPage,
      page: pagination.currentPage,
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

const openModalAddReview = () => {
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const addReview = async (form: object) => {
  try {
    loadingAddReview.value = true;
    await CommentRequest.postReview({ ...form, store_id: idStore.value });
    pagination.currentPage = 1;
    dataSearch.star = null;
    await getListComment();
    emits("updateRate");
    await checkComment();
    dialogVisible.value = false;
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError("errors.review_count");
      await checkComment();
    }
  } finally {
    loadingAddReview.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  if (meStore.info) {
    await checkComment();
  }
  await getListComment();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.rate {
  background-color: $primary-text-color;
  padding: 32px;

  .rate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .rate-header__total {
      .from-rate,
      .total-rate {
        font-weight: bold;
        font-size: 18px;
      }
    }

    .form {
      .el-form {
        .search-rate {
          margin-bottom: 0;

          :deep(.el-form-item__content) {
            .el-select {
              :deep(.el-input) {
              }
            }
          }
        }
      }
    }
  }

  .rate-review {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background-color: $grey-50;
    font-size: 12px;
    color: $black-color;

    .button-green {
      padding-left: 16px;
    }

    .rate-review__subject {
      font-weight: bold;
    }
  }

  .list-comment {
    margin-top: 16px;

    .text {
      text-align: center;
    }
  }

  .add-review {
    margin-top: 16px;
    padding: 8px 16px;
    background-color: $gray-900;
    display: flex;
    justify-content: flex-end;
  }

  .rate-footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $grey-small-color;
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .rate {
    .rate-header {
      display: block;
      padding: 0 16px;
      margin-bottom: 16px;

      .rate-header__total {
        margin-bottom: 10px;

        .from-rate,
        .total-rate {
          font-weight: bold;
          font-size: 18px;
        }
      }
    }

    .rate-review {
      display: block;

      .button-green {
        display: flex;
        justify-content: right;
        padding: 8px 16px;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .rate {
    background-color: $primary-text-color;
    padding: 0;
    margin-bottom: 33px;

    .rate-header {
      display: block;
      padding: 0 16px;
      margin-bottom: 16px;

      .rate-header__total {
        margin-bottom: 10px;
      }
    }

    .rate-review {
      display: block;
      background-color: $grey-50;
      font-size: 12px;

      .button-green {
        padding: 8px 16px;
        display: flex;
        justify-content: right;
      }

      .rate-review__subject {
        font-weight: bold;
      }
    }

    .add-review {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: $grey-50;
      display: flex;
      justify-content: flex-end;
    }

    .list-comment {
      padding: 0 16px;
    }

    .rate-footer {
      margin-top: 16px;
      padding: 16px 16px 0;
      border-top: 1px solid $grey-small-color;
    }
  }
}
</style>
