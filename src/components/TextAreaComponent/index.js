import PropTypes from 'prop-types';
import React from 'react';

import TooltipComponent from '../TooltipComponent';

import { TOOLTIP_VISIBLE_TIME } from '../../globalConstants';

import './styles.scss';

class TextAreaComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleCopy = this.handleCopy.bind(this);

        this.state = {
            isCopiedTooltipActive: false
        };
    }

    /**
     * This function handles our mouseup event and selects the
     * field text.
     *
     * @param {mouseup event} event
     */
    handleCopy(event) {
        const {
            target: inputField
        } = event;

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

    render() {
        const {
            inputValue,
            label
        } = this.props;

        const {
            isCopiedTooltipActive
        } = this.state;

        return (
            <div className={TextAreaComponent.name}>
                <label className={`${TextAreaComponent.name}__label`}>
                    {label}
                    <textarea
                        className={`${TextAreaComponent.name}__textarea`}
                        readOnly
                        onMouseUp={this.handleCopy}
                    >
                        {inputValue}
                    </textarea>
                </label>
                <TooltipComponent isVisible={isCopiedTooltipActive} />
            </div>
        );
    }
}

TextAreaComponent.propTypes = {
    inputValue: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default TextAreaComponent;
