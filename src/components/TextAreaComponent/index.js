import PropTypes from 'prop-types';
import React from 'react';

import TooltipComponent from '../TooltipComponent';

import { TOOLTIP_VISIBLE_TIME } from '../../globalConstants';

import './styles.scss';

class TextAreaComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isCopiedTooltipActive: false,
            isScrolling: false
        };
    }

    /**
     * This function handles our mouseup event and selects the
     * field text.
     *
     * @param {mouseup event} event
     */
    handleCopy = (event) => {
        const {
            isScrolling
        } = this.state;

        const {
            target: inputField
        } = event;

        if (!isScrolling) {
            inputField.select();
            document.execCommand('Copy');

            this.setState({
                isCopiedTooltipActive: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isCopiedTooltipActive: false
                    });
                }, TOOLTIP_VISIBLE_TIME);
            });
        }

        // Debounce our scroll event.
        setTimeout(() => {
            this.setState({
                isScrolling: false
            });
        }, 100);
    }

    handleScroll = () => {
        this.setState({
            isScrolling: true
        });
    }

    render() {
        const {
            inputValue,
            label
        } = this.props;

        const {
            isCopiedTooltipActive
        } = this.state;

        return (
            <div className={TextAreaComponent.displayName}>
                <label className={`${TextAreaComponent.displayName}__label`}>
                    {label}
                    <textarea
                        className={`${TextAreaComponent.displayName}__textarea`}
                        readOnly
                        onMouseUp={this.handleCopy}
                        onScroll={this.handleScroll}
                        value={inputValue}
                    />
                </label>
                <TooltipComponent isVisible={isCopiedTooltipActive} />
            </div>
        );
    }
}

TextAreaComponent.displayName = 'TextAreaComponent';

TextAreaComponent.propTypes = {
    inputValue: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default TextAreaComponent;
