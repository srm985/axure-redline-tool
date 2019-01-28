import PropTypes from 'prop-types';
import React from 'react';

import InputComponent from '../../components/InputComponent';
import TextAreaComponent from '../../components/TextAreaComponent';

import compileCSSAttributes from '../../utils/compileCSSAttributes';

import './styles.scss';

class ElementPropertiesSidebarModule extends React.PureComponent {
    static cssAttributesList = {
        /* eslint-disable quote-props, sort-keys */
        properties: {
            'width': '',
            'height': ''
        },
        styles: {
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
        text: {
            'font-family': '',
            'font-size': '',
            'font-weight': '',
            'line-height': '',
            'text-align': '',
            'color': '',
            '_content': ''
        }
        /* eslint-enable quote-props, sort-keys */
    };

    static pseudoClasses = [
        {
            axureName: '',
            keyName: 'default',
            pseudoName: 'Default'
        },
        {
            axureName: 'mouseOver',
            keyName: 'hover',
            pseudoName: 'Hover'
        },
        {
            axureName: 'mouseDown',
            keyName: 'mousedown',
            pseudoName: 'MouseDown'
        },
        {
            axureName: 'disabled',
            keyName: 'disabled',
            pseudoName: 'Disabled'
        }
    ];

    static COPY_BLOCK_NAME = '_content';

    constructor(props) {
        super(props);

        this.clearCSSAttributes = this.clearCSSAttributes.bind(this);
        this.extractDefaultCSS = this.extractDefaultCSS.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);

        this.state = {
            activeTab: 'default',
            defaultCSSAttributes: {},
            documentCSSAttributes: {},
            isSidebarVisible: false
        };
    }

    componentDidMount() {
        const documentCSSAttributes = compileCSSAttributes(ElementPropertiesSidebarModule.pseudoClasses);

        this.setState({
            documentCSSAttributes
        });
    }

    componentDidUpdate(prevProps) {
        const {
            selectedElement: {
                target: prevTarget
            }
        } = prevProps;

        const {
            selectedElement: {
                target
            }
        } = this.props;

        const isElementSelected = !!target;

        const [
            defaultAttributes
        ] = ElementPropertiesSidebarModule.pseudoClasses;

        const {
            keyName: defaultAttributesTab
        } = defaultAttributes;

        if (target !== prevTarget) {
            // Don't set visible until we've cleared previous CSS to prevent conflicts.
            this.clearCSSAttributes().then(() => {
                if (isElementSelected) {
                    this.extractDefaultCSS();
                }

                this.setState({
                    activeTab: defaultAttributesTab,
                    isSidebarVisible: isElementSelected
                });
            });
        }
    }

    clearCSSAttributes() {
        const {
            defaultCSSAttributes: statefulDefaultCSSAttributes
        } = this.state;

        const defaultCSSAttributes = JSON.parse(JSON.stringify(statefulDefaultCSSAttributes));

        Object.keys(defaultCSSAttributes).forEach((attributeFamily) => {
            Object.keys(defaultCSSAttributes[attributeFamily]).forEach((attribute) => {
                defaultCSSAttributes[attributeFamily][attribute] = '';
            });
        });

        return new Promise((resolve) => {
            this.setState({
                defaultCSSAttributes
            }, () => {
                resolve();
            });
        });
    }

    extractDefaultCSS() {
        const {
            selectedElement: {
                target
            }
        } = this.props;

        const defaultCSSAttributes = JSON.parse(JSON.stringify(ElementPropertiesSidebarModule.cssAttributesList));

        Object.keys(defaultCSSAttributes).forEach((attributeFamily) => {
            Object.keys(defaultCSSAttributes[attributeFamily]).forEach((attribute) => {
                if (attribute === ElementPropertiesSidebarModule.COPY_BLOCK_NAME) {
                    defaultCSSAttributes[attributeFamily][attribute] = target.value || target.innerText;
                } else if (attribute === 'opacity') {
                    /**
                     * For immediate children of Axure page elements, their opacity
                     * is actually set at the parent level. For example, if we click
                     * on "u1_div", its opacity is actually set at the parent, "u1".
                     */

                    const {
                        parentElement,
                        parentElement: {
                            id: parentID = ''
                        } = {}
                    } = target;

                    const isImmediateChildRegex = /u\d+_div/;
                    const isImmediateChild = isImmediateChildRegex.test(parentID);

                    if (isImmediateChild) {
                        defaultCSSAttributes[attributeFamily][attribute] = window.getComputedStyle(parentElement).getPropertyValue(attribute);
                    } else {
                        defaultCSSAttributes[attributeFamily][attribute] = window.getComputedStyle(target).getPropertyValue(attribute);
                    }
                } else {
                    defaultCSSAttributes[attributeFamily][attribute] = window.getComputedStyle(target).getPropertyValue(attribute);
                }
            });
        });

        this.setState({
            defaultCSSAttributes
        });
    }

    toggleSidebar() {
        this.setState((prevState) => {
            const {
                isSidebarVisible: isSidebarVisiblePrev
            } = prevState;

            return ({ isSidebarVisible: !isSidebarVisiblePrev });
        });
    }

    renderAttributes(attributeList) {
        const {
            styles: {
                'border-bottom-color': borderBottomColor = '',
                'border-bottom-left-radius': borderBottomLeftRadius = '',
                'border-bottom-right-radius': borderBottomRightRadius = '',
                'border-bottom-style': borderBottomStyle = '',
                'border-bottom-width': borderBottomWidth = '',
                'border-color': borderColor = '',
                'border-left-color': borderLeftColor = '',
                'border-left-style': borderLeftStyle = '',
                'border-left-width': borderLeftWidth = '',
                'border-right-color': borderRightColor = '',
                'border-right-style': borderRightStyle = '',
                'border-right-width': borderRightWidth = '',
                'border-style': borderStyle = '',
                'border-top-color': borderTopColor = '',
                'border-top-left-radius': borderTopLeftRadius = '',
                'border-top-right-radius': borderTopRightRadius = '',
                'border-top-style': borderTopStyle = '',
                'border-top-width': borderTopWidth = '',
                'border-width': borderWidth = ''
            } = {},
            text: {
                _content = '',
                'font-family': fontFamily = ''
            } = {}
        } = attributeList;

        const tempElementAttributes = JSON.parse(JSON.stringify(attributeList));
        const elementAttributes = [];

        const isValidAttribute = (attribute, value) => {
            let isValid = false;

            if (value !== undefined
                && value.length
                && !value.includes('none')
                && value !== '0px'
                && value !== 'medium'
                && !value.includes('initial')
                && !(attribute === 'opacity' && Number(value) === 1)) {
                isValid = true;
            }

            return isValid;
        };

        try {
            // Concat granular border values to shorthand and clear.
            tempElementAttributes.styles['border-bottom'] = `${borderBottomStyle} ${borderBottomWidth} ${borderBottomColor}`;
            tempElementAttributes.styles['border-left'] = `${borderLeftStyle} ${borderLeftWidth} ${borderLeftColor}`;
            tempElementAttributes.styles['border-right'] = `${borderRightStyle} ${borderRightWidth} ${borderRightColor}`;
            tempElementAttributes.styles['border-top'] = `${borderTopStyle} ${borderTopWidth} ${borderTopColor}`;

            delete tempElementAttributes.styles['border-bottom-color'];
            delete tempElementAttributes.styles['border-bottom-style'];
            delete tempElementAttributes.styles['border-bottom-width'];
            delete tempElementAttributes.styles['border-left-color'];
            delete tempElementAttributes.styles['border-left-style'];
            delete tempElementAttributes.styles['border-left-width'];
            delete tempElementAttributes.styles['border-right-color'];
            delete tempElementAttributes.styles['border-right-style'];
            delete tempElementAttributes.styles['border-right-width'];
            delete tempElementAttributes.styles['border-top-color'];
            delete tempElementAttributes.styles['border-top-style'];
            delete tempElementAttributes.styles['border-top-width'];


            // Check if we have matching border attributes and consolidate.
            const borderBottom = tempElementAttributes.styles['border-bottom'];
            const borderLeft = tempElementAttributes.styles['border-left'];
            const borderRight = tempElementAttributes.styles['border-right'];
            const borderTop = tempElementAttributes.styles['border-top'];

            // Check if all borders are the same.
            if (borderTopStyle !== 'none'
                && borderTopStyle
                && borderBottom === borderLeft
                && borderLeft === borderRight
                && borderRight === borderTop) {
                delete tempElementAttributes.styles['border-bottom'];
                delete tempElementAttributes.styles['border-left'];
                delete tempElementAttributes.styles['border-right'];
                delete tempElementAttributes.styles['border-top'];

                // Bug: Force Synchronous
                setTimeout(() => {
                    tempElementAttributes.styles.border = `${borderTopStyle} ${borderTopWidth} ${borderTopColor}`;
                }, 0);

                tempElementAttributes.styles['border-color'] = borderTopColor;
                tempElementAttributes.styles['border-style'] = borderTopStyle;
                tempElementAttributes.styles['border-width'] = borderTopWidth;
            } else if (borderStyle && borderWidth && borderColor) {
                tempElementAttributes.styles.border = `${borderStyle} ${borderWidth} ${borderColor}`;
            } else {
                delete tempElementAttributes.styles.border;

                delete tempElementAttributes.styles['border-style'];
                delete tempElementAttributes.styles['border-width'];
                delete tempElementAttributes.styles['border-color'];
            }

            // Create our border radius shorthand.
            if (borderBottomLeftRadius === borderBottomRightRadius
                && borderBottomRightRadius === borderTopLeftRadius
                && borderTopLeftRadius === borderTopRightRadius) {
                tempElementAttributes.styles['border-radius'] = borderTopLeftRadius;
            } else if (borderTopLeftRadius === borderBottomRightRadius
                && borderTopRightRadius === borderBottomLeftRadius) {
                tempElementAttributes.styles['border-radius'] = `${borderTopLeftRadius} ${borderTopRightRadius}`;
            } else if (borderTopRightRadius === borderBottomLeftRadius) {
                tempElementAttributes.styles['border-radius'] = `${borderTopLeftRadius} ${borderTopRightRadius} ${borderBottomLeftRadius}`;
            } else {
                tempElementAttributes.styles['border-radius'] = `${borderTopLeftRadius} ${borderTopRightRadius} ${borderBottomRightRadius} ${borderBottomLeftRadius}`;
            }

            // Remove granular border radii.
            delete tempElementAttributes.styles['border-bottom-left-radius'];
            delete tempElementAttributes.styles['border-bottom-right-radius'];
            delete tempElementAttributes.styles['border-top-left-radius'];
            delete tempElementAttributes.styles['border-top-right-radius'];
        } catch (error) { }

        // If there is no text to display, remove other related attributes.
        if (_content) {
            const [baseFont] = fontFamily.replace(/"/g, '').split(',');

            tempElementAttributes.text['font-family'] = baseFont;
        } else {
            delete tempElementAttributes.text;
        }

        const blockProperties = [];


        Object.keys(tempElementAttributes).forEach((attributeFamily) => {
            elementAttributes.push(
                <p key={attributeFamily}>{attributeFamily}</p>
            );

            Object.keys(tempElementAttributes[attributeFamily]).forEach((attribute) => {
                const value = tempElementAttributes[attributeFamily][attribute];

                if (isValidAttribute(attribute, value)) {
                    // If RGBA opacity is set to 0, let's just call it transparent.
                    const cleanedValue = value.replace(/rgba\(\d+,\s\d+,\s\d+,\s0\)/, 'transparent');

                    // Concat all valid properties to use later for the CSS block.
                    if (attribute !== ElementPropertiesSidebarModule.COPY_BLOCK_NAME) {
                        blockProperties.push(`${attribute}: ${cleanedValue};`);
                    }

                    const attributeBlock = () => (attribute === ElementPropertiesSidebarModule.COPY_BLOCK_NAME
                        ? (
                            <TextAreaComponent
                                inputValue={cleanedValue}
                                key={attribute}
                                label={'content:'}
                            />
                        )
                        : (
                            <InputComponent
                                inputValue={cleanedValue}
                                key={attribute}
                                label={`${attribute}:`}
                            />
                        ));

                    elementAttributes.push(
                        attributeBlock()
                    );
                }
            });
        });

        // Create a block containing all CSS attributes.
        elementAttributes.push([
            <p key={'css-block-attributes-header'}>CSS BLOCK ATTRIBUTES</p>,
            <TextAreaComponent
                inputValue={blockProperties.join('\n')}
                key={'css-block-attributes-body'}
                label={'properties:'}
            />
        ]);

        return elementAttributes;
    }

    renderPseudoClassTabs() {
        const {
            selectedElement: {
                target
            }
        } = this.props;

        const {
            activeTab,
            defaultCSSAttributes,
            documentCSSAttributes
        } = this.state;

        const setActiveTab = (activatedTab) => {
            this.setState({
                activeTab: activatedTab
            });
        };

        const renderTabs = () => {
            const tabs = [];

            ElementPropertiesSidebarModule.pseudoClasses.forEach((pseudoClass) => {
                const {
                    keyName
                } = pseudoClass;

                const tabActivate = keyName === activeTab ? `${ElementPropertiesSidebarModule.name}__pseudo-tabs--tab-active` : '';

                tabs.push(
                    <div
                        className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs--tab ${tabActivate}`}
                        key={keyName}
                        onClick={() => setActiveTab(keyName)}
                    >
                        <span>{keyName}</span>
                    </div>
                );
            });

            return tabs;
        };

        const renderAttributeBody = () => {
            const {
                id: elementID
            } = target;

            const [
                defaultAttributes
            ] = ElementPropertiesSidebarModule.pseudoClasses;

            const {
                keyName: defaultAttributesTab
            } = defaultAttributes;

            const retrieveAxureName = () => {
                let axureKeyName = '';

                ElementPropertiesSidebarModule.pseudoClasses.forEach((pseudoClass) => {
                    const {
                        axureName,
                        keyName
                    } = pseudoClass;

                    if (keyName === activeTab) {
                        axureKeyName = axureName;
                    }
                });

                return axureKeyName;
            };

            const formatAttributes = (attributeList) => {
                const tempElementAttributes = JSON.parse(JSON.stringify(ElementPropertiesSidebarModule.cssAttributesList));

                Object.keys(tempElementAttributes).forEach((attributeFamily) => {
                    Object.keys(tempElementAttributes[attributeFamily]).forEach((attribute) => {
                        if (attribute in attributeList) {
                            const {
                                [attribute]: extractedAttributeValue
                            } = attributeList;

                            tempElementAttributes[attributeFamily][attribute] = extractedAttributeValue;
                        }
                    });
                });

                return tempElementAttributes;
            };

            let attributesList = {};

            if (activeTab === defaultAttributesTab) {
                attributesList = JSON.parse(JSON.stringify(defaultCSSAttributes));
            } else {
                try {
                    const {
                        [`#${elementID}.${retrieveAxureName()}`]: {
                            default: pseudoAttributes
                        }
                    } = documentCSSAttributes;

                    attributesList = formatAttributes(pseudoAttributes);
                } catch (error) {
                    /**
                     * This gets called before we reset to default tab so
                     * if our element doesn't have pseudo attributes, it'll
                     * throw an error.
                     */
                }
            }

            return this.renderAttributes(attributesList);
        };

        return (
            <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs`}>
                <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs--header`}>
                    {
                        renderTabs()
                    }
                </div>
                <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs--body`}>
                    {
                        renderAttributeBody()
                    }
                </div>
            </div>
        );
    }

    render() {
        const {
            selectedElement: {
                target
            } = {}
        } = this.props;

        const {
            isSidebarVisible
        } = this.state;

        const isElementSelected = !!target;

        return (
            <div className={`${ElementPropertiesSidebarModule.name} ${isSidebarVisible && `${ElementPropertiesSidebarModule.name}--visible`}`}>
                <div
                    className={`${ElementPropertiesSidebarModule.name}__side-pull`}
                    onClick={this.toggleSidebar}
                    onKeyUp={this.toggleSidebar}
                    role={'button'}
                    tabIndex={0}
                >
                    <span />
                    <span />
                    <span />
                </div>
                {
                    isElementSelected
                    && (
                        <React.Fragment>
                            {this.renderPseudoClassTabs()}
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}

ElementPropertiesSidebarModule.propTypes = {
    selectedElement: PropTypes.shape({})
};

ElementPropertiesSidebarModule.defaultProps = {
    selectedElement: {
        height: 0,
        offsetLeft: 0,
        offsetTop: 0,
        target: null,
        width: 0
    }
};

export default ElementPropertiesSidebarModule;
