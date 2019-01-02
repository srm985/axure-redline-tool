import PropTypes from 'prop-types';
import React from 'react';

import InputComponent from '../../components/InputComponent';

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

    static pseudoClasses = {
        default: {
            axureName: '',
            keyName: 'default',
            pseudoName: 'Default'
        },
        disabled: {
            axureName: 'disabled',
            keyName: 'disabled',
            pseudoName: 'Disabled'
        },
        hover: {
            axureName: 'mouseOver',
            keyName: 'hover',
            pseudoName: 'Hover'
        },
        mousedown: {
            axureName: 'mouseDown',
            keyName: 'mousedown',
            pseudoName: 'MouseDown'
        }
    };

    constructor(props) {
        super(props);

        this.clearCSSAttributes = this.clearCSSAttributes.bind(this);
        this.extractDefaultCSS = this.extractDefaultCSS.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);

        this.state = {
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

        if (target !== prevTarget) {
            // Don't set visible until we've cleared previous CSS to prevent conflicts.
            this.clearCSSAttributes().then(() => {
                if (isElementSelected) {
                    this.extractDefaultCSS();
                }

                this.setState({
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
            Object.keys(attributeFamily).forEach((attribute) => {
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
                if (attribute === '_content') {
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

        console.log('default element CSS:', defaultCSSAttributes);
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

    renderPseudoClassTabs() {
        const {
            defaultCSSAttributes
        } = this.state;

        const listAttributes = () => {
            const pushedAttributes = [];

            Object.keys(defaultCSSAttributes).forEach((attributeFamily) => {
                pushedAttributes.push(
                    <p>{attributeFamily}</p>
                );

                Object.keys(defaultCSSAttributes[attributeFamily]).forEach((attribute) => {
                    console.log('pushing val:', defaultCSSAttributes[attributeFamily][attribute]);
                    pushedAttributes.push(
                        <InputComponent
                            label={`${attribute}:`}
                            inputValue={defaultCSSAttributes[attributeFamily][attribute]}
                        />
                    );
                });
            });

            return pushedAttributes;
        };

        return (
            <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs`}>
                <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs--header`}>
                    <div />
                </div>
                <div className={`${ElementPropertiesSidebarModule.name}__pseudo-tabs--body`}>
                    {
                        listAttributes()
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
