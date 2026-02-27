// Mock expo-server-sdk (ESM module incompatible avec Jest CJS)
jest.mock("expo-server-sdk", () => ({
  Expo: class MockExpo {
    static isExpoPushToken() { return true; }
    chunkPushNotifications(messages: unknown[]) { return [messages]; }
    async sendPushNotificationsAsync() { return []; }
  },
}));

// Mock services qui dépendent de modules externes
jest.mock("../services/reminder.service", () => ({
  startReminderCron: jest.fn(),
}));

jest.mock("../services/email.service", () => ({
  EmailService: {
    sendOtp: jest.fn().mockResolvedValue(undefined),
    sendPasswordReset: jest.fn().mockResolvedValue(undefined),
    sendMfaEnabled: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock services RAG/Qdrant (connexions persistantes)
jest.mock("../services/chat.service", () => ({
  sendMessageStream: jest.fn(),
  getConversations: jest.fn().mockResolvedValue([]),
  getConversation: jest.fn(),
  deleteConversation: jest.fn(),
}));

jest.mock("../services/push.service", () => ({
  PushService: {
    sendToUser: jest.fn(),
    sendFiscalDeadlinesPush: jest.fn(),
    registerToken: jest.fn(),
    unregisterToken: jest.fn(),
  },
}));

jest.mock("../services/audit.service", () => ({
  AuditService: {
    log: jest.fn(),
    getOrganizationAudit: jest.fn(),
    getUserActions: jest.fn(),
    getEntityHistory: jest.fn(),
    search: jest.fn(),
    getStats: jest.fn(),
    gdprCleanup: jest.fn(),
  },
}));

// Mock Prisma Client global pour les tests
jest.mock("../utils/prisma", () => {
  const mockPrisma: Record<string, unknown> = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    conversation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    searchHistory: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      deleteMany: jest.fn(),
    },
    article: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    articleReference: {
      count: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    alerteFiscale: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    usageStats: {
      findMany: jest.fn(),
    },
    pushToken: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(mockPrisma)),
  };
  return { __esModule: true, default: mockPrisma };
});

// Variables d'environnement pour les tests
process.env.JWT_SECRET = "test-jwt-secret-for-testing";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-for-testing";
process.env.NODE_ENV = "test";
