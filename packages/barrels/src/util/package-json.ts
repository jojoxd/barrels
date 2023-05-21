import { readFile } from "fs/promises";
import { join as joinPath } from "path";
import { packageDirectory } from "pkg-dir";
import { globSync } from "glob";
import logger from "./logger.js";

export interface PackageJsonSpec
{
    type?: 'module';

    [key: string]: unknown;
}

export class PackageJson
{
    protected static cache = new Map<string, PackageJsonSpec | null>();

    public static async getPackageJson(cwd: string): Promise<PackageJsonSpec | null>
    {
        if (PackageJson.cache.has(cwd)) {
            return PackageJson.cache.get(cwd)!;
        }

        try {
            const rootDir = await packageDirectory({ cwd });

            if (rootDir) {
                const jsonBuffer = await readFile(joinPath(rootDir, 'package.json'));

                const spec = JSON.parse(
                    jsonBuffer.toString('utf-8')
                ) as PackageJsonSpec;

                logger.inspect('Fetched a package.json', { cwd, rootDir, spec });

                PackageJson.cache.set(cwd, spec);
                return spec;
            }
        } catch(error) {
            logger.inspect('No package.json found', { cwd, error });

            PackageJson.cache.set(cwd, null);
        }

        return null;
    }

    /**
     * Check if the project in cwd is typescript
     */
    public static hasTypescript(packageJson: PackageJsonSpec, cwd: string): boolean
    {
        logger.debug(`Checking if package in ${cwd} has typescript`);
        const tsconfigFiles = globSync('tsconfig*.json', { cwd });

        logger.inspect('Fetched tsconfig files', { tsconfigFiles, cwd, });

        if (tsconfigFiles.length > 0) {
            return true;
        }

        return !!packageJson?.types || ('exports' in packageJson && this.recursiveHasKey(packageJson.exports as object, "types"));
    }

    protected static recursiveHasKey(object: object, key: string): boolean
    {
        if (!object) {
            return false;
        }

        for(const objectKey of Object.keys(object)) {
            if (objectKey === key) {
                return true;
            }

            if (typeof object[objectKey] === 'object' && this.recursiveHasKey(object[objectKey], key)) {
                return true;
            }
        }

        return false;
    }
}
