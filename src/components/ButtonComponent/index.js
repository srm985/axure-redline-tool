import PropTypes from 'prop-types';
import React from 'react';

import buttonLevels from './buttonOptions';

import './styles.scss';

const displayName = 'ButtonComponent';

const {
    primary: primaryButton
} = buttonLevels;

const ButtonComponent = (props) => {
    const {
        label,
        level,
        onClickCallback,
        type = 'button'
    } = props;

    const {
        [level]: buttonLevelProp
    } = buttonLevels;

    const buttonLevelClass = `${displayName}--${buttonLevelProp || primaryButton}`;

    const handleClick = () => {
        if (typeof onClickCallback === 'function') {
            onClickCallback();
        }
    };

    return (
        <button
            className={`${displayName} ${buttonLevelClass}`}
            onClick={handleClick}
            type={type}
        >
            {label}
        </button>
    );
};

ButtonComponent.propTypes = {
    label: PropTypes.string,
    level: PropTypes.string,
    onClickCallback: PropTypes.func,
    type: PropTypes.string
};

ButtonComponent.defaultProps = {
    label: '',
    level: primaryButton,
    onClickCallback: () => { },
    type: 'button'
};

export default ButtonComponent;
