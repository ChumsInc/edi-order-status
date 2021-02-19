import React from 'react';

const CheckBoxToggle = ({checked, onChange}) => (
    <div className="form-check form-check-inline">
        <input type="checkbox" className="form-check-input" onChange={() => onChange()} checked={checked}/>
    </div>
);

export default CheckBoxToggle;
