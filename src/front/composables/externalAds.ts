import { useCookie } from "nuxt/app";

import guestAdSenseRequest from "../../shared/requests/GuestAdSenseRequest";
import { ExternalAdsStore } from "../../front/store/externalAds";
import { IAds } from "../models";
import { persistKeys } from "../../shared/constants/persist-key";
import { TYPE_PORTAL } from "../../shared/constants/category";

/**
 * Fetch data banner ads from server
 */
export const fetchExternalAds = async (
  options = {
    forceFetch: false,
  },
  storeId?: number | null
) => {
  const externalAdsStore = ExternalAdsStore();
  if (options.forceFetch === true) {
    externalAdsStore.setAds([]);
  }

  const typeStore = useCookie(persistKeys.MENU).value || TYPE_PORTAL;

  const res = await guestAdSenseRequest.getAdsStore(storeId, Number(typeStore));
  if (res && res.length > 0) {
    res.forEach((item: IAds) => {
      externalAdsStore.pushAds(item);
    });
  }
};
