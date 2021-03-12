import React, {InputHTMLAttributes} from 'react';
import classNames from "classnames";
import {InputFieldValue} from "./InputFieldValue";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    field: string,
    changeHandler: (props: InputFieldValue) => void,
}

const TextInput: React.FC<TextInputProps> = ({value, className, ...rest}) => {
    return (
        <input type="text" value={value}
               className={classNames('form-control form-control-sm', className)}
               {...rest} />
    )
}

export default TextInput;
