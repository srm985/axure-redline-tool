import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { ESCAPE_KEY } from '../../globalConstants';

import './styles.scss';

class ModalComponent extends React.PureComponent {
    static displayName = 'ModalComponent';
    static modalOpenClassName = 'modal-open';

    componentDidMount() {
        const {
            isShown
        } = this.props;

        if (isShown) {
            this.handleOpenModal();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            isShown
        } = this.props;

        const {
            isShown: wasShown
        } = prevProps;

        if (!wasShown && isShown) {
            this.handleOpenModal();
        }
    }

    handleOpenModal = () => {
        // Add modal class to body to block scrolling.
        document.body.classList.add(ModalComponent.modalOpenClassName);
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleCloseModal = () => {
        const {
            closeModal
        } = this.props;

        closeModal();

        document.removeEventListener('keydown', this.handleKeyPress);
        document.body.classList.remove(ModalComponent.modalOpenClassName);
    }

    handleKeyPress = (event) => {
        const {
            keyCode
        } = event;

        if (keyCode === ESCAPE_KEY) {
            event.preventDefault();

            this.handleCloseModal();
        }
    }

    render() {
        const {
            isShown,
            children
        } = this.props;

        const modalVisibleClass = isShown ? `${ModalComponent.displayName}--visible` : '';

        return (
            <div className={`${ModalComponent.displayName} ${modalVisibleClass}`}>
                <div
                    className={`${ModalComponent.displayName}__overlay`}
                    onClick={this.handleCloseModal}
                />
                <div className={`${ModalComponent.displayName}__modal`}>
                    <div
                        className={`${ModalComponent.displayName}__modal-close`}
                        onClick={this.handleCloseModal}
                        role={'button'}
                        tabIndex={0}
                    >
                        <div />
                    </div>
                    <div className={`${ModalComponent.displayName}__modal--body`}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

ModalComponent.propTypes = {
    children: PropTypes.node.isRequired,
    closeModal: PropTypes.func.isRequired,
    isShown: PropTypes.bool.isRequired
};

const PortalModalComponent = (props) => (
    ReactDOM.createPortal(<ModalComponent {...props} />, document.body)
);

export default PortalModalComponent;
