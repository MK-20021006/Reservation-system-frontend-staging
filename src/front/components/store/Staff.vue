<template>
  <div class="detail-staff">
    <div class="staff-content-image">
      <img
        v-if="staff?.image?.file?.url"
        :src="staff?.image?.file?.url"
        alt=""
      />
      <img v-else src="../../assets/images/default_store.svg" alt="" />
    </div>
    <div class="staff-content-title">{{ staff?.name }}</div>
    <div class="staff-content-name">
      <div class="stylist">
        <el-popover
          placement="top-start"
          trigger="hover"
          width="250px"
          :teleported="false"
          :title="staff.position"
        >
          <template #reference>
            <div class="notice-content">
              {{ staff?.position }}
            </div>
          </template>
        </el-popover>
      </div>
      <div v-if="staff?.year_works" class="experience">
        （{{ $t("history") }} {{ staff?.year_works }}{{ $t("year") }}）
      </div>
    </div>
    <div class="staff-content-mark">
      <el-popover
        placement="top-start"
        trigger="hover"
        width="250px"
        :title="staff.info"
        :teleported="false"
      >
        <template #reference>
          <div class="notice-content">
            {{ staff?.info }}
          </div>
        </template>
      </el-popover>
    </div>
    <div class="hr"></div>
    <div class="staff-content-action">
      <ButtonRed :name="$t('detail')" @click="handleClick(staff?.id)" />
    </div>
  </div>
  <ModalStaff
    v-if="isShowModalDetailStaff"
    :data="staff"
    :dialog-visible="true"
    :title="$t('detail_staff')"
    :store-type="storeType"
    @handle-close="handleClose"
  ></ModalStaff>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch } from "vue";
import { StaffModel } from "~/../../src/front/models";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import { useRoute } from "nuxt/app";
interface Prop {
  staff: StaffModel;
  storeType: number;
}
const isShowModalDetailStaff = ref(false);
const route = useRoute();
const isDisabled = ref(false);
const props = defineProps<Prop>();
const { staff } = toRefs(props);
const emits = defineEmits(["handleClickStaff"]);

const handleClick = (id: number) => {
  isShowModalDetailStaff.value = true;
};

const handleClose = () => {
  isShowModalDetailStaff.value = false;
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;

.detail-staff {
  .staff-content-image {
    width: 100%;

    img {
      width: 100%;
      object-fit: cover;
      height: 226px;
    }
  }

  .staff-content-title {
    text-align: center;
    font-weight: bold;
    width: 100%;
    margin-top: 8px;
  }

  .staff-content-name {
    font-size: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .stylist {
      color: $red-40;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      max-width: 60%;
    }
  }

  .staff-content-mark {
    text-align: center;
    line-height: 22px;
    white-space: pre-line;
    width: 100%;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-box;
  }

  .hr {
    margin-top: 16px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.5);
    opacity: 0.5;
  }

  .staff-content-action {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    justify-items: center;

    .el-button {
      font-size: 10px;
      height: 32px;
      font-weight: 700;
    }
  }
}
</style>
