import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const EnableToolModule = (props) => {
    const {
        isToolEnabled,
        toggleToolEnable
    } = props;

    return (
        <div className={EnableToolModule.name}>
            <span>Tool Enable:</span>
            <div>
                <input
                    id={EnableToolModule.name}
                    type={'checkbox'}
                    checked={isToolEnabled}
                    onChange={() => toggleToolEnable()}
                />
                <label htmlFor={EnableToolModule.name} />
            </div>
        </div>
    );
};

EnableToolModule.propTypes = {
    isToolEnabled: PropTypes.bool.isRequired,
    toggleToolEnable: PropTypes.func.isRequired
};

export default EnableToolModule;
