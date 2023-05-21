import { CommonJSGenerator } from "./commonjs.generator.js";
import { Target } from "../enum/target.enum.js";
import { createBarrelsConfiguration } from '../../tests/support/create-barrels-configuration.js';

const commonJSGenerator = new CommonJSGenerator();

const supportedTargets = [
    Target.CommonJS,
];

it.each(supportedTargets)('Supports Target "%s"', async (target: Target) => {
    const { context } = await createBarrelsConfiguration({
        target,
        barrels: [{ directory: 'empty' }],
    });

    expect(commonJSGenerator.supports(context)).toBeTruthy();
});

describe.skip('Generation', () => {
    it('Should generate assertions when enabled', async () => {
        const { context } = await createBarrelsConfiguration({
            target: Target.CommonJS,
            barrels: [{ directory: 'empty' }],
            emitAssertions: true,
        });

        const exportStatement = await commonJSGenerator.createExportStatement(context);
        expect(exportStatement).toMatchSnapshot();
    });

    it('Should not generate assertions when disabled', async () => {
        const { context } = await createBarrelsConfiguration({
            target: Target.CommonJS,
            barrels: [{ directory: 'empty', }],
            emitAssertions: false,
        });

        const exportStatement = await commonJSGenerator.createExportStatement(context);
        expect(exportStatement).toMatchSnapshot();
    });
});
