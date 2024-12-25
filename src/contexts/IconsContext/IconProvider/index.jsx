import React from 'react';
import PropTypes from 'prop-types';
import IconContext from '../IconContext/index';
import icons from '../../../styles/icons/fontawesome';

const IconProvider = ({ children }) => {
  if (!children) {
    throw new Error('IconProvider requires a children');
  }

  return <IconContext.Provider value={icons}>{children}</IconContext.Provider>;
};

IconProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IconProvider;
