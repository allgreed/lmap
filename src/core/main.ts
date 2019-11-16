interface URL {
    address: string;
    is_done: boolean;
}

interface Name {
    content: string;
    is_done: boolean;
}

type Resource = URL | Name;

type Leaf = null;
type Tree = Leaf | [Resource, Tree[]];

export default {};

// parse_tree :: Array -> Result<Tree>
