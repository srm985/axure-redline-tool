import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const displayName = 'CheckboxComponent';

const CheckboxComponent = (props) => {
    const {
        changeCallback,
        label
    } = props;

    const handleChange = (event) => {
        changeCallback(event);
    };

    return (
        <div className={displayName}>
            <label className={`${displayName}__label`}>
                <span>{label}</span>
                <input
                    className={`${displayName}__input`}
                    onChange={handleChange}
                    type={'checkbox'}
                />
            </label>
        </div>
    );
};

CheckboxComponent.propTypes = {
    changeCallback: PropTypes.func.isRequired,
    label: PropTypes.string
};

CheckboxComponent.defaultProps = {
    label: ''
};

export default CheckboxComponent;
