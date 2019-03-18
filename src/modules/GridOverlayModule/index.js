import PropTypes from 'prop-types';
import React from 'react';

import { gridLayouts } from './config';

import './styles.scss';

const className = 'GridOverlayModule';

const GridOverlayModule = (props) => {
    const {
        artboardWidth,
        gridLayout
    } = props;

    const {
        [gridLayout]: {
            breakpoints = [],
            columns,
            gutterWidth
        } = {}
    } = gridLayouts;

    const containerWidth = () => {
        let width = artboardWidth;

        breakpoints.forEach((breakpoint) => {
            const {
                // If no max width, it's 100% i.e. artboard width.
                maxWidth = artboardWidth,
                viewportWidth
            } = breakpoint;

            if (artboardWidth >= viewportWidth) {
                width = maxWidth;
            }
        });

        return width;
    };

    const renderColumns = () => {
        const markupBlock = [];

        const columnWidth = (containerWidth() - (gutterWidth * (columns - 1))) / 12;
        const margin = gutterWidth / 2;

        for (let i = 0; i < columns; i++) {
            markupBlock.push(
                <div
                    className={`${className}__container--column`}
                    key={i}
                    style={{
                        marginLeft: margin,
                        marginRight: margin,
                        width: columnWidth
                    }}
                />
            );
        }

        return markupBlock;
    };

    const containerStyles = {
        maxWidth: containerWidth()
    };

    return (
        <>
            {
                gridLayout
                && (
                    <div className={className}>
                        <div
                            className={`${className}__container`}
                            style={containerStyles}
                        >
                            {renderColumns()}
                        </div>
                    </div>
                )
            }
        </>
    );
};

GridOverlayModule.propTypes = {
    artboardWidth: PropTypes.number.isRequired,
    gridLayout: PropTypes.string.isRequired
};

export default GridOverlayModule;
