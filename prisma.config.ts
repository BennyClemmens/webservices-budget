import path from 'node:path';
import { defineConfig } from 'prisma/config';

import * as dotenv from 'dotenv';

dotenv.config(); // <- loads the .env file manually

export default defineConfig({
  schema: path.join('src','data', 'schema.prisma'),
  migrations: {
    seed: 'tsx src/data/seed.ts',
  },
});
