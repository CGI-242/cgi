import { PrismaClient } from '@prisma/client';

// Configuration du logging Prisma selon l'environnement (LOW-12)
const prisma = new PrismaClient({
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
