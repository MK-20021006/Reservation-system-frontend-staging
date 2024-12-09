export interface TagInterface {
  id: number;
  name: string;
}

export interface TagModel {
  model_id: number;
  tag: TagInterface;
  tag_id: number;
}
