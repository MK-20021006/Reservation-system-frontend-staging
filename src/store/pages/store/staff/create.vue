<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_staff") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.create_staff") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormStaff ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button text-right">
          <ButtonCreateNew
            :title="'button.save'"
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
import ButtonCreateNew from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import { ref } from "vue";
import { Permission } from "~/../../src/shared/constants/permission";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";

useHavePermission(Permission.StaffCreate);
useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const _refForm = ref();
const handleCreate = async () => {
  await _refForm.value.createOrUpdateStaff(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.group-button {
  display: block !important;
}
</style>
