import { render, screen } from '@testing-library/react';
import Title from './index';

describe('Title Component', () => {
  test('renders the correct text', () => {
    render(<Title />);

    const titleElement = screen.getByText(/Escolha sua sobremesa/i);
    expect(titleElement).toBeInTheDocument();

    const emphasisElement = screen.getByText(/favorita/i);
    expect(emphasisElement).toBeInTheDocument();

    expect(titleElement).toHaveClass('main-screen__container__texts__title');
    expect(emphasisElement).toHaveClass(
      'main-screen__container__texts__title__emphasis',
    );
  });
});
