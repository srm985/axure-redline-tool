import PropTypes from 'prop-types';
import React from 'react';

import DimensionLineComponent from '../../components/DimensionLineComponent';
import {
    DimensionMarkerComponent,
    HORIZONTAL_DIMENSION,
    VERTICAL_DIMENSION
} from '../../components/DimensionMarkerComponent';

class InterElementDimensionsModule extends React.PureComponent {
    render() {
        const {
            elementMarkerThickness,
            hoveredElement: {
                height: hoveredElementHeight,
                offsetLeft: hoveredElementOffsetLeft,
                offsetTop: hoveredElementOffsetTop,
                width: hoveredElementWidth
            },
            selectedElement: {
                height: selectedElementHeight,
                offsetLeft: selectedElementOffsetLeft,
                offsetTop: selectedElementOffsetTop,
                width: selectedElementWidth
            }
        } = this.props;

        const LINE_TYPE_SOLID = 'selected-solid';

        const diffSelectedLeftHoveredRight = selectedElementOffsetLeft - (hoveredElementOffsetLeft + hoveredElementWidth);
        const diffSelectedLeftHoveredLeft = selectedElementOffsetLeft - hoveredElementOffsetLeft;

        const diffSelectedRightHoveredRight = (hoveredElementOffsetLeft + hoveredElementWidth) - (selectedElementOffsetLeft + selectedElementWidth);
        const diffSelectedRightHoveredLeft = hoveredElementOffsetLeft - (selectedElementOffsetLeft + selectedElementWidth);

        const diffSelectedTopHoveredBottom = selectedElementOffsetTop - (hoveredElementOffsetTop + hoveredElementHeight);
        const diffSelectedTopHoveredTop = selectedElementOffsetTop - hoveredElementOffsetTop;

        const diffSelectedBottomHoveredBottom = (hoveredElementOffsetTop + hoveredElementHeight) - (selectedElementOffsetTop + selectedElementHeight);
        const diffSelectedBottomHoveredTop = hoveredElementOffsetTop - (selectedElementOffsetTop + selectedElementHeight);

        let leftLineLength = 0;
        let leftLineOffsetLeft = 0;
        let rightLineLength = 0;
        let rightLineOffsetLeft = 0;
        let topLineLength = 0;
        let topLineOffsetTop = 0;
        let bottomLineLength = 0;
        let bottomLineOffsetTop = 0;

        // Left inter-element dimension line calculations.
        if (diffSelectedLeftHoveredRight > 0) {
            leftLineLength = diffSelectedLeftHoveredRight;
            leftLineOffsetLeft = hoveredElementOffsetLeft + hoveredElementWidth;
        } else if (diffSelectedLeftHoveredLeft > 0) {
            leftLineLength = diffSelectedLeftHoveredLeft;
            leftLineOffsetLeft = hoveredElementOffsetLeft;
        } else if (diffSelectedLeftHoveredRight < 0
            && diffSelectedLeftHoveredLeft < 0
            && diffSelectedRightHoveredLeft < 0
            && diffSelectedRightHoveredRight < 0) {
            leftLineLength = Math.abs(diffSelectedLeftHoveredLeft);
            leftLineOffsetLeft = selectedElementOffsetLeft;
        }

        // Right inter-element dimension line calculations.
        if (diffSelectedRightHoveredLeft > 0) {
            rightLineLength = diffSelectedRightHoveredLeft;
            rightLineOffsetLeft = selectedElementOffsetLeft + selectedElementWidth;
        } else if (diffSelectedRightHoveredRight > 0) {
            rightLineLength = diffSelectedRightHoveredRight;
            rightLineOffsetLeft = selectedElementOffsetLeft + selectedElementWidth;
        } else if (diffSelectedLeftHoveredRight < 0
            && diffSelectedLeftHoveredLeft < 0
            && diffSelectedRightHoveredLeft < 0
            && diffSelectedRightHoveredRight < 0) {
            rightLineLength = Math.abs(diffSelectedRightHoveredRight);
            rightLineOffsetLeft = hoveredElementOffsetLeft + hoveredElementWidth;
        }

        // Top inter-element dimension line calculations.
        if (diffSelectedTopHoveredBottom > 0) {
            topLineLength = diffSelectedTopHoveredBottom;
            topLineOffsetTop = hoveredElementOffsetTop + hoveredElementHeight;
        } else if (diffSelectedTopHoveredTop > 0) {
            topLineLength = diffSelectedTopHoveredTop;
            topLineOffsetTop = hoveredElementOffsetTop;
        } else if (diffSelectedTopHoveredBottom < 0
            && diffSelectedTopHoveredTop < 0
            && diffSelectedBottomHoveredBottom < 0
            && diffSelectedBottomHoveredTop < 0) {
            topLineLength = Math.abs(diffSelectedTopHoveredTop);
            topLineOffsetTop = selectedElementOffsetTop;
        }

        // Bottom inter-element dimension line calculations.
        if (diffSelectedBottomHoveredTop > 0) {
            bottomLineLength = diffSelectedBottomHoveredTop;
            bottomLineOffsetTop = selectedElementOffsetTop + selectedElementHeight;
        } else if (diffSelectedBottomHoveredBottom > 0) {
            bottomLineLength = diffSelectedBottomHoveredBottom;
            bottomLineOffsetTop = selectedElementOffsetTop + selectedElementHeight;
        } else if (diffSelectedTopHoveredBottom < 0
            && diffSelectedTopHoveredTop < 0
            && diffSelectedBottomHoveredBottom < 0
            && diffSelectedBottomHoveredTop < 0) {
            bottomLineLength = Math.abs(diffSelectedBottomHoveredBottom);
            bottomLineOffsetTop = hoveredElementOffsetTop + hoveredElementHeight;
        }

        return (
            <React.Fragment>
                {
                    leftLineLength
                    && (
                        <React.Fragment>
                            <DimensionLineComponent
                                elementMarkerThickness={elementMarkerThickness}
                                height={0}
                                left={leftLineOffsetLeft}
                                lineType={LINE_TYPE_SOLID}
                                top={selectedElementOffsetTop + (selectedElementHeight / 2)}
                                width={leftLineLength}
                            />
                            <DimensionMarkerComponent
                                dimensionType={HORIZONTAL_DIMENSION}
                                measurement={leftLineLength}
                                offsetLeft={leftLineOffsetLeft + (leftLineLength / 2)}
                                offsetTop={selectedElementOffsetTop + (selectedElementHeight / 2)}
                            />
                        </React.Fragment>
                    )
                }
                {
                    rightLineLength
                    && (
                        <React.Fragment>
                            <DimensionLineComponent
                                elementMarkerThickness={elementMarkerThickness}
                                height={0}
                                left={rightLineOffsetLeft}
                                lineType={LINE_TYPE_SOLID}
                                top={selectedElementOffsetTop + (selectedElementHeight / 2)}
                                width={rightLineLength}
                            />
                            <DimensionMarkerComponent
                                dimensionType={HORIZONTAL_DIMENSION}
                                measurement={rightLineLength}
                                offsetLeft={rightLineOffsetLeft + (rightLineLength / 2)}
                                offsetTop={selectedElementOffsetTop + (selectedElementHeight / 2)}
                            />
                        </React.Fragment>
                    )
                }
                {
                    topLineLength
                    && (
                        <React.Fragment>
                            <DimensionLineComponent
                                elementMarkerThickness={elementMarkerThickness}
                                height={topLineLength}
                                left={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                lineType={LINE_TYPE_SOLID}
                                top={topLineOffsetTop}
                                width={0}
                            />
                            <DimensionMarkerComponent
                                dimensionType={VERTICAL_DIMENSION}
                                measurement={topLineLength}
                                offsetLeft={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                offsetTop={topLineOffsetTop + (topLineLength / 2)}
                            />
                        </React.Fragment>
                    )
                }
                {
                    bottomLineLength
                    && (
                        <React.Fragment>
                            <DimensionLineComponent
                                elementMarkerThickness={elementMarkerThickness}
                                height={bottomLineLength}
                                left={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                lineType={LINE_TYPE_SOLID}
                                top={bottomLineOffsetTop}
                                width={0}
                            />
                            <DimensionMarkerComponent
                                dimensionType={VERTICAL_DIMENSION}
                                measurement={bottomLineLength}
                                offsetLeft={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                offsetTop={bottomLineOffsetTop + (bottomLineLength / 2)}
                            />
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}

InterElementDimensionsModule.propTypes = {
    elementMarkerThickness: PropTypes.number.isRequired,
    hoveredElement: PropTypes.shape({
        height: PropTypes.number.isRequired,
        offsetLeft: PropTypes.number.isRequired,
        offsetTop: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    }).isRequired,
    selectedElement: PropTypes.shape({
        height: PropTypes.number.isRequired,
        offsetLeft: PropTypes.number.isRequired,
        offsetTop: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    }).isRequired
};

export default InterElementDimensionsModule;
