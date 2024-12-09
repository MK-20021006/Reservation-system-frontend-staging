import { DataFile } from "../../shared/models/file";

export interface BannerAds {
  id: number;
  image: DataFile;
  index: number;
  name: string;
  note: string;
  position: number;
  position_name: string;
  position_size: string;
  start_time: string;
  end_time: string;
  status: number;
  store_type: number;
  url: string;
  changer: string;
  created_at: string;
  updated_at: string;
}
