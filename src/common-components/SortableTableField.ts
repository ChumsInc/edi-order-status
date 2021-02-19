import {Component} from "react";

export interface SortableTableField {
    field: string,
    title?: string,
    render?: (row:any) => string|Component
    className?: string | object,
}
