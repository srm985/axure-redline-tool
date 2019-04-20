import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

const CodeBadgeComponent = (props) => {
    const {
        children
    } = props;

    return (
        <code className={CodeBadgeComponent.displayName}>{children}</code>
    );
};

CodeBadgeComponent.displayName = 'CodeBadgeComponent';

CodeBadgeComponent.propTypes = {
    children: PropTypes.node.isRequired
};

export default CodeBadgeComponent;
