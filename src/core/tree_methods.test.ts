import * as tree from './tree_methods'
import * as _ from 'lodash'

let root;

let treeRoot = new tree.TreeNode("korzen", false);
let note1 = new tree.TreeNode("notka1", false);
let note2 = new tree.TreeNode("notka2", false);
let note3 = new tree.TreeNode("notka3", false);
let note21 = new tree.TreeNode("notka1od2", false);
let note22 = new tree.TreeNode("notka2od2", false);
let note221 = new tree.TreeNode("notka1od22", false);
let note222 = new tree.TreeNode("notka2od22", false);
let note31 = new tree.TreeNode("notka1od3", false);

treeRoot.add(note1);
treeRoot.add(note2);
treeRoot.add(note3);
note2.add(note21);
note2.add(note22);
note22.add(note221);
note22.add(note222);
note3.add(note31);

beforeEach(() => {
  root = _.cloneDeep(treeRoot)
});

test("count tree nodes", () => {
  expect(tree.howManyTreeNodes(root)).toEqual(8);
});
test("add node", () => {
  let node = root.children.filter(child => (child.content === "notka3"))[0]
  node.add(new tree.TreeNode("notatka2od3", false));
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
    //find a node with a string "1od"
    firstNodeWithString = tree.whichTreeNodesContain("1od", root)[0];
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
