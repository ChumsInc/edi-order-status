/**
 * Created by steve on 9/8/2016.
 */

import React from 'react';
import classNames from 'classnames';

interface Props {
    visible?: boolean,
    striped?: boolean,
    active?: boolean,
    className?: string | object,
    label?: string,
    style?: object,
    min?: number,
    max?: number,
    value?: number,
}

const ProgressBar: React.FC<Props> = ({
                                          visible= false,
                                          striped = false,
                                          active = false,
                                          className = {},
                                          label= '',
                                          style = {},
                                          min = 0,
                                          max = 100,
                                          value = 100
                                      }) => {
    if (!visible) {
        return null;
    }
    const progressClass = classNames('progress-bar', className, {
        'progress-bar-striped': striped,
        'active': active
    });

    const labelClass = classNames({
        'visually-hidden': label === undefined
    });

    const styles = {
        ...style
    };
    const width = max === 0 || min === max
        ? 100
        : (value - min / max - min) * 100;

    return (
        <div className="progress" style={styles}>
            <div className={progressClass} role="progressbar"
                 aria-valuenow={value} aria-valuemin={min || 0} aria-valuemax={max || 100}
                 style={{width: `${width}%`}}>
                <span className={labelClass}>{label || ''}</span>
            </div>
        </div>
    );
}

export default ProgressBar;
