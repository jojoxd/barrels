export interface Schema
{
    $id?: string;
    type?: "object";
    properties?: { [key: string]: object };
    $defs?: { [key: string]: object };
}