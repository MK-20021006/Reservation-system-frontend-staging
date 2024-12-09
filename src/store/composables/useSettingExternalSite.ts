import { ref } from "vue";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import { STATUS_CONNECT } from "~/../../src/shared/constants";
import { RESTAURANT } from "~/../../src/shared/constants/category";

export default async function useSettingExternalSite(
  isSettingExternalSite: boolean,
  typeStore: number
) {
  const statusSettingExternalSite = ref(false);
  if (!isSettingExternalSite) {
    return statusSettingExternalSite.value;
  }
  if (typeStore === RESTAURANT) {
    let responseTabelog, responseGurunavi, responseHotPepper;

    try {
      responseTabelog = await storeSettingRequest.getTabelogSetting();
      if (responseTabelog?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
        statusSettingExternalSite.value = true;
        return statusSettingExternalSite.value;
      }
    } catch (_) {
    } finally {
    }

    try {
      responseGurunavi = await storeSettingRequest.getGurunaviSetting();
      if (responseGurunavi?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
        statusSettingExternalSite.value = true;
        return statusSettingExternalSite.value;
      }
    } catch (_) {
    } finally {
    }

    try {
      responseHotPepper = await storeSettingRequest.getHotPepperSetting();
      if (responseHotPepper?.data?.status === STATUS_CONNECT.SUCCESSFUL) {
        statusSettingExternalSite.value = true;
        return statusSettingExternalSite.value;
      }
    } catch (_) {
    } finally {
    }
  }

  return statusSettingExternalSite.value;
}
