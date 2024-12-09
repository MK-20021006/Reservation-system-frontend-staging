<template>
  <div v-loading="isLoadingData">
    <el-form
      ref="formRef"
      :rules="categoryRules"
      :model="formCategory"
      class="form-category"
      require-asterisk-position="right"
    >
      <el-form-item
        v-if="checkTypeStore(dataCheck, store?.model_has_type?.type_id)"
        :label="$t('store.parent_category')"
        :error="errorData.parent_id?.[0]"
        prop="parent_id"
      >
        <client-only>
          <select-tag
            v-model="formCategory.parent_id"
            :limit="1"
            :options="dataCategory"
            :placeholder="$t('placeholder.parent_category')"
            :allow-create="allowCreate"
            label="name"
            value="name"
            prop-key="id"
            @handle-remove-tag="handleShowPopup"
          />
        </client-only>
      </el-form-item>
      <el-form-item
        :label="
          storeUser.getTypeStore === RESTAURANT
            ? $t('store.child_category')
            : $t('store.item_name')
        "
        prop="name"
      >
        <input-text
          v-model="formCategory.name"
          :error="errorData.name?.[0]"
          :maxlength="MAX_LENGTH_CATEGORY_NAME"
          :placeholder="
            storeUser.getTypeStore === RESTAURANT
              ? $t('placeholder.child_category')
              : $t('placeholder.item_name')
          "
        />
      </el-form-item>
      <el-form-item :label="$t('description')" prop="description">
        <input-text
          v-model="formCategory.description"
          type="textarea"
          :placeholder="$t('placeholder.enter_explain')"
          :maxlength="MAX_LENGTH_CATEGORY_DESCRIPTION"
        />
      </el-form-item>
      <el-form-item :label="$t('status')">
        <el-checkbox
          v-model="formCategory.status"
          :label="$t('display')"
          size="large"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item v-if="id" :label="$t('created_at')">
        <el-input
          class="input-date-update"
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCategory.created_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
      <el-form-item v-if="id" :label="$t('updated_at')">
        <el-input
          class="input-date-update"
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCategory.updated_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
    </el-form>
    <ModalConfirmCategory
      :dialog-visible="isShowModalDelete"
      :title="$t('title_delete')"
      :loading="loadingDataDelete"
      @handle-close="handleCloseModal"
      @handle-clear="handleClearModal"
      @handle-confirm="handleDeleteCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted } from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import categoryRules from "../../validates/category";
import dataCategoryFilter from "../../../shared/constants/category";
import {
  MAX_LENGTH_CATEGORY_NAME,
  MAX_LENGTH_CATEGORY_DESCRIPTION,
  DEFAULT_LENGTH_PARENT_CATEGORY,
} from "../../../shared/utils/validate";
import CategoryRequest from "../../../shared/requests/CategoryRequest";
import InputText from "../../../shared/components/input/InputText";
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { useMeStore } from "../../../shared/stores/me";
import { Category } from "../../models";
import { ACTIVE } from "~/../../src/shared/constants";
import {
  updateSuccess,
  updateError,
  createError,
  createSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { SALON, RESTAURANT } from "../../../shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";
import SelectTag from "~/../../src/shared/components/select/TagCategory.vue";
import ModalConfirmCategory from "~/../../src/store/components/modal/ConfirmCategory.vue";
import {
  deleteSuccess,
  deleteError,
} from "~/../../src/shared/utils/notification";

interface Prop {
  id: number;
}

const props = defineProps<Prop>();
const { id } = toRefs(props);
const emits = defineEmits(["changeLoadingData"]);

const storeUser = useMeStore();
const store = storeUser.info?.store;
const router = useRouter();
const formRef = ref(null);
const dataCategory = ref([]);
const errorData = ref({});
const isLoadingData = ref(false);
const allowCreate = ref(true);
const dataCheck = ref([RESTAURANT]);
const isShowModalDelete = ref(false);
const nameDelete = ref("");
const dataParent = ref();
const loadingDataDelete = ref(false);

const formCategory = reactive({
  name: "",
  description: "",
  parent_id: [],
  parent: "",
  status: ACTIVE,
  created_at: "",
  updated_at: "",
});

const createCategory = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        const params = customData(formCategory);
        emits("changeLoadingData", true);
        await CategoryRequest.post({ ...params });
        createSuccess();
        await router.push("/store/category");
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        createError();
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

//TODO id
const detailCategory = async () => {
  try {
    isLoadingData.value = true;
    const data = (await CategoryRequest.show(id.value)).data as Category;
    formCategory.created_at = data.created_at;
    formCategory.updated_at = data.updated_at;
    formCategory.status = data.status;
    formCategory.parent_id = data.parent ? [data.parent.name] : [];
    formCategory.description = data.description;
    formCategory.name = data.name;
    dataParent.value = data.parent;
  } catch (_) {
    await router.push({ name: "store-category" });
  } finally {
    isLoadingData.value = false;
  }
};

const getDataCategory = async () => {
  try {
    isLoadingData.value = true;
    const respone = await CategoryRequest.getCategoryParent<[]>();
    dataCategory.value = respone.data;
    if (dataCategory.value.length >= DEFAULT_LENGTH_PARENT_CATEGORY) {
      allowCreate.value = false;
    }
  } catch (error: any) {
    await router.push({ name: "store-category" });
  } finally {
    isLoadingData.value = false;
  }
};

const editCategory = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        const params = customData(formCategory);
        emits("changeLoadingData", true);
        await CategoryRequest.put(+id.value, {
          ...params,
        });
        updateSuccess();
        router.push("/store/category");
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-category" });
        } else {
          updateError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

const customData = (form: any) => {
  const parent_name =
    storeUser.getTypeStore === RESTAURANT && form.parent_id.length > 0
      ? form.parent_id[0]
      : null;
  return {
    description: form.description,
    name: form.name,
    parent_name: parent_name,
    status: form.status,
  };
};

const handleShowPopup = (item: string) => {
  formCategory.parent_id = [item];
  nameDelete.value = item;
  const obj = dataCategory.value.find((data) => data.name === item);
  if (obj) {
    nameDelete.value = item;
    isShowModalDelete.value = true;
  } else {
    formCategory.parent_id = [];
  }
};

const handleCloseModal = () => {
  nameDelete.value = "";
  isShowModalDelete.value = false;
};

const handleClearModal = () => {
  formCategory.parent_id = [];
  isShowModalDelete.value = false;
};

const handleDeleteCategory = async () => {
  try {
    loadingDataDelete.value = true;
    const obj = dataCategory.value.find(
      (data: any) => data.name === nameDelete.value
    );
    if (obj) {
      await CategoryRequest.deleteCategoryParent(obj.id);
      await getDataCategory();
    }
    isShowModalDelete.value = false;
    nameDelete.value = "";
    formCategory.parent_id = "";
    deleteSuccess();
  } catch (error: any) {
    if (error?.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error?.response?._data?.message);
    } else {
      deleteError();
    }
  } finally {
    loadingDataDelete.value = false;
  }
};

defineExpose({
  editCategory,
  createCategory,
  formRef,
});

onBeforeMount(async () => {
  if (storeUser.getTypeStore === RESTAURANT) {
    await getDataCategory();
  }
  if (id.value) {
    await detailCategory();
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-category) {
  width: 780px;

  .el-form-item {
    .el-form-item__label {
      width: 200px;
      justify-content: flex-start;
    }

    .el-form-item__content {
      .el-input,
      .el-textarea {
        width: 100%;
      }

      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .date-picker {
        width: 100%;

        .el-input {
          width: 100%;
        }
      }

      .el-textarea {
        min-height: 80px;

        .el-textarea__inner {
          min-height: 80px !important;
        }
      }
    }
  }
}
</style>
