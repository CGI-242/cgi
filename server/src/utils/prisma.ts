import { PrismaClient } from '@prisma/client';

// Configuration Prisma avec timeout connexion (B11) et logging selon l'env
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}connect_timeout=10&pool_timeout=10`
        : undefined,
    },
  },
  log:
    process.env.NODE_ENV === 'production'
      ? [
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ]
      : [
          { emit: 'stdout', level: 'query' },
          { emit: 'stdout', level: 'info' },
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ],
});

export default prisma;
