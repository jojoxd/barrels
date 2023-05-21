export enum Target
{
    /**
     * Generate typescript
     */
    Typescript = 'ts',

    /**
     * Generate .d.ts files only
     */
    TypescriptTypes = 'dts',

    /**
     * Generate commonjs
     */
    CommonJS = 'cjs',

    /**
     * generate modules
     */
    Module = 'esm',
}
