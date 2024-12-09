<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title> {{ $t("site_name_title") }}{{ $t("store.menu_edit") }} </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("store.menu_edit") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-menu
        :id="id"
        ref="formRef"
        @change-loading-data="changeLoadingData"
      >
      </form-menu>
      <ModalConfirm
        :dialog-visible="modalDelete"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteMenu"
      />
    </template>
    <template #footer>
      <div class="footer divider">
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
            @click="editMenu"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import { menuStore } from "../../../../store/useMenu";
import MenuRequest from "../../../../../shared/requests/MenuRequest";
import { STORE_PAGINATION } from "~~/../../src/shared/constants/pagination";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import IconDelete from "../../../../components/Icon/Delete";
import {
  deleteError,
  deleteSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
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
useHavePermission(Permission.MenuEdit);

const menuTable = menuStore();
const route = useRoute();
const router = useRouter();
const formRef = ref();
const modalDelete = ref(false);
const loadingDelete = ref(false);
const loading = ref(false);
const id = ref(null);
id.value = Number(route.params.id);

const changeLoadingData = (val) => {
  loading.value = val;
};

const showModalDelete = () => {
  modalDelete.value = true;
};

const editMenu = () => {
  formRef.value.editMenu(formRef.value.formRef);
};

const handleClose = () => {
  modalDelete.value = false;
};

const deleteMenu = async () => {
  loadingDelete.value = true;
  try {
    await MenuRequest.delete(id.value);
    await router.push("/store/menu");
    deleteSuccess();
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error.response?._data?.message);
    } else if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-menu" });
    } else {
      deleteError();
    }
  } finally {
    modalDelete.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
