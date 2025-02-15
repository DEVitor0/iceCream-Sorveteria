import typography from 'assets/theme/base/typography';
import borders from 'assets/theme/base/borders';

// Soft UI Dashboard React Helper Functions
import pxToRem from 'assets/theme/functions/pxToRem';

const { fontWeightBold, size } = typography;
const { borderRadius } = borders;

const root = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: size.xs,
  fontWeight: fontWeightBold,
  borderRadius: borderRadius.md,
  padding: `${pxToRem(12)} ${pxToRem(24)}`,
  lineHeight: 1.4,
  textAlign: 'center',
  textTransform: 'uppercase',
  userSelect: 'none',
  backgroundSize: '150% !important',
  backgroundPositionX: '25% !important',
  transition: `all 150ms ease-in`,

  '&:hover': {
    transform: 'scale(1.02)',
  },

  '&:disabled': {
    pointerEvent: 'none',
    opacity: 0.65,
  },

  '& .material-icons': {
    fontSize: pxToRem(15),
    marginTop: pxToRem(-2),
  },
};

export default root;
