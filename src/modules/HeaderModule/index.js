import PropTypes from 'prop-types';
import React from 'react';

import PrimaryControlsModule from '../PrimaryControlsModule';
import SharingLinksModule from '../SharingLinksModule';

import {
    codeInspect,
    share
} from '../../icons';

import './styles.scss';

class HeaderModule extends React.PureComponent {
    static displayName = 'HeaderModule';

    constructor(props) {
        super(props);

        this.state = {
            isSharingLinksShown: false
        };
    }

    toggleSharingLinks = () => {
        this.setState((prevState) => {
            const {
                isSharingLinksShown: wasSharingLinksShown
            } = prevState;

            return ({
                isSharingLinksShown: !wasSharingLinksShown
            });
        });
    }

    render() {
        const {
            isToolEnabled,
            toggleToolEnable
        } = this.props;

        const {
            isSharingLinksShown
        } = this.state;

        return (
            <div className={HeaderModule.displayName}>
                <span className={`${HeaderModule.displayName}__logo`}>RedlineTool</span>
                <PrimaryControlsModule
                    controlList={[
                        {
                            callback: toggleToolEnable,
                            iconPath: codeInspect,
                            isEnabled: isToolEnabled
                        },
                        {
                            callback: this.toggleSharingLinks,
                            iconPath: share,
                            isEnabled: isSharingLinksShown
                        }
                    ]}
                />
                <SharingLinksModule
                    isShown={isSharingLinksShown}
                    moduleCloseCallback={this.toggleSharingLinks}
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
