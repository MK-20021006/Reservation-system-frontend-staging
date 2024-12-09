export interface ListAllResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: unknown | object;
}

export interface ListResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: DataResponse;
}

interface DataResponse {
  current_page: number;
  data: unknown;
  from: number;
  to: number;
  total: number;
  per_page: number;
  next_page_url?: string;
  prev_page_url?: string;
}
