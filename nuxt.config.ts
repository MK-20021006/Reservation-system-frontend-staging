// https://v3.nuxtjs.org/api/configuration/nuxt.config
export const CommonConfig = {
  alias: {
    "@share": "/../../src/shared",
  },
  modules: [
    "@intlify/nuxt3",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
  ],
  plugins: [
    "../shared/plugins/el-plus.ts",
    "../shared/plugins/i18n.ts",
    "../shared/plugins/pinia-sync-browser.client.ts",
    "../shared/directive/index.ts",
    "../shared/plugins/emitter.ts",
  ],
  intlify: {
    localeDir: "locales",
    vueI18n: {
      locale: "ja",
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: "/api",
      urlRedirect: "",
      urlStore: "",
      urlCustomer: "",
      tokenUnivapay: "",
      emailForward: "",
      tokenSecret: "",
      environment: "",
      urlGooglePartner: "",
    },
  },
  css: ["assets/scss/index.scss", "~/../../src/shared/assets/scss/index.scss"],
  imports: {
    autoImport: false,
  },
  vite: {
    ssr: {
      noExternal: ["moment"],
    },
  },
  build: {
    transpile: ["echarts", "vue-echarts", "resize-detector"],
  },
  app: {
    head: {
      titleTemplate: "%s",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no",
        },
      ],
    },
  },
};

// @ts-ignore
export default defineNuxtConfig({
  ...CommonConfig,
});
