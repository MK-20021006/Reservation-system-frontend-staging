<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_new_coupon") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.create_new_coupon") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormCoupon ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button text-right">
          <ButtonCreateOrUpdate
            :title="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
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

useHavePermission(Permission.CouponCreate);
useHasTypeStore([RESTAURANT, EVENT, MEDIAL_CARE, CLASSROOM, CONSULTATION]);

const _refForm = ref();
const handleCreate = async () => {
  await _refForm.value.createOrUpdateCoupon(_refForm.value._refForm);
};
</script>

<style lang="scss" scoped>
.group-button {
  display: block !important;
}
</style>
