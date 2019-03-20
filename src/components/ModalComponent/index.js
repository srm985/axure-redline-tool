import React from 'react';
import ReactDOM from 'react-dom';

import './styles.scss';

class ModalComponent extends React.PureComponent {
    static displayName = 'ModalComponent';

    componentDidUpdate(prevProps) {
        console.log('updating...')
    }

    componentDidMount() {
        const modalOpenClassName = 'modal-open';

        document.body.classList.add(modalOpenClassName);
    }

    render() {
        return (
            <div className={ModalComponent.displayName}>
                <div className={`${ModalComponent.displayName}__modal`}>
                    <div
                        className={`${ModalComponent.displayName}__modal-close`}
                        role={'button'}
                        tabIndex={0}
                    >
                        <div />
                    </div>
                </div>
            </div>
        );
    }
}

const PortalModalComponent = () => (
    ReactDOM.createPortal(<ModalComponent />, document.body)
);

export default PortalModalComponent;
