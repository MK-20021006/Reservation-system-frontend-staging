<template>
  <div class="box-phone">
    <div class="phone-info">
      <div class="phone-number">
        <div><icon-phone-fill /></div>
        <div class="phone">{{ phone }}</div>
      </div>
      <div class="text">
        {{ $t("front.phone_information") }}
        {{ $t("front.phone_contact") }}
      </div>
    </div>
    <ButtonRed
      class="pc"
      :disabled="isDisabled"
      :name="$t('button.add_store')"
      @click="handleClick"
    />
    <IconLine
      v-if="lineQrCode"
      class="mobile button-qrcode"
      @click="handleClickQr"
    />
    <ButtonRed
      class="mobile"
      :disabled="isDisabled"
      :name="$t('button.phone_contact')"
      @click="handleClick"
    />
  </div>

  <div v-if="lineQrCode">
    <ViewQRCode
      :dialog-visible="centerDialogVisible"
      :line-qr-code="lineQrCode"
      @handle-close-view="handleCloseView"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonRed from "../../../shared/components/button/ButtonRed.vue";
import IconLine from "~/../../src/shared/components/icon/Line.vue";
import ViewQRCode from "~/../../src/front/components/modal/ViewQRCode";
import { ref } from "vue";

interface Prop {
  phone?: number | string;
  isDisabled?: boolean;
  lineQrCode?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  phone: "",
  isDisabled: false,
  lineQrCode: "",
});

const { phone, lineQrCode } = toRefs(props);
const emits = defineEmits(["handleClick"]);
const centerDialogVisible = ref(false);

const handleCloseView = () => {
  centerDialogVisible.value = false;
};

const handleClickQr = () => {
  window.open(lineQrCode.value, "_blank");
};

const handleClick = () => {
  emits("handleClick");
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.box-phone {
  background: $white-color;
  width: 100%;
  max-width: 330px;
  padding: 20px;
  border: 1px solid $gray-100;
  border-radius: 3px;
  text-align: center;
  align-items: center;

  .button-qrcode {
    cursor: pointer;
  }

  .phone-info {
    .phone-number {
      display: flex;
      align-item: center;

      .phone {
        font-size: 18px;
        font-weight: 800;
      }

      :deep(svg) {
        margin-right: 9px;
        width: 15px;
        height: 15px;
      }
    }

    .text {
      font-size: 11px;
      line-height: 20px;
      text-align: left;
    }
  }

  button {
    width: 100%;
    margin-top: 8px;
  }

  .mobile {
    display: none;
  }
}

@include res("sm-only", $breakpoints-spec) {
  .box-phone {
    padding: 24px 30px 24px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .box-phone {
    display: flex;
    width: 100%;
    padding: 8px;
    justify-content: space-between;
    max-width: 100%;
    text-align: unset;

    .phone-info {
      width: 40%;
      font-size: 8px;

      .phone-number {
        display: flex;
        align-items: flex-start;

        .phone {
          font-size: 16px;
          font-weight: 800;
        }

        :deep(svg) {
          margin-right: 9px;
          width: 15px;
          height: 15px;
        }
      }

      .text {
        line-height: 14px;
      }
    }

    button {
      width: 40%;
      margin-top: 0;
    }

    .button-qrcode {
      display: block;
      width: 20%;
    }

    .el-button {
      margin-left: 0;
    }

    .pc {
      display: none;
    }

    .mobile {
      display: unset;
    }
  }
}
</style>
