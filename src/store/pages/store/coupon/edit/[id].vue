<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.edit_coupon") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.edit_coupon") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormCoupon ref="_refForm" :update="true" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :icon="IconDelete"
            :name="$t('button.delete')"
            @click="handleDelete"
          />
          <ButtonCreateOrUpdate
            :name="$t('button.save')"
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
import IconDelete from "~/../../src/store/components/Icon/Delete";

import { ref } from "vue";
import { Permission } from "~/../../src/shared/constants/permission";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  EVENT,
  MEDIAL_CARE,
  CLASSROOM,
  CONSULTATION,
} from "~/../../src/shared/constants/category";
useHavePermission(Permission.CouponEdit);
useHasTypeStore([RESTAURANT, EVENT, MEDIAL_CARE, CLASSROOM, CONSULTATION]);

const _refForm = ref();
const handleCreate = async () => {
  await _refForm.value.createOrUpdateCoupon(_refForm.value._refForm, true);
};

const handleDelete = async () => {
  await _refForm.value?.deleteRecord();
};
</script>

<style lang="scss" scoped>
@use "../src/store/assets/scss/variables" as *;

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
