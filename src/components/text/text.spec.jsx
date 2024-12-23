import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Text from './Text';

describe('Text Component', () => {
  it('renders the text correctly', () => {
    render(<Text text="Sample Text" fontSize={18} />);
    const paragraph = screen.getByText('Sample Text');
    expect(paragraph).toBeInTheDocument();
  });

  it('applies the correct font size', () => {
    render(<Text text="Sample Text" fontSize={24} />);
    const paragraph = screen.getByText('Sample Text');
    expect(paragraph).toHaveStyle('font-size: 24px');
  });

  it('applies the class name from imported styles', () => {
    render(<Text text="Sample Text" fontSize={18} />);
    const paragraph = screen.getByText('Sample Text');
    expect(paragraph).toHaveClass('paragraph');
  });
});
