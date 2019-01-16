import React from 'react';

import './styles.scss';

export const TooltipComponent = (props) => {
    const {
        isVisible
    } = props;

    const COMPONENT_NAME = 'TooltipComponent';

    const tooltipVisibleClass = isVisible ? `${COMPONENT_NAME}--active` : '';

    return (
        <span className={`${COMPONENT_NAME} ${tooltipVisibleClass}`}>copied</span>
    );
};

export default TooltipComponent;
