import { ModelHasFile } from "~/../../src/shared/models";

export interface Menu {
  id: number;
  description: string;
  name: string;
  model_has_file: ModelHasFile[];
}
