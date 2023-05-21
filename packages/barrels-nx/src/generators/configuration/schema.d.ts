export interface Schema
{
  /**
   * Project for which to generate Barrels configuration.
   */
  name: string;

  /**
   * Add configuration in project.json instead of .barrels.json
   */
  inlineConfig: boolean;

  /**
   * Skip formatting files
   */
  skipFormat: boolean;
}
