import { RoleClaim } from "./role-claim";
import { UserRoles } from "./user-roles";

export interface Role {
  id?: string;
  name?: string;
  userRoles?: UserRoles[];
  roleClaims?: RoleClaim[];
}
