import { URL, Name, Resource } from './core/main';
import { TreeNode } from './core/tree_methods';
import React from 'react';
import './App.css';
import 'react-tree-graph/dist/style.css';

const Tree:any = require('react-tree-graph'); // missing external types, haxing it'!


let ourTree = new TreeNode("korzen")
  .add(new TreeNode("notka1"))
  .add(new TreeNode("notka2")
    .add(new TreeNode("notka1od2"))
    .add(new TreeNode("notka2od2")
      .add(new TreeNode("notka1od22"))
      .add(new TreeNode("notka2od22"))))
  .add(new TreeNode("notka3")
    .add(new TreeNode("notka1od3")));


interface ReactTreeGraphNode {
    name: String,
    children: Array<ReactTreeGraphNode>,
}


function displayTree(t: TreeNode<String>): ReactTreeGraphNode
{
    const result: ReactTreeGraphNode = {
        name: t.data,
        children: [],
    }

    if (t.children.length !== 0)
    {
        result.children = t.children.map(displayTree)
    }

    return result;
}


const App: React.FC = () => {
  return (
    <div className="App">
        <Tree
            data={displayTree(ourTree)}
            height={400} // TODO: width and heigh as fullscreen - toolbar
            width={400}/>
            </div>
  );
}

export default App;
