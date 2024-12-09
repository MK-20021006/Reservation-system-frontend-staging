<template>
  <div id="calendar-screen">
    <slot name="head" />
    <slot name="header-content" />
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/../../src/admin/assets/scss/variables.scss" as *;

#calendar-screen {
  height: 100%;

  .content {
    background-color: $white-color;
    height: calc(100% - 40px - 10px);
    padding: 20px;
  }
}
</style>
