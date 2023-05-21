import { Schema } from './schema';
import { Barrels } from "@jojoxd/barrels";
import { createAsyncIterable } from "@nx/devkit/src/utils/async-iterable";
import { logger, ExecutorContext } from "@nx/devkit";
import { daemonClient } from 'nx/src/daemon/client/client';

// @TODO: Can this be rxjs-native?
function debounce(fn: () => void, wait: number) {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, wait);
  };
}

interface ActiveTask
{
  // id: string;
  abortController: AbortController;
  promise: Promise<void>;

  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export async function* generateBarrelsExecutor(schema: Schema, context: ExecutorContext): AsyncGenerator<{ success: true }, { success: boolean }, undefined>
{
  const barrels = new Barrels();

  const tasks: ActiveTask[] = [];
  let currentTask: ActiveTask = null;

  yield* createAsyncIterable<{ success: true }>(
      async ({ done, next, error }) => {
        const processQueue = async () => {
          if (tasks.length === 0) return;

          const previousTask = currentTask;
          const task = tasks.shift();

          currentTask = task;
          await previousTask.stop();
          await task.start();
        }

        const debouncedProcessQueue = debounce(processQueue, schema.debounce ?? 1_000);

        const addToQueue = async () => {
          const task: ActiveTask = {
            promise: null,
            abortController: new AbortController(),

            start: async () => {
              if (task.abortController.signal.aborted) return;

              // @TODO: Load from somewhere else
              const barrelsConfig = [];

              task.promise = new Promise<void>((resolve, reject) => {
                // Run job

                barrels.generate({ barrels: barrelsConfig, abortSignal: task.abortController.signal, })
                    .then(() => {
                      if (schema.watch && !task.abortController.signal.aborted) {
                        // @TODO: Better error, is this even needed?
                        logger.info(`NX Process exited, waiting for changes to restart...`);
                      }

                      if (!schema.watch) {
                        done();
                      }

                      resolve();
                    })
                    .catch((e) => {
                      error(e);

                      // @TODO: Do we need to reject here?
                      reject(e);
                    });

                next({ success: true, });
              });

              await task.promise;

              next({ success: true, });
            },

            stop: async () => {
              task.abortController.abort();

              await task.promise;
            },
          };

          tasks.push(task);
        };

        const stopWatch = await daemonClient.registerFileWatcher(
          {
            watchProjects: [context.projectName],
            includeDependentProjects: true,
          },
          async (err) => {
            if (err === 'closed') {
              logger.error(`Watch error: Daemon closed the connection`);
              process.exit(1); // @TODO: Is this really the way to do it?
            } else if (err) {
              logger.error(`Watch error: ${err?.message ?? 'Unknown'}`);
            } else {
              logger.info(`NX File change detected. Rebuilding barrels...`);

              await addToQueue();
              await debouncedProcessQueue();
            }
          }
        );

        const stopAllTasks = () => {
          for (const task of tasks) {
            task.stop();
          }
        }

        process.on('SIGTERM', async () => {
          stopWatch();
          stopAllTasks();
          process.exit(128 + 15);
        });

        process.on('SIGINT', async () => {
          stopWatch();
          stopAllTasks();
          process.exit(128 + 2);
        });

        process.on('SIGHUP', async () => {
          stopWatch();
          stopAllTasks();
          process.exit(128 + 1);
        });

        await addToQueue();
        await processQueue();
    },
  );

  return {
    success: true,
  };
}

export default generateBarrelsExecutor;
