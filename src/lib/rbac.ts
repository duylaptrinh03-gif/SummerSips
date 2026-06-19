// src/lib/rbac.ts

export type Role = "admin" | "member" | "viewer" | "user";

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: ["*"], // Quyền tối cao
  member: [
    "order:create",
    "order:view",
    "profile:update",
    "team:view",
  ],
  viewer: [
    "order:view",
    "profile:view",
  ],
  user: [
    "order:create",
    "order:view",
    "profile:update",
  ],
};

/**
 * Kiểm tra xem một role có quyền thực hiện hành động nhất định không
 */
export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}

/**
 * Helper kiểm tra role (thường dùng cho Middleware hoặc Server Components)
 */
export function checkRole(userRole: string | undefined, allowedRoles: Role[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as Role);
}
