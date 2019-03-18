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

SelectComponent.propTypes = {
    changeCallback: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string
        })
    ).isRequired
};

SelectComponent.defaultProps = {
    isDisabled: false,
    label: ''
};

export default SelectComponent;
