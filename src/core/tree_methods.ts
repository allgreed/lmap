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
  removeTree(node: TreeNode<T>) {
  //remove node with children
    let  chosenChildIndex = node.children.findIndex(child => child === node);
    this.children.splice(chosenChildIndex, 1);
  }
  //TODO: to nonmutable
  removeNode(node: TreeNode<T>): number {
  //remove node and attach its any children to this.
  //return -1 if node doesnt exist
    let  chosenChild = this.children.find(child => child == node);
    if (chosenChild != undefined) {
      let  chosenChildIndex = this.children.indexOf(chosenChild);
      chosenChild.children.forEach(grandChild => this.add(grandChild));
      this.children.splice(chosenChildIndex, 1);
      return 0;
    }else {
      return -1;
    }

  }
  clone() {
    return _.cloneDeep(this);
  }
}

export function getParentREC(node: TreeNode<T>, root: TreeNode<T>, parentList: TreeNode<T>[]) {
  root.children.forEach((child) => {
    if(child == node){
      parentList.push(root);
    }
    getParentREC(node, child, parentList);
  });
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
