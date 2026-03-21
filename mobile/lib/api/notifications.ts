import { api } from "./client";

export interface PushDevice {
  id: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export const notificationsApi = {
  register: (token: string, platform: string) =>
    api.post("/notifications/register", { token, platform }),

  unregister: (token: string) =>
    api.delete("/notifications/unregister", { data: { token } }),

  getDevices: () =>
    api.get<{ devices: PushDevice[]; count: number }>("/notifications/devices"),

  sendTest: () =>
    api.post("/notifications/test"),
};
