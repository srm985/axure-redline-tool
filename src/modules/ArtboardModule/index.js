import React from 'react';
import PropTypes from 'prop-types';

import ElementInteractionModule from '../ElementInteractionModule';
import GridOverlayModule from '../GridOverlayModule';

import {
    calculateScrollAfterZoom,
    injectArtboard,
    scrollCenterArtboard,
    sizeArtboard
} from '../../interfacers/artboardInterfacer';

import calculateGlobalOffset from '../../utils/calculateGlobalOffset';

import './styles.scss';

class ArtboardModule extends React.PureComponent {
    constructor(props) {
        super(props);

        this.artboardRef = React.createRef();

        this.state = {
            artboardOffsetLeft: 0,
            artboardOffsetTop: 0,
            artboardScaledHeight: 0,
            artboardScaledWidth: 0
        };
    }

    componentDidMount() {
        const {
            setArtboardDimensions,
            setAxureLoaded,
            zoomWrapperPadding
        } = this.props;

        injectArtboard(`${ArtboardModule.displayName}__artboard`).then(() => {
            sizeArtboard().then((dimensions) => {
                const {
                    artboardHeight,
                    artboardWidth
                } = dimensions;

                setArtboardDimensions({
                    artboardHeight,
                    artboardWidth
                });

                scrollCenterArtboard({
                    artboardHeight,
                    artboardWidth,
                    zoomWrapperPadding
                });

                setAxureLoaded();
                this.updateArtboardMeasurements();
            });
        });
    }

    componentDidUpdate(prevProps) {
        const {
            documentZoom: previousZoom
        } = prevProps;

        const {
            artboardHeight,
            artboardWidth,
            documentZoom
        } = this.props;

        this.updateArtboardMeasurements();

        // Check if a zoom operation took place.
        if (documentZoom !== previousZoom) {
            calculateScrollAfterZoom({
                artboardHeight,
                artboardWidth,
                documentZoom,
                previousZoom
            });
        }
    }

    updateArtboardMeasurements = () => {
        const {
            current: artboardElement
        } = this.artboardRef;

        const {
            scaledHeight: artboardScaledHeight,
            scaledOffsetLeft: artboardOffsetLeft,
            scaledOffsetTop: artboardOffsetTop,
            scaledWidth: artboardScaledWidth
        } = calculateGlobalOffset(artboardElement);

        const {
            artboardOffsetLeft: currentArtboardOffsetLeft,
            artboardOffsetTop: currentArtboardOffsetTop,
            artboardScaledHeight: currentArtboardScaledHeight,
            artboardScaledWidth: currentArtboardScaledWidth
        } = this.state;

        // Check if we should update state.
        if (
            currentArtboardOffsetLeft !== artboardOffsetLeft
            || currentArtboardOffsetTop !== artboardOffsetTop
            || currentArtboardScaledHeight !== artboardScaledHeight
            || currentArtboardScaledWidth !== artboardScaledWidth
        ) {
            this.setState({
                artboardOffsetLeft,
                artboardOffsetTop,
                artboardScaledHeight,
                artboardScaledWidth
            });
        }
    }

    render() {
        const {
            artboardHeight,
            artboardWidth,
            artboardWrapperHeight,
            artboardWrapperWidth,
            documentZoom,
            elementMarkerThickness,
            gridLayout,
            handleClickCallback,
            hoveredElement,
            isArtboardWrapperShown,
            isToolEnabled,
            selectedElement,
            zoomWrapperPadding
        } = this.props;

        const {
            artboardOffsetLeft,
            artboardOffsetTop,
            artboardScaledHeight,
            artboardScaledWidth
        } = this.state;

        let artboardWrapperStyle = {};
        let artboardShownClass = '';

        if (isArtboardWrapperShown) {
            artboardWrapperStyle = {
                height: artboardWrapperHeight,
                width: artboardWrapperWidth
            };
        } else {
            artboardShownClass = `${ArtboardModule.displayName}--shown`;
        }

        const artboardStyle = {
            height: artboardHeight,
            transform: `scale(${documentZoom / 100})`,
            width: artboardWidth
        };

        const toolEnabledClass = isToolEnabled ? `${ArtboardModule.displayName}--enabled` : '';

        return (
            <div
                className={`${ArtboardModule.displayName} ${toolEnabledClass} ${artboardShownClass}`}
                onClick={handleClickCallback}
                style={artboardWrapperStyle}
            >
                <div
                    className={`${ArtboardModule.displayName}__artboard`}
                    ref={this.artboardRef}
                    style={artboardStyle}
                >
                    <GridOverlayModule
                        artboardWidth={artboardWidth}
                        gridLayout={gridLayout}
                    />
                </div>
                <ElementInteractionModule
                    artboardOffsetLeft={artboardOffsetLeft}
                    artboardOffsetTop={artboardOffsetTop}
                    artboardScaledHeight={artboardScaledHeight}
                    artboardScaledWidth={artboardScaledWidth}
                    elementMarkerThickness={elementMarkerThickness}
                    hoveredElement={hoveredElement}
                    selectedElement={selectedElement}
                    zoomWrapperPadding={zoomWrapperPadding}
                />
            </div>
        );
    }
}

ArtboardModule.displayName = 'ArtboardModule';

ArtboardModule.propTypes = {
    artboardHeight: PropTypes.number.isRequired,
    artboardWidth: PropTypes.number.isRequired,
    artboardWrapperHeight: PropTypes.number.isRequired,
    artboardWrapperWidth: PropTypes.number.isRequired,
    documentZoom: PropTypes.number.isRequired,
    elementMarkerThickness: PropTypes.number.isRequired,
    gridLayout: PropTypes.string.isRequired,
    handleClickCallback: PropTypes.func.isRequired,
    hoveredElement: PropTypes.shape({}).isRequired,
    isArtboardWrapperShown: PropTypes.bool.isRequired,
    isToolEnabled: PropTypes.bool.isRequired,
    selectedElement: PropTypes.shape({}).isRequired,
    setArtboardDimensions: PropTypes.func.isRequired,
    setAxureLoaded: PropTypes.func.isRequired,
    zoomWrapperPadding: PropTypes.number.isRequired
};

export default ArtboardModule;
