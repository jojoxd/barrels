import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { join as joinPath } from 'path';
import { Schema } from './schema';
import {addBarrelTask} from "./lib/util-functions";

export async function configurationGenerator(tree: Tree, options: Schema): Promise<void>
{
  const projectRoot = `libs/${options.name}`;

  generateFiles(tree, joinPath(__dirname, 'files'), projectRoot, options);

  await addBarrelTask(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default configurationGenerator;
