export interface Category {
  id?: number;
  name?: string;
  parent?: any;
  parent_id: number;
  store_id: number;
  description: string;
  created_at?: string | null;
  updated_at?: string | null;
  status: boolean;
}

export interface SortCategoryList {
  order_by: string;
  direct: string;
}

export interface FilterCategoryList {
  name: string;
  parent_id: number | null;
}
