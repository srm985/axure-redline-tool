import PropTypes from 'prop-types';
import React from 'react';

import PrimaryControlsModule from '../PrimaryControlsModule';
import ModalComponent from '../../components/ModalComponent';

import {
    codeInspect,
    share
} from '../../icons';

import './styles.scss';

class HeaderModule extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isSharingModalShown: true
        };
    }

    toggleSharingModal = () => {
        this.setState((prevState) => {
            const {
                isSharingModalShown: wasSharingModalShown
            } = prevState;

            return ({
                isSharingModalShown: !wasSharingModalShown
            });
        });
    }

    render() {
        const {
            isToolEnabled,
            toggleToolEnable
        } = this.props;

        const {
            isSharingModalShown
        } = this.state;

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
                            callback: this.toggleSharingModal,
                            path: share
                        }
                    ]}
                />
                <ModalComponent
                    closeModal={this.toggleSharingModal}
                    isShown={isSharingModalShown}
                >
                    <p>test</p>
                </ModalComponent>
            </div>
        );
    }
}

HeaderModule.propTypes = {
    isToolEnabled: PropTypes.bool.isRequired,
    toggleToolEnable: PropTypes.func.isRequired
};

export default HeaderModule;
