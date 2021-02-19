import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import RowsPerPage from "./RowsPerPage";
import FormGroup from "./FormGroup";
import SortableTableHeader from "./SortableTableHeader";
import SortableTableFooter from "./SortableTableFooter";
import CheckBoxToggle from "./CheckBoxToggle";

const noop = () => {};


const getClassName = (className, val) => {
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


const TableRowField = ({col, row}) => {
    const _className = col.className ? getClassName(col.className) : {};
    if (typeof col.render === 'function') {
        return (<td className={classNames(_className)}>{col.render(row)}</td>);
    }
    return (<td className={classNames(_className)}>{row[col.field]}</td>);
};

class TableRow extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        useCheckBoxSelect: PropTypes.bool,
        row: PropTypes.object,
        active: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
        activeClassName: PropTypes.string,
    };

    static defaultProps = {
        fields: [],
        useCheckBoxSelect: false,
        row: {},
        active: false,
        onClick: noop,
        className: '',
        activeClassName: 'table-active',
    }

    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }


    clickHandler(ev) {
        // if (ev && !!ev.preventDefault) {
        //     ev.preventDefault();
        //     ev.stopPropagation();
        // } else {
        //     return;
        // }
        this.props.onClick(this.props.row);
    }

    render() {
        const {fields, row, active, className, useCheckBoxSelect, activeClassName} = this.props;
        const rowClassName = getClassName(className, row);
        const _className = {
            [activeClassName]: active,
            ...rowClassName
        };
        return (
            <tr onClick={this.clickHandler} className={classNames(_className)}>
                {useCheckBoxSelect && (
                    <td><CheckBoxToggle checked={active} onChange={noop}/></td>
                )}
                {fields.map((col, index) => <TableRowField key={index} col={col} row={row}/>)}
            </tr>
        );
    }
}

export default class SortableTable extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            noSort: PropTypes.bool,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        data: PropTypes.array.isRequired,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        hasFooter: PropTypes.bool,
        footerData: PropTypes.object,
        keyField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selected: PropTypes.any,
        hasPageIndicators: PropTypes.bool,
        onSelect: PropTypes.func,
        onSelectAll: PropTypes.func,
        sorter: PropTypes.func,
        defaultSort: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool
        })]),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),
        page: PropTypes.number,
        rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        filtered: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        useCheckBoxSelect: PropTypes.bool,

        isActive: PropTypes.func.isRequired,
        activeClassName: PropTypes.string,

        onChangeSort: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangeRowsPerPage: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        data: [],
        hasFooter: false,
        footerData: {},
        keyField: 'id',
        hasPageIndicators: true,
        defaultSort: '',
        sort: {
            field: '',
            asc: true
        },
        page: 1,
        rowsPerPage: 25,
        filtered: false,
        rowClassName: '',
        useCheckBoxSelect: false,
        isActive: noop,
        activeClassName: 'table-active'
    };

    state = {
        sort: {
            field: '',
            asc: true,
        },
        page: 1,
        perPage: 25,
    };

    constructor(props) {
        super(props);
        this.onClickSort = this.onClickSort.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.sorter = this.sorter.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
    }

    componentDidMount() {
        const {defaultSort} = this.props;
        if (typeof defaultSort === 'object') {
            this.setState({sort: defaultSort});
        } else {
            this.setState({sort: {field: defaultSort, asc: true}});
        }
    }


    onClickSort(nextField) {
        const {sort} = this.state;
        if (sort.field === nextField) {
            sort.asc = !sort.asc;
            this.setState({sort});
        } else {
            this.setState({sort: {field: nextField, asc: true}});
        }
    }

    onSelectRow(row) {
        if (this.props.onSelect) {
            this.props.onSelect(row);
        }
    }

    onSelectAll() {
        if (this.props.onSelectAll) {
            const {pageData} = this.visibleRows();
            this.props.onSelectAll(pageData);
        }
    }

    handlePageChange(page) {
        this.props.onChangePage(page);
    }

    sorter(list) {
        const {field, asc} = this.state.sort;
        const {fields, sorter} = this.props;
        if (typeof sorter === 'function') {
            return sorter({list, field, asc});
        }
        const [colSorter] = fields.filter(col => col.name === field).map(col => col.sorter);
        if (colSorter) {
            return list.sort((a, b) => colSorter(a, b) * (asc ? 1 : -1));
        }
        const [{sortFn} = {}] = fields.filter(f => f.field === field);
        return list.sort((a, b) => {
            const aa = sortFn ? sortFn(a) : (typeof (a[field]) === 'number' ? a[field] : String(a[field]).toLowerCase());
            const bb = sortFn ? sortFn(b) : (typeof (b[field]) === 'number' ? b[field] : String(b[field]).toLowerCase());
            return (aa === bb ? 0 : (aa > bb ? 1 : -1)) * (asc ? 1 : -1);
        })
    }

    visibleRows() {
        const {data, rowsPerPage, page} = this.props;
        const rows = this.sorter(data);
        const pages = Math.ceil(rows.length / rowsPerPage);
        return {
            page,
            pages,
            pageData: rows.filter((row, index) => Math.floor(index / rowsPerPage) === (page - 1))
        }
    }

    render() {
        const {fields, data, className, rowsPerPage, keyField, filtered, selected, hasFooter, footerData, rowClassName, useCheckBoxSelect} = this.props;
        const {sort} = this.state;
        const {page, pages, pageData} = this.visibleRows();
        const areAllSelected = pageData.filter(row => this.props.isActive(row)) === pageData.length;
        return (
            <Fragment>
                <table className={classNames("table table-sm table-hover table-sortable table-sticky", className)}>
                    <SortableTableHeader fields={fields}
                                         sort={sort} onClickSort={this.onClickSort}
                                         useCheckBoxSelect={useCheckBoxSelect}
                                         onSelectAll={this.onSelectAll}/>
                    {!!hasFooter && (
                        <SortableTableFooter fields={fields} footerData={footerData}
                                             page={page} pages={pages}
                                             useCheckBoxSelect={useCheckBoxSelect}/>
                    )}
                    <tbody>
                    {pageData
                        .map(row => {
                            const key = typeof keyField === "function" ? keyField(row) : row[keyField];
                            return (
                                <TableRow key={key} row={row} fields={fields}
                                          activeClassName={this.props.activeClassName}
                                          useCheckBoxSelect={useCheckBoxSelect}
                                          className={rowClassName} active={this.props.isActive(row)}
                                          onClick={() => this.onSelectRow(row)}/>
                            );
                        })
                    }
                    </tbody>
                </table>
                <div className="page-display row row--filter">
                    <RowsPerPage value={rowsPerPage} onChange={this.props.onChangeRowsPerPage}/>
                    <FormGroup label="Pages">
                        {pages > 0 && <Pagination activePage={page}
                                                  pages={pages}
                                                  onSelect={this.handlePageChange} filtered={filtered}/>}
                        {data.length === 0 && <strong className="form-control form-control-sm form-control-plaintext">No records.</strong>}
                    </FormGroup>
                </div>
            </Fragment>
        );
    }
}
