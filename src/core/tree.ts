import * as _ from "lodash";


export type NodeID = number;


// TODO: this is an entity
export class Tree<T>
{
    root: TreeNode<T>;
    // TODO: unfuck this
    dependencies: any;

    constructor(root: TreeNode<T>, dependencies: any)
    {
        this.root = root;
        this.dependencies = dependencies;
    }

    add(where: NodeID, data: T): Tree<T>
    {
        const targetNode = this._selectNodeById(where);

        let newId = NaN;
        try
        {
            newId = this.dependencies.idProvider.generate();
        }
        catch(err)
        {
            if (err.name !== "ID_OVERFLOW") 
            {
                throw err;
            }

            this.root._reenumerate(this.dependencies.idProvider.generate);
            newId = this.dependencies.idProvider.generate();
        }
        finally
        {
            console.assert(!isNaN(newId), "generated ID is not NaN")
            targetNode._append(new TreeNode(newId, data, []));
        }

        return this;
    }

    // TODO: find a better methods for creating tree literals
    addToRoot(data: T): Tree<T>
    {
        this.add(this.root.id, data);
        return this;
    }
    //
    // TODO: find a better methods for creating tree literals
    addTreeToRoot(t: Tree<T>): Tree<T>
    {
        // might be unsafe, please use only for creating literals
        this.root._append(
            t.root._reenumerate(this.dependencies.idProvider.generate))

        return this;
    }

    removeSubtree(nodeID: NodeID): Tree<T>
    {
        const node = this._selectNodeById(nodeID);
        node.removeTree(node);

        return this;
    }

    removeNode(which: NodeID): Tree<T>
    {
        if(this.isRoot(which))
        {
            // there is no real reson for not doing no-op upon root deletion 
            // when it would solve a problem it'd be a good idea to do so
            // for now we keep it as an additional check to see if we're not
            // deleting root by accident
            throw new Error("Cannot delete root");
        }
        
        // TODO: unfuck this
        const toBeRemoved = this._selectNodeById(which);
        this.root.getParent(toBeRemoved, this.root).removeNode(toBeRemoved);

        return this;
    }

    flatten()
    {
        return this.root.flatten();
    }

    clone(): Tree<T>
    {
        return new Tree<T>(this.root.clone(), this.dependencies);
    }

    get length(): number
    {
        return this.root.length;
    }

    equals(other: Tree<T>): boolean
    {
        return this.root.equals(other.root);
    }

    nodeData(id: NodeID): T
    {
        return this._selectNodeById(id).data;
    }

    // TODO: optional? - undo the ignore
    _selectNodeById(target_id: NodeID): TreeNode<T>
    {
        // @ts-ignore
        return this.root.flatten().find(node => node.id === target_id);
    }

    isRoot(id: NodeID): boolean
    {
        return this.dependencies.idProvider.isRootId(id);
    }
}


export function makeTree<T>(data: T, dependenciesOverride = {}): Tree<T>
{
    const dependencies = {
        idProvider: new TreeIdProvider(),
        ...dependenciesOverride,
    };

    // emulate a bound method for implementation convenience 
    dependencies.idProvider.generate = dependencies.idProvider.generate.bind(dependencies.idProvider)

    const root = new TreeNode<T>(dependencies.idProvider.generate(), data, []);

    return new Tree<T>(root, dependencies);
}

//: TODO: where those two functions should go to?
export function serializeTree<T>(_tree: Tree<T>): string
{
    const tree = _tree.clone();

    // TODO: NodeBody interface or is it overkill?
    const nodes: Array<any> = [];
    tree.root.forEach((node: any) =>
    {
        const node_parent = node.getParent(node, tree.root);

        if (node_parent !== undefined)
        {
            nodes.push({
                parent_id: node_parent.id,
                id: node.id,
                data: node.data,
            });
        }
    });

    return JSON.stringify({
        root_data: tree.root.data,
        nodes,
    });
}

// TODO: optional
export function deserializeTree<T>(data: string): Tree<T>
{
    const { root_data, nodes } = JSON.parse(data);

    const tree = makeTree(root_data);
    // TODO: NodeBody, as before? o.0
    nodes.forEach((node: any) =>
    {
        const targetNode = tree._selectNodeById(node.parent_id);
        targetNode._append(new TreeNode(node.id, node.data, []));
    });

    tree.root.children.forEach((child) => child._reenumerate(tree.dependencies.idProvider.generate));

    return tree;
}



// TODO: get rid of this export
export class TreeNode<T>
{
    id: NodeID;
    // TODO: how about children being Sets?
    children: TreeNode<T>[];
    data: T;

    constructor(id: NodeID, data: T, children: TreeNode<T>[] = [])
    {
        this.data = data;
        this.id = id;
        this.children = children;
    }

    _append(node: TreeNode<T>)
    {
        this.children.push(node);
    }

    removeTree(node: TreeNode<T>) 
    {
        node.children = [];
    }

    removeNode(node: TreeNode<T>): number 
    {
        // TODO: Make it better, use getParent or add parent field to node
        //remove node and attach its any children to this.
        //return -1 if node doesnt exist
        let chosenChild = this.children.find(child => child === node);
        if (chosenChild !== undefined) 
        {
            let chosenChildIndex = this.children.indexOf(chosenChild);
            chosenChild.children.forEach(grandChild => this._append(grandChild));
            this.children.splice(chosenChildIndex, 1);
            return 0;
        }
        else 
        {
            return -1;
        }
    }

    clone()
    {
        return _.cloneDeep(this);
    }

    flatten(): TreeNode<T>[]
    {
        const flat: TreeNode<T>[] = [this];
        const flattenREC = (node: TreeNode<T>, flat: TreeNode<T>[]) => 
        {
            node.children.forEach(child => 
            {
                flat.push(child);
                flattenREC(child, flat);
            });
        }
        flattenREC(this, flat)
        return flat;
    }

    forEach(f: (arg: TreeNode<T>) => void): void
    {
        f(this);
        this.children.forEach(c => c.forEach(f));
    }

    filter(f: (arg: TreeNode<T>) => boolean): TreeNode<T>
    {
        // TODO: actually implement
        return this;
    }

    get length(): number 
    {
        let no: number = this.children.length;
        this.children.forEach(function(child) 
        {
            no += child.length;
        });
        return no;
    }

    equals(other: TreeNode<T>): boolean
    {
        // TODO: how to check for property? - traits? o.0
        const [this_data, other_data]: any[] = [this.data, other.data];

        const eq = this_data.equals
            ? (a: any, b: any) => this_data.equals.bind(a)(b)
            : _.isEqual
        ;

        return eq(this_data, other_data) &&
            this.children.every((node, index) => node.equals(other.children[index]))
        ;
    }

    getParent<T>(
        node: TreeNode<T>,
        root: TreeNode<T>
    ): TreeNode<T> 
    {
        function getParentREC<T>(
            node: TreeNode<T>,
            root: TreeNode<T>,
            parentList: TreeNode<T>[]
        ) 
        {
            root.children.forEach(child => 
            {
                if (child === node) 
                {
                    parentList.push(root);
                }
                getParentREC(node, child, parentList);
            });
        }
        let parent: TreeNode<T>[] = [];
        getParentREC(node, root, parent);
        return parent[0];
    }

    _reenumerate(idProvider: () => NodeID): TreeNode<T>
    {
        this.id = idProvider();
        this.children.forEach(node => { node._reenumerate(idProvider); });
        return this;
    }
}

export class TreeIdProvider
{
    LOWER_ID_BOUND: number;
    UPPER_ID_BOUND: number;
    ROOT_ID: number;

    next_id: number;

    constructor(next_id: NodeID = NaN)
    {
        this.LOWER_ID_BOUND = Number.MIN_SAFE_INTEGER;
        this.UPPER_ID_BOUND = Number.MAX_SAFE_INTEGER;
        this.ROOT_ID = this.LOWER_ID_BOUND;

        this.next_id = isNaN(next_id)
            ? this.ROOT_ID
            : next_id
        ;
    }

    generate(): NodeID
    {
        const current_id = this.next_id;

        if (current_id === this.UPPER_ID_BOUND)
        {
            this.next_id = this.ROOT_ID;

            const err = new Error("ID has overflown");
            err.name = "ID_OVERFLOW"

            throw err;
        }

        this.next_id = current_id + 1;

        return current_id;
    }

    isRootId(x: NodeID): boolean
    {
        return x === this.ROOT_ID;
    }
}
