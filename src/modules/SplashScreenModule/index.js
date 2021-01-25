import PropTypes from 'prop-types';
import React from 'react';

import ButtonComponent from '../../components/ButtonComponent';
import Code from '../../components/CodeBadgeComponent';
import Icon from '../../components/IconComponent';
import ModalComponent from '../../components/ModalComponent';

import {
    artboard,
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
                <h1>Redline Tool V3.1.0</h1>
            </div>
            <p>Based on your great feedback, feature requests, and identified bugs, we've made some great updates to the tool.</p>
            <div className={`${SplashScreenModule.displayName}__scrolling-body`}>
                <h2>What's New?</h2>
                <ul>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Corrected CSS Color Name Matching</span> - The Redline Tool supports the use of CSS color names in lieu of hex/RGB values. The matching algorithm which displays the swatch for the given color was partially matching other words. This meant if the field value was <Code>bored</Code>, a <Code>red</Code> color swatch was applied.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Added Modal Inspection Support</span> - Modals or other elements which break out of the normal page flow were being incorrectly read by the tool. From a technical aspect, this was occurring on elements with <Code>position: fixed;</Code>.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Border Color Shown With No Border</span> - On text blocks, the tool was reading a <Code>border-color</Code>, without a border style being defined. There is no reason to display this attribute without a <Code>border-style</Code> defined.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Text Shadow Attribute</span> - Added the CSS attribute of <Code>text-shadow</Code> to the list.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Enhanced Support For Individual Word Styling</span> - If you attempted to style one word differently within a text block by applying, for example, a different color or font weight, this would cause the styled word to break out of the text block. From a technical perspective, this occurred because we were setting <Code>&lt;span&gt;</Code> elements to <Code>display: inline-block;</Code>. This was done so we could accurately measure their height, width, and position. Now for these elements, we won't show a height, width, or position because it conveys no information. We instead select the parent container which is typically a <Code>&lt;p&gt;</Code> tag.</li>
                    <li><span className={`${SplashScreenModule.displayName}--highlight`}>Disable Artboard Concept</span> - The redline tool attempts to mimic the concept of an artboard used in many other tools. This is represented as a floating, semi-opaque, centered board. Some users have very large documents or do not prefer this concept. As such, this feature may now be toggled by clicking the icon: <Icon icon={artboard} /></li>
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
