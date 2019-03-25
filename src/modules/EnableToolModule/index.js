import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const displayName = 'EnableToolModule';

const EnableToolModule = (props) => {
    const {
        isToolEnabled,
        toggleToolEnable
    } = props;

    return (
        <div className={displayName}>
            <span>Tool Enable:</span>
            <div>
                <input
                    id={displayName}
                    type={'checkbox'}
                    checked={isToolEnabled}
                    onChange={() => toggleToolEnable()}
                />
                <label htmlFor={displayName} />
            </div>
        </div>
    );
};

EnableToolModule.propTypes = {
    isToolEnabled: PropTypes.bool.isRequired,
    toggleToolEnable: PropTypes.func.isRequired
};

export default EnableToolModule;
