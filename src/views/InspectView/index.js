import React from 'react';

import ArtboardModule from '../../modules/ArtboardModule';
import ElementPropertiesSidebarModule from '../../modules/ElementPropertiesSidebarModule';
import HeaderModule from '../../modules/HeaderModule';
import ZoomControlModule from '../../modules/ZoomControlModule';

import LoadingIndicatorComponent from '../../components/LoadingIndicatorComponent';

import {
    addDialogOpenListener,
    addGlobalClickListener,
    addGlobalMouseoverListener,
    addGlobalMouseToggleListener,
    addGlobalZoomListener,
    addHotkeyListener,
    initNoInteract
} from '../../interfacers/eventsInterfacer';

import calculateGlobalOffset from '../../utils/calculateGlobalOffset';
import calculateTrueArtboardOffset from '../../utils/calculateTrueArtboardOffset';
import {
    storageRead,
    storageWrite
} from '../../utils/storage';

import {
    COOKIE_EXPIRATION_DEFAULT,
    COOKIE_TOOL_ENABLED,
    ESCAPE_KEY,
    MINUS_KEY,
    NO_INTERACT_CLASS,
    NO_INTERACT_ELEMENTS,
    PLUS_KEY
} from '../../globalConstants';

class InspectView extends React.Component {
    static ZOOM_STEP = 10;

    constructor(props) {
        super(props);

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
            isToolEnabled: true,
            lastOpenedDialog: '',
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
        };
    }

    componentDidMount() {
        const isToolEnabled = storageRead(COOKIE_TOOL_ENABLED) === 'true';

        this.setToolEnabledStatus(isToolEnabled);
    }

    componentDidUpdate() {
        console.log('State:', this.state);
    }

    setAxureLoaded = () => {
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
    setArtboardZoom = (zoomLevel) => {
        const roundedZoom = Math.round(zoomLevel / 10) * 10;

        this.setState({
            documentZoom: roundedZoom <= 1 ? 1 : roundedZoom
        }, () => {
            this.setArtboardDimensions();
        });
    }

    setArtboardDimensions = (dimensions = {}) => {
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

    setToolEnabledStatus = (isToolEnabled) => {
        this.setState({
            isToolEnabled
        });

        // Track enable status for page reloads.
        storageWrite(COOKIE_TOOL_ENABLED, isToolEnabled, COOKIE_EXPIRATION_DEFAULT);
    }

    toggleToolEnable = () => {
        const {
            isToolEnabled: wasToolEnabled
        } = this.state;

        this.clearHoveredElement();
        this.clearSelectedElement();

        this.setToolEnabledStatus(!wasToolEnabled);
    }

    initializerListeners = () => {
        initNoInteract();

        addDialogOpenListener(this.handleDialogOpenCallback);
        addGlobalClickListener(this.handleClickCallback);
        addGlobalMouseToggleListener(this.handleMouseToggleCallback);
        addGlobalMouseoverListener(this.handleMouseoverCallback);
        addGlobalZoomListener(this.handleZoomingCallback);
        addHotkeyListener(this.handleHotkeyCallback);
    }

    clearHoveredElement = async () => {
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
            }
        });
    }

    clearSelectedElement = async () => {
        this.setState({
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

    /**
     * We use this function to essentially close the tool. For example,
     * if we have a selected element and the redline specs panel is
     * open, we'll deselect the element and close the panel.
     */
    clearToolStatus = () => {
        this.clearHoveredElement();
        this.clearSelectedElement();
    }

    /**
     * Some sroll events are permitted and should not trigger a
     * closure of the tool. We filter them here.
     *
     * @param {event} event
     */
    handleScroll = (event) => {
        const {
            target: {
                classList
            }
        } = event;

        const PERMITTED_SCROLL_EVENTS = [
            'ElementPropertiesSidebarModule__pseudo-tabs--body',
            'TextAreaComponent__textarea'
        ];

        const isPermittedScroll = () => {
            let matchFound = false;

            PERMITTED_SCROLL_EVENTS.forEach((extractedClass) => {
                if (classList.contains(extractedClass)) {
                    matchFound = true;
                }
            });

            return matchFound;
        };

        if (!isPermittedScroll()) {
            this.clearToolStatus();
        }
    }

    handleMouseoverCallback = (event) => {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        const {
            target,
            target: {
                classList: selectedElementClassList
            }
        } = event;

        const isInteractableElement = () => !selectedElementClassList.contains(NO_INTERACT_CLASS);

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
        } else if (isToolEnabled && !isInteractableElement()) {
            this.clearHoveredElement();
        }
    }

    handleClickCallback = (event) => {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        const {
            target,
            target: {
                classList: clickedElementClassList
            }
        } = event;

        const {
            name: artboardModuleName
        } = ArtboardModule;

        const isNoInteractElement = () => {
            let isNoInteract = false;

            if (clickedElementClassList.length) {
                NO_INTERACT_ELEMENTS.forEach((noInteractElement) => {
                    if (clickedElementClassList.contains(noInteractElement)) {
                        isNoInteract = true;
                    }
                });
            }

            return isNoInteract;
        };

        if (clickedElementClassList.contains(artboardModuleName)) {
            this.clearSelectedElement();
        } else if (isToolEnabled
            && !isHotkeyDepressed
            && !isNoInteractElement()) {
            event.stopPropagation();
            event.preventDefault();

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

    handleMouseToggleCallback = (event) => {
        const {
            isToolEnabled,
            isHotkeyDepressed
        } = this.state;

        if (isToolEnabled && !isHotkeyDepressed) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    handleDialogOpenCallback = (event) => {
        const {
            lastOpenedDialog
        } = this.state;

        const {
            target
        } = event;

        let annotationIcon = target;

        // We're searching for the top-level of the icon.
        while (!annotationIcon.classList.contains('annotation')) {
            const {
                parentElement
            } = annotationIcon;

            annotationIcon = parentElement;
        }

        const clickOrigination = calculateGlobalOffset(annotationIcon);

        const {
            scaledOffsetLeft: offsetLeft,
            scaledOffsetTop: offsetTop,
            scaledWidth: width
        } = clickOrigination;

        const uiDialogList = document.getElementsByClassName('ui-dialog');

        // Last index is our latest-opened dialog.
        const latestOpenedDialog = [...uiDialogList].pop();

        const dialogOffsetPadding = 5; // 5px

        if (latestOpenedDialog && latestOpenedDialog !== lastOpenedDialog) {
            latestOpenedDialog.style.left = `${offsetLeft}px`;
            latestOpenedDialog.style.top = `${offsetTop + width + dialogOffsetPadding}px`;

            this.setState({
                lastOpenedDialog: latestOpenedDialog
            });
        }
    }

    handleHotkeyCallback = (isHotkeyDepressed) => {
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

    handleZoomingCallback = (event) => {
        const {
            documentZoom
        } = this.state;

        switch (event.keyCode) {
            case ESCAPE_KEY:
                this.clearToolStatus();
                break;
            case PLUS_KEY:
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();

                    const newZoom = documentZoom + InspectView.ZOOM_STEP;

                    this.setArtboardZoom(newZoom);
                }
                break;
            case MINUS_KEY:
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();

                    const newZoom = documentZoom - InspectView.ZOOM_STEP;

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
            axureLoaded,
            documentZoom,
            elementMarkerThickness,
            hoveredElement,
            isToolEnabled,
            selectedElement,
            zoomWrapperPadding
        } = this.state;

        return (
            <React.Fragment>
                {
                    !axureLoaded
                    && <LoadingIndicatorComponent />
                }
                <div
                    className={InspectView.name}
                    onScroll={this.handleScroll}
                >
                    <HeaderModule
                        isToolEnabled={isToolEnabled}
                        toggleToolEnable={this.toggleToolEnable}
                    />
                    <ElementPropertiesSidebarModule
                        isToolEnabled={isToolEnabled}
                        selectedElement={selectedElement}
                    />
                    <ArtboardModule
                        artboardHeight={artboardHeight}
                        artboardWidth={artboardWidth}
                        artboardWrapperHeight={artboardWrapperHeight}
                        artboardWrapperWidth={artboardWrapperWidth}
                        documentZoom={documentZoom}
                        elementMarkerThickness={elementMarkerThickness}
                        handleClickCallback={this.handleClickCallback}
                        hoveredElement={hoveredElement}
                        isToolEnabled={isToolEnabled}
                        selectedElement={selectedElement}
                        setArtboardDimensions={this.setArtboardDimensions}
                        setArtboardZoom={this.setArtboardZoom}
                        setAxureLoaded={this.setAxureLoaded}
                        zoomWrapperPadding={zoomWrapperPadding}
                    />
                    <ZoomControlModule
                        documentZoom={documentZoom}
                        setArtboardZoom={this.setArtboardZoom}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default InspectView;
