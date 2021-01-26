import PropTypes from 'prop-types';
import React from 'react';

import HoveredElementModule from '../HoveredElementModule';
import InterElementDimensionsModule from '../InterElementDimensionsModule';
import SelectedElementModule from '../SelectedElementModule';

class ElementInteractionModule extends React.PureComponent {
    render() {
        const {
            artboardOffsetLeft,
            artboardOffsetTop,
            artboardScaledHeight,
            artboardScaledWidth,
            elementMarkerThickness,
            hoveredElement,
            selectedElement
        } = this.props;

        const {
            target: hoveredElementTarget
        } = hoveredElement;

        const {
            target: selectedElementTarget
        } = selectedElement;

        return (
            <>
                {
                    hoveredElementTarget
                    && (
                        <HoveredElementModule
                            artboardOffsetLeft={artboardOffsetLeft}
                            artboardOffsetTop={artboardOffsetTop}
                            artboardScaledHeight={artboardScaledHeight}
                            artboardScaledWidth={artboardScaledWidth}
                            elementMarkerThickness={elementMarkerThickness}
                            hoveredElement={hoveredElement}
                        />
                    )
                }
                {
                    selectedElementTarget
                    && (
                        <SelectedElementModule
                            elementMarkerThickness={elementMarkerThickness}
                            selectedElement={selectedElement}
                        />
                    )
                }
                {
                    hoveredElementTarget
                    && selectedElementTarget
                    && (
                        <InterElementDimensionsModule
                            elementMarkerThickness={elementMarkerThickness}
                            hoveredElement={hoveredElement}
                            selectedElement={selectedElement}
                        />
                    )
                }
            </>
        );
    }
}

ElementInteractionModule.propTypes = {
    artboardOffsetLeft: PropTypes.number.isRequired,
    artboardOffsetTop: PropTypes.number.isRequired,
    artboardScaledHeight: PropTypes.number.isRequired,
    artboardScaledWidth: PropTypes.number.isRequired,
    elementMarkerThickness: PropTypes.number.isRequired,
    hoveredElement: PropTypes.shape({
        target: PropTypes.shape({})
    }).isRequired,
    selectedElement: PropTypes.shape({
        target: PropTypes.shape({})
    }).isRequired
};

export default ElementInteractionModule;
