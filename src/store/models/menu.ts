import { ModelHasFile } from "~/../../src/shared/models";

export interface Menu {
  id?: number;
  name?: string;
  parent_id: number;
  store_id: number;
  description: string;
  created_at?: string | null;
  updated_at?: string | null;
  status: boolean | number;
  product_category_id: number;
  price: number;
  price_status: number;
  booking_type: number;
  time: number;
  time_pre: number;
  has_time_per: number;
  is_setting_cancel: number;
  model_has_file: ModelHasFile[];
}

export interface FilterMenuList {
  name: string;
  id: number | null;
  product_category_id: number | null;
}

export interface SortMenuList {
  order_by: string;
  direct: string;
}
