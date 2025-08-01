import { styled } from '@mui/material/styles';

export default styled('span')(({ theme }) => {
  const { palette, typography, functions, transitions } = theme;

  const { white } = palette;
  const { size, fontWeightMedium } = typography;
  const { pxToRem } = functions;

  return {
    color: white.main,
    fontSize: size.xl,
    padding: `${pxToRem(9)} ${pxToRem(6)} ${pxToRem(8)}`,
    marginLeft: pxToRem(40),
    fontWeight: fontWeightMedium,
    opacity: 0.5,
    cursor: 'pointer',
    lineHeight: 0,
    transition: transitions.create('opacity', {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.shorter,
    }),

    '&:hover': {
      opacity: 1,
    },
  };
});
