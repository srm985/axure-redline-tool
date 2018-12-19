const calculateTrueArtboardOffset = (element) => {
    const {
        offsetHeight,
        offsetWidth
    } = element;

    let currentElement = element;
    let trueOffsetLeft = 0;
    let trueOffsetTop = 0;

    while (currentElement.id !== 'base') {
        const {
            offsetLeft,
            offsetParent,
            offsetTop
        } = currentElement;

        trueOffsetLeft += offsetLeft;
        trueOffsetTop += offsetTop;

        currentElement = offsetParent;
    }

    return ({
        trueHeight: offsetHeight,
        trueOffsetLeft,
        trueOffsetTop,
        trueWidth: offsetWidth
    });
};

export default calculateTrueArtboardOffset;
