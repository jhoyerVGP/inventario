export interface Permissions {
  [role: string]: string[];
}
//definimos los permisos por rol
export const permissions: Permissions = {
  SUPERADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_BRANCHES",
    "VIEW_PRODUCTS",
    "VIEW_CATEGORIES",
    "VIEW_SALES",
    "VIEW_MOVEMENTS",
    "VIEW_POS",
    "VIEW_EMPLOYEES",
    "VIEW_SUPPLIERS",
    "VIEW_PURCHASES",
  ],
  ADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_PRODUCTS",
    "VIEW_CATEGORIES",
    "VIEW_SALES",
    "VIEW_MOVEMENTS",
    "VIEW_POS",
    "VIEW_EMPLOYEES",
    "VIEW_SUPPLIERS",
    "VIEW_PURCHASES",
  ],
  SELLER: ["VIEW_SALES", "VIEW_POS"],
  INVENTORY: [
    "VIEW_DASHBOARD",
    "MANAGE_INVENTORY",
    "VIEW_SUPPLIERS",
    "VIEW_PURCHASES",
  ],
};
