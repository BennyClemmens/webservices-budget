import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
},
);

prisma.$on('query', (e) => {
  getLogger().debug(`[QUERY] ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
});

prisma.$on('info', (e) => {
  getLogger().info(`[INFO] ${e.message}`);
});

prisma.$on('warn', (e) => {
  getLogger().warn(`[WARN] ${e.message}`);
});

prisma.$on('error', (e) => {
  getLogger().error(`[ERROR] ${e.message}`);
});

export async function initializeData(): Promise<void> {
  getLogger().info('Initializing connection to the database');
  await prisma.$connect();
  getLogger().info('Successfully connected to the database');
}

export async function shutdownData(): Promise<void> {
  getLogger().info('Shutting down database connection');
  await prisma?.$disconnect();
  getLogger().info('Database connection closed');
}
