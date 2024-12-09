<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("management_company") }} </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" :is-hidden="true" />
      </span>
    </Teleport>
  </ClientOnly>
  <div class="company-introduction">
    <div class="company-introduction__box">
      <div class="company-introduction__header">
        <div class="company-introduction__header-item">
          <div class="company-introduction__header-item__title">
            {{ $t("introduction") }}
          </div>
          <div class="company-introduction__header-item__text">
            {{ $t("site_name") }}
          </div>
        </div>
        <div class="company-introduction__header-item">
          <div class="company-introduction__header-item__title-text">
            {{ $t("front.text_introduction") }}
          </div>
          <div class="company-introduction__header-item__content">
            <div class="company-introduction__header-item__content-desc">
              {{ $t("front.company_introduction") }}
            </div>
            <div class="company-introduction__header-item__content-title">
              {{ $t("about_us") }}
            </div>
          </div>
        </div>
      </div>
      <div class="company-introduction__body">
        <div class="company-introduction__body-item">
          <div class="company-introduction__body-item__label">
            {{ $t("company_name") }}
          </div>
          <div class="company-introduction__body-item__content">
            {{ $t("front.company_name_detail") }}
          </div>
        </div>
        <div class="company-introduction__body-item">
          <div class="company-introduction__body-item__label">
            {{ $t("front.representative") }}
          </div>
          <div class="company-introduction__body-item__content">
            {{ $t("front.name_director") }}
          </div>
        </div>
        <div class="company-introduction__body-item">
          <div class="company-introduction__body-item__label">
            {{ $t("front.founding") }}
          </div>
          <div class="company-introduction__body-item__content">
            {{ $t("front.date_establish_company") }}
          </div>
        </div>
        <div class="company-introduction__body-item">
          <div class="company-introduction__body-item__label">
            {{ $t("front.business_content") }}
          </div>
          <div class="company-introduction__body-item__content">
            <div>{{ $t("front.meo_measures") }}</div>
            <div>{{ $t("front.web_promotion") }}</div>
            <div>{{ $t("front.site_construction") }}</div>
            <div>{{ $t("front.seo_measures") }}</div>
            <div>{{ $t("front.measures_consulting") }}</div>
            <div>{{ $t("front.marketing_support") }}</div>
            <div>{{ $t("front.content_marketing") }}</div>
            <div>{{ $t("front.oa_solutions") }}</div>
          </div>
        </div>
        <div class="company-introduction__body-item">
          <div class="company-introduction__body-item__label">
            {{ $t("address") }}
          </div>
          <div class="company-introduction__body-item__content">
            <div>{{ $t("front.company_zipcode") }}</div>
            <div>{{ $t("front.company_address") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import { i18n } from "~/../../src/shared/plugins/i18n";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { onMounted } from "#imports";

const { t } = i18n.global;
const dataTitle = reactive([
  { name: t("breadcrumb.company_introduction"), path: "" },
]);
const deviceTable = useDeviceStore();
const device = computed(() => {
  return deviceTable.device;
});

onMounted(() => {
  scrollToTop();
});
</script>
<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.company-introduction {
  display: flex;
  justify-content: center;
  font-size: 13px;
  line-height: 24px;
  padding-top: 48px;
  padding-bottom: 64px;

  &__box {
    padding: 0 24.5%;
  }

  &__header-item {
    &__title-text {
      font-size: 15px;
      line-height: 22px;
    }

    &__title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
    }

    &__text {
      text-align: center;
      font-size: 14px;
      color: $black-40;
      margin-bottom: 40px;
    }

    &__content {
      border-top: $black-40 1px solid;
      border-bottom: $black-40 1px solid;
      padding: 16px 0;
      margin: 16px 0;
    }

    &__content-desc {
      color: $black-60;
    }

    &__content-title {
      color: $title-red;
      font-weight: 700;
      font-size: 15px;
      line-height: 22px;
      margin-top: 24px;
      text-align: center;
    }
  }

  &__body {
    background-color: $white-color;
    padding: 32px;
  }

  &__body-item {
    display: flex;
    margin-bottom: 20px;

    &__label {
      width: 24%;
      font-size: 13px;
      font-weight: 700;
    }

    &__content {
      width: 76%;
      padding-left: 100px;
      border-left: 2px solid $black-40;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .company-introduction {
    padding: 24px 0;

    &__box {
      padding: 0 8%;
    }

    &__body-item {
      &__label {
        width: 33%;
      }

      &__content {
        width: 67%;
        padding-left: 32px;
      }
    }
  }
}
</style>
