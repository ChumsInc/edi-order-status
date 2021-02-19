import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import {getClassName} from './utils';


export default class SortableTableFooter extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        useCheckBoxSelect: PropTypes.bool,
        footerData: PropTypes.object,
        page: PropTypes.number,
        pages: PropTypes.number,
    };

    static defaultProps = {
        fields: [],
        footerData: {},
        useCheckBoxSelect: false,
    };

    render() {
        const {page, pages, fields, footerData, useCheckBoxSelect} = this.props;
        return (
            <tfoot>
            {page < pages && <tr>
                <td colSpan={fields.length} className="align-content-center">...</td>
            </tr>}
            <tr>
                {useCheckBoxSelect && <td>&nbsp;</td>}
                {fields.map(({field, render, className = ''}, index) => (
                    <td key={index} className={classNames(getClassName(className, footerData[field]))}>
                        <strong>
                            {footerData[field] !== undefined ? (!!render ? render(footerData) : footerData[field]) : ' '}
                        </strong>
                    </td>
                ))}
            </tr>
            </tfoot>
        );
    }
}
