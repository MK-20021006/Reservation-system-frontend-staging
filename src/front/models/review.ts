export interface ReviewInterface {
  id: number;
  star: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  store: Store;
  reply: ReplyInterface;
}

interface ReplyInterface {
  replier: any;
  created_at: Date;
  content: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  fullname: string;
  first_name_kana: string;
  last_name_kana: string;
  fullname_kana: string;
  email: string;
  phone_number: string;
  gender: number;
  birth_day: string;
  postal_code: string;
  address_detail: string;
  type: string;
  image: string;
}

interface Store {
  id: number;
  name: string;
  first_company_name: string;
  last_company_name: string;
  first_company_name_kana: string;
  last_company_name_kana: string;
  description: string;
  email: string;
  phone_number: string;
  address: number;
  address_detail: string;
  image: string;
}
