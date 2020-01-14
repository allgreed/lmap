import * as tree from './tree_methods'


let treeRoot = new tree.TreeNode("korzen")
  .add(new tree.TreeNode("notka1"))
  .add(new tree.TreeNode("notka2")
    .add(new tree.TreeNode("notka1od2"))
    .add(new tree.TreeNode("notka2od2")
      .add(new tree.TreeNode("notka1od22"))
      .add(new tree.TreeNode("notka2od22"))))
  .add(new tree.TreeNode("notka3")
    .add(new tree.TreeNode("notka1od3")));


test("count tree nodes", () => {
  let root = treeRoot.clone();
  expect(tree.howManyTreeNodes(root)).toEqual(8);
});

test("add node", () => {
  let root = treeRoot.clone();
  let node = root.children.filter(child => (child.content === "notka3"))[0]
  node.add(new tree.TreeNode("notatka2od3"));
  expect(node.children.some(child => (child.content === "notatka2od3"))).toEqual(true);
  expect(tree.howManyTreeNodes(root)).toEqual(9);
});

test("find node with string", () => {
  let root = treeRoot.clone();
  let nodesWithString: TreeNode[] = tree.whichTreeNodesContain((child) => child.content.includes("1od"), root);
  expect(nodesWithString.every(obj => obj.content.includes("1od"))).toEqual(true);
});

describe("manipulatiing one node", () => {
  test("find parent of a node", () => {
    let root = treeRoot.clone();
    let exampleNode = tree.whichTreeNodesContain((child) => child.content.includes("1od"), root)[0];
    let exampleParent = tree.getParent(exampleNode, root);
    expect(exampleParent.content).toEqual("notka2");
  });

  test("remove node", () => {
    let root = treeRoot.clone();
    let exampleNode = tree.whichTreeNodesContain((child) => child.content.includes("1od"), root)[0];
    let x: TreeNode[] = tree.whichTreeNodesContain((child) => child.content.includes("2od2"), root)[0];
    let xChildren = x.children;
    let parent: TreeNode = tree.getParent(x, root)
    tree.getParent(x, root).removeNode(x);
    expect(tree.howManyTreeNodes(root)).toEqual(7);
    expect(parent.children.some(child => child.content == "notka2od2")).toEqual(false);
    expect(parent.children).toEqual(expect.arrayContaining(xChildren));
  });
});
