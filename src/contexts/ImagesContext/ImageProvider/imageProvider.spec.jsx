import { render, screen } from '@testing-library/react';
import ImageProvider from './index';
import ImageContext from '../ImageContext/index';
import { useContext } from 'react';

describe('ImageProvider Component', () => {
  it('throws an error if no children are provided', () => {
    expect(() => render(<ImageProvider />)).toThrow(
      'IconProvider requires a children',
    );
  });

  it('renders children when passed', () => {
    const { asFragment } = render(
      <ImageProvider>
        <div>Test Child</div>
      </ImageProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('provides the image context value to the children', () => {
    const TestComponent = () => {
      const contextValue = useContext(ImageContext);
      return (
        <div>{contextValue ? 'Has Image Context' : 'No Image Context'}</div>
      );
    };

    const { asFragment } = render(
      <ImageProvider>
        <TestComponent />
      </ImageProvider>,
    );
    expect(screen.getByText('Has Image Context')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
