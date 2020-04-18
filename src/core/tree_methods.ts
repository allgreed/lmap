import * as _ from "lodash";

function id(): string 
{
    return Math.random()
        .toString(36)
        .substr(2, 9);
}

const treeIdProvider = id;

export function makeTree<T>(data: T, idProvider: () => string = treeIdProvider)
{
    return new TreeNode<T>(data, treeIdProvider(), [])
}

export class TreeNode<T> 
{
    id: string;
    children: TreeNode<T>[];
    data: T;

    constructor(data: T, id: string, children: TreeNode<T>[] = []) 
    {
        this.data = data;
        this.id = id;
        this.children = children;
    }
    add(data: T, idProvider: () => string = treeIdProvider): TreeNode<T> 
    {
        this.children.push(makeTree<T>(data, idProvider));
        return this;
    }
    addTree(node: TreeNode<T>): TreeNode<T> 
    {
        this.children.push(node);
        return this;
    }
    removeTree(node: TreeNode<T>) 
    {
        //remove node with children
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
            chosenChild.children.forEach(grandChild => this.add(grandChild.data));
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
    //filter(f: (arg: TreeNode<T>) => boolean): TreeNode<T>
    //{
    //    // TODO: implement this shit
    //}
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
}