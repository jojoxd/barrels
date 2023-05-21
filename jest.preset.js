const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    ...nxPreset,

    coverageDirectory: '../../coverage/packages/barrels-nx',
    coverageReporters: ['text', 'lcov', 'cobertura'],

    reporters: [
        "default",
        ["jest-junit", {
            suiteName: process.env.NX_TASK_TARGET_PROJECT,
            outputDirectory: `tmp/junit/`,
            outputName: `junit.${process.env.NX_TASK_TARGET_PROJECT}.xml`,

            classNameTemplate: "{classname}-{title}",
            titleTemplate: "{classname}-{title}",

            usePathForSuiteName: "true"
        }]
    ]
};
