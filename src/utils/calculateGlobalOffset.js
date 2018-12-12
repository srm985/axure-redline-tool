const calculateGlobalOffset = (element) => {
    const {
        height: trueHeight,
        left,
        top,
        width: trueWidth
    } = element.getBoundingClientRect();

    const {
        pageXOffset,
        pageYOffset
    } = window;

    const offsetLeft = left + pageXOffset;
    const offsetTop = top + pageYOffset;

    return ({
        offsetLeft,
        offsetTop,
        trueHeight,
        trueWidth
    });
};

export default calculateGlobalOffset;
