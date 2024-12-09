import { ModelHasFile } from "~/../../src/shared/models";
import { ModelHasType } from "~/../../src/shared/models/type";

export interface Seat {
  id: number;
  name: string;
  description: string;
  min_capacity: number;
  capacity: number;
  quantity: number;
  status: number;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  deleted_at?: string | null;
  deleted_by?: string | null;
  model_has_file: ModelHasFile[];
  model_has_type: ModelHasType;
  crawl_site: number;
  crawl_id: number;
}

export interface CategorySeat {
  id: number;
  name: string;
}
