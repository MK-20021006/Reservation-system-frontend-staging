<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.detail_device") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.detail_device") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormDevice :id="id" ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            :name="$t('button.delete')"
            class="btn-delete"
            :icon="IconDelete"
            :loading="loadingDelete"
            @click="showModalDelete"
          />
          <ButtonCreateOrUpdate
            :loading="_refForm?.isLoadingAction"
            @click="editDevice"
          />
        </div>
      </div>
      <ModalConfirm
        :dialog-visible="modalDelete"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteDevice"
      />
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "nuxt/app";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import IconDelete from "~/../../src/admin/components/Icon/IconDelete.vue";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";

useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const route = useRoute();
const loadingDelete = ref(false);
const modalDelete = ref(false);
const _refForm = ref();
const id = ref(null);
id.value = Number(route.params.id);

const editDevice = async () => {
  await _refForm.value.editDevice(_refForm.value._formRef);
};

const handleClose = () => {
  modalDelete.value = false;
};

const showModalDelete = () => {
  modalDelete.value = true;
};

const deleteDevice = async () => {
  try {
    loadingDelete.value = true;
    await _refForm.value.deleteDevice(id.value);
  } catch (e) {
    return e;
  } finally {
    modalDelete.value = false;
    loadingDelete.value = false;
  }
};
</script>
