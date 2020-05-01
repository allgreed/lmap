export interface Link {
    address: string;
    is_done: boolean;
}

export interface Text {
    content: string;
    is_done: boolean;
    // TODO: this is an enum, not a boolean
}

// TODO: add a null resource - for the root

export type Resource = Link | Text;

export default {};
