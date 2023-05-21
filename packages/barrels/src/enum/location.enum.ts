export enum Location
{
    /**
     * Create a single barrel in the top-most directory
     */
    Top = 'top',

    /**
     * Create a barrel in all directories that contain files, excluding the top directory
     */
    Branch = 'branch',

    /**
     * Create a barrel in all directories that contain files, including the top directory
     */
    All = 'all',
}
