export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
export const allMethods = [
  Methods.DELETE,
  Methods.GET,
  Methods.PATCH,
  Methods.POST,
  Methods.PUT,
];

export interface Permissions {
  notifications: Methods[];
  subscriptions: Methods[];
  users: Methods[];
  'sensor-readings': Methods[];
  sensors: Methods[];
}

export const permissionsByRole: { [key: string]: Permissions } = {
  user: {
    subscriptions: allMethods,
    users: [Methods.POST, Methods.GET, Methods.PATCH],
    'sensor-readings': [Methods.GET],
    sensors: [Methods.GET],
    notifications: [Methods.GET],
  },

  admin: {
    notifications: allMethods,
    subscriptions: allMethods,
    users: allMethods,
    'sensor-readings': allMethods,
    sensors: allMethods,
  },
};
