import PropTypes from 'prop-types';
import React from 'react';

import ColorSwatchComponent from '../ColorSwatchComponent';

import './styles.scss';

class InputComponent extends React.PureComponent {
    static rgbaRegEx = /rgb(a)?\(\d+,(\s+)?\d+,(\s+)?\d+(,(\s+)?\d(\.\d+)?)?\)/;
    static hexRegEx = /#([a-fA-F]|\d){6}((\s+)?\d{1,3}%)?/;

    constructor(props) {
        super(props);
        console.log('construct');

        this.checkColorSwatchRequired = this.checkColorSwatchRequired.bind(this);
        this.setSwatchValue = this.setSwatchValue.bind(this);

        this.state = {
            inputValue: '',
            swatchColor: null
        };
    }

    componentDidMount() {
        this.checkColorSwatchRequired();
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
                const rgbaExtraction = inputValue.match(InputComponent.rgbaRegEx)[0].replace(' ', '');

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
            swatchColor
        } = this.state;

        return (
            <div className={InputComponent.name}>
                <label className={`${InputComponent.name}__label`}>
                    {label}
                    <input
                        className={`${InputComponent.name}__input`}
                        readOnly
                        value={inputValue}
                    />
                    {
                        swatchColor
                        && (
                            <ColorSwatchComponent
                                className={`${InputComponent.name}__color-swatch`}
                                setSwatchValue={this.setSwatchValue}
                                swatchColor={swatchColor}
                            />
                        )
                    }
                </label>
            </div>
        );
    }
}

InputComponent.propTypes = {
    inputValue: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default InputComponent;
