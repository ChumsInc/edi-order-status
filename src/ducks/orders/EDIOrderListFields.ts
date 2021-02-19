import {SortableTableField} from "../../common-components/SortableTableField";
import {EDIOrder} from "./types";
import {format, parseISO} from 'date-fns';
import numeral from "numeral";

const DATE_FORMAT: string = 'dd MMM yyyy';

export const ediOrdersFields: SortableTableField[] = [
    {field: 'CustomerNo', title: 'Customer', render: (row: EDIOrder) => `${row.ARDivisionNo}-${row.CustomerNo}`},
    {field: 'BillToName', title: 'Name'},
    {field: 'CustomerPONo', title: 'PO #'},
    {field: 'OrderDate', title: 'Order Date', render: (row: EDIOrder) => format(parseISO(row.OrderDate), DATE_FORMAT)},
    {
        field: 'ShipExpireDate',
        title: 'Ship Date',
        render: (row: EDIOrder) => format(parseISO(row.ShipExpireDate), DATE_FORMAT)
    },
    {
        field: 'UDF_CANCEL_DATE',
        title: 'Ship Date',
        render: (row: EDIOrder) => row.UDF_CANCEL_DATE ? format(parseISO(row.UDF_CANCEL_DATE), DATE_FORMAT) : ''
    },
    {field: 'OrderCount', title: 'Orders', className: 'right'},
    {field: 'OrderTotal', title: 'Order Total', render: (row:EDIOrder) => numeral(row.OrderTotal).format('$0,0.00'), className: 'right'}
];
