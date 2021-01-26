import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../../components/IconComponent';

import './styles.scss';

class PrimaryControlsModule extends React.PureComponent {
    render = () => {
        const {
            controlList = []
        } = this.props;

        const controls = controlList.map((control) => {
            const {
                callback,
                icon,
                isEnabled,
                title
            } = control;

            const enabledClass = isEnabled ? `${PrimaryControlsModule.displayName}__control--enabled` : '';

            const key = Math.random();

            return (
                <div
                    className={`${PrimaryControlsModule.displayName}__control ${enabledClass}`}
                    key={key}
                    onClick={callback}
                    title={title}
                >
                    <Icon icon={icon} />
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

PrimaryControlsModule.displayName = 'PrimaryControlsModule';

PrimaryControlsModule.propTypes = {
    controlList: PropTypes.arrayOf(PropTypes.shape({
        callback: PropTypes.func,
        icon: PropTypes.string.isRequired,
        isEnabled: PropTypes.bool,
        title: PropTypes.string.isRequired
    }))
};

PrimaryControlsModule.defaultProps = {
    controlList: [{
        callback: () => { },
        isEnabled: false
    }]
};

export default PrimaryControlsModule;
