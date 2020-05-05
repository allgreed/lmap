import { Text, Resource } from "./core/resources";
import { Tree, makeTree, TreeNode, NodeID, serializeTree, deserializeTree } from "./core/tree";

import ResourceEditor from "./ResourceEditor";
import ResourceAdder from "./ResourceAdder";

import React, { Component } from "react";
import { debounce } from "lodash";
import saveAs from "file-saver";

import "./App.css";
import "react-tree-graph/dist/style.css";

// TODO: unhax it
const ReactTreeGraph:any = require("react-tree-graph"); // missing external types, haxing it'!


export default class App extends Component<{
}, {
    chosenNode: NodeID,
    ourTree: Tree<Resource>
}>
{
    // TODO: what is the correct empty props type? o.0
    constructor(props: object)
    {
        super(props);

        const ourTree = makeTree({content: "korzen", is_done: false});

        this.state= {
            chosenNode: ourTree.root.id,
            ourTree,
        };
    }

    attachNewNodeToSelected = (r: Resource) =>
    {
        this.setState({
            ourTree: this.state.ourTree.add(this.state.chosenNode, r),
        });
    }

    removeSelectedNode = () => 
    {
        // TODO: any way of writing this DRY without breaking atomicity (both updates must happen in 1 cycle)?
        // TODO: select parent of the deleted node
        // TODO: don't leak implementation details - use a method to get root iD!!!
        this.setState({
            ourTree: this.state.ourTree.removeNode(this.state.chosenNode),
            chosenNode: Number.MIN_SAFE_INTEGER
        });
    }

    selectNode = (node_id: NodeID) =>
    {
        this.setState({
            chosenNode: node_id,
        });
    }

    replaceSelectedNodeContents = (r: Resource) =>
    {
        // TODO: get rid of private access
        // TODO: make the interface look immutable
        this.state.ourTree._selectNodeById(this.state.chosenNode).data = r;

        this.setState({
            ourTree: this.state.ourTree,
        });
    }

    readFromFile(event: React.FormEvent<HTMLInputElement>)
    {
        console.assert(!!event.currentTarget.files, "handler is attached to <input type='file'> ")
        if (!event.currentTarget.files) return;

        const file = event.currentTarget.files[0];

        const reader = new FileReader();

        // TODO: how to type this event properly?
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
        // TODO: unhax the type
        (saveAs as any)(new Blob([dumpedTree], {type: "text/plain;charset=utf-8"}), "tree.json");
    }

    render()
    {
        return (
            <div className="App">
                {
                    // TODO: extract this to seperate component
                }
                <ReactTreeGraph
                    data={displayTree(this.state.ourTree)}
                    gProps={{
                        onClick: (_: any, node_id: NodeID) => { this.selectNode(node_id) }
                    }}
                    width={window.innerWidth * (3/4)}
                    height={window.innerHeight * (3/4)}
                    keyProp="id"
                />

                {
                    // TODO: Extract ResourceRemover
                }
                <ResourceEditor 
                    key={this.state.chosenNode}
                    resource={this.state.ourTree.nodeData(this.state.chosenNode)}
                    isDeletable={!this.state.ourTree.isRoot(this.state.chosenNode)}
                    onDelete={this.removeSelectedNode}
                    onEditonCommit={this.replaceSelectedNodeContents}
                />

                <ResourceAdder
                    onAdd={this.attachNewNodeToSelected}
                />

                {
                    // TODO: extract this to seperate component
                }
                <div className="block-hax">
                    <form encType="multipart/form-data" noValidate>
                        <label className="file-uploader-label">Siorbaj z pliku:</label>
                        <input type="file" onChange = { e => this.readFromFile(e) }/>
                    </form>
                    <button onClick = { e => this.outputToFile() }>Pluj do pliku</button>
                </div>
            </div>
        );
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

}


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
