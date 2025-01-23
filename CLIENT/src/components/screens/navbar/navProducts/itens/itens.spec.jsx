import React from 'react';
import { render } from '@testing-library/react';
import NavProducts from './index';

describe('NavProducts Component', () => {
  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <NavProducts icon="test-icon.png" text="Test Product" alt="Test Icon" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
