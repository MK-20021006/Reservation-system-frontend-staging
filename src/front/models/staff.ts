export interface TagInterface {
  id: number;
  name: string;
}

export interface TagModel {
  model_id: number;
  tag: TagInterface;
  tag_id: number;
}

export interface StaffModel {
  id: number;
  year_works?: number;
  fee?: number;
  name?: string;
  title?: string;
  info?: string;
  status?: boolean;
  position?: [];
  image?: {
    file: object;
  };
  model_has_tag?: TagModel[];
  staff_opening_times?: [];
  staff_closing_times?: [];
  created_at?: string;
  updated_at?: string;
  staff_comments?: [];
}
