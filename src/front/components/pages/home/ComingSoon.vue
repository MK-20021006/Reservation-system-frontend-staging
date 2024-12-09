<template>
  <div class="container-coming-soon">
    <div class="text-title text-center">
      <IconWeAre class="text-we-are"></IconWeAre>
      <IconComingSoon class="text-coming"></IconComingSoon>
    </div>
    <div class="details">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse
      ultrices gravida maecenas accumsan.
    </div>
    <div class="date-coming">
      <div class="text-center">
        <div class="text-date">YYYY</div>
        <div class="text">年</div>
      </div>
      <div class="text-center">
        <div class="text-date">MM</div>
        <div class="text">月</div>
      </div>
      <div class="text-center">
        <div class="text-date">DD</div>
        <div class="text">日に公開</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../../assets/scss/variables" as *;
@use "~/../../src/shared/assets/scss/variables.scss";

.container-coming-soon {
  padding: 248px 0;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  background-image: url("../../../assets/images/bg-comingsoon.png");
  background-repeat: no-repeat;
  background-size: cover;

  .text-title {
    max-width: 100%;

    .text-coming {
      margin-left: 20px;
      margin-bottom: -31px;
      font-size: 10px;
    }
  }

  .details {
    padding-top: 44px;
    padding-bottom: 35px;
    text-align: center;
    max-width: 715px;
    align-content: center;
    color: $white-color;
  }

  .icon-text-date {
    max-width: 640px;
  }
  .date-coming {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: 130px;
    color: $white-color;
    font-family: variables.$fontFamily;
    .text-date {
      font-weight: 700;
      font-size: 64px;
      line-height: 80px;
    }
    .text {
      font-size: 16px;
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .container-coming-soon {
    padding: 140px 0;

    .text-title {
      max-width: 490px;

      .text-we-are {
        width: 181px;
        height: 93px;
      }

      .text-coming {
        width: 311px;
        height: 93px;
        margin-top: -18px;
      }
    }

    .date-coming {
      grid-column-gap: 25px;

      .text-date {
        font-weight: 700;
        font-size: 40px;
        line-height: 58px;
      }
    }

    .details {
      max-width: 490px;
      margin-top: 19px;
      padding: 24px 10px 0;
      margin-bottom: 32px;
    }
  }
}
</style>
