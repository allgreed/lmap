import * from './tree_methods.ts'

beforeEach(() => {
  let root:TreeNode = new TreeNode("korzen", false);
  let note1:TreeNode = new TreeNode("notka1", false);
  let note2:TreeNode = new TreeNode("notka2", false);
  let note3:TreeNode = new TreeNode("notka3", false);
  let note21:TreeNode = new TreeNode("notka1od2", false);
  let note22:TreeNode = new TreeNode("notka2od2", false);
  let note221:TreeNode = new TreeNode("notka1od22", false);
  let note222:TreeNode = new TreeNode("notka2od22", false);
  let note31:TreeNode = new TreeNode("notka1od3", false);

  root.add(note1);
  root.add(note2);
  root.add(note3);
  note2.add(note21);
  note2.add(note22);
  note22.add(note221);
  note22.add(note222);
  note3.add(note31);
});

test("count tree nodes", () => {
  expect(howManyTreeNodes(root)).toEqual(8);
});
test("add node", () => {
  node3.add(new TreeNode("notatka2od3", false));
  expect(len(node3.children)).toEqual(2);
  expect(howManyTreeNodes(root)).toEqual(9);
});
test("find node with string", () => {
  let nodesWithString: TreeNode[] = whichTreeNodesContain("1od", root);
  expect(len(nodesWithString)).toEqual(3);
  expect(nodesWithString[0].content).toEqual("notka1od2");
});

describe("manipulatiing one node", () => {
  beforeEach(() => {
    //find a node with a string "1od"
    let firstNodeWithString: string = whichTreeNodesContain("1od", root)[0];
  });
  test("find parent of a node", () => {
    let exampleParent: TreeNode = getParent(firstNodeWithString, root);
    expect(exampleParent.content).toEqual("notka2");
  });
  test("remove node", () => {
    let x: TreeNode[] = whichTreeNodesContain("2od2", root);
    let parent: TreeNode = getParent(x[0], root)
    parent.removeNode(x[0]);
    expect(howManyTreeNodes(root)).toEqual(7);
    expect(len(parent.children)).toEqual(3);
    expect(parent.children[0].content).toEqual("notka1od22");
  });
});

// //SETUP
// let root:TreeNode = new TreeNode("korzen", false);
// let note1:TreeNode = new TreeNode("notka1", false);
// let note2:TreeNode = new TreeNode("notka2", false);
// let note3:TreeNode = new TreeNode("notka3", false);
// let note21:TreeNode = new TreeNode("notka1od2", false);
// let note22:TreeNode = new TreeNode("notka2od2", false);
// let note221:TreeNode = new TreeNode("notka1od22", false);
// let note222:TreeNode = new TreeNode("notka2od22", false);
// let note31:TreeNode = new TreeNode("notka1od3", false);
//
// root.add(note1);
// root.add(note2);
// root.add(note3);
// note2.add(note21);
// note2.add(note22);
// note22.add(note221);
// note22.add(note222);
// note3.add(note31);

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


// //TEST
// console.log(root);
// console.log(howManyTreeNodes(root));
//
// let nodesWithString: TreeNode[] = whichTreeNodesContain("1od", root);
// for(let i in nodesWithString){
//   console.log(nodesWithString[i].content);
// }
//
// let exampleParent: TreeNode = getParent(nodesWithString[0], root);
// console.log(exampleParent);
// console.log(exampleParent.content);
//
// exampleParent.removeNode(nodesWithString[0]);
// console.log(root);
// console.log(howManyTreeNodes(root));
//
// //rm node with string "notka3"
// let x: TreeNode[] = whichTreeNodesContain("notka3", root);
// console.log(x);
// getParent(x[0], root).removeNode(x[0]);
//
// console.log(root);
// console.log(howManyTreeNodes(root));
//
// export default {};
