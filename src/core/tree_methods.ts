import * as _ from 'lodash'

export class TreeNode<T> {
  content: T;
  children: TreeNode<T>[];

  constructor(content: T, children: TreeNode<T>[] = []) {
    this.content = content;
    this.children = children;
  }
  //TODO: to nonmutable
  add(node: TreeNode<T>): TreeNode<T> {
    this.children.push(node);
    return this;
  }
  remove(node: TreeNode<T>) {
  //remove node + any subtree
    for(let i: number = 0;i<this.children.length;i++){
      if(this.children[i] === node){
        this.children.splice(i, 1);
        break;
      }
    }
  }
  //TODO: to nonmutable
  removeNode(node: TreeNode<T>) {
  //remove node + attach its any Children to this.
    for(let i: number = 0;i < this.children.length; i++){
      if (this.children[i] === node) {
        for (let j: number = 0; j < this.children[i].children.length; j++) {
          this.add(this.children[i].children[j]);
        }
        this.children.splice(i, 1);
        break;
      }
    }
  }
  clone() {
    return _.cloneDeep(this);
  }
}

export function getParentREC(node: TreeNode<T>, root: TreeNode<T>, parentList: TreeNode<T>[]) {
  for(let i: number = 0; i < root.children.length; i++){
    if(root.children[i] == node){
      parentList.push(root);
    }
    getParentREC(node, root.children[i], parentList);
  }
}

export function getParent(node: TreeNode<T>, root: TreeNode<T>): TreeNode<T> {
  let parent: TreeNode<T>[] = [];
  getParentREC(node, root, parent);
  return parent[0];
}

export function howManyTreeNodes(root: TreeNode<T>): number {
  let no: number = root.children.length;
  root.children.forEach(function(child){
    no += howManyTreeNodes(child);
  });
  return no;
}

export function whichTreeNodesContainREC(text: string, root: TreeNode<T>, results: TreeNode<T>[]){
  root.children.forEach(function(child){
    if(child.content.includes(text)){
      results.push(child);
    }
    whichTreeNodesContainREC(text, child, results);
  });
}

export function whichTreeNodesContain(text: string, root: TreeNode<T>): TreeNode<T>[] {
  let searchResults: TreeNode<T>[] = [];
  whichTreeNodesContainREC(text, root, searchResults);
  return searchResults;
}
