import React from 'react';
import { render } from '@testing-library/react';
import IconProvider from './index';
import IconContext from '../IconContext/index';
import icons from '../../../styles/icons/fontawesome';

describe('IconProvider', () => {
  it('renders children correctly', () => {
    const { getByText, asFragment } = render(
      <IconProvider>
        <div>Inner content</div>
      </IconProvider>,
    );
    expect(getByText('Inner content')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('provides the correct context value', () => {
    const TestComponent = () => (
      <IconContext.Consumer>
        {(value) => (
          <span>{value === icons ? 'Context provided' : 'Context error'}</span>
        )}
      </IconContext.Consumer>
    );

    const { getByText, asFragment } = render(
      <IconProvider>
        <TestComponent />
      </IconProvider>,
    );

    expect(getByText('Context provided')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('throws an error if children are not provided', () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<IconProvider />)).toThrow(/children/);

    console.error = originalConsoleError;
  });
});
