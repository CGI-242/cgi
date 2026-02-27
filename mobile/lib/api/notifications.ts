import { api } from "./client";

export const notificationsApi = {
  register: (token: string, platform: string) =>
    api.post("/notifications/register", { token, platform }),

  unregister: (token: string) =>
    api.delete("/notifications/unregister", { data: { token } }),
};
