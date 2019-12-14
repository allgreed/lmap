export interface URL {
    address: string;
    is_done: boolean;
}

export interface Name {
    content: string;
    is_done: boolean;
}

export type Resource = URL | Name;


export type Leaf = null;
export type Tree = Leaf | [Resource, Tree[]];

export default {};
