interface Date {
  date: string;
  timezone: string;
  timezone_type: number;
}
export interface Holiday {
  date: Date;
  name: number;
  name_en: string;
  week: string;
  week_en: number;
}
