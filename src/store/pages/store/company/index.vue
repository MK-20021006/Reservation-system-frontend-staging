<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("dashboard") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("dashboard") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div>Content</div>
    </template>
  </ListScreenComponent>
</template>
