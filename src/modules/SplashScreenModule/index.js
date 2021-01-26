import PropTypes from 'prop-types';
import React from 'react';

import ButtonComponent from '../../components/ButtonComponent';
import Code from '../../components/CodeBadgeComponent';
import Icon from '../../components/IconComponent';
import ModalComponent from '../../components/ModalComponent';

import {
    codeInspect
} from '../../icons';

import './styles.scss';

class SplashScreenModule extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isModalShown: true
        };
    }

    handleCloseModal = () => {
        const {
            closeCallback
        } = this.props;

        this.setState({
            isModalShown: false
        }, () => {
            closeCallback();
        });
    }

    renderSplashScreenContent = () => (
        <div className={SplashScreenModule.displayName}>
            <div className={`${SplashScreenModule.displayName}__header`}>
                <Icon icon={codeInspect} />
                <h1>Redline Tool V3.1.1</h1>
            </div>
            <p>Yes, we're still here! It has been a while but we've spent time reviewing feature requests for the native inspect tool and have implemented any missing features here. Thanks for your continued usage and support!</p>
            <div className={`${SplashScreenModule.displayName}__scrolling-body`}>
                <h2>What's New?</h2>
                <ul>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Updated browser support</span> - Behind the scenes, we've added better support for usage of the redline tool UI in legacy browsers.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Optimized functionality</span> - We've updated how the tool is built, leveraging the latest software in hopes of delivering a crisp and bug-free experience.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Additional text attributes</span> - We've added the <Code>text-transform</Code> and <Code>letter-spacing</Code> attributes</li>
                </ul>
            </div>
            <ButtonComponent
                label={'Get Started!'}
                onClickCallback={this.handleCloseModal}
            />
        </div>
    );

    render() {
        const {
            isModalShown
        } = this.state;

        return (
            <ModalComponent
                closeModal={this.handleCloseModal}
                isShown={isModalShown}
            >
                {this.renderSplashScreenContent()}
            </ModalComponent>
        );
    }
}

SplashScreenModule.displayName = 'SplashScreenModule';

SplashScreenModule.propTypes = {
    closeCallback: PropTypes.func.isRequired
};

export default SplashScreenModule;
