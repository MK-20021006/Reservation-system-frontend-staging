import { ModelHasFile } from "~/../../src/shared/models";

interface File {
  id: number;
  url: string;
  file_type: string;
}

export interface Photo {
  id: number;
  file_id: number;
  file: File;
  model_type: string;
}
