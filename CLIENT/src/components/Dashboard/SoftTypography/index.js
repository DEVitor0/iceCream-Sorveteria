import { forwardRef } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// Custom styles for SoftTypography
import SoftTypographyRoot from './SoftTypographyRoot';

const SoftTypography = forwardRef(
  (
    {
      color,
      fontWeight,
      textTransform,
      verticalAlign,
      textGradient,
      opacity,
      children,
      ...rest
    },
    ref,
  ) => (
    <SoftTypographyRoot
      {...rest}
      ref={ref}
      ownerState={{
        color,
        textTransform,
        verticalAlign,
        fontWeight,
        opacity,
        textGradient,
      }}
    >
      {children}
    </SoftTypographyRoot>
  ),
);

// Setting default values for the props of SoftTypography
SoftTypography.defaultProps = {
  color: 'dark',
  fontWeight: false,
  textTransform: 'none',
  verticalAlign: 'unset',
  textGradient: false,
  opacity: 1,
};

// Typechecking props for the SoftTypography
SoftTypography.propTypes = {
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'text',
    'white',
  ]),
  fontWeight: PropTypes.oneOf([false, 'light', 'regular', 'medium', 'bold']),
  textTransform: PropTypes.oneOf([
    'none',
    'capitalize',
    'uppercase',
    'lowercase',
  ]),
  verticalAlign: PropTypes.oneOf([
    'unset',
    'baseline',
    'sub',
    'super',
    'text-top',
    'text-bottom',
    'middle',
    'top',
    'bottom',
  ]),
  textGradient: PropTypes.bool,
  children: PropTypes.node.isRequired,
  opacity: PropTypes.number,
};

export default SoftTypography;
