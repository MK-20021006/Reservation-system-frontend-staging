export interface JobInterface {
  id: number;
  source_id: string;
  date_from: string;
  date_to: string;
  created_at: string;
  type: string;
  sync_scope: string;
  updated_at: string;
  status: number;
  is_seen: number;
  crawl_site: number;
}
