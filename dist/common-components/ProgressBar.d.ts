/**
 * Created by steve on 9/8/2016.
 */
import React from 'react';
interface Props {
    visible?: boolean;
    striped?: boolean;
    active?: boolean;
    className?: string | object;
    label?: string;
    style?: object;
    min?: number;
    max?: number;
    value?: number;
}
declare const ProgressBar: React.FC<Props>;
export default ProgressBar;
