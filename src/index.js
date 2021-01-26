import React from 'react';
import ReactDOM from 'react-dom';

import InspectView from './views/InspectView';

import './styles.scss';

// We generate our own container.
const appendNode = () => {
    const containerName = 'redline-tool';

    // See if we already have the container on the page.
    let containerNode = document.getElementById(containerName);

    return new Promise((resolve) => {
        if (!containerNode) {
            // Create our own container and add an ID for tracking.
            containerNode = document.createElement('div');
            containerNode.id = containerName;

            new Promise((resolveInner) => {
                const attemptAppendNodeInterval = setInterval(() => {
                    try {
                        document.body.appendChild(containerNode);

                        clearInterval(attemptAppendNodeInterval);

                        resolveInner();
                    } catch (error) {
                        // If the page isn't ready yet, this fails.
                    }
                }, 10);
            }).then(() => {
                const checkNodeAppendedInterval = setInterval(() => {
                    const foundContainerNode = document.getElementById(containerName);

                    // We keep checking until we find the container on the page.
                    if (foundContainerNode) {
                        clearInterval(checkNodeAppendedInterval);

                        resolve(foundContainerNode);
                    }
                }, 10);
            });
        } else {
            resolve(containerNode);
        }
    });
};

appendNode().then((container) => {
    /**
     * This is a weird check we have to do in dev environments. BrowserSync injection
     * match first matches the <head> of the whole page and then the <head> of the
     * iframe so we would end up rendering twice. In AxShare, the whole page <head>
     * has the class "hashover".
     */
    const canRender = !container.parentNode.classList.contains('hashover');

    if (canRender) {
        ReactDOM.render(
            <InspectView />,
            container
        );

        const {
            hot
        } = module;

        if (hot) {
            hot.accept();
        }
    }
});
