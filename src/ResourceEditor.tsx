import { Link, Resource } from "./core/resources";

import React, { FunctionComponent } from "react";
import { Formik, Form, Field } from "formik";

import "./ResourceEditor.css";


type SubmissionAction = "ADD" | "EDIT";

// TODO: unhax this after https://github.com/jaredpalmer/formik/pull/2437 is completed
let hax: SubmissionAction = "ADD";


const ResourceEditor: React.FunctionComponent<{
    resource: Resource,
    isDeletable: boolean,
    onDelete: () => void,
    onAdd: (resource: Resource) => void,
    onEditonCommit: (resource: Resource) => void,
}> = (props) =>
    <Formik
        initialValues={
            // TODO: editor should reflect on resource type
            {
                address: (props.resource as Link).address
            }
        }
        onSubmit={(values, actions) =>
        {
            const submission_action = hax;
            const resource = {
                ...values,
                is_done: false,
            };

            if (submission_action === "ADD")
            {
                props.onAdd(resource);
            }
            else
            {
                console.assert(submission_action === "EDIT", "submission_action is edition commit")
                props.onEditonCommit(resource);
            }
        }}
    >
        {
            // for whatever reason the "translate" attribute is needed
        }
        <Form translate="yes"> 
            {
                // TODO: remove the block-hax and organize css classes
                // TODO: clean App.css from NodeEditor-specific stuff
            }
            {
                // TODO: editor should reflect on resource type
            }
            <label className="file-uploader-label">address</label>
            <Field name="address" />

            {
                // TODO: add a possiblity to select type to add (then it's just editor)
                // right now it's fixed to link
            }
            <div className="block-hax"></div>
            <button type="submit" disabled={!props.isDeletable} onClick={ _ => props.onDelete()} > Usuń </button>
            <button type="submit" onClick={ () => { hax = "ADD" } } > Dodaj </button>
            <button type="submit" onClick={ () => { hax = "EDIT" } } > Edytuj </button>
        </Form>
    </Formik>

export default ResourceEditor;
