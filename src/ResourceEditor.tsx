import { Resource } from "./core/resources";

import React, { FunctionComponent } from "react";
import { Formik, Form, Field } from "formik";

// TODO: remove the block-hax and organize css classes
// TODO: clean App.css from NodeEditor-specific stuff
import "./ResourceEditor.css";


const ResourceEditor: React.FunctionComponent<{
    resource: Resource,
    isDeletable: boolean,
    onDelete: () => void,
    onEditonCommit: (resource: Resource) => void,
    onRemoveSubtree: () => void,
}> = (props) =>
    <Formik
        initialValues={
            props.resource
        }
        onSubmit={(values, actions) =>
        {
            const resource = {
                ...values,
                __typename: props.resource.__typename,
            };

            props.onEditonCommit(resource as Resource);
        }}
    >
        {
            // for whatever reason the "translate" attribute is needed
        }
        <Form translate="yes"> 
            { resource_to_fields(props.resource) }
            <div className="block-hax"></div>
            <button type="button" disabled={!props.isDeletable} onClick={_ => props.onDelete()} > Remove </button>
            <button type="button" onClick={_ => props.onRemoveSubtree()} > Remove subtree </button>
            <button type="submit"> Save </button>
        </Form>
    </Formik>

export default ResourceEditor;


// TODO: is the filedset a good idea here?
// TODO: dry-ify this a bit
function resource_to_fields(r: Resource): Array<JSX.Element>
{
    return {
        "Link": [<fieldset>
            <label className="file-uploader-label">title</label>
            <Field name="title" />

            <label className="file-uploader-label">address</label>
            <Field name="address" />

            <label>Is done?</label>
            <Field type="checkbox" name="is_done" />
        </fieldset>],
        "Text": [<fieldset>
            <label className="file-uploader-label">content</label>
            <Field name="content" />

            <label>Is done?</label>
            <Field type="checkbox" name="is_done" />
        </fieldset>],
        "Null": [],
    }[r.__typename];
}
