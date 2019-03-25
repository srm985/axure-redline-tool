import PropTypes from 'prop-types';
import React from 'react';

import ColorSwatchComponent from '../ColorSwatchComponent';
import TooltipComponent from '../TooltipComponent';

import CSS_COLORS from '../../utils/cssColors';

import { TOOLTIP_VISIBLE_TIME } from '../../globalConstants';

import './styles.scss';

class InputComponent extends React.PureComponent {
    static displayName = 'InputComponent';
    static rgbaRegEx = /rgb(a)?\(\d+,(\s+)?\d+,(\s+)?\d+(,(\s+)?\d(\.\d+)?)?\)/;
    static hexRegEx = /#([a-fA-F]|\d){6}((\s+)?\d{1,3}%)?/;

    constructor(props) {
        super(props);
        this.checkColorSwatchRequired = this.checkColorSwatchRequired.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.setSwatchValue = this.setSwatchValue.bind(this);

        this.state = {
            inputValue: '',
            isCopiedTooltipActive: false,
            swatchColor: null
        };
    }

    componentDidMount() {
        const {
            inputValue,
            noFormat
        } = this.props;

        if (noFormat) {
            this.setState({
                inputValue
            });
        } else {
            this.checkColorSwatchRequired();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            inputValue,
            noFormat
        } = this.props;

        const {
            inputValue: prevInputValue
        } = prevProps;

        if (noFormat && inputValue !== prevInputValue) {
            this.setState({
                inputValue
            });
        } else if (inputValue !== prevInputValue) {
            this.checkColorSwatchRequired();
        }
    }

    setSwatchValue() {
        const {
            inputValue
        } = this.state;

        const placeholder = '!*!';

        let colorArr;
        let extractedColorString = '';
        let newFormat = '';
        let opacity;
        let valueTemplate = '';

        // Determine if we're looking at a RGB(A) or hex value.
        if ((InputComponent.rgbaRegEx).test(inputValue)) {
            [extractedColorString] = inputValue.match(InputComponent.rgbaRegEx);
            valueTemplate = inputValue.replace(InputComponent.rgbaRegEx, placeholder);
        } else if ((InputComponent.hexRegEx).test(inputValue)) {
            [extractedColorString] = inputValue.match(InputComponent.hexRegEx);
            valueTemplate = inputValue.replace(InputComponent.hexRegEx, placeholder);
        } else {
            // If we end up not passing a color at all.
            valueTemplate = inputValue;
        }

        if (/rgba/.test(extractedColorString)) {
            colorArr = extractedColorString.match(/(\d\.\d+)|\d+/g);
            newFormat = '#';

            for (let i = 0; i < 3; i++) {
                newFormat += (`0${Number(colorArr[i]).toString(16).toUpperCase()}`).slice(-2);
            }

            newFormat += ` ${Number(colorArr[3]) * 100}%`;
        } else if (/%/.test(extractedColorString)) {
            colorArr = extractedColorString.replace('#', '').slice(0, 6).match(/\w{2}/g);
            opacity = Number(extractedColorString.replace(/#\w{6}\s/, '').replace('%', '')) / 100;
            newFormat = `rgba(${parseInt(colorArr[0], 16)}, ${parseInt(colorArr[1], 16)}, ${parseInt(colorArr[2], 16)}, ${opacity})`;
        } else if (/rgb\(/.test(extractedColorString)) {
            colorArr = extractedColorString.replace(',', '').match(/\d+/g);
            newFormat = '#';

            colorArr.forEach((color) => {
                newFormat += (`0${Number(color).toString(16).toUpperCase()}`).slice(-2);
            });
        } else if (/#/.test(extractedColorString)) {
            colorArr = extractedColorString.replace('#', '').match(/\w{2}/g);
            newFormat = `rgb(${parseInt(colorArr[0], 16)}, ${parseInt(colorArr[1], 16)}, ${parseInt(colorArr[2], 16)})`;
        }

        valueTemplate = valueTemplate.replace(placeholder, newFormat);

        this.setState({
            inputValue: valueTemplate
        });
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

    checkColorSwatchRequired() {
        const {
            inputValue
        } = this.props;

        const placeholder = '!*!';

        let swatchOpacity;
        let conditionedInputColorValue;
        let swatchColor;

        if ((InputComponent.rgbaRegEx).test(inputValue) && inputValue !== 'transparent') {
            /**
             * If we have RGBA, we round our opacity to two decimals of
             * precision. If the opacity is 1, we'll convert to RGB.
             */
            if ((/rgba/).test(inputValue)) {
                // Extract our RGBA substring.
                const rgbaExtraction = inputValue.match(InputComponent.rgbaRegEx)[0].replace(/\s+/g, '');

                swatchOpacity = Math.round(Number(rgbaExtraction.replace(/rgba\(\d+,\d+,\d+,(\d?(\.\d+)?)\)/, '$1')) * 100) / 100;
                swatchColor = rgbaExtraction.replace(/rgba\((\d+),(\d+),(\d+),(\d?(\.\d+)?)\)/, `rgba($1, $2, $3, ${placeholder})`);
                swatchColor = swatchColor.replace(placeholder, swatchOpacity);

                /**
                 * If our RGBA opacity is 1, then let's just convert
                 * things to RGB.
                 */
                if (swatchOpacity === 1) {
                    swatchColor = rgbaExtraction.replace(/rgba\((\d+),(\d+),(\d+),(\d?(\.\d+)?)\)/, 'rgb($1, $2, $3)');
                }

                conditionedInputColorValue = inputValue.replace(InputComponent.rgbaRegEx, swatchColor);
            } else {
                [swatchColor] = inputValue.match(InputComponent.rgbaRegEx);
            }
        } else {
            const cleanedInputValue = inputValue.trim().toLowerCase();
            const colorsList = Object.keys(CSS_COLORS);

            // See if we have a CSS color name in our input value.
            colorsList.forEach((color) => {
                if (cleanedInputValue.includes(color.toLowerCase())) {
                    const {
                        [color]: {
                            rgb: rgbColor
                        }
                    } = CSS_COLORS;

                    swatchColor = rgbColor;
                }
            });
        }

        this.setState({
            inputValue: conditionedInputColorValue || inputValue,
            swatchColor
        });
    }

    render() {
        const {
            label
        } = this.props;

        const {
            inputValue,
            isCopiedTooltipActive,
            swatchColor
        } = this.state;

        return (
            <div className={InputComponent.displayName}>
                <label
                    className={`${InputComponent.displayName}__label`}
                >
                    {label}
                </label>
                <input
                    className={`${InputComponent.displayName}__input`}
                    readOnly
                    value={inputValue}
                    onMouseUp={this.handleCopy}
                />
                {
                    swatchColor
                    && (
                        <ColorSwatchComponent
                            className={`${InputComponent.displayName}__color-swatch`}
                            setSwatchValue={this.setSwatchValue}
                            swatchColor={swatchColor}
                        />
                    )
                }
                <TooltipComponent isVisible={isCopiedTooltipActive} />
            </div>
        );
    }
}

InputComponent.propTypes = {
    inputValue: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    noFormat: PropTypes.bool
};

InputComponent.defaultProps = {
    noFormat: false
};

export default InputComponent;
