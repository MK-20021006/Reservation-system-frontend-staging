<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("title_screen.privacy") }} </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" :is-hidden="true" />
      </span>
    </Teleport>
  </ClientOnly>
  <div class="privacy">
    <div class="box-privacy">
      <div class="header-privacy">
        <div class="header-privacy__title">{{ $t("privacy_policy") }}</div>
        <div class="header-privacy__text">{{ $t("site_name") }}</div>
      </div>
      <div class="main-privacy">
        <div class="main-privacy__introduction">
          {{ $t("front.privacy.company_privacy") }}
        </div>
        <div class="main-privacy__content">
          <div class="main-privacy__title">
            {{ $t("front.privacy.collected_user") }}
          </div>
          <div class="main-privacy__body">
            <div>
              {{ $t("front.privacy.policy_user") }}
            </div>
            <div class="main-privacy__body-title">
              <div>{{ $t("front.privacy.information_provided_1") }}</div>
              <div>
                {{ $t("front.privacy.use_service_user") }}
              </div>
            </div>
            <div>・{{ $t("full_name") }}</div>
            <div>・{{ $t("email_address") }}</div>
            <div>・{{ $t("phone_number") }}</div>
            <div>・{{ $t("credit_card_information") }}</div>
            <div>・{{ $t("front.privacy.input_form_specified") }}</div>
            <div class="main-privacy__body-title">
              <div>
                {{ $t("front.privacy.information_provided_2") }}
              </div>
              <div>
                {{ $t("front.privacy.permits_cooperation") }}
              </div>
            </div>
            <div>・{{ $t("front.privacy.relevant_external_service") }}</div>
            <div>・{{ $t("front.privacy.permitted_to_disclose") }}</div>
            <div class="main-privacy__body-title">
              <div>
                {{ $t("front.privacy.user_use_service") }}
              </div>
              <div>
                {{ $t("front.privacy.information_regarding") }}
              </div>
              <div>{{ $t("front.privacy.include_information") }}</div>
            </div>
            <div>・{{ $t("front.privacy.device_information") }}</div>
            <div>・{{ $t("front.privacy.log_information") }}</div>
            <div>・{{ $t("front.privacy.anonymous") }}</div>
          </div>
        </div>

        <div class="main-privacy__content">
          <div class="main-privacy__title">
            {{ $t("front.privacy.purpose_of_use") }}
          </div>
          <div class="main-privacy__body">
            <div>
              {{ $t("front.privacy.service_as_stipulated") }}
            </div>
            <div class="main-privacy__body-title">
              <div>
                {{ $t("front.privacy.specific_purposes") }}
              </div>
            </div>
            <div>
              {{ $t("front.privacy.to_provide_maintain") }}
            </div>
            <div>
              {{ $t("front.privacy.to_provide_guidance") }}
            </div>
            <div>
              {{ $t("front.privacy.violate_our_terms") }}
            </div>
            <div>{{ $t("front.privacy.change_to_term") }}</div>
            <div>{{ $t("front.privacy.purposes_of_use") }}</div>
            <div class="main-privacy__body-title">
              <div>{{ $t("front.privacy.purposes_of_use_other") }}</div>
            </div>
          </div>
        </div>

        <div class="main-privacy__content">
          <div class="main-privacy__title">
            {{ $t("front.privacy.method_of_notification") }}
          </div>
          <div class="main-privacy__body">
            <div>
              {{ $t("front.privacy.shall_be_obtained") }}
            </div>
            <div class="main-privacy__body-title">
              <div>・{{ $t("front.privacy.device_information_3") }}</div>
            </div>
            <div>
              {{ $t("front.privacy.prescribed_settings") }}
            </div>
          </div>
        </div>

        <div class="main-privacy__content">
          <div class="main-privacy__title">
            {{ $t("front.privacy.party_provision") }}
          </div>
          <div>
            {{ $t("front.privacy.provide_personal_information") }}
          </div>
          <div class="main-privacy__body">
            <div>
              {{ $t("front.privacy.consent_before_it") }}
            </div>
            <div class="main-privacy__body-title"></div>
            <div>
              {{ $t("front.privacy.company_outsources_all") }}
            </div>
            <div>
              {{ $t("front.privacy.personal_information") }}
            </div>
            <div>
              {{ $t("front.privacy.necessary_to_cooperate") }}
            </div>
            <div>{{ $t("front.privacy.other_cases_permitted") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import { i18n } from "~/../../src/shared/plugins/i18n";
import scrollToTop from "~/../../src/shared/utils/scroll";

const { t } = i18n.global;
const dataTitle = reactive([{ name: t("breadcrumb.privacy"), path: "" }]);
const deviceTable = useDeviceStore();
const device = computed(() => {
  return deviceTable.device;
});

onMounted(() => {
  scrollToTop();
});
</script>

<style scoped lang="scss">
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.privacy {
  font-size: 14px;
  display: flex;
  justify-content: center;
  line-height: 22px;
  margin-bottom: 64px;
  margin-top: 48px;
  color: $black-80;

  .box-privacy {
    padding: 0 19.1%;

    .header-privacy {
      text-align: center;
      line-height: 24px;

      &__title {
        font-size: 20px;
        font-weight: 700;
      }

      &__text {
        color: $black-40;
        font-size: 14px;
      }
    }

    .main-privacy {
      &__introduction {
        margin-top: 40px;
        font-size: 15px;
      }

      &__title {
        color: $title-red;
        font-weight: 700;
        margin-top: 32px;
        margin-bottom: 10px;
      }

      &__body-title {
        margin: 20px 0;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .privacy {
    .box-privacy {
      padding: 0 6.3%;
    }
  }
}
</style>
