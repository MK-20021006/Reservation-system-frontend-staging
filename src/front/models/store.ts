import { ModelHasFile, ModelHasType } from "~/../../src/shared/models";
import {
  Seat,
  Menu,
  Course,
  StaffModel,
  MenuCategory,
} from "~/../../src/front/models";
import { Contract } from "~/../../src/shared/models/plan";

export interface Store {
  address: string;
  description?: string;
  email: string;
  id: number;
  introduction?: string;
  max_capacity: number;
  min_capacity: number;
  name: string;
  phone_number: string;
  postal_code: string;
  shipping_method: string;
  store_manager: { [key: string | number]: string | number };
  store_manager_id: number;
  is_setting_cancel?: boolean;
  cancellation?: string;
  note?: string;
  code: string;
  line_setting: LineSetting[];
  opening_times: OpeningTime[];
  closing_times: ClosingTime[];
  staffs: StaffModel[];
  seats: Seat[];
}
interface LineSetting {
  id: number;
  qr_code_url: string;
  store_id: number;
}
interface ReviewInterface {
  avg: number;
  count_review: number;
  sum_star: number;
  store_id: number;
}

interface Event {
  id: number;
  store_id: number;
  name: string;
  model_has_file: ModelHasFile[];
}

export interface OpeningTime {
  id: number;
  day_of_week: number;
  start: string;
  end: string;
}

export interface ClosingTime {
  id: number;
  day_off: number | string;
  store_id: string;
}

export interface DetailStore {
  email: string;
  email_for_notification_reception: string;
  tag: any[];
  latitude: string;
  link_google_map: string;
  longitude: string;
  agent_code: string;
  area: string;
  seats: Seat[];
  model_has_file: ModelHasFile[];
  model_has_tag: ModelHasFile[];
  menu_categories: MenuCategory[];
  model_has_type: ModelHasType;
  opening_times: OpeningTime[];
  transportation: string;
  address: string;
  address_detail: string;
  cancellation: string;
  closing_times: ClosingTime[];
  comment_opening_time: string;
  courses: Course[];
  description: string;
  first_company_name: string;
  first_company_name_kana: string;
  home_page: string;
  id: number;
  iframe_google_map: string;
  introduction: string;
  last_company_name: string;
  last_company_name_kana: string;
  name: string;
  news: string;
  note: string;
  is_setting_cancel: number;
  max_price: number;
  max_price_children: number;
  min_price: number;
  min_price_children: number;
  phone_number: number;
  portal_site: number;
  postal_code: number;
  setting_store_cancel: SettingStoreCancel;
  status: number;
  status_display: number;
  store_manager_id: number;
  updated_by: number;
  updated_at: string;
  operating_officer_first_name: string;
  operating_officer_last_name: string;
  operational_manager_first_name: string;
  operational_manager_last_name: string;
  price_range: string;
  delivery_time: string;
  timing_and_method: string;
  necessary_expenses: string;
  handling_returned: string;
  handling_defective: string;
  staffs: StaffModel[];
  reviews: ReviewInterface[];
  contract: Contract;
  events: Event[];
}

export interface ListStore {
  name: string;
  min_price: string;
  max_price: string;
  min_time: string;
  max_time: string;
}

export interface StoreInterface {
  id: number;
  store_manager_id: number;
  name: string;
  first_company_name: string;
  last_company_name: string;
  first_company_name_kana: string;
  last_company_name_kana: string;
  introduction?: string;
  description?: string;
  news?: string;
  email: string;
  email_for_notification_reception: string;
  cancellation?: string;
  note?: string;
  phone_number: string;
  postal_code?: string;
  address?: string;
  address_detail?: string;
  home_page?: string;
  comment_opening_time?: string;
  transportation?: string;
  status: number;
  model_has_type?: ModelHasType;
  model_has_file: ModelHasFile[];
  created_at: string;
  updated_at: string;
  is_setting_cancel: number;
  setting_store_cancel?: SettingStoreCancel;
}

export interface SettingStoreCancel {
  no_contact_money: string;
  no_contact_percent: string;
  one_day_ago_money: string;
  one_day_ago_percent: string;
  seven_day_to_two_day_ago_money: string;
  seven_day_to_two_day_ago_percent: string;
  that_day_money: string;
  that_day_percent: string;
}

export interface FilterStore {
  keyword_time: string | null;
  keyword_date: string | null;
  keyword_name: string | null;
  transportation: string | null;
  district_id: string | null;
  conscious_id: string | null;
  island_id: string | null;
  village_id: string | null;
  is_map: boolean | null;
}

export interface RecommendStore {
  id: number;
  url: string;
  name: string;
}
