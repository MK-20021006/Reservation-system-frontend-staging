<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title v-if="meStore.typeStore !== SALON">
          {{ $t("site_name_title") }}{{ $t("store.course_edit") }}
        </Title>
        <Title v-else>
          {{ $t("site_name_title") }}{{ $t("title_screen.edit_coupon") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div v-if="meStore.typeStore !== SALON" class="category-header">
            {{ $t("store.course_edit") }}
          </div>
          <div v-else class="category-header">
            {{ $t("title_screen.edit_coupon") }}
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-course
        :id="id"
        ref="formRef"
        @change-loading-data="changeLoadingData"
      >
      </form-course>
      <ModalConfirm
        :dialog-visible="modalDelete"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteCourse"
      />
    </template>
    <template v-if="formRef?.checkNotSiteCrawl()" #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :name="$t('button.delete')"
            :icon="IconDelete"
            @click="showModalDelete"
          />
          <ButtonCreateOrUpdate
            :name="$t('button.save')"
            :loading="loading"
            @click="editCourse"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import { menuStore } from "../../../../store/useMenu";
import CourseRequest from "../../../../../shared/requests/CourseRequest";
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
import StoreRequest from "~/../../src/shared/requests/StoreRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
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
useHavePermission(Permission.CourseEdit);

const menuTable = menuStore();
const route = useRoute();
const router = useRouter();
const formRef = ref();
const modalDelete = ref(false);
const loadingDelete = ref(false);
const loading = ref(false);
const id = ref<null | number>(null);
id.value = Number(route.params.id);
const meStore = useMeStore();

const changeLoadingData = (val: boolean) => {
  loading.value = val;
};

const showModalDelete = () => {
  modalDelete.value = true;
};

const editCourse = () => {
  formRef.value.editCourse(formRef.value.formRef);
};

const handleClose = () => {
  modalDelete.value = false;
};

const deleteCourse = async () => {
  loadingDelete.value = true;
  try {
    await CourseRequest.delete(id.value);
    await formRef.value.getStepSetting();
    await router.push("/store/course");
    deleteSuccess();
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError(error.response?._data?.message);
    } else if (error.response?.status === STATUS_CODE.NOT_FOUND) {
      messageError("errors.cant_be_performed");
      await router.push({ name: "store-course" });
    } else {
      deleteError();
    }
  } finally {
    modalDelete.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
