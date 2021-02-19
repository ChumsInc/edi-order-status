import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import ThSortable from "./ThSortable";
import CheckBoxToggle from "./CheckBoxToggle";
import {getClassName, noop} from './utils';

export default class SortableTableHeader extends Component {
    static propTypes = {
        useCheckBoxSelect: PropTypes.bool,
        areAllSelected: PropTypes.bool,
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            noSort: PropTypes.bool,
            className: PropTypes.string,
        })),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),

        onClickSort: PropTypes.func,
        onSelectAll: PropTypes.func,
    };

    static defaultProps = {
        useCheckBoxSelect: false,
        areAllSelected: false,
        fields: [],
        sort: {
            field: '',
            asc: true
        },
        onClickSort: noop,
        onSelectAll: noop,
    };

    render() {
        const {fields, sort, useCheckBoxSelect, areAllSelected, onSelectAll} = this.props;
        return (
            <thead>
            <tr>
                {useCheckBoxSelect && (
                    <th><CheckBoxToggle checked={areAllSelected} onChange={onSelectAll}/></th>
                )}
                {fields.map(({field, title = null, noSort = false, className = ''}) => (
                    <ThSortable key={field} currentSort={sort} onClick={this.props.onClickSort}
                                className={className}
                                field={field} noSort={noSort}>
                        {title || field}
                    </ThSortable>)
                )}
            </tr>
            </thead>
        );
    }
}
