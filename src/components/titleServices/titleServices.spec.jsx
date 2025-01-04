import { render, screen } from '@testing-library/react';
import TitleServices from './index';

describe('TitleServices Component', () => {
  it('renders the TitleServices with text correctly', () => {
    render(<TitleServices text="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies "looking-services" class when id is provided', () => {
    render(<TitleServices id="test-id" text="Test Title" />);
    expect(screen.getByText('Test Title')).toHaveClass('looking-services');
  });

  it('does not apply "looking-services" class when id is not provided', () => {
    render(<TitleServices text="Test Title" />);
    expect(screen.getByText('Test Title')).not.toHaveClass('looking-services');
  });

  it('renders with the correct id attribute', () => {
    render(<TitleServices id="test-id" text="Test Title" />);
    expect(screen.getByText('Test Title')).toHaveAttribute('id', 'test-id');
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<TitleServices text="Test Title" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
