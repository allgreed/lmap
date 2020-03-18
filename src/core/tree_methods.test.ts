import * as tree from "./tree_methods"


let treeRoot = new tree.TreeNode("korzen")
    .add(new tree.TreeNode("notka1"))
    .add(new tree.TreeNode("notka2")
        .add(new tree.TreeNode("notka1od2"))
        .add(new tree.TreeNode("notka2od2")
            .add(new tree.TreeNode("notka1od22"))
            .add(new tree.TreeNode("notka2od22"))))
    .add(new tree.TreeNode("notka3")
        .add(new tree.TreeNode("notka1od3")));


test("count tree nodes", () => 
{
    let root = treeRoot.clone();
    expect(tree.howManyTreeNodes(root)).toEqual(8);
});

test("add node", () => 
{
    let root = treeRoot.clone();
    let node = root.children.filter(child => (child.data === "notka3"))[0]
    node.add(new tree.TreeNode("notatka2od3"));
    expect(node.children.some(child => (child.data === "notatka2od3"))).toEqual(true);
    expect(tree.howManyTreeNodes(root)).toEqual(9);
});

test("find node with string", () => 
{
    let root = treeRoot.clone();
    let nodesWithString: TreeNode[] = root.filter((child) => child.data.includes("1od"));
    expect(nodesWithString.every(obj => obj.data.includes("1od"))).toEqual(true);
});

test("find parent of a node", () => 
{
    let root = treeRoot.clone();
    let exampleNode = root.filter((child) => child.data.includes("1od"))[0];
    let exampleParent = tree.getParent(exampleNode, root);
    expect(exampleParent.data).toEqual("notka2");
});

test("remove node", () => 
{
    let root = treeRoot.clone();
    let x: TreeNode[] = root.filter((child) => child.data.includes("2od2"))[0];
    let xChildren = x.children;
    let parent: TreeNode = tree.getParent(x, root)
    tree.getParent(x, root).removeNode(x);
    expect(tree.howManyTreeNodes(root)).toEqual(7);
    expect(parent.children.some(child => child.data === "notka2od2")).toEqual(false);
    expect(parent.children).toEqual(expect.arrayContaining(xChildren));
});
