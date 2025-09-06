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
  getLogger().debug(`[PRISMA] ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
});

prisma.$on('info', (e) => {
  getLogger().info(`[PRISMA] ${e.message}`);
});

prisma.$on('warn', (e) => {
  getLogger().warn(`[PRISMA] ${e.message}`);
});

prisma.$on('error', (e) => {
  getLogger().error(`[PRISMA] ${e.message}`);
});

export async function initializeData(): Promise<void> {
  getLogger().info('Initializing connection to the database');
  getLogger().debug('> initializeData(): await prisma?.$connect();');
  await prisma.$connect();
  getLogger().info('Successfully connected to the database');
  getLogger().debug('< initializeData()');
}

export async function shutdownData(): Promise<void> {
  getLogger().info('Shutting down database connection');
  getLogger().debug('> shutdownData(): await prisma?.$disconnect();');
  await prisma?.$disconnect();
  getLogger().info('Database connection closed succesfully');
  getLogger().debug('< shutdownData()');
}
