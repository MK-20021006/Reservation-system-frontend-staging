import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { persistKeys } from "./../../shared/constants/persist-key";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const redirect = useCookie(persistKeys.REDIRECT, {
    secure: true,
    sameSite: "none",
  });
  const token = useCookie(persistKeys.ACCESS_TOKEN, {
    secure: true,
    sameSite: "none",
  });
  if (!token.value) {
    redirect.value = to.fullPath;
    return navigateTo("/login");
  }
});
