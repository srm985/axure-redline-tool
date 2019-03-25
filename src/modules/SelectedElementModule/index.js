import PropTypes from 'prop-types';
import React from 'react';

import DimensionLineComponent from '../../components/DimensionLineComponent';

import { LINE_TYPE_SOLID_SELECTED } from '../../components/DimensionLineComponent/constants';

class SelectedElementModule extends React.PureComponent {
    render() {
        const {
            elementMarkerThickness,
            selectedElement: {
                height,
                offsetLeft,
                offsetTop,
                width
            }
        } = this.props;

        return (
            <React.Fragment>
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={height}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_SELECTED}
                    top={offsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={height}
                    left={offsetLeft + width}
                    lineType={LINE_TYPE_SOLID_SELECTED}
                    top={offsetTop}
                    width={0}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_SELECTED}
                    top={offsetTop}
                    width={width + (2 * elementMarkerThickness)}
                />
                <DimensionLineComponent
                    elementMarkerThickness={elementMarkerThickness}
                    height={0}
                    left={offsetLeft - elementMarkerThickness}
                    lineType={LINE_TYPE_SOLID_SELECTED}
                    top={offsetTop + height}
                    width={width + (2 * elementMarkerThickness)}
                />
            </React.Fragment>
        );
    }
}

SelectedElementModule.propTypes = {
    elementMarkerThickness: PropTypes.number.isRequired,
    selectedElement: PropTypes.shape({
        height: PropTypes.number.isRequired,
        offsetLeft: PropTypes.number.isRequired,
        offsetTop: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
    }).isRequired
};

export default SelectedElementModule;
