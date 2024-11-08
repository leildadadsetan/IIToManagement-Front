import { ResourceParameter } from "./resource-parameter";
export class GroupResourceParameter extends ResourceParameter {
  id?: string = '';
  groupName: string = '';
  isActive: boolean = false;
}
