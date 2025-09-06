import type winston from 'winston';
import createServer from './core/createServer';
import { getLogger } from './core/logging';
import type { BudgetServer } from './types/server';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

async function main(): Promise<void> {  // perhaps in a helper function?
  async function flushLoggerAndExit(exitCode: number = 0, logger: winston.Logger= getLogger()) {
    const transports: winston.transport[] = logger.transports;
    let remaining: number = transports.length;

    if (remaining === 0) {  // no need to flush the logger as it is empty
      process.exit(100 + exitCode);
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
    process.exit(200 + exitCode);
  }

  // function safeExit(code = 0, delay = 50) {
  //   setTimeout(() => process.exit(code), delay);
  // }

  try {
    const budgetServer: BudgetServer = await createServer();
    await budgetServer.start();

    let shuttingDown = false;
    async function onClose(signal: NodeJS.Signals) {
      //process.stdin.resume();
      if (shuttingDown) return;
      shuttingDown = true;
      getLogger().info(`Received ${signal}, trying to shutdown gracefully...`);

      // Force exit if shutdown takes too long (here: 10 seconds)
      const backupTimeout: NodeJS.Timeout = setTimeout(() => {
        console.error('Shutdown taking too long. Forcing exit.');
        process.exit(50);
      }, 10 * 1000); // 10 seconds

      try {
        await budgetServer.stop();
        getLogger().info('Server stopped gracefully. Goodbye! 👋');
        await flushLoggerAndExit(0);
      } catch (err) {
        getLogger().error('Error during shutdown:');
        getLogger().debug(err);
        await flushLoggerAndExit(2);
      }finally {
        clearTimeout(backupTimeout);  // ✅ cleaning up = best practice
      }
    }

    //event handlers
    const terminationSignals: NodeJS.Signals[] = [
      'SIGINT',   // Ctrl+C
      'SIGTERM',  // kill command
      'SIGQUIT',  // quit from terminal
      'SIGHUP',    // terminal closed
    ];
    terminationSignals.forEach((sig) => process.on(sig, () => onClose(sig)));

    // const unSignals: NodeJS.Signals[] = ['uncaughtException', 'unhandledRejection']
    // unSignals.forEach((event) => {
    //   process.on(event, (err, promise) => {
    //     console.error(event, err || promise);
    //     onClose(event);
    //   });
    // });

  } catch (error) {
    getLogger().error('Something went wrong while trying to create the server...');
    if (error instanceof PrismaClientInitializationError) {
      getLogger().error('Prisma could not connect to the database');
    }
    if (error instanceof Error) {
      getLogger().debug(`stack:\n${error.stack}`);
    } else {
      getLogger().debug(`error:\n${error}`);
    };
    getLogger().debug('> Calling flushLoggerAndExit(1); in error catch');
    await flushLoggerAndExit(1);
  }
}

main();
