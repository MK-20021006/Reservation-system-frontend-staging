import { PaginationInterface } from "../models/pagination";

export interface InvoiceInterface {
  id: number;
  reservation_id: number;
  reservation_code?: string;
  reservation_detail?: string;
  store_id?: number;
  store_name?: string;
  course_name?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  memo?: string;
  amount?: number;
  payment_type?: number;
  status?: number;
  submitted_at?: number;
  started_at?: string;
  created_at?: string;
  pagination?: PaginationInterface;
}
