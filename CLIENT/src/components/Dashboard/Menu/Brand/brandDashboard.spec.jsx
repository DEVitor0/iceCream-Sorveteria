import { render, screen } from '@testing-library/react';
import Brand from './Brand';

describe('Brand Component', () => {
  test('renders the image with correct src and alt attributes', () => {
    const imageUrl = 'https://example.com/image.png';
    const altText = 'Brand Logo';

    render(<Brand image={imageUrl} alt={altText} />);

    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', imageUrl);
    expect(imageElement).toHaveAttribute('alt', altText);
  });
});
