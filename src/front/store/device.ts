import { defineStore } from "pinia";
import { BreakPointDevice, DevicesEnum } from "~/../../src/shared/constants";

interface UserState {
  device: DevicesEnum;
  heightMenu: number;
  breakPoint: number;
  heightCourse: number;
}

export const useDeviceStore = defineStore("device", {
  state: () =>
    ({
      device: DevicesEnum.DESKTOP_DEVICE,
      breakPoint: BreakPointDevice.XL,
      heightMenu: 72,
      heightCourse: 0,
    } as UserState),
  actions: {
    isMobile() {
      return this.device === DevicesEnum.MOBILE_DEVICE;
    },
    isIpadMini() {
      return this.device === DevicesEnum.IPAD_MINI;
    },
  },
});
