// TODO: how to limit importing scope?
import { Resource, Link, Text } from "./core/resources";
import { Tree, makeTree, TreeNode, NodeID, serializeTree, deserializeTree } from "./core/tree";
import { GlobalHotKeys } from "react-hotkeys";

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

        const initial_resource: Resource = {__typename: "Null"};
        const ourTree = makeTree(initial_resource);

        this.state= {
            chosenNode: ourTree.root.id,
            ourTree,
        };
    }

    readFromLocalState = () =>
    {
        if (localStorage.hasOwnProperty("tree"))
        {
            const serializedTree = localStorage.getItem("tree")!
            const tree = deserializeTree<Resource>(serializedTree);

            this.setState({
                ourTree: tree,
                chosenNode: tree.root.id
            });
        }
    }

    outputToLocalState = () =>
    {
        const serializedTree = serializeTree(this.state.ourTree)
        localStorage.setItem("tree", serializedTree);
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
        // TODO: don't leak implementation details - use a method to get root iD!!!
        const root = this.state.ourTree.root
        const toBeRemovedNode = this.state.ourTree._selectNodeById(this.state.chosenNode)
        const parent = root.getParent(toBeRemovedNode, root)
        this.setState({
            ourTree: this.state.ourTree.removeNode(this.state.chosenNode),
            chosenNode: parent.id
        });
    }

    selectNode = (node_id: NodeID) =>
    {
        this.setState({
            chosenNode: node_id,
        });
    }

    selectParentNode = () =>
    {
        const root = this.state.ourTree.root
        const node = this.state.ourTree._selectNodeById(this.state.chosenNode)
        if (node !== root)
        {
            const parent = root.getParent(node, root)
        
            this.setState({
                chosenNode: parent.id
            })
        }
    }

    selectChildNode = () =>
    {
        const node = this.state.ourTree._selectNodeById(this.state.chosenNode)
        if (node.children.length !== 0)
        {
            const child = node.children[0]
        
            this.setState({
                chosenNode: child.id
            })
        }
    }

    selectNextChildNode = () =>
    {
        const root = this.state.ourTree.root
        const node = this.state.ourTree._selectNodeById(this.state.chosenNode)
        if (node !== root)
        {
            const parent = root.getParent(node, root)
            const indexOfNode = parent.children.indexOf(node)
            const indexOfNextChild = Math.min(indexOfNode+1, parent.children.length-1)
            const nextChild = parent.children[indexOfNextChild]
            
            this.setState({
                chosenNode: nextChild.id
            })
        }
    }

    selectPrevChildNode = () =>
    {
        const root = this.state.ourTree.root
        const node = this.state.ourTree._selectNodeById(this.state.chosenNode)
        if (node !== root)
        {
            const parent = root.getParent(node, root)
            const indexOfNode = parent.children.indexOf(node)
            const indexOfPrevChild = Math.max(indexOfNode-1, 0)
            const prevChild = parent.children[indexOfPrevChild]
            
            this.setState({
                chosenNode: prevChild.id
            })
        }
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

    keyMap = {
        LEFT: ["h", "left"],
        RIGHT: ["l", "right"],
        UP: ["k", "up"],
        DOWN: ["j", "down"],
        DELETE_NODE: ["del", "d"],
    };

    handlers = {
        LEFT: this.selectParentNode,
        RIGHT: this.selectChildNode,
        UP: this.selectPrevChildNode,
        DOWN: this.selectNextChildNode,
        DELETE_NODE: this.removeSelectedNode,
    };

    render()
    {
        return (
            <>
                <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers}/>
                <div className="App">
                    {
                    // TODO: extract this to seperate component
                    }
                    <ReactTreeGraph
                        data={displayTree(this.state.ourTree, this.state.chosenNode)}
                        gProps={{
                            onClick: (_: any, node_id: NodeID) => { this.selectNode(node_id) }
                        }}
                        width={window.innerWidth * (3/4)}
                        height={window.innerHeight * (3/4)}
                        keyProp="id"
                    />

                    <div className="controls">
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
                </div>
            </>
        );
    }

    debouncedHandleResize = debounce(() => this.forceUpdate(), 200);

    componentDidMount()
    {
        window.addEventListener("resize", this.debouncedHandleResize);
        this.readFromLocalState()
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.debouncedHandleResize);
    }

    componentDidUpdate(): void
    {
        this.outputToLocalState()
    }
}


interface ReactTreeGraphNode {
    name: string,
    id: NodeID,
    children: Array<ReactTreeGraphNode>,
    textProps: {},
    circleProps: {},
}


function displayTree(t: Tree<Resource>, chosenNode: NodeID): ReactTreeGraphNode
{
    function _displayTree(t: TreeNode<Resource>): ReactTreeGraphNode
    {
        const cssClasses = [
            (() =>
            {
                if (t.data.__typename === "Null") return "";

                if (t.data.is_done)
                {
                    return "done";
                }
                else
                {
                    return "";
                }
            })(),
            t.id === chosenNode && "selected"
        ].join(" ")
            
        const result: ReactTreeGraphNode = {
            name: displayResource(t.data),
            id: t.id,
            children: [],
            textProps: {className: cssClasses},
            circleProps: {className: cssClasses},
        }

        // terminate recursion
        if (t.children.length !== 0)
        {
            result.children = t.children.map(_displayTree)
        }

        return result;
    }

    return _displayTree(t.root);
}


function displayResource(r: Resource): string
{
    return {
        "Link": (r as Link).title,
        "Text": (r as Text).content,
        "Null": "",
    }[r.__typename];
}
