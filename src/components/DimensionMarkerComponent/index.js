import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

export const VERTICAL_DIMENSION = 'VERTICAL';
export const HORIZONTAL_DIMENSION = 'HORIZONTAL';

export class DimensionMarkerComponent extends React.PureComponent {
    static displayName = 'DimensionMarkerComponent';

    static height = 20;
    static padding = 5;
    static width = 30;

    render() {
        const {
            dimensionType,
            measurement,
            offsetLeft,
            offsetTop
        } = this.props;

        let top = 0;
        let left = 0;

        if (dimensionType === HORIZONTAL_DIMENSION) {
            left = offsetLeft - (DimensionMarkerComponent.width / 2);
            top = offsetTop - DimensionMarkerComponent.height - DimensionMarkerComponent.padding;
        } else if (dimensionType === VERTICAL_DIMENSION) {
            left = offsetLeft + DimensionMarkerComponent.padding;
            top = offsetTop - (DimensionMarkerComponent.height / 2);
        }

        const componentStyle = {
            height: DimensionMarkerComponent.height,
            left,
            top,
            width: DimensionMarkerComponent.width
        };

        const cleanedMeasurement = Math.round(measurement);

        return (
            <div
                className={DimensionMarkerComponent.displayName}
                style={componentStyle}
            >
                <span>{cleanedMeasurement}</span>
            </div>
        );
    }
}

DimensionMarkerComponent.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    measurement: PropTypes.number.isRequired,
    offsetLeft: PropTypes.number.isRequired,
    offsetTop: PropTypes.number.isRequired
};
