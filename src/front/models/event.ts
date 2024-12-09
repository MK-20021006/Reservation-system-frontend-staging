import { ModelHasFile } from "~/../../src/shared/models";

export interface EventInterface {
  id: number;
  store_id: number;
  name: string;
  contents: string;
  max_capacity: number;
  min_capacity: number;
  price: number;
  price_children: number;
  product_number: number;
  start_time?: string;
  end_time?: string;
  day_works?: number[];
  payment_type?: number;
  accepted_children?: number;
  model_has_file: ModelHasFile;
}

export interface EventTimeInterface {
  id: number;
  event_id: number;
  date: string;
  start: string;
  end: string;
  people: number;
}

export interface EventDateInterface {
  date: number;
  status: boolean;
}
