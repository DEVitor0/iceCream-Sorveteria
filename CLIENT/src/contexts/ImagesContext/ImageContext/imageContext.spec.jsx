import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import ImageContext from './index';

describe('ImageContext', () => {
  it('provides the context value to consumers', () => {
    const TestComponent = () => {
      const contextValue = useContext(ImageContext);
      return <div>{contextValue ? 'Context Provided' : 'No Context'}</div>;
    };

    render(
      <ImageContext.Provider value="test-value">
        <TestComponent />
      </ImageContext.Provider>,
    );

    expect(screen.getByText('Context Provided')).toBeInTheDocument();
  });

  it('provides a default value when not provided a value', () => {
    const TestComponent = () => {
      const contextValue = useContext(ImageContext);
      return <div>{contextValue ? 'Context Provided' : 'No Context'}</div>;
    };

    render(<TestComponent />);

    expect(screen.getByText('No Context')).toBeInTheDocument();
  });
});
