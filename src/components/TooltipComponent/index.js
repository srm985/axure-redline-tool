import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const TooltipComponent = (props) => {
    const {
        isVisible
    } = props;

    const COMPONENT_NAME = 'TooltipComponent';

    const tooltipVisibleClass = isVisible ? `${COMPONENT_NAME}--active` : '';

    return (
        <span className={`${COMPONENT_NAME} ${tooltipVisibleClass}`}>copied</span>
    );
};

TooltipComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired
};

export default TooltipComponent;
