<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title> {{ $t("site_name_title") }}{{ $t("store.list_menu") }} </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="menu-header">
            <div>{{ $t("store.list_menu") }}</div>
          </div>
        </template>
        <template #button>
          <ButtonAdd :name="$t('create_new')" @click="addMenu" />
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
            <el-form-item :label="$t('store.number')">
              <input-number
                v-model="formSearch.id"
                :maxlength="MAX_LENGTH_DEFAULT"
                :placeholder="$t('store.number')"
              />
            </el-form-item>
            <el-form-item :label="$t('store.menu_title')">
              <input-text
                v-model="formSearch.name"
                :placeholder="$t('store.menu_title')"
              />
            </el-form-item>
            <el-form-item :label="$t('store.category_title')">
              <client-only>
                <el-select
                  v-model="formSearch.product_category_id"
                  :placeholder="$t('store.category_title')"
                  :teleported="false"
                >
                  <el-option :label="$t('all')" :value="null" />
                  <el-option
                    v-for="item in dataCategorySearch"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </client-only>
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
          :row-class-name="tableRowClassName"
          @sort-change="headerSort"
        >
          <el-table-column
            width="100px"
            :label="$t('order')"
            type="index"
            :index="columnIndex"
          />
          <el-table-column
            min-width="100px"
            :label="$t('store.number')"
            prop="id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="277px"
            :label="$t('store.category_title')"
            prop="product_category_id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ scope.row.category?.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="277px"
            :label="$t('store.menu_title')"
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="277px"
            :label="$t('description')"
            prop="description"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="$t('tax_price')"
            prop="price"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              <span
                v-if="
                  (!scope.row.price_status &&
                    store.model_has_type.type_id === RESTAURANT) ||
                  GROUP_TYPE_STORE.SAME.includes(store.model_has_type.type_id)
                "
              >
                {{
                  scope.row.price !== null
                    ? priceDisplay(scope.row.price) + $t("yen")
                    : ""
                }}</span
              >
              <span v-else>{{ $t("market_price") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="180px"
            :label="$t('created')"
            prop="created_at"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ formatDate(scope.row.created_at, "YYYY年MM月DD日") }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :label="$t('action')"
            class-name="custom-action"
            fixed="right"
          >
            <template #default="scope">
              <div class="group-action">
                <icon-edit
                  v-if="hasPermMenuEdit"
                  @click="editMenu(scope.row.id)"
                />
                <icon-delete
                  v-if="hasPermMenuDelete"
                  @click="showModalDelete(scope.row.id)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ModalConfirm
        :dialog-visible="dialogVisible"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteMenu"
      />
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <LazyCommonPagination
            :current-page="currentPage"
            :default-record="defaultRecord"
            :total="total"
            @handle-current-change="handleCurrentChange"
            @handle-size-change="handleSizeChange"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { customIndex, formatDate } from "../../../../shared/utils/format";
import { getPageDelete } from "../../../../shared/utils/dataPage";
import { menuStore } from "../../../store/useMenu";
import CategoryRequest from "../../../../shared/requests/CategoryRequest";
import MenuRequest from "../../../../shared/requests/MenuRequest";
import { ref, onBeforeMount, reactive, computed } from "vue";
import { useRouter } from "nuxt/app";
import { STORE_PAGINATION } from "~/../../src/shared/constants/pagination";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import InputText from "~~/../../src/shared/components/input/InputText";
import ButtonAdd from "~~/../../src/shared/components/button/ButtonAdd";
import ButtonSearch from "~~/../../src/shared/components/button/Search";
import InputNumber from "../../../../shared/components/input/Phone.vue";
import { SORT_ORDER } from "../../../../shared/constants";
import { getTypeSort } from "~/../../src/shared/utils";
import { Menu } from "../../../models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { MAX_LENGTH_DEFAULT } from "~/../../src/shared/utils/validate";
import {
  SALON,
  RESTAURANT,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";
import { useMeStore } from "~/../../src/shared/stores/me";
import { getTime } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);
useHavePermission(Permission.MenuList);
const hasPermMenuEdit = useHavePermission(Permission.MenuEdit, false);
const hasPermMenuDelete = useHavePermission(Permission.MenuDelete, false);

const { t } = i18n.global;
const menuTable = menuStore();
const router = useRouter();
const currentPage = ref(1);
const defaultRecord = ref(STORE_PAGINATION.PER_PAGE);
const total = ref(0);
const idDelete = ref(null);
const dialogVisible = ref(false);
const loading = ref(false);
const loadingDelete = ref(false);
const dataCategorySearch = ref([]);
const tableData = ref([]);
const noData = ref(t("no_data"));
const formSearch = ref({
  name: "",
  product_category_id: null,
  id: null,
});
const storeUser = useMeStore();
const store = storeUser.info.store;
// SALON
const dataSalon = ref(GROUP_TYPE_STORE.SAME);
const columnIndex = (index: number) => {
  return customIndex(index, currentPage.value, defaultRecord.value);
};
const addMenu = () => {
  router.push("/store/menu/create");
};

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});

const editMenu = (id) => {
  router.push(`/store/menu/edit/${id}`);
};

const showModalDelete = (id) => {
  idDelete.value = id;
  dialogVisible.value = true;
};

const deleteMenu = async () => {
  try {
    loadingDelete.value = true;
    await MenuRequest.delete(idDelete.value);
    currentPage.value = getPageDelete(currentPage.value, tableData.value);
    deleteSuccess();
    await getListMenu();
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    dialogVisible.value = false;
    idDelete.value = "";
    loadingDelete.value = false;
  }
};

const handleClose = () => {
  idDelete.value = "";
  dialogVisible.value = false;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  addConditionMenu();
  getListMenu();
};

const handleSizeChange = (val) => {
  defaultRecord.value = val;
  currentPage.value = 1;
  addConditionMenu();
  getListMenu();
};

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
  currentPage.value = 1;
  loading.value = true;
  addConditionMenu();
  await getListMenu();
  loading.value = false;
};

const handleSearch = async () => {
  loading.value = true;
  currentPage.value = 1;
  addConditionMenu();
  await getListMenu();
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
  loading.value = false;
};

const addConditionMenu = () => {
  menuTable.menuList = {
    search: formSearch.value,
    currentPage: currentPage.value,
    pageSize: defaultRecord.value,
    sort: sortTable,
  };
};

const getListMenu = async () => {
  loading.value = true;
  const params = {
    ...formSearch.value,
    ...sortTable,
    limit: defaultRecord.value,
    page: currentPage.value,
  };
  const data = (await MenuRequest.list<Menu[]>(params)).data;
  tableData.value = data.data;
  total.value = data.total;
  currentPage.value = data.current_page;
  loading.value = false;
};

const getAllCategory = async () => {
  const data = await CategoryRequest.list({ all: true }, true);
  dataCategorySearch.value = data.data;
};

const tableRowClassName = (row: any, rowIndex: number) => {
  if (!row.row.category) {
    return "category-delete";
  }
  if (
    row.row.staffs?.length <= 0 &&
    GROUP_TYPE_STORE.SAME.includes(storeUser.getTypeStore)
  ) {
    return "staff-list";
  }
  return "";
};

// SALON
const getTime = (time) => {
  if (!time) {
    return `0h`;
  }
  let minute = null;
  let hour = null;
  if (!time) {
    return { hour, minute };
  }
  hour = Math.floor(time / 60) ? Math.floor(time / 60) : 0;
  minute = time - hour * 60 ? time - hour * 60 : 0;
  return `${hour}h${minute}m`;
};

onBeforeMount(() => {
  if (menuTable.menuList?.search) {
    formSearch.value = menuTable.menuList.search;
    currentPage.value = menuTable.menuList.currentPage;
    defaultRecord.value = menuTable.menuList.pageSize;
  }
  if (menuTable.menuList?.sort) {
    sortTable.order_by = menuTable.menuList.sort.order_by;
    sortTable.direct = menuTable.menuList.sort.direct;
  }
  getAllCategory();
  getListMenu();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

:deep(.custom-form) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }

  .el-select {
    .el-input {
      width: 274px;
    }
  }
}

:deep(.staff-list) {
  td {
    .cell {
      color: $red-color-medium;
    }
  }
}

:deep(.category-delete) {
  td {
    .cell {
      color: $red-color-medium;
    }
  }
}
</style>
