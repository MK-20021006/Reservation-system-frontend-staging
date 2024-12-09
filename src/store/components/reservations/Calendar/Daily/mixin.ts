import moment from "moment";

const minuteSpace = 15;

/**
 * Get time moment at part calendar
 *
 * @param hour string
 * @param part number
 *
 * @return
 */
export const getMomentPart = (hour: string, part: number) => {
  return moment(hour, "HH:mm")
    .add(part * minuteSpace, "minutes")
    .format("HH:mm");
};
