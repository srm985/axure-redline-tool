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
                className={ColorSwatchComponent.name}
                onClick={setSwatchValue}
                onKeyUp={setSwatchValue}
                role={'button'}
                tabIndex={0}
            >
                <div
                    className={`${ColorSwatchComponent.name}__swatch`}
                    style={componentStyle}
                />
                <div className={`${ColorSwatchComponent.name}__checkerboard`} />
            </div>
        );
    }
}

ColorSwatchComponent.propTypes = {
    setSwatchValue: PropTypes.func.isRequired,
    swatchColor: PropTypes.string.isRequired
};

export default ColorSwatchComponent;
