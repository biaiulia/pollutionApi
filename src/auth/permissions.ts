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
  user: Methods[];
  sensorReadings: Methods[];
  sensors: Methods[];
}

export const permissionsByRole: { [key: string]: Permissions } = {
  user: {
    subscriptions: allMethods,
    user: [Methods.POST, Methods.GET, Methods.PATCH],
    sensorReadings: [Methods.GET],
    sensors: [Methods.GET],
    notifications: [Methods.GET],
  },

  admin: {
    notifications: allMethods,
    subscriptions: allMethods,
    user: allMethods,
    sensorReadings: allMethods,
    sensors: allMethods,
  },
};
