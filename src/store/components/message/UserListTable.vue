<template>
  <div class="user-list-content">
    <div v-if="!isConfirmMessage">
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            label-position="left"
            label-width="120px"
            inline
            class="form-search"
            :model="formSearch"
            @keyup.enter="handleSearch"
          >
            <el-form-item :label="$t('keyword_search')">
              <InputText
                v-model="formSearch.keyword"
                :placeholder="$t('email_of_name')"
                :width="'194px'"
              />
            </el-form-item>
            <el-form-item class="date-notices" :label="$t('last_login')">
              <div class="mr-15">
                <InputDate
                  v-model="formSearch.last_time_visited_store_start"
                  :value-format="'YYYY-MM-DD HH:mm:ss'"
                  :placeholder="$t('start_date')"
                  clearable
                />
              </div>
              <div>
                <InputDate
                  v-model="formSearch.last_time_visited_store_end"
                  :value-format="'YYYY-MM-DD HH:mm:ss'"
                  :placeholder="$t('end_date')"
                  clearable
                />
              </div>
            </el-form-item>
            <el-form-item
              class="time-more"
              :label="$t('admin.messages.access_log')"
            >
              <input-number
                v-model="formSearch.number_visited_store_min"
                placeholder=""
              />
              <span class="time--more">{{ $t("time_or_more") }}</span>
              <input-number
                v-model="formSearch.number_visited_store_max"
                placeholder=""
              />
              <span class="time--more">{{ $t("time_or_more") }}</span>
            </el-form-item>
            <el-form-item class="birth-day" :label="$t('birth_day')">
              <client-only>
                <el-select
                  v-model="formSearch.birth_month_from"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("monday") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_day_from"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("from_the_day") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_month_to"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("monday") }}</span>
              <client-only>
                <el-select
                  v-model="formSearch.birth_day_to"
                  placeholder=" "
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
              <span class="unit">{{ $t("sunday") }}</span>
            </el-form-item>
            <el-form-item :label="$t('era')">
              <client-only>
                <el-select
                  v-model="formSearch.age"
                  :placeholder="$t('era')"
                  filterable="true"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in ageOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item :label="$t('gender')">
              <client-only>
                <el-select
                  v-model="formSearch.gender"
                  :placeholder="$t('gender')"
                >
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <el-form-item v-if="id" :label="$t('status')">
              <client-only>
                <el-select v-model="formSearch.status" :placeholder="$t('all')">
                  <el-option :value="null" :label="$t('all')"></el-option>
                  <el-option
                    v-for="item in statusSendOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </client-only>
            </el-form-item>
            <ButtonSearch :loading="isLoadingSearch" @click="handleSearch" />
          </el-form>
        </template>
      </CommonSearchContentComponent>
    </div>
    <div v-if="id" class="table-title">
      {{ $t("destination_list") }}
    </div>
    <div v-else class="table-title">
      {{ $t("title_screen.send_target_search") }}
    </div>
    <div class="user-list custom-table">
      <client-only>
        <div class="check-all-child">
          <el-checkbox
            v-if="!id && !isConfirmMessage"
            v-model="checkAll"
            class="checkbox-create"
            :disabled="isConfirmMessage"
            :label="$t('all')"
            @change="handleCheckAllChange"
          ></el-checkbox>
          <el-checkbox
            v-if="isConfirmMessage"
            class="checkbox-confirm"
            :disabled="isConfirmMessage"
            :label="$t('all')"
            :checked="true"
          ></el-checkbox>
        </div>
        <el-checkbox-group
          v-model="arrayUserPick"
          @change="handleCheckedChange"
        >
          <el-table
            ref="multipleTableRef"
            v-loading="isLoadingTable || loadingDetail"
            :data="tableData"
            :empty-text="noData"
            max-height="248px"
            style="width: 100%"
            border
            @sort-change="headerSort"
          >
            <el-table-column
              v-if="!id"
              fixed="left"
              class="column-checkbox"
              width="90px"
            >
              <template #header>
                <div class="check-all"></div>
              </template>
              <template #default="scope">
                <el-checkbox
                  v-if="!isConfirmMessage"
                  :disabled="isConfirmMessage"
                  :label="scope.row._id"
                ></el-checkbox>
                <el-checkbox
                  v-if="isConfirmMessage"
                  :disabled="isConfirmMessage"
                  :checked="true"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isConfirmMessage"
              :label="$t('order')"
              min-width="70px"
              type="index"
              :index="columnIndex"
            />
            <el-table-column
              v-if="isConfirmMessage"
              :label="$t('order')"
              width="120px"
              type="index"
              :index="columnIndexConfirm"
            />
            <el-table-column :label="$t('full_name_kanji')" min-width="150px">
              <template #default="scope">{{ scope.row.fullname }}</template>
            </el-table-column>
            <el-table-column
              min-width="200px"
              property="email"
              :label="$t('email_address')"
            >
              <template #default="scope">{{ scope.row.email }}</template>
            </el-table-column>
            <el-table-column
              :label="$t('gender')"
              prop="gender"
              min-width="120px"
            >
              <template #default="scope">
                {{
                  scope.row.gender !== null
                    ? $t(
                        findObj(genderOptions, "value", scope.row.gender)
                          ? findObj(genderOptions, "value", scope.row.gender)
                              ?.label
                          : ""
                      )
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('birthday')"
              width="180px"
              prop="birth_day"
            >
              <template #default="scope">
                {{ formatDate(scope.row.birth_day, "YYYY年MM月DD日") }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.section')"
              min-width="150px"
            >
              <template #default="scope">
                {{ scope.row.type ? $t(scope.row.type + "_receiver") : "" }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin.messages.access_log')"
              min-width="130px"
              header-align="left"
              align="right"
            >
              <template #default="scope"
                >{{
                  priceDisplay(
                    formatPriceFromMath(scope.row.total_visited_store, 2)
                  )
                }}{{ $t("times") }}</template
              >
            </el-table-column>
            <el-table-column
              v-if="!id"
              :label="$t('last_login')"
              width="180px"
              prop="last_time_visited_store"
            >
              <template #default="scope">{{
                formatDate(scope.row.last_time_visited_store, "YYYY年MM月DD日")
              }}</template>
            </el-table-column>
            <el-table-column v-if="id" :label="$t('created')" width="180px">
              <div>{{ formatDate(createdDate, "YYYY年MM月DD日") }}</div>
            </el-table-column>
            <el-table-column v-if="id" :label="$t('status')" width="150px">
              <template #default="scope">{{
                scope.row.delivery_status
                  ? $t(
                      findObj(
                        statusSendOptions,
                        "value",
                        scope.row.delivery_status
                      )?.label
                    )
                  : ""
              }}</template>
            </el-table-column>
            <el-table-column
              v-if="id"
              :label="$t('admin.messages.sent_date_time')"
              width="180px"
            >
              <template #default="scope">{{
                formatDate(scope.row.delivery_at, "YYYY年MM月DD日")
              }}</template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </client-only>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            v-if="isConfirmMessage"
            :current-page="paginationRecipient.currentPage"
            :default-record="paginationRecipient.numberRecordPerPage"
            :total="paginationRecipient.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
          <LazyCommonPagination
            v-else
            :current-page="pagination.currentPage"
            :default-record="pagination.numberRecordPerPage"
            :total="pagination.total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTable } from "element-plus";
import { defineProps, inject, onMounted, reactive, ref, toRefs } from "vue";
import { ADMIN_PAGINATION, SORT_ORDER } from "~/../../src/shared/constants";
import InputText from "../../../shared/components/input/InputText.vue";
import InputDate from "../../../shared/components/input/Date.vue";
import ButtonSearch from "~/../../src/shared/components/button/Search.vue";
import MessageRequest from "~/../../src/shared/requests/MessageRequest";
import { User } from "~/../../src/shared/types/user";
import { formatDate } from "~/../../src/shared/utils/format";
import { customIndex } from "~/../../src/shared/utils";
import {
  genderOptions,
  ageOptions,
  dateOptions,
  monthOptions,
  arrayAge,
  statusSendOptions,
} from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils/array";
import { useRoute } from "nuxt/app";
import { Message } from "~/../../src/shared/types/message";
import { bussinessOptions } from "~/../../src/shared/constants/message";
import optionRoleType from "~/../../src/shared/constants/roles";
import InputNumber from "~/../../src/shared/components/input/Code.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import priceDisplay from "~/../../src/shared/utils/price";
import { formatPriceFromMath } from "~/../../src/shared/utils/format";
import moment from "moment";
import { useRouter } from "#imports";

const route = useRoute();
const planOptions = ref([]);
const arrayUserPick = ref([]);
const checkAll = ref(false);
interface Prop {
  showFormSearch: boolean;
  createdDate?: string;
  checkAllUserPage: [];
  tableDataChecked: [];
}

const props = withDefaults(defineProps<Prop>(), {
  showFormSearch: false,
  createdDate: "",
});

const { checkAllUserPage, tableDataChecked } = toRefs(props);
const id = ref(null);
id.value = Number(route.params.id);

const { t } = i18n.global;
const noData = ref(t("no_data"));
const loadingDetail = ref(false);
const emits = defineEmits(["arrayUsers", "messageData"]);
const loading = ref(false);
const isLoadingSearch = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const isLoadingTable = ref(false);
const router = useRouter();
const isConfirmMessage = ref(inject("isConfirmMessageProvide", true));
const allDataUser = ref([]);
const pagination = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const paginationRecipient = reactive({
  total: 0,
  currentPage: 1,
  numberRecordPerPage: ADMIN_PAGINATION.PER_PAGE,
});

const formSearch = ref({
  keyword: null,
  role: null,
  last_time_visited_store_start: null,
  last_time_visited_store_end: null,
  birth_day_to: null,
  number_visited_store_min: null,
  number_visited_store_max: null,
  birth_day_from: null,
  to_date: null,
  birth_month_from: null,
  birth_month_to: null,
  age: null,
  gender: null,
  store_type: null,
  plan: null,
  industry: null,
  status: null,
});

const columnIndex = (index: number) => {
  return customIndex(
    index,
    pagination.currentPage,
    pagination.numberRecordPerPage
  );
};

const columnIndexConfirm = (index: number) => {
  return customIndex(
    index,
    paginationRecipient.currentPage,
    paginationRecipient.numberRecordPerPage
  );
};

const getAllDataTable = () => {
  allDataUser.value = JSON.parse(JSON.stringify(tableDataChecked.value));
  paginationRecipient.total = allDataUser.value.length;
  paginationRecipient.currentPage = 1;
  paginationRecipient.numberRecordPerPage = ADMIN_PAGINATION.PER_PAGE;
  getDataTable();
};

const getDataTable = () => {
  tableData.value = allDataUser.value.slice(
    (paginationRecipient.currentPage - 1) *
      paginationRecipient.numberRecordPerPage,
    paginationRecipient.numberRecordPerPage * paginationRecipient.currentPage
  );
};

const handleCheckAllChange = (val: boolean) => {
  const arrayIdUsers = tableData.value.map((item) => item._id);
  arrayUserPick.value = val ? arrayIdUsers : [];
  arrayUserPick.value = arrayUserPick.value.filter((item) => item !== false);
  emits("arrayUsers", arrayUserPick.value, arrayIdUsers, tableData.value);
};

const handleCheckedChange = () => {
  checkAll.value = !tableData.value.filter(
    (item) => !arrayUserPick.value.includes(item._id)
  ).length;
  const arrayIdUsers = tableData.value.map((item) => item._id);
  arrayUserPick.value = arrayUserPick.value.filter((item) => item !== false);
  emits("arrayUsers", arrayUserPick.value, arrayIdUsers, tableData.value);
};

const getListUser = async () => {
  if (id.value) {
    await getDataRecipient();
  } else {
    await getDataUsers();
  }
};

const setUserPick = () => {
  const currentIds = tableData.value.map((item) => item._id);
  arrayUserPick.value = checkAllUserPage.value.filter((id) =>
    currentIds.includes(id)
  );
  checkAll.value = arrayUserPick.value.length === currentIds.length;
};

const handleCurrentChange = async (val: number) => {
  if (isConfirmMessage.value) {
    paginationRecipient.currentPage = val;
    getDataTable();
  } else {
    pagination.currentPage = val;
    try {
      isLoadingTable.value = true;
      await getListUser();
      setUserPick();
    } finally {
      isLoadingTable.value = false;
    }
  }
};

const handleSizeChange = async (val) => {
  if (isConfirmMessage.value) {
    paginationRecipient.numberRecordPerPage = val;
    paginationRecipient.currentPage = 1;
    getDataTable();
  } else {
    pagination.numberRecordPerPage = val;
    pagination.currentPage = 1;
    await getListUser();
    setUserPick();
  }
};

const tableData = ref([]);
const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
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
  await getListUser();
  setUserPick();
  loading.value = false;
};

const handleSearch = async () => {
  try {
    pagination.currentPage = 1;
    isLoadingTable.value = true;
    isLoadingSearch.value = true;
    await getListUser();
    if (!tableData.value.length) {
      noData.value = t("no_result");
    }
    setUserPick();
  } finally {
    isLoadingSearch.value = false;
    isLoadingTable.value = false;
  }
};

const getDataUsers = async () => {
  try {
    isLoadingTable.value = true;
    const ageRange = findObj(arrayAge, "type", formSearch.value.age)?.value;
    const params = {
      keyword: formSearch.value.keyword,
      role: formSearch.value.role,
      last_time_visited_store_start:
        formSearch.value.last_time_visited_store_start,
      last_time_visited_store_end: moment(
        formSearch.value.last_time_visited_store_end,
        "YYYY-MM-DD HH:mm:ss"
      )
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .format("YYYY-MM-DD HH:mm:ss"),
      birth_day_from: formSearch.value.birth_day_from,
      birth_day_to: formSearch.value.birth_day_to,
      birth_month_from: formSearch.value.birth_month_from,
      birth_month_to: formSearch.value.birth_month_to,
      number_visited_store_min: formSearch.value.number_visited_store_min,
      number_visited_store_max: formSearch.value.number_visited_store_max,
      to_date: formSearch.value.to_date,
      age_range: ageRange ? [ageRange] : null,
      gender: formSearch.value.gender,
      store_type: formSearch.value.store_type,
      plan: formSearch.value.plan,
      industry: formSearch.value.industry,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid date"
      ) {
        delete params[key];
      }
    });

    const messageResponse = (
      await MessageRequest.searchUser<User[]>(
        {
          ...params,
          ...sortTable,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        },
        true
      )
    ).data;

    tableData.value = messageResponse.data;

    checkAll.value = !tableData.value.filter(
      (item) => !arrayUserPick.value.includes(item._id)
    ).length;

    pagination.total = messageResponse.pagination?.total;
    pagination.currentPage = messageResponse.pagination?.current_page;
    pagination.numberRecordPerPage = messageResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

const getDetailMessages = async () => {
  try {
    loadingDetail.value = true;
    const messageResponse = await MessageRequest.show<Message>(id.value);
    emits("messageData", messageResponse.data);
  } catch (err: any) {
    if (err.response.status === STATUS_CODE.NOT_FOUND) {
      await router.push({ name: "messages" });
    }
  } finally {
    loadingDetail.value = false;
  }
};

const getDataRecipient = async () => {
  try {
    isLoadingTable.value = true;
    const ageRange = findObj(arrayAge, "type", formSearch.value.age)?.value;
    const params = {
      keyword: formSearch.value.keyword,
      role: formSearch.value.role,
      last_time_visited_store_start:
        formSearch.value.last_time_visited_store_start,
      last_time_visited_store_end: moment(
        formSearch.value.last_time_visited_store_end,
        "YYYY-MM-DD HH:mm:ss"
      )
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .format("YYYY-MM-DD HH:mm:ss"),
      birth_day_from: formSearch.value.birth_day_from,
      birth_day_to: formSearch.value.birth_day_to,
      birth_month_from: formSearch.value.birth_month_from,
      birth_month_to: formSearch.value.birth_month_to,
      number_visited_store_min: formSearch.value.number_visited_store_min,
      number_visited_store_max: formSearch.value.number_visited_store_max,
      to_date: formSearch.value.to_date,
      age_range: ageRange ? JSON.stringify([ageRange]) : null,
      gender: formSearch.value.gender,
      store_type: formSearch.value.store_type,
      plan: formSearch.value.plan,
      status: formSearch.value.status,
      industry: formSearch.value.industry,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid date"
      ) {
        delete params[key];
      }
    });

    const messageResponse = (
      await MessageRequest.showRecipient<User[]>(
        id.value,
        {
          ...params,
          ...sortTable,
          page: pagination.currentPage,
          limit: pagination.numberRecordPerPage,
        },
        true
      )
    ).data;

    tableData.value = messageResponse.data;
    checkAll.value = !tableData.value.filter(
      (item) => !arrayUserPick.value.includes(item._id)
    ).length;

    pagination.total = messageResponse.pagination?.total;
    pagination.currentPage = messageResponse.pagination?.current_page;
    pagination.numberRecordPerPage = messageResponse.pagination?.per_page;
  } catch (e) {
    return e;
  } finally {
    isLoadingTable.value = false;
  }
};

onMounted(async () => {
  if (id.value) {
    await getDetailMessages();
    await getDataRecipient();
  } else {
    await getDataUsers();
  }
});

defineExpose({
  loadingDetail,
  getDataUsers,
  getAllDataTable,
});
</script>

<style lang="scss" scoped>
.custom-table {
  position: relative;
}

:deep(.footer .group-button) {
  padding: 18px 0 !important;
}

:deep(.footer .group-button) {
  padding: 18px 0;
}

.check-all-child .checkbox-confirm,
.check-all-child .checkbox-create {
  position: absolute;
  top: 8px;
  left: 16px;
  z-index: 99;
}

.user-list-content {
  padding-bottom: 20px;

  .table-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 20px;
  }

  .time--more,
  .unit {
    margin: 0 12px;
  }

  :deep(.date-notices .el-input) {
    width: 170px;
  }

  :deep(.time-more .el-input) {
    width: 90px;
  }

  :deep(.birth-day .el-input) {
    width: 100px;
  }
}

:deep(.el-checkbox-group .el-checkbox__label) {
  display: none;
}

:deep(.search .el-form--inline .el-form-item) {
  margin-right: 50px;
}
</style>
