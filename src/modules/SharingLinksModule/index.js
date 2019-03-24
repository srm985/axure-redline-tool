import PropTypes from 'prop-types';
import React from 'react';

import InputComponent from '../../components/InputComponent';
import ModalComponent from '../../components/ModalComponent';
import ButtonComponent from '../../components/ButtonComponent';

import './styles.scss';

const displayName = 'SharingLinksModule';

const SharingLinksModule = (props) => {
    const {
        isShown,
        moduleCloseCallback
    } = props;

    const generateSharingLinks = () => {
        const disableAnnotations = 'fn=0';
        const pageBaseURL = window.parent.location.href;
        const regexBaseURL = /^.*(\/|\.html)/;

        let businessURL = '';
        let devURL = '';

        // Ensure we always select the PAGES tab.
        const selectHomePage = (pageURL) => pageURL.replace(/g=\d&/, 'g=1&');

        // Extract our base URL up until last forward slash found or .html extension.
        const extractedBaseURL = () => {
            let extractedURL = '';

            try {
                [
                    extractedURL
                ] = pageBaseURL.match(regexBaseURL);
            } catch (err) {
                extractedURL = '';
            }

            return extractedURL;
        };

        businessURL = pageBaseURL.replace(extractedBaseURL(), `${extractedBaseURL()}?redline=business`);
        businessURL = `${businessURL}&${disableAnnotations}`;
        businessURL = selectHomePage(businessURL);

        devURL = pageBaseURL.replace(extractedBaseURL(), `${extractedBaseURL()}?redline=dev`);
        devURL = selectHomePage(devURL);

        return ({
            businessURL,
            devURL
        });
    };

    const {
        businessURL,
        devURL
    } = generateSharingLinks();

    const renderModalBody = (
        <div className={`${displayName}__modal-block`}>
            <h1>Sharing Links</h1>
            <InputComponent
                hasBorder
                inputValue={devURL}
                label={'Share With Developers'}
                noFormat
            />
            <InputComponent
                hasBorder
                inputValue={businessURL}
                label={'Share With Business'}
                noFormat
            />
            <ButtonComponent
                label={'Done'}
                onClickCallback={moduleCloseCallback}
            />
        </div>
    );

    return (
        <div className={displayName}>
            <ModalComponent
                closeModal={moduleCloseCallback}
                isShown={isShown}
            >
                {renderModalBody}
            </ModalComponent>
        </div>
    );
};

SharingLinksModule.propTypes = {
    isShown: PropTypes.bool.isRequired,
    moduleCloseCallback: PropTypes.func.isRequired
};

export default SharingLinksModule;
