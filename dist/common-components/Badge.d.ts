import React from 'react';
export interface Props {
    color: string;
    pill?: boolean;
    text?: string;
    className?: string | object;
    description?: string;
}
declare const Badge: React.FC<Props>;
export default Badge;
