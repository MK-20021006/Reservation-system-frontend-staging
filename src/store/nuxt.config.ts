import { CommonConfig } from "~/../../nuxt.config";

// @ts-ignore
export default defineNuxtConfig({
  ...CommonConfig,
  plugins: [...CommonConfig.plugins, "../shared/plugins/chart.ts"],
  nitro: {
    preset: "node-server",
  },
});
