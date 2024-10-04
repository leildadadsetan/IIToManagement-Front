export interface PermissionUserRole {
  roles: Array<string>;
  users: Array<string>;
  isTimeBound: false;
  startDate: Date;
  endDate: Date;
  isAllowDownload: boolean;
  documents: Array<string>
}
