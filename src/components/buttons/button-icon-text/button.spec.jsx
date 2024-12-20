import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import ButtonIconText from './ButtonIconText';

describe('ButtonIconText Component', () => {
  it('renders the text and icon correctly', () => {
    render(<ButtonIconText text="Click Me" icon={faCoffee} />);

    const textElement = screen.getByText('Click Me');
    expect(textElement).toBeInTheDocument();

    const iconElement = screen.getByTestId('svg-inline--fa');
    expect(iconElement).toBeInTheDocument();
  });

  it('has proper class names for styling', () => {
    render(<ButtonIconText text="Styled Button" icon={faCoffee} />);

    const container = screen
      .getByText('Styled Button')
      .closest('.btn-container');
    expect(container).toHaveClass('btn-container');

    const textContainer = container.querySelector('.btn-container__text');
    expect(textContainer).toBeInTheDocument();

    const iconContainer = container.querySelector('.btn-container__icon');
    expect(iconContainer).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <ButtonIconText text="Snapshot Test" icon={faCoffee} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
