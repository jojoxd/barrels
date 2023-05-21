import {readProjectConfiguration, Tree, updateProjectConfiguration} from "@nx/devkit";
import { Schema as ConfigurationSchema } from "../schema";
import { Schema as ExecutorSchema } from "../../../executors/generate/schema";

export async function addBarrelTask(tree: Tree, schema: ConfigurationSchema): Promise<void>
{
    const projectConfiguration = readProjectConfiguration(tree, schema.name);

    const options = {

    } satisfies Partial<ExecutorSchema>;

    const developmentConfiguration = 'development';
    const productionConfiguration = 'production';

    projectConfiguration.targets['barrels'] = {
        executor: '@jojoxd/barrels-nx:generate',

        configurations: {
            [developmentConfiguration]: {
                watch: true,
            } satisfies Partial<ExecutorSchema>,

            [productionConfiguration]: {
                watch: false,
            } satisfies Partial<ExecutorSchema>,
        },

        options,
    };

    updateProjectConfiguration(tree, schema.name, projectConfiguration);
}