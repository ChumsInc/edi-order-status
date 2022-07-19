import {EDIOrder, EDIOrderSort, EDIOrderSorter, OrderSort, OrderStatusField, SortFunction} from "./types";
import {customerKey} from "./utils";

const sortFields: EDIOrderSort = {
    CustomerNo: (row: EDIOrder) => customerKey(row),
    BillToName: (row: EDIOrder) => row.BillToName,
    CustomerPONo: (row: EDIOrder) => row.CustomerPONo,
    OrderDate: (row: EDIOrder) => row.OrderDate,
    ShipExpireDate: (row: EDIOrder) => row.ShipExpireDate || row.LastInvoiceDate || '',
    UDF_CANCEL_DATE: (row: EDIOrder) => row.UDF_CANCEL_DATE || '',
    OrderCount: (row: EDIOrder) => row.OrderCount,
    OrderTotal: (row: EDIOrder) => row.OrderTotal,
    SalesOrders: (row: EDIOrder) => row.SalesOrders,
}

function sorter(a: string | number, b: string | number): number {
    return a === b ? 0 : (a > b ? 1 : -1);
}

const comparableDate = (value: string | Date | number | null = 0) => !value ? 0 : new Date(value).valueOf();
const comparableStatusDate = (row: EDIOrder, field: OrderStatusField): number => {
    return comparableDate(row.status_json[field]?.date)
}

const sortCustomerNo: SortFunction = (a, b) => sorter(sortFields.CustomerNo(a), sortFields.CustomerNo(b));
const sortCustomerPONo: SortFunction = (a, b) => sorter(sortFields.CustomerPONo(a), sortFields.CustomerPONo(b));
const sortBillToName: SortFunction = (a, b) => sorter(sortFields.BillToName(a), sortFields.BillToName(b));
const sortOrderDate: SortFunction = (a, b) => sorter(sortFields.OrderDate(a), sortFields.OrderDate(b));
const sortShipExpireDate: SortFunction = (a, b) => sorter(sortFields.ShipExpireDate(a), sortFields.ShipExpireDate(b));
const sortUDF_CANCEL_DATE: SortFunction = (a, b) => sorter(sortFields.UDF_CANCEL_DATE(a), sortFields.UDF_CANCEL_DATE(b));
const sortOrderStatus: SortFunction = (a, b) => sorter(a.OrderStatus, b.OrderStatus);
const sortImported: SortFunction = (a, b) => (comparableStatusDate(a, 'imported') - comparableStatusDate(b, 'imported'))
const sortInventory: SortFunction = (a, b) => (comparableStatusDate(a, 'inventory') - comparableStatusDate(b, 'imported'))
const sortPrinted: SortFunction = (a, b) => (comparableStatusDate(a, 'printed') - comparableStatusDate(b, 'imported'))
const sortLogistics: SortFunction = (a, b) => (comparableStatusDate(a, 'logistics') - comparableStatusDate(b, 'imported'))
const sortWorkCell: SortFunction = (a, b) => (comparableStatusDate(a, 'work-cell') - comparableStatusDate(b, 'imported'))
const sortPicked: SortFunction = (a, b) => (comparableStatusDate(a, 'picked') - comparableStatusDate(b, 'imported'))
const sortRouted: SortFunction = (a, b) => (comparableStatusDate(a, 'routed') - comparableStatusDate(b, 'imported'))
const sortASN: SortFunction = (a, b) => (comparableStatusDate(a, 'asn') - comparableStatusDate(b, 'imported'))
const sortPickedUp: SortFunction = (a, b) => (comparableStatusDate(a, 'picked-up') - comparableStatusDate(b, 'imported'))
const sortInvoiced: SortFunction = (a, b) => (comparableStatusDate(a, 'invoiced') - comparableStatusDate(b, 'imported'))
const sortCompleted: SortFunction = (a, b) => (comparableDate(a.completed) - comparableDate(b.completed))
const sortSalesOrders: SortFunction = (a, b) => sorter(a.SalesOrders, b.SalesOrders);

const sortAlpha = (a: string, b: string) => a.toLowerCase() === b.toLowerCase() ? 0 : (a.toLowerCase() > b.toLowerCase() ? 1 : -1);

export const sortFunctions: EDIOrderSorter = {
    ARDivisionNo: (a, b) => sortCustomerNo(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    CustomerNo: (a, b) => sortCustomerNo(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    BillToName: (a, b) => sortBillToName(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    CustomerPONo: (a, b) => sortCustomerPONo(a, b) || sortOrderStatus(a, b) || sortCustomerNo(a, b) || sortShipExpireDate(a, b),
    SalesOrders: (a, b) => sortSalesOrders(a, b)  || sortOrderStatus(a, b) || sortCustomerNo(a, b) || sortShipExpireDate(a, b),
    OrderDate: (a, b) => sortOrderDate(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    ShipExpireDate: (a, b) => sortShipExpireDate(a, b) || sortOrderDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    UDF_CANCEL_DATE: (a, b) => sortUDF_CANCEL_DATE(a, b) || sortOrderDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    OrderCount: (a, b) => (a.OrderCount - b.OrderCount) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    OrderTotal: (a, b) => (a.OrderTotal - b.OrderTotal) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    imported: (a, b) => sortImported(a, b) || sortCustomerNo(a, b) || sortCustomerPONo(a, b),
    inventory: (a, b) => sortInventory(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    printed: (a, b) => sortPrinted(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    logistics: (a, b) => sortLogistics(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    ["work-cell"]: (a, b) => sortWorkCell(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    picked: (a, b) => sortPicked(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    routed: (a, b) => sortRouted(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    asn: (a, b) => sortASN(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    ["picked-up"]: (a, b) => sortPickedUp(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    invoiced: (a, b) => sortInvoiced(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    completed: (a, b) => sortCompleted(a, b) || sortImported(a, b) || sortCustomerPONo(a, b),
    Company: () => 0,
    notes: (a, b) => (!!a.notes ? 1 : 0) - (!!b.notes ? 1 : 0),
    completedByUserName: (a, b) => sortAlpha(a.completedByUserName || '', b.completedByUserName || ''),
    CSUser: (a, b) => sortAlpha(a.CSUser, b.CSUser),
    InvoiceCount: (a, b) => a.InvoiceCount - b.InvoiceCount,
    isMAPADOC: () => 0,
    OrderStatus: (a, b) => sortAlpha(a.OrderStatus, b.OrderStatus),
    selected: () => 0,
    LastInvoiceDate: (a, b) => comparableDate(a.LastInvoiceDate) - comparableDate(b.LastInvoiceDate),
    status_json: () => 0,
}

export const orderSorter = (sort: OrderSort) => (a: EDIOrder, b: EDIOrder) => {
    return sortFunctions[sort.field](a, b) * (sort.asc ? 1 : -1);
}
