import React from 'react';
import { render } from '@testing-library/react';
import IconContext from './index';

test('checks if IconContext is a valid context', () => {
  const { asFragment } = render(
    <IconContext.Provider value={{ icon: 'home' }}>
      <div />
    </IconContext.Provider>,
  );
  expect(asFragment()).toMatchSnapshot();
});
