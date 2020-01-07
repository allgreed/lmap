export class TreeNode {
  readonly content: string;
  readonly is_done: boolean;
  readonly children: TreeNode[];
  constructor(content:string, is_done:boolean, children: TreeNode[] = []){
    this.content = content;
    this.is_done = is_done;
    this.children = children;
  }
  //TODO: to nonmutable
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

  //TODO: to nonmutable
  removeNode(node:TreeNode) {
  //remove node + attach its any Children to this.
    for(let i:number = 0;i < this.children.length; i++){
      if (this.children[i] === node) {
        for (let j:number = 0; j < this.children[i].children.length; j++) {
          this.add(this.children[i].children[j]);
        }
        this.children.splice(i, 1);
        break;
      }
    }
  }
}

export function getParentREC(node:TreeNode, root:TreeNode, parentList:TreeNode[]) {
  for(let i:number = 0; i < root.children.length; i++){
    if(root.children[i] == node){
      parentList.push(root);
    }
    getParentREC(node, root.children[i], parentList);

  }
}

export function getParent(node: TreeNode, root: TreeNode):TreeNode {
  let parent: TreeNode[] = [];
  getParentREC(node, root, parent);
  return parent[0];
}

export function howManyTreeNodes(root:TreeNode):number {
  let no:number = root.children.length;
  root.children.forEach(function(child){
    no += howManyTreeNodes(child);
  });
  return no;
}

export function whichTreeNodesContainREC(text:string, root:TreeNode, results: TreeNode[]){
  root.children.forEach(function(child){
    if(child.content.includes(text)){
      results.push(child);
    }
    whichTreeNodesContainREC(text, child, results);
  });
}

export function whichTreeNodesContain(text:string, root:TreeNode): TreeNode[] {
  let searchResults: TreeNode[] = [];
  whichTreeNodesContainREC(text, root, searchResults);
  return searchResults;
}
