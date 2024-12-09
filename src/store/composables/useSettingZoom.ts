import { useRouter } from "#imports";
import { ref } from "vue";
import { useMeStore } from "~/../../src/shared/stores/me";

export default function useSettingZoom() {
  const router = useRouter();
  const meStore = useMeStore();
  const hasPerm = ref(false);

  if (meStore.isSettingZoom) {
    hasPerm.value = true;
    return hasPerm;
  }
  return router.push({ name: "403" });
}
