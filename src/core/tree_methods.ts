import * as _ from "lodash";

function id(): string {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

export class TreeNode<T> {
  id: string;
  children: TreeNode<T>[];
  data: T;

  constructor(data: T, id: string, children: TreeNode<T>[] = []) {
    this.data = data;
    this.id = id;
    this.children = children;
  }
  add(data: T, idProvider: () => string = id): TreeNode<T> {
    this.children.push(new TreeNode<T>(data, idProvider(), []));
    return this;
  }
  removeTree(node: TreeNode<T>) {
    //remove node with children
    let chosenChildIndex = node.children.findIndex(child => child === node);
    this.children.splice(chosenChildIndex, 1);
  }
  removeNode(node: TreeNode<T>): number {
    //remove node and attach its any children to this.
    //return -1 if node doesnt exist
    let chosenChild = this.children.find(child => child === node);
    if (chosenChild !== undefined) {
      let chosenChildIndex = this.children.indexOf(chosenChild);
      chosenChild.children.forEach(grandChild => this.add(grandChild));
      this.children.splice(chosenChildIndex, 1);
      return 0;
    } else {
      return -1;
    }
  }
  clone() {
    return _.cloneDeep(this);
  }

  filter(f: (arg: TreeNode<T>) => boolean): TreeNode<T>[] {
    function filterREC(
      f: (arg: TreeNode<T>) => boolean,
      results: TreeNode<T>[]
    ) {
      //for filter()
      if (f(this)) {
        results.push(this);
      } else {
        this.children.forEach(function(child) {
          child.filterREC(f, results);
        });
      }
    }

    //for root obj
    let searchResults: TreeNode<T>[] = [];
    filterREC(f, searchResults);
    return searchResults;
  }
}

export function getParent<T>(
  node: TreeNode<T>,
  root: TreeNode<T>
): TreeNode<T> {
  function getParentREC<T>(
    node: TreeNode<T>,
    root: TreeNode<T>,
    parentList: TreeNode<T>[]
  ) {
    root.children.forEach(child => {
      if (child === node) {
        parentList.push(root);
      }
      getParentREC(node, child, parentList);
    });
  }
  let parent: TreeNode<T>[] = [];
  getParentREC(node, root, parent);
  return parent[0];
}

export function howManyTreeNodes<T>(root: TreeNode<T>): number {
  let no: number = root.children.length;
  root.children.forEach(function(child) {
    no += howManyTreeNodes(child);
  });
  return no;
}
