import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const displayName = 'IconComponent';

const IconComponent = (props) => {
    const { icon } = props;

    return (
        <div
            className={displayName}
            dangerouslySetInnerHTML={{ __html: icon }} // eslint-disable-line react/no-danger
        />
    );
};

IconComponent.propTypes = {
    icon: PropTypes.string.isRequired
};

export default IconComponent;
