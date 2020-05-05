import { Resource } from "./core/resources";

import React, { FunctionComponent } from "react";
import { Formik, Form, Field } from "formik";

// TODO: do csses right
import "./ResourceAdder.css";


// TODO: is is possible to reflect this from Resource union given proper typenames on interfaces?
type TypeString = "Link" | "Text";

const ResourceAdder: React.FunctionComponent<{
    onAdd: (resource: Resource) => void,
}> = (props) =>
    <Formik
        initialValues={{
            typestring: "Link"
        }}
        onSubmit={(values, _) => 
        {
            const { typestring } = values;

            // TODO: get rid of this hax
            props.onAdd(default_for_typestring(typestring as any)); 
        }}
    >
        {
            // for whatever reason the "translate" attribute is needed
        }
        <Form translate="yes"> 
            <Field name="typestring" component="select">
                <option value="Link">Link</option>
                <option value="Text">Text</option>
            </Field>

            <button type="submit"> Dodaj </button>
        </Form>
    </Formik>

export default ResourceAdder;


// TODO: make this a field on a resource
function default_for_typestring(t: TypeString): Resource
{
    return {
        "Link": { address: "", is_done: false },
        "Text": { content: "", is_done: false },
    }[t];
}
