import PropTypes from 'prop-types';
import React from 'react';

import DimensionLineComponent from '../../components/DimensionLineComponent';

import {
    LINE_TYPE_DASHED_HOVERED,
    LINE_TYPE_SOLID_HOVERED
} from '../../components/DimensionLineComponent/constants';

class HoveredElementModule extends React.PureComponent {
    render() {
        const {
            artboardOffsetLeft,
            artboardOffsetTop,
            artboardScaledHeight,
            artboardScaledWidth,
            elementMarkerThickness,
            hoveredElement: {
                height,
                offsetLeft,
                offsetTop,
                width
            }
        } = this.props;

        return (
            <>
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={height}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_HOVERED}
                    top={offsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={height}
                    left={offsetLeft + width}
                    lineType={LINE_TYPE_SOLID_HOVERED}
                    top={offsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_HOVERED}
                    top={offsetTop}
                    width={width + (2 * elementMarkerThickness)}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_HOVERED}
                    top={offsetTop + height}
                    width={width + (2 * elementMarkerThickness)}
                />

                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={artboardScaledHeight}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_DASHED_HOVERED}
                    top={artboardOffsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={artboardScaledHeight}
                    left={offsetLeft + width}
                    lineType={LINE_TYPE_DASHED_HOVERED}
                    top={artboardOffsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={artboardOffsetLeft}
                    lineType={LINE_TYPE_DASHED_HOVERED}
                    top={offsetTop}
                    width={artboardScaledWidth}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={artboardOffsetLeft}
                    lineType={LINE_TYPE_DASHED_HOVERED}
                    top={offsetTop + height}
                    width={artboardScaledWidth}
                />
            </>
        );
    }
}

HoveredElementModule.propTypes = {
    artboardOffsetLeft: PropTypes.number.isRequired,
    artboardOffsetTop: PropTypes.number.isRequired,
    artboardScaledHeight: PropTypes.number.isRequired,
    artboardScaledWidth: PropTypes.number.isRequired,
    elementMarkerThickness: PropTypes.number.isRequired,
    hoveredElement: PropTypes.shape({
        height: PropTypes.number.isRequired,
        offsetLeft: PropTypes.number.isRequired,
        offsetTop: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    }).isRequired
};

export default HoveredElementModule;
