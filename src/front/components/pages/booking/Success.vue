<template>
  <div class="payment-success-container">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("payment.done") }}</Title>
    </Head>
    <div class="icon-success">
      <complete class="check-icon" />
    </div>
    <div class="store-name font-weight-500">{{ dataComplete?.store_name }}</div>
    <div class="course-name">{{ dataName }}</div>
    <div class="price font-weight-500">
      {{ priceDisplay(dataComplete?.amount) }}{{ $t("yen") }}
    </div>
    <div class="group-button">
      <button-gray
        :name="$t('front.button.back_to_reservation_list')"
        :width="'178px'"
        @click="$router.push({ name: 'reservation' })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Complete from "~/../../src/front/components/Icon/Complete.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { onMounted, computed, toRefs } from "#imports";
import { defineProps } from "vue";
import scrollToTop from "~/../../src/shared/utils/scroll";

interface Data {
  course_name?: string;
  staff_name?: string;
  event_name?: string;
  menu: [];
}
interface Prop {
  dataComplete: Data;
}

const props = defineProps<Prop>();
const { dataComplete } = toRefs(props);

const dataName = computed(() => {
  const arr = [];
  if (dataComplete.value?.course_name) {
    arr.push(dataComplete.value.course_name);
  }

  if (dataComplete.value?.event_name) {
    arr.push(dataComplete.value.event_name);
  }
  if (dataComplete.value?.menu && dataComplete.value?.menu.length > 0) {
    dataComplete.value.menu.filter((item: any) => {
      arr.push(item.name);
    });
  }
  return arr.join(" 、");
});

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.payment-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

  .title {
    font-size: 20px;
  }

  .icon-success {
    margin-bottom: 40px;

    .check-icon {
      height: 220px;
      width: 220px;
    }
  }

  .store-name {
    font-size: 24px;
    line-height: 38px;
  }

  .course-name {
    font-size: 16px;
    padding: 8px 0 32px 0;
  }

  .price {
    font-size: 36px;
    line-height: 38px;
    padding-bottom: 32px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .payment-success-container {
    .icon-success {
      margin: 24px 0 32px 0;

      .check-icon {
        height: 160px;
        width: 160px;
      }
    }
  }
}
</style>
