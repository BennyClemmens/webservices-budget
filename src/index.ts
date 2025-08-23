import type winston from 'winston';
import createServer from './core/createServer';
import { getLogger } from './core/logging';
import type { BudgetServer } from './types/server';

async function main(): Promise<void> {  // perhaps in a helper function?
  async function flushLoggerAndExit(exitCode: number = 0, logger: winston.Logger= getLogger()) {
    const transports: winston.transport[] = logger.transports;
    let remaining: number = transports.length;

    if (remaining === 0) {
      process.exit(exitCode);
    }

    await new Promise<void>((resolve) => {  // also better in a helper function or in logging.ts?
      transports.forEach((transport) => {
        // Only transports with stream support need this
        if (typeof transport.end === 'function') {
          transport.once('finish', () => {
            if (--remaining === 0) resolve();
          });
          transport.end();
        } else { // No `end()` method; assume it's already flushed
          if (--remaining === 0) resolve();
        }
      });
    });

    // Delay to ensure stdout/stderr flush (esp. for Console)
    //setTimeout(() => process.exit(exitCode), 10000);

    // Let Node flush stdout/stderr (especially in slow shells)

    //await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(exitCode);
  }

  // function safeExit(code = 0, delay = 50) {
  //   setTimeout(() => process.exit(code), delay);
  // }

  try {
    const budgetServer: BudgetServer = await createServer();
    await budgetServer.start();

    let shuttingDown = false;
    async function onClose(signal: NodeJS.Signals) {
      process.stdin.resume();
      if (shuttingDown) return;
      shuttingDown = true;
      //console.warn(`Received ${signal}, tying gracefull shutdown...`);
      getLogger().warn(`Received ${signal}, trying to shutdown gracefully...`);

      const timeout: NodeJS.Timeout = setTimeout(() => { // Force exit if shutdown takes too long (here: 10 seconds)
        console.error('Shutdown taking too long. Forcing exit.');
        getLogger().error('Shutdown taking too long. Forcing exit.');
        //throw Error('takes too long');
        process.exit(1);
      }, 10 * 1000); // 10 seconds

      try {
        await budgetServer.stop();
        clearTimeout(timeout);
        getLogger().info('Server stopped gracefully. Goodbye! 👋');
        //console.log('Server stopped gracefully. Goodbye.');
        await flushLoggerAndExit(0);
      } catch (err) {
        getLogger().error('Error during shutdown:', err);
        //console.error('Error during shutdown:', err);
        await flushLoggerAndExit(1);
      }
    }

    process.on('SIGTERM', () => onClose('SIGTERM'));
    process.on('SIGQUIT', () => onClose('SIGQUIT'));
    process.on('SIGINT', () => onClose('SIGINT'));

  } catch (error) {
    //console.error('error during createserver/startup...');
    getLogger().error('error during createserver/startup...');
    if (error instanceof Error) {
      getLogger().error(error.stack);
    } else {
      getLogger().error(error);
    };
    //console.log('error during createserver/startup...\n', error);
    await flushLoggerAndExit(1);
  }
}

main();
