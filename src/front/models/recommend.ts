import { TagStoreModel } from "~/../../src/admin/models";
import { ModelHasFile, ModelHasType } from "~/../../src/shared/models";
import { Reviews } from "../../shared/models";

export enum Position {
  top = "top",
  bottom = "bottom",
}

export interface RecommendInterface {
  id: number;
  image: string;
  name: string;
  typeName?: string;
  modelHasTag?: TagStoreModel[];
  description?: string;
  transportation?: string;
  rating: number;
  model_has_file?: ModelHasFile[];
}

export interface RecommendStoreInterface {
  address: string | null;
  address_detail: string | null;
  code: string;
  id: number;
  model_has_file: ModelHasFile[];
  model_has_tag: TagStoreModel[];
  model_has_type: ModelHasType;
  name: string;
  introduction: string | null;
  description: string | null;
  reviews: Array<Reviews>;
}
