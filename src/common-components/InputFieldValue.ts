export interface InputFieldValue {
    field: string,
    value: string,
}

export interface InputProps {
    onChange: ({ field, value }: InputFieldValue) => void,
    className: object|string,
}
