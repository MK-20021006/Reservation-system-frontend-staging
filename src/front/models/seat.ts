import { ModelHasFile, ModelHasType } from "~/../../src/shared/models";

export interface Seat {
  id: number;
  capacity: number;
  description: string;
  name: string;
  model_has_file: ModelHasFile[];
  model_has_type?: ModelHasType;
}

export interface CategorySeat {
  id: number;
  name: string;
}
