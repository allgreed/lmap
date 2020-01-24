import { URL, Name, Resource } from './core/main';
import { TreeNode } from './core/tree_methods';
import React, { Component } from 'react';
import './App.css';
import 'react-tree-graph/dist/style.css';

const Tree:any = require('react-tree-graph'); // missing external types, haxing it'!


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

export default class App extends Component<{}, { chosenNode: TreeNode<string>, count: number, ourTree: TreeNode<string>}>
{
  constructor(props: any){
    super(props);
    this.state= {
      chosenNode: new TreeNode("exampleNode"),
      count:0,
      ourTree: new TreeNode("korzen")
  .add(new TreeNode("notka1"))
  .add(new TreeNode("notka2")
    .add(new TreeNode("notka1od2"))
    .add(new TreeNode("notka2od2")
      .add(new TreeNode("notka1od22"))
      .add(new TreeNode("notka2od22"))))
  .add(new TreeNode("notka3")
    .add(new TreeNode("notka1od3"))),
    }
  }

  cokolwiek(event: any)
  {
    this.setState({
        count: this.state.count + 1
      })
  }

  ubij_noda(event: any, node_key: string)
  {
    this.state.ourTree.filter(n => n.data === node_key)[0].add(new TreeNode("elon"))

    this.setState({
        ourTree: this.state.ourTree
    })
  }

  przepiszNoda(event: any, node_key: string) {
    this.setState({
        chosenNode: this.state.ourTree.filter(n => n.data === node_key)[0]
    })
  }

  render()
  {
      return (
        <div className="App">
            <Tree
                data={displayTree(this.state.ourTree)}
                height={400} // TODO: width and heigh as fullscreen - toolbar
                gProps={{
                    //onClick: this.ubij_noda.bind(this),
                    onClick: this.przepiszNoda.bind(this)
                }}
                width={400}/>
            <h1 className="red">{ this.state.count }</h1>
            <p>{this.state.chosenNode.data}</p>
            <button onClick = { e => this.cokolwiek(e) }>klikaj się!</button>
        </div>
      );
  }
}
