<template>
  <client-only>
    <el-scrollbar>
      <div class="container-guest">
        <slot />
      </div>
    </el-scrollbar>
  </client-only>
</template>

<style>
.container-guest {
  min-width: 1366px;
}
</style>
