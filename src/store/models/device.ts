export interface Device {
  name: string;
  device_name: string;
  description: string;
  quantity: number;
  max_accept: number;
  status: number;
  all_course: boolean;
  all_menu: boolean;
  created_at: string;
  updated_at: string;
  courses: any[];
  menus: any[];
}
