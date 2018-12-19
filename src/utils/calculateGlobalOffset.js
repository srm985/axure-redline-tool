const calculateGlobalOffset = (element) => {
    const {
        height: scaledHeight,
        left: scaledLeft,
        top: scaledTop,
        width: scaledWidth
    } = element.getBoundingClientRect();

    const {
        pageXOffset,
        pageYOffset
    } = window;

    const scaledOffsetLeft = scaledLeft + pageXOffset;
    const scaledOffsetTop = scaledTop + pageYOffset;


    return ({
        scaledHeight,
        scaledOffsetLeft,
        scaledOffsetTop,
        scaledWidth
    });
};

export default calculateGlobalOffset;
