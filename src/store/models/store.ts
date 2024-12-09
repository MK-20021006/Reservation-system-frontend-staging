import { TagModel, ModelHasType } from "~/../../src/store/models";
import { ModelHasFile } from "~/../../src/shared/models";
import { Contract } from "~/../../src/shared/models/plan";

export interface Store {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: number;
}

export interface StoreRegistrationApplication {
  id: number;
  type_store_id: number;
  first_company_name: string;
  last_company_name: string;
  first_company_name_kana: string;
  last_company_name_kana: string;
  store_name: string;
  phone_number: string;
  email: string;
  postal_code: string;
  address: string;
  address_detail: string;
  inquiry: string;
  status: number;
  contract: Contract;
}

export interface StoreInterface {
  id: number;
  code: string;
  agent_code: string;
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
  store_manager?: StoreManager;
  model_has_type?: ModelHasType;
  model_has_file: ModelHasFile[];
  model_has_tag?: TagModel[];
  opening_times: OpeningTimes[];
  closing_times: OpeningTimes[];
  setting_store_cancel: SettingStoreCancel;
  created_at: string;
  updated_at: string;
  island_id: number;
  district_id: number;
  conscious_id: number;
  village_id: number;
  status_setting_google: number;
  is_setting_google: number;
  has_seat_public: boolean;
  id_course_public_not_stay_time: any[];
}

export interface StoreManager {
  id: null;
  first_name: string;
  last_name: string;
}

export interface OpeningTimes {
  id: number;
  store_id: number;
  day_of_week: number;
  start: string;
  end: string;
}

export interface OpeningTimes {
  day_off: string;
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

export interface ReservationInDay {
  time: string;
  value: number;
}

export interface AvailableSeatInDay {
  time: string;
  value: number;
}

export interface AvailableStaffInDay {
  time: string;
  value: number;
}

export interface StoreStepActive {
  id: number;
  status: number;
  has_course_public: boolean;
  is_setting_payment: boolean;
  has_event_public: boolean;
}
