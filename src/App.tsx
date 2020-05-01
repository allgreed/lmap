import { Link, Text, Resource } from "./core/resources";
import { Tree, makeTree, TreeNode, NodeID, serializeTree, deserializeTree } from "./core/tree";
import React, { Component } from "react";
import { debounce } from "lodash";
import saveAs from "file-saver";
import "./App.css";
import "react-tree-graph/dist/style.css";

const ReactTreeGraph:any = require("react-tree-graph"); // missing external types, haxing it'!


interface ReactTreeGraphNode {
    name: string,
    id: NodeID,
    children: Array<ReactTreeGraphNode>,
}


function displayTree(t: Tree<Resource>): ReactTreeGraphNode
{
    function _displayTree(t: TreeNode<Resource>): ReactTreeGraphNode
    {
        const resource_to_display = t.data;

        let fuj;
        // TODO: make this properly extendiable - maybe delegate?
        if ("address" in resource_to_display)
        {
            fuj = resource_to_display.address;
        }
        else
        {
            fuj = (resource_to_display as Text).content;
        }

        const result: ReactTreeGraphNode = {
            name: fuj,
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

export default class App extends Component<{}, { chosenNode: NodeID, value: string, ourTree: Tree<Resource>}>
{
    constructor(props: any)
    {
        super(props);

        const ourTree = makeTree({address: "korzen", is_done: false}) ;

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

            const tree = deserializeTree<Resource>(raw_file_contents);

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

    addCustom(event: any, node_id: NodeID, address: string)
    {
        // TODO: dehardcode the Link type
        this.setState({
            ourTree: this.state.ourTree.add(node_id, {address, is_done: false}),
        });
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
        // TODO: dehardcode the Link type
        (this.state.ourTree._selectNodeById(this.state.chosenNode).data as Link).address = value;

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

                {
                    // TODO: extract NodeEditor component
                    // TODO: add a proper editor that respects resource type
                }
                <label>Selected node: {this.state.chosenNode}</label>
                <button onClick = { e => this.remove(e) } disabled={this.state.ourTree.isRootId(this.state.chosenNode)}>Usuń</button>
                <input type="text" name="node" value={this.state.value} onChange={this.handleChange}/>
                {
                    // TODO: add a possiblity to select type to add (then it's just editor)
                    // right now it's fixed to link
                }
                <button onClick = { e => this.addCustom(e, this.state.chosenNode, this.state.value) }>Dodaj</button>
                <button onClick = { e => this.editNode(e, this.state.value) }>Edytuj</button>
                <button onClick = { e => this.outputToFile() }>Pluj do pliku</button>
                <form encType="multipart/form-data" noValidate>
                    <label className="file-uploader-label">Siorbaj z pliku:</label>
                    <input type="file" onChange = { e => this.readFromFile(e) }/>
                </form>
            </div>
        );
    }
}
