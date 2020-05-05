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
}> = (props) =>
    <Formik
        initialValues={
            initial_fields_for_resource(props.resource)
        }
        onSubmit={(values, actions) =>
        {
            const resource = {
                ...values,
                is_done: false,
            };

            props.onEditonCommit(resource as any);
        }}
    >
        {
            // for whatever reason the "translate" attribute is needed
        }
        <Form translate="yes"> 
            { resource_to_fields(props.resource) }

            <div className="block-hax"></div>
            <button type="button" disabled={!props.isDeletable} onClick={ _ => props.onDelete()} > Usuń </button>
            <button type="submit"> Edytuj </button>
        </Form>
    </Formik>

export default ResourceEditor;


// TODO: use reflection instead of hardcode
// TODO: is the filedset a good idea here?
function resource_to_fields(r: Resource): Array<JSX.Element>
{
    return [
        {
            property: "address",
            jsx: <fieldset>
                <label className="file-uploader-label">address</label>
                <Field name="address" />
            </fieldset>
        },
        {
            property: "content",
            jsx: <fieldset>
                <label className="file-uploader-label">content</label>
                <Field name="content" />
            </fieldset>
        },
    ]
        .filter(x => x.property in r)
        .map(x => x.jsx)
    ;
}

// TODO: use reflection instead of hardcode
// TODO: return type will actually be a Resource 0.o
function initial_fields_for_resource(r: Resource): object
{
    return [
        "address",
        "content",
    ]
        .filter(x => x in r)
        .reduce((obj, prop) =>
        {
            // TODO: do something about the types
            (obj as any)[prop] = (r as any)[prop];
            return obj;
        }, {})
    ;
}
