import { URL, Name, Resource } from './core/main';
import { TreeNode } from './core/tree_methods';
import { getParent } from './core/tree_methods';
import React, { Component } from 'react';
import './App.css';
import 'react-tree-graph/dist/style.css';

const Tree:any = require('react-tree-graph'); // missing external types, haxing it'!


interface ReactTreeGraphNode {
    name: string,
    id: string,
    children: Array<ReactTreeGraphNode>,
}


function displayTree(t: TreeNode<string>): ReactTreeGraphNode
{
    const result: ReactTreeGraphNode = {
        name: t.name,
        id: t.id,
        children: [],
    }

    if (t.children.length !== 0)
    {
        result.children = t.children.map(displayTree)
    }

    return result;
}

export default class App extends Component<{}, { chosenNode: TreeNode<string>, value: string, count: number, ourTree: TreeNode<string>}>
{
  constructor(props: any){
    super(props);
    this.state= {
      chosenNode: new TreeNode(""),
      value: 'Name',
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
	};
	this.handleChange = this.handleChange.bind(this);
  }

    handleChange(event: any) {
    this.setState({value: event.target.value});
    event.preventDefault();
    }



  addCustom(event: any, node_id: string, value: string)
  {
    this.state.ourTree.filter(n => n.id === node_id)[0].add(new TreeNode(value))

    this.setState({
        ourTree: this.state.ourTree
    })

  }

  remove(event: any){
    getParent(this.state.chosenNode, this.state.ourTree).removeNode(this.state.chosenNode)

    this.setState({
        ourTree: this.state.ourTree,
        chosenNode: this.state.ourTree
    })
  }

  selectNode(event: any, node_id: string) {
    this.setState({
      chosenNode: node_id == this.state.ourTree.id ? this.state.ourTree : this.state.ourTree.filter(n => n.id === node_id)[0]
    })
  }

  editNode(event: any, value: string)
  {
    this.state.chosenNode.name = value

    this.setState({
        ourTree: this.state.ourTree
    })

  }

  render()
  {
      return (
        <div className="App">
            <Tree
                data={displayTree(this.state.ourTree)}
                gProps={{
                    onClick: this.selectNode.bind(this)
                }}
                width={window.innerWidth * (3/4)}
                height={window.innerHeight * (3/4)}
                keyProp="id"
                />

            <label>Selected node: {this.state.chosenNode.name} : {this.state.chosenNode.id}</label>
            <button onClick = { e => this.remove(e) }>Usuń</button>
            <input type="text" name="node" value={this.state.value} onChange={this.handleChange}/>
            <button onClick = { e => this.addCustom(e, this.state.chosenNode.id, this.state.value) }>Dodaj</button>
            <button onClick = { e => this.editNode(e, this.state.value) }>Edytuj</button>

        </div>
      );
  }
}
