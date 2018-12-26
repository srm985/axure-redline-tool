import PropTypes from 'prop-types';
import React from 'react';

import DimensionLineComponent from '../../components/DimensionLineComponent';
import { LINE_TYPE_INTER_ELEMENT } from '../../components/DimensionLineComponent/constants';
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
                target: hoveredElementTarget,
                trueHeight: hoveredElementTrueHeight,
                trueOffsetLeft: hoveredElementTrueOffsetLeft,
                trueOffsetTop: hoveredElementTrueOffsetTop,
                trueWidth: hoveredElementTrueWidth,
                width: hoveredElementWidth
            },
            selectedElement: {
                height: selectedElementHeight,
                offsetLeft: selectedElementOffsetLeft,
                offsetTop: selectedElementOffsetTop,
                target: selectedElementTarget,
                trueHeight: selectedElementTrueHeight,
                trueOffsetLeft: selectedElementTrueOffsetLeft,
                trueOffsetTop: selectedElementTrueOffsetTop,
                trueWidth: selectedElementTrueWidth,
                width: selectedElementWidth
            }
        } = this.props;

        // Scaled element measurements.
        const diffSelectedLeftHoveredRight = selectedElementOffsetLeft - (hoveredElementOffsetLeft + hoveredElementWidth);
        const diffSelectedLeftHoveredLeft = selectedElementOffsetLeft - hoveredElementOffsetLeft;

        const diffSelectedRightHoveredRight = (hoveredElementOffsetLeft + hoveredElementWidth) - (selectedElementOffsetLeft + selectedElementWidth);
        const diffSelectedRightHoveredLeft = hoveredElementOffsetLeft - (selectedElementOffsetLeft + selectedElementWidth);

        const diffSelectedTopHoveredBottom = selectedElementOffsetTop - (hoveredElementOffsetTop + hoveredElementHeight);
        const diffSelectedTopHoveredTop = selectedElementOffsetTop - hoveredElementOffsetTop;

        const diffSelectedBottomHoveredBottom = (hoveredElementOffsetTop + hoveredElementHeight) - (selectedElementOffsetTop + selectedElementHeight);
        const diffSelectedBottomHoveredTop = hoveredElementOffsetTop - (selectedElementOffsetTop + selectedElementHeight);

        // True element measurements.
        const trueDiffSelectedLeftHoveredRight = selectedElementTrueOffsetLeft - (hoveredElementTrueOffsetLeft + hoveredElementTrueWidth);
        const trueDiffSelectedLeftHoveredLeft = selectedElementTrueOffsetLeft - hoveredElementTrueOffsetLeft;

        const trueDiffSelectedRightHoveredRight = (hoveredElementTrueOffsetLeft + hoveredElementTrueWidth) - (selectedElementTrueOffsetLeft + selectedElementTrueWidth);
        const trueDiffSelectedRightHoveredLeft = hoveredElementTrueOffsetLeft - (selectedElementTrueOffsetLeft + selectedElementTrueWidth);

        const trueDiffSelectedTopHoveredBottom = selectedElementTrueOffsetTop - (hoveredElementTrueOffsetTop + hoveredElementTrueHeight);
        const trueDiffSelectedTopHoveredTop = selectedElementTrueOffsetTop - hoveredElementTrueOffsetTop;

        const trueDiffSelectedBottomHoveredBottom = (hoveredElementTrueOffsetTop + hoveredElementTrueHeight) - (selectedElementTrueOffsetTop + selectedElementTrueHeight);
        const trueDiffSelectedBottomHoveredTop = hoveredElementTrueOffsetTop - (selectedElementTrueOffsetTop + selectedElementTrueHeight);

        let bottomLineLength = 0;
        let bottomLineOffsetTop = 0;
        let leftLineLength = 0;
        let leftLineOffsetLeft = 0;
        let rightLineLength = 0;
        let rightLineOffsetLeft = 0;
        let topLineLength = 0;
        let topLineOffsetTop = 0;
        let trueInterElementBottomLineWidth = 0;
        let trueInterElementLeftLineWidth = 0;
        let trueInterElementRightLineWidth = 0;
        let trueInterElementTopLineWidth = 0;

        // Left inter-element dimension line calculations.
        if (diffSelectedLeftHoveredRight > 0) {
            // Scaled measurement calculations.
            leftLineLength = diffSelectedLeftHoveredRight;
            leftLineOffsetLeft = hoveredElementOffsetLeft + hoveredElementWidth;

            // True inter-element dimensions.
            trueInterElementLeftLineWidth = trueDiffSelectedLeftHoveredRight;
        } else if (diffSelectedLeftHoveredLeft > 0) {
            // Scaled measurement calculations.
            leftLineLength = diffSelectedLeftHoveredLeft;
            leftLineOffsetLeft = hoveredElementOffsetLeft;

            // True inter-element dimensions.
            trueInterElementLeftLineWidth = trueDiffSelectedLeftHoveredLeft;
        } else if (diffSelectedLeftHoveredRight < 0
            && diffSelectedLeftHoveredLeft < 0
            && diffSelectedRightHoveredLeft < 0
            && diffSelectedRightHoveredRight < 0) {
            // Scaled measurement calculations.
            leftLineLength = Math.abs(diffSelectedLeftHoveredLeft);
            leftLineOffsetLeft = selectedElementOffsetLeft;

            // True inter-element dimensions.
            trueInterElementLeftLineWidth = Math.abs(trueDiffSelectedLeftHoveredLeft);
        }

        // Right inter-element dimension line calculations.
        if (diffSelectedRightHoveredLeft > 0) {
            // Scaled measurement calculations.
            rightLineLength = diffSelectedRightHoveredLeft;
            rightLineOffsetLeft = selectedElementOffsetLeft + selectedElementWidth;

            // True inter-element dimensions.
            trueInterElementRightLineWidth = trueDiffSelectedRightHoveredLeft;
        } else if (diffSelectedRightHoveredRight > 0) {
            // Scaled measurement calculations.
            rightLineLength = diffSelectedRightHoveredRight;
            rightLineOffsetLeft = selectedElementOffsetLeft + selectedElementWidth;

            // True inter-element dimensions.
            trueInterElementRightLineWidth = trueDiffSelectedRightHoveredRight;
        } else if (diffSelectedLeftHoveredRight < 0
            && diffSelectedLeftHoveredLeft < 0
            && diffSelectedRightHoveredLeft < 0
            && diffSelectedRightHoveredRight < 0) {
            // Scaled measurement calculations.
            rightLineLength = Math.abs(diffSelectedRightHoveredRight);
            rightLineOffsetLeft = hoveredElementOffsetLeft + hoveredElementWidth;

            // True inter-element dimensions.
            trueInterElementRightLineWidth = Math.abs(trueDiffSelectedRightHoveredRight);
        }

        // Top inter-element dimension line calculations.
        if (diffSelectedTopHoveredBottom > 0) {
            // Scaled measurement calculations.
            topLineLength = diffSelectedTopHoveredBottom;
            topLineOffsetTop = hoveredElementOffsetTop + hoveredElementHeight;

            // True inter-element dimensions.
            trueInterElementTopLineWidth = trueDiffSelectedTopHoveredBottom;
        } else if (diffSelectedTopHoveredTop > 0) {
            // Scaled measurement calculations.
            topLineLength = diffSelectedTopHoveredTop;
            topLineOffsetTop = hoveredElementOffsetTop;

            // True inter-element dimensions.
            trueInterElementTopLineWidth = trueDiffSelectedTopHoveredTop;
        } else if (diffSelectedTopHoveredBottom < 0
            && diffSelectedTopHoveredTop < 0
            && diffSelectedBottomHoveredBottom < 0
            && diffSelectedBottomHoveredTop < 0) {
            // Scaled measurement calculations.
            topLineLength = Math.abs(diffSelectedTopHoveredTop);
            topLineOffsetTop = selectedElementOffsetTop;

            // True inter-element dimensions.
            trueInterElementTopLineWidth = Math.abs(trueDiffSelectedTopHoveredTop);
        }

        // Bottom inter-element dimension line calculations.
        if (diffSelectedBottomHoveredTop > 0) {
            // Scaled measurement calculations.
            bottomLineLength = diffSelectedBottomHoveredTop;
            bottomLineOffsetTop = selectedElementOffsetTop + selectedElementHeight;

            // True inter-element dimensions.
            trueInterElementBottomLineWidth = trueDiffSelectedBottomHoveredTop;
        } else if (diffSelectedBottomHoveredBottom > 0) {
            // Scaled measurement calculations.
            bottomLineLength = diffSelectedBottomHoveredBottom;
            bottomLineOffsetTop = selectedElementOffsetTop + selectedElementHeight;

            // True inter-element dimensions.
            trueInterElementBottomLineWidth = trueDiffSelectedBottomHoveredBottom;
        } else if (diffSelectedTopHoveredBottom < 0
            && diffSelectedTopHoveredTop < 0
            && diffSelectedBottomHoveredBottom < 0
            && diffSelectedBottomHoveredTop < 0) {
            // Scaled measurement calculations.
            bottomLineLength = Math.abs(diffSelectedBottomHoveredBottom);
            bottomLineOffsetTop = hoveredElementOffsetTop + hoveredElementHeight;

            // True inter-element dimensions.
            trueInterElementBottomLineWidth = Math.abs(trueDiffSelectedBottomHoveredBottom);
        }

        const isHoveredSelectedElement = selectedElementTarget === hoveredElementTarget;

        return (
            <React.Fragment>
                {
                    isHoveredSelectedElement
                        ? (
                            <React.Fragment>
                                <DimensionMarkerComponent
                                    dimensionType={HORIZONTAL_DIMENSION}
                                    measurement={selectedElementTrueWidth}
                                    offsetLeft={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                    offsetTop={selectedElementOffsetTop}
                                />
                                <DimensionMarkerComponent
                                    dimensionType={VERTICAL_DIMENSION}
                                    measurement={selectedElementTrueHeight}
                                    offsetLeft={selectedElementOffsetLeft + selectedElementWidth}
                                    offsetTop={selectedElementOffsetTop + (selectedElementHeight / 2)}
                                />
                            </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                {
                                    leftLineLength
                                    && (
                                        <React.Fragment>
                                            <DimensionLineComponent
                                                elementMarkerThickness={elementMarkerThickness}
                                                height={0}
                                                left={leftLineOffsetLeft}
                                                lineType={LINE_TYPE_INTER_ELEMENT}
                                                top={selectedElementOffsetTop + (selectedElementHeight / 2)}
                                                width={leftLineLength}
                                            />
                                            <DimensionMarkerComponent
                                                dimensionType={HORIZONTAL_DIMENSION}
                                                measurement={trueInterElementLeftLineWidth}
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
                                                lineType={LINE_TYPE_INTER_ELEMENT}
                                                top={selectedElementOffsetTop + (selectedElementHeight / 2)}
                                                width={rightLineLength}
                                            />
                                            <DimensionMarkerComponent
                                                dimensionType={HORIZONTAL_DIMENSION}
                                                measurement={trueInterElementRightLineWidth}
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
                                                lineType={LINE_TYPE_INTER_ELEMENT}
                                                top={topLineOffsetTop}
                                                width={0}
                                            />
                                            <DimensionMarkerComponent
                                                dimensionType={VERTICAL_DIMENSION}
                                                measurement={trueInterElementTopLineWidth}
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
                                                lineType={LINE_TYPE_INTER_ELEMENT}
                                                top={bottomLineOffsetTop}
                                                width={0}
                                            />
                                            <DimensionMarkerComponent
                                                dimensionType={VERTICAL_DIMENSION}
                                                measurement={trueInterElementBottomLineWidth}
                                                offsetLeft={selectedElementOffsetLeft + (selectedElementWidth / 2)}
                                                offsetTop={bottomLineOffsetTop + (bottomLineLength / 2)}
                                            />
                                        </React.Fragment>
                                    )
                                }
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
