// TODO: how to limit importing scope?
import { Resource, ResourceTypeString, ResourceTypeStringValues, Link, Text } from "./core/resources";

import React, { FunctionComponent } from "react";
import { Formik, Form, Field } from "formik";

// TODO: do csses right
import "./ResourceAdder.css";


const ResourceAdder: React.FunctionComponent<{
    onAdd: (resource: Resource) => void,
}> = (props) =>
    <Formik
        initialValues={{
            typestring: ResourceTypeStringValues[0]
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
                {
                    ResourceTypeStringValues
                        .map(t => <option value={t}>{t}</option>)
                }
            </Field>
            <button type="submit"> Dodaj </button>
        </Form>
    </Formik>

export default ResourceAdder;


// TODO: get rid of the casting
function default_for_typestring(t: ResourceTypeString): Resource
{
    return {
        "Link": { __typename: "Link", address: "", is_done: false } as Link,
        "Text": { __typename: "Text", content: "", is_done: false } as Text,
    }[t];
}
