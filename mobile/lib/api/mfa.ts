import { api } from "./client";

export interface MfaStatus {
  enabled: boolean;
  method: string | null;
  backupCodesRemaining: number;
}

export interface MfaSetupResult {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}

export interface MfaEnableResponse {
  message: string;
  backupCodes: string[];
}

export const mfaApi = {
  getStatus: async (): Promise<MfaStatus> => {
    const { data } = await api.get<MfaStatus>("/mfa/status");
    return data;
  },

  setup: async (): Promise<MfaSetupResult> => {
    const { data } = await api.post<MfaSetupResult>("/mfa/setup");
    return data;
  },

  enable: async (code: string): Promise<MfaEnableResponse> => {
    const { data } = await api.post<MfaEnableResponse>("/mfa/enable", { code });
    return data;
  },

  disable: async (password: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>("/mfa/disable", { password });
    return data;
  },

  regenerateBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    const { data } = await api.post<{ backupCodes: string[] }>("/mfa/backup-codes/regenerate");
    return data;
  },
};
