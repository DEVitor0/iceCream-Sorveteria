import { render, screen } from '@testing-library/react';
import Title from './index';

describe('Title Component', () => {
  test('renders the correct text and matches snapshot', () => {
    const { asFragment } = render(<Title />);

    const titleElement = screen.getByText(/Escolha sua sobremesa/i);
    expect(titleElement).toBeInTheDocument();

    const emphasisElement = screen.getByText(/favorita/i);
    expect(emphasisElement).toBeInTheDocument();

    expect(titleElement).toHaveClass('main-screen__container__texts__title');

    expect(asFragment()).toMatchSnapshot();
  });

  test('applies the correct class when id is passed', () => {
    const { container } = render(<Title id="test-id" />);
    const divElement = container.querySelector('#test-id');
    expect(divElement).toHaveClass('looking-main');
  });

  test('does not apply the class when no id is passed', () => {
    render(<Title />);
    const divElement = screen.getByText(/Escolha sua sobremesa/i).parentElement;
    expect(divElement).not.toHaveClass('looking-main');
  });
});
