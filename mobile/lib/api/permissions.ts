import { api } from "./client";

export interface PermissionItem {
  key: string;
  label: string;
  description: string;
  category: string;
}

export interface MyPermissions {
  role: string;
  permissions: string[];
}

export interface MemberPermissions {
  userId: string;
  role: string;
  permissions: string[];
  customPermissions: string[];
}

export interface EffectivePermissions {
  userId: string;
  role: string;
  effective: string[];
}

export const permissionsApi = {
  getAvailable: async (): Promise<PermissionItem[]> => {
    const { data } = await api.get<PermissionItem[]>("/permissions/available");
    return data;
  },

  getMyPermissions: async (): Promise<MyPermissions> => {
    const { data } = await api.get<MyPermissions>("/permissions/my");
    return data;
  },

  getMemberPermissions: async (userId: string): Promise<MemberPermissions> => {
    const { data } = await api.get<MemberPermissions>(`/permissions/members/${userId}`);
    return data;
  },

  getMemberEffective: async (userId: string): Promise<EffectivePermissions> => {
    const { data } = await api.get<EffectivePermissions>(`/permissions/members/${userId}/effective`);
    return data;
  },

  grantPermission: async (userId: string, permission: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(`/permissions/members/${userId}/grant`, { permission });
    return data;
  },

  revokePermission: async (userId: string, permission: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(`/permissions/members/${userId}/revoke`, { permission });
    return data;
  },

  resetToDefaults: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(`/permissions/members/${userId}/reset`);
    return data;
  },
};
