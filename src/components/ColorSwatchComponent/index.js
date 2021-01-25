import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

class ColorSwatchComponent extends React.PureComponent {
    render() {
        const {
            setSwatchValue,
            swatchColor
        } = this.props;

        const componentStyle = {
            backgroundColor: swatchColor
        };

        return (
            <div
                className={ColorSwatchComponent.displayName}
                onClick={setSwatchValue}
                onKeyUp={setSwatchValue}
                role={'button'}
                tabIndex={0}
            >
                <div
                    className={`${ColorSwatchComponent.displayName}__swatch`}
                    style={componentStyle}
                />
                <div className={`${ColorSwatchComponent.displayName}__checkerboard`} />
            </div>
        );
    }
}

ColorSwatchComponent.displayName = 'ColorSwatchComponent';

ColorSwatchComponent.propTypes = {
    setSwatchValue: PropTypes.func.isRequired,
    swatchColor: PropTypes.string.isRequired
};

export default ColorSwatchComponent;
