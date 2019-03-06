import PropTypes from 'prop-types';
import React from 'react';

import InspectView from '../../views/InspectView';

import {
    ENTER_KEY,
    ESCAPE_KEY
} from '../../globalConstants';

import './styles.scss';

const moduleClassName = 'ZoomControlModule';

const zoomDecrease = 'decrease';
const zoomIncrease = 'increase';

class ZoomControlModule extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            zoomLevel: 100
        };
    }

    componentDidMount() {
        const {
            documentZoom
        } = this.props;

        this.setState({
            zoomLevel: documentZoom
        });
    }

    componentDidUpdate(prevProps) {
        const {
            documentZoom
        } = this.props;

        const {
            documentZoom: prevDocumentZoom
        } = prevProps;

        if (documentZoom !== prevDocumentZoom) {
            this.setState({
                zoomLevel: documentZoom
            });
        }
    }

    onZoomClickChangeHandler = (zoomDirection) => {
        const {
            setArtboardZoom
        } = this.props;

        const {
            zoomLevel
        } = this.state;

        if (zoomDirection === zoomDecrease) {
            setArtboardZoom(zoomLevel - InspectView.ZOOM_STEP);
        } else if (zoomDirection === zoomIncrease) {
            setArtboardZoom(zoomLevel + InspectView.ZOOM_STEP);
        }
    }

    onZoomInputChangeHandler = (event) => {
        const {
            target: {
                value
            }
        } = event;

        const cleanedValue = value.replace(/%/g, '');

        this.setState({
            zoomLevel: cleanedValue
        });
    }

    onZoomInputBlurHandler = (event) => {
        const {
            setArtboardZoom
        } = this.props;

        const {
            target: {
                value
            }
        } = event;

        const cleanedValue = value.replace(/%/g, '');

        setArtboardZoom(cleanedValue);
    }

    onZoomInputFocusHandler = (event) => {
        const {
            target
        } = event;

        target.select();
    }

    onKeypressHandler = (event) => {
        const {
            keyCode,
            target
        } = event;

        if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
            target.blur();
        }
    }

    render() {
        const {
            zoomLevel
        } = this.state;

        return (
            <div className={moduleClassName}>
                <div
                    className={`${moduleClassName}__zoom-control ${moduleClassName}__zoom-control--negative`}
                    onClick={() => this.onZoomClickChangeHandler(zoomDecrease)}
                >
                    <span />
                </div>
                <input
                    className={`${moduleClassName}__zoom-input`}
                    onBlur={this.onZoomInputBlurHandler}
                    onChange={this.onZoomInputChangeHandler}
                    onFocus={this.onZoomInputFocusHandler}
                    onKeyDown={this.onKeypressHandler}
                    value={`${zoomLevel}%`}
                />
                <div
                    className={`${moduleClassName}__zoom-control ${moduleClassName}__zoom-control--positive`}
                    onClick={() => this.onZoomClickChangeHandler(zoomIncrease)}
                >
                    <span />
                </div>
            </div>
        );
    }
}

ZoomControlModule.propTypes = {
    documentZoom: PropTypes.number.isRequired,
    setArtboardZoom: PropTypes.func.isRequired
};

export default ZoomControlModule;
