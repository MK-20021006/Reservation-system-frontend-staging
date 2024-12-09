import {
  SALON,
  RESTAURANT,
  MEDIAL_CARE,
  EVENT,
  CONSULTATION,
  CLASSROOM,
} from "~/../../src/shared/constants/category";

export const getNameBookMark = (type: number) => {
  let title = "";
  switch (type) {
    case RESTAURANT:
      title = "restaurant";
      break;
    case MEDIAL_CARE:
      title = "medial_care";
      break;
    case CLASSROOM:
      title = "classroom";
      break;
    case CONSULTATION:
      title = "consultation";
      break;
    case EVENT:
      title = "event";
      break;
    default:
      title = "beauty_salon";
      break;
  }
  return title;
};
