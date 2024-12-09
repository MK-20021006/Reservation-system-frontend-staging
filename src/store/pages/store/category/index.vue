<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title> {{ $t("site_name_title") }}{{ $t("list_category") }} </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("list_category") }}</div>
          </div>
        </template>
        <template #button>
          <ButtonAdd :name="$t('create_new')" @click="addCategory" />
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <CommonSearchContentComponent>
        <template #form-search>
          <el-form
            class="custom-form"
            :model="formSearch"
            label-position="left"
            inline
            @keyup.enter.prevent="handleSearch"
            @submit.native.prevent
          >
            <el-form-item :label="$t('title_keyword')">
              <input-text
                v-model="formSearch.name"
                :placeholder="$t('keyword_search')"
              />
            </el-form-item>
            <el-form-item
              v-if="checkTypeStore(dataCheck, store?.model_has_type?.type_id)"
              :label="$t('store.parent_category')"
            >
              <client-only>
                <el-select
                  v-model="formSearch.parent_id"
                  :placeholder="$t('store.category_placeholder')"
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
            <ButtonSearch :name="$t('button_search')" @click="handleSearch">
            </ButtonSearch>
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
          :empty-text="noData"
          :default-sort="defaultSort"
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
            v-if="checkTypeStore(dataCheck, store?.model_has_type?.type_id)"
            min-width="150px"
            :label="$t('store.parent_category')"
            prop="parent_id"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span>
                {{ scope.row.parent?.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150px"
            :label="
              checkTypeStore(dataCheck, store?.model_has_type?.type_id)
                ? $t('store.child_category')
                : $t('store.item_name')
            "
            prop="name"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            min-width="150px"
            :label="$t('description')"
            prop="description"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
          </el-table-column>
          <el-table-column
            min-width="140px"
            prop="menus"
            :label="$t('store.category_count')"
            :sortable="true"
            :sort-orders="['ascending', 'descending']"
          >
            <template #default="scope">
              <span> {{ scope.row.menus?.length }}</span>
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
                  v-if="hasPermCategoryEdit"
                  @click="editCategory(scope.row.id)"
                />
                <icon-delete
                  v-if="hasPermCategoryDelete"
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
        :header-name="$t('explain_delete_category')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteCategory"
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
import { formatDate } from "../../../../shared/utils/format";
import { getPageDelete } from "../../../../shared/utils/dataPage";
import { categoryStore } from "../../../store/useCategory";
import CategoryRequest from "../../../../shared/requests/CategoryRequest";
import { ref, onBeforeMount, reactive, computed } from "vue";
import { useRouter } from "nuxt/app";
import { STORE_PAGINATION } from "~/../../src/shared/constants/pagination";
import dataCategoryFilter from "../../../../shared/constants/category";
import ButtonSearch from "../../../../shared/components/button/Search";
import ButtonAdd from "../../../../shared/components/button/ButtonAdd.vue";
import InputText from "../../../../shared/components/input/InputText.vue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import { useMeStore } from "../../../../shared/stores/me";
import { SORT_ORDER } from "../../../../shared/constants";
import { ListAllResponse, Category } from "../../../models";
import { getTypeSort } from "~/../../src/shared/utils";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  deleteError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";
import {
  SALON,
  RESTAURANT,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "../../../../shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";
import { customIndex } from "~/../../src/shared/utils";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";

useHavePermission(Permission.CategoryList);
useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const hasPermCategoryEdit = useHavePermission(Permission.CategoryEdit, false);
const hasPermCategoryDelete = useHavePermission(
  Permission.CategoryDelete,
  false
);

const dataCheck = ref([RESTAURANT]);
const { t } = i18n.global;
const categoryTable = categoryStore();
const storeUser = useMeStore();
const store = storeUser.info?.store;
const router = useRouter();
const currentPage = ref(1);
const defaultRecord = ref(STORE_PAGINATION.PER_PAGE);
const total = ref(0);
const idDelete = ref(null);
const dialogVisible = ref(false);
const loading = ref(false);
const loadingDelete = ref(false);
const dataCategorySearch = ref([]);
const tableData = ref<Category[]>([]);
const noData = ref(t("no_data"));
const formSearch = ref({
  name: "",
  parent_id: null,
});

const columnIndex = (index: number) => {
  return customIndex(index, currentPage.value, defaultRecord.value);
};

const getDataCategory = async () => {
  try {
    loading.value = true;
    const respone = await CategoryRequest.getCategoryParent<[]>();
    dataCategorySearch.value = respone.data;
  } catch (error: any) {
  } finally {
    loading.value = false;
  }
};

const addCategory = () => {
  router.push("/store/category/create");
};

const editCategory = (id: number) => {
  router.push(`/store/category/edit/${id}`);
};

const showModalDelete = (id: number) => {
  idDelete.value = id;
  dialogVisible.value = true;
};

const deleteCategory = async () => {
  try {
    loadingDelete.value = true;
    await CategoryRequest.delete(idDelete.value);
    deleteSuccess();
    currentPage.value = getPageDelete(currentPage.value, tableData.value);
    await getListCategory();
  } catch (error) {
    deleteError();
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

const sortTable = reactive({
  order_by: "",
  direct: SORT_ORDER.ASC,
});

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
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
  addConditionCategory();
  await getListCategory();
  loading.value = false;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getListCategory();
};

const handleSizeChange = (val: number) => {
  loading.value = true;
  defaultRecord.value = val;
  currentPage.value = 1;
  addConditionCategory();
  getListCategory();
};

const handleSearch = async () => {
  loading.value = true;
  currentPage.value = 1;
  addConditionCategory();
  await getListCategory();
  if (!tableData.value.length) {
    noData.value = t("no_result");
  }
};

const tableRowClassName = (row: any, rowIndex: number) => {
  if (storeUser.typeStore === RESTAURANT && !row.row.parent) {
    return "category-delete";
  }
  return "";
};

const getListCategory = async () => {
  loading.value = true;
  const params = {
    ...formSearch.value,
    ...sortTable,
    limit: defaultRecord.value,
    page: currentPage.value,
  };
  const data = (await CategoryRequest.list<Category[]>(params)).data;
  tableData.value = data.data;
  total.value = data.total;
  currentPage.value = data.current_page;
  loading.value = false;
};

const addConditionCategory = () => {
  categoryTable.categoryList = {
    search: formSearch.value,
    currentPage: currentPage.value,
    pageSize: defaultRecord.value,
    sort: sortTable,
  };
};

onBeforeMount(async () => {
  if (storeUser.getTypeStore === RESTAURANT) {
    await getDataCategory();
  }
  if (categoryTable.categoryList?.search) {
    formSearch.value = categoryTable.categoryList.search;
    currentPage.value = categoryTable.categoryList.currentPage;
    defaultRecord.value = categoryTable.categoryList.pageSize;
  }
  if (categoryTable.categoryList?.sort) {
    sortTable.order_by = categoryTable.categoryList.sort.order_by;
    sortTable.direct = categoryTable.categoryList.sort.direct;
  }
  await getListCategory();
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;

:deep(.custom-form) {
  &.el-form--inline .el-form-item {
    margin-right: 52px;
  }

  .el-input {
    width: 274px;
  }

  .el-select {
    .el-input {
      width: 134px;
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
