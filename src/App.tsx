import { URL, Name, Resource } from "./core/main";
import { Tree, makeTree} from "./core/tree_methods";
import React, { Component } from "react";
import "./App.css";
import "react-tree-graph/dist/style.css";

const ReactTreeGraph:any = require("react-tree-graph"); // missing external types, haxing it'!


interface ReactTreeGraphNode {
    name: string,
    id: number,
    children: Array<ReactTreeGraphNode>,
}

interface bleble {
    name: string,
}

function displayTree(t: Tree<bleble>): ReactTreeGraphNode
{
    const result: ReactTreeGraphNode = {
        name: t.data.name,
        id: t.id,
        children: [],
    }

    if (t.children.length !== 0)
    {
        result.children = t.children.map(displayTree)
    }

    return result;
}

export default class App extends Component<{}, { chosenNode: Tree<bleble>, value: string, count: number, ourTree: Tree<bleble>}>
{
    constructor(props: any)
    {
        super(props);
        this.state= {
            chosenNode: makeTree({name: ""}),
            value: "Name",
            count:0,
            ourTree: makeTree({name: "korzen"})
                .add({name: "notka1"})
                .add({name: "notka2"})
                .addTree(makeTree({name: "notka3"})
                    .add({name: "notka1od3"})
                    .add({name: "notka2od3"}))
                .addTree(makeTree({name: "notka4"})
                    .add({name: "notka1od4"})
                    .add({name: "notka2od4"})
                    .addTree(makeTree({name: "notka3od4"})
                        .add({name: "notka1od34"})
                        .add({name: "notka2od34"}))
                    .add({name: "notka5"})),
        
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any) 
    {
        this.setState({value: event.target.value});
        event.preventDefault();
    }


    addCustom(event: any, node_id: number, value: string)
    {
        this.state.ourTree.flatten().filter(n => n.id === node_id)[0].add({name: value});
        this.forceUpdate();
    }

    remove(event: any)
    {
        if(this.isRoot(this.state.chosenNode.id))
        {
            throw new Error("Cannot delete root node");
        }
        else
        {
            this.state.ourTree.getParent(this.state.chosenNode, this.state.ourTree).removeNode(this.state.chosenNode)

            this.setState({
                ourTree: this.state.ourTree,
                chosenNode: this.state.ourTree
            })
        }
    }

    isRoot(node_id: number): boolean
    {
        return this.state.chosenNode === this.state.ourTree;
    }

    selectNode(event: any, node_id: number)
    {
        this.setState({
            chosenNode: node_id === this.state.ourTree.id ? this.state.ourTree : this.state.ourTree.flatten().filter(n => n.id === node_id)[0]
        })
    }

    editNode(event: any, value: string)
    {
        this.state.chosenNode.data.name = value

        this.setState({
            ourTree: this.state.ourTree
        })

    }

    render()
    {
        return (
            <div className="App">
                <ReactTreeGraph
                    data={displayTree(this.state.ourTree)}
                    gProps={{
                        onClick: this.selectNode.bind(this)
                    }}
                    width={window.innerWidth * (3/4)}
                    height={window.innerHeight * (3/4)}
                    keyProp="id"
                />

                <label>Selected node: {this.state.chosenNode.data.name} : {this.state.chosenNode.id}</label>
                <button onClick = { e => this.remove(e) } disabled = {this.isRoot(this.state.chosenNode.id) ? true : false}>Usuń</button>
                <input type="text" name="node" value={this.state.value} onChange={this.handleChange}/>
                <button onClick = { e => this.addCustom(e, this.state.chosenNode.id, this.state.value) }>Dodaj</button>
                <button onClick = { e => this.editNode(e, this.state.value) }>Edytuj</button>

            </div>
        );
    }
}
