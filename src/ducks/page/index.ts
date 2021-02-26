import {AnyAction, combineReducers} from 'redux';
import {appStorage, STORAGE_KEYS} from "../../appStorage";
import {ordersFilterChanged} from "../orders/actions";


const pageSetPage: string = 'app/page/setPage';
const pageSetRowsPerPage: string = 'app/page/setRowsPerPage';

export interface PageState {
    page: number;
    rowsPerPage: number;
}

export interface PageAction extends AnyAction {
    payload: {
        page?: number,
        rowsPerPage?: number,
    }
}

const initialState: PageState = {
    page: 1,
    rowsPerPage: appStorage.getItem(STORAGE_KEYS.ROWS_PER_PAGE) || 25,
}

const pageReducer = (state = initialState.page, action: PageAction) => {
    const {type, payload} = action;
    switch (type) {
    case pageSetPage:
        return payload.page || 1;
    case pageSetRowsPerPage:
    case ordersFilterChanged:
        return 1;
    default:
        return state;
    }
}

const rowsPerPageReducer = (state = initialState.rowsPerPage, action: PageAction) => {
    const {type, payload} = action;
    switch (type) {
    case pageSetRowsPerPage:
        appStorage.setItem(STORAGE_KEYS.ROWS_PER_PAGE, payload.rowsPerPage || 25);
        return payload.rowsPerPage || 25;
    default:
        return state;
    }
}

export default combineReducers({
    page: pageReducer,
    rowsPerPage: rowsPerPageReducer,
});

export const setRowsPerPage = (rowsPerPage: number): PageAction => ({type: pageSetRowsPerPage, payload: {rowsPerPage}})
export const setPage = (page: number): PageAction => ({type: pageSetPage, payload: {page}});
