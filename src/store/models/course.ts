import { ModelHasFile } from "~/../../src/shared/models";

export interface Course {
  id: number;
  name: string;
  contents: string;
  payment_type: number;
  max_capacity: number;
  min_capacity: number;
  store_id: number;
  status: number;
  stay_time: number;
  time_pre: number;
  product_number: number;
  created_at: string;
  price: number;
  price_children: number;
  day_works: any;
  created_by: number;
  accepted_children: number;
  updated_at: string;
  start_time: string;
  end_time: string;
  updated_by: number;
  deleted_at?: string | null;
  deleted_by?: string | null;
  model_has_file: ModelHasFile[];
  crawl_site: number;
  crawl_id: number;
  has_time_per: number;
  tag: any[];
}

export interface FilterCourseList {
  name: string;
  id: number | null;
  payment_type: number | null;
  status: number | null;
}

export interface SortCourseList {
  order_by: string;
  direct: string;
}
