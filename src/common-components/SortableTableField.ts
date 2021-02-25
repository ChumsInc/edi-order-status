import React, {Component, ReactNode} from "react";

export interface SortableTableField {
    field: string,
    title?: string,
    render?: (row:any) => string|ReactNode
    className?: string | object,
    noSort?: boolean,
}
