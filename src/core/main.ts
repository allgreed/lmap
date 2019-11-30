interface URL {
    content: string;
    is_done: boolean;
}

interface Name {
    content: string;
    is_done: boolean;
}

type Resource = URL | Name;

type Tree = Resource | [Resource, Array<Tree>];

export default {};

// parse_tree :: Array -> Result<Tree>
