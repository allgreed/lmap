import { URL, Name, Resource } from "./core/main";
import { Tree, makeTree, TreeNode, NodeID } from "./core/tree";
import React, { Component } from "react";
import { debounce } from "lodash";
import "./App.css";
import "react-tree-graph/dist/style.css";

const ReactTreeGraph:any = require("react-tree-graph"); // missing external types, haxing it'!


interface ReactTreeGraphNode {
    name: string,
    id: NodeID,
    children: Array<ReactTreeGraphNode>,
}

interface bleble {
    name: string,
}

function displayTree(t: Tree<bleble>): ReactTreeGraphNode
{
    function _displayTree(t: TreeNode<bleble>): ReactTreeGraphNode
    {
        const result: ReactTreeGraphNode = {
            name: t.data.name,
            id: t.id,
            children: [],
        }

        if (t.children.length !== 0)
        {
            result.children = t.children.map(_displayTree)
        }

        return result;
    }

    return _displayTree(t.root);
}

export default class App extends Component<{}, { chosenNode: NodeID, value: string, ourTree: Tree<bleble>}>
{
    constructor(props: any)
    {
        super(props);

        const ourTree = makeTree({name: "korzen"})
            .addToRoot({name: "notka1"})
            .addToRoot({name: "notka2"})
            .addTreeToRoot(makeTree({name: "notka3"})
                .addToRoot({name: "notka1od3"})
                .addToRoot({name: "notka2od3"}))
            .addTreeToRoot(makeTree({name: "notka4"})
                .addToRoot({name: "notka1od4"})
                .addToRoot({name: "notka2od4"})
                .addTreeToRoot(makeTree({name: "notka3od4"})
                    .addToRoot({name: "notka1od34"})
                    .addToRoot({name: "notka2od34"}))
                .addToRoot({name: "notka5"}))
        ;

        this.state= {
            value: "Name",
            chosenNode: ourTree.root.id,
            ourTree,
        };
        this.handleChange = this.handleChange.bind(this);
        this.delayedResize = this.delayedResize.bind(this);
    }

    // TODO: ffs
    handleChange(event: any) 
    {
        this.setState({value: event.target.value});
        event.preventDefault();
    }

    addCustom(event: any, node_id: NodeID, value: string)
    {
        this.state.ourTree.add(node_id, {name: value});

    }

    remove(event: any)
    {
        this.state.ourTree.removeNode(this.state.chosenNode);

        // TODO: select parent of the deleted node
        this.setState({
            ourTree: this.state.ourTree,
            chosenNode: Number.MIN_SAFE_INTEGER,
        });
    }

    selectNode(event: any, node_id: NodeID)
    {
        this.setState({
            chosenNode: node_id,
        });
    }

    editNode(event: any, value: string)
    {
        // TODO: get rid of private access
        this.state.ourTree._selectNodeById(this.state.chosenNode).data.name = value;

        this.setState({
            ourTree: this.state.ourTree,
        });

    }

    handleResize()
    {
        this.forceUpdate();
    }

    delayedResize = debounce(this.handleResize, 200);

    componentDidMount()
    {
        window.addEventListener("resize", this.delayedResize);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.delayedResize);
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

                {// TODO: get rid of private access
                }
                <label>Selected node: {this.state.ourTree._selectNodeById(this.state.chosenNode).data.name} : {this.state.chosenNode}</label>
                <button onClick = { e => this.remove(e) }>Usuń</button>
                <input type="text" name="node" value={this.state.value} onChange={this.handleChange}/>
                <button onClick = { e => this.addCustom(e, this.state.chosenNode, this.state.value) }>Dodaj</button>
                <button onClick = { e => this.editNode(e, this.state.value) }>Edytuj</button>

            </div>
        );
    }
}
