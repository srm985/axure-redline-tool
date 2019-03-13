import React from 'react';

import './styles.scss';

const LoadingIndicatorComponent = () => (
    <div className={LoadingIndicatorComponent.className}>
        <div className={`${LoadingIndicatorComponent.className}__spinner`}>
            <div className={`${LoadingIndicatorComponent.className}__spinner--animation`} />
            <div className={`${LoadingIndicatorComponent.className}__spinner--animation`} />
        </div>
    </div>
);

LoadingIndicatorComponent.className = 'LoadingIndicatorComponent';

export default LoadingIndicatorComponent;
