export const appStorage = {
    getItem: (key:string):any => {
        if (window.localStorage) {
            const val = window.localStorage.getItem(key);
            try {
                return JSON.parse(val || 'null');
            } catch (e) {
                console.log('getItem()', e.message, val);
            }
        }
        return null;
    },
    setItem: (key:string, value:any):void => {
        if (window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    },
    delete: (key:string):void => {
        if (window.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
};

export const STORAGE_KEYS = {
    ROWS_PER_PAGE: 'com.chums.intranet.edi-order-status.rowsPerPage',
};
