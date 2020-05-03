import { Link, Resource } from "./core/resources";
import React, { Component } from "react";

import "./ResourceEditor.css";


export default class ResourceEditor extends Component<{
    resource: Resource,
    isDeletable: boolean,
    onDelete: () => void,
    onAdd: (resource: Resource) => void,
    onEditonCommit: (resource: Resource) => void
}, {
    resource: Resource,
}>
{
    // TODO: what is the correct props type? o.0
    // TODO: can I type the props once?
    constructor(props: any)
    {
        super(props);

        this.state = {
            resource: this.props.resource,
        };
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    {
        this.setState({
            resource: {
                ...this.state.resource,
                address: event.currentTarget.value,
            }
        })
    }    

    render()
    {
        return(
            <div>
                {
                    // TODO: remove the hax and organize css classes
                    // TODO: clean App.css from NodeEditor-specific stuff
                }
                {
                    // TODO: editor should reflect on resource type
                    // TODO: add a possiblity to select type to add (then it's just editor)
                    // right now it's fixed to link
                }
                <label className="file-uploader-label">address</label>
                <input 
                    type="text"
                    defaultValue={(this.props.resource as Link).address}
                    onChange={ this.handleChange }
                />
                <div className="block-hax"></div>
                <button 
                    disabled={!this.props.isDeletable}
                    onClick={ _ => this.props.onDelete()}
                >
                    Usuń
                </button>
                <button onClick={ _ => this.props.onAdd(this.state.resource) }> Dodaj</button>
                <button onClick={ _ => this.props.onEditonCommit(this.state.resource) }>Edytuj</button>
            </div>
        );
    }
}
