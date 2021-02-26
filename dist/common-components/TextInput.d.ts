import React, { InputHTMLAttributes } from 'react';
import { InputFieldValue } from "./InputFieldValue";
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    field: string;
    changeHandler: (props: InputFieldValue) => void;
}
declare const TextInput: React.FC<TextInputProps>;
export default TextInput;
