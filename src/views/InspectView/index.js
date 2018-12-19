import React from 'react';

import ArtboardModule from '../../modules/ArtboardModule';
import HeaderModule from '../../modules/HeaderModule';
import ElementPropertiesSidebarModule from '../../modules/ElementPropertiesSidebarModule';

import {
    addGlobalClickListener,
    addGlobalMouseoverListener,
    addGlobalMouseToggleListener,
    addGlobalZoomListener,
    addHotkeyListener
} from '../../interfacers/eventsInterfacer';

import calculateGlobalOffset from '../../utils/calculateGlobalOffset';
import calculateTrueArtboardOffset from '../../utils/calculateTrueArtboardOffset';

import { NO_INTERACT_CLASS } from '../../globalConstants';

class InspectView extends React.Component {
    constructor(props) {
        super(props);

        this.clearToolStatus = this.clearToolStatus.bind(this);
        this.handleClickCallback = this.handleClickCallback.bind(this);
        this.handleHotkeyCallback = this.handleHotkeyCallback.bind(this);
        this.handleMouseToggleCallback = this.handleMouseToggleCallback.bind(this);
        this.handleMouseoverCallback = this.handleMouseoverCallback.bind(this);
        this.handleZoomingCallback = this.handleZoomingCallback.bind(this);
        this.setArtboardDimensions = this.setArtboardDimensions.bind(this);
        this.setArtboardZoom = this.setArtboardZoom.bind(this);
        this.setAxureLoaded = this.setAxureLoaded.bind(this);

        this.state = {
            artboardHeight: 0,
            artboardWidth: 0,
            artboardWrapperHeight: 0,
            artboardWrapperWidth: 0,
            axureLoaded: false,
            documentZoom: 100,
            elementMarkerThickness: 1,
            hoveredElement: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                target: null,
                trueHeight: 0,
                trueOffsetLeft: 0,
                trueOffsetTop: 0,
                trueWidth: 0,
                width: 0
            },
            isHotkeyDepressed: false,
            isToolEnabled: false,
            selectedElement: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                target: null,
                trueHeight: 0,
                trueOffsetLeft: 0,
                trueOffsetTop: 0,
                trueWidth: 0,
                width: 0
            },
            zoomWrapperPadding: 1000
            /* cssProperties: {
                'properties': {
                    'width': '',
                    'height': ''
                },
                'styles': {
                    'opacity': '',
                    'border': '',
                    'border-width': '',
                    'border-style': '',
                    'border-color': '',
                    'border-top': '',
                    'border-top-width': '',
                    'border-top-style': '',
                    'border-top-color': '',
                    'border-right': '',
                    'border-right-width': '',
                    'border-right-style': '',
                    'border-right-color': '',
                    'border-bottom': '',
                    'border-bottom-width': '',
                    'border-bottom-style': '',
                    'border-bottom-color': '',
                    'border-left': '',
                    'border-left-width': '',
                    'border-left-style': '',
                    'border-left-color': '',
                    'border-radius': '',
                    'border-top-left-radius': '',
                    'border-top-right-radius': '',
                    'border-bottom-right-radius': '',
                    'border-bottom-left-radius': '',
                    'outline': '',
                    'background-color': '',
                    'box-shadow': ''
                },
                'text': {
                    'font-family': '',
                    'font-size': '',
                    'font-weight': '',
                    'line-height': '',
                    'text-align': '',
                    'color': '',
                    '_content': ''
                }
            },
            dimensionMarkerHeight: 0,
            dimensionMarkerWidth: 0,
            documentCSSList: '',
            elementCSS: '',
            elementPosition: '',
            elemMeas: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                width: 0
            },
            elemSelectMeas: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                width: 0
            },
            hoveredMeasurements: '',
            interElemMeas: {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                trueBottom: 0,
                trueLeft: 0,
                trueRight: 0,
                trueTop: 0
            },
            labelSpacing: 5,
            previousZoom: 100,
            selectedMeasurements: '',
            */
        };
    }

    componentDidMount() {
        this.setState({
            isToolEnabled: true
        });
    }

    componentDidUpdate() {
        console.log('State:', this.state);
    }

    setAxureLoaded() {
        this.setState({
            axureLoaded: true
        }, () => {
            this.initializerListeners();
        });
    }

    /**
     * We use this function to control the artboard zoom level by passing
     * in our desired new zoom level.
     *
     * @param {number} zoomLevel
     */
    setArtboardZoom(zoomLevel) {
        this.setState({
            documentZoom: zoomLevel <= 1 ? 1 : zoomLevel
        }, () => {
            this.setArtboardDimensions();
        });
    }

    setArtboardDimensions(dimensions = {}) {
        const {
            zoomWrapperPadding,
            documentZoom,
            artboardHeight: artboardHeightFromState,
            artboardWidth: artboardWidthFromState
        } = this.state;

        const {
            artboardHeight = artboardHeightFromState,
            artboardWidth = artboardWidthFromState
        } = dimensions;

        this.setState({
            artboardHeight,
            artboardWidth,
            artboardWrapperHeight: artboardHeight * (documentZoom / 100) + zoomWrapperPadding * 2,
            artboardWrapperWidth: artboardWidth * (documentZoom / 100) + zoomWrapperPadding * 2
        });
    }

    toggleArtboardZoom() {
        const {
            documentZoom
        } = this.state;

        const restoreZoom = (originalDocumentZoom) => {
            this.setState({
                documentZoom: originalDocumentZoom
            });
        };

        return new Promise((resolve) => {
            this.setState({
                documentZoom: 100
            }, () => {
                resolve(restoreZoom(documentZoom));
            });
        });
    }

    initializerListeners() {
        addGlobalClickListener(this.handleClickCallback);
        addGlobalMouseToggleListener(this.handleMouseToggleCallback);
        addGlobalMouseoverListener(this.handleMouseoverCallback);
        addGlobalZoomListener(this.handleZoomingCallback);
        addHotkeyListener(this.handleHotkeyCallback);
    }

    /**
     * We use this function to essentially close the tool. For example,
     * if we have a selected element and the redline specs panel is
     * open, we'll deselect the element and close the panel.
     */
    clearToolStatus() {
        this.setState({
            hoveredElement: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                target: null,
                trueHeight: 0,
                trueOffsetLeft: 0,
                trueOffsetTop: 0,
                trueWidth: 0,
                width: 0
            },
            selectedElement: {
                height: 0,
                offsetLeft: 0,
                offsetTop: 0,
                target: null,
                trueHeight: 0,
                trueOffsetLeft: 0,
                trueOffsetTop: 0,
                trueWidth: 0,
                width: 0
            }
        });
    }

    handleMouseoverCallback(event) {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        const {
            target
        } = event;

        const isInteractableElement = () => !target.classList.contains(NO_INTERACT_CLASS);

        if (isToolEnabled && !isHotkeyDepressed && isInteractableElement()) {
            event.stopPropagation();

            const {
                scaledHeight: height,
                scaledOffsetLeft: offsetLeft,
                scaledOffsetTop: offsetTop,
                scaledWidth: width
            } = calculateGlobalOffset(target);

            const {
                trueHeight,
                trueOffsetLeft,
                trueOffsetTop,
                trueWidth
            } = calculateTrueArtboardOffset(target);

            this.setState({
                hoveredElement: {
                    height,
                    offsetLeft,
                    offsetTop,
                    target,
                    trueHeight,
                    trueOffsetLeft,
                    trueOffsetTop,
                    trueWidth,
                    width
                }
            });
        }
    }

    handleClickCallback(event) {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        console.log('click event:', event.target);
        if (isToolEnabled && !isHotkeyDepressed) {
            event.stopPropagation();
            event.preventDefault();

            const {
                target
            } = event;

            const {
                scaledHeight: height,
                scaledOffsetLeft: offsetLeft,
                scaledOffsetTop: offsetTop,
                scaledWidth: width
            } = calculateGlobalOffset(target);

            const {
                trueHeight,
                trueOffsetLeft,
                trueOffsetTop,
                trueWidth
            } = calculateTrueArtboardOffset(target);

            this.setState({
                selectedElement: {
                    height,
                    offsetLeft,
                    offsetTop,
                    target,
                    trueHeight,
                    trueOffsetLeft,
                    trueOffsetTop,
                    trueWidth,
                    width
                }
            });
        } else if (isHotkeyDepressed && event.target.nodeName.toLowerCase() === 'select') {
            /**
             * There is a bug in chrome where key presses are lost
             * when clicking on a select. To prevent the isHotkeyDepressed
             * flag from sticking, we just trigger a reset. I think it's
             * better than sticking.
             */
            this.setState({
                isHotkeyDepressed: false
            });
            /* setTimeout(() => {
                isHotkeyDepressed = false;
            }, 0); */
        }
    }

    handleMouseToggleCallback(event) {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        if (isToolEnabled && !isHotkeyDepressed) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    handleHotkeyCallback(isHotkeyDepressed) {
        const {
            isHotkeyDepressed: isHotkeyDepressedPrevious
        } = this.state;

        if (isHotkeyDepressed !== isHotkeyDepressedPrevious) {
            this.setState({
                isHotkeyDepressed
            }, () => {
                this.clearToolStatus();
            });
        }
    }

    handleZoomingCallback(event) {
        const {
            documentZoom
        } = this.state;

        const ESCAPE = 27;
        const PLUS = 187;
        const MINUS = 189;

        const ZOOM_STEP = 10;

        const roundZoom = (zoom) => Math.round(zoom / 10) * 10;

        switch (event.keyCode) {
            case ESCAPE:
                this.clearToolStatus();
                break;
            case PLUS:
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();

                    const newZoom = roundZoom(documentZoom + ZOOM_STEP);

                    this.setArtboardZoom(newZoom);
                }
                break;
            case MINUS:
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();

                    const newZoom = roundZoom(documentZoom - ZOOM_STEP);

                    this.setArtboardZoom(newZoom);
                }
                break;
            default:
                break;
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
            hoveredElement,
            isToolEnabled,
            selectedElement,
            zoomWrapperPadding
        } = this.state;

        return (
            <div
                className={InspectView.name}
                onScroll={this.clearToolStatus}
            >
                <HeaderModule />
                <ElementPropertiesSidebarModule
                    selectedElement={selectedElement}
                />
                <ArtboardModule
                    artboardHeight={artboardHeight}
                    artboardWidth={artboardWidth}
                    artboardWrapperHeight={artboardWrapperHeight}
                    artboardWrapperWidth={artboardWrapperWidth}
                    documentZoom={documentZoom}
                    elementMarkerThickness={elementMarkerThickness}
                    hoveredElement={hoveredElement}
                    isToolEnabled={isToolEnabled}
                    selectedElement={selectedElement}
                    setArtboardDimensions={this.setArtboardDimensions}
                    setAxureLoaded={this.setAxureLoaded}
                    zoomWrapperPadding={zoomWrapperPadding}
                />
            </div>
        );
    }
}

export default InspectView;
