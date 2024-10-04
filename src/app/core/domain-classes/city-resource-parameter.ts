import { ResourceParameter } from "./resource-parameter";

export class CityResourceParameter extends ResourceParameter {
  cityId: string = '';
  cityName: string = '';
  countryId?: string = '';
  countryName: string = '';
}
