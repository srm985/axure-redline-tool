import PropTypes from 'prop-types';
import React from 'react';

import PrimaryControlsModule from '../PrimaryControlsModule';
import ModalComponent from '../../components/ModalComponent';

import { codeInspect } from '../../icons';

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
                <PrimaryControlsModule
                    controlList={[
                        {
                            callback: toggleToolEnable,
                            isEnabled: isToolEnabled,
                            path: codeInspect
                        },
                        {
                            path: codeInspect
                        }
                    ]}
                />
                <ModalComponent />
            </div>
        );
    }
}

HeaderModule.propTypes = {
    isToolEnabled: PropTypes.bool.isRequired,
    toggleToolEnable: PropTypes.func.isRequired
};

export default HeaderModule;
