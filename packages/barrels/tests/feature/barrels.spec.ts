import {testDirectory} from "../support/assert-directory-same.js";
import { readdirSync } from "fs";
import { basename, join as joinPath } from "path";
import {Configuration} from "../../src/service/configuration.js";
import {Barrels} from "../../src/index.js";

const directories = readdirSync(`${__dirname}/`, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => `${__dirname}/${dirent.name}`);

const barrels = new Barrels();

for(const directory of directories) {
    describe(`${basename(directory)}`, () => {
        it.skip('Should generate correctly', async () => {
            await testDirectory(directory, async (actualDirectory) => {
                const configuration = await Configuration.loadFile(joinPath(directory, '.barrels.json'));

                // @ts-expect-error Overwriting a single property
                configuration.data.cwd = actualDirectory;

                await barrels.generate(configuration);
            });
        });
    });
}
