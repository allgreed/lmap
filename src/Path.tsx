import React, { FunctionComponent } from "react";

import { NodeID } from "./core/tree";

import "./Path.css";

const Path: React.FunctionComponent<{
  currentPath: NodeID[],
  chosenNode: NodeID,
}> = (props) =>
    <ul className="breadcrumb">
        {props.currentPath.map(breadcrumb =>
            breadcrumb === props.chosenNode ? <li className="chosen" key={breadcrumb}>{breadcrumb}</li> : <li>{breadcrumb}</li>)}
    </ul>

export default Path;
