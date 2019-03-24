import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../../components/IconComponent';

import './styles.scss';

class PrimaryControlsModule extends React.PureComponent {
    static displayName = 'PrimaryControlsModule';

    render = () => {
        const {
            controlList = []
        } = this.props;

        const controls = controlList.map((control) => {
            const {
                callback,
                iconPath,
                isEnabled
            } = control;

            const enabledClass = isEnabled ? `${PrimaryControlsModule.displayName}__control--enabled` : '';

            return (
                <div
                    className={`${PrimaryControlsModule.displayName}__control ${enabledClass}`}
                    onClick={callback}
                >
                    <Icon
                        height={25}
                        path={iconPath}
                        width={25}
                    />
                </div>
            );
        });

        return (
            <div className={PrimaryControlsModule.displayName}>
                {controls}
            </div>
        );
    }
}

PrimaryControlsModule.propTypes = {
    controlList: PropTypes.arrayOf(PropTypes.shape({
        callback: PropTypes.func,
        iconPath: PropTypes.string.isRequired,
        isEnabled: PropTypes.bool
    }))
};

PrimaryControlsModule.defaultProps = {
    controlList: [{
        callback: () => { },
        isEnabled: false
    }]
};

export default PrimaryControlsModule;
