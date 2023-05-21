type IntermediateSchema = Omit<BarrelsOptions, ''>;

export interface Schema extends IntermediateSchema
{
    // @TODO: Do we want debounce?
    debounce: number;

    watch: boolean;
}
