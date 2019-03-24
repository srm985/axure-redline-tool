import React from 'react';

import ModalComponent from '../../components/ModalComponent';

const displayName = 'SplashScreenModule';

const SplashScreenModule = (props) => {
    const renderSplashScreenContent = () => {
        return (
            <div className={displayName}>

            </div>
        )
    };

    return (
        <ModalComponent>
            {renderSplashScreenContent()}
        </ModalComponent>
    );
};

export default SplashScreenModule;
