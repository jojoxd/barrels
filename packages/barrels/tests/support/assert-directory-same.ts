import { cp as copy, mkdir, rm } from "fs/promises";
import { join as joinPath, basename } from "path";
import { compare } from "dir-compare";

export async function testDirectory(testDirectory: string, fn: (directory: string) => Promise<void>): Promise<void>
{
    const inputPath = joinPath(testDirectory, 'input/');
    const actualPath = joinPath(testDirectory, 'actual/');
    const expectedPath = joinPath(testDirectory, 'expected/');
    const testName = basename(testDirectory);

    try {
        await rm(actualPath, { recursive: true, force: false, });
    } catch(ignored) {}

    await mkdir(actualPath);
    await copy(inputPath, actualPath, { recursive: true, });
    await fn(actualPath);

    const result = await compare(expectedPath, actualPath, {
        compareContent: true,
        compareDate: false,
        skipEmptyDirs: false,
    });

    for(const diff of result.diffSet) {
        // @ts-expect-error jest-expect-message adds this
        expect(diff.state, `expected file ${testName}/actual/${diff.name1} to be equal to ${testName}/expected/${diff.name1}`, { showPrefix: false, }).toBe('equal');
    }
}
