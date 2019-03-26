import $ from 'jquery';

/**
 * We invoke this function to handle document scrolling. This is useful
 * after artboard sizing or when zooming.
 *
 * @param {object} scrollValues
 */
const scrollDocument = (scrollValues) => {
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
        zoomWrapperPadding
    } = dimensions;

    const left = zoomWrapperPadding - (($(window).innerWidth() - artboardWidth) / 2);
    const top = zoomWrapperPadding - (($(window).innerHeight() - artboardHeight) / 2);

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
    if ($('#base').css('background-color') === 'transparent' || $('#base').css('background-color').search(/rgba\(\d+,\s\d+,\s\d+,\s0\)/) >= 0) {
        $('#base').css('background-color', '#FFFFFF');
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

        // Only proceed if we're actually dealing with the inspect tool.
        if (hasNativeInspectTool) {
            const setiFrameAttributes = () => {
                const {
                    clientHeight,
                    clientWidth,
                    scrollHeight,
                    scrollWidth
                } = htmlDocument;

                // The native inspect tool keeps changing these on resize or tab toggle.
                clipFrameScroll.style.overflow = 'hidden';
                document.body.style.overflow = 'auto';
                iFrame.style.height = '100%';
                iFrame.style.minWidth = '100%';
                iFrame.style.width = '100%';

                // Recenter the artboard after resizing or switching tabs - caused by AxShare Inspect.
                scrollDocument({
                    left: (scrollWidth - clientWidth) / 2,
                    top: (scrollHeight - clientHeight) / 2
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

            // On resize events, we need to correct some things AxShare does.
            window.addEventListener('resize', (event) => {
                event.preventDefault();

                setTimeout(() => {
                    setiFrameAttributes();
                }, 0);
            });
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
