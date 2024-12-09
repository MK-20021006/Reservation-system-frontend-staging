export interface SubscriptionInterface {
  id: number;
  amount: number;
  created_at: Date;
  due_date: Date;
  month: Date;
  paid_at: Date;
  status: number;
  line_fee: number;
  zoom_fee: number;
  custom_billing_monthly_fee: number;
  sms_monthly_fee: number;
  submission_agency_monthly_fee: number;
  external_site_monthly_fee: number;
  customer_attraction_fee: number;
  booking_fee: number;
  initial_support_monthly_fee: number;
  number_booking: number;
  plan_fee: number;
  subscription_fee: number;
  plan_name: string;
  contract: any;
}
