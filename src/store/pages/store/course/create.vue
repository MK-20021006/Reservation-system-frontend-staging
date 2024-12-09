<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title v-if="meStore.typeStore !== SALON">
          {{ $t("site_name_title") }}{{ $t("store.course_create") }}
        </Title>
        <Title v-else>
          {{ $t("site_name_title") }}{{ $t("title_screen.create_new_coupon") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div v-if="meStore.typeStore !== SALON">
              {{ $t("store.course_create") }}
            </div>
            <div v-else>{{ $t("title_screen.create_new_coupon") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-course ref="_formRef" @change-loading-data="updateLoading" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <div />
          <ButtonCreateOrUpdate
            title="button.save"
            :loading="loading"
            @click="createCourse"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import { useMeStore } from "~/../../src/shared/stores/me";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const loading = ref(false);
const _formRef = ref();
const meStore = useMeStore();

const createCourse = async () => {
  await _formRef.value.createCourse(_formRef.value.formRef);
};

const updateLoading = (value) => {
  loading.value = value;
};
</script>

<style lang="scss" scoped></style>
