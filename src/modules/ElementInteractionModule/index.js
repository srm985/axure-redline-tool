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
            artboardTrueHeight,
            artboardTrueWidth,
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
            <React.Fragment>
                {
                    hoveredElementTarget
                    && (
                        <HoveredElementModule
                            artboardOffsetLeft={artboardOffsetLeft}
                            artboardOffsetTop={artboardOffsetTop}
                            artboardTrueHeight={artboardTrueHeight}
                            artboardTrueWidth={artboardTrueWidth}
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
            </React.Fragment>
        );
    }
}

ElementInteractionModule.propTypes = {
    artboardOffsetLeft: PropTypes.number.isRequired,
    artboardOffsetTop: PropTypes.number.isRequired,
    artboardTrueHeight: PropTypes.number.isRequired,
    artboardTrueWidth: PropTypes.number.isRequired,
    elementMarkerThickness: PropTypes.number.isRequired,
    hoveredElement: PropTypes.instanceOf(Element).isRequired,
    selectedElement: PropTypes.instanceOf(Element).isRequired
};

export default ElementInteractionModule;
