import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react';

interface Props {
    name: string;
    options: any;
}

export default function MyNumberInput(props: Props){
    const [field, meta, helpers] = useField(props.name);
    return (
        <Form.Field >
            <Select
                clearable
                options={props.options}
            />
        </Form.Field>
    )
}
