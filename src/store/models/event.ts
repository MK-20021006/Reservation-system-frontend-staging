export interface EventInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: [];
  number_seats?: number;
  price: number;
  price_children: number;
  fee_type: number;
  start_date?: string;
  end_date?: string;
  opening_time?: string;
  closing_time?: string;
  business_hour?: string;
  reservation_type?: number;
  place?: string;
  online_link?: string;
  published?: number;
  created_at?: string;
}
