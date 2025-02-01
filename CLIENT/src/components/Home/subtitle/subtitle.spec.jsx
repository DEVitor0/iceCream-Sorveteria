import { render, screen } from '@testing-library/react';
import Subtitle from './index';
import '@testing-library/jest-dom';

describe('Subtitle Component', () => {
  const mockProps = {
    id: 'services-subtitle',
    text: 'Serviços',
  };

  test('should match the snapshot', () => {
    const { asFragment } = render(<Subtitle {...mockProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the correct text and id', () => {
    render(<Subtitle {...mockProps} />);

    const subtitleElement = screen.getByText(mockProps.text);
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement).toHaveAttribute('id', mockProps.id);
  });
});
