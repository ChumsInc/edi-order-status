/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

const SortIcon = ({asc = true}) => {
    return (
        asc
            ? <span className="oi oi-sort-ascending" />
            : <span className="oi oi-sort-descending" />
    )
};

export default class ThSortable extends Component {
    static propTypes = {
        field: PropTypes.string.isRequired,
        currentSort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }).isRequired,
        className: PropTypes.string,
        noSort: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        currentSort: {
            field: '',
            asc: true,
        },
        className: '',
        noSort: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.field);
    }
    render() {
        const {currentSort, field, noSort, className, children} = this.props;
        const sortClass = {
            'no-sort': !!noSort,
            'sortable': !noSort,
            sorted: !noSort && currentSort.field === field,
            'sorted-asc': !noSort && currentSort.field === field && currentSort.asc,
            'sorted-desc': !noSort && currentSort.field === field && !currentSort.asc,
        }
        return noSort
            ? (<th className={classNames(className, sortClass)}>{children}</th>)
            : (
                <th className={classNames(className, sortClass)}
                    onClick={this.onClick}>
                    {children}
                </th>
            )
    }
}


/*
Additional SCSS styling:
.table {
    &.table-sortable {
        th {
            cursor: pointer;
            &.no-sort {
                cursor: not-allowed;
            }
        }
    }
}
 */
