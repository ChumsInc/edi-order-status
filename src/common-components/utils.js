
export const now = () => {
    return new Date().valueOf()
};

export const noop = () => {};

export const getClassName = (className, val) => {
    switch (typeof className) {
    case 'function':
        const _className = className(val);
        if (typeof _className === 'object') {
            return {
                ..._className,
            };
        }
        return {[_className]: true};
    case 'object':
        return {...className};
    default:
        return {[className]: true};
    }
};

export const filterVisibleItems = ({list = [], filter = '', showOnlySelected = false, hideZeroOnHand = false}) => {
    if (showOnlySelected) {
        return list.filter(item => item.selected);
    }

    let itemFilter = new RegExp('^', 'i');
    try {
        itemFilter = new RegExp(filter, 'i');
    } catch (err) {

    }
    return list
        .filter(i => !hideZeroOnHand || i.QuantityOnHand !== 0)
        .filter(i => {
            return filter === ''
                || itemFilter.test(i.ItemCode) || itemFilter.test(i.WarehouseCode)
                || itemFilter.test(i.ItemCodeDesc)
                || itemFilter.test(i.Category2) || itemFilter.test(i.Category3) || itemFilter.test(i.Category4);
        });
}

export const itemKey = (item) => ( `${item.ItemCode}:${item.WarehouseCode}`);
