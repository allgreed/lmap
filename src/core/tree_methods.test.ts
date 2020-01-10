import * as tree from './tree_methods'

let root;

let treeRoot = new tree.TreeNode("korzen");
let note1 = new tree.TreeNode("notka1");
let note2 = new tree.TreeNode("notka2");
let note3 = new tree.TreeNode("notka3");
let note21 = new tree.TreeNode("notka1od2");
let note22 = new tree.TreeNode("notka2od2");
let note221 = new tree.TreeNode("notka1od22");
let note222 = new tree.TreeNode("notka2od22");
let note31 = new tree.TreeNode("notka1od3");

treeRoot.add(note1);
treeRoot.add(note2);
treeRoot.add(note3);
note2.add(note21);
note2.add(note22);
note22.add(note221);
note22.add(note222);
note3.add(note31);

beforeEach(() => {
  root = treeRoot.clone();
});

test("count tree nodes", () => {
  expect(tree.howManyTreeNodes(root)).toEqual(8);
});
test("add node", () => {
  let node = root.children.filter(child => (child.content === "notka3"))[0]
  node.add(new tree.TreeNode("notatka2od3"));
  expect(node.children.some(child => (child.content === "notatka2od3"))).toEqual(true);
  expect(tree.howManyTreeNodes(root)).toEqual(9);
});
test("find node with string", () => {
  let nodesWithString: TreeNode[] = tree.whichTreeNodesContain("1od", root);
  expect(nodesWithString.every(obj => obj.content.includes("1od"))).toEqual(true);
});

describe("manipulatiing one node", () => {
  let firstNodeWithString;

  beforeEach(() => {
    firstNodeWithString = tree.whichTreeNodesContain("1od", root)[0];
  });
  test("tick done", () => {
    firstNodeWithString.setIs_done(true);
    expect(firstNodeWithString.is_done).toEqual(true);
  });
  test("tick undone", () => {
    firstNodeWithString.setIs_done(false);
    expect(firstNodeWithString.is_done).toEqual(false);
  });
  test("find parent of a node", () => {
    let exampleParent: TreeNode = tree.getParent(firstNodeWithString, root);
    expect(exampleParent.content).toEqual("notka2");
  });
  test("remove node", () => {
    let x: TreeNode[] = tree.whichTreeNodesContain("2od2", root)[0];
    let xChildren = x.children;
    let parent: TreeNode = tree.getParent(x, root)
    tree.getParent(x, root).removeNode(x);
    expect(tree.howManyTreeNodes(root)).toEqual(7);
    expect(parent.children.some(child => child.content == "notka2od2")).toEqual(false);
    expect(parent.children).toEqual(expect.arrayContaining(xChildren));
  });
});

// //future SETUP for immutable add,remove fns
// let root:TreeNode = {content: "korzen", is_done: false, children: [
//   {content: "notka1", is_done: false, children: []},
//   {content: "notka2", is_done: false, children: [
//     {content: "notka1od2", is_done: false, children: []},
//     {content: "notka2od2", is_done: false, children: [
//       {content: "notka1od22", is_done: false, children: []},
//       {content: "notka2od22", is_done: false, children: []}
//     ]}
//   ]},
//   {content: "notka3", is_done: false, children: [
//     {content: "notka1od3", is_done: false, children: []}
//   ]}
// ]};
