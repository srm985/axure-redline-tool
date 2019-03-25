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

const removeInspectTool = () => {
    console.log('here');
    const setiFrameAttributes = () => {
        const iFrame = parent.document.querySelector('#mainFrame');
        const clipFrameScroll = parent.document.querySelector('#clipFrameScroll');
        const artboardWrapper = document.querySelector('.ArtboardModule');
        const artboard = document.querySelector('.ArtboardModule__artboard');
        const html = document.documentElement;

        iFrame.style.width = '100vw';
        iFrame.style.minWidth = '100vw';
        iFrame.style.height = '100vh';

        clipFrameScroll.style.overflow = 'hidden';
        console.log('width:', artboardWrapper.offsetWidth, artboard.getBoundingClientRect().width, 'height:', artboardWrapper.offsetHeight, artboard.getBoundingClientRect().height);

        html.scrollTo((artboardWrapper.offsetWidth - artboard.getBoundingClientRect().width) / 2, (artboardWrapper.offsetHeight - artboard.getBoundingClientRect().height) / 2);
    };

    setiFrameAttributes();

    window.addEventListener('resize', (event) => {
        console.log('fired!!!');
        event.preventDefault();

        setTimeout(() => {
            setiFrameAttributes();
        }, 0);
    });

    const sidebar = parent.document.querySelector('#handoffHost');
    sidebar.parentNode.removeChild(sidebar);

    const rsplitbar = parent.document.querySelector('#rsplitbar');
    rsplitbar.parentNode.removeChild(rsplitbar);

    const handoffMarkupContainer = parent.document.querySelector('#handoffMarkupContainer');
    handoffMarkupContainer.parentNode.removeChild(handoffMarkupContainer);
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
