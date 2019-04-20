import $ from 'jquery';

/**
 * We invoke this function to handle document scrolling. This is useful
 * after artboard sizing or when zooming.
 *
 * @param {object} scrollValues
 */
export const scrollDocument = (scrollValues) => {
    const {
        left,
        top
    } = scrollValues;

    $('html, body').scrollTop(top);
    $('html, body').scrollLeft(left);
};

/**
 * We invoke this function to correctly center our artboard after
 * we have sized it and our wrapper.
 *
 * @param {Object} dimensions
 */
export const scrollCenterArtboard = (dimensions) => {
    const {
        artboardHeight,
        artboardWidth,
        documentZoom = 100,
        zoomWrapperPadding
    } = dimensions;

    const zoomMultiplier = documentZoom / 100;

    const left = zoomWrapperPadding - (($(window).innerWidth() - (artboardWidth * zoomMultiplier)) / 2);
    const top = zoomWrapperPadding - (($(window).innerHeight() - (artboardHeight * zoomMultiplier)) / 2);

    scrollDocument({
        left,
        top
    });
};

/**
 * We invoke this function to recenter our artboard after zooming to
 * keep our zooms looking smooth.
 *
 * @param {object} dimensions
 */
export const calculateScrollAfterZoom = (dimensions) => {
    const {
        artboardHeight,
        artboardWidth,
        documentZoom,
        previousZoom
    } = dimensions;

    const bodyScrollTop = $('body').scrollTop() === 0 ? $('html').scrollTop() : $('body').scrollTop();
    const bodyScrollLeft = $('body').scrollLeft() === 0 ? $('html').scrollLeft() : $('body').scrollLeft();

    const top = bodyScrollTop + ((((artboardHeight) * (documentZoom / 100)) - (artboardHeight * (previousZoom / 100))) / 2);
    const left = bodyScrollLeft + ((((artboardWidth) * (documentZoom / 100)) - (artboardWidth * (previousZoom / 100))) / 2);

    scrollDocument({
        left,
        top
    });
};

/**
 * If our base wrapper doesn't already have a background color set,
 * we'll go ahead and set it as white.
 */
const styleArtboardBase = () => {
    const backgroundColor = window.getComputedStyle(document.querySelector('body')).getPropertyValue('background-color');
    const baseArtboard = document.querySelector('#base');

    // If the user set a specific background color, use it.
    if (!(backgroundColor === 'transparent' || backgroundColor.match(/rgba\(\d+,\s\d+,\s\d+,\s0\)/))) {
        $('#base').css('background-color', 'rgba(255, 255, 255, 0.2)');
        baseArtboard.style.backgroundColor = backgroundColor;
    }
};

/**
 * This function attempts to strip out the native inspect tool
 * and to intercept any events fired by the tool, especially
 * when switching from preview/inspect tabs. It's some weird
 * logic, I know...
 */
const removeInspectTool = () => {
    try {
        const clipFrameScroll = window.parent.document.querySelector('#clipFrameScroll');
        const htmlDocument = document.documentElement;
        const iFrame = window.parent.document.querySelector('#mainFrame');

        // Native Inspect Tool Elements
        const handoffMarkupContainer = window.parent.document.querySelector('#handoffMarkupContainer');
        const rsplitbar = window.parent.document.querySelector('#rsplitbar');
        const sidebar = window.parent.document.querySelector('#handoffHost');

        const hasNativeInspectTool = !!handoffMarkupContainer;

        let lastScrollPosition = {};

        const initScrollPosition = () => new Promise((resolve) => {
            /**
             * In some RP9 projects without the native inspect tool, we
             * sometimes measure scroll values before the whole artboard
             * is rendered correctly and we'll get 0. We have to wait
             * until it's loaded before proceeding.
             */
            const waitScrollEstablished = setInterval(() => {
                const {
                    clientHeight,
                    clientWidth,
                    scrollHeight,
                    scrollWidth
                } = htmlDocument;

                // Default Scroll Positions - Artboard Centered
                const scrollLeft = (scrollWidth - clientWidth) / 2;
                const scrollTop = (scrollHeight - clientHeight) / 2;

                // Once we have a correctly rendered artboard, proceed.
                if (scrollLeft && scrollTop) {
                    clearInterval(waitScrollEstablished);

                    lastScrollPosition = {
                        scrollLeft,
                        scrollTop
                    };

                    scrollDocument({
                        left: scrollLeft,
                        top: scrollTop
                    });

                    resolve();
                }
            }, 10);
        });

        initScrollPosition().then(() => {
            window.addEventListener('scroll', () => {
                const {
                    scrollLeft,
                    scrollTop
                } = htmlDocument;

                const SCROLL_DEVIATION = 50;

                const {
                    scrollLeft: scrollLeftPrevious,
                    scrollTop: scrollTopPrevious
                } = lastScrollPosition;

                /**
                 * Here we're checking to see if it's a natural scroll
                 * performed by the user or if AxShare is causing the
                 * document to scroll to the top left. If it's natural,
                 * we record it.
                 */
                if ((scrollLeft === 0 && scrollLeftPrevious - scrollLeft < SCROLL_DEVIATION) || scrollLeft !== 0) {
                    lastScrollPosition.scrollLeft = scrollLeft;
                }
                if ((scrollTop === 0 && scrollTopPrevious - scrollTop < SCROLL_DEVIATION) || scrollTop !== 0) {
                    lastScrollPosition.scrollTop = scrollTop;
                }
            });

            /**
             * Listen for resize event and scroll back to last known position
             * otherwise we'll end up jumping to the top left corner because
             * of something in AxShare RP9 projects.
             */
            window.addEventListener('resize', () => {
                const {
                    scrollLeft,
                    scrollTop
                } = lastScrollPosition;

                scrollDocument({
                    left: scrollLeft,
                    top: scrollTop
                });
            });
        });

        // Only proceed if we're actually dealing with the inspect tool.
        if (hasNativeInspectTool) {
            const setiFrameAttributes = () => {
                // The native inspect tool keeps changing these on resize or tab toggle.
                clipFrameScroll.style.overflow = 'hidden';
                document.body.style.overflow = 'auto';
                iFrame.style.height = '100%';
                iFrame.style.minWidth = '100%';
                iFrame.style.width = '100%';

                const {
                    scrollLeft,
                    scrollTop
                } = lastScrollPosition;

                // Recenter the artboard after resizing or switching tabs - caused by AxShare Inspect.
                scrollDocument({
                    left: scrollLeft,
                    top: scrollTop
                });
            };

            const extractCurrentURL = () => window.parent.location.href;

            setiFrameAttributes();

            // We're deleting all of the elements related to the native inspect tool.
            handoffMarkupContainer.parentNode.removeChild(handoffMarkupContainer);
            rsplitbar.parentNode.removeChild(rsplitbar);
            sidebar.parentNode.removeChild(sidebar);

            // Get URL of parent iFrame.
            let lastCheckedURL = extractCurrentURL();

            setInterval(() => {
                const currentURL = extractCurrentURL();

                // When switching from inspect to preview tab, the URL changes and we need to catch that.
                if (currentURL !== lastCheckedURL) {
                    setiFrameAttributes();

                    lastCheckedURL = currentURL;

                    /**
                     * We have to call this a second time because something is firing
                     * in AxShare. Need to track down what they're up to.
                     */
                    setTimeout(() => {
                        setiFrameAttributes();
                    }, 250);
                }
            }, 100);
        }
    } catch (error) {
        // Just in case these elements aren't on the page.
    }
};

export const injectArtboard = (className) => new Promise((resolve) => {
    const artboard = document.getElementsByClassName(className)[0];

    let loadingTime = 0;

    // Keep checking back until AxShare has loaded.
    const waitBaseRenderInterval = setInterval(() => {
        const base = document.getElementById('base');

        // Track our loading time.
        loadingTime += 50;

        if (base) {
            // Remove traces of native inspect tool.
            removeInspectTool();

            clearInterval(waitBaseRenderInterval);
            artboard.appendChild(base);
            resolve(loadingTime);
        }
    }, 50);
});

export const sizeArtboard = () => new Promise((resolve) => {
    let currentElement;
    let height = 0;
    let hiddenHeight = false;
    let hiddenWidth = false;
    let left = 0;
    let maxHeight = 0;
    let maxWidth = 0;
    let parentElementHorizontal;
    let parentElementVertical;
    let scrollHeightHidden = 0;
    let scrollWidthHidden = 0;
    let top = 0;
    let width = 0;

    $('#base *').not('script, style').each((index, node) => {
        // Capture jQuery reference to node.
        currentElement = $(node);

        if (parentElementHorizontal === undefined && parentElementVertical === undefined) {
            parentElementHorizontal = currentElement;
            parentElementVertical = currentElement;
        }

        width = currentElement.outerWidth();
        height = currentElement.outerHeight();
        scrollWidthHidden = currentElement[0].scrollWidth;
        scrollHeightHidden = currentElement[0].scrollHeight;
        top = currentElement.offset().top; // eslint-disable-line prefer-destructuring
        left = currentElement.offset().left; // eslint-disable-line prefer-destructuring

        // Check if we're still within the parent containing horizontal-scrolling overflow.
        if (!$.contains(parentElementHorizontal[0], currentElement[0])) {
            hiddenWidth = false;
        }

        // Check if we're still within the parent containing vertical-scrolling overflow.
        if (!$.contains(parentElementVertical[0], currentElement[0])) {
            hiddenHeight = false;
        }

        // Check if we've found an element with horizontal-scrolling content.
        if (!hiddenWidth) {
            maxWidth = maxWidth < left + width ? left + width : maxWidth;
        } else if (currentElement.width() > maxWidth) {
            currentElement.addClass('redline-layer');
        }
        if (scrollWidthHidden > width && !hiddenWidth && width > 0) {
            hiddenWidth = true;
            parentElementHorizontal = currentElement;
        }

        // Check if we've found an element with vertical-scrolling content.
        if (!hiddenHeight) {
            maxHeight = maxHeight < top + height ? top + height : maxHeight;
        } else if (currentElement.height() > maxHeight) {
            currentElement.addClass('redline-layer');
        }
        if (scrollHeightHidden > height && !hiddenHeight && height > 0) {
            hiddenHeight = true;
            parentElementVertical = currentElement;
        }
    });

    styleArtboardBase();

    resolve({
        artboardHeight: maxHeight,
        artboardWidth: maxWidth
    });
});
