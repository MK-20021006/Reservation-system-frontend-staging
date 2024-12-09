<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.seat_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.seat_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormSeat ref="_refForm" />
    </template>
    <template v-if="_refForm?.checkNotSiteCrawl()" #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :name="$t('button.delete')"
            :disabled="_refForm?.loadingAvatar"
            :icon="IconDelete"
            @click="handleDelete"
          />
          <ButtonCreateOrUpdate
            :loading="_refForm?.isLoadingAction"
            :disabled="_refForm?.loadingAvatar"
            @click="handleUpdate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "../../../../../shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "../../../../../shared/components/button/ButtonDelete.vue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import IconDelete from "../../../../components/Icon/Delete";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { RESTAURANT } from "~/../../src/shared/constants/category";

useHavePermission(Permission.SeatEdit);
useHasTypeStore([RESTAURANT]);

const _refForm = ref();

const handleUpdate = async () => {
  await _refForm.value.createOrUpdateSeat(_refForm.value._formRef, true);
};

const handleDelete = async () => {
  await _refForm.value.deleteRecord();
};
</script>
