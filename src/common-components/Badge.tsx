import React from 'react';
import classNames from "classnames";

export interface Props {
    color: string,
    pill?: boolean,
    text?: string,
    className?: string | object,
    description?: string,
}

const Badge: React.FC<Props> = ({color, pill, text, className, description, children}) => {
    const styleClassName = `bg-${color}`;

    const badgeClassNames = classNames('badge', {'badge-pill': pill}, styleClassName, className);
    return (
        <span className={badgeClassNames}>
            {text || children || ''}
            {!!description && (<span className="visually-hidden">{description}</span>)}
        </span>
    )
};

export default Badge;
