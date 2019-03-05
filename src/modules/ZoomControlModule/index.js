import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const moduleClassName = 'ZoomControlModule';

const ZoomControlModule = props => {
    const {
        documentZoom
    } = props;

    return (
        <div className={moduleClassName}>
            <div className={`${moduleClassName}__zoom-control ${moduleClassName}__zoom-control--negative`}>
                <span />
            </div>
            <input
                className={`${moduleClassName}__zoom-input`}
                value={`${documentZoom}%`}
            />
            <div className={`${moduleClassName}__zoom-control ${moduleClassName}__zoom-control--positive`}>
                <span />
            </div>
        </div>
    );
};

export default ZoomControlModule;
