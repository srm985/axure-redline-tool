import React from 'react';

import PropTypes from 'prop-types';

import './styles.scss';

class ColorSwatchComponent extends React.PureComponent {
    render() {
        const {
            swatchColor
        } = this.props;

        const componentStyle = {
            backgroundColor: swatchColor
        };

        return (
            <div className={ColorSwatchComponent.name} style={componentStyle} />
        );
    }
}

ColorSwatchComponent.propTypes = {
    swatchColor: PropTypes.string.isRequired
};

export default ColorSwatchComponent;
