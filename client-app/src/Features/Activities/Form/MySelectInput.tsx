import { useField } from 'formik';
import React from 'react';
import { Form, Label, Select, DropdownProps} from 'semantic-ui-react';
import { MySelectOption } from '../../../App/Common/Types/MySelectTypes';


interface Props {
    placeholder: string;
    name: string;
    options: MySelectOption[];
    label?: string;
    disabled?: boolean;
    onChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
}

export default function MySelectInput(props: Props) {
    const { name, options, placeholder, label, onChange, disabled, ...rest } = props;
    const [field, meta, helpers] = useField(name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{label}</label>
            <Select
                clearable
                options={options}
                value={field.value || null}
                onChange={(e, d) => {
                    helpers.setValue(d.value);
                    if (onChange){
                        onChange(e, d);
                    }    
                }
                }
                onBlur={()=> helpers.setTouched(true)}
                placeholder={placeholder}
                disabled = {disabled}
                {...rest}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red' >{meta.error}</Label>
            ): null}
        </Form.Field>
    )
}