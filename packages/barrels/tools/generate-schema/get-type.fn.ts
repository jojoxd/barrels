import {ApiPropertySignature, ExcerptTokenKind} from "@microsoft/api-extractor-model";

export function getType(property: ApiPropertySignature): string
{
    const references = property.excerpt.tokens.filter(token => token.kind === ExcerptTokenKind.Reference);

    if (references.length === 1) {
        return references[0].text;
    }

    return property.excerpt.tokens[1]?.text ?? 'unknown';
}

export function isArray(property: ApiPropertySignature): boolean
{
    console.log(property.excerpt.tokens.map(token => token.text));

    return property.excerpt.tokens.map(token => token.text).join('').indexOf('[]') > 0;
}