import PropTypes from 'prop-types';
import React from 'react';

const SVG_SCALE = 50;
const VIEWBOX = `0 0 ${SVG_SCALE} ${SVG_SCALE}`;

const displayName = 'IconComponent';

const IconComponent = (props) => {
    const {
        fill = 'currentColor',
        height,
        path,
        width
    } = props;

    return (
        <svg
            className={displayName}
            dangerouslySetInnerHTML={{ __html: path }} // eslint-disable-line react/no-danger
            fill={fill}
            height={height}
            viewBox={VIEWBOX}
            width={width}
        />
    );
};

IconComponent.propTypes = {
    fill: PropTypes.string,
    height: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
};

IconComponent.defaultProps = {
    fill: 'currentColor'
};

export default IconComponent;
