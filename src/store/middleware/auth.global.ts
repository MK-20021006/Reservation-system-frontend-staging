import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { persistKeys } from "./../../shared/constants/persist-key";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const notAuthPages = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/store/registration-application",
    "/store/create",
    "/health-check",
    "/404",
    "/403",
    "/connect-zoom-manual",
  ];
  const token = useCookie(persistKeys.ACCESS_TOKEN).value;
  const redirect = useCookie(persistKeys.REDIRECT);

  if (notAuthPages.includes(to.path) && !token) {
    return;
  }

  if (!token) {
    redirect.value = to.fullPath;
    return navigateTo("/login");
  }

  if (
    notAuthPages.includes(to.path) &&
    token &&
    to.path !== "/connect-zoom-manual" &&
    to.name !== "store-create" &&
    to.name !== "store-registration-application"
  ) {
    return navigateTo("/");
  }
});
