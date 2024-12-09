<template>
  <footer>
    <div>
      <div class="inner-footer" :class="{ 'is-disable-click': isDisabled }">
        <div class="left">
          <div class="'user-not-logged'">
            <div class="left-title">
              <h1>{{ $t("title_customer_register_store") }}</h1>
            </div>
            <div class="description left-description">
              <p>
                {{ $t("content_customer_register_store") }}
              </p>
            </div>
            <div class="left-button">
              <el-button @click="introductionStore">
                <IconStore />
                <p class="hidden-text-mobile">
                  {{ $t("customer_register_store") }}
                </p>
                <p class="show-text-mobile">
                  {{ $t("customer_register_store_mobile") }}
                </p>
                <IconNextRegister />
              </el-button>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-title">
            <h1>{{ $t("register_store") }}</h1>
          </div>
          <div class="description right-description">
            <p>
              {{ $t("description_register_store_1") }}
            </p>
            <p>
              {{ $t("description_register_store_2") }}
            </p>
          </div>
          <div class="right-button">
            <el-button @click="registerStore">
              <IconStore />
              <p class="hidden-text-mobile">{{ $t("go_to_register_store") }}</p>
              <p class="show-text-mobile">
                {{ $t("register") }}
              </p>
              <IconNextRegister />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <div class="info" :class="{ 'is-disable-click': isDisabled }">
    <div class="logo">
      <big-arxia class="hidden-md-and-down" />
      <ArxiaLogoMobile class="hidden-lg-and-up" />
    </div>
    <div class="policy">
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'index' })"
      >
        <IconHomeWhite />
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="handleBackTerm('https://jp.ar-xia.com/terms/')"
      >
        {{ $t("term_of_service") }}
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'privacy' })"
      >
        {{ $t("privacy_policy") }}
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="handleBackTerm('https://jp.ar-xia.com/legal-notice/')"
      >
        {{ $t("transaction_law") }}
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page border-right"
        @click="$router.push({ name: 'frequent-question' })"
      >
        {{ $t("help_contact") }}
      </div>
      <div class="border-space"></div>
      <div
        class="policy-link__page"
        @click="$router.push({ name: 'company-introduction' })"
      >
        {{ $t("management_company") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRuntimeConfig } from "nuxt/app";
import BigArxia from "~/../../src/shared/components/icon/BigArxia.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import ArxiaLogoMobile from "~/../../src/shared/components/icon/ArxiaLogoMobile.vue";
import { useRoute } from "#imports";

const isDisabled = ref(false);
const route = useRoute();
const router = useRouter();
const meStore = useMeStore();
const registerStore = () => {
  const config = useRuntimeConfig();
  window.open(`${config.urlStore}store/registration-application`, "_blank");
};

const introductionStore = () => {
  router.push("/introduction-store");
};

const handleBackTerm = (url: string) => {
  window.open(url, "_blank");
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.is-disable-click {
  pointer-events: none;
}

footer {
  z-index: 2026;
  color: $white-color;
  height: 320px;
  background-color: $background-logo;

  .hidden-text-mobile {
    display: block;
  }

  .show-text-mobile {
    display: none;
  }

  .inner-footer {
    padding: 0 12.5%;
    display: flex;
    gap: 16px;
    justify-content: space-between;

    .left,
    .right {
      width: 343px;
      margin-top: 35px;

      .right-description,
      .left-description {
        height: 60px;
      }

      h1 {
        font-size: 24px;
        line-height: 30px;
        font-weight: 500;
        margin-bottom: 32px;
      }

      .description {
        margin-bottom: 24px;
        p {
          line-height: 24px;
        }
      }

      .address {
        margin-bottom: 16px;
      }
    }

    .right,
    .left {
      text-align: left;

      :deep(.el-button) {
        height: 48px;
        width: 232px;
        border-radius: 50px;
        padding: 16px 32px;
        color: #d70035;
        font-weight: 500;
        font-size: 16px;

        &:hover {
          svg {
            path {
              fill: $white-color;
            }
          }
        }

        span {
          gap: 9px;
        }
      }
    }

    .left {
      :deep(.el-button) {
        color: #b4985c;

        svg path {
          fill: #b4985c;
        }

        &:hover {
          background-color: #b4985c;
          color: white;
        }
      }
    }

    .right {
      :deep(.el-button) {
        background: #ececec;
        border: 2px solid #ececec;

        &:hover {
          background-color: #d70035;
          color: white;
        }
      }
    }
  }
}

.info {
  z-index: 2026;
  border-top: 1px solid $white-30;
  padding: 4px 12.5%;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  .logo {
    display: flex;
    svg {
      height: 48px;
      width: 100%;
    }
  }

  .policy {
    display: flex;
    flex-wrap: wrap;
    color: $white-color;
    align-items: center;

    .policy-link__page {
      cursor: pointer;
    }

    a {
      color: white;
      text-decoration: none;
    }

    .border-right {
      display: flex;
      align-items: center;
    }

    .border-space {
      height: 16px;
      width: 1px;
      background-color: $white-20;
      margin: 0 16px;
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  footer {
    height: auto;
    padding-bottom: 36px;
    background-position: right 50% bottom 100%;
    background-size: cover;

    .inner-footer {
      padding: 0 12.5%;

      .left,
      .right {
        margin-top: 45px;

        h1 {
          margin-bottom: 32px;
        }

        .address {
          margin-bottom: 14px;
        }
      }
    }
  }

  .info {
    padding: 4px 12.5%;

    .policy {
      gap: 24px;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  footer {
    z-index: inherit;

    .hidden-text-mobile {
      display: none;
    }

    .show-text-mobile {
      display: block;
    }

    h1 {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 32px;
    }

    .inner-footer {
      padding: 0 16px;

      .left {
        margin-top: 0;

        :deep(.el-button) {
          font-size: 14px;
          height: 30px;
          width: 130px;
        }
      }
      .right,
      .left {
        margin-top: 40px;

        .right-description,
        .left-description {
          height: 100px;
          font-size: 12px;
        }

        :deep(.el-button) {
          font-size: 14px;
          height: 30px;

          width: 130px;
        }

        h1 {
          font-size: 16px;
          margin-bottom: 16px;
          line-height: 30px;
        }

        .email {
          display: flex !important;
        }

        .address {
          margin-bottom: 14px;
        }
      }
      .right {
        align-self: end;
      }
    }
  }
  .info {
    padding: 24px 16px;

    .logo {
      svg {
        width: 200px;
        height: 100%;
      }
    }

    .policy {
      gap: 16px 0;
    }
  }
}
</style>
