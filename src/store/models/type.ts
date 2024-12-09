export interface ModelHasType {
  model_id?: number;
  type?: Type;
  type_id?: number;
}

export interface Type {
  id: number;
  name: string;
}
