import {EDIOrder, EDIOrderSort, EDIOrderSorter, OrderSort, SortFunction} from "./types";
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
}

function sorter(a: string | number, b: string | number): number {
    return a === b ? 0 : (a > b ? 1 : -1);
}

const sortCustomerNo: SortFunction = (a, b) => sorter(sortFields.CustomerNo(a), sortFields.CustomerNo(b));
const sortCustomerPONo: SortFunction = (a, b) => sorter(sortFields.CustomerPONo(a), sortFields.CustomerPONo(b));
const sortBillToName: SortFunction = (a, b) => sorter(sortFields.BillToName(a), sortFields.BillToName(b));
const sortOrderDate: SortFunction = (a, b) => sorter(sortFields.OrderDate(a), sortFields.OrderDate(b));
const sortShipExpireDate: SortFunction = (a, b) => sorter(sortFields.ShipExpireDate(a), sortFields.ShipExpireDate(b));
const sortUDF_CANCEL_DATE: SortFunction = (a, b) => sorter(sortFields.UDF_CANCEL_DATE(a), sortFields.UDF_CANCEL_DATE(b));
const sortOrderStatus: SortFunction = (a, b) => sorter(a.OrderStatus, b.OrderStatus);

export const sortFunctions: EDIOrderSorter = {
    CustomerNo: (a, b) => sortCustomerNo(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    BillToName: (a, b) => sortBillToName(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    CustomerPONo: (a, b) => sortCustomerPONo(a, b) || sortOrderStatus(a, b) || sortCustomerNo(a, b) || sortShipExpireDate(a, b),
    OrderDate: (a, b) => sortOrderDate(a, b) || sortShipExpireDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    ShipExpireDate: (a, b) => sortShipExpireDate(a, b) || sortOrderDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    UDF_CANCEL_DATE: (a, b) => sortUDF_CANCEL_DATE(a, b) || sortOrderDate(a, b) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    OrderCount: (a, b) => (a.OrderCount - b.OrderCount) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
    OrderTotal: (a, b) => (a.OrderTotal - b.OrderTotal) || sortCustomerPONo(a, b) || sortOrderStatus(a, b),
}

export const EDIOrderSortHandler = (list: EDIOrder[], {field, asc}: OrderSort): EDIOrder[] => {
    if (typeof sortFunctions[field] === "undefined") {
        return list
    }
    const sorted = list.sort(sortFunctions[field]);
    if (asc) {
        return sorted;
    }
    return sorted.reverse();
}
