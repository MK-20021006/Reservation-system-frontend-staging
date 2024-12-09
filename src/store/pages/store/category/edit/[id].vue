<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("store.category_edit") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("store.category_edit") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-category
        :id="id"
        ref="formRef"
        @change-loading-data="changeLoadingData"
      >
      </form-category>
      <ModalConfirm
        :dialog-visible="modalDelete"
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
          <ButtonDelete
            :name="$t('button.delete')"
            class="btn-delete"
            :icon="IconDelete"
            @click="showModalDelete"
          />
          <ButtonCreateOrUpdate
            :name="$t('button.save')"
            :loading="loading"
            @click="editCategory"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import { categoryStore } from "../../../../store/useCategory";
import categoryRequest from "../../../../../shared/requests/CategoryRequest";
import { STORE_PAGINATION } from "../../../../../shared/constants/pagination";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import IconDelete from "../../../../components/Icon/Delete";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { i18n } from "~/../../src/shared/plugins/i18n";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);
useHavePermission(Permission.CategoryEdit);

const categoryTable = categoryStore();
const route = useRoute();
const router = useRouter();
const formRef = ref();
const modalDelete = ref(false);
const loadingDelete = ref(false);
const loading = ref(false);
const id = ref(null);
const { t } = i18n.global;
id.value = Number(route.params.id);

const changeLoadingData = (val) => {
  loading.value = val;
};

const showModalDelete = () => {
  modalDelete.value = true;
};

const editCategory = () => {
  formRef.value.editCategory(formRef.value.formRef);
};

const handleClose = () => {
  modalDelete.value = false;
};

const deleteCategory = async () => {
  loadingDelete.value = true;
  try {
    await categoryRequest.delete(id.value);
    await router.push("/store/category");
    deleteSuccess();
  } catch (error) {
    if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-category" });
    } else {
      deleteError();
    }
  } finally {
    modalDelete.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
