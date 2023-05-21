import {ModuleGenerator} from "./module.generator.js";
import {Target} from "../enum/target.enum.js";
import { createBarrelsConfiguration } from '../../tests/support/create-barrels-configuration.js';

const moduleGenerator = new ModuleGenerator();

const supportedTargets = [
    Target.Module,
    Target.Typescript,
    Target.TypescriptTypes
];

it.each(supportedTargets)('Supports Target "%s"', async (target: Target) => {
    const { context } = await createBarrelsConfiguration({
        target,
        barrels: [{ directory: 'empty', }],
    });

    expect(moduleGenerator.supports(context)).toBeTruthy();
});

describe('Generation', () => {
    it('Should generate assertions when enabled', async () => {
        const { context } = await createBarrelsConfiguration({
            target: Target.Module,
            barrels: [{ directory: 'empty' }],
            emitAssertions: true,
        });

        const exportStatement = await moduleGenerator.createExportStatement(context);
        expect(exportStatement).toMatchSnapshot();
    });

    it('Should not generate assertions when disabled', async () => {
        const { context } = await createBarrelsConfiguration({
            target: Target.Module,
            barrels: [{ directory: 'empty' }],
            emitAssertions: false,
        });

        const exportStatement = await moduleGenerator.createExportStatement(context);
        expect(exportStatement).toMatchSnapshot();
    });
});
