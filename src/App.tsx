import { URL, Name, Resource } from "./core/resources";
import { Tree, makeTree, TreeNode, NodeID, serializeTree, deserializeTree } from "./core/tree";
import React, { Component } from "react";
import { debounce } from "lodash";
import "./App.css";
import "react-tree-graph/dist/style.css";
import saveAs from "file-saver";

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
            value: "Name", // TODO: can we get rid of this?
            chosenNode: ourTree.root.id,
            ourTree,
        };
        this.handleChange = this.handleChange.bind(this);
        this.debouncedHandleResize = this.debouncedHandleResize.bind(this);
    }

    // TODO: ffs
    handleChange(event: any) 
    {
        this.setState({value: event.target.value});
        event.preventDefault();
    }

    readFromFile(event: any)
    {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (onload_event: any) =>
        {
            const raw_file_contents = onload_event.target.result;

            const tree = deserializeTree<bleble>(raw_file_contents);

            this.setState({
                ourTree: tree,
                chosenNode: tree.root.id
            });
        };

        // TODO: Handle this
        //reader.onerror = function (evt) {
        //};

        reader.readAsText(file);
    }

    outputToFile()
    {
        const dumpedTree = serializeTree(this.state.ourTree);
        (saveAs as any)(new Blob([dumpedTree], {type: "text/plain;charset=utf-8"}), "tree.json");
    }

    addCustom(event: any, node_id: NodeID, value: string)
    {
        this.setState({ourTree: this.state.ourTree.add(node_id, {name: value})});
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

    debouncedHandleResize = debounce(() => this.forceUpdate(), 200);

    componentDidMount()
    {
        window.addEventListener("resize", this.debouncedHandleResize);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.debouncedHandleResize);
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
                <button onClick = { e => this.outputToFile() }>Pluj do pliku</button>
                <form encType="multipart/form-data" noValidate>
                    Siorbaj z pliku
                    <input type="file" onChange = { e => this.readFromFile(e) }/>
                </form>

            </div>
        );
    }
}
