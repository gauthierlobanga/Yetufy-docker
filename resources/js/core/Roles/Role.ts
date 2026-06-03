// import type { Permission } from "./permissions/Permission";

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: string//Permission[];
}
