interface IParameterImage {
  border: string | number;
  width: string | number;
  height: string | number;
  image_url: string;
  url: string;
}
export interface IAds {
  data_desktop: string;
  data_mobile: string;
  desktop: IParameterImage;
  enable: number;
  id: number;
  mobile: IParameterImage;
  position: number;
  store_type: number;
}
