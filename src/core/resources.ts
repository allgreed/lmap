export interface Link {
    __typename: "Link";
    title: string;
    address: string;
    is_done: boolean;
}

export interface Text {
    __typename: "Text";
    content: string;
    is_done: boolean;
    // TODO: is_done => status ; boolean => enum
}

export interface Null {
    __typename: "Null";
}
// when adding a new Resource please remember to add it to Resource union
// and ResourceTypeStringValues array

// TODO: add a null resource - for the root


export type Resource = Link | Text | Null;
export type ResourceTypeString = Resource["__typename"];

export const ResourceTypeStringValues: Array<ResourceTypeString> = [
    "Link",
    "Text",
    "Null",
];


export default {};
