import { ResourceParameter } from "./resource-parameter";

export class ReminderResourceParameter extends ResourceParameter {
    subject?: string;
    message?: string;
    frequency?: string;
  }