import { URL, Name, Resource } from "./core/main";
import { TreeNode } from "./core/tree_methods";
import { getParent } from "./core/tree_methods";
import React, { Component } from "react";
import "./App.css";
import "react-tree-graph/dist/style.css";

const Tree:any = require("react-tree-graph"); // missing external types, haxing it'!


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

export default class App extends Component<{}, { chosenNode: TreeNode<string>, value: string, count: number, ourTree: TreeNode<string>}>
{
    constructor(props: any)
    {
        super(props);
        this.state= {
            chosenNode: new TreeNode(""),
            value: "Name",
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

    handleChange(event: any) 
    {
        this.setState({value: event.target.value});
        event.preventDefault();
    }



    addCustom(event: any, node_key: string, value: string)
    {
        this.state.ourTree.filter(n => n.data === node_key)[0].add(new TreeNode(value))

        this.setState({
            ourTree: this.state.ourTree
        })

    }

    remove(event: any)
    {
        getParent(this.state.chosenNode, this.state.ourTree).removeNode(this.state.chosenNode)

        this.setState({
            ourTree: this.state.ourTree
        })
    }

    displayNode(event: any, node_key: string) 
    {
        this.setState({
            chosenNode: this.state.ourTree.filter(n => n.data === node_key)[0]
        })
    }

    editNode(event: any, value: string)
    {
        this.state.chosenNode.data = value

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
                        onClick: this.displayNode.bind(this)
                    }}
                    width={window.innerWidth * (3/4)}
                    height={window.innerHeight * (3/4)}
                />

                <label>Node:</label>
                <p>{this.state.chosenNode.data}</p>
                <button onClick = { e => this.remove(e) }>Usuń</button>
                <input type="text" name="node" value={this.state.value} onChange={this.handleChange}/>
                <button onClick = { e => this.addCustom(e, this.state.chosenNode.data, this.state.value) }>Dodaj</button>
                <button onClick = { e => this.editNode(e, this.state.value) }>Edytuj</button>

            </div>
        );
    }
}
