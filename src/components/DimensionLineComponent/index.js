import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

class DimensionLineComponent extends React.PureComponent {
    render() {
        const {
            elementMarkerThickness = 0,
            height = 0,
            left = 0,
            lineType = '',
            top = 0,
            width = 0
        } = this.props;

        const componentStyle = {
            borderLeftWidth: !width ? elementMarkerThickness : 0,
            borderTopWidth: !height ? elementMarkerThickness : 0,
            height,
            left,
            top,
            width
        };

        const lineTypeClass = lineType ? `${DimensionLineComponent.displayName}--${lineType}` : '';

        return (
            <div
                className={`${DimensionLineComponent.displayName} ${lineTypeClass}`}
                style={componentStyle}
            />
        );
    }
}

DimensionLineComponent.displayName = 'DimensionLineComponent';

DimensionLineComponent.propTypes = {
    elementMarkerThickness: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    lineType: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
};

export default DimensionLineComponent;
