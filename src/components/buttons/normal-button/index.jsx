import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const NormalButton = ({ children }) => {
  return <button className="normal-button">{children}</button>;
};

NormalButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NormalButton;
