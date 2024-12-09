<template>
  <div class="not-found">
    <h1>404</h1>
    <el-button type="primary" @click="$router.push({ name: 'index' })"
      >{{ $t("button.go_to_home") }}
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h1 {
    font-size: 10rem;
    line-height: 1;
    font-weight: 700;
  }
}
</style>
