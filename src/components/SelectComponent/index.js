import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const className = 'SelectComponent';

const SelectComponent = (props) => {
    const {
        changeCallback,
        isDisabled,
        label,
        options
    } = props;

    const selectOptions = options.map((option) => {
        const {
            name,
            value
        } = option;

        return (
            <option
                className={`${className}__select--option`}
                key={value}
                value={value}
            >
                {name}
            </option>
        );
    });

    const handleChange = (event) => {
        changeCallback(event);
    };

    const isDisabledClass = isDisabled && `${className}--disabled`;

    return (
        <div className={`${className} ${isDisabledClass}`}>
            <label className={`${className}__label`}>
                {label}
                <select
                    className={`${className}__select`}
                    disabled={isDisabled}
                    onChange={handleChange}
                >
                    {selectOptions}
                </select>
            </label>
        </div>
    );
};

export default SelectComponent;
