import { Pagination } from "../../shared/requests/types";
import { ModelHasFile, ModelHasType } from "../../shared/models";
import { SORT_ORDER } from "../../shared/constants";
import { TagStoreModel } from "../../admin/models";

export interface AdminBuffStoreRanking {
  id: number;
  store_id: number;
  daily_access: number;
  daily_booking: number;
  weekly_access: number;
  weekly_booking: number;
  monthly_access: number;
  monthly_booking: number;
}

export interface ReviewStore {
  store_id: number;
  count_reviews: number;
  sum_star: number;
  avg: number;
}

export interface StoreOfRanking {
  id: number;
  code: string;
  store_manager_id: number;
  name: string;
  introduction: string;
  description: string;
  review: [ReviewStore];
  model_has_type: ModelHasType;
  model_has_file: ModelHasFile[];
  created_at: string;
  create_user: {
    id: number;
    fullname: string;
  };
  updated_at: string;
  update_user: {
    id: number;
    fullname: string;
  };
  admin_buff_store_ranking: AdminBuffStoreRanking;
  model_has_tag: TagStoreModel[];
  plan: object;
}

export enum OrderBy {
  booking = "sum_total_booking",
  access = "sum_total_access",
}

export enum Period {
  day = "day",
  week = "week",
  month = "month",
}

export interface IListRankingInput {
  order_by: OrderBy;
  direct?: typeof SORT_ORDER;
  period: Period;
  store_type_id?: number | string | null;
}

export interface DataRankingStore {
  store_id: number;
  stores: StoreOfRanking;
  sum_total_access: number;
  sum_total_booking: number;
}

export interface IRankingStore {
  data: DataRankingStore;
  pagination: Pagination;
}
