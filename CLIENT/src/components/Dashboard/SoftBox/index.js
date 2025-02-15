import { forwardRef } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// Custom styles for SoftBox
import SoftBoxRoot from 'components/SoftBox/SoftBoxRoot';

const SoftBox = forwardRef(
  (
    { variant, bgColor, color, opacity, borderRadius, shadow, ...rest },
    ref,
  ) => (
    <SoftBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow }}
    />
  ),
);

// Setting default values for the props of SoftBox
SoftBox.defaultProps = {
  variant: 'contained',
  bgColor: 'transparent',
  color: 'dark',
  opacity: 1,
  borderRadius: 'none',
  shadow: 'none',
};

// Typechecking props for the SoftBox
SoftBox.propTypes = {
  variant: PropTypes.oneOf(['contained', 'gradient']),
  bgColor: PropTypes.string,
  color: PropTypes.string,
  opacity: PropTypes.number,
  borderRadius: PropTypes.string,
  shadow: PropTypes.string,
};

export default SoftBox;
