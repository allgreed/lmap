class TreeNode {
  readonly data: string;
  readonly is_done: boolean;
  readonly children: TreeNode[];
  constructor(data:string, is_done:boolean, children: TreeNode[] = []){
    this.data = data;
    this.is_done = is_done;
    this.children = children;
  }
  add(node:TreeNode){
    this.children.push(node);
  }
  remove(node:TreeNode) {
  //remove node + any subtree
    for(let i:number = 0;i<this.children.length;i++){
      if(this.children[i] === node){
        this.children.splice(i, 1);
        break;
      }
    }
  }
}

function getParentREC(node:TreeNode, root:TreeNode, parentList:TreeNode[]) {
  for(let i:number = 0;i<root.children.length;i++){
    if(root.children[i] == node){
      parentList.push(root);
    }
    getParentREC(node, root.children[i], parentList);

  }
}

function getParent(node: TreeNode, rootNode: TreeNode): TreeNode {
  let parent: TreeNode[] = [];
  getParentREC(node, rootNode, parent);
  return parent[0];
}

function howManyTreeNodes(node:TreeNode):number {
  let no:number = node.children.length;
  node.children.forEach(function(child){
    no += howManyTreeNodes(child);
  });
  return no;
}

function whichTreeNodesContainREC(text:string, node:TreeNode, results: TreeNode[]){
  node.children.forEach(function(child){
    if(child.data.includes(text)){
      results.push(child);
    }
    whichTreeNodesContainREC(text, child, results);
  });
}

function whichTreeNodesContain(text:string, node:TreeNode): TreeNode[] {
  let searchResults: TreeNode[] = [];
  whichTreeNodesContainREC(text, node, searchResults);
  return searchResults;
}

//SETUP
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

//TEST
console.log(root);
console.log(howManyTreeNodes(root));

let nodesWithString: TreeNode[] = whichTreeNodesContain("1od", root);
for(let i in nodesWithString){
  console.log(nodesWithString[i].data);
}

let exampleParent: TreeNode = getParent(nodesWithString[0], root);
console.log(exampleParent);
console.log(exampleParent.data);

exampleParent.remove(nodesWithString[0]);
console.log(root);
console.log(howManyTreeNodes(root));

//rm node with string "notka3"
let x: TreeNode[] = whichTreeNodesContain("notka3", root);
console.log(x);
getParent(x[0], root).remove(x[0]);

console.log(root);
console.log(howManyTreeNodes(root));

export default {};
