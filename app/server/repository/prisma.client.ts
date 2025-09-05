import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Em dev: reusa a instância para evitar criar múltiplos clients a cada HMR
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // ajuste se quiser 'query' em dev
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
