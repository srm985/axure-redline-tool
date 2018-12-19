import PropTypes from 'prop-types';
import React from 'react';

import compileCSSAttributes from '../../utils/compileCSSAttributes';

import './styles.scss';

class ElementPropertiesSidebarModule extends React.PureComponent {
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

        compileCSSAttributes(ElementPropertiesSidebarModule.pseudoClasses);

        this.toggleSidebar = this.toggleSidebar.bind(this);

        this.state = {
            isSidebarVisible: false
        };
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

        if (target !== prevTarget) {
            this.setState({
                isSidebarVisible: !!target
            });
        }
    }

    toggleSidebar() {
        this.setState((prevState) => {
            const {
                isSidebarVisible: isSidebarVisiblePrev
            } = prevState;

            return ({ isSidebarVisible: !isSidebarVisiblePrev });
        });
    }

    render() {
        const {
            isSidebarVisible
        } = this.state;

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
