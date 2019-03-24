import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const displayName = 'SelectComponent';

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
                className={`${displayName}__select--option`}
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

    const isDisabledClass = isDisabled && `${displayName}--disabled`;

    return (
        <div className={`${displayName} ${isDisabledClass}`}>
            <label className={`${displayName}__label`}>
                {label}
                <select
                    className={`${displayName}__select`}
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
