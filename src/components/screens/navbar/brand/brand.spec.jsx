import { render, screen } from '@testing-library/react';
import Brand from './index';
import brandImage from '../../../../styles/images/navbar/brand.png';

describe('Brand Component', () => {
  it('renders without crashing', () => {
    render(<Brand />);
  });

  it('renders an image element', () => {
    render(<Brand />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
  });

  it('sets the correct src attribute for the image', () => {
    render(<Brand />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', brandImage);
  });

  it('sets the correct alt attribute for the image', () => {
    render(<Brand />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('alt', 'brand');
  });

  it('applies the correct class to the image', () => {
    render(<Brand />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveClass('header-bar__inner__image');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Brand />);
    expect(asFragment()).toMatchSnapshot();
  });
});
