import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Text from './index';

describe('Text Component', () => {
  it('renders the text correctly', () => {
    const { asFragment } = render(<Text text="Sample Text" fontSize={18} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('applies the correct font size', () => {
    const { asFragment } = render(<Text text="Sample Text" fontSize={24} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('applies the class name from imported styles', () => {
    const { asFragment } = render(<Text text="Sample Text" fontSize={18} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
