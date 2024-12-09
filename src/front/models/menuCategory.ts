import { Menu } from "~/../../src/front/models";

export interface MenuCategory {
  id?: number;
  name?: string;
  description: string;
  parent_id: number;
  menus: Menu[];
  status: number;
  store_id: number;
  parent: any;
}
