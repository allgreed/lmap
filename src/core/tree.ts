import * as _ from "lodash";


export type NodeID = number;


export class Tree<T>
{
    root: TreeNode<T>;
    // TODO: unfuck this
    dependencies: any;

    constructor(root: TreeNode<T>, dependencies = {})
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

            this.root._reenumerate(this.dependencies.idProvider.generate.bind(this.dependencies.idProvider));
            newId = this.dependencies.idProvider.generate();
        }
        finally
        {
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
        this.root._append(t.root._reenumerate(this.dependencies.idProvider.generate.bind(this.dependencies.idProvider)))
        return this;
    }

    removeNode(which: NodeID): Tree<T>
    {
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

    // TODO: optional? - undo the ignore
    _selectNodeById(target_id: NodeID): TreeNode<T>
    {
        // @ts-ignore
        return this.root.flatten().find(node => node.id === target_id);
    }
}


// TODO: move this to Tree
export function makeTree<T>(data: T, dependenciesOverride = {}): Tree<T>
{
    const dependencies = {
        idProvider: new TreeIdProvider(),
        ...dependenciesOverride,
    };

    const root = new TreeNode<T>(dependencies.idProvider.generate(), data, []);

    return new Tree<T>(root, dependencies);
}


// TODO: get rid of this export
export class TreeNode<T>
{
    id: NodeID;
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
        let chosenChildIndex = node.children.findIndex(child => child === node);
        this.children.splice(chosenChildIndex, 1);
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


