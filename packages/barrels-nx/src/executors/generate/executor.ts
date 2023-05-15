import { GenerateExecutorSchema } from './schema';

export default async function runExecutor(options: GenerateExecutorSchema) {
  console.log('Executor ran for Generate', options);
  return {
    success: true,
  };
}
