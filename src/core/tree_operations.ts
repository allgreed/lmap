class TreeNode {
  id: number;
  data: string;
  is_done: boolean;
  children: Array<TreeNode>;
  constructor(id:number, data:string, is_done:boolean, children: Array<TreeNode> = []){
    this.id = id;
    this.data = data;
    this.is_done = is_done;
    this.children = children;
  };
  add(node:TreeNode){
    this.children.push(node);
  };
  remove(id:number){
    for(let i:number = 0;i<this.children.length;i++){
      if(this.children[i].id == id){
        this.children.splice(i, 1);
        break;
      }
    }
  };
}

function getParent(node:TreeNode, root:TreeNode, parentList:Array<TreeNode>){
  for(let i:number = 0;i<root.children.length;i++){
    if(root.children[i] == node){
      parentList.push(root);
    }
    getParent(node, root.children[i], parentList);

  }
}

function howManyTreeNodes(node:TreeNode):number {
  let no:number = node.children.length;
  node.children.forEach(function(child){
    no += howManyTreeNodes(child);
  });
  return no;
}

function whichTreeNodesContain(text:string, node:TreeNode, results:Array<TreeNode>){
  node.children.forEach(function(child){
    if(child.data.includes(text)){
      results.push(child);
    }
    whichTreeNodesContain(text, child, results);
  });
}


let root:TreeNode = new TreeNode(0, "korzen", false);
let note1:TreeNode = new TreeNode(1, "notka1", false);
let note2:TreeNode = new TreeNode(2, "notka2", false);
let note3:TreeNode = new TreeNode(3, "notka3", false);
let note21:TreeNode = new TreeNode(4, "notka1od2", false);
let note22:TreeNode = new TreeNode(5, "notka2od2", false);
let note221:TreeNode = new TreeNode(6, "notka1od22", false);
let note222:TreeNode = new TreeNode(7, "notka2od22", false);
let note31:TreeNode = new TreeNode(8, "notka1od3", false);

root.add(note1);
root.add(note2);
root.add(note3);
note2.add(note21);
note2.add(note22);
note22.add(note221);
note22.add(note222);
note3.add(note31);
console.log(howManyTreeNodes(root));
let exampleNodes = new Array<TreeNode>();
whichTreeNodesContain("1od", root, exampleNodes);
for(i in exampleNodes){
  console.log(exampleNodes[i].id);
}
let exampleParent:Array<TreeNode>;
getParent(exampleNodes[0], root, exampleParent);
console.log(exampleParent);
exampleParent.remove(4);
console.log(howManyTreeNodes(root));
