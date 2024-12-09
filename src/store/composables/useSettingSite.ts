import { useRouter } from "#imports";
import { ref } from "vue";
import { useMeStore } from "~/../../src/shared/stores/me";

export default function useSettingSite() {
  const router = useRouter();
  const meStore = useMeStore();
  const hasPerm = ref(false);

  if (meStore.isSettingExternalSite || meStore.isSettingLine) {
    hasPerm.value = true;
    return hasPerm;
  }
  return router.push({ name: "403" });
}
