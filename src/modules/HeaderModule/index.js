import PropTypes from 'prop-types';
import React from 'react';

import EnableToolModule from '../EnableToolModule';

import './styles.scss';

class HeaderModule extends React.PureComponent {
    render() {
        const {
            isToolEnabled,
            toggleToolEnable
        } = this.props;

        return (
            <div className={HeaderModule.name}>
                <span className={`${HeaderModule.name}__logo`}>RedlineTool</span>
                <EnableToolModule
                    isToolEnabled={isToolEnabled}
                    toggleToolEnable={toggleToolEnable}
                />
            </div>
        );
    }
}

HeaderModule.propTypes = {
    isToolEnabled: PropTypes.bool.isRequired,
    toggleToolEnable: PropTypes.func.isRequired
};

export default HeaderModule;
