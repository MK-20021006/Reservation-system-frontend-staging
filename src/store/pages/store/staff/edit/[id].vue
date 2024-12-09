<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.detail_staff") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.detail_staff") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormStaff ref="_refForm" :update="true" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :name="$t('button.delete')"
            @click="handleDelete"
          />
          <ButtonCreateOrUpdate
            :disabled="_refForm?.disabledEdit || _refForm?.loadingImage"
            :loading="_refForm?.isLoadingAction"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import { useRouter } from "#imports";
import { ref } from "vue";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";

useHavePermission(Permission.StaffEdit);
useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const _refForm = ref();
const router = useRouter();
const handleCreate = async () => {
  await _refForm.value.createOrUpdateStaff(_refForm.value._formRef, true);
};
const handleDelete = async () => {
  await _refForm.value?.deleteRecord();
};
</script>

<style lang="scss" scoped>
@use "../src/admin/assets/scss/variables" as *;

.btn-delete {
  background-color: $white-color;

  &:hover {
    border-color: $gray-100 !important;
    background-color: $gray-100;
    color: $black-80;
  }

  :deep(i) {
    font-size: 21px !important;
  }
}
</style>
